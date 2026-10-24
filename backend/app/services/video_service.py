import uuid
import shutil
import logging
from pathlib import Path
from typing import Tuple, Dict, Any
from fastapi import UploadFile
from ..config import TEMP_UPLOAD_DIR, MAX_UPLOAD_SIZE_BYTES
from ..utils.video_validation import validate_video_file_metadata, inspect_video_stream

logger = logging.getLogger(__name__)

async def save_upload_file_safely(upload_file: UploadFile, target_dir: Path = TEMP_UPLOAD_DIR) -> Tuple[Path, str, int]:
    """
    Saves an incoming UploadFile to a temporary destination with a safe unique filename.
    Performs streaming chunk writes to guard against memory exhaustion.
    Returns (saved_path, original_filename, total_bytes).
    """
    original_filename = upload_file.filename or "uploaded_video.mp4"
    ext = Path(original_filename).suffix.lower() or ".mp4"
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    target_path = target_dir / unique_filename

    total_bytes = 0
    chunk_size = 1024 * 1024  # 1MB chunks

    try:
        with open(target_path, "wb") as f_out:
            while True:
                chunk = await upload_file.read(chunk_size)
                if not chunk:
                    break
                total_bytes += len(chunk)
                if total_bytes > MAX_UPLOAD_SIZE_BYTES:
                    raise ValueError(f"Uploaded file exceeds {MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)}MB size limit.")
                f_out.write(chunk)
    except Exception as e:
        cleanup_file(target_path)
        raise e

    # Validate metadata
    try:
        validate_video_file_metadata(original_filename, total_bytes)
    except ValueError as val_err:
        cleanup_file(target_path)
        raise val_err

    return target_path, original_filename, total_bytes

def cleanup_file(file_path: Path) -> None:
    """Safely removes a temporary file if it exists."""
    if file_path and file_path.exists():
        try:
            file_path.unlink()
            logger.info("Successfully cleaned up temporary file %s", file_path.name)
        except Exception as e:
            logger.warning("Failed to remove temporary file %s: %s", file_path, e)

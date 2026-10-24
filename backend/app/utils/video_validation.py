from pathlib import Path
from typing import Dict, Any, Tuple
import cv2
from ..config import ALLOWED_EXTENSIONS, MAX_UPLOAD_SIZE_BYTES, MAX_UPLOAD_SIZE_MB

def validate_video_file_metadata(filename: str, file_size: int) -> None:
    """
    Validates file extension and size constraints.
    Raises ValueError with client-friendly message on failure.
    """
    if not filename:
        raise ValueError("Video filename must not be empty.")

    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        allowed_list = ", ".join(sorted(ALLOWED_EXTENSIONS))
        raise ValueError(
            f"Unsupported video format '{ext}'. Allowed formats are: {allowed_list}"
        )

    if file_size > MAX_UPLOAD_SIZE_BYTES:
        size_mb = file_size / (1024 * 1024)
        raise ValueError(
            f"File size exceeds the limit of {MAX_UPLOAD_SIZE_MB}MB (received {size_mb:.1f}MB)."
        )

    if file_size <= 0:
        raise ValueError("Video file is empty (0 bytes).")

def inspect_video_stream(file_path: Path) -> Dict[str, Any]:
    """
    Opens video with OpenCV to verify it can be decoded and extracts stream properties.
    Raises ValueError if video cannot be decoded or has 0 frames.
    """
    if not file_path.exists():
        raise ValueError("Video file was not found on server storage.")

    cap = cv2.VideoCapture(str(file_path))
    if not cap.isOpened():
        cap.release()
        raise ValueError("Could not open video file. The file may be corrupted or encoded in an unsupported codec.")

    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Read at least one frame to confirm actual readability
    ret, frame = cap.read()
    cap.release()

    if not ret or frame is None:
        raise ValueError("Video stream contains no readable frames or is corrupted.")

    if frame_count <= 0:
        frame_count = 1

    duration_seconds = round(frame_count / fps, 2) if fps > 0 else 0.0

    return {
        "is_valid": True,
        "frame_count": frame_count,
        "fps": round(fps, 2),
        "width": width,
        "height": height,
        "duration_seconds": duration_seconds,
    }

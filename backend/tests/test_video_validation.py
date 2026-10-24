import pytest
from pathlib import Path
from app.utils.video_validation import validate_video_file_metadata, inspect_video_stream
from app.config import MAX_UPLOAD_SIZE_BYTES

def test_valid_video_metadata():
    # Valid mp4 file
    validate_video_file_metadata("exercise_squat.mp4", 5 * 1024 * 1024)
    # Valid mov file
    validate_video_file_metadata("rehab_curl.mov", 12 * 1024 * 1024)
    # Valid webm file
    validate_video_file_metadata("knee_flex.webm", 2 * 1024 * 1024)

def test_invalid_video_extension():
    with pytest.raises(ValueError, match="Unsupported video format"):
        validate_video_file_metadata("malicious_script.exe", 1024)

    with pytest.raises(ValueError, match="Unsupported video format"):
        validate_video_file_metadata("document.pdf", 2048)

    with pytest.raises(ValueError, match="Unsupported video format"):
        validate_video_file_metadata("photo.jpg", 4096)

def test_empty_video_file():
    with pytest.raises(ValueError, match="empty"):
        validate_video_file_metadata("empty_file.mp4", 0)

def test_oversized_video_file():
    oversized = MAX_UPLOAD_SIZE_BYTES + 1024
    with pytest.raises(ValueError, match="exceeds the limit"):
        validate_video_file_metadata("huge_video.mp4", oversized)

def test_inspect_missing_file():
    missing = Path("non_existent_video_path_xyz.mp4")
    with pytest.raises(ValueError, match="was not found"):
        inspect_video_stream(missing)

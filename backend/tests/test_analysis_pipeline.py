import pytest
from pathlib import Path
import cv2
import numpy as np
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def create_synthetic_test_video(output_path: Path, num_frames: int = 30, fps: int = 15):
    """Generates a minimal valid MP4 video using OpenCV."""
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(str(output_path), fourcc, fps, (320, 240))
    for i in range(num_frames):
        frame = np.zeros((240, 320, 3), dtype=np.uint8)
        # Draw a moving circle or simple stick-like shape
        cv2.circle(frame, (160, 80 + (i % 20)), 15, (255, 255, 255), -1)
        out.write(frame)
    out.release()

def test_analyze_video_endpoint_valid_video(tmp_path):
    test_video_path = tmp_path / "test_exercise.mp4"
    create_synthetic_test_video(test_video_path, num_frames=20, fps=10)

    assert test_video_path.exists()
    assert test_video_path.stat().st_size > 0

    with open(test_video_path, "rb") as f:
        response = client.post(
            "/api/analyze-video",
            files={"video": ("test_exercise.mp4", f, "video/mp4")},
            data={"exercise_type": "squat", "notes": "Automated synthetic pipeline test"}
        )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "video_info" in data
    assert data["video_info"]["frame_count"] >= 15
    assert data["video_info"]["duration_seconds"] > 0
    assert "analysis" in data
    assert data["analysis"]["exercise_type"] == "squat"
    assert "posture_assessment" in data["analysis"]
    assert "limitations" in data
    assert len(data["limitations"]) >= 1

def test_analyze_video_endpoint_invalid_file(tmp_path):
    fake_file = tmp_path / "corrupted_text.mp4"
    fake_file.write_text("This is plain text, not a valid video stream binary.")

    with open(fake_file, "rb") as f:
        response = client.post(
            "/api/analyze-video",
            files={"video": ("corrupted_text.mp4", f, "video/mp4")},
            data={"exercise_type": "squat"}
        )

    # Must reject corrupted stream with 400 Bad Request
    assert response.status_code == 400
    detail = response.json()["detail"].lower()
    assert "corrupted" in detail or "unsupported" in detail or "codec" in detail

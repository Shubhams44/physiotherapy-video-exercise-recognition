import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Application Info
API_TITLE = "PhysioVision AI Backend"
API_VERSION = "1.0.0"
API_DESCRIPTION = "FastAPI service for physiotherapy movement recognition, kinematic joint angle calculation, and posture analysis from pre-recorded videos."

# Server Config
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", 8001))

# CORS Configuration
# Include Vite frontend development ports (5173, 5174, 5175, 3000)
cors_env = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5175,http://127.0.0.1:5175,http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"
)
CORS_ORIGINS = [origin.strip() for origin in cors_env.split(",") if origin.strip()]

# Upload Limits
MAX_UPLOAD_SIZE_MB = int(os.getenv("MAX_UPLOAD_SIZE_MB", 100))
MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024
ALLOWED_EXTENSIONS = {".mp4", ".mov", ".webm", ".m4v"}

# Temporary Upload Storage
TEMP_UPLOAD_DIR = BASE_DIR / "temp_uploads"
TEMP_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

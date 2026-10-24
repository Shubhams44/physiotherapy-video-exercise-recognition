# PhysioVision AI — FastAPI Backend Service

Asynchronous computer vision backend service for physiotherapy movement recognition, kinematic joint angle calculation, and posture assessment from user-uploaded videos.

---

## 1. Architecture Overview

- **Framework**: FastAPI (Asynchronous Python Web Framework)
- **ASGI Server**: Uvicorn
- **Computer Vision**: OpenCV (`cv2`) for frame extraction and stream validation
- **Pose Landmark Estimation**: Google MediaPipe Pose (33 full-body anatomical keypoints)
- **Kinematic Calculations**: NumPy vector dot product and trigonometry for 2D/3D planar joint angles
- **Validation & Serialization**: Pydantic v2 schemas
- **Testing**: Pytest & HTTPX TestClient

---

## 2. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Service metadata, documentation link, upload limits |
| `GET` | `/health` | Health status probe (`{"status": "online"}`) |
| `GET` | `/api/health` | Health check alias for frontend integration |
| `GET` | `/api/exercises` | List of supported exercise profiles and implementation maturity |
| `POST` | `/api/analyze-video` | Accepts multipart video (`video`), `exercise_type`, and optional `notes` |
| `GET` | `/docs` | Interactive Swagger API documentation |
| `GET` | `/redoc` | ReDoc API specifications |

### `POST /api/analyze-video` Request Format

- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `video` (File, required): MP4, MOV, WebM, or M4V recording (up to 100MB)
  - `exercise_type` (string, required): `squat`, `bicep_curl`, `shoulder_flexion`, `knee_extension`, or `other`
  - `notes` (string, optional): Context notes or rehabilitation observations

---

## 3. Windows Setup & Execution Guide

### Prerequisites
- Windows 10/11
- Python 3.11 recommended (for official prebuilt MediaPipe and OpenCV wheels)

### Step 1: Navigate to Backend Directory
```powershell
cd backend
```

### Step 2: Create and Activate Virtual Environment
```powershell
py -3.11 -m venv .venv
.venv\Scripts\activate
```

### Step 3: Install Required Dependencies
```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables (Optional)
```powershell
copy .env.example .env
```

### Step 5: Start the Development Server
```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- API is accessible at: `http://127.0.0.1:8000`
- Interactive Swagger docs: `http://127.0.0.1:8000/docs`

---

## 4. Running Backend Tests

Run the Pytest test suite:
```powershell
.venv\Scripts\pytest.exe tests -v
```

All unit and integration tests verify:
- Root, health, and exercise endpoints
- Video format and size validation
- OpenCV decoding verification on corrupt/empty files
- Full end-to-end `POST /api/analyze-video` pipeline and temporary file cleanup

---

## 5. Privacy & Engineering Scope

- **No Live Webcam**: This service operates strictly asynchronously on uploaded files.
- **Automated Cleanup**: Temporary video files are stored under `temp_uploads/` with UUID names and immediately deleted upon completion or error.
- **Truthful Assessment**: Uncomputed or occluded joints return explicit limitation notices rather than fabricated estimates.

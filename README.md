# PhysioVision AI

### Recognizing Exercises for Physiotherapy Videos

**PhysioVision AI** is an intelligent, privacy-first computer vision platform designed to analyze pre-recorded physiotherapy exercise recordings. The application detects body landmarks, computes biomechanical joint angles, and provides structured posture assessment and corrective cues.

---

## 1. System Architecture

The platform is structured into two decoupled, modular subsystems:

```
Miniproject10/
├── backend/                  # Python FastAPI Computer Vision Service
│   ├── app/
│   │   ├── api/routes.py     # Endpoints: /, /health, /api/exercises, /api/analyze-video
│   │   ├── services/
│   │   │   ├── video_service.py     # Safe upload streaming, storage, cleanup
│   │   │   ├── pose_service.py      # OpenCV decoding & MediaPipe Pose extraction
│   │   │   └── analysis_service.py  # Kinematic joint angle math & posture assessment
│   │   ├── utils/video_validation.py# File extension, size, and stream checks
│   │   ├── config.py         # Upload thresholds, CORS, and paths
│   │   ├── schemas.py        # Pydantic v2 data models
│   │   └── main.py           # FastAPI app instance and CORS middleware
│   ├── tests/                # Pytest unit and integration test suite
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Backend environment template
│   └── README.md
│
├── src/                      # React 18 + Vite Frontend Application
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation & live FastAPI health probe indicator
│   │   ├── Footer.jsx        # Platform architecture & biomechanical disclaimer
│   │   ├── Button.jsx        # Accessible action buttons with loading states
│   │   ├── Badge.jsx         # Status badges
│   │   ├── VideoUploader.jsx # Drag-and-drop file uploader & recording guidelines
│   │   ├── VideoPreview.jsx  # Native HTML5 player with duration/size metadata
│   │   ├── ExerciseSelector.jsx # Targeted exercise profiles & context notes
│   │   ├── LoadingState.jsx  # 4-stage pipeline progress indicator
│   │   ├── ErrorMessage.jsx  # Diagnostic error alerts & backend quickstart
│   │   ├── MetricCard.jsx    # Quantitative angle & repetition displays
│   │   ├── FeedbackCard.jsx  # Categorized posture observations & corrective cues
│   │   └── PoseSkeletonDemo.jsx # Interactive 33-point SVG skeleton visualizer
│   ├── pages/
│   │   ├── Home.jsx          # Hero section, feature cards, 3-step workflow
│   │   ├── UploadVideo.jsx   # Video selection, preview, and exercise config
│   │   ├── Analysis.jsx      # Video upload pipeline, progress, and error boundary
│   │   ├── Results.jsx       # Assessment summary, Recharts angles, feedback
│   │   └── About.jsx         # Pipeline specs, status matrix, architecture
│   ├── services/api.js       # Axios HTTP client, progress handler, error formats
│   ├── utils/videoValidation.js # Format (MP4/MOV/WebM) and 100MB size checks
│   ├── App.jsx               # React Router layout
│   └── main.jsx
├── .env                      # Frontend environment variable (VITE_API_BASE_URL)
└── package.json
```

---

## 2. Windows Quickstart Guide (Run Both Servers)

Follow these steps to run the application on Windows in two separate PowerShell terminals.

### Terminal 1: Start the Python FastAPI Backend

```powershell
# 1. Navigate to the backend directory
cd backend

# 2. Create Python virtual environment (Python 3.11 recommended for MediaPipe)
py -3.11 -m venv .venv

# 3. Activate the virtual environment
.venv\Scripts\activate

# 4. Install backend dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt

# 5. Start the backend development server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

- **Backend API URL**: `http://127.0.0.1:8001`
- **Interactive Swagger Documentation**: `http://127.0.0.1:8001/docs`
- **ReDoc Documentation**: `http://127.0.0.1:8001/redoc`
- **Health Endpoint**: `http://127.0.0.1:8001/health` or `http://127.0.0.1:8001/api/health`

---

### Terminal 2: Start the React Frontend

Open a **second PowerShell terminal** in the project root (`Miniproject10`):

```powershell
# 1. Install frontend packages (if not already installed)
npm install

# 2. Start Vite frontend dev server
npm run dev
```

- **Frontend URL**: `http://localhost:5175/` (or `http://127.0.0.1:5175/`)

---

## 3. End-to-End User Workflow

1. **Upload Video**:
   - Navigate to **Analyse Video** (`/upload`).
   - Drag and drop or browse for a recorded exercise video (`.mp4`, `.mov`, `.webm`, up to 100MB).
   - Review file size, duration, and native video player preview.
2. **Select Exercise Profile**:
   - Choose the performed exercise: **Squat**, **Bicep Curl**, **Shoulder Flexion**, **Knee Extension**, or **Other**.
   - Optional: Enter rehabilitation context or patient notes.
3. **Run AI Analysis**:
   - Click **Analyse Video**.
   - The frontend streams the video via `multipart/form-data` to `POST /api/analyze-video`.
   - The UI displays a multi-stage loading progress indicator (Upload → Pose Detection → Angle Math → Feedback).
4. **Review Results**:
   - **Movement Summary**: Recognized exercise and overall form rating.
   - **Biomechanical Metrics**: Peak knee flexion, trunk forward lean, hip flexion, and repetition counts.
   - **Progression Chart**: Recharts interactive timeline showing joint angle trajectories across the video.
   - **Posture Feedback**: Correct movement observations, detected form compensations, and actionable rehabilitation cues.
   - **Video Review**: Original uploaded video playback.
   - **Explicit Scope Limitations**: Truthful notes regarding camera angles and landmark visibility.

---

## 4. Running the Test Suites

### Backend Tests (Pytest)
```powershell
cd backend
.venv\Scripts\pytest.exe tests -v
```
All 11 unit and integration tests verify:
- API root and health probes
- Exercise profile catalog
- Video format and size validation
- Corrupted file rejection (HTTP 400)
- End-to-end video processing and automatic temporary file cleanup

### Frontend Production Build
```powershell
npm run build
```
Builds the optimized production bundle in `dist/`.

---

## 5. Engineering Principles & Privacy Scope

- **Asynchronous Upload Processing Only**: The system processes pre-recorded video files. It **never** requests webcam access, streams live camera feeds, or uses `navigator.mediaDevices.getUserMedia`.
- **Honest Metrics**: When joint coordinates are occluded or data is unavailable, the application returns explicit limitation notes and `null` values instead of fabricated percentages or fake repetitions.
- **Automated Temp File Cleanup**: All uploaded video binaries are stored with temporary unique UUIDs under `backend/temp_uploads/` and deleted immediately upon analysis completion or failure.
- **Biomechanical Guidance**: Analysis output provides computer-vision-based estimates for movement patterns and is not a clinical medical diagnosis.

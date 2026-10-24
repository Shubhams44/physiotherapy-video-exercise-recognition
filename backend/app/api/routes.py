import logging
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from ..schemas import (
    HealthResponse,
    ExercisesListResponse,
    ExerciseStatusItem,
    VideoAnalysisResponse,
    VideoInfo,
)
from ..services.video_service import save_upload_file_safely, cleanup_file
from ..utils.video_validation import inspect_video_stream
from ..services.pose_service import extract_pose_landmarks_and_angles
from ..services.analysis_service import analyze_extracted_movement
from ..config import API_TITLE, API_VERSION

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", tags=["General"])
def root_info():
    """Returns basic service metadata and documentation links."""
    return {
        "service": API_TITLE,
        "version": API_VERSION,
        "status": "online",
        "docs_url": "/docs",
        "supported_video_formats": [".mp4", ".mov", ".webm", ".m4v"],
        "max_upload_size_mb": 100,
    }

@router.get("/health", response_model=HealthResponse, tags=["Health"])
@router.get("/api/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    """Returns the operational health of the backend."""
    return HealthResponse()

@router.get("/api/exercises", response_model=ExercisesListResponse, tags=["Exercises"])
def get_supported_exercises():
    """Lists supported physiotherapy exercises and their current implementation maturity."""
    exercises = [
        ExerciseStatusItem(
            id="squat",
            name="Squat",
            category="Lower Limb Rehabilitation",
            status="implemented",
            tracked_joints=["Hip Joint", "Knee Flexion Angle", "Ankle Dorsiflexion", "Trunk Inclination"],
            description="Evaluates depth, sagittal knee flexion angle, and trunk forward lean balance."
        ),
        ExerciseStatusItem(
            id="bicep_curl",
            name="Bicep Curl",
            category="Upper Limb Strengthening",
            status="implemented",
            tracked_joints=["Elbow Flexion Angle", "Shoulder Stabilization", "Wrist Alignment"],
            description="Monitors concentric flexion and eccentric extension range of motion."
        ),
        ExerciseStatusItem(
            id="shoulder_flexion",
            name="Shoulder Flexion",
            category="Upper Body & Mobility",
            status="partial",
            tracked_joints=["Glenohumeral Joint", "Thoracic Spine Tilt"],
            description="Measures sagittal arm elevation and compensatory spinal hyperextension."
        ),
        ExerciseStatusItem(
            id="knee_extension",
            name="Knee Extension",
            category="Quadriceps Rehabilitation",
            status="partial",
            tracked_joints=["Knee Angle", "Hip Neutral Alignment"],
            description="Checks terminal knee extension lock and quadriceps engagement."
        ),
        ExerciseStatusItem(
            id="other",
            name="Other Movement",
            category="General Kinematic Tracking",
            status="implemented",
            tracked_joints=["Full Body 33 Landmark Topology"],
            description="Extracts multi-joint spatial trajectories for general physiotherapy movements."
        )
    ]
    return ExercisesListResponse(total=len(exercises), exercises=exercises)

@router.post(
    "/api/analyze-video",
    response_model=VideoAnalysisResponse,
    tags=["Video Analysis"],
    status_code=status.HTTP_200_OK,
)
async def analyze_video(
    video: UploadFile = File(..., description="Uploaded video file in MP4, MOV, or WebM format"),
    exercise_type: str = Form("squat", description="Exercise identifier (e.g. squat, bicep_curl)"),
    notes: Optional[str] = Form(None, description="Optional clinical notes or context"),
):
    """
    Accepts an uploaded video recording, validates file structure, extracts frames with OpenCV,
    detects pose landmarks with MediaPipe, calculates joint angles, and returns posture feedback.
    Guarantees temporary file cleanup upon completion or failure.
    """
    saved_path = None
    try:
        # Step 1: Safely write video to temp file with validation
        try:
            saved_path, original_filename, file_size = await save_upload_file_safely(video)
        except ValueError as val_err:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
        except Exception as e:
            logger.exception("Failed to write uploaded file: %s", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save video upload to temporary server storage."
            )

        # Step 2: Validate video stream and decode metadata with OpenCV
        try:
            stream_info = inspect_video_stream(saved_path)
        except ValueError as stream_err:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(stream_err))
        except Exception as e:
            logger.exception("Error inspecting video stream: %s", e)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to decode video stream. Please ensure the file is not corrupted."
            )

        video_info = VideoInfo(
            filename=original_filename,
            duration_seconds=stream_info["duration_seconds"],
            frame_count=stream_info["frame_count"],
            fps=stream_info["fps"],
            width=stream_info["width"],
            height=stream_info["height"],
        )

        # Step 3: Extract pose landmarks and compute joint angles with MediaPipe Pose
        try:
            pose_data = extract_pose_landmarks_and_angles(saved_path)
        except Exception as e:
            logger.exception("Pose landmark extraction failed: %s", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Pose landmark tracking error: {str(e)}"
            )

        # Step 4: Evaluate posture and formulate observations
        analysis_output = analyze_extracted_movement(
            pose_data=pose_data,
            exercise_type=exercise_type,
            user_notes=notes,
        )

        return VideoAnalysisResponse(
            status="success",
            video_info=video_info,
            analysis=analysis_output["analysis"],
            limitations=analysis_output["limitations"],
        )

    finally:
        # Step 5: Always clean up temporary video file
        if saved_path:
            cleanup_file(saved_path)

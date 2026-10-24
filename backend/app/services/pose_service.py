import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
import cv2
import numpy as np

logger = logging.getLogger(__name__)

# Model path
MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "pose_landmarker_lite.task"

# MediaPipe Vision Tasks Import
try:
    import mediapipe as mp
    from mediapipe.tasks import python as mp_python
    from mediapipe.tasks.python import vision as mp_vision
    MEDIAPIPE_AVAILABLE = True
except Exception as e:
    logger.warning("MediaPipe vision tasks could not be imported: %s", e)
    MEDIAPIPE_AVAILABLE = False


def calculate_joint_angle_2d(a: List[float], b: List[float], c: List[float]) -> float:
    """
    Calculates the 2D planar angle (in degrees) at joint 'b' between rays (b->a) and (b->c).
    Returns value between 0.0 and 180.0 degrees.
    """
    v1 = np.array([a[0] - b[0], a[1] - b[1]], dtype=np.float64)
    v2 = np.array([c[0] - b[0], c[1] - b[1]], dtype=np.float64)

    norm_v1 = np.linalg.norm(v1)
    norm_v2 = np.linalg.norm(v2)

    if norm_v1 < 1e-6 or norm_v2 < 1e-6:
        return 0.0

    cosine = np.dot(v1, v2) / (norm_v1 * norm_v2)
    cosine = np.clip(cosine, -1.0, 1.0)
    angle = np.degrees(np.arccos(cosine))
    return float(round(angle, 1))


def calculate_trunk_inclination(shoulder: List[float], hip: List[float]) -> float:
    """
    Calculates torso forward tilt angle in degrees relative to the vertical line.
    0 deg = vertical/upright.
    """
    dx = abs(shoulder[0] - hip[0])
    dy = abs(shoulder[1] - hip[1])
    if dy < 1e-6:
        return 90.0

    angle_rad = np.arctan2(dx, dy)
    return float(round(np.degrees(angle_rad), 1))


def extract_pose_landmarks_and_angles(video_path: Path, max_fps: float = 15.0) -> Dict[str, Any]:
    """
    Decodes video frames using OpenCV and tracks body landmarks using MediaPipe PoseLandmarker.
    Computes joint angles for knee flexion, hip flexion, trunk tilt, and elbow flexion.
    """
    if not MEDIAPIPE_AVAILABLE or not MODEL_PATH.exists():
        msg = "MediaPipe Pose engine or model file is not available."
        logger.warning(msg)
        return {
            "success": False,
            "error": msg,
            "frames_analyzed": 0,
            "angle_series": [],
            "metrics": {},
            "limitations": ["MediaPipe model asset not found; kinematic landmark detection was bypassed."],
        }

    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        cap.release()
        raise ValueError("Could not open video file for pose extraction.")

    original_fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    step = max(1, int(round(original_fps / max_fps)))

    angle_series: List[Dict[str, Any]] = []
    left_knee_angles: List[float] = []
    right_knee_angles: List[float] = []
    trunk_angles: List[float] = []
    hip_angles: List[float] = []
    left_elbow_angles: List[float] = []
    right_elbow_angles: List[float] = []

    valid_frames_count = 0
    total_read_frames = 0
    detected_landmarks_count = 0

    base_options = mp_python.BaseOptions(model_asset_path=str(MODEL_PATH))
    options = mp_vision.PoseLandmarkerOptions(
        base_options=base_options,
        running_mode=mp_vision.RunningMode.IMAGE,
        min_pose_detection_confidence=0.5,
        min_pose_presence_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    try:
        landmarker = mp_vision.PoseLandmarker.create_from_options(options)
    except Exception as e:
        cap.release()
        logger.exception("Failed to initialize MediaPipe PoseLandmarker: %s", e)
        return {
            "success": False,
            "error": f"Failed to initialize MediaPipe PoseLandmarker: {str(e)}",
            "frames_analyzed": 0,
            "angle_series": [],
            "metrics": {},
            "limitations": ["Could not initialize MediaPipe detector."],
        }

    try:
        while True:
            ret, frame = cap.read()
            if not ret or frame is None:
                break

            total_read_frames += 1
            if total_read_frames % step != 0:
                continue

            h, w = frame.shape[:2]
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

            detection_result = landmarker.detect(mp_image)
            timestamp_sec = round(total_read_frames / original_fps, 2)
            time_str = f"{timestamp_sec:.1f}s"

            if detection_result.pose_landmarks and len(detection_result.pose_landmarks) > 0:
                detected_landmarks_count += 1
                lm = detection_result.pose_landmarks[0]

                def get_point(idx: int) -> Optional[List[float]]:
                    if idx < len(lm):
                        pt = lm[idx]
                        visibility = getattr(pt, 'visibility', 1.0) or 1.0
                        if visibility > 0.4:
                            return [pt.x * w, pt.y * h]
                    return None

                l_shoulder = get_point(mp_vision.PoseLandmark.LEFT_SHOULDER.value)
                r_shoulder = get_point(mp_vision.PoseLandmark.RIGHT_SHOULDER.value)
                l_elbow = get_point(mp_vision.PoseLandmark.LEFT_ELBOW.value)
                r_elbow = get_point(mp_vision.PoseLandmark.RIGHT_ELBOW.value)
                l_wrist = get_point(mp_vision.PoseLandmark.LEFT_WRIST.value)
                r_wrist = get_point(mp_vision.PoseLandmark.RIGHT_WRIST.value)

                l_hip = get_point(mp_vision.PoseLandmark.LEFT_HIP.value)
                r_hip = get_point(mp_vision.PoseLandmark.RIGHT_HIP.value)
                l_knee = get_point(mp_vision.PoseLandmark.LEFT_KNEE.value)
                r_knee = get_point(mp_vision.PoseLandmark.RIGHT_KNEE.value)
                l_ankle = get_point(mp_vision.PoseLandmark.LEFT_ANKLE.value)
                r_ankle = get_point(mp_vision.PoseLandmark.RIGHT_ANKLE.value)

                # Knee angles (Hip - Knee - Ankle)
                l_knee_angle = calculate_joint_angle_2d(l_hip, l_knee, l_ankle) if (l_hip and l_knee and l_ankle) else None
                r_knee_angle = calculate_joint_angle_2d(r_hip, r_knee, r_ankle) if (r_hip and r_knee and r_ankle) else None

                if l_knee_angle is not None:
                    left_knee_angles.append(l_knee_angle)
                if r_knee_angle is not None:
                    right_knee_angles.append(r_knee_angle)

                knee_angle = l_knee_angle or r_knee_angle

                # Hip angles (Shoulder - Hip - Knee)
                l_hip_angle = calculate_joint_angle_2d(l_shoulder, l_hip, l_knee) if (l_shoulder and l_hip and l_knee) else None
                r_hip_angle = calculate_joint_angle_2d(r_shoulder, r_hip, r_knee) if (r_shoulder and r_hip and r_knee) else None
                hip_angle = l_hip_angle or r_hip_angle
                if hip_angle is not None:
                    hip_angles.append(hip_angle)

                # Trunk inclination
                trunk_angle = None
                if l_shoulder and l_hip:
                    trunk_angle = calculate_trunk_inclination(l_shoulder, l_hip)
                elif r_shoulder and r_hip:
                    trunk_angle = calculate_trunk_inclination(r_shoulder, r_hip)
                if trunk_angle is not None:
                    trunk_angles.append(trunk_angle)

                # Elbow angles (Shoulder - Elbow - Wrist)
                l_elbow_angle = calculate_joint_angle_2d(l_shoulder, l_elbow, l_wrist) if (l_shoulder and l_elbow and l_wrist) else None
                r_elbow_angle = calculate_joint_angle_2d(r_shoulder, r_elbow, r_wrist) if (r_shoulder and r_elbow and r_wrist) else None
                if l_elbow_angle is not None:
                    left_elbow_angles.append(l_elbow_angle)
                if r_elbow_angle is not None:
                    right_elbow_angles.append(r_elbow_angle)
                elbow_angle = l_elbow_angle or r_elbow_angle

                angle_series.append({
                    "time": time_str,
                    "kneeAngle": round(knee_angle, 1) if knee_angle is not None else None,
                    "hipAngle": round(hip_angle, 1) if hip_angle is not None else None,
                    "trunkAngle": round(trunk_angle, 1) if trunk_angle is not None else None,
                    "elbowAngle": round(elbow_angle, 1) if elbow_angle is not None else None,
                })
                valid_frames_count += 1
            else:
                angle_series.append({
                    "time": time_str,
                    "kneeAngle": None,
                    "hipAngle": None,
                    "trunkAngle": None,
                    "elbowAngle": None,
                })
    finally:
        cap.release()
        landmarker.close()

    return {
        "success": True,
        "total_frames": total_frames,
        "frames_analyzed": valid_frames_count,
        "detected_ratio": round(detected_landmarks_count / max(1, valid_frames_count), 2) if valid_frames_count > 0 else 0.0,
        "angle_series": angle_series,
        "left_knee_angles": left_knee_angles,
        "right_knee_angles": right_knee_angles,
        "trunk_angles": trunk_angles,
        "hip_angles": hip_angles,
        "left_elbow_angles": left_elbow_angles,
        "right_elbow_angles": right_elbow_angles,
    }

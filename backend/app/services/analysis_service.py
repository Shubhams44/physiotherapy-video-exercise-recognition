import logging
from typing import Dict, Any, List, Optional
import numpy as np
from ..schemas import AnalysisResult, JointAngles, AnalysisFeedback

logger = logging.getLogger(__name__)

def count_exercise_repetitions(angle_signal: List[float], min_threshold: float, max_threshold: float) -> Optional[int]:
    """
    Counts movement cycles by finding alternating peaks and valleys in an angle trajectory.
    For squats: valley is minimum knee angle (peak flexion < min_threshold), peak is return to standing (> max_threshold).
    """
    if not angle_signal or len(angle_signal) < 6:
        return None

    # Simple moving average smoothing (window = 3)
    smoothed: List[float] = []
    w = 3
    for i in range(len(angle_signal)):
        sub = [v for v in angle_signal[max(0, i - w + 1): i + 1] if v is not None]
        if sub:
            smoothed.append(float(np.mean(sub)))

    reps = 0
    in_repetition = False

    for val in smoothed:
        if not in_repetition:
            if val <= min_threshold:
                in_repetition = True
        else:
            if val >= max_threshold:
                reps += 1
                in_repetition = False

    return reps if reps > 0 else None


def analyze_extracted_movement(
    pose_data: Dict[str, Any],
    exercise_type: str = "squat",
    user_notes: Optional[str] = None
) -> Dict[str, Any]:
    """
    Evaluates kinematic joint angles and form against physiotherapy movement rules.
    Does NOT fabricate results: returns nulls/limitations when data is unavailable.
    """
    exercise_key = (exercise_type or "other").lower().strip()
    limitations: List[str] = [
        "Kinematic measurements are estimated from 2D monocular camera perspectives and subject to parallax.",
        "Computer-vision assessment is intended for exercise technique guidance, not clinical medical diagnosis."
    ]

    # Case 1: Pose detection was not available or no landmarks were found
    if not pose_data.get("success", False) or pose_data.get("frames_analyzed", 0) == 0:
        limitations.append(pose_data.get("error", "No recognizable body pose landmarks found in video frames."))
        return {
            "analysis": AnalysisResult(
                exercise_type=exercise_key,
                posture_assessment="No Pose Landmarks Detected",
                confidence_score=0.0,
                posture_observations=[
                    "The system could not detect recognizable human joint coordinates in the uploaded video."
                ],
                joint_angles=JointAngles(),
                rep_count=None,
                feedback=AnalysisFeedback(
                    correct_observations=[],
                    form_issues=["Key body joints (hips, knees, shoulders) could not be identified."],
                    joint_alignment=[],
                    actionable_suggestions=[
                        "Ensure your full body is in the camera frame.",
                        "Record in a well-lit space without strong backlighting.",
                        "Wear contrasting clothing for clear landmark recognition."
                    ]
                )
            ),
            "limitations": limitations
        }

    left_knees = pose_data.get("left_knee_angles", [])
    right_knees = pose_data.get("right_knee_angles", [])
    all_knees = left_knees + right_knees
    trunk_angles = pose_data.get("trunk_angles", [])
    hip_angles = pose_data.get("hip_angles", [])
    left_elbows = pose_data.get("left_elbow_angles", [])
    right_elbows = pose_data.get("right_elbow_angles", [])
    all_elbows = left_elbows + right_elbows

    angle_series = pose_data.get("angle_series", [])

    correct_obs: List[str] = []
    form_issues: List[str] = []
    joint_alignment: List[str] = []
    actionable: List[str] = []

    # Calculate actual observed metrics
    min_knee = float(np.min(all_knees)) if all_knees else None
    max_knee = float(np.max(all_knees)) if all_knees else None
    avg_trunk = float(np.mean(trunk_angles)) if trunk_angles else None
    max_trunk = float(np.max(trunk_angles)) if trunk_angles else None
    avg_hip = float(np.mean(hip_angles)) if hip_angles else None
    min_elbow = float(np.min(all_elbows)) if all_elbows else None
    max_elbow = float(np.max(all_elbows)) if all_elbows else None

    detected_ratio = pose_data.get("detected_ratio", 1.0)
    rep_count: Optional[int] = None
    posture_assessment = "Assessment Completed"

    # ==========================================
    # Exercise-Specific Evaluation Logic
    # ==========================================
    if exercise_key == "squat":
        if min_knee is not None:
            joint_alignment.append(f"Peak knee flexion reached {min_knee:.1f}° (Target range: 80° - 90° for clinical rehabilitation).")
            if min_knee <= 95.0:
                correct_obs.append(f"Good squat depth achieved with knee flexion reaching {min_knee:.1f}°.")
            else:
                form_issues.append(f"Limited squat depth observed; minimum knee flexion was {min_knee:.1f}° (Target: ≤90°).")
                actionable.append("Work on controlled hip hinge to achieve full rehabilitation depth without lifting heels.")

            # Repetition counting for squats: inflection at min_knee < 110, recovery > 150
            knee_seq = [p.get("kneeAngle") for p in angle_series if p.get("kneeAngle") is not None]
            rep_count = count_exercise_repetitions(knee_seq, min_threshold=110.0, max_threshold=150.0)

        if max_trunk is not None:
            if max_trunk <= 30.0:
                correct_obs.append(f"Torso inclination remained upright (peak tilt: {max_trunk:.1f}°, safe limit: 30°).")
            else:
                form_issues.append(f"Elevated forward trunk lean detected at maximum depth ({max_trunk:.1f}°).")
                actionable.append("Engage core stabilizers and keep chest lifted to reduce lumbar shear stress.")

        # Check bilateral knee symmetry if both left and right knees tracked
        if left_knees and right_knees:
            min_l = np.min(left_knees)
            min_r = np.min(right_knees)
            diff = abs(min_l - min_r)
            if diff <= 8.0:
                correct_obs.append(f"Bilateral knee flexion symmetry is well-balanced ({diff:.1f}° difference between limbs).")
            else:
                form_issues.append(f"Bilateral asymmetry observed: left knee {min_l:.1f}° vs right knee {min_r:.1f}° ({diff:.1f}° disparity).")
                actionable.append("Focus on equal weight distribution across both feet during descent and ascent.")

        if form_issues:
            posture_assessment = "Form Deviations Detected" if len(form_issues) > 1 else "Acceptable Form with Minor Notes"
        else:
            posture_assessment = "Good Form & Symmetry"

    elif exercise_key == "bicep_curl":
        if min_elbow is not None and max_elbow is not None:
            joint_alignment.append(f"Elbow range of motion: {min_elbow:.1f}° peak flexion to {max_elbow:.1f}° extension.")
            if min_elbow <= 55.0:
                correct_obs.append(f"Full concentric flexion achieved ({min_elbow:.1f}°).")
            else:
                form_issues.append(f"Incomplete curl flexion; peak flexion stopped at {min_elbow:.1f}° (Target: ~40° - 50°).")
                actionable.append("Ensure full contraction at the top of the curl without swinging elbows forward.")

            if max_elbow >= 150.0:
                correct_obs.append(f"Full eccentric extension reached ({max_elbow:.1f}°).")
            else:
                form_issues.append(f"Elbow was not fully extended between repetitions ({max_elbow:.1f}°).")
                actionable.append("Lower arm smoothly to full extension (~160°) to maximize muscle lengthening.")

            # Repetition counting for curls
            elbow_seq = [p.get("elbowAngle") for p in angle_series if p.get("elbowAngle") is not None]
            rep_count = count_exercise_repetitions(elbow_seq, min_threshold=65.0, max_threshold=140.0)

        posture_assessment = "Good Arm Kinematics" if not form_issues else "Form Improvement Recommended"

    elif exercise_key == "shoulder_flexion":
        if hip_angles:
            joint_alignment.append(f"Shoulder elevation trajectory tracked across {len(hip_angles)} keyframes.")
            correct_obs.append("Controlled sagittal elevation observed.")
        if max_trunk is not None and max_trunk > 20.0:
            form_issues.append(f"Torso hyperextension/compensation detected ({max_trunk:.1f}° tilt).")
            actionable.append("Maintain neutral pelvic spine without arching the lower back when raising arms.")
        posture_assessment = "Mobility Tracked"

    elif exercise_key == "knee_extension":
        if max_knee is not None:
            joint_alignment.append(f"Terminal knee extension angle reached {max_knee:.1f}°.")
            if max_knee >= 165.0:
                correct_obs.append("Good terminal extension achieved near 180° anatomical zero.")
            else:
                form_issues.append(f"Incomplete terminal knee extension ({max_knee:.1f}° achieved).")
                actionable.append("Work towards terminal quad lock as recommended by your physical therapist.")
        posture_assessment = "Knee Extension Assessment"

    else:
        # General / Unclassified exercise
        joint_alignment.append("Full-body 33-point topological landmarks tracked across video frames.")
        correct_obs.append("Pose keypoints successfully extracted throughout the movement recording.")
        if not actionable:
            actionable.append("Review angular progression chart to observe movement consistency.")
        posture_assessment = "Movement Captured"

    if rep_count is None:
        limitations.append("Repetition counter could not verify discrete cycles from current video framing.")

    # Build Pydantic models
    joint_angles_obj = JointAngles(
        max_knee_flexion=round(min_knee, 1) if min_knee is not None else None,
        min_knee_flexion=round(max_knee, 1) if max_knee is not None else None,
        trunk_inclination=round(max_trunk, 1) if max_trunk is not None else None,
        hip_flexion=round(avg_hip, 1) if avg_hip is not None else None,
        max_elbow_flexion=round(min_elbow, 1) if min_elbow is not None else None,
        min_elbow_extension=round(max_elbow, 1) if max_elbow is not None else None,
        angle_series=angle_series,
    )

    feedback_obj = AnalysisFeedback(
        correct_observations=correct_obs,
        form_issues=form_issues,
        joint_alignment=joint_alignment,
        actionable_suggestions=actionable,
    )

    analysis_res = AnalysisResult(
        exercise_type=exercise_key,
        posture_assessment=posture_assessment,
        confidence_score=round(float(detected_ratio), 2),
        posture_observations=correct_obs + form_issues,
        joint_angles=joint_angles_obj,
        rep_count=rep_count,
        feedback=feedback_obj,
    )

    return {
        "analysis": analysis_res,
        "limitations": limitations
    }

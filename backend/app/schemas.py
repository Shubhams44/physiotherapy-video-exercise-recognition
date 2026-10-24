from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field

class HealthResponse(BaseModel):
    status: str = "online"
    message: str = "PhysioVision AI Backend is operating normally."
    service: str = "physiovision-api"
    version: str = "1.0.0"

class ExerciseStatusItem(BaseModel):
    id: str
    name: str
    category: str
    status: str = Field(description="'implemented', 'partial', or 'planned'")
    tracked_joints: List[str]
    description: str

class ExercisesListResponse(BaseModel):
    total: int
    exercises: List[ExerciseStatusItem]

class VideoInfo(BaseModel):
    filename: str
    duration_seconds: float
    frame_count: int
    fps: float
    width: int
    height: int

class AngleDataPoint(BaseModel):
    time: str
    kneeAngle: Optional[float] = None
    hipAngle: Optional[float] = None
    trunkAngle: Optional[float] = None
    elbowAngle: Optional[float] = None

class JointAngles(BaseModel):
    max_knee_flexion: Optional[float] = None
    min_knee_flexion: Optional[float] = None
    trunk_inclination: Optional[float] = None
    hip_flexion: Optional[float] = None
    max_elbow_flexion: Optional[float] = None
    min_elbow_extension: Optional[float] = None
    angle_series: List[Dict[str, Any]] = Field(default_factory=list)

class AnalysisFeedback(BaseModel):
    correct_observations: List[str] = Field(default_factory=list)
    form_issues: List[str] = Field(default_factory=list)
    joint_alignment: List[str] = Field(default_factory=list)
    actionable_suggestions: List[str] = Field(default_factory=list)

class AnalysisResult(BaseModel):
    exercise_type: str
    posture_assessment: str
    confidence_score: Optional[float] = None
    posture_observations: List[str] = Field(default_factory=list)
    joint_angles: JointAngles = Field(default_factory=JointAngles)
    rep_count: Optional[int] = None
    feedback: Union[AnalysisFeedback, List[str]]

class VideoAnalysisResponse(BaseModel):
    status: str = "success"
    video_info: VideoInfo
    analysis: AnalysisResult
    limitations: List[str] = Field(default_factory=list)

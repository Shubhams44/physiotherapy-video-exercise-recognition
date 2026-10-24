import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Layers,
  Cpu,
  Video,
  Compass,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  UploadCloud,
  FileText,
  AlertCircle
} from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { API_BASE_URL } from '../services/api';

export default function About() {
  const [copiedCode, setCopiedCode] = useState(false);

  const pipelineSteps = [
    {
      num: '01',
      title: 'Video Upload & Pre-Validation',
      status: 'Implemented in Frontend',
      statusType: 'implemented',
      description: 'The user selects or drops a pre-recorded exercise video (MP4, MOV, WebM). The frontend verifies file format, checks the 100MB size threshold, extracts native duration metadata, and captures optional clinical context notes.',
      icon: Video,
    },
    {
      num: '02',
      title: 'Frame Extraction & Pose Landmark Detection',
      status: 'Planned Python Backend Pipeline',
      statusType: 'planned',
      description: 'OpenCV decodes video frames asynchronously at 30 FPS. Google MediaPipe Pose (or YOLOv8-pose) detects 33 distinct anatomical 3D landmark coordinates (shoulders, elbows, hips, knees, ankles) per keyframe.',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Spatial Angle Calculation & Kinematics',
      status: 'Planned Python Backend Pipeline',
      statusType: 'planned',
      description: 'Vector mathematics compute 3D/2D joint angles (e.g., knee flexion via vector dot products between hip-knee and knee-ankle vectors). Trajectories are smoothed to suppress camera noise.',
      icon: Compass,
    },
    {
      num: '04',
      title: 'Rule-Based & ML Posture Assessment',
      status: 'Planned Python Backend Pipeline',
      statusType: 'planned',
      description: 'Biomechanical thresholds assess range of motion, depth compliance, trunk tilt, and coronal knee deviations (knee valgus). A classifier determines movement cycle completion and repetition counts.',
      icon: Layers,
    },
    {
      num: '05',
      title: 'Structured Feedback Delivery',
      status: 'Implemented in Frontend',
      statusType: 'implemented',
      description: 'The FastAPI endpoint returns a standardized JSON payload with metrics, categorized feedback, and optional annotated streams, which are rendered dynamically on the interactive results dashboard.',
      icon: CheckCircle2,
    },
  ];

  const implementationMatrix = [
    {
      feature: 'Pre-recorded Video Drag & Drop Upload',
      status: 'Implemented',
      details: 'HTML5 file validation, type checking (MP4, MOV, WebM), 100MB threshold',
      isDone: true,
    },
    {
      feature: 'Native In-Browser Video Preview',
      status: 'Implemented',
      details: 'HTML5 video playback with duration and resolution metadata extraction',
      isDone: true,
    },
    {
      feature: 'Exercise Target Selection & Context Notes',
      status: 'Implemented',
      details: 'Squat, Bicep Curl, Shoulder Flexion, Knee Extension with anatomical profiles',
      isDone: true,
    },
    {
      feature: 'API Service Layer & FastAPI Contract',
      status: 'Implemented',
      details: 'Axios multipart upload client, health checks, error boundaries, .env config',
      isDone: true,
    },
    {
      feature: 'Interactive Results Dashboard & Charts',
      status: 'Implemented',
      details: 'Recharts angle time-series, metric cards, categorized posture feedback',
      isDone: true,
    },
    {
      feature: 'MediaPipe / Pose Landmark Backend Model',
      status: 'Planned Backend',
      details: 'Python FastAPI server processing video frames and extracting coordinates',
      isDone: false,
    },
    {
      feature: 'Algorithmic Joint Angle Computation',
      status: 'Planned Backend',
      details: 'Vector mathematics for knee, hip, elbow, and spinal angles',
      isDone: false,
    },
    {
      feature: 'Annotated Video Landmark Overlay Generator',
      status: 'Planned Backend',
      details: 'Rendering annotated skeleton lines onto output video frames via cv2',
      isDone: false,
    },
  ];

  const fastApiSnippet = `# ==============================================================
# FastAPI Backend Service: app/main.py
# PhysioVision AI Movement Recognition & Posture Feedback
# ==============================================================
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

app = FastAPI(title="PhysioVision AI Backend")

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "online", "message": "PhysioVision AI Backend is running."}

@app.post("/api/analyze-video")
async def analyze_video(
    video: UploadFile = File(...),
    exercise_type: str = Form(...),
    notes: str = Form(None)
):
    # 1. Save uploaded video to temp storage
    temp_dir = "./temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    temp_video_path = os.path.join(temp_dir, video.filename)
    
    with open(temp_video_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)
        
    # 2. Extract frames & run MediaPipe Pose landmarks
    # (Extract keypoint coordinates and compute joint angles)
    
    # 3. Return structured JSON contract matching frontend
    return {
        "status": "completed",
        "recognized_exercise": exercise_type.capitalize(),
        "confidence_score": 0.92,
        "posture_assessment": "Good depth with minor valgus tendency",
        "processing_duration_sec": 3.8,
        "rep_count": 5,
        "feedback": {
            "correct_observations": [
                "Full depth reached within therapeutic range.",
                "Controlled movement tempo maintained."
            ],
            "form_issues": [
                "Minor inward knee collapse during repetition 3."
            ],
            "joint_alignment": [
                "Peak knee flexion: 86 degrees (Target: 80 - 90 deg)."
            ],
            "actionable_suggestions": [
                "Focus on pushing knees outward in line with toes."
            ]
        },
        "joint_angles": {
            "max_knee_flexion": 86,
            "trunk_inclination": 21,
            "hip_flexion": 94,
            "angle_series": [
                {"time": "0.0s", "kneeAngle": 175, "hipAngle": 178, "trunkAngle": 5},
                {"time": "1.5s", "kneeAngle": 92, "hipAngle": 98, "trunkAngle": 20},
                {"time": "3.0s", "kneeAngle": 174, "hipAngle": 176, "trunkAngle": 6}
            ]
        },
        "annotated_video_url": None,
        "annotated_frames": []
    }

# Run with: uvicorn main:app --reload --port 8000`;

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(fastApiSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 text-left">
      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="teal" dot>
            Computer Vision Architecture
          </Badge>
          <Badge variant="slate">
            System Specifications & Pipeline Documentation
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Platform Architecture & Technical Pipeline
        </h1>
        <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
          <strong>PhysioVision AI</strong> provides an intelligent computer-vision pipeline for automated physiotherapy movement recognition and biomechanical posture feedback from user-recorded exercise videos.
        </p>
      </div>

      {/* Motivation & Offline Philosophy */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <span>Clinical Need & Purpose</span>
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            In physical therapy and orthopedic rehabilitation, correct exercise technique is crucial for muscle recovery and preventing secondary joint injuries. While clinic sessions provide direct therapist supervision, home exercise compliance often suffers from improper form and a lack of objective visual feedback.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            The platform demonstrates how modern web architecture, computer vision algorithms, and biomechanical modeling integrate to evaluate movement mechanics accurately and objectively.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Why Pre-Recorded Video Over Live Cameras?</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-2" />
              <span><strong>Privacy & Comfort:</strong> Patients record their exercises privately without feeling observed by an always-on live camera stream.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-2" />
              <span><strong>Higher Computational Quality:</strong> Asynchronous frame extraction avoids dropped frames and low-bandwidth degradation inherent in live WebRTC streams.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-2" />
              <span><strong>Repeatable Assessment:</strong> Videos can be stored, reviewed at keyframes, and compared over weeks of physical therapy progression.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Intended 5-Stage Technical Pipeline */}
      <section className="space-y-6">
        <div>
          <Badge variant="teal" size="sm">Processing Flow</Badge>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Intended 5-Stage Computer Vision Pipeline
          </h2>
          <p className="text-sm text-slate-600">
            Clear separation between user interaction, frame processing, and kinematic intelligence.
          </p>
        </div>

        <div className="space-y-4">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            const isImplemented = step.statusType === 'implemented';
            return (
              <div
                key={step.num}
                className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start gap-5 transition-all ${
                  isImplemented ? 'border-teal-200' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xl font-bold text-slate-300">
                    {step.num}
                  </span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    isImplemented ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                    <Badge variant={isImplemented ? 'emerald' : 'amber'} size="sm">
                      {step.status}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Implemented vs Planned Features Matrix */}
      <section className="space-y-4">
        <div>
          <Badge variant="slate" size="sm">System Engineering Scope</Badge>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Implementation Scope & Status Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Architectural Scope: Clearly separating implemented client interface components from the Python processing service.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Module / Feature</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 sm:px-6">Implementation Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {implementationMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-900">
                      {item.feature}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={item.isDone ? 'emerald' : 'amber'} size="sm">
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-500 font-mono text-xs">
                      {item.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Backend Integration Contract & Quickstart */}
      <section className="bg-slate-900 text-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
              <Code2 className="w-5 h-5" />
              <span>FastAPI Backend Starter Snippet</span>
            </div>
            <p className="text-xs text-slate-400">
              Target endpoint: <code className="text-teal-300">POST /api/analyze-video</code> at <code className="text-teal-300">{API_BASE_URL}</code>
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={copiedCode ? Check : Copy}
            onClick={copyCodeToClipboard}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            {copiedCode ? 'Copied Snippet!' : 'Copy FastAPI Code'}
          </Button>
        </div>

        <div className="relative">
          <pre className="bg-black/60 rounded-xl p-4 sm:p-5 font-mono text-[11px] sm:text-xs text-teal-300 overflow-x-auto border border-slate-800 leading-relaxed max-h-96">
            <code>{fastApiSnippet}</code>
          </pre>
        </div>

        <div className="text-xs text-slate-400 space-y-1">
          <p>• Save this as <code className="text-teal-300">main.py</code> in your future backend directory.</p>
          <p>• Run <code className="text-teal-300">pip install fastapi uvicorn python-multipart mediapipe opencv-python</code>.</p>
          <p>• Start the server via <code className="text-teal-300">uvicorn main:app --reload --port 8000</code> to receive video uploads.</p>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link to="/upload">
          <Button size="lg" icon={UploadCloud}>
            Try Video Upload & Validation Flow
          </Button>
        </Link>
      </div>
    </div>
  );
}

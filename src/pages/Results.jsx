import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  CheckCircle2,
  Clock,
  RotateCcw,
  UploadCloud,
  Home as HomeIcon,
  Video,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import Button from '../components/Button';
import Badge from '../components/Badge';
import MetricCard from '../components/MetricCard';
import FeedbackCard from '../components/FeedbackCard';
import { formatDuration } from '../utils/videoValidation';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const resultData = location.state?.resultData;
  const videoFile = location.state?.videoFile;
  const metadata = location.state?.metadata || {};
  const isDemoInspection = location.state?.isDemoInspection || resultData?.isDemoData;

  const [videoObjectUrl, setVideoObjectUrl] = useState(null);

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [videoFile]);

  // Empty state handling if accessed directly without any analysis data
  if (!resultData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Activity className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Assessment Data Available</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          No video analysis results were found in current session memory. Please upload an exercise video to generate an assessment.
        </p>
        <div className="pt-2">
          <Link to="/upload">
            <Button icon={UploadCloud}>Upload Exercise Video</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Extract fields safely from API response contract (supports both nested analysis and flat response)
  const analysisObj = resultData.analysis || {};
  const videoInfo = resultData.video_info || {};

  const rawExercise = analysisObj.exercise_type || resultData.recognized_exercise || 'Unknown Movement';
  const recognizedExercise = rawExercise.charAt(0).toUpperCase() + rawExercise.slice(1).replace(/_/g, ' ');

  const postureAssessment = analysisObj.posture_assessment || resultData.posture_assessment || 'Assessment Completed';
  const status = resultData.status || 'completed';
  const processingDuration = videoInfo.duration_seconds !== undefined ? videoInfo.duration_seconds : resultData.processing_duration_sec;
  const repCount = analysisObj.rep_count !== undefined ? analysisObj.rep_count : resultData.rep_count;
  const confidenceScore = analysisObj.confidence_score !== undefined ? analysisObj.confidence_score : resultData.confidence_score;

  const jointAngles = analysisObj.joint_angles || resultData.joint_angles || {};
  const angleSeries = jointAngles.angle_series || [];

  // Parse feedback from backend
  const rawFeedback = analysisObj.feedback || resultData.feedback || {};
  const rawObservations = analysisObj.posture_observations || [];

  const feedback = {
    correct_observations: rawFeedback.correct_observations || 
      (Array.isArray(rawObservations) ? rawObservations.filter(o => !o.toLowerCase().includes('issue') && !o.toLowerCase().includes('deviation') && !o.toLowerCase().includes('caution')) : []),
    form_issues: rawFeedback.form_issues || 
      (Array.isArray(rawObservations) ? rawObservations.filter(o => o.toLowerCase().includes('issue') || o.toLowerCase().includes('deviation') || o.toLowerCase().includes('caution') || o.toLowerCase().includes('valgus') || o.toLowerCase().includes('lean')) : []),
    joint_alignment: rawFeedback.joint_alignment || [],
    actionable_suggestions: rawFeedback.actionable_suggestions || (Array.isArray(rawFeedback) ? rawFeedback : [])
  };

  const limitations = resultData.limitations || [];
  const annotatedVideoUrl = resultData.annotated_video_url;
  const annotatedFrames = resultData.annotated_frames || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 text-left">
      {/* Demo Notice Banner if in demo inspection mode */}
      {isDemoInspection && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-amber-900 text-xs sm:text-sm shadow-xs animate-in fade-in">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <strong className="font-bold text-amber-950">Development / UI Demonstration Mode</strong>
              <Badge variant="amber" size="sm">Mock Data</Badge>
            </div>
            <p className="text-amber-800 leading-relaxed">
              These results are populated using structured sample data to showcase the UI components, charts, and feedback cards. Once your Python FastAPI server is active at <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-950">http://127.0.0.1:8001</code>, real computer-vision metrics will appear here.
            </p>
          </div>
        </div>
      )}

      {/* Top Header & Breadcrumb / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="emerald" dot>
              Analysis Complete
            </Badge>
            {processingDuration && (
              <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Processed in {processingDuration}s
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Exercise Assessment Dashboard
          </h1>
          <p className="text-sm text-slate-600">
            Computer-vision posture analysis report for uploaded physiotherapy recording.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={RotateCcw}
            onClick={() => navigate('/upload')}
          >
            Analyse Another Video
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={UploadCloud}
            onClick={() => navigate('/upload')}
          >
            Upload New Video
          </Button>
        </div>
      </div>

      {/* SECTION 1: Analysis Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Recognized Movement */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Recognized Movement
            </span>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-slate-900">{recognizedExercise}</h3>
              {confidenceScore && (
                <Badge variant="teal" size="sm">
                  {Math.round(confidenceScore * 100)}% Match
                </Badge>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100">
            Classified via spatial-temporal landmark trajectory
          </p>
        </div>

        {/* Card 2: Overall Posture Assessment */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Overall Form Rating
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {postureAssessment}
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Assessment Status:</span>
            <span className="font-semibold text-emerald-700 capitalize">{status}</span>
          </div>
        </div>

        {/* Card 3: Repetitions / Duration */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Detected Repetitions
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold font-mono text-teal-700">
                {repCount !== undefined && repCount !== null ? repCount : '--'}
              </h3>
              <span className="text-sm font-semibold text-slate-500">
                {repCount !== undefined && repCount !== null ? 'Completed Reps' : 'Rep Counting N/A'}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100">
            {metadata.duration ? `Video length: ${formatDuration(metadata.duration)}` : 'Cycle inflection tracking'}
          </p>
        </div>
      </section>

      {/* SECTION 2: Movement Metrics & Joint Angles */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-teal-600" />
              <span>Biomechanical Joint Angles & Kinematics</span>
            </h2>
            <p className="text-xs text-slate-500">
              Quantitative angle values extracted from keyframe pose landmarks
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">CV Landmark Measurements</span>
        </div>

        {/* Dynamic Metric Cards based on computed joint_angles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Max Knee Flexion"
            value={jointAngles.max_knee_flexion !== undefined && jointAngles.max_knee_flexion !== null ? Math.round(jointAngles.max_knee_flexion) : (jointAngles.knee_flexion !== undefined && jointAngles.knee_flexion !== null ? Math.round(jointAngles.knee_flexion) : null)}
            unit="°"
            target="80° - 90°"
            status={jointAngles.max_knee_flexion || jointAngles.knee_flexion ? 'optimal' : 'neutral'}
            description="Peak knee bend angle measured from hip-knee-ankle keypoints."
          />
          <MetricCard
            title="Trunk Inclination"
            value={jointAngles.trunk_inclination !== undefined && jointAngles.trunk_inclination !== null ? Math.round(jointAngles.trunk_inclination) : (jointAngles.torso_angle !== undefined && jointAngles.torso_angle !== null ? Math.round(jointAngles.torso_angle) : null)}
            unit="°"
            target="15° - 25°"
            status={jointAngles.trunk_inclination || jointAngles.torso_angle ? 'optimal' : 'neutral'}
            description="Torso forward tilt measured relative to the vertical axis."
          />
          <MetricCard
            title="Hip Flexion Angle"
            value={jointAngles.hip_flexion !== undefined && jointAngles.hip_flexion !== null ? Math.round(jointAngles.hip_flexion) : (jointAngles.hip_angle !== undefined && jointAngles.hip_angle !== null ? Math.round(jointAngles.hip_angle) : null)}
            unit="°"
            target="85° - 100°"
            status={jointAngles.hip_flexion || jointAngles.hip_angle ? 'acceptable' : 'neutral'}
            description="Pelvic flexion angle between thigh and torso axis."
          />
          <MetricCard
            title="Repetition Count"
            value={repCount !== undefined && repCount !== null ? repCount : null}
            unit="Reps"
            target="Target: 5 - 8"
            status={repCount ? 'optimal' : 'neutral'}
            description="Movement cycles counted from spatial inflection points."
          />
        </div>

        {/* Recharts Joint Angle Progression Chart */}
        {angleSeries && angleSeries.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  <span>Joint Angle Progression Over Time</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Continuous angular displacement across the recorded video timeline
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-teal-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                  Knee Angle (°)
                </span>
                <span className="flex items-center gap-1.5 text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Hip Angle (°)
                </span>
                <span className="flex items-center gap-1.5 text-sky-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  Trunk Tilt (°)
                </span>
              </div>
            </div>

            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={angleSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 190]} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '0.75rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="kneeAngle"
                    name="Knee Flexion"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#0d9488' }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="hipAngle"
                    name="Hip Flexion"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 2.5, fill: '#f59e0b' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="trunkAngle"
                    name="Trunk Lean"
                    stroke="#0284c7"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 3: Posture Feedback */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-600" />
          <span>Detailed Posture Feedback & Form Guidance</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FeedbackCard
            type="correct"
            title="Correct Movement Observations"
            items={feedback.correct_observations}
          />
          <FeedbackCard
            type="issues"
            title="Potential Form Deviations"
            items={feedback.form_issues}
          />
          <FeedbackCard
            type="alignment"
            title="Joint Alignment & Symmetry"
            items={feedback.joint_alignment}
          />
          <FeedbackCard
            type="actionable"
            title="Actionable Improvement Suggestions"
            items={feedback.actionable_suggestions}
          />
        </div>
      </section>

      {/* SECTION 4: Video Review */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-teal-600" />
            <span>Video Review & Keyframe Inspection</span>
          </h2>
          <span className="text-xs text-slate-400">Recorded Video Playback</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Original Uploaded Video Playback */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Original Uploaded Video</span>
              {videoFile && <span className="text-xs font-mono text-slate-500">{videoFile.name}</span>}
            </div>

            <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center">
              {videoObjectUrl ? (
                <video
                  src={videoObjectUrl}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-slate-400 text-xs flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  <span>Video source available in original session</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Backend-Generated Annotated Video / Frames Display */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Backend Annotated Video / Landmark Overlay
              </span>
              <span className="text-[11px] bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded font-mono">
                Planned API Target
              </span>
            </div>

            <div className="aspect-video bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-3">
              {annotatedVideoUrl ? (
                <video
                  src={annotatedVideoUrl}
                  controls
                  playsInline
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-teal-400">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 max-w-xs">
                    <p className="text-xs font-semibold text-slate-200">
                      Annotated Stream Ready for API
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      When your FastAPI endpoint returns <code className="text-teal-300">annotated_video_url</code> or keyframe images, the overlaid landmark playback will render directly here.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Limitations & Explicit Scope Notes */}
      {limitations && limitations.length > 0 && (
        <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Info className="w-4 h-4 text-teal-600" />
            <span>Analysis Scope & Limitations</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {limitations.map((lim, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>{lim}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Clinical Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-xs text-slate-500 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-700">Notice on Computer-Vision Assessment:</strong> The joint angles, symmetry scores, and feedback above are calculated strictly by algorithmic pose estimation models from the 2D video input. They serve as supportive guidance and are not a substitute for formal diagnosis or therapy sessions conducted by a licensed physical therapist.
        </p>
      </div>

      {/* Bottom Actions Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1.5">
          <HomeIcon className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            icon={RotateCcw}
            onClick={() => navigate('/upload')}
          >
            Analyse Another Video
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={UploadCloud}
            onClick={() => navigate('/upload')}
          >
            Upload New Video
          </Button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Target, HelpCircle, Activity, Sparkles, FileText } from 'lucide-react';

export const EXERCISE_OPTIONS = [
  {
    id: 'squat',
    name: 'Squat',
    category: 'Lower Body / Hip & Knee Rehab',
    description: 'Assesses hip depth, knee flexion, knee valgus (inward collapse), and trunk inclination.',
    keyJoints: ['Hip Joint (Left & Right)', 'Knee Joint Angle', 'Ankle Dorsiflexion', 'Spine Inclination'],
    recommendedAngle: 'Knee flexion ~80° - 90° for clinical rehabilitation',
  },
  {
    id: 'bicep_curl',
    name: 'Bicep Curl',
    category: 'Upper Body / Elbow Rehab',
    description: 'Evaluates elbow flexion range of motion, wrist stability, and torso compensation.',
    keyJoints: ['Elbow Flexion Angle', 'Shoulder Joint Stabilization', 'Wrist Alignment', 'Trunk Sway'],
    recommendedAngle: 'Elbow range from ~160° (extension) to ~40° (peak flexion)',
  },
  {
    id: 'shoulder_flexion',
    name: 'Shoulder Flexion',
    category: 'Upper Body / Rotator Cuff & Mobility',
    description: 'Tracks sagittal arm elevation, scapulothoracic rhythm, and compensatory hyperextension.',
    keyJoints: ['Glenohumeral Joint Angle', 'Scapula Elevation', 'Thoracic Spine Alignment'],
    recommendedAngle: 'Normal physiological range up to 160° - 180° flexion',
  },
  {
    id: 'knee_extension',
    name: 'Knee Extension',
    category: 'Lower Body / Quadriceps Strengthening',
    description: 'Measures seated or lying knee terminal extension and quadriceps engagement symmetry.',
    keyJoints: ['Knee Joint Angle', 'Hip Stabilization', 'Pelvic Neutral Alignment'],
    recommendedAngle: 'Full terminal extension ~0° - 5°',
  },
  {
    id: 'other',
    name: 'Other / Unknown Exercise',
    category: 'General Movement Assessment',
    description: 'General 33-point pose landmark tracking for unclassified physiotherapy movements.',
    keyJoints: ['Full Body Landmarks (MediaPipe 33-Keypoint Topology)'],
    recommendedAngle: 'Relative kinematic assessment based on bilateral symmetry',
  },
];

export default function ExerciseSelector({
  selectedExercise,
  onSelectExercise,
  notes,
  onChangeNotes,
  disabled = false,
  error = null,
}) {
  const currentDetails = EXERCISE_OPTIONS.find((e) => e.id === selectedExercise) || EXERCISE_OPTIONS[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Target Exercise Selection</h3>
            <p className="text-xs text-slate-500">Choose the movement performed in your video recording</p>
          </div>
        </div>
        <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
          Required
        </span>
      </div>

      {/* Select Dropdown */}
      <div>
        <label htmlFor="exercise-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          Select Planned Exercise <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <select
            id="exercise-select"
            value={selectedExercise}
            onChange={(e) => onSelectExercise(e.target.value)}
            disabled={disabled}
            className={`w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 text-sm font-medium rounded-xl border px-3.5 py-3 transition-colors appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
              error ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300'
            }`}
          >
            {EXERCISE_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name} — {opt.category}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>}
      </div>

      {/* Selected Exercise Biomechanical Details Card */}
      {currentDetails && (
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              Analysis Profile: {currentDetails.name}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">{currentDetails.recommendedAngle}</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {currentDetails.description}
          </p>

          <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-1.5">
            <span className="text-[11px] font-medium text-slate-500 mr-1 self-center">Tracked Joints:</span>
            {currentDetails.keyJoints.map((joint, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200 shadow-2xs font-medium"
              >
                {joint}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Optional Description / Clinical Notes */}
      <div>
        <label htmlFor="exercise-notes" className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Exercise Context / Rehabilitation Notes
          </span>
          <span className="text-slate-400 font-normal lowercase tracking-normal text-[11px]">(Optional)</span>
        </label>
        <textarea
          id="exercise-notes"
          value={notes}
          onChange={(e) => onChangeNotes(e.target.value)}
          placeholder="e.g., Post-ACL reconstruction week 6; right knee rehabilitation; patient felt minor discomfort at 90 degrees."
          rows={2}
          disabled={disabled}
          className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-300 p-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none"
        />
      </div>
    </div>
  );
}

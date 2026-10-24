import React from 'react';
import { UploadCloud, Cpu, Compass, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import Button from './Button';

export const ANALYSIS_STEPS = [
  {
    id: 'upload',
    label: 'Uploading Video',
    description: 'Transferring recorded video to backend processing pipeline',
    icon: UploadCloud,
  },
  {
    id: 'landmarks',
    label: 'Frame Extraction & Pose Landmark Detection',
    description: 'Extracting keyframes and locating 33 body landmarks via computer vision',
    icon: Cpu,
  },
  {
    id: 'kinematics',
    label: 'Joint Angles & Biomechanical Evaluation',
    description: 'Calculating spatial joint angles and movement symmetry',
    icon: Compass,
  },
  {
    id: 'assessment',
    label: 'Generating Posture Assessment & Feedback',
    description: 'Synthesizing clinical exercise feedback and corrective guidance',
    icon: CheckCircle2,
  },
];

export default function LoadingState({
  currentStepIndex = 0,
  uploadProgress = 0,
  videoFileName = 'video.mp4',
  exerciseName = 'Squat',
  onCancel,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
          <div className="relative">
            <Cpu className="w-8 h-8 animate-pulse text-teal-600" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
            </span>
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Analysing Physiotherapy Video
        </h2>
        <p className="text-sm text-slate-500">
          Target Exercise: <span className="font-semibold text-slate-700">{exerciseName}</span> • File: <span className="font-mono text-slate-600">{videoFileName}</span>
        </p>
      </div>

      {/* Upload Progress Bar if on step 0 */}
      {currentStepIndex === 0 && (
        <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span>Upload Progress</span>
            <span className="font-mono">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 text-right">
            Sending binary video payload to FastAPI target
          </p>
        </div>
      )}

      {/* Step by Step Timeline */}
      <div className="space-y-4 pt-2">
        {ANALYSIS_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isPending = idx > currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-4 p-3.5 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-teal-50/60 border-teal-300 shadow-xs ring-1 ring-teal-200'
                  : isDone
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-white border-slate-100 opacity-50'
              }`}
            >
              {/* Step indicator icon */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? 'bg-teal-600 text-white animate-pulse'
                    : isDone
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-semibold ${
                    isCurrent ? 'text-teal-900' : isDone ? 'text-emerald-900' : 'text-slate-600'
                  }`}>
                    {step.label}
                  </h4>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    {isDone ? 'Completed' : isCurrent ? 'In Progress...' : 'Waiting'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancel Action */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-center">
        {onCancel && (
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-800"
          >
            Cancel Analysis & Return
          </Button>
        )}
      </div>
    </div>
  );
}

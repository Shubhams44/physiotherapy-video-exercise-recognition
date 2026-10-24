import React, { useState } from 'react';
import { Activity, ShieldCheck, Eye, Sparkles } from 'lucide-react';

export default function PoseSkeletonDemo() {
  const [activePose, setActivePose] = useState('squat'); // 'squat' | 'curl'
  const [showAngles, setShowAngles] = useState(true);

  // Squat skeleton coordinates (normalized 0-100 viewBox: 0 0 400 450)
  const squatLandmarks = {
    head: { x: 200, y: 70 },
    neck: { x: 200, y: 110 },
    lShoulder: { x: 170, y: 130 },
    rShoulder: { x: 230, y: 130 },
    lElbow: { x: 145, y: 180 },
    rElbow: { x: 255, y: 180 },
    lWrist: { x: 170, y: 215 },
    rWrist: { x: 230, y: 215 },
    lHip: { x: 180, y: 250 },
    rHip: { x: 220, y: 250 },
    lKnee: { x: 135, y: 330 },
    rKnee: { x: 265, y: 330 },
    lAnkle: { x: 160, y: 410 },
    rAnkle: { x: 240, y: 410 },
  };

  // Bicep curl skeleton coordinates
  const curlLandmarks = {
    head: { x: 200, y: 60 },
    neck: { x: 200, y: 95 },
    lShoulder: { x: 170, y: 115 },
    rShoulder: { x: 230, y: 115 },
    lElbow: { x: 165, y: 185 },
    rElbow: { x: 235, y: 185 },
    lWrist: { x: 170, y: 125 }, // Flexed upwards
    rWrist: { x: 235, y: 250 }, // Extended downwards
    lHip: { x: 185, y: 220 },
    rHip: { x: 215, y: 220 },
    lKnee: { x: 185, y: 320 },
    rKnee: { x: 215, y: 320 },
    lAnkle: { x: 185, y: 410 },
    rAnkle: { x: 215, y: 410 },
  };

  const pts = activePose === 'squat' ? squatLandmarks : curlLandmarks;

  return (
    <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-card p-4 sm:p-6 overflow-hidden">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-900 tracking-wide">
            Computer Vision Pose Model Demo
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePose('squat')}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
              activePose === 'squat'
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Squat
          </button>
          <button
            onClick={() => setActivePose('curl')}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
              activePose === 'curl'
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Bicep Curl
          </button>
        </div>
      </div>

      {/* Interactive Pose Skeleton Graphic */}
      <div className="relative w-full aspect-[4/3.8] bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
        {/* Subtle grid background to simulate computer vision canvas */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(#14b8a6 1px, transparent 1px), radial-gradient(#14b8a6 1px, #020617 1px)`,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
          }}
        />

        {/* Video Overlay Watermark */}
        <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700/60 rounded px-2 py-1 text-[10px] font-mono text-teal-400">
          CV PIPELINE: MEDIA-PIPE 33-PTS
        </div>

        <div className="absolute top-3 right-3 bg-slate-900/90 border border-slate-700/60 rounded px-2 py-1 text-[10px] font-mono text-slate-300">
          PRE-RECORDED VIDEO
        </div>

        {/* SVG Skeleton */}
        <svg viewBox="0 0 400 450" className="w-full h-full max-h-[380px] z-10">
          {/* Skeleton Bones (Connecting Lines) */}
          <g stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" opacity="0.85">
            {/* Spine & Head */}
            <line x1={pts.head.x} y1={pts.head.y} x2={pts.neck.x} y2={pts.neck.y} />
            <line x1={pts.neck.x} y1={pts.neck.y} x2={(pts.lHip.x + pts.rHip.x) / 2} y2={(pts.lHip.y + pts.rHip.y) / 2} strokeWidth="4" />

            {/* Shoulders */}
            <line x1={pts.lShoulder.x} y1={pts.lShoulder.y} x2={pts.rShoulder.x} y2={pts.rShoulder.y} strokeWidth="3.5" />

            {/* Left Arm */}
            <line x1={pts.lShoulder.x} y1={pts.lShoulder.y} x2={pts.lElbow.x} y2={pts.lElbow.y} />
            <line x1={pts.lElbow.x} y1={pts.lElbow.y} x2={pts.lWrist.x} y2={pts.lWrist.y} stroke={activePose === 'curl' ? '#2dd4bf' : '#14b8a6'} strokeWidth="3.5" />

            {/* Right Arm */}
            <line x1={pts.rShoulder.x} y1={pts.rShoulder.y} x2={pts.rElbow.x} y2={pts.rElbow.y} />
            <line x1={pts.rElbow.x} y1={pts.rElbow.y} x2={pts.rWrist.x} y2={pts.rWrist.y} />

            {/* Pelvis / Hips */}
            <line x1={pts.lHip.x} y1={pts.lHip.y} x2={pts.rHip.x} y2={pts.rHip.y} strokeWidth="4" />

            {/* Left Leg */}
            <line x1={pts.lHip.x} y1={pts.lHip.y} x2={pts.lKnee.x} y2={pts.lKnee.y} strokeWidth="4" />
            <line x1={pts.lKnee.x} y1={pts.lKnee.y} x2={pts.lAnkle.x} y2={pts.lAnkle.y} strokeWidth="3.5" />

            {/* Right Leg */}
            <line x1={pts.rHip.x} y1={pts.rHip.y} x2={pts.rKnee.x} y2={pts.rKnee.y} strokeWidth="4" />
            <line x1={pts.rKnee.x} y1={pts.rKnee.y} x2={pts.rAnkle.x} y2={pts.rAnkle.y} strokeWidth="3.5" />
          </g>

          {/* Angle Arcs & Annotations */}
          {showAngles && activePose === 'squat' && (
            <g>
              {/* Left Knee Flexion Arc */}
              <circle cx={pts.lKnee.x} cy={pts.lKnee.y} r="22" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5 3" />
              <rect x={pts.lKnee.x - 65} y={pts.lKnee.y - 12} width="48" height="20" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
              <text x={pts.lKnee.x - 41} y={pts.lKnee.y + 2} fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                86°
              </text>

              {/* Right Knee Flexion Arc */}
              <circle cx={pts.rKnee.x} cy={pts.rKnee.y} r="22" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5 3" />
              <rect x={pts.rKnee.x + 18} y={pts.rKnee.y - 12} width="48" height="20" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
              <text x={pts.rKnee.x + 42} y={pts.rKnee.y + 2} fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                88°
              </text>

              {/* Torso Inclination */}
              <rect x={175} y={170} width="50" height="20" rx="4" fill="#0f172a" stroke="#14b8a6" strokeWidth="1" />
              <text x={200} y={184} fill="#2dd4bf" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                Tilt: 18°
              </text>
            </g>
          )}

          {showAngles && activePose === 'curl' && (
            <g>
              {/* Left Elbow Flexion Arc */}
              <circle cx={pts.lElbow.x} cy={pts.lElbow.y} r="24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5 3" />
              <rect x={pts.lElbow.x - 65} y={pts.lElbow.y - 12} width="52" height="20" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
              <text x={pts.lElbow.x - 39} y={pts.lElbow.y + 2} fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                42°
              </text>

              {/* Right Arm Extension */}
              <rect x={pts.rElbow.x + 15} y={pts.rElbow.y - 10} width="54" height="20" rx="4" fill="#0f172a" stroke="#14b8a6" strokeWidth="1" />
              <text x={pts.rElbow.x + 42} y={pts.rElbow.y + 4} fill="#2dd4bf" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                Ext: 165°
              </text>
            </g>
          )}

          {/* Keypoint Nodes (Dots) */}
          {Object.entries(pts).map(([name, pt]) => (
            <g key={name}>
              <circle cx={pt.x} cy={pt.y} r="6" fill="#0f172a" stroke="#14b8a6" strokeWidth="2.5" />
              <circle cx={pt.x} cy={pt.y} r="2.5" fill="#38bdf8" />
            </g>
          ))}
        </svg>

        {/* Bottom Metrics Pill */}
        <div className="absolute bottom-3 inset-x-3 bg-slate-900/90 backdrop-blur-xs border border-slate-700/80 rounded-lg px-3 py-2 flex items-center justify-between text-[11px] text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-teal-400 font-semibold font-mono">POSE SKELETON</span>
            <span className="text-slate-500">•</span>
            <span className="font-mono text-slate-300">33 Landmark Nodes</span>
          </div>
          <button
            onClick={() => setShowAngles(!showAngles)}
            className="text-[10px] text-teal-300 hover:text-white underline cursor-pointer"
          >
            {showAngles ? 'Hide Angles' : 'Show Angles'}
          </button>
        </div>
      </div>

      {/* Feature summary caption */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 text-slate-700 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          Planned Kinematic Angle Estimation
        </span>
        <span className="text-[11px] text-slate-400">Offline Frame Extraction</span>
      </div>
    </div>
  );
}

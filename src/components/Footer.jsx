import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Platform Description */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">PhysioVision AI</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              <strong className="text-slate-200">PhysioVision AI</strong> is an intelligent computer vision platform for physiotherapy movement recognition, kinematic joint angle calculation, and posture analysis from uploaded video recordings.
            </p>
            <div className="inline-flex items-center gap-2 text-xs bg-slate-800 text-teal-400 px-3 py-1.5 rounded-lg border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Asynchronous Video Computer Vision • Biomechanical Modeling</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-teal-400 transition-colors">Analyse Video</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-teal-400 transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors">Platform Architecture</Link>
              </li>
            </ul>
          </div>

          {/* System & Architecture */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Architecture</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                <span>React 18 + Vite Frontend</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                <span>Tailwind CSS Architecture</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                <span>FastAPI Python Computer Vision Backend</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                <span>MediaPipe & OpenCV Kinematic Pipeline</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Clinical Disclaimer Banner */}
        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-slate-400">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-relaxed">
            <strong className="text-amber-300">Biomechanical Analysis Disclaimer:</strong> This application provides computer-vision-based estimates for movement patterns and joint angles. It does not constitute a clinical medical diagnosis, prescription, or doctor-approved treatment plan. Always consult a licensed physical therapist or healthcare professional before modifying a rehabilitation regimen.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PhysioVision AI • Physiotherapy Movement Recognition & Posture Feedback</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Offline-Video-Based • No Live Camera Tracking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud,
  Activity,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Compass,
  FileCheck2,
  Video,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import PoseSkeletonDemo from '../components/PoseSkeletonDemo';

export default function Home() {
  const features = [
    {
      title: 'Exercise Recognition',
      description: 'Identifies specific physiotherapy movements (squats, bicep curls, shoulder flexion, knee extension) from spatial-temporal pose landmark keypoints.',
      icon: Activity,
      tag: 'Computer Vision',
    },
    {
      title: 'Posture Assessment',
      description: 'Computes anatomical joint angles and evaluates range-of-motion benchmarks against clinical rehabilitation guidelines without live camera intrusion.',
      icon: Compass,
      tag: 'Kinematics',
    },
    {
      title: 'Personalised Corrective Feedback',
      description: 'Generates structured observations, highlights potential form compensations (e.g. knee valgus, trunk sway), and suggests actionable movement cues.',
      icon: FileCheck2,
      tag: 'Rehab Guidance',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Upload Video',
      description: 'Upload a pre-recorded video of your exercise in MP4, MOV, or WebM format from your computer or phone.',
      icon: Video,
    },
    {
      step: '02',
      title: 'AI Analysis',
      description: 'The planned backend extracts frames, detects 33 landmark coordinates, and measures spatial joint angles.',
      icon: Cpu,
    },
    {
      step: '03',
      title: 'View Results',
      description: 'Review recognized movements, posture deviations, repetition counts, and biomechanical feedback cards.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Copy, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="teal" dot>
                AI Movement & Posture Analysis
              </Badge>
              <Badge variant="slate">
                Uploaded Video Only • No Live Camera
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Understand Your <br className="hidden sm:inline" />
              <span className="text-teal-600 bg-clip-text">Physiotherapy Movements</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              An intelligent, privacy-friendly assessment application that analyzes previously recorded physiotherapy exercise videos. Designed to recognize exercises, track joint angles, and evaluate posture form using modern computer vision techniques.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link to="/upload" id="hero-cta-analyse">
                <Button size="lg" icon={UploadCloud} fullWidth className="sm:w-auto">
                  Analyse Your Video
                </Button>
              </Link>
              <Link to="/how-it-works" id="hero-cta-how-it-works">
                <Button variant="secondary" size="lg" icon={HelpCircle} fullWidth className="sm:w-auto">
                  How It Works
                </Button>
              </Link>
            </div>

            {/* Key Value Highlights */}
            <div className="pt-4 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Pre-recorded Video Input</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Biomechanical Angles</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Actionable Form Cues</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Pose Demo Illustration */}
          <div className="lg:col-span-5">
            <PoseSkeletonDemo />
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="bg-slate-100/60 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <Badge variant="teal" size="sm">Core Capabilities</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Built for Rehabilitation Movement Analysis
            </h2>
            <p className="text-sm text-slate-600">
              Designed around the clinical need for objective posture feedback during home-based physiotherapy exercises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition-all">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
                        {feature.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      {feature.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-semibold text-teal-600 group-hover:text-teal-700">
                    <span>Explore pipeline specification</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3-Step Simple Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <Badge variant="slate" size="sm">How It Operates</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Simple Three-Step Workflow
          </h2>
          <p className="text-sm text-slate-600">
            From your recorded MP4 or MOV video file to comprehensive joint angle and posture reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-card flex flex-col items-start"
              >
                <div className="w-full flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black font-mono text-slate-200">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link to="/upload">
            <Button size="lg" icon={UploadCloud}>
              Start Video Analysis Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Architecture & Engineering Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 bg-slate-800/80 px-3 py-1 rounded-full border border-teal-500/30">
                <Cpu className="w-4 h-4 text-teal-400" />
                <span>Asynchronous Computer Vision Engine</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Offline Video Processing for Objective Movement Analysis
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Unlike invasive live camera tracking that demands continuous high-bandwidth streaming, this platform focuses on asynchronous, post-recording video analysis. Users record at their convenience, and the system extracts keyframe poses for reliable biomechanical assessment.
              </p>
            </div>
            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
              <Link to="/about">
                <Button variant="outline" fullWidth className="border-teal-400 text-teal-300 hover:bg-teal-950/40">
                  Platform Architecture
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="secondary" fullWidth className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700">
                  View Pipeline Specs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, UploadCloud, FileVideo, Target, ShieldAlert } from 'lucide-react';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { analyzeVideo, SAMPLE_ASSESSMENT_DATA } from '../services/api';
import { EXERCISE_OPTIONS } from '../components/ExerciseSelector';

export default function Analysis() {
  const location = useLocation();
  const navigate = useNavigate();

  // State from location
  const videoFile = location.state?.videoFile;
  const metadata = location.state?.metadata || {};
  const exerciseType = location.state?.exerciseType || 'squat';
  const exerciseNotes = location.state?.exerciseNotes || '';

  // Process states: 'ready' | 'uploading' | 'analysing' | 'completed' | 'failed'
  const [status, setStatus] = useState('uploading');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  const abortControllerRef = useRef(null);

  const exerciseInfo = EXERCISE_OPTIONS.find((e) => e.id === exerciseType) || {
    name: exerciseType,
  };

  const startAnalysis = async () => {
    if (!videoFile) return;

    setStatus('uploading');
    setCurrentStepIndex(0);
    setUploadProgress(0);
    setErrorMessage(null);

    abortControllerRef.current = new AbortController();

    try {
      // 1. Upload Video & call backend
      const result = await analyzeVideo({
        videoFile,
        exerciseType,
        notes: exerciseNotes,
        onUploadProgress: (percent) => {
          setUploadProgress(percent);
          if (percent >= 100) {
            setStatus('analysing');
            setCurrentStepIndex(1);
          }
        },
        signal: abortControllerRef.current.signal,
      });

      // Advance step indicator
      setCurrentStepIndex(2);
      await new Promise(r => setTimeout(r, 600));
      setCurrentStepIndex(3);
      await new Promise(r => setTimeout(r, 600));

      setStatus('completed');

      // Navigate to Results page with real backend response and original video
      navigate('/results', {
        state: {
          resultData: result,
          videoFile,
          metadata,
          exerciseType,
        },
      });
    } catch (err) {
      console.error('Analysis error:', err);
      setStatus('failed');
      setErrorMessage(err.message || 'An error occurred while connecting to the AI backend.');
    }
  };

  useEffect(() => {
    if (!videoFile) {
      // No video passed, return to upload
      return;
    }

    startAnalysis();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [videoFile]);

  // Fallback if accessed directly without selecting a video
  if (!videoFile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <FileVideo className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Video Selected</h2>
        <p className="text-sm text-slate-600">
          Please upload or select an exercise video file first before launching analysis.
        </p>
        <Link to="/upload">
          <Button icon={ArrowLeft}>Go to Video Upload</Button>
        </Link>
      </div>
    );
  }

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    navigate('/upload');
  };

  const handleInspectDemo = () => {
    // Navigate to Results with clearly marked mock data for offline interface testing
    navigate('/results', {
      state: {
        resultData: SAMPLE_ASSESSMENT_DATA,
        videoFile,
        metadata,
        exerciseType,
        isDemoInspection: true,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-left">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={status === 'failed' ? 'rose' : status === 'completed' ? 'emerald' : 'teal'} dot>
              Status: {status.toUpperCase()}
            </Badge>
            <span className="text-xs text-slate-400">Step 2 of 2</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Processing Physiotherapy Video
          </h1>
        </div>

        {/* Video & Exercise Chip */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-600 shadow-2xs">
          <span className="flex items-center gap-1 font-medium text-slate-900">
            <Target className="w-3.5 h-3.5 text-teal-600" />
            {exerciseInfo.name}
          </span>
          <span className="text-slate-300">|</span>
          <span className="font-mono truncate max-w-[160px]" title={videoFile.name}>
            {videoFile.name}
          </span>
        </div>
      </div>

      {/* Main Analysis Container */}
      {status === 'failed' ? (
        <ErrorMessage
          error={errorMessage}
          onRetry={startAnalysis}
          onReturn={handleCancel}
          onInspectDemo={handleInspectDemo}
        />
      ) : (
        <LoadingState
          currentStepIndex={currentStepIndex}
          uploadProgress={uploadProgress}
          videoFileName={videoFile.name}
          exerciseName={exerciseInfo.name}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

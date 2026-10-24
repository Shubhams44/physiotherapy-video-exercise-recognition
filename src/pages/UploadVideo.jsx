import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import VideoUploader from '../components/VideoUploader';
import VideoPreview from '../components/VideoPreview';
import ExerciseSelector from '../components/ExerciseSelector';
import Button from '../components/Button';
import Badge from '../components/Badge';

export default function UploadVideo() {
  const navigate = useNavigate();

  // State
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoMetadata, setVideoMetadata] = useState(null);
  const [exerciseType, setExerciseType] = useState('squat');
  const [exerciseNotes, setExerciseNotes] = useState('');
  const [formError, setFormError] = useState(null);

  // Handlers
  const handleVideoSelected = (file, metadata) => {
    setSelectedFile(file);
    setVideoMetadata(metadata);
    setFormError(null);
  };

  const handleRemoveVideo = () => {
    setSelectedFile(null);
    setVideoMetadata(null);
  };

  const handleStartAnalysis = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setFormError('Please select or drag-and-drop a video file first.');
      return;
    }

    if (!exerciseType) {
      setFormError('Please select the exercise being performed.');
      return;
    }

    setFormError(null);

    // Navigate to Analysis page with state payload
    navigate('/analysis', {
      state: {
        videoFile: selectedFile,
        metadata: videoMetadata,
        exerciseType,
        exerciseNotes,
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-left">
      {/* Page Header */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2">
          <Badge variant="teal" dot>
            Input Mode: Pre-Recorded Video
          </Badge>
          <span className="text-xs text-slate-400">Step 1 of 2</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Upload Your Exercise Video
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Select a previously recorded video of yourself performing a physiotherapy movement. Our system will prepare the video for pose landmark detection, joint angle calculations, and posture assessment.
        </p>
      </div>

      <form onSubmit={handleStartAnalysis} className="space-y-8">
        {/* Step 1: Video File Selection / Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Exercise Recording</span>
            </h2>
            {selectedFile && (
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Video Loaded
              </span>
            )}
          </div>

          {!selectedFile ? (
            <VideoUploader onVideoSelected={handleVideoSelected} />
          ) : (
            <VideoPreview
              file={selectedFile}
              metadata={videoMetadata}
              onReplace={() => {
                // Trigger file selection again
                const input = document.getElementById('video-file-input');
                if (input) input.click();
              }}
              onRemove={handleRemoveVideo}
            />
          )}
        </div>

        {/* Step 2: Exercise Type & Context */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">2</span>
            <span>Movement Configuration</span>
          </h2>

          <ExerciseSelector
            selectedExercise={exerciseType}
            onSelectExercise={(type) => {
              setExerciseType(type);
              setFormError(null);
            }}
            notes={exerciseNotes}
            onChangeNotes={setExerciseNotes}
          />
        </div>

        {/* Global Form Validation Error */}
        {formError && (
          <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-medium">{formError}</span>
          </div>
        )}

        {/* Submission Action Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>FastAPI Backend Submission Ready</span>
            </div>
            <p>Video will be sent to the AI analysis endpoint (POST /api/analyze-video).</p>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-3">
            <Button
              type="submit"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              fullWidth
              disabled={!selectedFile}
              className="sm:w-auto min-w-[200px]"
            >
              Analyse Video
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

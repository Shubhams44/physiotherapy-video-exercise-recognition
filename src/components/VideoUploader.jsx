import React, { useState, useRef } from 'react';
import { UploadCloud, FileVideo, AlertCircle, CheckCircle2, Info, Lightbulb, CameraOff } from 'lucide-react';
import { validateVideoFile, getVideoMetadata, formatFileSize, MAX_FILE_SIZE_MB } from '../utils/videoValidation';

export default function VideoUploader({ onVideoSelected, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = async (file) => {
    if (!file) return;
    setValidationError(null);
    setIsValidating(true);

    const validation = validateVideoFile(file);
    if (!validation.isValid) {
      setValidationError(validation.error);
      setIsValidating(false);
      return;
    }

    try {
      // Extract metadata (duration, resolution)
      const metadata = await getVideoMetadata(file);
      setIsValidating(false);
      onVideoSelected(file, metadata);
    } catch (err) {
      // Still allow upload if metadata reading failed, but warn user
      console.warn('Metadata extraction warning:', err);
      setIsValidating(false);
      onVideoSelected(file, { duration: null, width: null, height: null });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isValidating) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFiles(file);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (disabled || isValidating) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFiles(file);
      // Reset input value so re-selecting same file triggers change
      e.target.value = '';
    }
  };

  const triggerBrowse = () => {
    if (fileInputRef.current && !disabled && !isValidating) {
      fileInputRef.current.click();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerBrowse();
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden native input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
        className="hidden"
        id="video-file-input"
        disabled={disabled || isValidating}
      />

      {/* Drop Zone Card */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={triggerBrowse}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-label="Upload recorded exercise video by dropping file here or clicking to browse"
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
          isDragging
            ? 'border-teal-500 bg-teal-50/70 scale-[1.01] shadow-md shadow-teal-500/10'
            : 'border-slate-300 hover:border-teal-500 bg-white hover:bg-slate-50/60 shadow-xs'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform ${
            isDragging ? 'bg-teal-600 text-white scale-110' : 'bg-teal-50 text-teal-600'
          }`}>
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Drag and drop your exercise video here
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            or click to browse from your device
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
              MP4, MOV, or WebM
            </span>
            <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
              Up to {MAX_FILE_SIZE_MB}MB
            </span>
            <span className="text-xs font-medium px-2.5 py-1 bg-teal-50 text-teal-700 rounded-md border border-teal-200">
              Pre-recorded Video Only
            </span>
          </div>

          <button
            type="button"
            className="text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 px-5 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            Browse Video Files
          </button>
        </div>

        {/* Validation Progress Overlay */}
        {isValidating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-sm font-medium text-slate-700">Verifying video integrity...</p>
          </div>
        )}
      </div>

      {/* Validation Error Message */}
      {validationError && (
        <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-semibold block mb-0.5">Validation Error</strong>
            <span>{validationError}</span>
          </div>
        </div>
      )}

      {/* Recording Best Practices Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 text-left">
        <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm mb-3">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Tips for Optimal Computer Vision Recognition</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span><strong>Full Body Visibility:</strong> Ensure all relevant exercise joints (shoulders, hips, knees, ankles) stay within the video frame.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span><strong>Adequate Lighting:</strong> Record in a well-lit space without strong backlighting or harsh shadows across your body.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span><strong>Stable Camera:</strong> Place your phone or camera on a stable tripod or flat surface at approximately waist/chest height.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span><strong>Unobstructed Movement:</strong> Wear form-fitting or clear contrasting athletic wear for clean pose landmark detection.</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center gap-2 text-[11px] text-slate-500">
          <CameraOff className="w-3.5 h-3.5 text-slate-400" />
          <span>Privacy note: This application only processes uploaded video files. Your camera is never accessed or streamed.</span>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { FileVideo, Clock, HardDrive, Trash2, RefreshCw, Maximize2 } from 'lucide-react';
import { formatFileSize, formatDuration } from '../utils/videoValidation';
import Button from './Button';

export default function VideoPreview({
  file,
  metadata = {},
  onReplace,
  onRemove,
  disabled = false,
}) {
  const [videoUrl, setVideoUrl] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!file) {
      setVideoUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!file) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all">
      {/* Video Player Container */}
      <div className="relative bg-slate-950 aspect-video flex items-center justify-center overflow-hidden">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain"
          >
            Your browser does not support HTML5 video preview.
          </video>
        ) : (
          <div className="text-slate-400 text-sm flex items-center gap-2">
            <FileVideo className="w-6 h-6 animate-pulse" />
            <span>Loading preview...</span>
          </div>
        )}

        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-mono border border-slate-700/50">
          Selected Video
        </div>
      </div>

      {/* Video Metadata Bar */}
      <div className="p-4 sm:p-5 bg-white border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <FileVideo className="w-4 h-4 text-teal-600 shrink-0" />
              <h4 className="font-semibold text-slate-900 text-sm truncate" title={file.name}>
                {file.name}
              </h4>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-mono">
                <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                {formatFileSize(file.size)}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Duration: {formatDuration(metadata.duration)}
              </span>
              {metadata.width && metadata.height && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-slate-500">
                    {metadata.width}x{metadata.height}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons: Replace & Remove */}
          <div className="flex items-center gap-2 shrink-0">
            {onReplace && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={RefreshCw}
                onClick={onReplace}
                disabled={disabled}
              >
                Replace
              </Button>
            )}
            {onRemove && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon={Trash2}
                onClick={onRemove}
                disabled={disabled}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

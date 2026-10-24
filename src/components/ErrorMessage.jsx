import React from 'react';
import { ServerCrash, AlertTriangle, RefreshCw, ArrowLeft, Terminal, Sparkles } from 'lucide-react';
import Button from './Button';
import { API_BASE_URL } from '../services/api';

export default function ErrorMessage({
  error,
  onRetry,
  onReturn,
  onInspectDemo,
}) {
  const isBackendUnreachable =
    error &&
    (error.includes('unreachable') ||
      error.includes('offline') ||
      error.includes('Network Error') ||
      error.includes('Failed to fetch') ||
      error.includes('FastAPI'));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Icon & Title */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          {isBackendUnreachable ? (
            <ServerCrash className="w-8 h-8 text-amber-600" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-rose-600" />
          )}
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          {isBackendUnreachable ? 'FastAPI Backend Required' : 'Video Analysis Failed'}
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          {isBackendUnreachable
            ? 'The frontend is working properly, but could not connect to the Python AI backend service.'
            : 'An issue occurred during video processing. Please review the details below.'}
        </p>
      </div>

      {/* Error Details Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono text-slate-700 break-words">
        <span className="font-semibold text-slate-900 block mb-1">Status Message:</span>
        {error || 'Unknown communication error.'}
      </div>

      {/* Developer Instructions for Backend */}
      {isBackendUnreachable && (
        <div className="bg-slate-900 text-slate-200 rounded-xl p-4 sm:p-5 text-xs space-y-3 font-sans">
          <div className="flex items-center gap-2 text-teal-400 font-semibold">
            <Terminal className="w-4 h-4" />
            <span>FastAPI Server Instructions:</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            To enable live computer vision processing, start your Python FastAPI server locally:
          </p>
          <div className="bg-black/60 rounded-lg p-3 font-mono text-[12px] text-teal-300 border border-slate-800 select-all">
            uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
          </div>
          <p className="text-slate-400 text-[11px]">
            Target Base URL configured in <code className="text-teal-300">.env</code>: <span className="underline">{API_BASE_URL}</span>
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {onRetry && (
          <Button
            variant="primary"
            size="md"
            icon={RefreshCw}
            onClick={onRetry}
          >
            Retry Connection
          </Button>
        )}

        {/* Option to inspect UI with clearly labeled mock data */}
        {onInspectDemo && (
          <Button
            variant="secondary"
            size="md"
            icon={Sparkles}
            onClick={onInspectDemo}
            title="Inspect the completed results dashboard layout using sample test data"
          >
            Inspect Demo Results Dashboard
          </Button>
        )}

        {onReturn && (
          <Button
            variant="ghost"
            size="md"
            icon={ArrowLeft}
            onClick={onReturn}
          >
            Back to Upload
          </Button>
        )}
      </div>

      {onInspectDemo && (
        <p className="text-center text-[11px] text-slate-400">
          * Demo Results mode allows inspecting the metrics, charts, and feedback layout when running in offline preview mode.
        </p>
      )}
    </div>
  );
}

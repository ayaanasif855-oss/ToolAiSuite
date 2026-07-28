import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  message: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, message }) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm my-4">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-emerald-500 animate-spin shrink-0" />
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {message || 'Processing document locally in browser...'}
          </span>
        </div>
        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
          {Math.min(100, Math.max(0, progress))}%
        </span>
      </div>

      <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>

      <div className="mt-2 text-right">
        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          100% Client-Side Execution • CPU Memory Processing
        </span>
      </div>
    </div>
  );
};

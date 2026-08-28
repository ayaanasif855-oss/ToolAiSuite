import React from 'react';
import { ShieldCheck, Lock, Cpu, ServerOff } from 'lucide-react';

interface TrustBannerProps {
  compact?: boolean;
}

export const TrustBanner: React.FC<TrustBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>100% In-Browser Isolation: Files never leave your device</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold text-slate-900 dark:text-slate-100">100% Client-Side Privacy:</span>
          <span className="text-slate-600 dark:text-slate-400">Your files are processed locally in your browser memory. Zero server uploads.</span>
        </div>
        <div className="hidden lg:flex items-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-500" /> WebAssembly Native
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-slate-500" /> Local CPU Compute
          </span>
          <span className="flex items-center gap-1.5">
            <ServerOff className="w-3.5 h-3.5 text-slate-500" /> Zero Storage Logs
          </span>
        </div>
      </div>
    </div>
  );
};

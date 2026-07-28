import React from 'react';
import { ShieldCheck, Lock, Cpu, ServerOff } from 'lucide-react';

interface TrustBannerProps {
  compact?: boolean;
}

export const TrustBanner: React.FC<TrustBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>100% Secure & Private: Files never leave your browser</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-emerald-900/10 via-teal-900/10 to-emerald-900/10 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border-y border-emerald-500/20 py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0 animate-pulse" />
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">100% Client-Side Privacy:</span>
          <span>Your files are processed locally in your browser memory. Zero server uploads.</span>
        </div>
        <div className="hidden lg:flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" /> WebAssembly Native
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-500" /> Local CPU Compute
          </span>
          <span className="flex items-center gap-1.5">
            <ServerOff className="w-3.5 h-3.5 text-emerald-500" /> Zero Storage Logs
          </span>
        </div>
      </div>
    </div>
  );
};

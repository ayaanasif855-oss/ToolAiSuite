import React from 'react';

interface AdSensePlaceholderProps {
  slot?: string;
  format?: 'banner' | 'rectangle' | 'responsive';
  className?: string;
}

export const AdSensePlaceholder: React.FC<AdSensePlaceholderProps> = ({
  format = 'banner',
  className = ''
}) => {
  return (
    <div className={`w-full my-6 flex justify-center ${className}`}>
      {/* <!-- Google AdSense Unit Placeholder --> */}
      <div
        className={`w-full max-w-4xl min-h-[100px] border border-dashed border-slate-300 dark:border-slate-800 rounded-xl bg-slate-100/50 dark:bg-slate-900/40 p-4 flex flex-col items-center justify-center text-center transition-all`}
        data-adsense-slot={format}
      >
        <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-600 font-semibold mb-1">
          Advertisement
        </span>
        <div className="text-xs text-slate-500 dark:text-slate-500 font-mono">
          Google AdSense Container Placeholder ({format})
        </div>
      </div>
    </div>
  );
};

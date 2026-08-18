import React, { useEffect, useRef } from 'react';

interface AdSensePlaceholderProps {
  slot?: string;
  format?: 'banner' | 'rectangle' | 'responsive' | 'auto';
  className?: string;
}

export const AdSensePlaceholder: React.FC<AdSensePlaceholderProps> = ({
  slot,
  format = 'responsive',
  className = ''
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && !isLoaded.current && adRef.current) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoaded.current = true;
      }
    } catch (e) {
      // AdSense script will load or already handled
    }
  }, []);

  return (
    <div className={`w-full my-8 flex flex-col items-center justify-center ${className}`} id="adsense-placement-wrapper">
      <div className="w-full max-w-4xl text-center">
        <span className="block text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-2">
          Advertisement
        </span>
        <div className="min-h-[90px] w-full rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center overflow-hidden p-2">
          <ins
            ref={adRef}
            className="adsbygoogle w-full"
            style={{ display: 'block', textAlign: 'center' }}
            data-ad-client="ca-pub-5165542863825379"
            data-ad-slot={slot || "auto"}
            data-ad-format={format === 'banner' ? 'horizontal' : format === 'rectangle' ? 'rectangle' : 'auto'}
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
};


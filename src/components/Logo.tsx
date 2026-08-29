import React from 'react';
import logoImg from '../assets/images/universal_tool_logo_1787982630287.jpg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { img: 'w-7 h-7', text: 'text-base sm:text-lg', badge: 'text-[9px]' },
    md: { img: 'w-8 h-8 sm:w-9 sm:h-9', text: 'text-lg sm:text-xl', badge: 'text-[10px]' },
    lg: { img: 'w-10 h-10 sm:w-11 sm:h-11', text: 'text-xl sm:text-2xl', badge: 'text-xs' },
    xl: { img: 'w-14 h-14 sm:w-16 sm:h-16', text: 'text-3xl sm:text-4xl', badge: 'text-sm' }
  };

  const { img, text } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className={`relative ${img} rounded-xl overflow-hidden shadow-xs border border-indigo-500/20 dark:border-indigo-400/20 bg-slate-900 shrink-0 group-hover:scale-105 transition-transform duration-200`}>
        <img
          src={logoImg}
          alt="ToolAISuite Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-extrabold tracking-tight text-slate-900 dark:text-slate-100 ${text}`}>
            ToolAI<span className="text-indigo-600 dark:text-indigo-400">Suite</span>
          </span>
        </div>
      )}
    </div>
  );
};

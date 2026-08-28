import React from 'react';
import {
  FileStack,
  Scissors,
  Minimize2,
  Image,
  FileImage,
  FileText,
  Unlock,
  RotateCw,
  Stamp,
  ScanText,
  AlignLeft,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Type,
  ListFilter,
  Space,
  KeyRound,
  Calendar,
  Percent
} from 'lucide-react';
import { ToolMeta } from '../types';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  FileStack,
  Scissors,
  Minimize2,
  Image,
  FileImage,
  FileText,
  Unlock,
  RotateCw,
  Stamp,
  ScanText,
  AlignLeft,
  QrCode,
  Type,
  ListFilter,
  Space,
  KeyRound,
  Calendar,
  Percent
};

const toolColorMap: Record<string, string> = {
  'merge-pdf': 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
  'split-pdf': 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400',
  'compress-pdf': 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400',
  'pdf-to-jpg': 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
  'image-to-pdf': 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400',
  'pdf-to-word': 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
  'unlock-pdf': 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400',
  'rotate-pdf': 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
  'watermark-pdf': 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
  'add-watermark': 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
  'ocr-pdf': 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
  'word-counter': 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
  'case-converter': 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400',
  'duplicate-line-remover': 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
  'extra-space-remover': 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400',
  'qr-code-generator': 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
  'password-generator': 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
  'age-calculator': 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
  'percentage-calculator': 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
};

interface ToolCardProps {
  tool: ToolMeta;
  onClick: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  const IconComponent = iconMap[tool.iconName] || FileText;
  const badgeColors = toolColorMap[tool.id] || 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400';

  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors duration-150 cursor-pointer flex flex-col justify-between"
      id={`tool-card-${tool.id}`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${badgeColors}`}>
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {tool.badge}
              </span>
            )}
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
              {tool.category}
            </span>
          </div>
        </div>

        <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
          {tool.name}
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {tool.shortDesc}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" /> 100% In-Browser
        </span>
        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          Open <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};

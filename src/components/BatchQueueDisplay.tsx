import React from 'react';
import {
  FileText,
  FileImage,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  Download,
  Archive,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatBytes } from '../utils/pdf/pdfSetup';

export interface BatchOutputItem {
  fileName: string;
  blob: Blob;
  size: number;
  dataUrl?: string;
  pageRange?: string;
  parentFileName?: string;
}

export interface BatchQueueItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
  outputs: BatchOutputItem[];
  error?: string;
}

interface BatchQueueDisplayProps {
  items: BatchQueueItem[];
  isProcessing: boolean;
  overallProgress: number;
  overallMessage: string;
  onDownloadZip: () => void;
  onDownloadItem: (item: BatchOutputItem) => void;
  isZipGenerating?: boolean;
}

export const BatchQueueDisplay: React.FC<BatchQueueDisplayProps> = ({
  items,
  isProcessing,
  overallProgress,
  overallMessage,
  onDownloadZip,
  onDownloadItem,
  isZipGenerating = false
}) => {
  const [expandedItemId, setExpandedItemId] = React.useState<string | null>(null);

  const completedCount = items.filter((i) => i.status === 'completed').length;
  const totalOutputsCount = items.reduce((acc, curr) => acc + curr.outputs.length, 0);
  const totalOutputsSize = items.reduce(
    (acc, curr) => acc + curr.outputs.reduce((s, o) => s + o.size, 0),
    0
  );
  const isFinished = !isProcessing && items.length > 0 && items.every((i) => i.status === 'completed' || i.status === 'error');

  return (
    <div className="w-full space-y-6">
      {/* Batch Header Summary Bar */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                Batch Queue ({completedCount} / {items.length} Files Processed)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {overallMessage || 'Processing batch files sequentially in client-side memory...'}
            </p>
          </div>

          {isFinished && totalOutputsCount > 0 && (
            <button
              onClick={onDownloadZip}
              disabled={isZipGenerating}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all shrink-0 disabled:opacity-50"
              id="download-consolidated-zip-button"
            >
              {isZipGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Compressing ZIP Archive...</span>
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4" />
                  <span>Download All as ZIP ({totalOutputsCount} files • {formatBytes(totalOutputsSize)})</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Overall Batch Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>Overall Batch Progress</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{overallProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-600 to-teal-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, overallProgress))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Queue Items List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Queue Processing Status ({items.length} Input Files)
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Total Generated Outputs: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{totalOutputsCount}</strong>
          </span>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {items.map((item, index) => {
            const isImg = item.file.type.includes('image');
            const isExpanded = expandedItemId === item.id;

            return (
              <div
                key={item.id}
                className={`border rounded-2xl p-4 sm:p-5 transition-all ${
                  item.status === 'processing'
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-700 shadow-sm'
                    : item.status === 'completed'
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    : item.status === 'error'
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* File Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        item.status === 'processing'
                          ? 'bg-indigo-600 text-white'
                          : item.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : item.status === 'error'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {item.status === 'processing' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : isImg ? (
                        <FileImage className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 font-mono">#{index + 1}</span>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                          {item.file.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        {formatBytes(item.file.size)} • {item.message}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    {/* Status Badge */}
                    <div>
                      {item.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                      {item.status === 'processing' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold animate-pulse">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> {item.progress}% Processing
                        </span>
                      )}
                      {item.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ready ({item.outputs.length} outputs)
                        </span>
                      )}
                      {item.status === 'error' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 text-xs font-bold">
                          <AlertCircle className="w-3.5 h-3.5" /> Failed
                        </span>
                      )}
                    </div>

                    {/* Expand Output Items Toggle */}
                    {item.outputs.length > 0 && (
                      <button
                        onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                        className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <span>{isExpanded ? 'Hide Outputs' : 'View Outputs'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Processing Progress Bar for this individual item */}
                {item.status === 'processing' && (
                  <div className="mt-3 space-y-1">
                    <div className="w-full bg-indigo-200/60 dark:bg-indigo-900/40 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-200"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Error Message if any */}
                {item.status === 'error' && item.error && (
                  <p className="mt-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 p-2.5 rounded-lg border border-rose-200 dark:border-rose-800">
                    {item.error}
                  </p>
                )}

                {/* Output List inside Item when Expanded */}
                {isExpanded && item.outputs.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Outputs from {item.file.name}:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.outputs.map((out, outIdx) => (
                        <div
                          key={outIdx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                              {out.fileName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {formatBytes(out.size)} {out.pageRange ? `• ${out.pageRange}` : ''}
                            </span>
                          </div>
                          <button
                            onClick={() => onDownloadItem(out)}
                            className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors flex items-center gap-1 shrink-0 font-semibold text-[11px]"
                          >
                            <Download className="w-3.5 h-3.5" /> Save
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

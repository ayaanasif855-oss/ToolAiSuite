import React, { useRef, useState } from 'react';
import { Upload, FileText, Trash2, ArrowUp, ArrowDown, FileImage, ShieldCheck } from 'lucide-react';
import { formatBytes } from '../utils/pdf/pdfSetup';

interface DragDropZoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  acceptTypes?: string;
  multiple?: boolean;
  maxFiles?: number;
  title?: string;
  subtitle?: string;
}

export const DragDropZone: React.FC<DragDropZoneProps> = ({
  files,
  onFilesChange,
  acceptTypes = '.pdf,application/pdf',
  multiple = true,
  title = 'Drag & Drop your files here',
  subtitle = 'or click to browse from your device (100% private, 0 server uploads)'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (multiple) {
        onFilesChange([...files, ...droppedFiles]);
      } else {
        onFilesChange([droppedFiles[0]]);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      if (multiple) {
        onFilesChange([...files, ...selectedFiles]);
      } else {
        onFilesChange([selectedFiles[0]]);
      }
    }
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange(updated);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;

    const updated = [...files];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);
    onFilesChange(updated);
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={acceptTypes}
        multiple={multiple}
        className="hidden"
        id="drag-drop-file-input"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
          isDragging
            ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 shadow-sm'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 animate-bounce">
          <Upload className="w-8 h-8" />
        </div>

        <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
          {title}
        </h4>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-4">
          {subtitle}
        </p>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Local Client Memory Processing Only</span>
        </div>
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-center gap-2">
              <span>Selected Files ({files.length})</span>
            </h5>
            <button
              onClick={() => onFilesChange([])}
              className="text-xs font-medium text-rose-500 hover:text-rose-600 dark:hover:text-rose-400"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {files.map((file, idx) => {
              const isImg = file.type.includes('image');
              return (
                <div
                  key={`${file.name}-${idx}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      {isImg ? <FileImage className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {file.name}
                      </p>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        {formatBytes(file.size)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {multiple && (
                      <>
                        <button
                          onClick={() => moveFile(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveFile(idx, 'down')}
                          disabled={idx === files.length - 1}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => removeFile(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

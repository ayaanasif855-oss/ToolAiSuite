import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ListFilter,
  Copy,
  Check,
  Download,
  Trash2,
  Sliders,
  Sparkles,
  ArrowDownAZ,
  ArrowUpAZ,
  RotateCcw
} from 'lucide-react';

export const DuplicateLineRemoverTool: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
    `apple\nbanana\napple\norange\nBANANA\nbanana\ngrape\napple`
  );
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [copied, setCopied] = useState<boolean>(false);

  // Compute cleaned lines
  const getCleanedText = (): { resultText: string; originalCount: number; uniqueCount: number; removedCount: number } => {
    if (!inputText) {
      return { resultText: '', originalCount: 0, uniqueCount: 0, removedCount: 0 };
    }

    let lines = inputText.split('\n');
    const originalCount = lines.length;

    if (trimWhitespace) {
      lines = lines.map((l) => l.trim());
    }

    if (removeEmptyLines) {
      lines = lines.filter((l) => l.length > 0);
    }

    // Deduplication logic
    const seen = new Set<string>();
    const uniqueLines: string[] = [];

    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        uniqueLines.push(line);
      }
    }

    if (sortOrder === 'asc') {
      uniqueLines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: caseSensitive ? 'variant' : 'base' }));
    } else if (sortOrder === 'desc') {
      uniqueLines.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: caseSensitive ? 'variant' : 'base' }));
    }

    const uniqueCount = uniqueLines.length;
    const removedCount = originalCount - uniqueCount;
    const resultText = uniqueLines.join('\n');

    return { resultText, originalCount, uniqueCount, removedCount };
  };

  const { resultText, originalCount, uniqueCount, removedCount } = getCleanedText();
  const reductionPercentage = originalCount > 0 ? Math.round((removedCount / originalCount) * 100) : 0;

  const copyToClipboard = async () => {
    if (!resultText) return;
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const downloadTxt = () => {
    if (!resultText) return;
    const blob = new Blob([resultText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deduplicated_lines_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-2xl font-black text-slate-800 dark:text-slate-200 block">
            {originalCount}
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Original Lines
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-center">
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 block">
            {uniqueCount}
          </span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Unique Lines
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 text-center">
          <span className="text-2xl font-black text-rose-700 dark:text-rose-300 block">
            {removedCount}
          </span>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            Duplicates Removed
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-center">
          <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300 block">
            {reductionPercentage}%
          </span>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Cleaned Savings
          </span>
        </div>
      </div>

      {/* Control Toggles */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-4 text-xs font-semibold">
        <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span>Case Sensitive Comparison</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200">
          <input
            type="checkbox"
            checked={trimWhitespace}
            onChange={(e) => setTrimWhitespace(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span>Trim Whitespace per Line</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200">
          <input
            type="checkbox"
            checked={removeEmptyLines}
            onChange={(e) => setRemoveEmptyLines(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span>Remove Empty Lines</span>
        </label>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-slate-400 font-normal">Sort:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
          >
            <option value="none">Original Order</option>
            <option value="asc">Alphabetical (A - Z)</option>
            <option value="desc">Reverse Alphabetical (Z - A)</option>
          </select>
        </div>
      </div>

      {/* Side-by-side Input vs Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Input List
            </label>
            <button
              type="button"
              onClick={() => setInputText('')}
              className="text-xs text-rose-500 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Clear Input
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your list with duplicate lines..."
            rows={10}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-mono focus:ring-2 focus:ring-indigo-500 shadow-inner"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Unique Output List
            </label>
            <span className="text-xs text-slate-400">
              {uniqueCount} unique lines
            </span>
          </div>
          <textarea
            readOnly
            value={resultText}
            placeholder="Unique output lines will appear here..."
            rows={10}
            className="w-full p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 text-slate-900 dark:text-slate-100 text-sm font-mono focus:ring-2 focus:ring-emerald-500 shadow-inner"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={copyToClipboard}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Unique List!' : 'Copy Clean List'}</span>
        </button>

        <button
          type="button"
          onClick={downloadTxt}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4 text-slate-500" /> Download Clean TXT File
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Space,
  Copy,
  Check,
  Download,
  Trash2,
  Sparkles,
  Clipboard,
  Zap
} from 'lucide-react';

export const ExtraSpaceRemoverTool: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
    `This   is   a   sample   text   with    unnecessary     extra     spaces.\n\n\nIt   also   has   multiple   blank   lines   and   tabs	between	words.`
  );

  const [removeExtraSpaces, setRemoveExtraSpaces] = useState<boolean>(true);
  const [trimLines, setTrimLines] = useState<boolean>(true);
  const [collapseBlankLines, setCollapseBlankLines] = useState<boolean>(true);
  const [removeTabs, setRemoveTabs] = useState<boolean>(true);
  const [removeAllLineBreaks, setRemoveAllLineBreaks] = useState<boolean>(false);

  const [copied, setCopied] = useState<boolean>(false);

  // Formatting logic
  const getCleanedText = (): { cleanedText: string; originalChars: number; cleanedChars: number; savedChars: number } => {
    if (!inputText) {
      return { cleanedText: '', originalChars: 0, cleanedChars: 0, savedChars: 0 };
    }

    let text = inputText;
    const originalChars = text.length;

    if (removeTabs) {
      text = text.replace(/\t+/g, ' ');
    }

    if (removeAllLineBreaks) {
      text = text.replace(/[\r\n]+/g, ' ');
    }

    let lines = text.split('\n');

    if (trimLines) {
      lines = lines.map((l) => l.trim());
    }

    if (removeExtraSpaces) {
      lines = lines.map((l) => l.replace(/ {2,}/g, ' '));
    }

    if (collapseBlankLines && !removeAllLineBreaks) {
      const resultLines: string[] = [];
      let consecutiveEmpty = 0;

      for (const line of lines) {
        if (line.length === 0) {
          consecutiveEmpty++;
          if (consecutiveEmpty <= 1) {
            resultLines.push(line);
          }
        } else {
          consecutiveEmpty = 0;
          resultLines.push(line);
        }
      }
      lines = resultLines;
    }

    let cleanedText = lines.join('\n');
    if (trimLines) {
      cleanedText = cleanedText.trim();
    }

    const cleanedChars = cleanedText.length;
    const savedChars = Math.max(0, originalChars - cleanedChars);

    return { cleanedText, originalChars, cleanedChars, savedChars };
  };

  const { cleanedText, originalChars, cleanedChars, savedChars } = getCleanedText();

  const copyToClipboard = async () => {
    if (!cleanedText) return;
    try {
      await navigator.clipboard.writeText(cleanedText);
      setCopied(true);
      confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const downloadTxt = () => {
    if (!cleanedText) return;
    const blob = new Blob([cleanedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleaned_text_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-2xl font-black text-slate-800 dark:text-slate-200 block">
            {originalChars}
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Original Characters
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-center">
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 block">
            {cleanedChars}
          </span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Cleaned Characters
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-center">
          <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300 block">
            -{savedChars}
          </span>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Unnecessary Bytes Removed
          </span>
        </div>
      </div>

      {/* Cleaning Toggles */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-semibold">
        <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200">
          <input
            type="checkbox"
            checked={removeExtraSpaces}
            onChange={(e) => setRemoveExtraSpaces(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span>Collapse Multiple Spaces into Single Space</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200">
          <input
            type="checkbox"
            checked={trimLines}
            onChange={(e) => setTrimLines(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span>Trim Leading & Trailing Spaces</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200">
          <input
            type="checkbox"
            checked={collapseBlankLines}
            onChange={(e) => setCollapseBlankLines(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span>Collapse Multiple Blank Lines</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200">
          <input
            type="checkbox"
            checked={removeTabs}
            onChange={(e) => setRemoveTabs(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span>Convert Tabs to Single Space</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200">
          <input
            type="checkbox"
            checked={removeAllLineBreaks}
            onChange={(e) => setRemoveAllLineBreaks(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <span>Remove All Line Breaks (Single Paragraph)</span>
        </label>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Raw Text Input
            </label>
            <button
              type="button"
              onClick={() => setInputText('')}
              className="text-xs text-rose-500 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Clear Text
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste text with messy spaces or tabs..."
            rows={10}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-sans focus:ring-2 focus:ring-indigo-500 shadow-inner"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Cleaned Output Text
            </label>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              Ready to copy
            </span>
          </div>
          <textarea
            readOnly
            value={cleanedText}
            placeholder="Cleaned text will appear here..."
            rows={10}
            className="w-full p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 text-slate-900 dark:text-slate-100 text-sm font-sans focus:ring-2 focus:ring-emerald-500 shadow-inner"
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
          <span>{copied ? 'Copied Clean Text!' : 'Copy Cleaned Text'}</span>
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

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Type,
  Copy,
  Check,
  Download,
  Trash2,
  Clipboard,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';

export const CaseConverterTool: React.FC = () => {
  const [text, setText] = useState<string>(
    'ToolAISuite is a 100% private, browser-based web utility application. Try converting this sample text!'
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Stats calculation
  const characterCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentenceCount = text.trim()
    ? (text.match(/[.!?]+(?=\s|$)/g) || []).length || (characterCount > 0 ? 1 : 0)
    : 0;
  const lineCount = text ? text.split('\n').length : 0;

  // Case Conversion Logic
  const toUppercase = () => setText(text.toUpperCase());
  const toLowercase = () => setText(text.toLowerCase());

  const toSentenceCase = () => {
    const result = text.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
    setText(result);
  };

  const toTitleCase = () => {
    const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v|vs|via)$/i;
    const result = text.toLowerCase().replace(/[A-Za-z0-9]+/g, (match, index) => {
      if (index === 0 || !smallWords.test(match)) {
        return match.charAt(0).toUpperCase() + match.slice(1);
      }
      return match.toLowerCase();
    });
    setText(result);
  };

  const toCapitalizedCase = () => {
    const result = text.replace(/\b\w/g, (char) => char.toUpperCase());
    setText(result);
  };

  const toAlternatingCase = () => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += i % 2 === 0 ? text[i].toLowerCase() : text[i].toUpperCase();
    }
    setText(result);
  };

  const toSlugCase = () => {
    const result = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setText(result);
  };

  const toCamelCase = () => {
    const result = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    setText(result);
  };

  const toPascalCase = () => {
    const camel = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    const result = camel.charAt(0).toUpperCase() + camel.slice(1);
    setText(result);
  };

  const toConstantCase = () => {
    const slug = text
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '_');
    setText(slug.toUpperCase());
  };

  const copyToClipboard = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.7 } });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setText(clipboardText);
      }
    } catch (err) {
      console.error('Clipboard paste failed:', err);
    }
  };

  const downloadTxt = () => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted_text_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      {/* Live Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-center">
          <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300 block">
            {characterCount}
          </span>
          <span className="text-xs font-bold text-indigo-500/80 dark:text-indigo-400 uppercase tracking-wider">
            Characters
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-center">
          <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 block">
            {wordCount}
          </span>
          <span className="text-xs font-bold text-emerald-500/80 dark:text-emerald-400 uppercase tracking-wider">
            Words
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 text-center">
          <span className="text-2xl font-black text-purple-700 dark:text-purple-300 block">
            {sentenceCount}
          </span>
          <span className="text-xs font-bold text-purple-500/80 dark:text-purple-400 uppercase tracking-wider">
            Sentences
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 text-center">
          <span className="text-2xl font-black text-amber-700 dark:text-amber-300 block">
            {lineCount}
          </span>
          <span className="text-xs font-bold text-amber-500/80 dark:text-amber-400 uppercase tracking-wider">
            Lines
          </span>
        </div>
      </div>

      {/* Main Text Editor Box */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Text Editor Input
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={pasteFromClipboard}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Clipboard className="w-3.5 h-3.5" /> Paste
            </button>
            <button
              type="button"
              onClick={() => setText('')}
              className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here to convert..."
          rows={7}
          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
        />
      </div>

      {/* Action Buttons Grid for Conversions */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Select Target Case Transformation
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {[
            { label: 'UPPERCASE', action: toUppercase, desc: 'ALL CAPS' },
            { label: 'lowercase', action: toLowercase, desc: 'all small' },
            { label: 'Sentence case', action: toSentenceCase, desc: 'First letter cap' },
            { label: 'Title Case', action: toTitleCase, desc: 'Headline style' },
            { label: 'Capitalized Case', action: toCapitalizedCase, desc: 'Every Word Cap' },
            { label: 'aLtErNaTiNg cAsE', action: toAlternatingCase, desc: 'SpongeBob style' },
            { label: 'slug-case', action: toSlugCase, desc: 'url-friendly' },
            { label: 'camelCase', action: toCamelCase, desc: 'codeVariable' },
            { label: 'PascalCase', action: toPascalCase, desc: 'CodeClass' },
            { label: 'CONSTANT_CASE', action: toConstantCase, desc: 'ENUM_VAL' }
          ].map((btn, idx) => (
            <button
              key={idx}
              type="button"
              onClick={btn.action}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 text-slate-800 dark:text-slate-200 font-bold text-xs text-left transition-all group"
            >
              <div className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {btn.label}
              </div>
              <span className="text-[10px] font-normal text-slate-400 block mt-0.5">
                {btn.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Export & Copy Actions */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={copyToClipboard}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Converted Text'}</span>
        </button>

        <button
          type="button"
          onClick={downloadTxt}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4 text-slate-500" /> Download as TXT File
        </button>
      </div>
    </div>
  );
};

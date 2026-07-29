import React, { useState, useMemo } from 'react';
import {
  FileText,
  Copy,
  Check,
  Trash2,
  Clock,
  Mic,
  BarChart2,
  Sparkles,
  Type,
  Upload,
  AlignLeft,
  FileUp
} from 'lucide-react';
import { pdfjsLib, fileToArrayBuffer } from '../utils/pdf/pdfSetup';

export const WordCounterTool: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [ignoreStopWords, setIgnoreStopWords] = useState(true);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Common stop words to exclude from keyword density
  const STOP_WORDS = useMemo(
    () =>
      new Set([
        'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'against', 'between', 'into',
        'through', 'during', 'before', 'after', 'above', 'below', 'from', 'up', 'down', 'of',
        'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
        'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
        'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
        's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'i', 'me', 'my', 'myself',
        'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves',
        'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself',
        'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom',
        'this', 'that', 'these', 'those', 'am', 'have', 'has', 'had', 'having', 'do', 'does',
        'did', 'doing'
      ]),
    []
  );

  // Calculate Metrics
  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        words: 0,
        charactersWithSpaces: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
        topKeywords: []
      };
    }

    // Words count (splitting by whitespace)
    const wordArray = trimmed.split(/\s+/).filter(Boolean);
    const words = wordArray.length;

    // Characters
    const charactersWithSpaces = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;

    // Sentences (splitting by . ! ?)
    const sentenceArray = text
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const sentences = sentenceArray.length || (words > 0 ? 1 : 0);

    // Paragraphs (splitting by blank lines or newlines)
    const paragraphArray = text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    const paragraphs = paragraphArray.length || (words > 0 ? 1 : 0);

    // Reading & Speaking Time
    // Avg reading speed: ~200 wpm
    // Avg speaking speed: ~130 wpm
    const readingTimeMinutes = +(words / 200).toFixed(1);
    const speakingTimeMinutes = +(words / 130).toFixed(1);

    // Keyword Density Analysis
    const freqMap = new Map<string, number>();
    wordArray.forEach((w) => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/gi, '');
      if (clean.length > 1) {
        if (ignoreStopWords && STOP_WORDS.has(clean)) return;
        freqMap.set(clean, (freqMap.get(clean) || 0) + 1);
      }
    });

    const topKeywords = Array.from(freqMap.entries())
      .map(([word, count]) => ({
        word,
        count,
        density: +((count / words) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      words,
      charactersWithSpaces,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes,
      speakingTimeMinutes,
      topKeywords
    };
  }, [text, ignoreStopWords, STOP_WORDS]);

  // Handle file import and extraction
  const processFile = async (file: File) => {
    setIsFileLoading(true);
    setFileName(file.name);

    try {
      if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
        const arrayBuffer = await fileToArrayBuffer(file);
        const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const textContent = await page.getTextContent();
          const pageStr = textContent.items
            .map((item) => ('str' in item ? item.str : ''))
            .join(' ');

          fullText += (fullText ? '\n\n' : '') + pageStr;
        }

        setText(fullText);
      } else {
        // Plain text, markdown, or plain read
        const content = await file.text();
        setText(content);
      }
    } catch (err) {
      console.error('Failed to read file:', err);
    } finally {
      setIsFileLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Case Conversion Operations
  const convertCase = (type: 'upper' | 'lower' | 'title' | 'sentence' | 'slug' | 'clean') => {
    if (!text) return;
    if (type === 'upper') {
      setText(text.toUpperCase());
    } else if (type === 'lower') {
      setText(text.toLowerCase());
    } else if (type === 'title') {
      setText(
        text.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        )
      );
    } else if (type === 'sentence') {
      setText(
        text
          .toLowerCase()
          .replace(/(^\s*|\.\s*)([a-z])/g, (m) => m.toUpperCase())
      );
    } else if (type === 'slug') {
      const slug = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setText(slug);
    } else if (type === 'clean') {
      setText(text.replace(/\s+/g, ' ').trim());
    }
  };

  const copyToClipboard = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSampleText = () => {
    setText(
      `ToolAISuite provides fast, 100% private in-browser document processing. You can count words, sentences, and characters, or analyze keyword density for blog posts, essays, and reports without uploading files to any external cloud server. Data remains confidential and secure right in your browser memory!`
    );
  };

  return (
    <div className="w-full space-y-8">
      {/* Real-time Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-100">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block uppercase tracking-wider">
            Words
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono mt-1 block">
            {stats.words.toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
            Characters
          </span>
          <span className="text-xl sm:text-2xl font-extrabold font-mono mt-1 block">
            {stats.charactersWithSpaces.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 block">
            ({stats.charactersNoSpaces.toLocaleString()} no spaces)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
            Sentences
          </span>
          <span className="text-xl sm:text-2xl font-extrabold font-mono mt-1 block">
            {stats.sentences.toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
            Paragraphs
          </span>
          <span className="text-xl sm:text-2xl font-extrabold font-mono mt-1 block">
            {stats.paragraphs.toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-100">
          <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 block uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3" /> Reading Time
          </span>
          <span className="text-xl sm:text-2xl font-extrabold font-mono mt-1 block">
            {stats.readingTimeMinutes} <span className="text-xs font-normal">min</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100">
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 block uppercase tracking-wider flex items-center gap-1">
            <Mic className="w-3 h-3" /> Speaking Time
          </span>
          <span className="text-xl sm:text-2xl font-extrabold font-mono mt-1 block">
            {stats.speakingTimeMinutes} <span className="text-xs font-normal">min</span>
          </span>
        </div>
      </div>

      {/* Editor Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80">
        <div className="flex flex-wrap items-center gap-2">
          {/* File Upload Trigger */}
          <label className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm">
            <Upload className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{isFileLoading ? 'Extracting...' : 'Upload Doc / PDF / TXT'}</span>
            <input
              type="file"
              accept=".txt,.pdf,.doc,.docx,.md"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={loadSampleText}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-bold transition-colors"
          >
            Load Sample Text
          </button>

          {fileName && (
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
              📄 {fileName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyToClipboard}
            disabled={!text}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setText('');
              setFileName(null);
            }}
            disabled={!text}
            className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-700 dark:text-slate-200 hover:text-rose-600 text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Main Textarea & Drag Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-2xl transition-all ${
          isDragging
            ? 'ring-4 ring-indigo-500/50 border-indigo-500 scale-[0.99]'
            : ''
        }`}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here, or drag & drop a PDF / TXT / DOCX file..."
          rows={12}
          className="w-full p-5 text-sm sm:text-base rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-sans leading-relaxed shadow-sm"
          id="word-counter-textarea"
        />

        {isDragging && (
          <div className="absolute inset-0 bg-indigo-600/10 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border-2 border-dashed border-indigo-500 pointer-events-none">
            <FileUp className="w-10 h-10 animate-bounce mb-2" />
            <span className="text-base">Drop PDF or Document to Count Words</span>
          </div>
        )}
      </div>

      {/* Case Converter Toolset */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
          <Type className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Text Case Converters</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => convertCase('upper')}
            disabled={!text}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors disabled:opacity-40"
          >
            UPPERCASE
          </button>
          <button
            type="button"
            onClick={() => convertCase('lower')}
            disabled={!text}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors disabled:opacity-40"
          >
            lowercase
          </button>
          <button
            type="button"
            onClick={() => convertCase('title')}
            disabled={!text}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors disabled:opacity-40"
          >
            Title Case
          </button>
          <button
            type="button"
            onClick={() => convertCase('sentence')}
            disabled={!text}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors disabled:opacity-40"
          >
            Sentence case
          </button>
          <button
            type="button"
            onClick={() => convertCase('slug')}
            disabled={!text}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors disabled:opacity-40"
          >
            kebab-case-slug
          </button>
          <button
            type="button"
            onClick={() => convertCase('clean')}
            disabled={!text}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors disabled:opacity-40 flex items-center gap-1"
          >
            <AlignLeft className="w-3.5 h-3.5 text-teal-500" /> Clean Extra Spaces
          </button>
        </div>
      </div>

      {/* Top Keywords & Density Analysis */}
      {stats.topKeywords.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
              <BarChart2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Top Keyword Frequency & Density</span>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={ignoreStopWords}
                onChange={(e) => setIgnoreStopWords(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Ignore common stop words</span>
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.topKeywords.map((kw, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block truncate">
                    #{idx + 1} {kw.word}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {kw.density}% density
                  </span>
                </div>
                <span className="px-2 py-1 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold font-mono text-xs shrink-0">
                  {kw.count}x
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

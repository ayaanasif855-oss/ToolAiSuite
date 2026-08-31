import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';
import {
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sliders,
  Copy,
  Check,
  Layers,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  FileCheck,
  HelpCircle
} from 'lucide-react';
import { ToolMeta } from '../types';
import { TOOLS_DATA } from '../data/tools';
import { DragDropZone } from '../components/DragDropZone';
import { ProgressBar } from '../components/ProgressBar';
import { TrustBanner } from '../components/TrustBanner';
import { ToolCard } from '../components/ToolCard';
import {
  BatchQueueDisplay,
  BatchQueueItem,
  BatchOutputItem
} from '../components/BatchQueueDisplay';
import { downloadBlob, formatBytes } from '../utils/pdf/pdfSetup';

// Engine imports
import { mergePdfs } from '../utils/pdf/mergePdf';
import { splitPdf } from '../utils/pdf/splitPdf';
import { compressPdf, CompressionLevel } from '../utils/pdf/compressPdf';
import { imagesToPdf, PageSizeOption, OrientationOption, MarginOption } from '../utils/pdf/imageToPdf';
import { pdfToJpg } from '../utils/pdf/pdfToJpg';
import { pdfToWord } from '../utils/pdf/pdfToWord';
import { unlockPdf } from '../utils/pdf/unlockPdf';
import { rotatePdf } from '../utils/pdf/rotatePdf';
import { addWatermark, WatermarkOptions } from '../utils/pdf/addWatermark';
import { ocrDocument } from '../utils/pdf/ocrPdf';
import { WordCounterTool } from '../components/WordCounterTool';
import { QrCodeGeneratorTool } from '../components/QrCodeGeneratorTool';
import { CaseConverterTool } from '../components/CaseConverterTool';
import { DuplicateLineRemoverTool } from '../components/DuplicateLineRemoverTool';
import { ExtraSpaceRemoverTool } from '../components/ExtraSpaceRemoverTool';
import { PasswordGeneratorTool } from '../components/PasswordGeneratorTool';
import { AgeCalculatorTool } from '../components/AgeCalculatorTool';
import { PercentageCalculatorTool } from '../components/PercentageCalculatorTool';

interface ToolPageProps {
  tool: ToolMeta;
  navigate: (route: string) => void;
}

export const ToolPage: React.FC<ToolPageProps> = ({ tool, navigate }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Batch Queue State
  const [batchQueue, setBatchQueue] = useState<BatchQueueItem[]>([]);
  const [isZipGenerating, setIsZipGenerating] = useState(false);
  const [imageConversionMode, setImageConversionMode] = useState<'batch' | 'combine'>('batch');

  // Single Result state
  const [singleResult, setSingleResult] = useState<{
    blob: Blob;
    fileName: string;
    size: number;
    originalSize?: number;
    text?: string;
    docxBlob?: Blob;
    txtBlob?: Blob;
  } | null>(null);

  const [multiResults, setMultiResults] = useState<
    { blob: Blob; fileName: string; size: number; pageRange?: string; dataUrl?: string }[]
  >([]);

  // Tool Specific Config States
  const [splitMode, setSplitMode] = useState<'ranges' | 'all'>('ranges');
  const [customPageRanges, setCustomPageRanges] = useState('1');
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('recommended');
  const [pageSize, setPageSize] = useState<PageSizeOption>('a4');
  const [orientation, setOrientation] = useState<OrientationOption>('auto');
  const [margin, setMargin] = useState<MarginOption>('small');
  const [unlockPassword, setUnlockPassword] = useState('');
  const [rotateAngle, setRotateAngle] = useState<90 | 180 | 270>(90);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [watermarkColor, setWatermarkColor] = useState('#64748b');
  const [ocrLanguage, setOcrLanguage] = useState('eng');

  // FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedText, setCopiedText] = useState(false);

  const resetState = () => {
    setFiles([]);
    setIsProcessing(false);
    setProgress(0);
    setProgressMessage('');
    setErrorMsg(null);
    setSingleResult(null);
    setMultiResults([]);
    setBatchQueue([]);
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore confetti fallback
    }
  };

  const isBatchCapableTool = ['split-pdf', 'pdf-to-jpg', 'image-to-pdf'].includes(tool.id);

  const handleProcess = async () => {
    if (files.length === 0) {
      setErrorMsg('Please select or drag at least one file to process.');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    // If tool is batch capable AND (tool is split-pdf / pdf-to-jpg OR image-to-pdf in batch mode)
    const shouldRunBatch =
      isBatchCapableTool &&
      (tool.id === 'split-pdf' || tool.id === 'pdf-to-jpg' || (tool.id === 'image-to-pdf' && imageConversionMode === 'batch'));

    if (shouldRunBatch) {
      await processBatchQueue();
      return;
    }

    // Standard Non-Batch or Single-File Combined processing
    setProgress(5);
    setProgressMessage('Starting client-side processing...');

    const handleProgress = (pct: number, msg: string) => {
      setProgress(pct);
      setProgressMessage(msg);
    };

    try {
      if (tool.id === 'merge-pdf') {
        const res = await mergePdfs(files, handleProgress);
        setSingleResult(res);
      } else if (tool.id === 'compress-pdf') {
        const res = await compressPdf(files[0], compressionLevel, handleProgress);
        setSingleResult(res);
      } else if (tool.id === 'image-to-pdf') {
        // Combined mode
        const res = await imagesToPdf(files, pageSize, orientation, margin, handleProgress);
        setSingleResult(res);
      } else if (tool.id === 'pdf-to-word') {
        const res = await pdfToWord(files[0], handleProgress);
        setSingleResult({
          blob: res.blob,
          fileName: res.fileName,
          size: res.size,
          text: res.extractedText
        });
      } else if (tool.id === 'unlock-pdf') {
        const res = await unlockPdf(files[0], unlockPassword, handleProgress);
        setSingleResult(res);
      } else if (tool.id === 'rotate-pdf') {
        const res = await rotatePdf(files[0], rotateAngle, undefined, handleProgress);
        setSingleResult(res);
      } else if (tool.id === 'add-watermark') {
        const options: WatermarkOptions = {
          type: 'text',
          text: watermarkText,
          opacity: watermarkOpacity,
          color: watermarkColor,
          rotation: 45
        };
        const res = await addWatermark(files[0], options, handleProgress);
        setSingleResult(res);
      } else if (tool.id === 'ocr-pdf') {
        const res = await ocrDocument(files[0], ocrLanguage, handleProgress);
        setSingleResult({
          blob: res.pdfBlob,
          pdfBlob: res.pdfBlob,
          docxBlob: res.docxBlob,
          txtBlob: res.txtBlob,
          fileName: `${res.fileName}.pdf`,
          size: res.pdfBlob.size,
          text: res.text
        });
      }

      setIsProcessing(false);
      triggerCelebration();
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      setErrorMsg(err.message || 'An error occurred during local processing. Please check your input files.');
    }
  };

  // Batch Queue Engine for Split PDF, PDF to JPG, and Image to PDF (Batch Mode)
  const processBatchQueue = async () => {
    const initialItems: BatchQueueItem[] = files.map((file, idx) => ({
      id: `${file.name}-${idx}-${Date.now()}`,
      file,
      status: 'pending',
      progress: 0,
      message: 'In processing queue...',
      outputs: []
    }));

    setBatchQueue(initialItems);
    setProgress(0);
    setProgressMessage(`Batch processing 0 of ${files.length} files completed...`);

    const currentItems = [...initialItems];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Mark current item as processing
      currentItems[i] = {
        ...currentItems[i],
        status: 'processing',
        progress: 10,
        message: 'Starting local conversion...'
      };
      setBatchQueue([...currentItems]);

      const updateCurrentItem = (pct: number, msg: string) => {
        currentItems[i] = {
          ...currentItems[i],
          progress: pct,
          message: msg
        };
        setBatchQueue([...currentItems]);

        // Overall progress calculation
        const overall = Math.round(((i + pct / 100) / files.length) * 100);
        setProgress(overall);
        setProgressMessage(`Processing file ${i + 1} of ${files.length}: ${file.name}`);
      };

      try {
        let outputs: BatchOutputItem[] = [];

        if (tool.id === 'split-pdf') {
          const res = await splitPdf(file, splitMode, customPageRanges, updateCurrentItem);
          outputs = res.map((r) => ({
            fileName: r.fileName,
            blob: r.blob,
            size: r.size,
            pageRange: r.pageRange,
            parentFileName: file.name
          }));
        } else if (tool.id === 'pdf-to-jpg') {
          const res = await pdfToJpg(file, 2.0, updateCurrentItem);
          outputs = res.map((r) => ({
            fileName: r.fileName,
            blob: r.blob,
            size: r.blob.size,
            dataUrl: r.dataUrl,
            parentFileName: file.name
          }));
        } else if (tool.id === 'image-to-pdf') {
          const res = await imagesToPdf([file], pageSize, orientation, margin, updateCurrentItem);
          const cleanName = file.name.replace(/\.[^/.]+$/, '');
          outputs = [
            {
              fileName: `${cleanName}.pdf`,
              blob: res.blob,
              size: res.size,
              parentFileName: file.name
            }
          ];
        }

        currentItems[i] = {
          ...currentItems[i],
          status: 'completed',
          progress: 100,
          message: `Completed (${outputs.length} output file${outputs.length > 1 ? 's' : ''})`,
          outputs
        };
      } catch (err: any) {
        console.error(`Error processing ${file.name}:`, err);
        currentItems[i] = {
          ...currentItems[i],
          status: 'error',
          progress: 0,
          message: 'Processing failed',
          error: err.message || 'Error occurred during processing'
        };
      }

      setBatchQueue([...currentItems]);
      const finishedProgress = Math.round(((i + 1) / files.length) * 100);
      setProgress(finishedProgress);
    }

    setIsProcessing(false);
    setProgressMessage(`All ${files.length} batch file(s) processed!`);
    triggerCelebration();
  };

  // Consolidated ZIP Archive Download
  const handleDownloadBatchZip = async () => {
    setIsZipGenerating(true);
    try {
      const zip = new JSZip();
      const nameMap = new Map<string, number>();

      batchQueue.forEach((item) => {
        item.outputs.forEach((out) => {
          let name = out.fileName;
          if (nameMap.has(name)) {
            const count = nameMap.get(name)! + 1;
            nameMap.set(name, count);
            const extIdx = name.lastIndexOf('.');
            if (extIdx !== -1) {
              name = `${name.substring(0, extIdx)}_${count}${name.substring(extIdx)}`;
            } else {
              name = `${name}_${count}`;
            }
          } else {
            nameMap.set(name, 1);
          }
          zip.file(name, out.blob);
        });
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const cleanToolName = tool.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      downloadBlob(zipBlob, `ToolAISuite_${cleanToolName}_batch_outputs.zip`);
    } catch (err) {
      console.error('ZIP generation failed', err);
      setErrorMsg('Failed to create consolidated ZIP file. Please download outputs individually.');
    } finally {
      setIsZipGenerating(false);
    }
  };

  const copyExtractedText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const relatedTools = TOOLS_DATA.filter((t) => t.id !== tool.id).slice(0, 3);

  const hasBatchOutputs = batchQueue.length > 0;

  return (
    <div className="w-full py-10 bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Top Trust Banner */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <TrustBanner compact />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Tool Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {tool.name}
            </h1>
            {isBatchCapableTool && (
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Batch Ready
              </span>
            )}
          </div>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {tool.shortDesc}
          </p>
        </div>

        {/* MAIN TOOL WORKSPACE CONTAINER */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all my-6">
          {tool.id === 'word-counter' ? (
            <WordCounterTool />
          ) : tool.id === 'case-converter' ? (
            <CaseConverterTool />
          ) : tool.id === 'duplicate-line-remover' ? (
            <DuplicateLineRemoverTool />
          ) : tool.id === 'extra-space-remover' ? (
            <ExtraSpaceRemoverTool />
          ) : tool.id === 'qr-code-generator' ? (
            <QrCodeGeneratorTool />
          ) : tool.id === 'password-generator' ? (
            <PasswordGeneratorTool />
          ) : tool.id === 'age-calculator' ? (
            <AgeCalculatorTool />
          ) : tool.id === 'percentage-calculator' ? (
            <PercentageCalculatorTool />
          ) : !singleResult && multiResults.length === 0 && !hasBatchOutputs ? (
            <div>
              {/* Drag and Drop Zone */}
              <DragDropZone
                files={files}
                onFilesChange={setFiles}
                acceptTypes={
                  tool.id === 'image-to-pdf'
                    ? 'image/jpeg,image/png,image/webp,image/gif'
                    : '.pdf,application/pdf'
                }
                multiple={['merge-pdf', 'split-pdf', 'pdf-to-jpg', 'image-to-pdf'].includes(tool.id)}
                title={
                  isBatchCapableTool
                    ? 'Select or Drop Single / Multiple Files'
                    : 'Drag & Drop your files here'
                }
                subtitle={
                  isBatchCapableTool
                    ? 'Batch processing enabled: process multiple files at once in a queue with zero server uploads.'
                    : '100% private in-browser local processing.'
                }
              />

              {/* Tool Config Options */}
              {files.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                    <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Tool Configuration Options</span>
                  </div>

                  {/* Split PDF Options */}
                  {tool.id === 'split-pdf' && (
                    <div className="space-y-4">
                      {files.length > 1 && (
                        <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                          <Layers className="w-4 h-4 shrink-0" />
                          <span>
                            Batch Split Enabled: Processing {files.length} PDF documents in queue with selected split configuration.
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Split Method
                          </label>
                          <select
                            value={splitMode}
                            onChange={(e) => setSplitMode(e.target.value as any)}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="ranges">Extract Custom Page Ranges</option>
                            <option value="all">Extract Every Page as Separate PDF</option>
                          </select>
                        </div>

                        {splitMode === 'ranges' && (
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                              Page Ranges (e.g. 1-3, 5, 8-10)
                            </label>
                            <input
                              type="text"
                              value={customPageRanges}
                              onChange={(e) => setCustomPageRanges(e.target.value)}
                              placeholder="e.g. 1-2, 4, 7-10"
                              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Compress PDF Options */}
                  {tool.id === 'compress-pdf' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        Select Compression Preset
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: 'recommended', title: 'Recommended', desc: 'Best balance of quality & size' },
                          { id: 'extreme', title: 'Extreme', desc: 'Highest size reduction' },
                          { id: 'low', title: 'Low', desc: 'Preserves maximum image detail' }
                        ].map((preset) => (
                          <div
                            key={preset.id}
                            onClick={() => setCompressionLevel(preset.id as any)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              compressionLevel === preset.id
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40'
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60'
                            }`}
                          >
                            <span className="block font-bold text-slate-900 dark:text-slate-100 text-sm">
                              {preset.title}
                            </span>
                            <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {preset.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PDF to JPG Options */}
                  {tool.id === 'pdf-to-jpg' && files.length > 1 && (
                    <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                      <Layers className="w-4 h-4 shrink-0" />
                      <span>
                        Batch PDF to JPG Enabled: Processing {files.length} PDF documents in queue and converting all pages to high-quality JPGs.
                      </span>
                    </div>
                  )}

                  {/* Image to PDF Options */}
                  {tool.id === 'image-to-pdf' && (
                    <div className="space-y-4">
                      {files.length > 1 && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Batch Processing Mode
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div
                              onClick={() => setImageConversionMode('batch')}
                              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                                imageConversionMode === 'batch'
                                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                <Layers className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="block font-bold text-xs">Batch Mode (Separate PDFs)</span>
                                <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                                  Convert each image into its own individual PDF
                                </span>
                              </div>
                            </div>

                            <div
                              onClick={() => setImageConversionMode('combine')}
                              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                                imageConversionMode === 'combine'
                                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="block font-bold text-xs">Combined Mode (Single PDF)</span>
                                <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                                  Merge all {files.length} images into 1 PDF document
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Page Size
                          </label>
                          <select
                            value={pageSize}
                            onChange={(e) => setPageSize(e.target.value as any)}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                          >
                            <option value="a4">A4 Standard</option>
                            <option value="letter">US Letter</option>
                            <option value="fit">Fit to Image Size</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Orientation
                          </label>
                          <select
                            value={orientation}
                            onChange={(e) => setOrientation(e.target.value as any)}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                          >
                            <option value="auto">Auto Detect</option>
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Margins
                          </label>
                          <select
                            value={margin}
                            onChange={(e) => setMargin(e.target.value as any)}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                          >
                            <option value="small">Small Margin</option>
                            <option value="none">No Margin (Borderless)</option>
                            <option value="big">Big Margin</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Unlock PDF Options */}
                  {tool.id === 'unlock-pdf' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        PDF Open Password (If encrypted)
                      </label>
                      <input
                        type="password"
                        value={unlockPassword}
                        onChange={(e) => setUnlockPassword(e.target.value)}
                        placeholder="Enter password if required..."
                        className="w-full max-w-md p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}

                  {/* Rotate PDF Options */}
                  {tool.id === 'rotate-pdf' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Select Rotation Angle
                      </label>
                      <div className="flex gap-3">
                        {[
                          { angle: 90, label: '90° Clockwise' },
                          { angle: 180, label: '180° Flip' },
                          { angle: 270, label: '270° Counter-Clockwise' }
                        ].map((opt) => (
                          <button
                            key={opt.angle}
                            type="button"
                            onClick={() => setRotateAngle(opt.angle as any)}
                            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                              rotateAngle === opt.angle
                                ? 'border-indigo-600 bg-indigo-600 text-white'
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add Watermark Options */}
                  {tool.id === 'add-watermark' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Watermark Text
                        </label>
                        <input
                          type="text"
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Opacity ({Math.round(watermarkOpacity * 100)}%)
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.1"
                          value={watermarkOpacity}
                          onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                          className="w-full accent-indigo-600 mt-2"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Watermark Color
                        </label>
                        <input
                          type="color"
                          value={watermarkColor}
                          onChange={(e) => setWatermarkColor(e.target.value)}
                          className="w-full h-11 p-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {/* OCR PDF Options */}
                  {tool.id === 'ocr-pdf' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        OCR Recognition Language
                      </label>
                      <select
                        value={ocrLanguage}
                        onChange={(e) => setOcrLanguage(e.target.value)}
                        className="w-full max-w-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                      >
                        <option value="eng">English</option>
                        <option value="spa">Spanish (Español)</option>
                        <option value="fra">French (Français)</option>
                        <option value="deu">German (Deutsch)</option>
                        <option value="zho">Chinese (中文)</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Error Alert */}
              {errorMsg && (
                <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Standard Progress Bar for Non-Batch execution */}
              {isProcessing && !isBatchCapableTool && <ProgressBar progress={progress} message={progressMessage} />}

              {/* Action Button */}
              {files.length > 0 && !isProcessing && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleProcess}
                    className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-base shadow-xl shadow-indigo-500/20 hover:scale-[1.02] transition-all duration-200"
                    id="tool-action-execute-button"
                  >
                    {isBatchCapableTool && files.length > 1
                      ? `Execute Batch ${tool.name} (${files.length} Files)`
                      : `Execute ${tool.name} Now`}
                  </button>
                </div>
              )}
            </div>
          ) : hasBatchOutputs ? (
            /* BATCH QUEUE DISPLAY DISPLAY FOR SPLIT, PDF TO JPG, IMAGE TO PDF */
            <div>
              <BatchQueueDisplay
                items={batchQueue}
                isProcessing={isProcessing}
                overallProgress={progress}
                overallMessage={progressMessage}
                onDownloadZip={handleDownloadBatchZip}
                onDownloadItem={(item) => downloadBlob(item.blob, item.fileName)}
                isZipGenerating={isZipGenerating}
              />

              {!isProcessing && (
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button
                    onClick={resetState}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Process Another Batch / File
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* STANDARD SINGLE RESULT DISPLAY CARD */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">
                Processing Complete!
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                Your file has been processed 100% locally in your browser memory and is ready for download.
              </p>

              {/* Single File Result Card */}
              {singleResult && (
                <div className="max-w-md mx-auto bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 mb-6 text-left space-y-4">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold">Output File</span>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base truncate mt-0.5">
                      {singleResult.fileName}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        {singleResult.originalSize ? 'Compressed Size' : 'File Size'}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                        {formatBytes(singleResult.size)}
                      </span>
                    </div>

                    {singleResult.originalSize ? (
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Before vs After</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          {formatBytes(singleResult.originalSize)} → {formatBytes(singleResult.size)}{' '}
                          ({Math.max(0, Math.round(((singleResult.originalSize - singleResult.size) / singleResult.originalSize) * 100))}% Saved)
                        </span>
                      </div>
                    ) : null}
                  </div>


                  {/* Extracted Text Inspector for Word / OCR */}
                  {singleResult.text !== undefined && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Extracted Text Content (Editable)
                        </span>
                        <button
                          onClick={() => copyExtractedText(singleResult.text!)}
                          className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold"
                        >
                          {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedText ? 'Copied!' : 'Copy Text'}</span>
                        </button>
                      </div>
                      <textarea
                        value={singleResult.text}
                        onChange={(e) => {
                          const newText = e.target.value;
                          setSingleResult((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  text: newText,
                                  txtBlob: new Blob([newText], { type: 'text/plain;charset=utf-8' })
                                }
                              : null
                          );
                        }}
                        rows={6}
                        className="w-full p-3 text-xs font-mono rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Extracted text will appear here..."
                      />
                    </div>
                  )}

                  {/* Primary Download Buttons */}
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => downloadBlob(singleResult.blob, singleResult.fileName)}
                      className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
                    >
                      <Download className="w-4 h-4" /> Download File Now
                    </button>

                    {singleResult.txtBlob && (
                      <button
                        onClick={() =>
                          downloadBlob(
                            singleResult.txtBlob!,
                            singleResult.fileName.replace('.docx', '.txt')
                          )
                        }
                        className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all"
                      >
                        Download Plain Text (.txt)
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Multi Results */}
              {multiResults.length > 0 && (
                <div className="max-w-2xl mx-auto space-y-3 mb-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Extracted Output Files ({multiResults.length})
                  </div>
                  <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                    {multiResults.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <div className="min-w-0">
                            <span className="block font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                              {item.fileName}
                            </span>
                            <span className="block text-[10px] text-slate-400 font-mono">
                              {formatBytes(item.size)} {item.pageRange ? `• ${item.pageRange}` : ''}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => downloadBlob(item.blob, item.fileName)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-600 hover:text-white transition-colors flex items-center gap-1 shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Process Another File Button */}
              <button
                onClick={resetState}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Process Another Document
              </button>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* BOTTOM RICH PUBLISHER CONTENT SECTION (MANDATORY FOR ADSENSE)    */}
        {/* ================================================================= */}

        {/* SECTION 1: "How to Use [Tool Name] Online for Free" (4 Structured Step Cards) */}
        <section className="my-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Step-by-Step Guide</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              How to Use {tool.name} Online for Free
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {tool.seoContent.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tool.seoContent.howToSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group shadow-sm"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                    0{idx + 1}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base mb-2">
                    Step {idx + 1}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/40 flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  <span>100% In-Browser</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: Key Features & High-Performance Capabilities */}
        <section className="my-14 bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Core Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Key Features of {tool.name}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Designed with enterprise-grade security and client-side performance principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tool.seoContent.features.map((feat, idx) => {
              const parts = feat.split(':');
              const title = parts.length > 1 ? parts[0] : `Feature 0${idx + 1}`;
              const desc = parts.length > 1 ? parts.slice(1).join(':') : feat;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 flex items-start gap-4 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base mb-1">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Practical Use Cases Grid */}
          {tool.seoContent.useCases && tool.seoContent.useCases.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                Popular Practical Use Cases
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {tool.seoContent.useCases.map((uc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                    <span>{uc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SECTION 3: Frequently Asked Questions (Accordion) */}
        <section className="my-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Common questions regarding privacy, file limits, compatibility, and output quality.
            </p>
          </div>

          <div className="space-y-4">
            {tool.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all bg-slate-50/50 dark:bg-slate-800/40"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span className="pr-4">{faq.question}</span>
                    <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-indigo-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/60 dark:border-slate-700/60 mt-1">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 4: "Why Choose ToolAISuite?" Editorial Section */}
        <section className="my-14 bg-slate-900 text-slate-100 rounded-2xl p-8 sm:p-12 border border-slate-800 shadow-xs">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950/60 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-800/40">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privacy-First Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-6">
              Why Choose ToolAISuite for {tool.name}?
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              <p>
                {tool.seoContent.whyChoose?.paragraph1 ||
                  `Unlike traditional cloud-based utility services that upload your confidential files to remote servers (exposing sensitive financial, legal, or personal data to potential breaches), ToolAISuite processes every byte locally within your browser sandbox. Utilizing advanced WebAssembly, your documents are parsed directly inside your device memory.`}
              </p>
              <p>
                {tool.seoContent.whyChoose?.paragraph2 ||
                  `This client-side architecture guarantees absolute data privacy, eliminates upload and download wait times, and complies naturally with HIPAA, GDPR, and CCPA standards. Enjoy unlimited operations, zero watermarks, and fast performance without registrations or fees.`}
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Zero Server Uploads & Storage</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>No Email or Account Signup</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Unlimited Free Daily Usage</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Related Tools Grid */}
        <section className="my-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Explore Related Tools & Utilities
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Discover more free in-browser file and text productivity utilities.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedTools.map((relTool) => (
              <ToolCard
                key={relTool.id}
                tool={relTool}
                onClick={() => navigate(`tool/${relTool.slug}`)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

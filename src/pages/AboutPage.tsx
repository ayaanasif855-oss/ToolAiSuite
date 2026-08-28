import React from 'react';
import { ShieldCheck, Cpu, Lock, ServerOff, CheckCircle2, Code2, Users, Layers, Award, Terminal } from 'lucide-react';

interface AboutPageProps {
  navigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-indigo-200 dark:border-indigo-800/60">
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>About ToolAISuite</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Empowering True Document Sovereignty
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Building the next generation of 100% private, browser-native PDF utilities powered by WebAssembly, HTML5 APIs, and zero server uploads.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-10">
        {/* Backstory & Origin */}
        <section>
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            <Award className="w-4 h-4" /> Origin & Philosophy
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
            Why ToolAISuite Was Created
          </h2>
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
            <p>
              In today's digital workflow, PDF documents are the bedrock of commerce, law, medicine, and academia. Millions of users routinely work with tax filings, non-disclosure agreements, hospital charts, and bank records. Yet, when faced with standard tasks—such as combining two invoices, removing a password, or compressing a file for an email attachment—most users are forced to upload these sensitive files to free online converter websites.
            </p>
            <p>
              The dirty secret of legacy online PDF tools is their backend dependence: every uploaded file is transmitted over the internet, saved onto external cloud server disks, processed by server-side scripts, and held in remote storage queues. Even when services promise automated file deletion, the temporary exposure window violates strict institutional standards (such as HIPAA, GDPR, and CCPA) and exposes private data to intercept risks.
            </p>
            <p>
              <strong>ToolAISuite was engineered to solve this privacy paradox.</strong> By moving the entire document manipulation pipeline into the user's local web browser via WebAssembly (Wasm) and typed binary array manipulation, we eliminated remote server dependencies entirely. Your documents never touch any server disk—because our architecture physically has no backend conversion server.
            </p>
          </div>
        </section>

        {/* Technical Stack Architecture */}
        <section className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
            <Code2 className="w-4 h-4" /> Engineering & Infrastructure
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
            Our Client-Side Technology Stack
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            ToolAISuite harnesses state-of-the-art browser execution runtimes to deliver desktop-grade performance without installations:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <Cpu className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
                pdf-lib & pdfjs-dist
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                In-memory manipulation of PDF cross-reference tables, object dictionaries, font embedding, and page trees directly inside JavaScript typed arrays.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <Terminal className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
                Tesseract.js WebAssembly
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Compiled C++ neural network OCR engine running inside browser WebAssembly workers for zero-upload optical character recognition.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <Layers className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
                HTML5 Canvas & Bicubic Filtering
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Hardware-accelerated graphics rendering pipeline for real-time document downscaling, JPEG quantization, and multi-format conversion.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <ServerOff className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
                Zero Cloud Storage Footprint
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Zero database records, zero cloud storage buckets, and zero file logging. Total confidentiality by physical mathematical design.
              </p>
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            <Lock className="w-4 h-4" /> Core Guarantees
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
            Our Commitments to You
          </h2>
          <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>100% Free Forever:</strong> No premium tiers, no document watermarks, and no artificial daily conversion limits.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>No Account or Registration Required:</strong> Use all tools immediately without providing email addresses, phone numbers, or passwords.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Universal Device Compatibility:</strong> Works seamlessly on Windows, macOS, Linux, ChromeOS, iOS, iPadOS, and Android.</span>
            </li>
          </ul>
        </section>

        {/* Contact CTA */}
        <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              Have Questions or Tool Suggestions?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              We're constantly expanding our browser utility engine. Reach out to our developer team!
            </p>
          </div>
          <button
            onClick={() => navigate('contact')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shrink-0"
          >
            Contact Support →
          </button>
        </div>
      </div>
    </div>
  );
};

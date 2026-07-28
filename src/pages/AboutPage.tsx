import React from 'react';
import { ShieldCheck, Cpu, Lock, ServerOff, CheckCircle2 } from 'lucide-react';
import { AdSensePlaceholder } from '../components/AdSensePlaceholder';

interface AboutPageProps {
  navigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-slate-800 dark:text-slate-200">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-4">
          <ShieldCheck className="w-4 h-4" /> 100% Client-Side Architecture
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          About ToolAISuite
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Re-imagining document productivity through browser-native WebAssembly technology and absolute data privacy.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            Our Mission: True Document Data Sovereignty
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Every day, millions of workers, students, healthcare workers, and lawyers upload sensitive PDFs—containing bank account numbers, medical diagnoses, social security records, and non-disclosure agreements—to free online converter sites. Unbeknownst to most users, these documents are uploaded to third-party server networks, logged on disk drives, and stored indefinitely.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400 mt-3">
            ToolAISuite was engineered with a strict core paradigm: **Zero Server Dependencies**. Every tool in our suite compiles and manipulates documents directly inside your local browser tab using HTML5 Canvas, WebAssembly (Wasm), and client-side JavaScript.
          </p>
        </div>

        <AdSensePlaceholder format="banner" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
            <Cpu className="w-8 h-8 text-emerald-500 mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
              WebAssembly Powered
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We leverage compiled client-side binary modules to achieve native-app processing speeds directly in Chrome, Safari, Firefox, and Edge.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
            <ServerOff className="w-8 h-8 text-emerald-500 mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">
              Zero Server Uploads
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Because no backend server API exists for document processing, your data physically cannot leave your local machine.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            Why We Built ToolAISuite
          </h2>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Total Privacy Guarantee:</strong> Inherently compliant with HIPAA, GDPR, CCPA, and enterprise privacy standards.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Instant Performance:</strong> No waiting for network upload bandwidth or remote cloud conversion queues.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>100% Free Forever:</strong> No artificial page limitations, watermark penalties, or hidden subscription paywalls.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

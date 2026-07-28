import React from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { AdSensePlaceholder } from '../components/AdSensePlaceholder';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-slate-800 dark:text-slate-200">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3">
          <ShieldCheck className="w-4 h-4" /> Comprehensive Privacy Policy
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Last Updated: July 28, 2026 • 100% Client-Side Execution Guarantee
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
        <section className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
          <h2 className="font-bold text-emerald-800 dark:text-emerald-400 text-lg flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-emerald-500" /> Executive Summary: Zero File Upload Policy
          </h2>
          <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-300">
            ToolAISuite DOES NOT upload, transmit, inspect, store, or log your PDF files, images, or extracted text. All file operations occur 100% locally in your client web browser runtime.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            1. Document Data Isolation
          </h3>
          <p>
            When you select a document or image in any ToolAISuite workspace, the file is read directly into your device’s volatile RAM memory using browser HTML5 File APIs. The binary compilation (merging, splitting, compressing, watermarking, or converting) is computed by local client JavaScript/WebAssembly routines.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            2. Information We Do Not Collect
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>We DO NOT collect or store your uploaded PDF files or documents.</li>
            <li>We DO NOT record document metadata, filenames, or page text.</li>
            <li>We DO NOT maintain user registration databases or user profiles.</li>
            <li>We DO NOT sell, trade, or expose document contents to third parties.</li>
          </ul>
        </section>

        <AdSensePlaceholder format="banner" />

        <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            3. Local Storage Preferences
          </h3>
          <p>
            ToolAISuite uses your browser's standard <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">localStorage</code> solely to save non-sensitive user preferences, such as your Light / Dark Mode theme choice. No document data or personally identifiable information is ever saved in localStorage.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            4. Google AdSense & Third-Party Advertising
          </h3>
          <p>
            ToolAISuite uses Google AdSense to serve advertisements. Google may use cookies to serve ads based on user visits to this or other web sites. Users may opt out of personalized advertising by visiting Google Ad Settings. No document content or file data is ever shared with Google AdSense.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            5. Contacting Us
          </h3>
          <p>
            If you have questions regarding this Privacy Policy or our client-side security architecture, please feel free to reach out via our Contact page.
          </p>
        </section>
      </div>
    </div>
  );
};

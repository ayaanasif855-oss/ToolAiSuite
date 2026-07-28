import React from 'react';
import { AlertCircle } from 'lucide-react';
import { AdSensePlaceholder } from '../components/AdSensePlaceholder';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-slate-800 dark:text-slate-200">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Disclaimer
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          General Liability & Document Processing Disclaimers
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            General Information Only
          </h2>
          <p>
            The information and tools provided by ToolAISuite are for general utility and document productivity purposes only. All document operations take place on your local client hardware.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            No Confidentiality Risk on Client Software
          </h2>
          <p>
            Because ToolAISuite is engineered entirely with client-side WebAssembly and HTML5 Canvas code, no documents are uploaded to our servers. However, users remain responsible for maintaining local device security (anti-virus, browser security) on their own computers or mobile devices.
          </p>
        </section>

        <AdSensePlaceholder format="banner" />

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            No Guarantees of Exact Conversion Fidelity
          </h2>
          <p>
            While our PDF rendering engines (pdf-lib, pdfjs-dist, docx, Tesseract.js) deliver high conversion precision, complex or corrupted original documents may yield variations in font alignment or OCR accuracy. Users are advised to review converted files before critical usage.
          </p>
        </section>
      </div>
    </div>
  );
};

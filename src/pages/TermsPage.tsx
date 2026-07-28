import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { AdSensePlaceholder } from '../components/AdSensePlaceholder';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-slate-800 dark:text-slate-200">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Last Updated: July 28, 2026 • Terms of Browser-Side Utility Access
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using ToolAISuite, you agree to comply with and be bound by these Terms of Service. ToolAISuite provides browser-based, client-side PDF manipulation utilities free of charge.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            2. User File Ownership & Isolation
          </h2>
          <p>
            You retain 100% ownership, copyright, and intellectual property rights over all files, images, and documents processed using ToolAISuite. Because processing is executed exclusively inside your web browser, ToolAISuite claims zero rights or access to your documents.
          </p>
        </section>

        <AdSensePlaceholder format="banner" />

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            3. Disclaimer of Warranties
          </h2>
          <p>
            ToolAISuite tools are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied. While our client-side software is engineered for maximum accuracy, users are advised to verify output documents.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            4. Limitation of Liability
          </h2>
          <p>
            In no event shall ToolAISuite or its developers be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our browser utilities.
          </p>
        </section>
      </div>
    </div>
  );
};

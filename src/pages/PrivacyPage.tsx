import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, FileText, Globe, Eye, ServerOff } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-slate-800 dark:text-slate-200">
      {/* Page Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3 border border-emerald-200 dark:border-emerald-800/60">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>GDPR & CCPA Compliant Privacy Policy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Effective Date: August 28, 2026 • 100% Client-Side Execution Guarantee
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
        {/* Executive Guarantee Box */}
        <section className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-6 rounded-2xl">
          <h2 className="font-bold text-emerald-900 dark:text-emerald-300 text-lg flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Executive Summary: Zero File Upload & Storage Policy
          </h2>
          <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200/90 leading-relaxed">
            ToolAISuite does NOT upload, transmit, inspect, store, or log your PDF files, images, or processed text on remote servers. All document compilation, merging, splitting, OCR, and compression algorithms execute 100% locally in your client web browser memory via WebAssembly and HTML5 APIs.
          </p>
        </section>

        {/* Section 1: In-Browser Processing */}
        <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <ServerOff className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            1. Document Data Processing & Local Execution
          </h3>
          <p className="mb-3">
            When you select or drag a document into any ToolAISuite workspace, the file is read into volatile system RAM within your browser's isolated JavaScript sandbox using the HTML5 File API. All operations (such as PDF merging, page splitting, OCR text recognition, image-to-PDF conversion, and password unlocking) are performed by compiled client-side libraries.
          </p>
          <p>
            Your document data physically never leaves your personal device. Because no backend API server is involved in the file conversion pipeline, neither ToolAISuite, our hosting providers, nor any third party can access or view your documents.
          </p>
        </section>

        {/* Section 2: Data We Do NOT Collect */}
        <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            2. Information We Do Not Collect
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm">
            <li><strong>No Document Files or Content:</strong> We never capture, cache, or store uploaded files, extracted text, or generated output files.</li>
            <li><strong>No Document Metadata:</strong> We do not log filenames, file sizes, creation timestamps, author names, or page counts.</li>
            <li><strong>No User Accounts:</strong> ToolAISuite requires no registration, username, email address, or password to use our tools.</li>
            <li><strong>No Data Brokering:</strong> We do not sell, license, or monetize any user document data under any circumstances.</li>
          </ul>
        </section>

        {/* Section 3: Google AdSense & Cookies */}
        <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            3. Google AdSense & Third-Party Advertising Cookies
          </h3>
          <p className="mb-3">
            ToolAISuite uses Google AdSense to serve non-intrusive advertisements on our website. Google and its advertising partners use cookies and web beacons to serve ads based on a user's prior visits to our website or other websites on the internet.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-xs sm:text-sm mb-3">
            <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to ToolAISuite and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-semibold">Google Ads Settings</a>.</li>
            <li>Alternatively, users can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-semibold">AboutAds.info</a>.</li>
          </ul>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            *Note: Advertisers and Google AdSense have zero access to your document workspace, uploaded files, or conversion inputs. Ad units are strictly isolated in separate DOM containers.
          </p>
        </section>

        {/* Section 4: Local Storage */}
        <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            4. Local Storage Preferences
          </h3>
          <p>
            Our website uses your browser's local storage (<code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">localStorage</code>) solely to preserve non-identifiable user interface preferences, such as your Light / Dark Mode theme toggle. No document data, session tokens, or personal identifiers are stored in localStorage.
          </p>
        </section>

        {/* Section 5: GDPR & CCPA Rights */}
        <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            5. User Rights Under GDPR & CCPA
          </h3>
          <p className="mb-3">
            Under the European General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), users possess rights regarding the access, rectification, and deletion of personal information.
          </p>
          <p>
            Because ToolAISuite does not collect, record, or retain any personal identifiers or document files on our infrastructure, we naturally adhere to data minimization and privacy-by-design standards. You maintain complete sovereignty over your documents at all times.
          </p>
        </section>

        {/* Section 6: Contact */}
        <section className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            6. Contacting Us About Privacy
          </h3>
          <p>
            If you have questions, inquiries, or feedback regarding our privacy policy or client-side architecture, please contact us at <a href="mailto:ayaanasif855@gmail.com" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">ayaanasif855@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

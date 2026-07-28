import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  ChevronDown,
  ChevronUp,
  FileText,
  ArrowRight,
  Search,
  Sparkles,
  ServerOff
} from 'lucide-react';
import { TOOLS_DATA } from '../data/tools';
import { BLOG_POSTS } from '../data/blog';
import { GLOBAL_FAQS } from '../data/faqs';
import { ToolCard } from '../components/ToolCard';
import { TrustBanner } from '../components/TrustBanner';
import { AdSensePlaceholder } from '../components/AdSensePlaceholder';
import { GlobalSearch } from '../components/GlobalSearch';
import { ToolCategory } from '../types';

interface HomePageProps {
  navigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const filteredTools = selectedCategory === 'all'
    ? TOOLS_DATA
    : TOOLS_DATA.filter((t) => t.category === selectedCategory);

  return (
    <div className="w-full">
      {/* Top Security Banner */}
      <TrustBanner />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-semibold mb-6">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% In-Browser Privacy • Zero File Server Uploads</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              Browser-Based Document Toolkit
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              Professional PDF tools that run entirely in your browser. No files are ever uploaded to our servers.
            </p>

            {/* Global Tool Search Bar */}
            <div className="mt-8">
              <GlobalSearch onSelectTool={(toolId) => navigate(`tool/${toolId}`)} />
            </div>

            {/* Tech Badges */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span>Zero Server Transmission</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-500" />
                <span>WebAssembly Speed</span>
              </div>
              <div className="flex items-center gap-2">
                <ServerOff className="w-4 h-4 text-emerald-500" />
                <span>Works Offline</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Unit Placeholder Top */}
      <div className="max-w-7xl mx-auto px-4">
        <AdSensePlaceholder format="responsive" />
      </div>

      {/* Tools Showcase Section */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              All {TOOLS_DATA.length} Client-Side Tools
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select any tool to start local document processing and utilities instantly.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            {[
              { id: 'all', label: 'All 18 Tools' },
              { id: 'pdf', label: 'PDF Tools' },
              { id: 'text', label: 'Text Tools' },
              { id: 'utility', label: 'Utilities & Calculators' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onClick={() => navigate(`tool/${tool.slug}`)}
            />
          ))}
        </div>
      </section>

      {/* Why 100% In-Browser Execution Highlights */}
      <section className="py-16 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Why 100% Client-Side Processing Matters
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Traditional PDF converters upload your confidential records to third-party cloud servers. ToolAISuite keeps everything strictly local.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 font-bold text-xl">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                100% Data Confidentiality
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Bank statements, medical records, and legal contracts stay exclusively in your computer RAM memory. Zero byte cloud transit guarantees total privacy.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 font-bold text-xl">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                Blazing Fast Local Speed
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Skip slow file upload and download progress bars. Combine 100-page PDFs or convert images in milliseconds using WebAssembly acceleration.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 font-bold text-xl">
                <ServerOff className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                Works Offline Anywhere
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Disconnect your Wi-Fi or go into Airplane Mode on a flight. ToolAISuite runs completely offline once loaded in your browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Latest Articles & Guides
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Document processing security tips, PDF guides, and productivity tutorials.
            </p>
          </div>
          <button
            onClick={() => navigate('blog')}
            className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => navigate(`blog/${post.slug}`)}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-xl hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    {post.author.name}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    {post.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AdSense Unit Placeholder Bottom */}
      <div className="max-w-7xl mx-auto px-4">
        <AdSensePlaceholder format="responsive" />
      </div>

      {/* Global FAQ Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Everything you need to know about ToolAISuite client-side architecture.
            </p>
          </div>

          <div className="space-y-4">
            {GLOBAL_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    <span className="text-sm sm:text-base">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 mt-2">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

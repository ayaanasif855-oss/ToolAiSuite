import React, { useState, useMemo } from 'react';
import { TOOLS_DATA } from '../data/tools';
import { ToolCard } from '../components/ToolCard';
import { TrustBanner } from '../components/TrustBanner';
import { AdSensePlaceholder } from '../components/AdSensePlaceholder';
import { ToolCategory } from '../types';
import { Search, Grid, Layers, ShieldCheck, Sparkles } from 'lucide-react';

interface AllToolsPageProps {
  navigate: (route: string) => void;
}

export const AllToolsPage: React.FC<AllToolsPageProps> = ({ navigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All 18 Tools' },
    { id: 'pdf', label: 'PDF Tools' },
    { id: 'text', label: 'Text Tools' },
    { id: 'utility', label: 'Utilities & Calculators' }
  ];

  const filteredTools = useMemo(() => {
    return TOOLS_DATA.filter((tool) => {
      const matchesCat =
        selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesQuery =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.seoDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="w-full min-h-screen py-10 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Trust Banner */}
        <TrustBanner compact />

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Grid className="w-3.5 h-3.5" />
            <span>Complete Suite Directory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            All Free Online PDF & Utility Tools
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Browse our full catalog of 100% private, browser-based tools. Zero server uploads, zero file limits, and complete data privacy.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto pt-2">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools by name, action or category (e.g. merge, compress, QR)..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* AdSense Unit */}
        <AdSensePlaceholder format="banner" />

        {/* Tools Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Showing {filteredTools.length} Tool{filteredTools.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onClick={() => navigate(`tool/${tool.slug}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                No tools found matching "{searchQuery}"
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for another keyword or reset category filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* AdSense Unit Below Grid */}
        <AdSensePlaceholder format="responsive" />

        {/* Informational SEO Content Section */}
        <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 dark:text-slate-300">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Why Use ToolAISuite Client-Side Web Utilities?
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Most online PDF convertors and generators require uploading your confidential files to remote third-party cloud servers, posing significant privacy risks. ToolAISuite operates 100% locally in your browser memory using WebAssembly, Web Workers, and modern JavaScript APIs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                100% Guaranteed Privacy
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your documents never leave your computer or phone. Processing occurs exclusively in client RAM.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Lightning Fast Speed
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No waiting for upload or download queues. Files convert instantly regardless of internet latency.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <Layers className="w-6 h-6 text-purple-500" />
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Batch & Offline Capable
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Process multiple documents at once and keep working even without an active internet connection.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

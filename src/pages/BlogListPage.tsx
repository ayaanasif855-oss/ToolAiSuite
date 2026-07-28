import React, { useState } from 'react';
import { BookOpen, Search, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { BLOG_POSTS } from '../data/blog';
import { AdSensePlaceholder } from '../components/AdSensePlaceholder';

interface BlogListPageProps {
  navigate: (route: string) => void;
}

export const BlogListPage: React.FC<BlogListPageProps> = ({ navigate }) => {
  const [query, setQuery] = useState('');

  const filteredPosts = BLOG_POSTS.filter(
    (post) =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-slate-800 dark:text-slate-200">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-4">
          <BookOpen className="w-4 h-4" /> ToolAISuite Knowledge Hub
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          PDF Security & Productivity Guides
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          In-depth technical tutorials, document security strategies, and client-side web technology breakdowns.
        </p>

        {/* Article Search */}
        <div className="mt-8 relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles (e.g. merge, compress, word, privacy)..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <AdSensePlaceholder format="responsive" />

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-10">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => navigate(`blog/${post.slug}`)}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:shadow-xl hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {post.readTime}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-3">
                {post.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-6">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
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

              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { ArrowLeft, Clock, ShieldCheck, Share2, BookOpen } from 'lucide-react';
import { BlogPost } from '../types';
import { TOOLS_DATA } from '../data/tools';
import { ToolCard } from '../components/ToolCard';
import { AdSensePlaceholder } from '../components/AdSensePlaceholder';

interface BlogPostPageProps {
  post: BlogPost;
  navigate: (route: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, navigate }) => {
  const relatedTools = TOOLS_DATA.filter((t) => post.relatedToolIds.includes(t.id));

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-slate-800 dark:text-slate-200">
      {/* Back to Blog */}
      <button
        onClick={() => navigate('blog')}
        className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Knowledge Hub
      </button>

      {/* Post Header */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10">
            {post.category}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {post.readTime}
          </span>
          <span>•</span>
          <span>{post.date}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/20"
            />
            <div>
              <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">
                {post.author.name}
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                {post.author.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" /> 100% In-Browser Privacy
          </div>
        </div>
      </header>

      <AdSensePlaceholder format="responsive" />

      {/* Main Content Body */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm my-8 prose dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
            const items = paragraph.split('\n');
            return (
              <ul key={idx} className="list-disc pl-5 space-y-2 text-sm">
                {items.map((item, i) => (
                  <li key={i}>{item.replace(/^[0-9]\. |- /, '')}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>

      <AdSensePlaceholder format="responsive" />

      {/* Related Tools Box */}
      {relatedTools.length > 0 && (
        <section className="my-12">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-6">
            Recommended PDF Tools Mentioned in this Article
          </h3>
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
      )}
    </article>
  );
};

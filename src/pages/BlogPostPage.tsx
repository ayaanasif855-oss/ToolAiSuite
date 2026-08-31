import React from 'react';
import { ArrowLeft, Clock, ShieldCheck, Share2, BookOpen, CheckCircle2 } from 'lucide-react';
import { BlogPost } from '../types';
import { TOOLS_DATA } from '../data/tools';
import { ToolCard } from '../components/ToolCard';

interface BlogPostPageProps {
  post: BlogPost;
  navigate: (route: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, navigate }) => {
  const relatedTools = TOOLS_DATA.filter((t) => post.relatedToolIds.includes(t.id));

  // Markdown rendering helper
  const renderParagraph = (text: string, idx: number) => {
    const trimmed = text.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={idx} className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-10 mb-4 tracking-tight border-b border-slate-100 dark:border-slate-800 pb-3">
          {trimmed.replace('## ', '')}
        </h2>
      );
    }

    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={idx} className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3 text-indigo-600 dark:text-indigo-400">
          {trimmed.replace('### ', '')}
        </h3>
      );
    }

    if (trimmed.startsWith('|')) {
      const rows = trimmed.split('\n').filter(r => r.trim().startsWith('|'));
      if (rows.length >= 2) {
        const headerRow = rows[0].split('|').filter(c => c.trim() !== '');
        const dataRows = rows.slice(2); // Skip separator row

        return (
          <div key={idx} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {headerRow.map((h, i) => (
                    <th key={i} className="p-3.5 whitespace-nowrap">{h.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dataRows.map((row, rIdx) => {
                  const cells = row.split('|').filter(c => c.trim() !== '');
                  return (
                    <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      {cells.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3.5 text-slate-700 dark:text-slate-300">
                          {cell.trim().replace(/\*\*(.*?)\*\*/g, '$1')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
    }

    if (trimmed.startsWith('1. ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed.split('\n');
      const isOrdered = trimmed.startsWith('1. ');

      if (isOrdered) {
        return (
          <ol key={idx} className="list-decimal pl-6 space-y-2 my-4 text-slate-700 dark:text-slate-300">
            {items.map((item, i) => (
              <li key={i} className="leading-relaxed">
                {item.replace(/^[0-9]+\.\s*/, '')}
              </li>
            ))}
          </ol>
        );
      }

      return (
        <ul key={idx} className="list-disc pl-6 space-y-2 my-4 text-slate-700 dark:text-slate-300">
          {items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {item.replace(/^[-*]\s*/, '')}
            </li>
          ))}
        </ul>
      );
    }

    if (trimmed.startsWith('```')) {
      const code = trimmed.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');
      return (
        <pre key={idx} className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto my-4 border border-slate-800">
          <code>{code}</code>
        </pre>
      );
    }

    return (
      <p key={idx} className="leading-relaxed text-slate-700 dark:text-slate-300 text-sm sm:text-base">
        {trimmed}
      </p>
    );
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-slate-800 dark:text-slate-200">
      {/* Back to Blog */}
      <button
        onClick={() => navigate('blog')}
        className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Knowledge Center
      </button>

      {/* Post Header */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/10">
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

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20"
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

          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <ShieldCheck className="w-4 h-4" /> 100% In-Browser Privacy
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm my-8 max-w-none space-y-6">
        {post.content.split('\n\n').map((paragraph, idx) => (
          <React.Fragment key={idx}>
            {renderParagraph(paragraph, idx)}
          </React.Fragment>
        ))}
      </div>

      {/* Related Tools Box */}
      {relatedTools.length > 0 && (
        <section className="my-12">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Interactive Tools
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              Related In-Browser Utilities Mentioned
            </h3>
          </div>
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

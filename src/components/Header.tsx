import React, { useState } from 'react';
import {
  FileText,
  ChevronDown,
  Menu,
  X,
  Search,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Info,
  Mail,
  ShieldAlert
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { TOOLS_DATA } from '../data/tools';
import { ToolCategory } from '../types';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
  openSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, navigate, openSearch }) => {
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories: { label: string; key: ToolCategory }[] = [
    { label: 'PDF Tools', key: 'pdf' },
    { label: 'Text Tools', key: 'text' },
    { label: 'Utilities & Calculators', key: 'utility' }
  ];

  const handleToolSelect = (slug: string) => {
    navigate(`tool/${slug}`);
    setToolsDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <div
            onClick={() => {
              navigate('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                ToolAI<span className="text-indigo-600 dark:text-indigo-400">Suite</span>
              </span>
            </div>
          </div>

          {/* Privacy Badge (Central focus for trust) */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              100% Secure & Private: No Server Uploads
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-2">
            {/* Mega Dropdown for Tools */}
            <div className="relative">
              <button
                onClick={() => {
                  navigate('tools');
                  setToolsDropdownOpen(false);
                }}
                onMouseEnter={() => setToolsDropdownOpen(true)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentRoute === 'tools' || currentRoute.startsWith('tool/')
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
                id="header-tools-dropdown-button"
              >
                <span>All Tools</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsDropdownOpen && (
                <div
                  onMouseLeave={() => setToolsDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-[580px] max-h-[75vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      ToolAISuite Catalog
                    </span>
                    <button
                      onClick={() => {
                        navigate('tools');
                        setToolsDropdownOpen(false);
                      }}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> View All Tools Page →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {categories.map((cat) => {
                      const catTools = TOOLS_DATA.filter((t) => t.category === cat.key);
                      if (catTools.length === 0) return null;
                      return (
                        <div key={cat.key}>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3 border-b border-slate-100 dark:border-slate-800 pb-1">
                            {cat.label}
                          </h4>
                          <div className="space-y-1">
                            {catTools.map((tool) => (
                              <button
                                key={tool.id}
                                onClick={() => handleToolSelect(tool.slug)}
                                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left group"
                              >
                                <div>
                                  <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                    {tool.name}
                                  </span>
                                  <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1">
                                    {tool.shortDesc}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Blog */}
            <button
              onClick={() => navigate('blog')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentRoute.startsWith('blog')
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Blog</span>
            </button>

            {/* About */}
            <button
              onClick={() => navigate('about')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentRoute === 'about'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </button>

            {/* Contact */}
            <button
              onClick={() => navigate('contact')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentRoute === 'contact'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={openSearch}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Search tools"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Search Tools</span>
            </button>

            <ThemeToggle />

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-4 animate-in slide-in-from-top-2">
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              PDF Tools Suite
            </div>
            <div className="grid grid-cols-2 gap-1">
              {TOOLS_DATA.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolSelect(tool.slug)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left truncate"
                >
                  {tool.name}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1">
            <button
              onClick={() => {
                navigate('blog');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <BookOpen className="w-4 h-4 text-emerald-500" /> Blog
            </button>

            <button
              onClick={() => {
                navigate('about');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Info className="w-4 h-4 text-emerald-500" /> About Us
            </button>

            <button
              onClick={() => {
                navigate('privacy');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Privacy Policy
            </button>

            <button
              onClick={() => {
                navigate('contact');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Mail className="w-4 h-4 text-emerald-500" /> Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

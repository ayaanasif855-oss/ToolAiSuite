import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GlobalSearch } from './components/GlobalSearch';
import { generateMetadata, injectJsonLd } from './utils/seo';
import { TOOLS_DATA } from './data/tools';
import { BLOG_POSTS } from './data/blog';
import { Search, X } from 'lucide-react';

// Lazy-loaded page components for bundle splitting and improved Core Web Vitals
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const AllToolsPage = lazy(() => import('./pages/AllToolsPage').then((m) => ({ default: m.AllToolsPage })));
const ToolPage = lazy(() => import('./pages/ToolPage').then((m) => ({ default: m.ToolPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then((m) => ({ default: m.TermsPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage').then((m) => ({ default: m.DisclaimerPage })));
const BlogListPage = lazy(() => import('./pages/BlogListPage').then((m) => ({ default: m.BlogListPage })));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage })));

const PageLoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-3">
    <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-700 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide">
      Loading...
    </span>
  </div>
);

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.hash.replace('#/', '');
      return path || 'home';
    }
    return 'home';
  });

  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Dynamic SEO metadata injection hook
  useEffect(() => {
    const meta = generateMetadata(currentRoute);
    
    // Update document title
    document.title = meta.title;

    // Helper to update or create meta tags
    const updateMetaTag = (selector: string, attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update standard description
    updateMetaTag('meta[name="description"]', 'name', 'description', meta.description);

    // Update OpenGraph tags
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.ogTitle || meta.title);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.ogDescription || meta.description);

    // Update Twitter Card tags
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', meta.ogTitle || meta.title);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', meta.ogDescription || meta.description);

    // Dynamic Schema.org JSON-LD structured data injection
    injectJsonLd(currentRoute);
  }, [currentRoute]);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const path = window.location.hash.replace('#/', '');
      setCurrentRoute(path || 'home');
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    window.location.hash = `#/${route}`;
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  // Keyboard shortcut Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Route render matcher
  const renderContent = () => {
    if (currentRoute === 'home') {
      return <HomePage navigate={navigate} />;
    }

    if (currentRoute === 'tools' || currentRoute === 'all-tools') {
      return <AllToolsPage navigate={navigate} />;
    }

    if (currentRoute === 'about') {
      return <AboutPage navigate={navigate} />;
    }

    if (currentRoute === 'privacy') {
      return <PrivacyPage />;
    }

    if (currentRoute === 'terms') {
      return <TermsPage />;
    }

    if (currentRoute === 'contact') {
      return <ContactPage />;
    }

    if (currentRoute === 'disclaimer') {
      return <DisclaimerPage />;
    }

    if (currentRoute === 'blog') {
      return <BlogListPage navigate={navigate} />;
    }

    if (currentRoute.startsWith('blog/')) {
      const slug = currentRoute.replace('blog/', '');
      const post = BLOG_POSTS.find((p) => p.slug === slug);
      if (post) {
        return <BlogPostPage post={post} navigate={navigate} />;
      }
      return <BlogListPage navigate={navigate} />;
    }

    if (currentRoute.startsWith('tool/')) {
      const slug = currentRoute.replace('tool/', '');
      const tool = TOOLS_DATA.find((t) => t.slug === slug || t.id === slug);
      if (tool) {
        return <ToolPage tool={tool} navigate={navigate} />;
      }
      return <HomePage navigate={navigate} />;
    }

    return <HomePage navigate={navigate} />;
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
        {/* Navigation Header */}
        <Header
          currentRoute={currentRoute}
          navigate={navigate}
          openSearch={() => setSearchModalOpen(true)}
        />

        {/* Main Page Content */}
        <main className="flex-grow">
          <Suspense fallback={<PageLoadingFallback />}>
            {renderContent()}
          </Suspense>
        </main>

        {/* Global Search Modal Overlay */}
        {searchModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Search className="w-4 h-4" /> Quick Search PDF Tools
                </span>
                <button
                  onClick={() => setSearchModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <GlobalSearch
                onSelectTool={(toolId) => {
                  navigate(`tool/${toolId}`);
                  setSearchModalOpen(false);
                }}
              />

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
                Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">ESC</kbd> to close
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <Footer navigate={navigate} />
      </div>
    </ThemeProvider>
  );
}


import React from 'react';
import { ShieldCheck, Cpu, Lock } from 'lucide-react';
import { Logo } from './Logo';
import { TOOLS_DATA } from '../data/tools';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => navigate('home')}
              className="cursor-pointer group inline-block"
            >
              <Logo size="md" />
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              100% Client-Side PDF Tools Suite. All document processing runs locally in your browser memory using WebAssembly & HTML5 Canvas APIs. Zero server uploads.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Server Uploads • 100% In-Browser Isolation</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Cpu className="w-4 h-4 text-slate-500" />
                <span>Powered by WebAssembly, pdf-lib, pdfjs-dist & Tesseract.js</span>
              </div>
            </div>
          </div>

          {/* Tools Column 1: PDF Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">
              PDF Tools
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {TOOLS_DATA.filter((t) => t.category === 'pdf').map((tool) => (
                <li key={tool.id}>
                  <button
                    onClick={() => navigate(`tool/${tool.slug}`)}
                    className="hover:text-indigo-400 transition-colors text-slate-400 hover:underline text-left"
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Column 2: Text Tools & Utilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">
              Text & Utilities
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {TOOLS_DATA.filter((t) => t.category !== 'pdf').map((tool) => (
                <li key={tool.id}>
                  <button
                    onClick={() => navigate(`tool/${tool.slug}`)}
                    className="hover:text-indigo-400 transition-colors text-slate-400 hover:underline text-left"
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Company Pages */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => navigate('about')}
                  className="hover:text-emerald-400 transition-colors text-slate-400 hover:underline text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('privacy')}
                  className="hover:text-emerald-400 transition-colors text-slate-400 hover:underline text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('terms')}
                  className="hover:text-emerald-400 transition-colors text-slate-400 hover:underline text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('contact')}
                  className="hover:text-emerald-400 transition-colors text-slate-400 hover:underline text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('disclaimer')}
                  className="hover:text-emerald-400 transition-colors text-slate-400 hover:underline text-left"
                >
                  Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('blog')}
                  className="hover:text-emerald-400 transition-colors text-slate-400 hover:underline text-left"
                >
                  Blog Articles
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ToolAISuite. All rights reserved. 100% Client-Side PDF Engine.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with local browser privacy & security</span>
            <Lock className="w-3.5 h-3.5 text-emerald-400 ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};

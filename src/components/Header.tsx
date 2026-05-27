import React from "react";
import { Sparkles, Clock, ExternalLink } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-slate-800/90 bg-slate-950/65 backdrop-blur-md sticky top-0 z-50 px-4 py-4 md:px-8 shadow-sm">
      <section className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <section className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-md flex items-center justify-center">
            <Sparkles className="w-5 h-5 animate-spin-slow" aria-hidden="true" />
          </span>
          <section className="flex flex-col">
            <span className="flex items-center gap-2 flex-wrap">
              <h1 id="header-title" className="text-lg font-bold tracking-tight text-white m-0">
                Mock Data Synthesizer
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 font-mono font-medium">
                v1.2.0-PRO
              </span>
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              AI code-ast semantic generation. Create highly cohesive local mock databases.
            </p>
          </section>
        </section>

        <nav className="flex items-center gap-2.5 text-xs" aria-label="System status & Quick links">
          <span className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <span aria-label="Current system UTC time">UTC : 2026-05-26 21:57:02</span>
          </span>
          <a
            href="https://ai.studio/build"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none transition-all font-medium text-white flex items-center gap-1 border border-indigo-500/15"
            aria-label="AI Studio Hub (Opens in new tab)"
          >
            <span>AI Studio Hub</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </nav>
      </section>
    </header>
  );
};

export default Header;

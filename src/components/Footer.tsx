import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-5 text-center text-xs text-slate-500 select-none mt-12" aria-label="Application Footer">
      <section className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>&copy; 2026 Mock Data Synthesizer Engine. Powered by server-side Gemini.</span>
        <nav className="flex gap-4" aria-label="Footer system indicators">
          <span className="hover:text-slate-300 transition-colors">Offline Sandbox Mode</span>
          <span aria-hidden="true">•</span>
          <span className="hover:text-slate-300 transition-colors bg-indigo-950/20 text-indigo-400 font-mono px-1.5 py-0.2 rounded border border-indigo-900/40">Secure Key Management</span>
        </nav>
      </section>
    </footer>
  );
};

export default Footer;

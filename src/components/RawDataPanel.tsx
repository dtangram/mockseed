import React from "react";
import { Copy, Check, Download } from "lucide-react";
import useSynthesizer from "../hooks/useSynthesizer";

const RawDataPanel = () => {
  const {
    synthesizedResult,
    copiedText,
    copyToClipboard,
    downloadTypescriptFile
  } = useSynthesizer();

  if (!synthesizedResult) {
    return (
      <section className="text-center py-12 text-slate-500">
        Wait, no dataset synced. Compile on left first.
      </section>
    );
  }

  return (
    <section className="space-y-6" id="tab-integration-content">
      {/* JSON Display */}
      <section className="space-y-2">
        <header className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">Raw Generated Array Array(Object)</span>
          <span className="flex gap-1.5 text-xs">
            <button
              onClick={() => copyToClipboard(JSON.stringify(synthesizedResult.data, null, 2))}
              className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 flex items-center gap-1 font-mono text-[10px] focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-hidden cursor-pointer"
              aria-label="Copy raw database output of generated JSON records"
            >
              {copiedText ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </span>
        </header>

        <section className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between max-h-[300px] overflow-y-auto">
          <pre className="text-[11px] text-indigo-200 font-mono leading-relaxed whitespace-pre font-medium select-text">
            {JSON.stringify(synthesizedResult.data, null, 2)}
          </pre>
        </section>
      </section>

      {/* Copy paste TS/JS code logic */}
      <section className="space-y-3 font-mono">
        <header className="flex justify-between items-center">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Mock Integration Code Snippet
          </h4>
          
          <button
            onClick={downloadTypescriptFile}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-hidden cursor-pointer"
            aria-label="Download typescript file for simulated latency database integrations"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            Download mockData.ts
          </button>
        </header>

        <article className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[10.5px] leading-relaxed text-slate-300 space-y-4">
          <p className="text-slate-400 select-none">
            Import this local helper module directly in your prototype front-end components. It mocks the latency of normal server fetching dynamically!
          </p>

          <pre className="text-indigo-300 whitespace-pre font-medium overflow-x-auto p-2 bg-slate-900/60 rounded">
{`export const fetchMockData = async (delayMs: number = 600) => {
  await new Promise(resolve => setTimeout(resolve, delayMs));
  return [
    /* ... copy-paste generated json array here ... */
  ];
};`}
          </pre>
        </article>
      </section>
    </section>
  );
};

export default RawDataPanel;

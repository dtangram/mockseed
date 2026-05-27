import React from "react";
import useSynthesizer from "../hooks/useSynthesizer";

interface DynamicGenericDashboardProps {
  records: any[];
}

const DynamicGenericDashboard = ({ records }: DynamicGenericDashboardProps) => {
  const { selectedRecordIndex, setSelectedRecordIndex, locale, synthesizedResult } = useSynthesizer();

  const totalCount = records.length;
  const properties = Object.keys(records[0] || {});
  
  const numberVars = properties.filter(p => typeof records[0][p] === "number");

  const selectedRecordIdx = selectedRecordIndex !== null && selectedRecordIndex < records.length ? selectedRecordIndex : 0;
  const activeItem = records[selectedRecordIdx];

  return (
    <section className="space-y-6" id="generic-prototype-container">
      {/* Metric indicators */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Dynamic parameters overview">
        <article className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider font-mono block">Synthesized Matrix Volume</span>
          <span className="text-2xl font-bold font-mono text-indigo-400 mt-1 block">{totalCount} items</span>
          <p className="text-[10px] text-slate-500 mt-1">Conforming exactly to custom structure and filters</p>
        </article>

        {numberVars.length > 0 ? (
          <article className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium font-mono uppercase tracking-wider block">Field Inferences: {numberVars[0]} Mean</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
              {(records.reduce((sum, r) => sum + (Number(r[numberVars[0]]) || 0), 0) / totalCount).toFixed(2)}
            </span>
            <p className="text-[10px] text-slate-500 mt-1">Calculated sample parameters</p>
          </article>
        ) : (
          <article className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium font-mono uppercase tracking-wider block">Identified Dimensions</span>
            <span className="text-2xl font-bold font-mono text-indigo-400 mt-1 block">{properties.length} Properties</span>
            <p className="text-[10px] text-slate-500 mt-1">Self-documenting variables mapped successfully</p>
          </article>
        )}

        <article className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium font-mono uppercase tracking-wider block">Applied Locale Context</span>
          <span className="text-lg font-bold text-slate-200 mt-1 flex items-center gap-1 font-mono block">
            🌍 {synthesizedResult?.localeInfo?.detectedLocale || locale}
          </span>
          <p className="text-[10px] text-slate-500 mt-1">Cultural semantic filters enabled</p>
        </article>
      </section>

      {/* Bento grid split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card list of items */}
        <section className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <header className="px-4 py-3 bg-slate-900/50 border-b border-slate-800">
            <h5 className="font-semibold text-slate-200 text-xs uppercase tracking-wider font-mono">Interactive Bento List</h5>
          </header>
          <ul className="divide-y divide-slate-800 max-h-[380px] overflow-y-auto" aria-label="Bento Items list">
            {records.map((item, idx) => {
              const isSelected = selectedRecordIdx === idx;
              const titleValue = item.fullName || item.name || item.title || item.label || item.id || Object.values(item)[0];
              const subtitleValue = item.email || item.company || item.role || item.category || Object.values(item)[1];

              return (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => setSelectedRecordIndex(idx)}
                    className={`w-full text-left p-3.5 hover:bg-slate-800/40 focus-visible:bg-slate-800/40 focus-visible:outline-hidden transition-all border-l-2 cursor-pointer ${
                      isSelected ? "bg-indigo-500/5 border-l-indigo-400" : "border-l-transparent"
                    }`}
                    aria-label={`View record index ${idx}`}
                  >
                    <span className="block">
                      <span className="font-semibold text-slate-200 text-sm block">
                        {String(titleValue)}
                      </span>
                      {subtitleValue && (
                        <span className="text-xs text-slate-400 mt-0.5 block">
                          {String(subtitleValue)}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Expanded Bento Detail viewer */}
        <aside className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-4" aria-label="Bento item detailed node inspector">
          <header className="border-b border-slate-800 pb-2 mb-4 flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block">Mock Model Inspector</span>
            <span className="text-[10px] text-slate-500 font-mono">Index Node #{selectedRecordIdx}</span>
          </header>

          {activeItem ? (
            <section className="space-y-4 max-h-[360px] overflow-y-auto">
              {Object.entries(activeItem).map(([key, val]) => (
                <article key={key} className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">{key}</span>
                  <span className="bg-slate-950 p-2.5 rounded border border-slate-800/80 font-mono text-xs text-slate-200 leading-normal break-all block">
                    {typeof val === "object" && val !== null ? (
                      <pre className="text-[11px] whitespace-pre-wrap">{JSON.stringify(val, null, 2)}</pre>
                    ) : (
                      String(val)
                    )}
                  </span>
                </article>
              ))}
            </section>
          ) : (
            <section className="text-center text-slate-500 py-12">No active indices available.</section>
          )}
        </aside>
      </section>
    </section>
  );
};

export default DynamicGenericDashboard;

import React from "react";
import { Globe } from "lucide-react";
import useSynthesizer from "../hooks/useSynthesizer";

const SchemaInsightsPanel = () => {
  const { synthesizedResult } = useSynthesizer();

  if (!synthesizedResult) {
    return (
      <section className="text-center py-12 text-slate-500">
        Wait, no dataset synced. Compile on left first.
      </section>
    );
  }

  return (
    <section className="space-y-6" id="tab-insights-content">
      <section className="space-y-6 animate-fade-in">
        {/* Target Localization summary banner */}
        <article className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
          <header className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <h4 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">
              Contextual Localization Engine Summary
            </h4>
          </header>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            <strong>Targeted constraints model:</strong> {synthesizedResult.localeInfo?.localizationDetails || "Applied matching phone, postal codes, and regional dictionary lookups to fit requested bounds."}
          </p>
        </article>

        {/* Gemini Explanation markdown panel */}
        <section className="space-y-2 font-mono">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Data Coherency Explanation
          </h4>
          <section className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl text-xs text-slate-300 leading-relaxed max-h-[220px] overflow-y-auto">
            {synthesizedResult.explanation || "No explanation provided by LLM logic."}
          </section>
        </section>

        {/* Detected properties & rules layout */}
        <section className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">
            Synthesized AST Schema Variables Map
          </h4>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.isArray(synthesizedResult.fields) && synthesizedResult.fields.length > 0 ? (
              synthesizedResult.fields.map((field, i) => (
                <article key={i} className="bg-slate-950 border border-slate-800 p-3 rounded-lg font-mono">
                  <header className="flex justify-between items-center">
                    <span className="font-bold text-indigo-400 text-xs">{field.name}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
                      {field.type}
                    </span>
                  </header>
                  <p className="mt-1.5 text-[10px] text-slate-500 leading-normal">
                    {field.description || "Synthesizer matched value dynamically."}
                  </p>
                </article>
              ))
            ) : (
              <section className="col-span-2 text-center text-xs text-slate-500 italic py-4">
                Variables schema mapping completed as part of recursive parsing.
              </section>
            )}
          </section>
        </section>
      </section>
    </section>
  );
};

export default SchemaInsightsPanel;

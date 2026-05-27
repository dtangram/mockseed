import React from "react";
import { 
  Eye, 
  Grid, 
  Layers, 
  FileJson, 
  Download, 
  Database, 
  Sparkles 
} from "lucide-react";
import useSynthesizer from "../hooks/useSynthesizer";
import SchemaConfigPanel from "./SchemaConfigPanel";
import DashboardPrototype from "./DashboardPrototype";
import SheetExplorer from "./SheetExplorer";
import SchemaInsightsPanel from "./SchemaInsightsPanel";
import RawDataPanel from "./RawDataPanel";

const MainWorkspace = () => {
  const {
    activeTab,
    setActiveTab,
    synthesizedResult,
    isSynthesizing,
    downloadJSON,
    downloadCSV
  } = useSynthesizer();

  return (
    <main 
      className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 sticky z-10" 
      id="main-workspace-grid"
    >
      {/* Left Hand: Config & Schema block */}
      <SchemaConfigPanel />

      {/* Right Hand: Output & Data Explorer Tabs */}
      <section 
        className="lg:col-span-7 flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs" 
        id="right-results-column"
      >
        
        {/* Output Control Tabs */}
        <header className="px-5 pt-4 bg-slate-900/40 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 select-none">
          <nav className="flex gap-1 border-b border-transparent md:-mb-[1px]" id="result-tabs" role="tablist" aria-label="Result formats">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "prototype"}
              aria-controls="tab-prototype-content"
              onClick={() => setActiveTab("prototype")}
              className={`py-2 px-3 md:px-4 text-xs font-semibold cursor-pointer border-b-2 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none transition-all flex items-center gap-1.5 ${
                activeTab === "prototype"
                  ? "border-b-indigo-400 text-indigo-300"
                  : "border-b-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              Prototype Sandbox
            </button>
            
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "grid"}
              aria-controls="tab-grid-content"
              onClick={() => setActiveTab("grid")}
              className={`py-2 px-3 md:px-4 text-xs font-semibold cursor-pointer border-b-2 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none transition-all flex items-center gap-1.5 ${
                activeTab === "grid"
                  ? "border-b-indigo-400 text-indigo-300"
                  : "border-b-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Grid className="w-3.5 h-3.5" aria-hidden="true" />
              Sheet Explorer
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "insights"}
              aria-controls="tab-insights-content"
              onClick={() => setActiveTab("insights")}
              className={`py-2 px-3 md:px-4 text-xs font-semibold cursor-pointer border-b-2 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none transition-all flex items-center gap-1.5 ${
                activeTab === "insights"
                  ? "border-b-indigo-400 text-indigo-300"
                  : "border-b-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              AI Inference Schema
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "integration"}
              aria-controls="tab-integration-content"
              onClick={() => setActiveTab("integration")}
              className={`py-2 px-3 md:px-4 text-xs font-semibold cursor-pointer border-b-2 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none transition-all flex items-center gap-1.5 ${
                activeTab === "integration"
                  ? "border-b-indigo-400 text-indigo-300"
                  : "border-b-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileJson className="w-3.5 h-3.5" aria-hidden="true" />
              Raw JSON &amp; Code
            </button>
          </nav>

          {/* Quick Export tools */}
          {synthesizedResult && (
            <span className="flex gap-1.5 pb-2.5 md:pb-0 items-center justify-end text-xs">
              <button
                type="button"
                onClick={downloadJSON}
                title="Download raw JSON array"
                className="p-1.5 px-2 bg-slate-950 border border-slate-800 rounded-lg hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none transition-colors text-slate-300 flex items-center gap-1"
                aria-label="Download raw JSON array file"
              >
                <Download className="w-3 h-3 text-slate-400" aria-hidden="true" />
                <span className="text-[10px] font-mono leading-none">JSON</span>
              </button>
              <button
                type="button"
                onClick={downloadCSV}
                title="Download as CSV spreadsheet"
                className="p-1.5 px-2 bg-slate-950 border border-slate-800 rounded-lg hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none transition-colors text-slate-300 flex items-center gap-1"
                aria-label="Download CSV spreadsheet file"
              >
                <Grid className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                <span className="text-[10px] font-mono leading-none">CSV</span>
              </button>
            </span>
          )}
        </header>

        <section className="p-6 flex-1 overflow-y-auto" role="tabpanel" id="tab-content" aria-labelledby="result-tabs">
          
          {/* 1. Interactive Prototyper Sandbox tab */}
          {activeTab === "prototype" && (
            <section className="space-y-4" id="tab-prototype-content">
              <DashboardPrototype />
            </section>
          )}

          {/* 2. Interactive grid / spreadsheet view */}
          {activeTab === "grid" && (
            <section id="tab-grid-content">
              <SheetExplorer />
            </section>
          )}

          {/* 3. AI Insights Schema AST translation */}
          {activeTab === "insights" && (
            <section id="tab-insights-content">
              <SchemaInsightsPanel />
            </section>
          )}

          {/* 4. raw JSON tab & Integration code copy block */}
          {activeTab === "integration" && (
            <section id="tab-integration-content">
              <RawDataPanel />
            </section>
          )}

          {/* If no data and not loading state, show nice intro deck */}
          {!synthesizedResult && !isSynthesizing && (
            <section 
              className="h-full flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto" 
              id="no-data-intro-deck"
            >
              <Database className="w-12 h-12 text-slate-700 mb-4" aria-hidden="true" />
              <h3 className="text-base font-bold text-slate-200">Synthesizer Cold State</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-mono">
                The synthesizer is waiting for a compiled dataset. Use a preset block or import an existing TypeScript interface code on the left to start high-fidelity simulation.
              </p>
            </section>
          )}

        </section>

        {/* Minimal footer branding credits inside panel inside constraints */}
        {synthesizedResult && (
          <footer className="px-6 py-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500 select-none">
            <span>Status: Synchronized locally</span>
            <span className="text-indigo-400 flex items-center gap-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Cohesiveness Approved
            </span>
          </footer>
        )}
      </section>

    </main>
  );
};

export default MainWorkspace;

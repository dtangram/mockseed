import React from "react";
import { 
  ChevronDown, 
  FileCode, 
  ChevronRight, 
  AlertCircle, 
  Globe, 
  Database, 
  Sparkles, 
  RefreshCw 
} from "lucide-react";
import useSynthesizer from "../hooks/useSynthesizer";
import { LOCALES } from "../context/SynthesizerContext";
import { PRESET_SCHEMAS } from "../constants/presets";

const SchemaConfigPanel = () => {
  const {
    selectedPresetId,
    setSelectedPresetId,
    schemaType,
    setSchemaType,
    schemaText,
    recordCount,
    setRecordCount,
    locale,
    setLocale,
    customInstruction,
    setCustomInstruction,
    isSynthesizing,
    synthesisProgress,
    errorMessage,
    validationError,
    handleSchemaChange,
    handleFileUpload,
    triggerSynthesis
  } = useSynthesizer();

  return (
    <section className="lg:col-span-5 space-y-6 flex flex-col h-full" id="left-workspace-column">
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xs">
        
        {/* Header selection title */}
        <section className="space-y-1">
          <label 
            htmlFor="preset-schema-select"
            className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider block"
          >
            Target Schema Structure
          </label>
          <span className="relative mt-2 block">
            <select
              id="preset-schema-select"
              value={selectedPresetId}
              onChange={(e) => setSelectedPresetId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-hidden rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-hidden font-medium appearance-none cursor-pointer"
            >
              <option value="custom">✍️ Custom Schema (Manual or Upload)</option>
              {PRESET_SCHEMAS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type === "typescript" ? "TS" : "JSON"})
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            </span>
          </span>
        </section>

        {/* Selector helper toggles */}
        <nav className="flex gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800" aria-label="Schema format toggles">
          <button
            type="button"
            id="toggle-ts"
            onClick={() => setSchemaType("typescript")}
            className={`flex-1 py-1 px-3 rounded-md text-[11px] font-mono transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-hidden ${
              schemaType === "typescript"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            TypeScript Interface
          </button>
          <button
            type="button"
            id="toggle-json"
            onClick={() => setSchemaType("json")}
            className={`flex-1 py-1 px-3 rounded-md text-[11px] font-mono transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-hidden ${
              schemaType === "json"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            JSON Schema (.json)
          </button>
        </nav>

        {/* Custom Monospace Editor panel */}
        <section className="space-y-1.5">
          <header className="flex items-center justify-between">
            <label 
              htmlFor="schema-code-input"
              className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5" aria-hidden="true" />
              Code Input Editor
            </label>
            
            {/* File upload connector */}
            <label className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono font-medium cursor-pointer flex items-center gap-1">
              <span>Import File (.ts/.json)</span>
              <input
                type="file"
                className="hidden"
                accept=".ts,.tsx,.json,.txt"
                onChange={handleFileUpload}
                aria-label="Upload custom schema configuration file"
              />
              <ChevronRight className="w-3 h-3" aria-hidden="true" />
            </label>
          </header>

          <section className="relative">
            <textarea
              id="schema-code-input"
              value={schemaText}
              onChange={(e) => handleSchemaChange(e.target.value)}
              placeholder={
                schemaType === "typescript"
                  ? "interface MyUser {\n  id: string;\n  name: string;\n  email: string;\n}"
                  : "{\n  \"type\": \"object\",\n  \"properties\": ...\n}"
              }
              rows={13}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono rounded-xl p-4 text-xs select-text leading-relaxed outline-hidden whitespace-pre resize-y"
            />

            {/* Validation Feedback bubble */}
            {(validationError || errorMessage) && (
              <section 
                className="absolute bottom-3 left-3 right-3 p-2 px-3 rounded-md bg-rose-950/90 border border-rose-900/60 text-rose-300 transform transition-all duration-300 flex items-start gap-2 max-h-[140px] overflow-y-auto"
                role="alert"
                aria-live="polite"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-[10px] font-mono leading-normal">
                  {validationError || errorMessage}
                </p>
              </section>
            )}
          </section>
        </section>

        {/* Grid configs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800 pt-4">
          {/* Region Locale dropdown */}
          <section className="space-y-1.5">
            <label 
              htmlFor="locale-selector"
              className="text-xs font-semibold text-slate-300 font-mono flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
              Locale Format
            </label>
            <span className="relative block">
              <select
                id="locale-selector"
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 outline-hidden tracking-normal cursor-pointer"
              >
                {LOCALES.map(loc => (
                  <option key={loc.code} value={loc.code}>
                    {loc.flag} {loc.code}
                  </option>
                ))}
              </select>
            </span>
          </section>

          {/* Records volume size */}
          <section className="space-y-1.5">
            <span className="flex justify-between items-center text-xs font-bold font-mono">
              <label 
                htmlFor="record-count-slider"
                className="text-slate-300 flex items-center gap-1 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                Record Count
              </label>
              <span className="text-indigo-400" id="record-count-badge">
                {recordCount} rows
              </span>
            </span>
            <span className="pt-2 flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="50"
                id="record-count-slider"
                value={recordCount}
                onChange={(e) => setRecordCount(Number(e.target.value))}
                className="flex-1 accent-indigo-500 h-1 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer"
              />
              <input
                type="number"
                min="1"
                max="100"
                id="record-count-number-input"
                aria-label="Direct type number of records"
                value={recordCount}
                onChange={(e) => setRecordCount(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
                className="w-12 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-center text-xs font-mono focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-hidden"
              />
            </span>
          </section>
        </section>

        {/* Custom semantic details box */}
        <section className="space-y-1.5">
          <label 
            htmlFor="optional-instructions"
            className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider block cursor-pointer"
          >
            Additional Prompt Context Instructions
          </label>
          <input
            id="optional-instructions"
            type="text"
            value={customInstruction}
            onChange={(e) => setCustomInstruction(e.target.value)}
            placeholder="e.g. Include negative scores, or start index numbers from 5000"
            className="w-full bg-slate-950 text-slate-300 border border-slate-800 focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-hidden rounded-xl px-3.5 py-2 text-xs outline-hidden shadow-xs"
          />
        </section>

        {/* Powerful Action trigger button */}
        <section className="pt-2">
          <button
            type="button"
            id="synthesize-trigger"
            onClick={triggerSynthesis}
            disabled={isSynthesizing || !!validationError || !schemaText.trim()}
            className={`w-full py-3 px-4 rounded-xl font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 text-sm focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-hidden ${
              isSynthesizing
                ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white transform hover:-translate-y-0.5 active:translate-y-0 hover:shadow-indigo-500/20"
            }`}
          >
            {isSynthesizing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>Synthesizing mock data...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" aria-hidden="true" />
                <span>Synthesize Mock Dataset</span>
              </>
            )}
          </button>

          {/* Progress loader logging console ticker */}
          {isSynthesizing && (
            <section 
              className="mt-3 bg-slate-950/65 rounded-lg border border-slate-800/85 p-2 px-3 flex items-start gap-2 shrink-0 animate-pulse"
              role="status"
              aria-live="assertive"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 animate-ping block" aria-hidden="true"></span>
              <span className="font-mono text-[10px] text-indigo-400 leading-normal">
                <span className="text-indigo-600 font-bold">STATE_MONITOR:</span> {synthesisProgress}
              </span>
            </section>
          )}
        </section>

      </section>
    </section>
  );
};

export default SchemaConfigPanel;

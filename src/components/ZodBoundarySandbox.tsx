import React from "react";
import { z } from "zod";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  Activity, 
  Play, 
  Settings, 
  Trash2, 
  FileCode,
  Layout,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import useZodSandbox from "../hooks/useZodSandbox";

// Define the exact schemas to be checked in our validator sandbox
const UserProfileSchema = z.object({
  uid: z.string().describe("User Unique identifier"),
  firstName: z.string().describe("First given name"),
  lastName: z.string().describe("Family name"),
  email: z.string().email().describe("Primary contact email address"),
  age: z.number().int().min(18).max(100).describe("Integer age boundary [18-100]"),
  subscriptionType: z.enum(["premium", "standard", "basic"]),
  isStatusActive: z.boolean().describe("Account activation status")
});

const IoTTelemetrySchema = z.object({
  deviceId: z.string().describe("UUID or device serial number"),
  location: z.string().describe("Deployment locale coordinates descriptor"),
  cpuUtilization: z.number().min(0).max(100).describe("Sensor percentage metrics"),
  batteryEfficiencyVolts: z.number().positive().describe("Volts level reading"),
  criticalAlert: z.boolean().describe("Alarm system flag"),
  readings: z.array(z.number()).min(3).describe("Volt history samples over time")
});

const ProductItemSchema = z.object({
  productId: z.string().describe("Product identification stock unit"),
  title: z.string().describe("Readable item description"),
  price: z.number().positive().max(10000).describe("Float currency level in USD"),
  isStockAvailable: z.boolean().describe("Inventory status toggle"),
  tags: z.array(z.string()).describe("Aesthetic classification tags")
});

type UserProfileType = z.infer<typeof UserProfileSchema>;
type IoTTelemetryType = z.infer<typeof IoTTelemetrySchema>;
type ProductItemType = z.infer<typeof ProductItemSchema>;

const SCENARIOS = [
  {
    id: "user" as const,
    name: "User Account Specification",
    schema: UserProfileSchema,
    fallback: {
      uid: "usr_fallback_9999",
      firstName: "Fallback",
      lastName: "Individual",
      email: "fallback.user@boundary.security",
      age: 35,
      subscriptionType: "basic",
      isStatusActive: false
    } as UserProfileType,
    defaultPrompt: "Synthesize a premium level user from Paris, France. Be sure to use French naming styles.",
    zodCode: `const UserProfileSchema = z.object({
  uid: z.string().describe("User Unique identifier"),
  firstName: z.string().describe("First given name"),
  lastName: z.string().describe("Family name"),
  email: z.string().email().describe("Primary contact email address"),
  age: z.number().int().min(18).max(100).describe("Integer age [18-100]"),
  subscriptionType: z.enum(["premium", "standard", "basic"]),
  isStatusActive: z.boolean()
});`,
    tsRepresentation: `interface UserProfileType {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number; // integer
  subscriptionType: "premium" | "standard" | "basic";
  isStatusActive: boolean;
}`
  },
  {
    id: "iot" as const,
    name: "IoT Microgrid Telemetry",
    schema: IoTTelemetrySchema,
    fallback: {
      deviceId: "iot_fallback_v1",
      location: "Denver West Microgrid Coord [0.0, 0.0]",
      cpuUtilization: 1.5,
      batteryEfficiencyVolts: 12.0,
      criticalAlert: false,
      readings: [12.0, 11.9, 12.1]
    } as IoTTelemetryType,
    defaultPrompt: "Synthesize a high-load IoT monitor record located at Colorado solar subarray C4. Force high cpuUtilization above 85% with criticalAlert set to true, and 4 battery volts history levels.",
    zodCode: `const IoTTelemetrySchema = z.object({
  deviceId: z.string().describe("UUID or device serial"),
  location: z.string().describe("Location coordinates"),
  cpuUtilization: z.number().min(0).max(100),
  batteryEfficiencyVolts: z.number().positive(),
  criticalAlert: z.boolean(),
  readings: z.array(z.number()).min(3)
});`,
    tsRepresentation: `interface IoTTelemetryType {
  deviceId: string;
  location: string;
  cpuUtilization: number; // 0-100
  batteryEfficiencyVolts: number;
  criticalAlert: boolean;
  readings: number[]; // min length: 3
}`
  },
  {
    id: "product" as const,
    name: "E-Commerce Stock SKU",
    schema: ProductItemSchema,
    fallback: {
      productId: "sku_fallback_item",
      title: "Fallback Product Asset",
      price: 29.99,
      isStockAvailable: true,
      tags: ["fallback", "system-generated"]
    } as ProductItemType,
    defaultPrompt: "Synthesize a high-end titanium camping cooker set with specific survival tags and price index around 129.50.",
    zodCode: `const ProductItemSchema = z.object({
  productId: z.string().describe("Product Stock SKU"),
  title: z.string().describe("Readable item title"),
  price: z.number().positive().max(10000),
  isStockAvailable: z.boolean(),
  tags: z.array(z.string())
});`,
    tsRepresentation: `interface ProductItemType {
  productId: string;
  title: string;
  price: number; // positive float
  isStockAvailable: boolean;
  tags: string[];
}`
  }
];

export default function ZodBoundarySandbox() {
  const {
    activeScenarioId,
    setActiveScenarioId,
    prompt,
    setPrompt,
    locale,
    setLocale,
    chaosType,
    setChaosType,
    isExecuting,
    payloadResult,
    isSuccess,
    errorType,
    errorMessage,
    deviations,
    telemetryLogs,
    selectedScenario,
    clearLogsOnServer,
    handleRunBoundaryCheck
  } = useZodSandbox({
    initialScenarioId: "user",
    scenarios: SCENARIOS
  });

  const scenarioMeta = SCENARIOS.find(s => s.id === activeScenarioId) || SCENARIOS[0];

  return (
    <section className="space-y-6" id="zod-boundary-sandbox-view">
      {/* Visual banner description */}
      <header className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <section className="space-y-1">
          <span className="text-yellow-400 font-mono text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 animate-pulse" /> Network Boundary Guard Service
          </span>
          <h2 className="text-lg font-bold text-slate-100 font-sans tracking-tight">Structured Output &amp; Zod Validation Sandbox</h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Configure raw Gemini API extractions via response-schema configurations. Instantly validate type consistency at the network boundary, catch structural changes, report analytics deviations, and serve fallback structures without UI disruptions.
          </p>
        </section>
        <nav className="flex gap-2" aria-label="Scenario Selector tabs">
          {SCENARIOS.map((scen) => (
            <button
              key={scen.id}
              type="button"
              onClick={() => setActiveScenarioId(scen.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                activeScenarioId === scen.id
                  ? "bg-indigo-600 text-white shadow-md border border-indigo-500 font-bold"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200"
              }`}
            >
              {scen.id === "user" ? "👤 User" : scen.id === "iot" ? "📟 IoT" : "🛍️ Product"}
            </button>
          ))}
        </nav>
      </header>

      {/* Control Panel Parameters */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Param entry block (5 cols) */}
        <nav className="lg:col-span-4 space-y-4" aria-label="Sandbox Settings Side-panel">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
            <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-indigo-400" /> Grounding Parameter Inputs
            </h3>

            {/* Prompt input */}
            <section className="space-y-1">
              <label htmlFor="sandbox-prompt" className="text-[10px] font-mono text-slate-400 uppercase block">Generation Instruction</label>
              <textarea
                id="sandbox-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 text-slate-200 border border-slate-850 rounded-xl p-3 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-sans whitespace-pre-wrap"
              />
            </section>

            {/* Locale / Region formatting */}
            <section className="space-y-1">
              <label htmlFor="sandbox-locale" className="text-[10px] font-mono text-slate-400 uppercase block">Culture locale Formatting</label>
              <select
                id="sandbox-locale"
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer"
              >
                <option value="English (US)">🇺🇸 English (US) - Western name, USD</option>
                <option value="German (DE)">🇩🇪 German (DE) - Central European, EUR</option>
                <option value="Japanese (JP)">🇯🇵 Japanese (JP) - Kanji standard, JPY</option>
                <option value="Spanish (ES)">🇪🇸 Spanish (ES) - Ibero-Romance formatting</option>
                <option value="Brazilian (BR)">🇧🇷 Brazilian (BR) - Brazilian standard CPF/IDs</option>
                <option value="Hindi (IN)">🇮🇳 Hindi (IN) - South Asian, INR symbols</option>
              </select>
            </section>

            {/* Chaos Injection options */}
            <section className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1">
                ⚠️ Chaos Injection Engine (Test Failure States)
              </span>
              <p className="text-[10px] text-slate-500 leading-normal font-mono">
                Artificially trigger boundary error pathways to audit granular handler structures and safe UI response.
              </p>
              
              <section className="grid grid-cols-1 gap-2 pt-1 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => setChaosType("none")}
                  className={`py-1.5 px-2.5 rounded-lg border text-left flex items-center justify-between cursor-pointer ${
                    chaosType === "none"
                      ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/80 font-bold"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                  }`}
                >
                  <span>🟢 Happypath (No Errors)</span>
                  <span className="text-[8px] uppercase tracking-wider px-1 bg-emerald-500/10 text-emerald-400 rounded">Valid</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChaosType("malformed_json")}
                  className={`py-1.5 px-2.5 rounded-lg border text-left flex items-center justify-between cursor-pointer ${
                    chaosType === "malformed_json"
                      ? "bg-rose-950/40 text-rose-300 border-rose-800/80 font-bold"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                  }`}
                >
                  <span>🔴 Malformed JSON Data</span>
                  <span className="text-[8px] uppercase tracking-wider px-1 bg-rose-500/10 text-rose-400 rounded">Syntax</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChaosType("schema_mismatch")}
                  className={`py-1.5 px-2.5 rounded-lg border text-left flex items-center justify-between cursor-pointer ${
                    chaosType === "schema_mismatch"
                      ? "bg-amber-950/40 text-amber-300 border-amber-800/80 font-bold"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                  }`}
                >
                  <span>🟡 Type / Schema Mismatch</span>
                  <span className="text-[8px] uppercase tracking-wider px-1 bg-amber-500/10 text-amber-400 rounded">Validation</span>
                </button>
              </section>
            </section>

            {/* Run action trigger button */}
            <button
              type="button"
              onClick={handleRunBoundaryCheck}
              disabled={isExecuting || !prompt.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 font-bold text-white text-xs py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Invoking Gemini Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Boundary Check</span>
                </>
              )}
            </button>
          </section>

          {/* Scenario Inferred Codes (Single Source of truth display) */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 font-mono text-[10px]">
            <span className="text-slate-300 font-bold flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5 text-indigo-400" /> Schema &amp; Inferred Types
            </span>
            <section className="space-y-2">
              <section>
                <span className="text-slate-500 font-bold uppercase tracking-wider block text-[8px]">1. Runtime Zod Schema</span>
                <pre className="bg-slate-950 p-2.5 border border-slate-800 rounded-lg text-slate-300 overflow-x-auto text-[9px] max-h-[140px] whitespace-pre font-mono">
                  {scenarioMeta.zodCode}
                </pre>
              </section>
              <section>
                <span className="text-slate-500 font-bold uppercase tracking-wider block text-[8px]">2. Inferred TypeScript Representation</span>
                <pre className="bg-slate-950 p-2.5 border border-slate-800 rounded-lg text-indigo-300 overflow-x-auto text-[9px] whitespace-pre font-mono">
                  {scenarioMeta.tsRepresentation}
                </pre>
              </section>
            </section>
          </section>
        </nav>

        {/* Real-time Telemetry & Diagnostics (5 cols) */}
        <section className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex-1 flex flex-col">
            <header className="flex justify-between items-center pb-3 border-b border-slate-800 mb-3 shrink-0">
              <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> Telemetry Log Diagnostics
              </h3>
              <button
                type="button"
                onClick={clearLogsOnServer}
                title="Wipe diagnostics logs on server"
                className="p-1 px-2 bg-slate-950 hover:bg-slate-800 text-[9px] font-mono text-slate-400 hover:text-slate-200 border border-slate-800 rounded cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3 text-rose-400" /> Clear Logs
              </button>
            </header>

            {/* Errors breakdown visualizer based on latest request */}
            {isSuccess !== null && (
              <section className="p-3 rounded-xl mb-3 border shrink-0 font-mono text-[10px]" id="live-validation-eval">
                {isSuccess ? (
                  <section className="bg-emerald-950/20 border-emerald-800 text-emerald-400 flex items-start gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <section>
                      <span className="font-bold text-sm block">Structure Validated (No Deviations)</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">
                        Gemini output fits user's defined Zod Type perfectly at the network boundary. No errors logged.
                      </span>
                    </section>
                  </section>
                ) : (
                  <section className="bg-rose-950/20 border-rose-850 text-rose-300 flex items-start gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <section className="flex-1 min-w-0">
                      <span className="font-bold text-sm block uppercase tracking-tight text-rose-400">
                        {errorType === "parsing" ? "JSON parsing failure" : "Zod Validation Mismatch"}
                      </span>
                      <span className="text-[9px] text-slate-300 block mt-1 leading-normal break-words whitespace-normal font-sans">
                        Reason: {errorMessage}
                      </span>
                      {deviations.length > 0 && (
                        <section className="mt-2 border-t border-rose-900/30 pt-1.5 space-y-1">
                          <span className="text-[8px] uppercase tracking-wide block font-semibold text-rose-300 font-mono">Logged Path Deviations:</span>
                          <ul className="space-y-1 max-h-[100px] overflow-y-auto list-none pl-0">
                            {deviations.map((dev: any, idx: number) => (
                              <li key={idx} className="bg-rose-950/40 p-1 px-1.5 rounded border border-rose-900/30 flex justify-between gap-2 text-[9px] font-mono">
                                <span className="text-slate-300 font-bold block shrink-0">`{dev.path || "root"}`</span>
                                <span className="text-rose-400 text-right font-medium block italic whitespace-normal truncate">{dev.message}</span>
                              </li>
                            ))}
                          </ul>
                        </section>
                      )}
                    </section>
                  </section>
                )}
              </section>
            )}

            {/* Scrollable logs stream */}
            <section className="flex-1 min-h-[220px] max-h-[340px] overflow-y-auto space-y-2 pr-1" id="sandbox-logs-stream">
              {telemetryLogs.length === 0 ? (
                <section className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-500 font-mono text-[10px]">
                  <Terminal className="w-8 h-8 text-slate-700 mb-2" />
                  <span className="block">No telemetry logged.</span>
                  <span className="block text-[8px] text-slate-600 mt-0.5">Induce chaos and run boundary checks to populate stream logs.</span>
                </section>
              ) : (
                telemetryLogs.map((log, index) => (
                  <article key={index} className="bg-slate-950 border border-slate-850 p-2 px-3 rounded-lg font-mono text-[9px] space-y-1 relative">
                    <span className="absolute top-2 right-2 text-slate-600 text-[8px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    
                    <section className="flex items-center gap-1.5 font-bold">
                      <span className={`w-1.5 h-1.5 rounded-full ${log.errorType === 'PARSING' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                      <span className={log.errorType === 'PARSING' ? 'text-red-400' : 'text-yellow-400'}>
                        {log.errorType === 'PARSING' ? 'SYNTAX_PARSE_ERROR' : 'ZOD_VALIDATION_ERROR'}
                      </span>
                    </section>

                    <section className="text-slate-300 select-text font-medium leading-relaxed break-all">
                      {log.errorMessage}
                    </section>

                    {log.deviations && log.deviations.length > 0 && (
                      <section className="mt-1 pb-1 space-y-0.5 pl-2 border-l border-slate-800">
                        {log.deviations.map((dev: any, i: number) => (
                          <section key={i} className="text-[8px] text-yellow-500/80">
                            • Field <span className="text-slate-300 font-semibold font-mono">`{dev.path}`</span>: {dev.message}
                          </section>
                        ))}
                      </section>
                    )}

                    <footer className="text-slate-400 text-[8px] flex gap-2 pt-1 border-t border-slate-900 justify-between">
                      <span className="block">Endpoint: <span className="text-slate-400 font-semibold">{log.endpoint}</span></span>
                      <span className="block text-indigo-400 font-medium">Simulated Alert Logged</span>
                    </footer>
                  </article>
                ))
              )}
            </section>
          </section>
        </section>

        {/* Dynamic Fallback Integrity View (3 cols) */}
        <section className="lg:col-span-3">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 h-full flex flex-col justify-between space-y-4">
            <section className="space-y-4">
              <h3 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <Layout className="w-3.5 h-3.5 text-indigo-400" /> UI Resilience Output
              </h3>

              {payloadResult ? (
                <section className="space-y-4 text-xs font-mono">
                  {/* Status Indicator badge */}
                  <section className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Output Status:</span>
                    {isSuccess ? (
                      <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-2 py-0.5 rounded font-bold uppercase border border-emerald-500/20">
                        Passed
                      </span>
                    ) : (
                      <span className="bg-amber-500/10 text-amber-400 text-[9px] px-2 py-0.5 rounded font-bold uppercase border border-amber-500/20 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" /> Fallback (Safe)
                      </span>
                    )}
                  </section>

                  {/* Visual Render Grid of the data */}
                  <section className="bg-slate-950 p-2.5 border border-slate-850 rounded-xl space-y-3 font-sans" id="ui-resilient-card">
                    {activeScenarioId === "user" && (
                      <section className="space-y-2">
                        <section className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 block"></span>
                          <span className="text-slate-200 text-xs font-semibold">
                            {payloadResult.firstName} {payloadResult.lastName}
                          </span>
                        </section>
                        <ul className="text-[11px] text-slate-400 space-y-1 block font-mono leading-relaxed list-none pl-0">
                          <li>📧 {payloadResult.email}</li>
                          <li>🎂 Age: {payloadResult.age} yrs</li>
                          <li>📦 Tier: <span className="uppercase text-indigo-400 font-bold">{payloadResult.subscriptionType}</span></li>
                          <li>🛡️ State: {payloadResult.isStatusActive ? "🟢 Active" : "🔴 Inactive"}</li>
                        </ul>
                      </section>
                    )}

                    {activeScenarioId === "iot" && (
                      <section className="space-y-2 font-mono">
                        <section className="flex items-center justify-between">
                          <span className="text-slate-200 text-xs font-semibold truncate flex-1 block mr-2">{payloadResult.deviceId}</span>
                          <span className={`w-2 h-2 rounded-full block shrink-0 ${payloadResult.criticalAlert ? "bg-rose-500 animate-ping" : "bg-emerald-400"}`}></span>
                        </section>
                        <span className="text-[10px] text-slate-400 block">📍 {payloadResult.location}</span>
                        <section className="grid grid-cols-2 gap-1.5 text-[10px]">
                          <section className="bg-slate-900 border border-slate-800 p-1 px-1.5 rounded">
                            <span className="text-slate-500 block text-[8px]">CPU Load</span>
                            <span className="font-bold text-slate-200 block text-xs">{payloadResult.cpuUtilization}%</span>
                          </section>
                          <section className="bg-slate-900 border border-slate-800 p-1 px-1.5 rounded">
                            <span className="text-slate-500 block text-[8px]">Battery</span>
                            <span className="font-bold text-emerald-400 block text-xs">{payloadResult.batteryEfficiencyVolts}V</span>
                          </section>
                        </section>
                        <section className="pt-1.5 border-t border-slate-900">
                          <span className="text-slate-500 text-[8px] block mb-1">Telemetry Sensor Samples:</span>
                          <ul className="flex gap-1.5 flex-wrap list-none pl-0">
                            {payloadResult.readings?.map((volts: number, idx: number) => (
                              <li key={idx} className="bg-slate-900 border border-slate-800 text-[9px] text-indigo-300 font-bold px-1.5 py-0.2 rounded block">
                                {volts}V
                              </li>
                            ))}
                          </ul>
                        </section>
                      </section>
                    )}

                    {activeScenarioId === "product" && (
                      <section className="space-y-2 font-sans">
                        <span className="text-[9px] text-slate-500 font-mono uppercase block">Model Stock ID: {payloadResult.productId}</span>
                        <span className="text-slate-200 text-xs font-semibold block">{payloadResult.title}</span>
                        <section className="flex items-center justify-between font-mono">
                          <span className="text-emerald-400 font-bold text-sm block">${Number(payloadResult.price).toFixed(2)}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded block font-mono ${payloadResult.isStockAvailable ? "text-emerald-400 bg-emerald-500/10" : "text-slate-400 bg-slate-800"}`}>
                            {payloadResult.isStockAvailable ? "In Stock" : "Out of Stock"}
                          </span>
                        </section>
                        <ul className="flex gap-1 flex-wrap pt-1.5 border-t border-slate-900 list-none pl-0">
                          {payloadResult.tags?.map((tg: string, i: number) => (
                            <li key={i} className="text-[8px] bg-slate-900 text-indigo-400 font-semibold px-1.5 py-0.5 rounded block border border-slate-800 font-mono">
                              #{tg}
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </section>

                  {/* Raw Output Inspector */}
                  <section>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-1 flex items-center gap-1 font-mono">
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Parsed Entity payload
                    </span>
                    <pre className="bg-slate-950 p-2.5 border border-slate-850 text-indigo-300 rounded-xl overflow-x-auto text-[9px] leading-relaxed max-h-[140px] whitespace-pre font-mono">
                      {JSON.stringify(payloadResult, null, 2)}
                    </pre>
                  </section>
                </section>
              ) : (
                <section className="text-center font-mono py-12 text-slate-500 text-[10px] flex flex-col items-center justify-center">
                  <Play className="w-6 h-6 text-slate-700 mb-2 animate-bounce" />
                  <span>Execute Boundary test check to see safe resilient UI.</span>
                </section>
              )}
            </section>

            <footer className="pt-3 border-t border-slate-850 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0 block" aria-hidden="true" />
              <p className="text-[9px] text-slate-500 font-mono leading-relaxed">
                Applet is running server-side validations using Gemini's native structured schema parameters.
              </p>
            </footer>
          </section>
        </section>
      </section>
    </section>
  );
}

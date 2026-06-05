import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { 
  fetchWithZodBoundary, 
  TelemetryPayload 
} from "../utils/zodGeminiFetch";

export interface UseZodSandboxProps {
  initialScenarioId?: "user" | "iot" | "product";
  scenarios: Array<{
    id: "user" | "iot" | "product";
    schema: z.ZodTypeAny;
    fallback: any;
    defaultPrompt: string;
  }>;
}

export default function useZodSandbox({ initialScenarioId = "user", scenarios }: UseZodSandboxProps) {
  const [activeScenarioId, setActiveScenarioId] = useState<"user" | "iot" | "product">(initialScenarioId);
  const [prompt, setPrompt] = useState<string>("");
  const [locale, setLocale] = useState<string>("English (US)");
  const [chaosType, setChaosType] = useState<"none" | "malformed_json" | "schema_mismatch">("none");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  
  // Results structures
  const [payloadResult, setPayloadResult] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [errorType, setErrorType] = useState<"none" | "parsing" | "validation" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deviations, setDeviations] = useState<any[]>([]);
  
  // Telemetry Monitor list (simulated tracking stream showing state captures)
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryPayload[]>([]);

  const selectedScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  // Prefill default prompt when scenario changes
  useEffect(() => {
    setPrompt(selectedScenario.defaultPrompt);
  }, [activeScenarioId, selectedScenario]);

  // Load telemetry list on initial mount or updates
  const loadTelemetryLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/telemetry");
      if (res.ok) {
        const data = await res.json();
        setTelemetryLogs(data.reverse());
      }
    } catch (e) {
      console.error("Failed to load telemetry", e);
    }
  }, []);

  useEffect(() => {
    loadTelemetryLogs();
  }, [loadTelemetryLogs]);

  const clearLogsOnServer = useCallback(async () => {
    try {
      await fetch("/api/telemetry", { method: "DELETE" });
      setTelemetryLogs([]);
    } catch (e) {
      console.error("Telemetry clear error", e);
    }
  }, []);

  const handleRunBoundaryCheck = useCallback(async () => {
    setIsExecuting(true);
    setPayloadResult(null);
    setIsSuccess(null);
    setErrorType(null);
    setErrorMessage(null);
    setDeviations([]);

    try {
      const result = await fetchWithZodBoundary({
        prompt: prompt,
        schema: selectedScenario.schema,
        fallback: selectedScenario.fallback,
        locale: locale,
        injectChaosType: chaosType,
        onTelemetryLogged: (payload) => {
          // Add locally to visual tracker instantly
          setTelemetryLogs((prev) => [payload, ...prev]);
        }
      });

      setPayloadResult(result.data);
      setIsSuccess(result.success);
      if (result.errorType && result.errorType !== "none") {
        setErrorType(result.errorType);
        setErrorMessage(result.errorMessage || null);
        setDeviations(result.deviations || []);
      }
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message || "Something went wrong in boundary trigger.");
      setIsSuccess(false);
    } finally {
      setIsExecuting(false);
    }
  }, [prompt, selectedScenario, locale, chaosType]);

  return {
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
  };
}

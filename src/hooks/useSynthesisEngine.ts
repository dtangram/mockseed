import { useCallback } from "react";
import { SynthesizedData } from "../type/SynthesizedData";
import { PRESET_SCHEMAS } from "../constants/presets";

interface UseSynthesisEngineProps {
  schemaType: "typescript" | "json";
  schemaText: string;
  recordCount: number;
  locale: string;
  customInstruction: string;
  setIsSynthesizing: (val: boolean) => void;
  setErrorMessage: (msg: string | null) => void;
  setSelectedRecordIndex: (idx: number | null) => void;
  setSynthesisProgress: (progress: string) => void;
  setSynthesizedResult: (result: SynthesizedData | null) => void;
  setActiveTab: (tab: "prototype" | "grid" | "insights" | "integration" | "zod") => void;
}

const useSynthesisEngine = ({
  schemaType,
  schemaText,
  recordCount,
  locale,
  customInstruction,
  setIsSynthesizing,
  setErrorMessage,
  setSelectedRecordIndex,
  setSynthesisProgress,
  setSynthesizedResult,
  setActiveTab,
}: UseSynthesisEngineProps) => {
  const triggerSynthesis = useCallback(async () => {
    setIsSynthesizing(true);
    setErrorMessage(null);
    setSelectedRecordIndex(null);

    const progressSteps = [
      "Parsing schema AST & property mappings...",
      "Analyzing semantic types & metadata parameters...",
      `Translating rules into localized contextual values (${locale})...`,
      "Communicating with Gemini synthesis engine...",
      "Synthesizing high-fidelity mock relationships...",
      "Injecting sequential database keys & dependencies...",
      "Validating schema alignment and formatting JSON object..."
    ];

    let currentStepIdx = 0;
    setSynthesisProgress(progressSteps[0]);

    const progressInterval = setInterval(() => {
      if (currentStepIdx < progressSteps.length - 1) {
        currentStepIdx++;
        setSynthesisProgress(progressSteps[currentStepIdx]);
      }
    }, 1100);

    try {
      const startResponse = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemaType,
          schemaText,
          recordCount,
          locale,
          customInstruction
        })
      });

      clearInterval(progressInterval);

      if (!startResponse.ok) {
        const errorData = await startResponse.json();
        throw new Error(errorData.error || errorData.details || "Failed to generate records");
      }

      const returnedJSON: SynthesizedData = await startResponse.json();

      if (returnedJSON.success && Array.isArray(returnedJSON.data)) {
        setSynthesizedResult(returnedJSON);
        setActiveTab("prototype");
      } else {
        throw new Error("Returned data state did not contain a success flag or data matrix.");
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error(err);
      setErrorMessage(err.message || "Upstream synthesis failed. Please inspect your schema representation.");
    } finally {
      setIsSynthesizing(false);
    }
  }, [
    schemaType,
    schemaText,
    recordCount,
    locale,
    customInstruction,
    setIsSynthesizing,
    setErrorMessage,
    setSelectedRecordIndex,
    setSynthesisProgress,
    setSynthesizedResult,
    setActiveTab,
  ]);

  const loadDefaultData = useCallback(async () => {
    setIsSynthesizing(true);
    setSynthesisProgress("Bootstrapping engine with default SaaS subscription preset...");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemaType: "typescript",
          schemaText: PRESET_SCHEMAS[0].schemaText,
          recordCount: 12,
          locale: "English (US)",
          customInstruction: PRESET_SCHEMAS[0].suggestedInstruction
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSynthesizedResult(data);
      }
    } catch (e) {
      console.error("Default bootstrap error", e);
    } finally {
      setIsSynthesizing(false);
    }
  }, [setIsSynthesizing, setSynthesisProgress, setSynthesizedResult]);

  return { triggerSynthesis, loadDefaultData };
};

export default useSynthesisEngine;

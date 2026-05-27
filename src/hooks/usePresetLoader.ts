import { useEffect } from "react";
import { PRESET_SCHEMAS } from "../constants/presets";

interface UsePresetLoaderProps {
  selectedPresetId: string;
  setSchemaText: (text: string) => void;
  setSchemaType: (type: "typescript" | "json") => void;
  setLocale: (locale: string) => void;
  setCustomInstruction: (instruction: string) => void;
  setValidationError: (err: string | null) => void;
}

const usePresetLoader = ({
  selectedPresetId,
  setSchemaText,
  setSchemaType,
  setLocale,
  setCustomInstruction,
  setValidationError,
}: UsePresetLoaderProps) => {
  useEffect(() => {
    const preset = PRESET_SCHEMAS.find(p => p.id === selectedPresetId);
    if (preset) {
      setSchemaText(preset.schemaText);
      setSchemaType(preset.type);
      setLocale(preset.suggestedLocale);
      setCustomInstruction(preset.suggestedInstruction || "");
      setValidationError(null);
    }
  }, [
    selectedPresetId,
    setSchemaText,
    setSchemaType,
    setLocale,
    setCustomInstruction,
    setValidationError,
  ]);
};

export default usePresetLoader;

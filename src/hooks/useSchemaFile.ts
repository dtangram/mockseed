import { ChangeEvent, useCallback } from "react";

interface UseSchemaFileProps {
  setSchemaText: (text: string) => void;
  setSchemaType: (type: "typescript" | "json") => void;
  setValidationError: (err: string | null) => void;
  setSelectedPresetId: (id: string) => void;
}

const useSchemaFile = ({
  setSchemaText,
  setSchemaType,
  setValidationError,
  setSelectedPresetId,
}: UseSchemaFileProps) => {
  const handleFileUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setSchemaText(content);
        if (file.name.endsWith(".json") || content.trim().startsWith("{") || content.trim().startsWith("[")) {
          setSchemaType("json");
          try {
            JSON.parse(content);
            setValidationError(null);
          } catch {
            setValidationError("Imported file has malformed JSON syntax.");
          }
        } else {
          setSchemaType("typescript");
          setValidationError(null);
        }
        setSelectedPresetId("custom");
      }
    };
    reader.readAsText(file);
  }, [setSchemaText, setSchemaType, setValidationError, setSelectedPresetId]);

  return handleFileUpload;
};

export default useSchemaFile;

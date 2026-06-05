import React, { createContext, useState, useEffect, ChangeEvent } from "react";
import { PRESET_SCHEMAS } from "../constants/presets";
import { SynthesizedData } from "../type/SynthesizedData";
import { LocaleItem } from "../type/LocaleItem";
import { SynthesizerContextType } from "../type/SynthesizerContextType";

// Import Custom Hooks
import useClipboard from "../hooks/useClipboard";
import useSchemaFile from "../hooks/useSchemaFile";
import useDataGrid from "../hooks/useDataGrid";
import useDownloader from "../hooks/useDownloader";
import usePresetLoader from "../hooks/usePresetLoader";
import useSynthesisEngine from "../hooks/useSynthesisEngine";

export const LOCALES: LocaleItem[] = [
  { code: "English (US)", flag: "🇺🇸", region: "United States (USD, Western names)" },
  { code: "German (DE)", flag: "🇩🇪", region: "Germany (EUR, Central European names)" },
  { code: "Japanese (JP)", flag: "🇯🇵", region: "Japan (JPY, Japanese Kanji/Romaji)" },
  { code: "Spanish (ES)", flag: "🇪🇸", region: "Spain (EUR, Ibero-Romance formatting)" },
  { code: "French (FR)", flag: "🇫🇷", region: "France (EUR, Gallic phone standards)" },
  { code: "Brazilian (BR)", flag: "🇧🇷", region: "Brazil (BRL, Portuguese names, CPF-like IDs)" },
  { code: "UK English (GB)", flag: "🇬🇧", region: "United Kingdom (GBP, London postal prefixes)" },
  { code: "Chinese (ZH)", flag: "🇨🇳", region: "China (CNY, Simplified Hanji, RMB notation)" },
  { code: "Hindi (IN)", flag: "🇮🇳", region: "India (INR, South Asian names, standard phone codes)" }
];

export const SynthesizerContext = createContext<SynthesizerContextType | undefined>(undefined);

export const SynthesizerProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("saas-users");
  const [schemaType, setSchemaType] = useState<"typescript" | "json">("typescript");
  const [schemaText, setSchemaText] = useState<string>("");
  const [recordCount, setRecordCount] = useState<number>(10);
  const [locale, setLocale] = useState<string>("English (US)");
  const [customInstruction, setCustomInstruction] = useState<string>("");

  // UI States
  const [activeTab, setActiveTab] = useState<"prototype" | "grid" | "insights" | "integration" | "zod">("prototype");
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [synthesisProgress, setSynthesisProgress] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Loaded Synthesized Data state
  const [synthesizedResult, setSynthesizedResult] = useState<SynthesizedData | null>(null);

  // Spreadsheet / Grid states
  const [searchText, setSearchText] = useState<string>("");
  const [sortKey, setSortKey] = useState<string>("");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number | null>(null);

  // 1. Preset schema loaders custom hook
  usePresetLoader({
    selectedPresetId,
    setSchemaText,
    setSchemaType,
    setLocale,
    setCustomInstruction,
    setValidationError
  });

  // 2. Drag & Drop or upload custom hook
  const handleFileUpload = useSchemaFile({
    setSchemaText,
    setSchemaType,
    setValidationError,
    setSelectedPresetId
  });

  // 3. Synthesis logic custom hook
  const { triggerSynthesis, loadDefaultData } = useSynthesisEngine({
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
    setActiveTab
  });

  // 4. Clipboard helper custom hook
  const [copiedText, copyToClipboard] = useClipboard();

  // 5. Downloader custom hook
  const { downloadJSON, downloadTypescriptFile, downloadCSV } = useDownloader({
    synthesizedResult,
    selectedPresetId,
    schemaType,
    locale,
    recordCount
  });

  // 6. Data grid processor custom hook
  const { processedDataGrid, dataHeadersKeys } = useDataGrid({
    synthesizedResult,
    searchText,
    sortKey,
    sortAsc
  });

  // Automatically trigger bootstrap on initial mount
  useEffect(() => {
    loadDefaultData();
  }, [loadDefaultData]);

  // Validate manual schema input key strokes
  const handleSchemaChange = (text: string) => {
    setSchemaText(text);
    if (schemaType === "json") {
      try {
        if (text.trim()) {
          JSON.parse(text);
        }
        setValidationError(null);
      } catch (err: any) {
        setValidationError(`Invalid JSON syntax: ${err.message}`);
      }
    } else {
      setValidationError(null);
    }
  };

  return (
    <SynthesizerContext.Provider
      value={{
        selectedPresetId,
        setSelectedPresetId,
        schemaType,
        setSchemaType,
        schemaText,
        setSchemaText,
        recordCount,
        setRecordCount,
        locale,
        setLocale,
        customInstruction,
        setCustomInstruction,
        activeTab,
        setActiveTab,
        isSynthesizing,
        synthesisProgress,
        errorMessage,
        copiedText,
        validationError,
        synthesizedResult,
        setSynthesizedResult,
        searchText,
        setSearchText,
        sortKey,
        setSortKey,
        sortAsc,
        setSortAsc,
        selectedRecordIndex,
        setSelectedRecordIndex,
        processedDataGrid,
        dataHeadersKeys,
        handleSchemaChange,
        handleFileUpload,
        triggerSynthesis,
        copyToClipboard,
        downloadJSON,
        downloadCSV,
        downloadTypescriptFile
      }}
    >
      {children}
    </SynthesizerContext.Provider>
  );
};

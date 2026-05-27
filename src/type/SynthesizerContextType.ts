import { ChangeEvent } from "react";
import { SynthesizedData } from "./SynthesizedData";

export interface SynthesizerContextType {
  // Config state
  selectedPresetId: string;
  setSelectedPresetId: (id: string) => void;
  schemaType: "typescript" | "json";
  setSchemaType: (type: "typescript" | "json") => void;
  schemaText: string;
  setSchemaText: (text: string) => void;
  recordCount: number;
  setRecordCount: (count: number) => void;
  locale: string;
  setLocale: (locale: string) => void;
  customInstruction: string;
  setCustomInstruction: (instruction: string) => void;

  // UI state
  activeTab: "prototype" | "grid" | "insights" | "integration";
  setActiveTab: (tab: "prototype" | "grid" | "insights" | "integration") => void;
  isSynthesizing: boolean;
  synthesisProgress: string;
  errorMessage: string | null;
  copiedText: boolean;
  validationError: string | null;

  // Results state
  synthesizedResult: SynthesizedData | null;
  setSynthesizedResult: (result: SynthesizedData | null) => void;

  // Search/Sort/Table states
  searchText: string;
  setSearchText: (text: string) => void;
  sortKey: string;
  setSortKey: (key: string) => void;
  sortAsc: boolean;
  setSortAsc: (asc: boolean) => void;
  selectedRecordIndex: number | null;
  setSelectedRecordIndex: (idx: number | null) => void;

  // Computed Grid fields
  processedDataGrid: any[];
  dataHeadersKeys: string[];

  // Actions
  handleSchemaChange: (text: string) => void;
  handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  triggerSynthesis: () => Promise<void>;
  copyToClipboard: (text: string) => void;
  downloadJSON: () => void;
  downloadCSV: () => void;
  downloadTypescriptFile: () => void;
}

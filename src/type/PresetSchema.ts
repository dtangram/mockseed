export interface PresetSchema {
  id: string;
  name: string;
  description: string;
  type: "typescript" | "json";
  schemaText: string;
  suggestedLocale: string;
  suggestedInstruction?: string;
}

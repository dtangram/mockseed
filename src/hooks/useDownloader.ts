import { useCallback } from "react";
import { SynthesizedData } from "../type/SynthesizedData";

interface UseDownloaderProps {
  synthesizedResult: SynthesizedData | null;
  selectedPresetId: string;
  schemaType: "typescript" | "json";
  locale: string;
  recordCount: number;
}

const useDownloader = ({
  synthesizedResult,
  selectedPresetId,
  schemaType,
  locale,
  recordCount,
}: UseDownloaderProps) => {
  const downloadJSON = useCallback(() => {
    if (!synthesizedResult) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(synthesizedResult.data, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `synthesized_mock_${selectedPresetId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [synthesizedResult, selectedPresetId]);

  const downloadTypescriptFile = useCallback(() => {
    if (!synthesizedResult) return;
    const fileContent = `/**
 * Generated Mock Dataset
 * Target Schema Mode: ${schemaType.toUpperCase()}
 * Presumed Locale: ${synthesizedResult.localeInfo?.detectedLocale || locale}
 * Record Counts: ${synthesizedResult.data?.length || recordCount} records
 * Inferred rules: ${synthesizedResult.explanation?.replace(/\n/g, "\n * ")}
 */

export interface MockRecord {
  [key: string]: any;
}

export const SYNTHESIZED_MOCK_DATA: MockRecord[] = ${JSON.stringify(synthesizedResult.data, null, 2)};
`;
    const dataStr = "data:text/typescript;charset=utf-8," + encodeURIComponent(fileContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mockData.ts`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [synthesizedResult, schemaType, locale, recordCount]);

  const downloadCSV = useCallback(() => {
    if (!synthesizedResult || !synthesizedResult.data.length) return;
    const headers = Object.keys(synthesizedResult.data[0]);
    const csvRows = [
      headers.join(","),
      ...synthesizedResult.data.map(row =>
        headers.map(fieldName => {
          let value = row[fieldName];
          if (typeof value === "object" && value !== null) {
            value = JSON.stringify(value);
          }
          const escaped = ("" + value).replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `synthesized_dataset_${selectedPresetId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [synthesizedResult, selectedPresetId]);

  return { downloadJSON, downloadTypescriptFile, downloadCSV };
};

export default useDownloader;

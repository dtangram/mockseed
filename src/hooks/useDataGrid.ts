import { useMemo } from "react";
import { SynthesizedData } from "../type/SynthesizedData";

interface UseDataGridProps {
  synthesizedResult: SynthesizedData | null;
  searchText: string;
  sortKey: string;
  sortAsc: boolean;
}

const useDataGrid = ({
  synthesizedResult,
  searchText,
  sortKey,
  sortAsc,
}: UseDataGridProps) => {
  const processedDataGrid = useMemo(() => {
    if (!synthesizedResult || !synthesizedResult.data) return [];
    let items = [...synthesizedResult.data];

    if (searchText.trim()) {
      const query = searchText.toLowerCase();
      items = items.filter(row => {
        return Object.values(row).some(val => {
          if (val === null || val === undefined) return false;
          if (typeof val === "object") {
            return JSON.stringify(val).toLowerCase().includes(query);
          }
          return String(val).toLowerCase().includes(query);
        });
      });
    }

    if (sortKey) {
      items.sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];

        if (typeof valA === "object" && valA !== null) valA = JSON.stringify(valA);
        if (typeof valB === "object" && valB !== null) valB = JSON.stringify(valB);

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (typeof valA === "number" && typeof valB === "number") {
          return sortAsc ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();

        if (strA < strB) return sortAsc ? -1 : 1;
        if (strA > strB) return sortAsc ? 1 : -1;
        return 0;
      });
    }

    return items;
  }, [synthesizedResult, searchText, sortKey, sortAsc]);

  const dataHeadersKeys = useMemo(() => {
    if (!synthesizedResult || !synthesizedResult.data || !synthesizedResult.data.length) return [];
    return Object.keys(synthesizedResult.data[0]);
  }, [synthesizedResult]);

  return { processedDataGrid, dataHeadersKeys };
};

export default useDataGrid;

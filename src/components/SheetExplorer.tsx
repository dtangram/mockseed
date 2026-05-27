import React from "react";
import { Search, ArrowUpDown } from "lucide-react";
import useSynthesizer from "../hooks/useSynthesizer";

const SheetExplorer = () => {
  const {
    synthesizedResult,
    searchText,
    setSearchText,
    sortKey,
    setSortKey,
    sortAsc,
    setSortAsc,
    selectedRecordIndex,
    setSelectedRecordIndex,
    processedDataGrid,
    dataHeadersKeys
  } = useSynthesizer();

  if (!synthesizedResult || !synthesizedResult.data || synthesizedResult.data.length === 0) {
    return (
      <section className="text-center p-12 text-slate-500">
        Wait, no dataset synced. Compile on left first.
      </section>
    );
  }

  return (
    <section className="space-y-4" id="tab-grid-content">
      <section className="space-y-4">
        {/* Filters and search line */}
        <header className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <span className="relative w-full sm:max-w-xs block">
            <label htmlFor="grid-search-filter" className="sr-only">Search database records</label>
            <input
              id="grid-search-filter"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search database records..."
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-hidden rounded-lg pl-9 pr-4 py-1.5 text-xs outline-hidden"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" aria-hidden="true" />
          </span>

          <span className="text-[11px] font-mono text-slate-400 shrink-0">
            Showing {processedDataGrid.length} of {synthesizedResult.data.length} synthesized entries
          </span>
        </header>

        {/* Table element */}
        <section className="bg-slate-950 border border-slate-800/80 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono uppercase text-[9px] tracking-wider">
                <th className="p-3 font-semibold">Row</th>
                {dataHeadersKeys.slice(0, 5).map(key => (
                  <th 
                    key={key}
                    aria-sort={sortKey === key ? (sortAsc ? "ascending" : "descending") : "none"}
                    className="p-3 font-semibold hover:bg-slate-800 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (sortKey === key) {
                          setSortAsc(!sortAsc);
                        } else {
                          setSortKey(key);
                          setSortAsc(true);
                        }
                      }}
                      className="font-mono text-left w-full h-full hover:text-indigo-400 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-hidden flex items-center justify-between gap-1"
                      aria-label={`Sort by ${key}`}
                    >
                      <span>{key}</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500 shrink-0" aria-hidden="true" />
                    </button>
                  </th>
                ))}
                {dataHeadersKeys.length > 5 && <th className="p-3 font-semibold">More...</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {processedDataGrid.map((row, idx) => (
                <tr 
                  key={idx} 
                  className="hover:bg-slate-800/20 transition-all cursor-pointer"
                  onClick={() => setSelectedRecordIndex(idx)}
                >
                  <td className="p-3 font-mono text-[10px] text-slate-500">{idx + 1}</td>
                  {dataHeadersKeys.slice(0, 5).map(key => {
                    const val = row[key];
                    let textVal = "";
                    if (val === null || val === undefined) {
                      textVal = "—";
                    } else if (typeof val === "object") {
                      textVal = JSON.stringify(val);
                    } else {
                      textVal = String(val);
                    }
                    return (
                      <td key={key} className="p-3 max-w-[150px] truncate font-mono text-slate-300">
                        {textVal}
                      </td>
                    );
                  })}
                  {dataHeadersKeys.length > 5 && (
                    <td className="p-3 text-[10px] text-indigo-400 font-medium">Inspect</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Detailed expanded state pop */}
        {selectedRecordIndex !== null && (
          <section className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono" aria-label="Expanded Record Display">
            <header className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-200">Expanded Record Viewer</span>
              <button 
                type="button"
                className="text-[10px] text-slate-500 hover:text-slate-300 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-hidden cursor-pointer"
                onClick={() => setSelectedRecordIndex(null)}
                aria-label="Close extended details overlay"
              >
                Close Overlay
              </button>
            </header>
            <pre className="text-[11px] text-slate-300 whitespace-pre-wrap leading-normal max-h-[200px] overflow-y-auto">
              {JSON.stringify(synthesizedResult.data[selectedRecordIndex], null, 2)}
            </pre>
          </section>
        )}
      </section>
    </section>
  );
};

export default SheetExplorer;

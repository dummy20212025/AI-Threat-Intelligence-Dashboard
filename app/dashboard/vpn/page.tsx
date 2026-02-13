"use client";

import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { useTheme } from "next-themes";
import { Database, Loader2, ShieldCheck, RefreshCw } from "lucide-react";

interface CSVRow {
  [key: string]: string | number;
}

export default function VPNDetectionPage() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<CSVRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  const fetchCSVData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/vpn.csv`);
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length > 0) {
            setHeaders(Object.keys(results.data[0] as object));
            setData(results.data as CSVRow[]);
          }
          setIsLoading(false);
        },
        error: (error: Error) => {
          console.error("Parsing error:", error);
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Fetch error:", error);
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className={`p-8 min-h-screen transition-colors duration-700 font-sans 
      ${isDark ? "bg-slate-950 text-slate-100" : "bg-gray-50 text-gray-900"}`}>
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className={`text-3xl font-extrabold tracking-tight transition-colors
              ${isDark ? "text-blue-500" : "text-gray-900"}`}>
              Recent VPN Detection
            </h1>
            <div className={`h-1 w-20 mt-2 rounded-full ${isDark ? "bg-blue-500/50" : "bg-blue-600/20"}`} />
          </div>
          
          <div className="flex gap-3">
             {data.length > 0 && (
                <button
                  onClick={() => setData([])}
                  className={`p-2 rounded-lg transition-colors ${isDark ? "text-slate-500 hover:text-slate-300" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <RefreshCw size={20} />
                </button>
             )}
            <button
              onClick={fetchCSVData}
              disabled={isLoading}
              className={`flex items-center gap-2 font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg active:transform active:scale-95 disabled:opacity-50
                ${isDark 
                  ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20" 
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"}`}
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Database size={18} />}
              {isLoading ? "Fetching..." : "Get Data"}
            </button>
          </div>
        </div>

        {/* Table Display */}
        {data.length > 0 ? (
          <div className={`overflow-x-auto border rounded-2xl transition-all duration-500 shadow-xl
            ${isDark ? "bg-slate-900 border-slate-800 shadow-black/50" : "bg-white border-gray-200 shadow-gray-200"}`}>
            <table className="w-full text-sm text-left">
              <thead className={`text-xs uppercase font-bold transition-colors
                ${isDark ? "bg-slate-800/50 text-slate-400" : "bg-gray-100 text-gray-700"}`}>
                <tr>
                  {headers.map((header) => (
                    <th key={header} className="px-6 py-4 tracking-wider">
                      {header.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y transition-colors ${isDark ? "divide-slate-800" : "divide-gray-200"}`}>
                {data.map((row, index) => (
                  <tr key={index} className={`transition-colors 
                    ${isDark ? "bg-slate-900/50 hover:bg-blue-900/20" : "bg-white hover:bg-blue-50"}`}>
                    {headers.map((header) => (
                      <td key={`${index}-${header}`} className={`px-6 py-4 whitespace-nowrap font-medium
                        ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={`flex flex-col items-center justify-center h-80 border-2 border-dashed rounded-[2.5rem] transition-all duration-500
            ${isDark 
              ? "bg-slate-900/30 border-slate-800" 
              : "bg-white border-gray-200 shadow-sm"}`}>
            
            <div className={`p-6 rounded-full mb-4 transition-colors
              ${isDark ? "bg-slate-800 text-slate-600" : "bg-blue-50 text-blue-200"}`}>
              <ShieldCheck size={48} strokeWidth={1.5} />
            </div>
            
            <p className={`text-lg font-medium transition-colors ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              No detection logs loaded.
            </p>
            <p className={`text-sm mt-1 transition-colors ${isDark ? "text-slate-500" : "text-gray-400"}`}>
              Click <span className="font-bold text-blue-500">"Get Data"</span> to process VPN logs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import Papa from "papaparse";

interface CSVRow {
  [key: string]: string | number;
}

export default function VPNDetectionPage() {
  const [data, setData] = useState<CSVRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCSVData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch the file from the public folder
      const response = await fetch(`/vpn.csv`);
      const csvText = await response.text();

      // 2. Parse the CSV text
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

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Recent VPN Detection
        </h1>
        
        <button
          onClick={fetchCSVData}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-lg active:transform active:scale-95"
        >
          {isLoading ? "Fetching..." : "Get Data"}
        </button>
      </div>

      {/* Table Display */}
      {data.length > 0 ? (
        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="px-6 py-4 font-bold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr key={index} className="bg-white hover:bg-blue-50 transition-colors">
                  {headers.map((header) => (
                    <td key={`${index}-${header}`} className="px-6 py-4 whitespace-nowrap">
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <p className="text-gray-500 text-lg">
            No data loaded. Click <span className="font-semibold text-blue-600">"Get Data"</span> to view detection logs.
          </p>
        </div>
      )}
    </div>
  );
}
"use client";
import React, { useState, useMemo } from 'react';
import Papa from 'papaparse';
import {
    Calendar,
    Database,
    Filter,
    Loader2,
    ChevronLeft,
    ChevronRight,
    RefreshCcw,
    ShieldAlert,
    Clock
} from 'lucide-react';

export default function Page() {
    const [data, setData] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [quickRange, setQuickRange] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 12;

    const handleQuickRangeChange = (days: string) => {
        setQuickRange(days);
        setStartDate("");
        setEndDate("");
    };

    const handleDateChange = (type: 'start' | 'end', value: string) => {
        if (type === 'start') setStartDate(value);
        if (type === 'end') setEndDate(value);
        setQuickRange("");
    };

    const resetFilters = () => {
        setStartDate("");
        setEndDate("");
        setQuickRange("");
        setData([]);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (quickRange) params.append('days', quickRange);
            if (startDate) params.append('start', startDate);
            if (endDate) params.append('end', endDate);

            const response = await fetch(`/api/tunneling?${params}`);
            if (!response.ok) throw new Error('Network response was not ok');

            const csvText = await response.text();

            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.data.length > 0) {
                        setHeaders(Object.keys(results.data[0] as Record<string, any>));
                        setData(results.data as any[]);
                    }
                    setCurrentPage(1);
                },
            });
        } catch (error) {
            console.error("Error fetching tunneling data:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(data.length / rowsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return data.slice(start, start + rowsPerPage);
    }, [data, currentPage]);


    const [isLoading, setIsLoading] = useState(false);

    const fetchCSVData = async () => {
        setIsLoading(true);
        try {
            // 1. Fetch the file from the public folder
            const response = await fetch(`/dnstunnel.csv`);
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
        <div className="flex flex-col gap-8 w-full max-w-[1600px] mx-auto p-6 md:p-10 bg-gray-50 min-h-screen">
            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 ml-1">Tunneling Analysis</h2>
                </div>
                <button
                    onClick={resetFilters}
                    className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase hover:text-blue-600 transition-colors mb-2"
                >
                    <RefreshCcw size={12} /> Reset View
                </button>
            </div>

            {/* CONTROL PANEL */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-wrap items-end gap-8">

                {/* Date & Time Inputs */}
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 flex items-center gap-2">
                        <Clock size={12} /> Specific Time Range
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="datetime-local"
                            value={startDate}
                            className="bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                            onChange={(e) => handleDateChange('start', e.target.value)}
                        />
                        <span className="text-gray-300 font-medium">to</span>
                        <input
                            type="datetime-local"
                            value={endDate}
                            className="bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                            onChange={(e) => handleDateChange('end', e.target.value)}
                        />
                    </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 flex items-center gap-2">
                        <Filter size={12} /> Presets
                    </label>
                    <div className="flex bg-gray-50 p-1.5 rounded-2xl">
                        {[1, 5, 15, 30].map((days) => (
                            <button
                                key={days}
                                onClick={() => handleQuickRangeChange(days.toString())}
                                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${quickRange === days.toString()
                                    ? 'bg-white text-blue-600 shadow-md scale-105'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {days}d
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    onClick={fetchCSVData}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-lg active:transform active:scale-95"
                >
                    {isLoading ? "Fetching..." : "Get Data"}
                </button>
            </div>

            <div className="p-8 font-sans max-w-7xl mx-auto">
                {/* Header Section */}

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


        </div>
    );
}
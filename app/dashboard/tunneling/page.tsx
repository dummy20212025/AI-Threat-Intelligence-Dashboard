"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Papa from 'papaparse';
import { useTheme } from "next-themes";
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

// Framer Motion Wrappers (Assuming these are in your components folder as per reference)
import { MDiv, MH3, containerVariants, itemVariants } from "@/components/framer/MotionWrappers";

export default function Page() {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const [data, setData] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [quickRange, setQuickRange] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 12;

    // Ensure component is mounted to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

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

    const fetchCSVData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/dnstunnel.csv`);
            const csvText = await response.text();

            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.data.length > 0) {
                        setHeaders(Object.keys(results.data[0] as object));
                        setData(results.data as any[]);
                    }
                    setIsLoading(false);
                    setCurrentPage(1);
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

    const totalPages = Math.ceil(data.length / rowsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return data.slice(start, start + rowsPerPage);
    }, [data, currentPage]);

    const [isLoading, setIsLoading] = useState(false);

    if (!mounted) return null;

    return (
        <div className={`flex flex-col min-h-screen w-full transition-colors duration-700 
            ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-slate-900"}`}>

            <MDiv
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex-1 flex flex-col gap-8 w-full max-w-[1600px] mx-auto p-6 md:p-10"
            >
                {/* HEADER */}
                <MDiv variants={itemVariants} className="flex justify-between items-end">
                    <div>
                        <h2 className={`text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight transition-colors
                            ${isDark ? "text-blue-500" : "text-blue-600"}`}>
                            Tunneling Analysis
                        </h2>
                        <MDiv
                            initial={{ width: 0 }}
                            animate={{ width: "6rem" }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className={`h-1 mt-2 rounded-full shadow-lg 
                                ${isDark ? "bg-blue-500 shadow-blue-500/40" : "bg-blue-600 shadow-blue-600/20"}`}
                        />
                    </div>
                    <button
                        onClick={resetFilters}
                        className={`flex items-center gap-2 text-[10px] font-bold uppercase transition-colors mb-2
                            ${isDark ? "text-slate-500 hover:text-blue-400" : "text-gray-400 hover:text-blue-600"}`}
                    >
                        <RefreshCcw size={12} /> Reset View
                    </button>
                </MDiv>

                {/* CONTROL PANEL */}
                <MDiv
                    variants={itemVariants}
                    className={`p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-wrap items-end gap-8
                        ${isDark
                            ? "bg-slate-900/50 border-slate-800 shadow-2xl shadow-black backdrop-blur-md"
                            : "bg-white border-white/20 shadow-xl shadow-gray-200"}`}
                >
                    {/* Date & Time Inputs */}
                    <div className="flex flex-col gap-3">
                        <label className={`text-[10px] font-bold uppercase ml-2 flex items-center gap-2 transition-colors
                            ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                            <Clock size={12} /> Specific Time Range
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="datetime-local"
                                value={startDate}
                                className={`rounded-xl px-4 py-2.5 text-sm focus:ring-2 transition-all outline-none border-none
                                    ${isDark ? "bg-slate-800 text-white focus:ring-blue-500/40" : "bg-gray-50 text-slate-900 focus:ring-blue-500/20"}`}
                                onChange={(e) => handleDateChange('start', e.target.value)}
                            />
                            <span className={isDark ? "text-slate-600" : "text-gray-300"}>to</span>
                            <input
                                type="datetime-local"
                                value={endDate}
                                className={`rounded-xl px-4 py-2.5 text-sm focus:ring-2 transition-all outline-none border-none
                                    ${isDark ? "bg-slate-800 text-white focus:ring-blue-500/40" : "bg-gray-50 text-slate-900 focus:ring-blue-500/20"}`}
                                onChange={(e) => handleDateChange('end', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex flex-col gap-3">
                        <label className={`text-[10px] font-bold uppercase ml-2 flex items-center gap-2 transition-colors
                            ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                            <Filter size={12} /> Presets
                        </label>
                        <div className={`p-1.5 rounded-2xl flex ${isDark ? "bg-slate-800" : "bg-gray-50"}`}>
                            {[1, 5, 15, 30].map((days) => (
                                <button
                                    key={days}
                                    onClick={() => handleQuickRangeChange(days.toString())}
                                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${quickRange === days.toString()
                                        ? (isDark ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-blue-600 shadow-md scale-105')
                                        : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600')
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
                        className={`font-bold py-2.5 px-8 rounded-xl transition-all shadow-lg active:transform active:scale-95 disabled:opacity-50
                            ${isDark
                                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"}`}
                    >
                        {isLoading ? "Fetching Logs..." : "Get Data"}
                    </button>
                </MDiv>

                {/* TABLE SECTION */}
                <MDiv variants={itemVariants} className="w-full">
                    {data.length > 0 ? (
                        <div className={`rounded-[2.5rem] border overflow-hidden transition-all duration-500
                            ${isDark ? "bg-slate-900 border-slate-800 shadow-2xl" : "bg-white border-gray-100 shadow-xl"}`}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className={`uppercase text-[10px] font-bold tracking-widest border-b transition-colors
                                            ${isDark ? "bg-slate-800/50 text-slate-400 border-slate-700" : "bg-gray-50 text-gray-500 border-gray-100"}`}>
                                            {headers.map((header) => (
                                                <th key={header} className="px-8 py-5">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y transition-colors ${isDark ? "divide-slate-800" : "divide-gray-100"}`}>
                                        {paginatedData.map((row, index) => (
                                            <tr key={index} className={`transition-all duration-300 
                                                ${isDark ? "hover:bg-blue-900/10 text-slate-300" : "hover:bg-blue-50/50 text-gray-600"}`}>
                                                {headers.map((header) => (
                                                    <td key={`${index}-${header}`} className="px-8 py-4 whitespace-nowrap">
                                                        {row[header]}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className={`flex flex-col items-center justify-center h-80 rounded-[2.5rem] border-2 border-dashed transition-all duration-500
                            ${isDark
                                ? "bg-slate-900/30 border-slate-800 text-slate-500"
                                : "bg-gray-50 border-gray-200 text-gray-400"}`}>
                            <Database size={48} className="mb-4 opacity-20" />
                            <p className="text-lg">
                                No data loaded. Click <span className="font-semibold text-blue-500">"Get Data"</span> to view detection logs.
                            </p>
                        </div>
                    )}
                </MDiv>

                {/* PAGINATION CONTROLS */}
                {data.length > rowsPerPage && (
                    <MDiv variants={itemVariants} className="flex justify-center items-center gap-4 mt-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`p-3 rounded-xl transition-all duration-300 disabled:opacity-30
                ${isDark
                                    ? "bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400"
                                    : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-600"}`}
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className={`px-6 py-2 rounded-xl font-bold text-sm border transition-all
            ${isDark
                                ? "bg-slate-900 border-slate-800 text-blue-400"
                                : "bg-white border-gray-200 text-blue-600"}`}>
                            Page {currentPage} <span className={isDark ? "text-slate-600" : "text-gray-300"}>of</span> {totalPages}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`p-3 rounded-xl transition-all duration-300 disabled:opacity-30
                ${isDark
                                    ? "bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400"
                                    : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-600"}`}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </MDiv>
                )}
            </MDiv>
        </div>
    );
}
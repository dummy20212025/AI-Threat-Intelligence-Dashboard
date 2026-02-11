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
    ShieldAlert
} from 'lucide-react';

export default function Page() {
    // Data States
    const [data, setData] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Filter States
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [quickRange, setQuickRange] = useState("");

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 12;

    // Mutual Exclusion Handlers
    const handleQuickRangeChange = (days: string) => {
        setQuickRange(days);
        setStartDate(""); // Clear manual dates
        setEndDate("");
    };

    const handleDateChange = (type: 'start' | 'end', value: string) => {
        if (type === 'start') setStartDate(value);
        if (type === 'end') setEndDate(value);
        setQuickRange(""); // Clear preset buttons
    };

    const resetFilters = () => {
        setStartDate("");
        setEndDate("");
        setQuickRange("");
    };

    // Fetch Logic
    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (quickRange) params.append('days', quickRange);
            if (startDate) params.append('start', startDate);
            if (endDate) params.append('end', endDate);

            // Replace with your actual backend endpoint
            const response = await fetch(`/api/phishing?${params}`);
            // const response = await fetch(`api/phishing`);
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
            console.error("Error fetching portscan data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Pagination Calculation
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return data.slice(start, start + rowsPerPage);
    }, [data, currentPage]);

    return (
        <div className="flex flex-col gap-8 w-full max-w-[1600px] mx-auto p-6 md:p-10 bg-gray-50 min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div>
                    {/* <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-1 ml-1">
                        Network Security
                    </h3> */}
                    <h2 className="text-3xl font-bold text-gray-800 ml-1">Phishing</h2>
                </div>
                <button
                    onClick={resetFilters}
                    className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase hover:text-blue-600 transition-colors mb-2"
                >
                    <RefreshCcw size={12} /> Reset Filters
                </button>
            </div>

            {/* CONTROL PANEL */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-wrap items-end gap-8">

                {/* Date Inputs */}
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 flex items-center gap-2">
                        <Calendar size={12} /> Custom Date Range
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="date"
                            value={startDate}
                            className="bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                            onChange={(e) => handleDateChange('start', e.target.value)}
                        />
                        <span className="text-gray-300 font-medium">to</span>
                        <input
                            type="date"
                            value={endDate}
                            className="bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                            onChange={(e) => handleDateChange('end', e.target.value)}
                        />
                    </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 flex items-center gap-2">
                        <Filter size={12} /> Quick History
                    </label>
                    <div className="flex bg-gray-50 p-1.5 rounded-2xl">
                        {[5, 10, 15, 20].map((days) => (
                            <button
                                key={days}
                                onClick={() => handleQuickRangeChange(days.toString())}
                                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${quickRange === days.toString()
                                    ? 'bg-white text-blue-600 shadow-md scale-105'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                Last {days}d
                            </button>
                        ))}
                    </div>
                </div>

                {/* Get Data Button */}
                <button
                    onClick={fetchData}
                    disabled={loading || (!quickRange && !startDate)}
                    className="ml-auto flex items-center gap-3 bg-blue-600 px-10 py-4 rounded-[1.5rem] shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0 transition-all font-bold text-sm text-white disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Database size={20} />}
                    {loading ? "Processing..." : "Get Data"}
                </button>
            </div>

            {/* DATA TABLE SECTION */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_35px_70px_rgba(0,0,0,0.05)] border border-gray-100 min-h-[400px] flex flex-col">
                <div className="overflow-x-auto flex-1">
                    {data.length > 0 ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    {headers.map((h) => (
                                        <th key={h} className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                            {h.replace(/_/g, ' ')}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginatedData.map((row, i) => (
                                    <tr
                                        key={i}
                                        className={`
                transition-colors group
                even:bg-gray-300/50 odd:bg-white 
                hover:bg-blue-50/60 
            `}
                                    >
                                        {headers.map((h) => (
                                            <td key={h} className="px-8 py-5 text-sm text-gray-600 font-medium whitespace-nowrap">
                                                {row[h]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="h-[400px] flex flex-col items-center justify-center text-gray-400 gap-5">
                            <div className="p-8 bg-blue-50/50 rounded-full text-blue-200">
                                <ShieldAlert size={48} strokeWidth={1.5} />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-gray-800 text-lg uppercase tracking-tight">Ready for analysis</p>
                                <p className="text-sm">Configure parameters above to pull phishing logs.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* PAGINATION FOOTER */}
                {data.length > 0 && (
                    <div className="p-8 border-t border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Page {currentPage} of {totalPages}
                            </span>
                            <div className="h-1 w-24 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-500"
                                    style={{ width: `${(currentPage / totalPages) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-all"
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-all"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

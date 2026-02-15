"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Papa from 'papaparse';
import { useTheme } from "next-themes";
import {
    Database,
    Filter,
    Loader2,
    ChevronLeft,
    ChevronRight,
    RefreshCcw,
    ShieldAlert,
    Clock,
    Download,
    FileQuestion,
    SearchX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import PhishingTable from '@/components/table/PhishingTable';
import PieChartWithNeedlePhishing from '@/components/real_time_guages/PieChartWithNeedlePhishing';

export default function Page() {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const [data, setData] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasQueried, setHasQueried] = useState(false); 
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [quickRange, setQuickRange] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 12;

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

    const handleQuickRangeChange = (days: string) => {
        setQuickRange(days);
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - parseInt(days));
        const toLocalISO = (d: Date) => {
            const z = d.getTimezoneOffset() * 60 * 1000;
            const local = new Date(d.getTime() - z);
            return local.toISOString().slice(0, 16);
        };
        setStartDate(toLocalISO(start));
        setEndDate(toLocalISO(end));
    };

    const handleDateChange = (type: 'start' | 'end', value: string) => {
        if (type === 'start') setStartDate(value);
        if (type === 'end') setEndDate(value);
        setQuickRange("");
    };

    const handleDownload = (fileName: string) => {
        const link = document.createElement("a");
        link.href = `/${fileName}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const resetFilters = () => {
        setStartDate("");
        setEndDate("");
        setQuickRange("");
        setData([]);
        setHasQueried(false);
    };

    const fetchData = async () => {
        setLoading(true);
        // We don't set hasQueried to true until the processing is actually finished
        try {
            const params = new URLSearchParams();
            if (startDate) params.append('start', startDate);
            if (endDate) params.append('end', endDate);
            if (quickRange && !startDate) params.append('days', quickRange);

            const response = await fetch(`/api/phishing?${params}`);
            if (!response.ok) throw new Error('Network response was not ok');

            const csvText = await response.text();

            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.data && results.data.length > 0) {
                        const rawData = results.data as any[];
                        const firstRowValues = Object.values(rawData[0]).filter(v => v !== "" && v !== null);
                        
                        if (firstRowValues.length > 0) {
                            const sortedData = rawData.sort((a, b) => {
                                return new Date(b['@timestamp']).getTime() - new Date(a['@timestamp']).getTime();
                            });
                            setHeaders(Object.keys(sortedData[0] as Record<string, any>));
                            setData(sortedData);
                        } else {
                            setData([]);
                        }
                    } else {
                        setData([]);
                    }
                    setCurrentPage(1);
                    setHasQueried(true); // Processing is finished
                    setLoading(false);
                },
            });
        } catch (error) {
            console.error("Error fetching phishing data:", error);
            setData([]);
            setHasQueried(true);
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(data.length / rowsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return data.slice(start, start + rowsPerPage);
    }, [data, currentPage]);

    if (!mounted) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex flex-col gap-10 w-full max-w-[1600px] mx-auto p-6 md:p-10 transition-colors duration-700 min-h-screen
                ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-slate-900"}`}
        >
            {/* 1. HEADER & DOWNLOADS */}
            <div className="w-full flex flex-col items-center gap-8">
                <div className="text-center">
                    <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight transition-colors
                        ${isDark ? "text-blue-500" : "text-blue-600"}`}>
                        AI-Enabled Zero-day Phishing (AZP)
                    </h2>
                    <div className={`h-1.5 w-48 mx-auto mt-4 rounded-full ${isDark ? "bg-emerald-500" : "bg-blue-600"}`} />
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    <button onClick={() => handleDownload('threat_intel_DB_ips.csv')} className="flex items-center gap-3 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg">
                        <Download size={18} /> Download Malicious IPs
                    </button>
                    <button onClick={() => handleDownload('threat_intel_DB_domains.csv')} className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg">
                        <Download size={18} /> Download Malicious Domains
                    </button>
                </div>
            </div>

            {/* 2. GAUGE & ACTIVE PHISHINGS */}
            <div className="flex flex-col xl:flex-row gap-8 items-stretch">
                <div className={`flex-1 min-h-[480px] rounded-[2.5rem] p-10 border flex flex-col items-center justify-center transition-all 
                        ${isDark ? "bg-slate-900/50 border-slate-800 shadow-2xl" : "bg-white border-white shadow-xl"}`}>
                    <h3 className={`text-xs font-black uppercase tracking-[0.4em] mb-12 ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                        Real-time Risk Level
                    </h3>
                    <div className="w-full max-w-[320px]">
                        <PieChartWithNeedlePhishing label={'Risk Index'} currentValue={59} isDark={isDark} />
                    </div>
                </div>

                <div className={`flex-1 rounded-[2.5rem] border overflow-hidden flex flex-col transition-all 
                        ${isDark ? "bg-slate-900 border-slate-800 shadow-2xl" : "bg-white border-gray-100 shadow-xl"}`}>
                    <div className="flex-1 p-1">
                        <PhishingTable isDark={isDark} />
                    </div>
                </div>
            </div>

            {/* 3. CONTROL PANEL */}
            <div className={`p-8 rounded-[2.5rem] border flex flex-wrap items-end gap-8 transition-all 
                    ${isDark ? "bg-slate-900 border-slate-800 shadow-2xl" : "bg-white border-gray-100 shadow-lg"}`}>
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold uppercase ml-2 text-gray-400 flex items-center gap-2"><Clock size={12}/> Specific Time Range</label>
                    <div className="flex items-center gap-3">
                        <input type="datetime-local" value={startDate} className={`rounded-xl px-4 py-2.5 text-sm ${isDark ? "bg-slate-800 text-slate-200" : "bg-gray-50 text-slate-800"}`} onChange={(e) => handleDateChange('start', e.target.value)} />
                        <span className="text-gray-400">to</span>
                        <input type="datetime-local" value={endDate} className={`rounded-xl px-4 py-2.5 text-sm ${isDark ? "bg-slate-800 text-slate-200" : "bg-gray-50 text-slate-800"}`} onChange={(e) => handleDateChange('end', e.target.value)} />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold uppercase ml-2 text-gray-400 flex items-center gap-2"><Filter size={12}/> Presets</label>
                    <div className={`p-1.5 rounded-2xl ${isDark ? "bg-slate-800" : "bg-gray-50"}`}>
                        {[1, 5, 15, 30].map((days) => (
                            <button key={days} onClick={() => handleQuickRangeChange(days.toString())} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${quickRange === days.toString() ? (isDark ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 shadow-md') : 'text-gray-400 hover:text-gray-600'}`}>{days}d</button>
                        ))}
                    </div>
                </div>

                <button onClick={fetchData} disabled={loading || (!quickRange && !startDate)} className="ml-auto flex items-center gap-3 px-10 py-4 rounded-[1.5rem] bg-blue-600 text-white font-bold disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Database size={20} />}
                    {loading ? "Fetching..." : "Pull Records"}
                </button>
            </div>

            {/* 4. MAIN DATA LOGS TABLE */}
            <div className={`rounded-[2.5rem] overflow-hidden border min-h-[500px] flex flex-col transition-all 
                    ${isDark ? "bg-slate-900 border-slate-800 shadow-2xl" : "bg-white border-gray-100 shadow-xl"}`}>
                <div className="overflow-x-auto flex-1 flex flex-col">
                    <AnimatePresence mode='wait'>
                        {loading ? (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="animate-spin text-blue-500" size={40} />
                                <p className="text-sm font-bold text-gray-400 animate-pulse">Processing CSV Data...</p>
                            </motion.div>
                        ) : data.length > 0 ? (
                            <motion.table key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-left">
                                <thead>
                                    <tr className={isDark ? "bg-slate-800/50" : "bg-gray-50/50"}>
                                        {headers.map((h) => (
                                            <th key={h} className="px-8 py-6 text-[10px] font-bold uppercase border-b text-gray-400">{h.replace(/_/g, ' ')}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-50"}`}>
                                    {paginatedData.map((row, i) => (
                                        <tr key={i} className={`transition-colors ${isDark ? "hover:bg-blue-900/10" : "hover:bg-blue-50/60"}`}>
                                            {headers.map((h) => (
                                                <td key={h} className={`px-8 py-5 text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-600"}`}>{row[h]}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </motion.table>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
                                <div className={`p-8 rounded-full ${isDark ? "bg-slate-800 text-slate-600" : "bg-blue-50/50 text-blue-200"}`}>
                                    {hasQueried ? <SearchX size={48} /> : <ShieldAlert size={48} />}
                                </div>
                                <div>
                                    <p className={`font-black text-lg uppercase ${isDark ? "text-slate-200" : "text-gray-800"}`}>
                                        {hasQueried ? "Nothing Is There" : "System Ready"}
                                    </p>
                                    <p className="text-sm text-gray-400 max-w-xs mx-auto">
                                        {hasQueried ? "The database returned no matching records after processing your request." : "Select a time range to pull cyber logs from the database."}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* PAGINATION (Visible only if data exists) */}
                {data.length > 0 && (
                    <div className={`p-8 border-t flex items-center justify-between ${isDark ? "border-slate-800" : "border-gray-50"}`}>
                        <span className="text-[10px] font-bold uppercase text-gray-400">Page {currentPage} / {totalPages}</span>
                        <div className="flex gap-3">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-6 py-2 rounded-xl border text-xs font-bold disabled:opacity-30">Previous</button>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-6 py-2 rounded-xl border text-xs font-bold disabled:opacity-30">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
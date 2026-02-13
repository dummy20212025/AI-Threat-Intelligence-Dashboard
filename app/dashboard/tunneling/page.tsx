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
    Clock,
    Radar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Animation Wrappers (Reusing your standard variants)
import { MDiv, itemVariants, containerVariants } from "@/components/framer/MotionWrappers";

export default function ReconShieldPage() {
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
            console.error("Error fetching port scan data:", error);
        } finally {
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
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className={`flex flex-col gap-8 w-full max-w-[1600px] mx-auto p-6 md:p-10 transition-colors duration-700 min-h-screen
                ${isDark ? "bg-slate-950" : "bg-gray-50"}`}
        >
            {/* HEADER */}
            <motion.div variants={itemVariants} className="flex justify-between items-end">
                <div>
                    <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight transition-colors
                        ${isDark ? "text-blue-500" : "text-blue-600"}`}>
                        Tunneling Analysis
                    </h2>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "8rem" }}
                        className={`h-1.5 mt-2 rounded-full ${isDark ? "bg-purple-500/50" : "bg-purple-600/20"}`}
                    />
                </div>
                <motion.button
                    whileHover={{ scale: 1.05, color: '#a855f7' }}
                    onClick={resetFilters}
                    className={`flex items-center gap-2 text-[10px] font-bold uppercase transition-colors mb-2
                        ${isDark ? "text-slate-500" : "text-gray-400"}`}
                >
                    <RefreshCcw size={12} /> Reset View
                </motion.button>
            </motion.div>

            {/* CONTROL PANEL */}
            <motion.div 
                variants={itemVariants}
                className={`p-8 rounded-[2.5rem] border flex flex-wrap items-end gap-8 transition-all duration-500
                    ${isDark 
                        ? "bg-slate-900 border-slate-800 shadow-2xl shadow-black/50" 
                        : "bg-white border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)]"}`}
            >
                <div className="flex flex-col gap-3">
                    <label className={`text-[10px] font-bold uppercase ml-2 flex items-center gap-2
                        ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                        <Clock size={12} /> Time Range
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="datetime-local"
                            value={startDate}
                            className={`border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500/20 transition-all outline-none
                                ${isDark ? "bg-slate-800 text-slate-200" : "bg-gray-50 text-slate-800"}`}
                            onChange={(e) => handleDateChange('start', e.target.value)}
                        />
                        <span className="text-gray-400 font-medium italic">to</span>
                        <input
                            type="datetime-local"
                            value={endDate}
                            className={`border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500/20 transition-all outline-none
                                ${isDark ? "bg-slate-800 text-slate-200" : "bg-gray-50 text-slate-800"}`}
                            onChange={(e) => handleDateChange('end', e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className={`text-[10px] font-bold uppercase ml-2 flex items-center gap-2
                        ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                        <Filter size={12} /> Scanning Presets
                    </label>
                    <div className={`p-1.5 rounded-2xl ${isDark ? "bg-slate-800" : "bg-gray-50"}`}>
                        {[1, 5, 15, 30].map((days) => (
                            <button
                                key={days}
                                onClick={() => handleQuickRangeChange(days.toString())}
                                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${quickRange === days.toString()
                                    ? (isDark ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 shadow-md scale-105')
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {days}d
                            </button>
                        ))}
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={fetchData}
                    disabled={loading || (!quickRange && !startDate)}
                    className={`ml-auto flex items-center gap-3 px-10 py-4 rounded-[1.5rem] shadow-xl transition-all font-bold text-sm text-white disabled:opacity-50
                        ${isDark 
                            ? "bg-purple-600 shadow-purple-900/40 hover:bg-purple-500" 
                            : "bg-purple-600 shadow-purple-200 hover:bg-purple-700"}`}
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Database size={20} />}
                    {loading ? "Scanning Logs..." : "Pull Records"}
                </motion.button>
            </motion.div>

            {/* DATA TABLE */}
            <motion.div 
                variants={itemVariants}
                className={`rounded-[2.5rem] overflow-hidden border min-h-[500px] flex flex-col transition-all duration-500
                    ${isDark 
                        ? "bg-slate-900 border-slate-800 shadow-2xl shadow-black/60" 
                        : "bg-white border-gray-100 shadow-[0_35px_70px_rgba(0,0,0,0.05)]"}`}
            >
                <div className="overflow-x-auto flex-1">
                    <AnimatePresence mode='wait'>
                        {data.length > 0 ? (
                            <motion.table 
                                key="table"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full text-left"
                            >
                                <thead>
                                    <tr className={isDark ? "bg-slate-800/50" : "bg-gray-50/50"}>
                                        {headers.map((h) => (
                                            <th key={h} className={`px-8 py-6 text-[10px] font-bold uppercase tracking-widest border-b
                                                ${isDark ? "text-slate-400 border-slate-800" : "text-gray-400 border-gray-100"}`}>
                                                {h.replace(/_/g, ' ')}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-50"}`}>
                                    {paginatedData.map((row, i) => (
                                        <motion.tr 
                                            key={i} 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.02 }}
                                            className={`transition-colors group
                                                ${isDark 
                                                    ? "even:bg-slate-900/30 odd:bg-slate-900/10 hover:bg-purple-900/20" 
                                                    : "even:bg-gray-50/30 odd:bg-white hover:bg-purple-50/60"}`}
                                        >
                                            {headers.map((h) => (
                                                <td key={h} className={`px-8 py-5 text-sm font-medium whitespace-nowrap
                                                    ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                                                    {row[h]}
                                                </td>
                                            ))}
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </motion.table>
                        ) : (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-[500px] flex flex-col items-center justify-center gap-5"
                            >
                                <div className={`p-8 rounded-full ${isDark ? "bg-purple-900/20 text-purple-400" : "bg-purple-50 text-purple-200"}`}>
                                    <ShieldAlert size={48} strokeWidth={1.5} />
                                </div>
                                <div className="text-center">
                                    <p className={`font-black text-lg uppercase tracking-tight ${isDark ? "text-slate-200" : "text-gray-800"}`}>SYSTEM READY</p>
                                    <p className={`text-sm ${isDark ? "text-slate-500" : "text-gray-400"}`}>Select a date range and click "Pull Records" to query Elasticsearch.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* PAGINATION */}
                {data.length > 0 && (
                    <div className={`p-8 border-t flex items-center justify-between backdrop-blur-sm
                        ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-gray-50"}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                            Page {currentPage} / {totalPages}
                        </span>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all disabled:opacity-30
                                    ${isDark 
                                        ? "border-slate-800 text-slate-400 hover:bg-slate-800" 
                                        : "border-gray-100 text-gray-500 hover:bg-gray-50"}`}
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all disabled:opacity-30
                                    ${isDark 
                                        ? "border-slate-800 text-slate-400 hover:bg-slate-800" 
                                        : "border-gray-100 text-gray-500 hover:bg-gray-50"}`}
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
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
import { motion, AnimatePresence } from 'framer-motion';
import PhishingTable from '@/components/table/PhishingTable';

// Mock imports - ensure these paths match your project structure
import PieChartWithNeedlePhishing from '@/components/real_time_guages/PieChartWithNeedlePhishing';

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
                    if (results.data.length > 0) {
                        const rawData = results.data as any[];
                        const sortedData = rawData.sort((a, b) => {
                            return new Date(b['@timestamp']).getTime() - new Date(a['@timestamp']).getTime();
                        });
                        setHeaders(Object.keys(sortedData[0] as Record<string, any>));
                        setData(sortedData);
                    }
                    setCurrentPage(1);
                },
            });
        } catch (error) {
            console.error("Error fetching phishing data:", error);
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

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className={`flex flex-col gap-8 w-full max-w-[1600px] mx-auto p-6 md:p-10 transition-colors duration-700 min-h-screen
                ${isDark ? "bg-slate-950" : "bg-gray-50"}`}
        >
            {/* HEADER */}
            <motion.div variants={itemVariants} className="w-full text-center">
                <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight transition-colors
                    ${isDark ? "text-blue-500" : "text-blue-600"}`}>
                    AI-Enabled Zero-day Phishing (AZP)
                </h2>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "12rem" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className={`h-1.5 mx-auto mt-4 rounded-full ${isDark ? "bg-emerald-500 shadow-emerald-500/40" : "bg-blue-600 shadow-blue-600/20"}`}
                />
            </motion.div>

            {/* GAUGE SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div variants={itemVariants} className="w-full flex justify-center">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className={`w-full max-w-xl backdrop-blur-md transition-all duration-500 rounded-[2.5rem] p-8 md:p-12 border 
                            ${isDark 
                                ? "bg-slate-900/50 border-slate-800 shadow-2xl shadow-black" 
                                : "bg-white border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]"}`}
                    >
                        <div className="flex flex-col items-center gap-6">
                            <h3 className={`text-xs md:text-sm font-black text-center uppercase tracking-[0.4em] 
                                ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                                Real-time Gauges
                            </h3>

                            <div className="w-full group">
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                                        className="w-full max-w-[300px] md:max-w-[350px] flex items-center justify-center"
                                    >
                                        <PieChartWithNeedlePhishing
                                            label={'Phishing'}
                                            currentValue={59}
                                            isDark={isDark}
                                        />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* ACTIVE PHISHINGS TABLE */}
                <motion.div variants={itemVariants} className="w-full">
                    <h3 className={`text-xl font-bold text-center uppercase tracking-widest mb-4 transition-colors
                        ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                        Active Phishings
                    </h3>
                    <div className={`rounded-[2.5rem] border overflow-hidden ${isDark ? "border-slate-800" : "border-transparent"}`}>
                        <PhishingTable isDark={isDark} />
                    </div>
                </motion.div>
            </div>

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
                        <Clock size={12} /> Specific Time Range
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="datetime-local"
                            step="1"
                            value={startDate}
                            className={`border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none
                                ${isDark ? "bg-slate-800 text-slate-200" : "bg-gray-50 text-slate-800"}`}
                            onChange={(e) => handleDateChange('start', e.target.value)}
                        />
                        <span className="text-gray-400 font-medium">to</span>
                        <input
                            type="datetime-local"
                            step="1"
                            value={endDate}
                            className={`border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none
                                ${isDark ? "bg-slate-800 text-slate-200" : "bg-gray-50 text-slate-800"}`}
                            onChange={(e) => handleDateChange('end', e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className={`text-[10px] font-bold uppercase ml-2 flex items-center gap-2
                        ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                        <Filter size={12} /> Presets
                    </label>
                    <div className={`p-1.5 rounded-2xl ${isDark ? "bg-slate-800" : "bg-gray-50"}`}>
                        {[1, 5, 15, 30].map((days) => (
                            <motion.button
                                key={days}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleQuickRangeChange(days.toString())}
                                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${quickRange === days.toString()
                                    ? (isDark ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 shadow-md')
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {days}d
                            </motion.button>
                        ))}
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05, color: isDark ? '#60a5fa' : '#2563eb' }}
                    onClick={resetFilters}
                    className={`flex items-center gap-2 text-[10px] font-bold uppercase transition-colors mb-2
                        ${isDark ? "text-slate-500" : "text-gray-400"}`}
                >
                    <RefreshCcw size={12} /> Reset View
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={fetchData}
                    disabled={loading || (!quickRange && !startDate)}
                    className={`ml-auto flex items-center gap-3 px-10 py-4 rounded-[1.5rem] shadow-xl transition-all font-bold text-sm text-white disabled:opacity-50
                        ${isDark 
                            ? "bg-blue-600 shadow-blue-900/40 hover:bg-blue-500" 
                            : "bg-blue-600 shadow-blue-200 hover:bg-blue-700"}`}
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Database size={20} />}
                    {loading ? "Fetching Logs..." : "Pull Records"}
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
                                            transition={{ delay: i * 0.03 }}
                                            className={`transition-colors group
                                                ${isDark 
                                                    ? "even:bg-slate-900/30 odd:bg-slate-900/10 hover:bg-slate-800" 
                                                    : "even:bg-gray-50/30 odd:bg-white hover:bg-blue-50/60"}`}
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
                                exit={{ opacity: 0 }}
                                className="h-[500px] flex flex-col items-center justify-center gap-5 text-center"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                    className={`p-8 rounded-full ${isDark ? "bg-slate-800 text-slate-600" : "bg-blue-50/50 text-blue-200"}`}
                                >
                                    <ShieldAlert size={48} strokeWidth={1.5} />
                                </motion.div>
                                <div>
                                    <p className={`font-black text-lg uppercase tracking-tight ${isDark ? "text-slate-200" : "text-gray-800"}`}>System Ready</p>
                                    <p className={`text-sm ${isDark ? "text-slate-500" : "text-gray-400"}`}>Select a date range and click "Pull Records" to query Elasticsearch.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* PAGINATION */}
                {data.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-8 border-t flex items-center justify-between backdrop-blur-sm
                            ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-gray-50"}`}
                    >
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                            Page {currentPage} / {totalPages}
                        </span>
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ x: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all disabled:opacity-30
                                    ${isDark 
                                        ? "border-slate-800 text-slate-400 hover:bg-slate-800" 
                                        : "border-gray-100 text-gray-500 hover:bg-gray-50"}`}
                            >
                                <ChevronLeft size={16} /> Previous
                            </motion.button>
                            <motion.button
                                whileHover={{ x: 2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all disabled:opacity-30
                                    ${isDark 
                                        ? "border-slate-800 text-slate-400 hover:bg-slate-800" 
                                        : "border-gray-100 text-gray-500 hover:bg-gray-50"}`}
                            >
                                Next <ChevronRight size={16} />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
}
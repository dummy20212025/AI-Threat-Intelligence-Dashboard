"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Papa from 'papaparse';
import {
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
import PieChartWithNeedlePhishing from '@/components/real_time_guages/PieChartWithNeedlePhishing';

export default function Page() {
    // Note: Ensure isDark logic is defined via your theme hook if needed
    const isDark = false; 

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
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
            className="flex flex-col gap-8 w-full max-w-[1600px] mx-auto p-6 md:p-10 bg-gray-50 min-h-screen"
        >
            {/* ... [Header, Gauges, Control Panel remain same] ... */}
            
            {/* DATA TABLE WRAPPER */}
            <motion.div
                variants={itemVariants}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_35px_70px_rgba(0,0,0,0.05)] border border-gray-100 min-h-[500px] flex flex-col"
            >
                <div className="overflow-x-auto flex-1">
                    <AnimatePresence mode='wait'>
                        {data.length > 0 ? (
                            <motion.table key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full text-left">
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
                                        <motion.tr key={i} className="transition-colors group even:bg-gray-50/30 odd:bg-white hover:bg-blue-50/60">
                                            {headers.map((h) => (
                                                <td key={h} className="px-8 py-5 text-sm text-gray-600 font-medium whitespace-nowrap">{row[h]}</td>
                                            ))}
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </motion.table>
                        ) : (
                            <div className="h-[500px] flex flex-col items-center justify-center text-gray-400 gap-5">
                                <ShieldAlert size={48} strokeWidth={1.5} />
                                <p className="font-black text-gray-800 text-lg uppercase">System Ready</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* PAGINATION - RESTORED TO YOUR STYLE */}
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
                                className={`flex items-center gap-2 px-6 py-2 rounded-xl border text-xs font-bold transition-all disabled:opacity-30
                                    ${isDark 
                                        ? "border-slate-800 text-slate-400 hover:bg-slate-800" 
                                        : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                            >
                                <ChevronLeft size={16} /> Previous
                            </motion.button>
                            <motion.button
                                whileHover={{ x: 2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className={`flex items-center gap-2 px-6 py-2 rounded-xl border text-xs font-bold transition-all disabled:opacity-30
                                    ${isDark 
                                        ? "border-slate-800 text-slate-400 hover:bg-slate-800" 
                                        : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
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
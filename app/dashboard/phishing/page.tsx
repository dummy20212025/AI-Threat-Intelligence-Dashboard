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
import { motion, AnimatePresence } from 'framer-motion';
import PhishingTable from '@/components/table/PhishingTable';

// Mock imports - ensure these paths match your project structure
import PieChartWithNeedlePhishing from '@/components/real_time_guages/PieChartWithNeedlePhishing';

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
            className="flex flex-col gap-8 w-full max-w-[1600px] mx-auto p-6 md:p-10 bg-gray-50 min-h-screen"
        >
            {/* HEADER */}
            <motion.div variants={itemVariants} className="w-full text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-blue-500 tracking-tight leading-tight">
                    AI-Enabled Zero-day Phishing (AZP)
                </h2>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "12rem" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-1.5 bg-blue-600 mx-auto mt-4 rounded-full"
                />
            </motion.div>

            {/* GAUGE SECTION */}
            <motion.div variants={itemVariants} className="w-full flex justify-center p-4">
                <motion.div
                    whileHover={{ y: -5 }}
                    className="w-full max-w-xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 md:p-12 border border-white"
                >
                    <div className="flex flex-col items-center gap-6">
                        <h3 className="text-xs md:text-sm font-black text-gray-400 text-center uppercase tracking-[0.4em]">
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
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ACTIVE PHISHINGS TABLE */}
                <div className="w-full">
                    <h3 className="text-xl font-bold text-gray-500  text-center uppercase tracking-widest mb-4 ml-2">
                        Active Phishings
                    </h3>

                    <PhishingTable />

                </div>


            </motion.div>



            {/* CONTROL PANEL */}
            <motion.div
                variants={itemVariants}
                className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-wrap items-end gap-8"
            >
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 flex items-center gap-2">
                        <Clock size={12} /> Specific Time Range
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="datetime-local"
                            step="1"
                            value={startDate}
                            className="bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                            onChange={(e) => handleDateChange('start', e.target.value)}
                        />
                        <span className="text-gray-300 font-medium">to</span>
                        <input
                            type="datetime-local"
                            step="1"
                            value={endDate}
                            className="bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                            onChange={(e) => handleDateChange('end', e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 flex items-center gap-2">
                        <Filter size={12} /> Presets
                    </label>
                    <div className="flex bg-gray-50 p-1.5 rounded-2xl">
                        {[1, 5, 15, 30].map((days) => (
                            <motion.button
                                key={days}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleQuickRangeChange(days.toString())}
                                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${quickRange === days.toString()
                                    ? 'bg-white text-blue-600 shadow-md scale-105'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {days}d
                            </motion.button>
                        ))}
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05, color: '#2563eb' }}
                    onClick={resetFilters}
                    className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase transition-colors mb-2"
                >
                    <RefreshCcw size={12} /> Reset View
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={fetchData}
                    disabled={loading || (!quickRange && !startDate)}
                    className="ml-auto flex items-center gap-3 bg-blue-600 px-10 py-4 rounded-[1.5rem] shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all font-bold text-sm text-white disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Database size={20} />}
                    {loading ? "Fetching Logs..." : "Pull Records"}
                </motion.button>
            </motion.div>

            {/* DATA TABLE */}
            <motion.div
                variants={itemVariants}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_35px_70px_rgba(0,0,0,0.05)] border border-gray-100 min-h-[500px] flex flex-col"
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
                                        <motion.tr
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="transition-colors group even:bg-gray-50/30 odd:bg-white hover:bg-blue-50/60"
                                        >
                                            {headers.map((h) => (
                                                <td key={h} className="px-8 py-5 text-sm text-gray-600 font-medium whitespace-nowrap">
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
                                className="h-[500px] flex flex-col items-center justify-center text-gray-400 gap-5"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                    className="p-8 bg-blue-50/50 rounded-full text-blue-200"
                                >
                                    <ShieldAlert size={48} strokeWidth={1.5} />
                                </motion.div>
                                <div className="text-center">
                                    <p className="font-black text-gray-800 text-lg uppercase tracking-tight">System Ready</p>
                                    <p className="text-sm">Select a date range and click "Pull Records" to query Elasticsearch.</p>
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
                        className="p-8 border-t border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-sm"
                    >
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Page {currentPage} / {totalPages}
                        </span>
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ x: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-all"
                            >
                                <ChevronLeft size={16} /> Previous
                            </motion.button>
                            <motion.button
                                whileHover={{ x: 2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-all"
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
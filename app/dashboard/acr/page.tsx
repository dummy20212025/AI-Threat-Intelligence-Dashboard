"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Cpu, Globe, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";
import { useEffect, useState } from "react";

// Placeholder components - replace with your actual chart imports
import PieChartWithNeedle from "@/components/charts/PieChartWithNeedle";
import PieWithGradientTOR from "@/components/ipCountCharts/PieWithGradientTOR";
import PieWithGradientTunneling from "@/components/ipCountCharts/PieWithGradientTunneling";

// Client-side animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1, 
        transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function CyberRadarPage() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const isDark = theme === "dark";

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <div className={`relative min-h-screen w-full transition-colors duration-700 overflow-hidden
            ${isDark ? "bg-[#020617] text-slate-200" : "bg-slate-50 text-slate-900"}`}>
            
            {/* --- UNIFIED PERIMETER LINE --- */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <rect x="2%" y="2%" width="96%" height="96%" rx="40" 
                    stroke={isDark ? "rgba(30,41,59,0.5)" : "rgba(226,232,240,0.8)"} 
                    strokeWidth="1" fill="none" />
                <motion.rect
                    x="2%" y="2%" width="96%" height="96%" rx="40"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="100 1000"
                    animate={{ strokeDashoffset: [1100, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
            </svg>

            {/* --- MAIN CONTENT WRAPPER --- */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="relative z-10 flex flex-col gap-10 p-8 md:p-12 max-w-[1700px] mx-auto"
            >
                {/* --- HEADER --- */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-center gap-6 border-b pb-10 border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-2xl border ${isDark ? "bg-blue-600/10 border-blue-500/30" : "bg-blue-50 border-blue-200"}`}>
                            <Cpu className="text-blue-600" size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase">
                                Cyber Radar <span className="text-blue-600">(ACR)</span>
                            </h2>
                            <p className="text-blue-500 font-mono text-[10px] tracking-[0.5em] uppercase font-bold mt-1">
                                Artificial Intelligence Threat Feed
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className={`px-6 py-3 rounded-xl border flex items-center gap-3 font-mono text-[10px] 
                            ${isDark ? "bg-slate-900/50 border-slate-800 text-slate-400" : "bg-white border-slate-200 shadow-sm text-slate-500"}`}>
                            <Globe size={14} className="text-blue-500 animate-pulse" />
                            NETWORK_SCAN: ACTIVE
                        </div>
                    </div>
                </motion.div>

                {/* --- REAL-TIME GAUGES SECTION --- */}
                <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-4 mb-8">
                        <ShieldCheck className="text-blue-600" size={20} />
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Real-Time Threat Velocity</h3>
                    </div>

                    <div className={`rounded-[3rem] border p-1 md:p-2 transition-all shadow-2xl
                        ${isDark ? "bg-slate-950/50 border-slate-800 shadow-blue-900/10" : "bg-white/80 border-slate-100 shadow-slate-200/50 backdrop-blur-md"}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
                            
                            {/* TOR GAUGE */}
                            <div className="p-12 flex flex-col items-center group">
                                <span className="text-[10px] font-mono text-blue-500 font-bold tracking-widest mb-2">TRAFFIC_FEED::01</span>
                                <h4 className="text-xl font-black italic uppercase mb-8 group-hover:text-blue-500 transition-colors">TOR Traffic</h4>
                                <div className="w-full max-w-[320px] aspect-square flex items-center justify-center">
                                    <PieChartWithNeedle label={'TOR'} currentValue={7500} />
                                </div>
                            </div>

                            {/* TUNNELING GAUGE */}
                            <div className="p-12 flex flex-col items-center group">
                                <span className="text-[10px] font-mono text-indigo-500 font-bold tracking-widest mb-2">TRAFFIC_FEED::02</span>
                                <h4 className="text-xl font-black italic uppercase mb-8 group-hover:text-indigo-500 transition-colors">Tunneling</h4>
                                <div className="w-full max-w-[320px] aspect-square flex items-center justify-center">
                                    <PieChartWithNeedle label={'Tunneling'} currentValue={10432} />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- IP DISTRIBUTION SECTION --- */}
                <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-4 mb-8">
                        <Zap className="text-blue-600" size={20} />
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Top Attackers Distribution</h3>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        
                        {/* TOR Distribution */}
                        <div className={`p-10 rounded-[2.5rem] border-2 transition-all duration-500 group relative
                            ${isDark ? "bg-slate-950/40 border-slate-800 hover:border-blue-500/50" : "bg-white border-slate-100 hover:border-blue-500 shadow-xl"}`}>
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h3 className="text-2xl font-black italic uppercase group-hover:text-blue-500 transition-colors">TOR Intel</h3>
                                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-tighter">Top Destination IP Records</p>
                                </div>
                                <ArrowUpRight className="text-slate-300 group-hover:text-blue-500 transition-all" />
                            </div>
                            <div className="h-[350px] w-full flex justify-center items-center">
                                <PieWithGradientTOR />
                            </div>
                        </div>

                        {/* Tunneling Distribution */}
                        <div className={`p-10 rounded-[2.5rem] border-2 transition-all duration-500 group relative
                            ${isDark ? "bg-slate-950/40 border-slate-800 hover:border-indigo-500/50" : "bg-white border-slate-100 hover:border-indigo-500 shadow-xl"}`}>
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h3 className="text-2xl font-black italic uppercase group-hover:text-indigo-500 transition-colors">Tunneling Intel</h3>
                                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-tighter">Top Destination IP Records</p>
                                </div>
                                <ArrowUpRight className="text-slate-300 group-hover:text-indigo-500 transition-all" />
                            </div>
                            <div className="h-[350px] w-full flex justify-center items-center">
                                <PieWithGradientTunneling />
                            </div>
                        </div>

                    </div>
                </motion.div>

                {/* --- FOOTER --- */}
                <motion.footer variants={itemVariants} className={`mt-10 pt-8 border-t flex justify-between items-center text-[10px] font-mono tracking-[0.4em] uppercase
                    ${isDark ? "border-slate-800 text-slate-600" : "border-slate-200 text-slate-400"}`}>
                    <p>RADAR_UNIT::#ACR-449</p>
                    <p>© 2026 C-DOT Defense Intelligence</p>
                </motion.footer>
            </motion.div>
        </div>
    );
}
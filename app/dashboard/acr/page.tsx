"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import PieChartWithNeedle from "@/components/charts/PieChartWithNeedle";
import PieWithGradient from "@/components/charts/PieChartWithGradient";
import PieWithGradientPortScan from "@/components/ipCountCharts/PieWithGradientPortscan";

// Framer Motion Wrappers
import { MDiv, MH3, containerVariants, itemVariants } from "@/components/framer/MotionWrappers";

export default function ACR() {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Ensure component is mounted to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Check if dark mode is active (handles 'system' setting too)
    const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

    if (!mounted) return null;

    return (
        <div className={`flex min-h-screen w-full transition-colors duration-700 
            ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-slate-900"}`}>

            <MDiv
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex-1 flex flex-col gap-12 w-full max-w-[1600px] mx-auto p-6 md:p-10"
            >
                {/* HEADER */}
                <MDiv variants={itemVariants} className="w-full text-center">
                    <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight transition-colors
                        ${isDark ? "text-blue-500" : "text-blue-600"}`}>
                        AI-Powered Cyber Radar (ACR)
                    </h2>
                    <MDiv
                        initial={{ width: 0 }}
                        animate={{ width: "12rem" }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className={`h-1.5 mx-auto mt-4 rounded-full shadow-lg 
                            ${isDark ? "bg-blue-500 shadow-blue-500/40" : "bg-blue-600 shadow-blue-600/20"}`}
                    />
                </MDiv>

                {/* REAL-TIME GAUGES */}
                <MDiv variants={itemVariants} className="w-full">
                    <MH3 className={`text-xl font-bold text-center uppercase tracking-widest mb-6 transition-colors
                        ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                        Real-time Gauges
                    </MH3>

                    <div className="w-full flex justify-center py-10 px-4">
                        <div className={`w-full max-w-5xl backdrop-blur-md rounded-[3rem] overflow-hidden border transition-all duration-500
                            ${isDark 
                                ? "bg-slate-900/50 border-slate-800 shadow-2xl shadow-black" 
                                : "bg-white/70 border-white/20 shadow-xl shadow-gray-200"}`}>
                            
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                            
                            <div className={`grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x transition-colors
                                ${isDark ? "divide-slate-800" : "divide-gray-100"}`}>

                                {/* Anomaly Gauge */}
                                <MDiv
                                    whileHover={{ y: -5 }}
                                    className={`p-10 md:p-14 group transition-all duration-500 
                                        ${isDark ? "hover:bg-blue-900/10" : "hover:bg-blue-50/50"}`}
                                >
                                    <div className="flex flex-col items-center justify-center space-y-8">
                                        <h4 className={`text-xl font-bold tracking-wide transition-colors group-hover:text-blue-500
                                            ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                                            Anomaly
                                        </h4>
                                        <div className="w-full max-w-[260px] aspect-[4/3] flex items-center justify-center">
                                            {/* Pass isDark to chart component */}
                                            <PieChartWithNeedle label={'Anomaly'} currentValue={12500} isDark={isDark} />
                                        </div>
                                    </div>
                                </MDiv>

                                {/* PortScan Gauge */}
                                <MDiv
                                    whileHover={{ y: -5 }}
                                    className={`p-10 md:p-14 group transition-all duration-500 
                                        ${isDark ? "hover:bg-indigo-900/10" : "hover:bg-indigo-50/50"}`}
                                >
                                    <div className="flex flex-col items-center justify-center space-y-8">
                                        <h4 className={`text-xl font-bold tracking-wide transition-colors group-hover:text-indigo-500
                                            ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                                            PortScan
                                        </h4>
                                        <div className="w-full max-w-[260px] aspect-[4/3] flex items-center justify-center">
                                            <PieChartWithNeedle label={'PORT SCAN'} currentValue={18550} isDark={isDark} />
                                        </div>
                                    </div>
                                </MDiv>

                            </div>
                        </div>
                    </div>
                </MDiv>

                {/* VOLUME DISTRIBUTION */}
                <MDiv variants={itemVariants} className="w-full">
                    <MH3 className={`text-xl font-bold text-center uppercase tracking-widest mb-8 transition-colors
                        ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                        Top Attackers IP Distribution
                    </MH3>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                        {/* Anomaly Chart Card */}
                        <MDiv
                            whileHover={{ y: -8 }}
                            className={`p-6 md:p-10 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden
                                ${isDark 
                                    ? "bg-slate-900 border-slate-800 shadow-2xl" 
                                    : "bg-white border-transparent shadow-lg"}`}
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="mb-10 relative z-10">
                                <h3 className={`text-xl font-bold transition-colors group-hover:text-blue-500 ${isDark ? "text-slate-100" : "text-slate-800"}`}>Anomaly</h3>
                                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Top Destination IP Records</p>
                            </div>
                            <div className="flex justify-center items-center h-[300px]">
                                <PieWithGradient/>
                            </div>
                        </MDiv>

                        {/* Port Scan Chart Card */}
                        <MDiv
                            whileHover={{ y: -8 }}
                            className={`p-6 md:p-10 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden
                                ${isDark 
                                    ? "bg-slate-900 border-slate-800 shadow-2xl" 
                                    : "bg-white border-transparent shadow-lg"}`}
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="mb-10 relative z-10">
                                <h3 className={`text-xl font-bold transition-colors group-hover:text-indigo-500 ${isDark ? "text-slate-100" : "text-slate-800"}`}>Port Scan</h3>
                                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Top Destination IP Records</p>
                            </div>
                            <div className="flex justify-center items-center h-[300px]">
                                <PieWithGradientPortScan />
                            </div>
                        </MDiv>
                    </div>
                </MDiv>
            </MDiv>
        </div>
    );
}
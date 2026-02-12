"use client";

import { Activity, ShieldAlert, Zap, Search, ArrowUpRight, Shield, Lock, Cpu, Terminal as TerminalIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

// --- LIVE LOG COMPONENT ---
const TelemetryTerminal = ({ activeModule, isDark }: { activeModule: string | null, isDark: boolean }) => {
  const [logs, setLogs] = useState<string[]>(["BOOT_SEQ_COMPLETE", "ISO_27001_COMPLIANT", "READY"]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
      let newLog = `[${timestamp}] SCANNING_PORT_${Math.floor(Math.random()*65535)}`;
      if (activeModule) newLog = `[${timestamp}] [${activeModule}] INTERCEPT_ACTIVE`;
      setLogs(prev => [...prev.slice(-12), newLog]);
    }, 1500);
    return () => clearInterval(interval);
  }, [activeModule]);

  return (
    <div className={`hidden xl:flex flex-col w-72 border-l p-6 font-mono text-[10px] backdrop-blur-md transition-colors duration-500
      ${isDark ? "bg-slate-950/80 border-blue-900/30 text-slate-500" : "bg-slate-50/80 border-slate-200 text-slate-400"}`}>
      <div className={`flex items-center gap-2 mb-4 border-b pb-2 ${isDark ? "text-blue-500 border-blue-900/50" : "text-blue-600 border-slate-200"}`}>
        <TerminalIcon size={14} />
        <span className="font-bold tracking-widest uppercase">Telemetry</span>
      </div>
      <div className="flex-1 overflow-hidden space-y-2">
        {logs.map((log, i) => (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={i} className={log.includes('ACTIVE') ? 'text-blue-500 font-bold' : ''}>
            {log}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function PerimeterDashboard() {
  const { theme } = useTheme();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";
  const categories = [
    { title: "Cyber Radar", id: "ACR-01", icon: <Activity />, desc: "An exclusive cyber threat intelligence service that delivers real-time, curated, and actionable cyber threat insights that can be used in network security solutions.", color: "#3b82f6" },
    { title: "Tunnel Hunter", id: "ATH-02", icon: <Zap />, desc: "Stealth detection.", color: "#f59e0b" },
    { title: "Phishing Shield", id: "AZP-03", icon: <ShieldAlert />, desc: "Visual AI protection.", color: "#10b981" },
    { title: "Recon Shield", id: "ARS-04", icon: <Search />, desc: "Anomaly exposure.", color: "#a855f7" },
  ];

  const pulseColor = activeIdx === null ? "#3b82f6" : categories[activeIdx].color;

  return (
    <div className={`relative h-full w-full flex overflow-hidden transition-colors duration-700
      ${isDark ? "bg-[#020617] text-slate-200" : "bg-white text-slate-900"}`}>
      
      {/* --- CIRCUIT PERIMETER (Lines around the cards) --- */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <filter id="neon">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        
        {/* Main Orbiting Path around the 4-card area */}
        <rect x="5%" y="45%" width="90%" height="45%" rx="40" stroke={isDark ? "#1e293b" : "#e2e8f0"} strokeWidth="1" fill="none" />
        
        {/* Animated Perimeter Pulse */}
        <motion.rect
          x="5%" y="45%" width="90%" height="45%" rx="40"
          stroke={pulseColor}
          strokeWidth="3"
          fill="none"
          strokeDasharray="100 1000"
          filter="url(#neon)"
          animate={{ strokeDashoffset: [1100, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* --- GHOST BACKGROUND ASSETS --- */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
        <motion.div animate={{ rotate: [0, 5, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute -top-20 -left-20">
          <Shield size={600} strokeWidth={0.5} className={isDark ? "text-blue-500" : "text-blue-300"} />
        </motion.div>
        <motion.div animate={{ rotate: [0, -5, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute -bottom-20 right-20">
          <Lock size={500} strokeWidth={0.5} className={isDark ? "text-blue-400" : "text-blue-300"} />
        </motion.div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="relative flex-1 flex flex-col p-12 z-10">
        
        <header className="mb-16 flex items-center gap-6">
          <div className={`p-4 rounded-2xl border transition-colors ${isDark ? "bg-blue-600/10 border-blue-500/20" : "bg-blue-50 border-blue-100"}`}>
            <Cpu className="text-blue-600" size={40} />
          </div>
          <div>
            <h1 className={`text-7xl font-black italic tracking-tighter ${isDark ? "text-white" : "text-slate-900"}`}>GARUDA</h1>
            <p className="text-blue-600 font-mono text-[10px] tracking-[0.6em] uppercase font-bold">Secure Defense Infrastructure</p>
          </div>
        </header>

        {/* --- GRID OF CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center flex-1">
          {categories.map((item, idx) => (
            <motion.div
              key={item.id}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(null)}
              className={`group relative p-8 h-72 rounded-3xl border-2 transition-all duration-500 flex flex-col justify-between overflow-hidden
                ${isDark 
                  ? (activeIdx === idx ? 'bg-slate-900 border-blue-500 -translate-y-4' : 'bg-slate-950/40 border-slate-800') 
                  : (activeIdx === idx ? 'bg-white border-blue-500 -translate-y-4 shadow-2xl shadow-blue-100' : 'bg-slate-50 border-slate-200')}`}
            >
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors
                  ${isDark ? "bg-slate-800" : "bg-white border border-slate-200"}`}
                  style={{ color: activeIdx === idx ? item.color : '#94a3b8' }}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{item.id}</span>
                <h3 className={`text-xl font-black italic uppercase mt-1 ${isDark ? "text-white" : "text-slate-800"}`}>{item.title}</h3>
                <p className={`text-xs mt-2 font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}>{item.desc}</p>
              </div>
              <ArrowUpRight className={`self-end transition-colors ${activeIdx === idx ? 'text-blue-500' : 'text-slate-300'}`} />
            </motion.div>
          ))}
        </div>

        <footer className={`mt-auto pt-8 border-t flex justify-between text-[10px] font-mono tracking-widest uppercase
          ${isDark ? "border-slate-900 text-slate-700" : "border-slate-100 text-slate-400"}`}>
          <div className="flex gap-10">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full bg-blue-500 ${activeIdx !== null ? 'animate-ping' : ''}`} />
              System_Live
            </span>
            <span>Encryption: AES-256</span>
          </div>
          <p>© 2026 C-DOT Intelligence</p>
        </footer>
      </div>

      {/* --- TELEMETRY --- */}
      <TelemetryTerminal activeModule={activeIdx !== null ? categories[activeIdx].id : null} isDark={isDark} />
    </div>
  );
}
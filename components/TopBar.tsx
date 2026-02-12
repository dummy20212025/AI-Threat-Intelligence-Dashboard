"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Shield, Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function TopBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-24" />;

  const isDark = theme === "dark";

  return (
    <header
      className={`h-24 flex items-center justify-between px-10 border-b-2 transition-all duration-700 backdrop-blur-2xl sticky top-0 z-50
      ${isDark
          ? "bg-slate-950/95 border-blue-900/30 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-white/95 border-gray-200 shadow-sm"}`}
    >
      {/* Brand Section */}
      <div className="flex items-center gap-6 w-[450px] shrink-0">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative group"
        >
          {/* Decorative Ring */}
          <div className={`absolute -inset-1 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200
            ${isDark ? "bg-blue-500" : "bg-slate-400"}`}></div>

          <div className={`relative h-16 w-16 p-1 rounded-xl border-2 overflow-hidden
            ${isDark ? "border-blue-500/50 bg-slate-900" : "border-slate-300 bg-white"}`}
          >
            <Image
              src="/logo2.jpg"
              alt="GARUDA Logo"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
            {/* Scanning Line Animation */}
            <motion.div
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] bg-blue-400/50 shadow-cyan-500 shadow-sm z-10"
            />
          </div>
        </motion.div>

        <div className="flex flex-col">
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`text-4xl font-black tracking-tight leading-none italic ${isDark ? "text-white" : "text-slate-900"}`}
          >
            GARUDA
          </motion.span>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-[2px] w-4 bg-blue-600"></span>
            <span className="text-[11px] uppercase tracking-[0.3em] font-extrabold text-blue-500">
              Defense Intelligence
            </span>
          </div>
        </div>
      </div>

      {/* Main Large Title */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`text-3xl font-extrabold tracking-tighter uppercase transition-colors
            ${isDark ? "text-slate-100" : "text-slate-800"}`}
        >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">Guardian With AI - driven Real - time</span>
        </motion.h1>

        <div className="flex items-center gap-4 mt-2">
          <div className={`h-[1px] w-24 ${isDark ? "bg-slate-700" : "bg-slate-300"}`} />
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`text-xs font-mono tracking-[0.5em] font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}
          >
            ULTRA DATA ANALYTICS
          </motion.span>
          <div className={`h-[1px] w-24 ${isDark ? "bg-slate-700" : "bg-slate-300"}`} />
        </div>

      </div>

      {/* Actions Section */}
      <div className="flex items-center justify-end w-[450px] gap-6">
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={`
            relative p-3 rounded-xl border-2 transition-all duration-300 overflow-hidden group
            ${isDark
              ? "bg-slate-900 border-slate-700 text-yellow-400 hover:border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
              : "bg-gray-50 border-gray-200 text-slate-600 hover:border-slate-400"}
          `}
        >
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div key="sun" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                  <Sun size={24} strokeWidth={2.5} />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                  <Moon size={24} strokeWidth={2.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </button>
      </div>
    </header>
  );
}
"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function TopBar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  
  // Use resolvedTheme to handle system preference correctly
  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  if (!mounted) return <div className="h-24" />;

  return (
    <header
      className={`h-24 flex items-center justify-between px-10 border-b-2 transition-all duration-700 backdrop-blur-2xl sticky top-0 z-50
      ${isDark
          ? "bg-slate-950 border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-white border-gray-100 shadow-sm"}`}
    >
      {/* Brand Section */}
      <div className="flex items-center gap-6 w-[350px] shrink-0">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative group"
        >
          <div className={`absolute -inset-1 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000
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
            className={`text-3xl font-black tracking-tight leading-none ${isDark ? "text-white" : "text-slate-900"}`}
          >
            C-DOT GARUDA
          </motion.span>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-[2px] w-4 bg-blue-600"></span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-blue-500">
              Defense Intelligence
            </span>
          </div>
        </div>
      </div>

      {/* Main Single-Line Title */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 overflow-hidden">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-lg md:text-xl lg:text-2xl font-black tracking-tighter uppercase whitespace-nowrap transition-all
            ${isDark ? "text-slate-100" : "text-slate-800"}`}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600">
            Guardian With AI - driven Real - time ULTRA DATA ANALYTICS
          </span>
        </motion.h1>

        <div className="flex items-center gap-4 mt-1">
          <div className={`h-[1px] w-12 ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`text-[9px] font-mono tracking-[0.4em] font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}
          >
            LIVE OPERATIONS DASHBOARD
          </motion.span>
          <div className={`h-[1px] w-12 ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex items-center justify-end w-[350px] gap-6">
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={`
            relative p-3 rounded-xl border-2 transition-all duration-300 group
            ${isDark
              ? "bg-slate-900 border-slate-700 text-yellow-400 hover:border-blue-500"
              : "bg-gray-50 border-gray-200 text-slate-600 hover:border-slate-400"}
          `}
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <Sun size={20} strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <Moon size={20} strokeWidth={2.5} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </header>
  );
}
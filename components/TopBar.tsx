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
      <div className="flex items-center gap-6 w-[450px] shrink-0 ml-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="relative"
        >
          {/* Soft ambient glow behind the logo (No Box) */}
          <div className={`absolute inset-0 blur-3xl opacity-30 rounded-full
      ${isDark ? "bg-blue-500" : "bg-blue-200"}`}
          />

          <div className="relative h-24 w-24 flex items-center justify-center">
            <Image
              src="/cdot_logo.png"
              alt="GARUDA Logo"
              width={110}  // Increased size
              height={110} // Increased size
              className={`object-contain w-full h-full transition-all duration-500
          ${isDark ? "brightness-110" : "mix-blend-multiply"}`} // mix-blend helps white backgrounds disappear in light mode
              priority
            />

            {/* Refined "Floating" Scan Line (Edge to Edge of the logo) */}
            <motion.div
              animate={{
                top: ["10%", "90%", "10%"],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-10 shadow-[0_0_8px_cyan]"
            />
          </div>
        </motion.div>

        <div className="flex flex-col">
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`text-4xl font-black tracking-tighter leading-none ${isDark ? "text-white" : "text-slate-900"}`}
          >
            GARUDA
          </motion.span>
          <div className="flex items-center gap-2 mt-2">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_5px_blue]"
            />
            <span className={`text-[11px] uppercase tracking-[0.3em] font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
              C-DOT Intelligence
            </span>
          </div>
        </div>
      </div>

      {/* Main Single-Line Title with Fluid Scaling */}
      <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-6">
        <motion.h1
          style={{
            /* Fluid Scaling Formula: clamp(MIN, PREFERRED, MAX)
               The text will scale between 14px and 24px based on 1.5% of the screen width 
            */
            fontSize: "clamp(14px, 1.5vw, 24px)"
          }}
          className={`font-black tracking-tighter uppercase whitespace-nowrap transition-all
      ${isDark ? "text-slate-100" : "text-slate-800"}`}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600">
            Guardian With AI - driven Real - time ULTRASCALE DATA ANALYTICS
          </span>
        </motion.h1>

        <div className="flex items-center gap-3 mt-1">
          <div className={`h-[1px] w-12 ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
          <span className={`text-[9px] font-mono tracking-[0.3em] font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
            LIVE OPERATIONS DASHBOARD
          </span>
          <div className={`h-[1px] w-12 ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
        </div>
      </div>

      {/* Actions Section - Minimized to give title priority */}
      <div className="flex items-center justify-end w-[100px] shrink-0 ">
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={`p-2.5 rounded-xl border-2 transition-all duration-300 ${isDark ? "bg-slate-900 border-slate-700 text-yellow-400" : "bg-gray-50 border-gray-200 text-slate-600"
            }`}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
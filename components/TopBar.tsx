"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function TopBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    // <header className="h-16 backdrop-blur-xl bg-[rgb(var(--card))] border-b border-[rgb(var(--border))] flex items-center justify-between px-6 ">
    //   <div className="w-72 shrink-0" /> {/* spacer for sidebar */}

    //   <h1 className="text-[2.2rem] font-semibold text-center flex-1">
    //     Threat Intelligence Dashboard
    //   </h1>

    //   <button
    //     onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    //     className="
    //       rounded-full p-2
    //       bg-[rgb(var(--card))]
    //       border border-[rgb(var(--border))]
    //       hover:scale-105 transition
    //     "
    //   >
    //     {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    //   </button>
    // </header>
    <header
      className={`h-16 flex items-center justify-between px-6 border-b transition-colors duration-300 backdrop-blur-xl
      ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}
    >
      {/* Spacer for sidebar */}
      <div className="w-72 shrink-0" />

      <h1 className={`text-[2.2rem] font-semibold text-center flex-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        AI Powered Threat Intelligence Dashboard
      </h1>

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={`
      rounded-full p-2
      border transition-all duration-300 hover:scale-110
      ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-yellow-400' : 'bg-white border-gray-300 text-gray-600'}
    `}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}

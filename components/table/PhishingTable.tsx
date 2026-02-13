"use client";
import React, { useState } from 'react';

interface PhishingTableProps {
  isDark?: boolean;
}

export default function PhishingTable({ isDark }: PhishingTableProps) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const getImage = (domain: string): string | null => {
    const images: Record<string, string> = {
      'dc.crsorgi.gov.in.index.web-index.info': '/dc.crsorgi.gov.in.index.web-index.info.jpg',
      'dcc.crsorgi.gov.in.crsor.in': '/dcc.crsorgi.gov.in.crsor.in.jpg',
      'maharashtra.gov.in.studentemarks.in': '/maharashtra.gov.in.studentemarks.in.jpg',
      'rajasthanstateopenschool.com': '/rajasthanstateopenschool.com.jpg',
      'rsos.rajasthan-gov.net': '/rsos.rajasthan-gov.net.jpg',
    };
    return images[domain] ?? null;
  };

  const domains = [
    'dc.crsorgi.gov.in.index.web-index.info', 
    'dcc.crsorgi.gov.in.crsor.in',
    'maharashtra.gov.in.studentemarks.in',
    'rajasthanstateopenschool.com',
    'rsos.rajasthan-gov.net'
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* --- TABLE CARD --- */}
      <div className={`w-full max-w-2xl p-6 md:p-10 rounded-[2.5rem] transition-all duration-500 border group
        ${isDark 
          ? "bg-slate-900 border-slate-800 shadow-2xl shadow-black/50 hover:shadow-emerald-900/10" 
          : "bg-white border-transparent shadow-[0_35px_70px_rgba(0,0,0,0.08)] hover:shadow-[0_45px_80px_rgba(0,0,0,0.12)] hover:-translate-y-2"}`}>
        
        <div className="overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className={`border-b ${isDark ? "border-slate-800" : "border-gray-100"}`}>
                <th className={`pb-4 text-[13px] font-bold uppercase tracking-[0.2em] 
                  ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                  Target Domain
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-50"}`}>
              {domains.map((domain) => (
                <tr
                  key={domain}
                  onClick={() => setSelectedImg(getImage(domain))}
                  className={`group/row transition-all duration-300 cursor-pointer
                    ${isDark ? "hover:bg-emerald-500/10" : "hover:bg-blue-50/50"}`}
                >
                  <td className={`py-5 font-semibold tracking-tight flex items-center gap-3
                    ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 
                        ${isDark ? "bg-emerald-400" : "bg-red-400"}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 
                        ${isDark ? "bg-emerald-500" : "bg-red-500"}`}></span>
                    </span>
                    {domain}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- POPUP MODAL --- */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-opacity duration-300"
          onClick={() => setSelectedImg(null)}
        >
          <div
            className={`relative max-w-4xl w-full rounded-[2.5rem] overflow-hidden shadow-2xl transform transition-all duration-300 scale-100 opacity-100 border
              ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-transparent"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className={`absolute top-5 right-5 z-10 rounded-full p-2 shadow-sm transition-all active:scale-90
                ${isDark ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-white/80 text-gray-500 hover:bg-red-50 hover:text-red-600"}`}
              onClick={() => setSelectedImg(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Image Container */}
            <div className={`${isDark ? "bg-black" : "bg-gray-100"} flex items-center justify-center min-h-[300px]`}>
              <img
                src={selectedImg}
                alt="Phishing Screenshot"
                className="w-full h-auto max-h-[60vh] object-contain"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src = `https://placehold.co/600x400/${isDark ? '1e293b/cbd5e1' : 'f1f5f9/64748b'}?text=Screenshot+Unavailable`;
                }}
              />
            </div>

            {/* Modal Footer */}
            <div className={`p-8 ${isDark ? "bg-slate-900" : "bg-white"}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wider
                  ${isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-red-100 text-red-600"}`}>
                  Threat Detected
                </span>
              </div>
              <h4 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                Phishing Evidence Screenshot
              </h4>
              <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Forensic capture of zero-day landing page
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
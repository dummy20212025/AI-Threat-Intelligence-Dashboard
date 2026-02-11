"use client";
import React, { useState } from 'react';

export default function PhishingTable({ }) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  // Mapping domains to files located in /public/images/ (or just /public/)
  const getImage = (domain: string): string | null => {
    const images: Record<string, string> = {
      // If your image is at public/phish1.png, use '/phish1.png'
      'dc.crsorgi.gov.in.index.web-index.info': '/dc.crsorgi.gov.in.index.web-index.info.jpg',
      'dcc.crsorgi.gov.in.crsor.in': '/dcc.crsorgi.gov.in.crsor.in.jpg',
      'maharashtra.gov.in.studentemarks.in': '/maharashtra.gov.in.studentemarks.in.jpg',
      'rajasthanstateopenschool.com': '/rajasthanstateopenschool.com.jpg',
      'rsos.rajasthan-gov.net': '/rsos.rajasthan-gov.net.jpg',

    };
    return images[domain] ?? null;
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white p-6 md:p-10 rounded-[2.5rem] transition-all duration-300 shadow-[0_35px_70px_rgba(0,0,0,0.08)] hover:shadow-[0_45px_80px_rgba(0,0,0,0.12)] hover:-translate-y-2 group">
        <div className="overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 text-[15px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  Target Domain
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {['dc.crsorgi.gov.in.index.web-index.info', 'dcc.crsorgi.gov.in.crsor.in','maharashtra.gov.in.studentemarks.in','rajasthanstateopenschool.com','rsos.rajasthan-gov.net'].map((domain) => (
                <tr
                  key={domain}
                  onClick={() => setSelectedImg(getImage(domain))}
                  className="group/row transition-all duration-300 hover:bg-blue-50/50 cursor-pointer"
                >
                  <td className="py-5 text-gray-600 font-semibold tracking-tight flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 transition-opacity duration-300"
          onClick={() => setSelectedImg(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl transform transition-all duration-300 scale-100 opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-5 right-5 z-10 bg-white/80 backdrop-blur-sm hover:bg-red-50 hover:text-red-600 rounded-full p-2 shadow-sm transition-all active:scale-90"
              onClick={() => setSelectedImg(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {/* Image Container */}
            <div className="bg-gray-100 flex items-center justify-center min-h-[300px]">
              <img
                src={selectedImg}
                alt="Phishing Screenshot"
                className="w-full h-auto max-h-[70vh] object-contain"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Found+in+Public+Folder";
                }}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-white">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-red-100 text-red-600 text-center text-xs font-bold uppercase rounded-full tracking-wider">
                  Threat Detected
                </span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900">Phishing Evidence Screenshot</h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
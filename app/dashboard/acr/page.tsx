"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Download, ShieldAlert, Globe, Server } from "lucide-react";
import { MDiv, containerVariants, itemVariants } from "@/components/framer/MotionWrappers";

// Static Data for the tables
const maliciousIPs = [
    { ip: "65.21.94.13", type: "TOR", seen: "14-02-2026", risk: "High" },
    { ip: "103.224.182.242", type: "Phishing", seen: "06-02-2026", risk: "Critical" },
    { ip: "45.84.107.44", type: "TOR", seen: "09-02-2026", risk: "High" },
    { ip: "139.162.119.196", type: "Port Scan", seen: "12-02-2026", risk: "Medium" },
    { ip: "95.217.44.98", type: "Phishing", seen: "04-02-2026", risk: "Critical" },
    { ip: "218.248.112.100", type: "DNS Tunnel", seen: "08-02-2026", risk: "High" },
    { ip: "157.90.176.32", type: "Phishing", seen: "05-02-2026", risk: "Medium" },
];

const maliciousDomains = [
    { domain: "dc.crsorgi.gov.in.web.verfy.in", seen: "15-02-2026", risk: "Critical" },
    { domain: "npci-pay.com", seen: "15-02-2026", risk: "Critical" },
    { domain: "dc.crsorgi.gov.in.crsweb.xyz", seen: "07-02-2026", risk: "High" },
    { domain: "k7w.in", seen: "12-02-2026", risk: "Medium" },
    { domain: "tz.h6.work", seen: "04-02-2026", risk: "High" },
    { domain: "hokkien.my.id", seen: "03-02-2026", risk: "Medium" },
];

export default function ACR() {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

    const handleDownload = (fileName: string) => {
        const link = document.createElement("a");
        link.href = `/${fileName}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!mounted) return null;

    return (
        <div className={`flex min-h-screen w-full transition-colors duration-700 
            ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-slate-900"}`}>

            <MDiv
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex-1 flex flex-col gap-10 w-full max-w-[1600px] mx-auto p-6 md:p-10"
            >
                {/* HEADER & DOWNLOAD BUTTONS */}
                <MDiv variants={itemVariants} className="w-full flex flex-col items-center gap-8">
                    <div className="text-center">
                        <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight transition-colors
                            ${isDark ? "text-blue-500" : "text-blue-600"}`}>
                            AI-Powered Cyber Radar (ACR)
                        </h2>
                        <div className={`h-1 w-24 mx-auto mt-4 rounded-full ${isDark ? "bg-blue-500" : "bg-blue-600"}`} />
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => handleDownload('threat_intel_DB_ips.csv')}
                            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                        >
                            <Download size={20} /> Download Malicious IPs
                        </button>
                        <button
                            onClick={() => handleDownload('threat_intel_DB_domains.csv')}
                            className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
                        >
                            <Download size={20} /> Download Malicious Domains
                        </button>
                    </div>
                </MDiv>

                {/* TABLES SECTION */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    
                    {/* Malicious IPs Table */}
                    <MDiv variants={itemVariants} 
                        className={`p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500
                        ${isDark ? "bg-slate-900 border-slate-800 shadow-2xl" : "bg-white border-gray-100 shadow-xl"}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <Server className="text-blue-500" />
                            <h3 className="text-xl font-bold">Malicious IP Addresses</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className={`text-[10px] uppercase tracking-widest font-bold border-b 
                                    ${isDark ? "text-slate-500 border-slate-800" : "text-gray-400 border-gray-100"}`}>
                                    <tr>
                                        <th className="px-4 py-3">IP Address</th>
                                        <th className="px-4 py-3">Threat Type</th>
                                        <th className="px-4 py-3 text-right">Last Seen</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-50"}`}>
                                    {maliciousIPs.map((item, i) => (
                                        <tr key={i} className="group transition-colors hover:bg-blue-500/5">
                                            <td className="px-4 py-4 font-mono font-medium text-blue-500">{item.ip}</td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold 
                                                    ${isDark ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-gray-600"}`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right text-xs opacity-60">{item.seen}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </MDiv>

                    {/* Malicious Domains Table */}
                    <MDiv variants={itemVariants} 
                        className={`p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500
                        ${isDark ? "bg-slate-900 border-slate-800 shadow-2xl" : "bg-white border-gray-100 shadow-xl"}`}>
                        <div className="flex items-center gap-3 mb-6">
                            <Globe className="text-emerald-500" />
                            <h3 className="text-xl font-bold">Malicious Domain Names</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className={`text-[10px] uppercase tracking-widest font-bold border-b 
                                    ${isDark ? "text-slate-500 border-slate-800" : "text-gray-400 border-gray-100"}`}>
                                    <tr>
                                        <th className="px-4 py-3">Domain Names</th>
                                        <th className="px-4 py-3 text-right">Last Seen</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-gray-50"}`}>
                                    {maliciousDomains.map((item, i) => (
                                        <tr key={i} className="group transition-colors hover:bg-emerald-500/5">
                                            <td className="px-4 py-4 font-medium text-emerald-500 break-all">{item.domain}</td>
                                            <td className="px-4 py-4 text-right text-xs opacity-60">{item.seen}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </MDiv>

                </div>
            </MDiv>
        </div>
    );
}
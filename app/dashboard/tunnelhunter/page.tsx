import { parseCSV } from "@/lib/csvParser";
import { groupByCount } from "@/lib/dataTransform";
import BarChartComp from "@/components/charts/BarChartComp";
import PieChartComp from "@/components/charts/PieChartComp";
import PieChartWithCustomizedLabel from "@/components/charts/PieChartComp";
import ComposedResponsiveContainer from "@/components/charts/ComposedResponsiveContainer";
import PieChartWithNeedle from "@/components/charts/PieChartWithNeedle";
import { Pi, PieChart } from "lucide-react";
import { Pie } from "recharts";
import PieWithGradient from "@/components/charts/PieChartWithGradient";
import { useTheme } from "next-themes";
import PhishingTable from "@/components/table/PhishingTable";
import PieWithGradientTOR from "@/components/ipCountCharts/PieWithGradientTOR";
import PieWithGradientPhishing from "@/components/ipCountCharts/PieWithGradientPhishing";
import PieWithGradientTunneling from "@/components/ipCountCharts/PieWithGradientTunneling";
import PieWithGradientPortScan from "@/components/ipCountCharts/PieWithGradientPortscan";
import PieChartWithNeedlePhishing from "@/components/real_time_guages/PieChartWithNeedlePhishing";


export default async function Dashboard() {
    const phish = await parseCSV("phish_demo.csv");
    const tor = await parseCSV("tor_demo.csv");

    const phishIPs = groupByCount(phish, "DstIP").slice(0, 10);
    const phishDomains = groupByCount(
        phish,
        "domainName_SSlServerName"
    ).slice(0, 8);

    const torPorts = groupByCount(tor, "DstPort");
    const torIPs = groupByCount(tor, "DstIP").slice(0, 10);
    return (

        <div className="flex flex-col gap-12 w-full max-w-[1600px] mx-auto p-6 md:p-10 bg-gray-50">

            <div className="w-full text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-blue-500 tracking-tight leading-tight">
                    AI-Driven Tunnel Hunter (ATH)
                </h2>
            </div>

            {/* REAL-TIME GAUGES */}
            <div className="w-full">
                <h3 className="text-xl font-bold text-gray-500 text-center uppercase tracking-widest mb-6 ml-2">
                    Real-time Gauges
                </h3>

                <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] h-auto rounded-[2.5rem] overflow-hidden border border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2  divide-y sm:divide-y-0 sm:divide-x divide-gray-50">

                        <div className="p-8 md:p-12 group transition-all duration-500 hover:bg-slate-50/50">
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-full max-w-[280px] aspect-[4/3] flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                                    <PieChartWithNeedle label={'TOR'} currentValue={7500} />
                                </div>

                            </div>
                        </div>

                        <div className="p-8 md:p-12 group transition-all duration-500 hover:bg-slate-50/50">
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-full max-w-[280px] aspect-[4/3] flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                                    <PieChartWithNeedle label={'Tunneling'} currentValue={10432} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* VOLUME DISTRIBUTION */}
            <div className="w-full">
                <h3 className="text-xl font-bold text-gray-500 text-center uppercase tracking-widest mb-4 ml-2">
                    Top Attackers IP Distribution
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">

                    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] transition-all duration-300 shadow-[0_35px_70px_rgba(0,0,0,0.08)] hover:shadow-[0_45px_80px_rgba(0,0,0,0.12)] hover:-translate-y-2 group">
                        {/* Card Title */}
                        <div className="mb-2">
                            <h3 className="text-xl font-bold text-slate-800 ml-2">TOR</h3>
                            <p className="text-sm text-slate-500 ml-2">Top Destination IP Records</p>
                        </div>

                        <div className="flex justify-center items-center">
                            {/* Removed aspect-square to fix the bottom space issue */}
                            <div className="w-full max-w-[570px] h-[300px] transition-transform duration-300 group-hover:scale-[1.02]">
                                <PieWithGradientTOR />
                            </div>
                        </div>
                    </div>


                    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] transition-all duration-300 shadow-[0_35px_70px_rgba(0,0,0,0.08)] hover:shadow-[0_45px_80px_rgba(0,0,0,0.12)] hover:-translate-y-2 group">
                        {/* Card Title */}
                        <div className="mb-2">
                            <h3 className="text-xl font-bold text-slate-800 ml-2">Tunneling</h3>
                            <p className="text-sm text-slate-500 ml-2">Top Destination IP Records</p>
                        </div>

                        <div className="flex justify-center items-center">
                            {/* Removed aspect-square to fix the bottom space issue */}
                            <div className="w-full max-w-[570px] h-[300px] transition-transform duration-300 group-hover:scale-[1.02]">
                                <PieWithGradientTunneling />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>




    );

}

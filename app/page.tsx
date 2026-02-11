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

      {/* REAL-TIME GAUGES */}
      <div className="w-full">
        <h3 className="text-xl font-bold text-gray-500 text-center uppercase tracking-widest mb-6 ml-2">
          Real-time Gauges
        </h3>

        <div className="grid  grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden">

          {/* Card 1 */}
          <div className="bg-white p-4 md:p-6 group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="flex flex-col items-center">

              <div className="w-full max-w-[200px] aspect-square flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                {/* Example: Value is 12,500, which is exactly in the middle (Orange) */}
                <PieChartWithNeedle label={'Anamoly'} currentValue={12500} />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-4 md:p-6 group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="flex flex-col items-center">

              <div className="w-full max-w-[200px] aspect-square flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                {/* Example: Value is 12,500, which is exactly in the middle (Orange) */}
                <PieChartWithNeedle label={'TOR'} currentValue={7500} />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-4 md:p-6 group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="flex flex-col items-center">

              <div className="w-full max-w-[200px] aspect-square flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                {/* Example: Value is 12,500, which is exactly in the middle (Orange) */}
                <PieChartWithNeedle label={'PORT SCAN'} currentValue={18550} />
              </div>

            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-4 md:p-6 group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="flex flex-col items-center">

              <div className="w-full max-w-[200px] aspect-square flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                {/* Example: Value is 12,500, which is exactly in the middle (Orange) */}
                <PieChartWithNeedle label={'Tunneling'} currentValue={10432} />
              </div>

            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-4 md:p-6 group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="flex flex-col items-center">

              <div className="w-full max-w-[200px] aspect-square flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                {/* Example: Value is 12,500, which is exactly in the middle (Orange) */}
                <PieChartWithNeedle label={'Phishing'} currentValue={13111} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* VOLUME DISTRIBUTION */}
      <div className="w-full">
        <h3 className="text-xl font-bold text-gray-500 text-center uppercase tracking-widest mb-4 ml-2">
          Top Attackers
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">

          {/* Volume Card 1 */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] transition-all duration-300 shadow-[0_35px_70px_rgba(0,0,0,0.08)] hover:shadow-[0_45px_80px_rgba(0,0,0,0.12)] hover:-translate-y-2 group">
            {/* Card Title */}
            <div className="mb-2">
              <h3 className="text-xl font-bold text-slate-800 ml-2">Anomaly</h3>
              <p className="text-sm text-slate-500 ml-2">Top Destination IP Records</p>
            </div>

            <div className="flex justify-center items-center">
              {/* Removed aspect-square to fix the bottom space issue */}
              <div className="w-full max-w-[570px] h-[300px] transition-transform duration-300 group-hover:scale-[1.02]">
                <PieWithGradient />
              </div>
            </div>
          </div>

          {/* Volume Card 2 */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] transition-all duration-300 shadow-[0_35px_70px_rgba(0,0,0,0.08)] hover:shadow-[0_45px_80px_rgba(0,0,0,0.12)] hover:-translate-y-2 group">
            {/* Card Title */}
            <div className="mb-2">
              <h3 className="text-xl font-bold text-slate-800 ml-2">Port Scan</h3>
              <p className="text-sm text-slate-500 ml-2">Top Destination IP Records</p>
            </div>

            <div className="flex justify-center items-center">
              {/* Removed aspect-square to fix the bottom space issue */}
              <div className="w-full max-w-[570px] h-[300px] transition-transform duration-300 group-hover:scale-[1.02]">
                <PieWithGradientPortScan />
              </div>
            </div>
          </div>

          {/* Volume Card 3 */}
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

          {/* Volume Card 4 */}
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

      {/* ACTIVE PHISHINGS TABLE */}
      <div className="w-full">
        <h3 className="text-xl font-bold text-gray-500  text-center uppercase tracking-widest mb-4 ml-2">
          Active Phishings
        </h3>

        <PhishingTable />

      </div>

    </div>





  );

}

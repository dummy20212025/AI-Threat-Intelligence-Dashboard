import { parseCSV } from "@/lib/csvParser";
import { groupByCount } from "@/lib/dataTransform";
import PieChartWithNeedle from "@/components/charts/PieChartWithNeedle";
import PieWithGradientTOR from "@/components/ipCountCharts/PieWithGradientTOR";
import PieWithGradientTunneling from "@/components/ipCountCharts/PieWithGradientTunneling";

// Import our client-side animation wrappers
import { MDiv, MH3, containerVariants, itemVariants } from "@/components/framer/MotionWrappers";

export default async function Dashboard() {
    const phish = await parseCSV("phish_demo.csv");
    const tor = await parseCSV("tor_demo.csv");

    const torIPs = groupByCount(tor, "DstIP").slice(0, 10);

    return (
        <MDiv
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col gap-12 w-full max-w-[1600px] mx-auto p-6 md:p-10 bg-gray-50"
        >
            {/* HEADER */}
            <MDiv variants={itemVariants} className="w-full text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-blue-500 tracking-tight leading-tight">
                    AI-Driven Tunnel Hunter (ATH)
                </h2>
                <MDiv
                    initial={{ width: 0 }}
                    animate={{ width: "12rem" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-1.5 bg-blue-600 mx-auto mt-4 rounded-full"
                />
            </MDiv>

            {/* REAL-TIME GAUGES */}
            <MDiv variants={itemVariants} className="w-full">
                <MH3 className="text-xl font-bold text-gray-500 text-center uppercase tracking-widest mb-6 ml-2">
                    Real-time Gauges
                </MH3>

                <div className="w-full flex justify-center py-10 px-4">
                    <div className="w-full max-w-5xl bg-white/70 backdrop-blur-md shadow-[0_32px_64px_-15px_rgba(0,0,0,0.07)] rounded-[3rem] overflow-hidden border border-white/20 relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 ">

                            <MDiv 
                                whileHover={{ y: -5 }}
                                className="p-10 md:p-14 group transition-all duration-500 hover:bg-gradient-to-b hover:from-white hover:to-blue-50/50"
                            >
                                <div className="flex flex-col items-center justify-center space-y-8 transition-transform duration-500 group-hover:scale-[1.02]">
                                    <h4 className="text-xl font-bold text-slate-800 tracking-wide transition-colors duration-300 group-hover:text-blue-600">
                                        TOR Traffic
                                    </h4>
                                    <div className="w-full max-w-[260px] aspect-[4/3] flex items-center justify-center">
                                        <PieChartWithNeedle label={'TOR'} currentValue={7500} />
                                    </div>
                                </div>
                            </MDiv>

                            <MDiv 
                                whileHover={{ y: -5 }}
                                className="p-10 md:p-14 group transition-all duration-500 hover:bg-gradient-to-b hover:from-white hover:to-indigo-50/50"
                            >
                                <div className="flex flex-col items-center justify-center space-y-8 transition-transform duration-500 group-hover:scale-[1.02]">
                                    <h4 className="text-xl font-bold text-slate-800 tracking-wide transition-colors duration-300 group-hover:text-indigo-600">
                                        Tunneling
                                    </h4>
                                    <div className="w-full max-w-[260px] aspect-[4/3] flex items-center justify-center">
                                        <PieChartWithNeedle label={'Tunneling'} currentValue={10432} />
                                    </div>
                                </div>
                            </MDiv>                            

                        </div>
                    </div>
                </div>
            </MDiv>

            {/* VOLUME DISTRIBUTION */}
            <MDiv variants={itemVariants} className="w-full">
                <MH3 className="text-xl font-bold text-gray-500 text-center uppercase tracking-widest mb-8 ml-2">
                    Top Attackers IP Distribution
                </MH3>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                    
                    <MDiv 
                        whileHover={{ y: -8 }}
                        className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-transparent transition-all duration-500 shadow-[0_35px_70px_rgba(0,0,0,0.08)] hover:shadow-[0_45px_80px_rgba(0,0,0,0.12)] hover:border-blue-100 group relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="transition-transform duration-500 group-hover:scale-[1.01] flex flex-col h-full">
                            <div className="mb-10 relative z-10">
                                <h3 className="text-xl font-bold text-slate-800 ml-2 transition-colors duration-300 group-hover:text-blue-600">TOR</h3>
                                <p className="text-sm text-slate-500 ml-2">Top Destination IP Records</p>
                            </div>
                            <div className="flex justify-center items-center pt-4">
                                <div className="w-full max-w-[570px] h-[300px]">
                                    <PieWithGradientTOR />
                                </div>
                            </div>
                        </div>
                    </MDiv>

                    <MDiv 
                        whileHover={{ y: -8 }}
                        className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-transparent transition-all duration-500 shadow-[0_35px_70px_rgba(0,0,0,0.08)] hover:shadow-[0_45px_80px_rgba(0,0,0,0.12)] hover:border-indigo-100 group relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="transition-transform duration-500 group-hover:scale-[1.01] flex flex-col h-full">
                            <div className="mb-10 relative z-10">
                                <h3 className="text-xl font-bold text-slate-800 ml-2 transition-colors duration-300 group-hover:text-indigo-600">Tunneling</h3>
                                <p className="text-sm text-slate-500 ml-2">Top Destination IP Records</p>
                            </div>
                            <div className="flex justify-center items-center pt-4">
                                <div className="w-full max-w-[570px] h-[300px]">
                                    <PieWithGradientTunneling />
                                </div>
                            </div>
                        </div>
                    </MDiv>

                </div>
            </MDiv>
        </MDiv>
    );
}
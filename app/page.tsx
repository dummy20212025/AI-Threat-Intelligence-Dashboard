"use client";

import Link from "next/link";
import { ShieldAlert, Zap, ArrowUpRight, ShieldCheckIcon, RadarIcon } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

// --- NEURAL MOTION BACKGROUND (Internal Logic Remains Same, Optimized for Resize) ---
const NeuralBackground = ({ isHovered }: { isHovered: boolean }) => {
    const { theme } = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const speed = useRef(1);
    const isDark = theme === "dark";

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let particles: any[] = [];
        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            x: number; y: number; vx: number; vy: number; size: number;
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.size = Math.random() * 2 + 0.5;
            }
            update() {
                const targetSpeed = isHovered ? 3.5 : 1;
                speed.current = speed.current + (targetSpeed - speed.current) * 0.05;
                this.x += this.vx * speed.current;
                this.y += this.vy * speed.current;
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }
            draw() {
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx!.fillStyle = isDark
                    ? (isHovered ? "rgba(59, 130, 246, 0.8)" : "rgba(100, 200, 255, 0.4)")
                    : (isHovered ? "rgba(37, 99, 235, 0.5)" : "rgba(148, 163, 184, 0.3)");
                ctx!.fill();
            }
        }

        const init = () => {
            particles = Array.from({ length: 60 }, () => new Particle()); // Reduced count for mobile perf
        };

        const drawLines = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 150) {
                        ctx!.beginPath();
                        const opacity = (1 - distance / 150) * (isHovered ? 0.6 : 0.2);
                        ctx!.strokeStyle = isDark
                            ? `rgba(59, 130, 246, ${opacity})`
                            : `rgba(37, 99, 235, ${opacity})`;
                        ctx!.lineWidth = isHovered ? 1.2 : 0.6;
                        ctx!.moveTo(particles[i].x, particles[i].y);
                        ctx!.lineTo(particles[j].x, particles[j].y);
                        ctx!.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawLines();
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resize);
        resize(); init(); animate();
        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isHovered, isDark]);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

export default function DashboardPage() {
    const { theme } = useTheme();
    const [isHovered, setIsHovered] = useState(false);
    const [mounted, setMounted] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });
    const rotateX = useTransform(springY, [-500, 500], [5, -5]);
    const rotateY = useTransform(springX, [-500, 500], [-5, 5]);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    const isDark = theme === "dark";

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - (rect.left + rect.width / 2));
        mouseY.set(e.clientY - (rect.top + rect.height / 2));
    };

    const categories = [
        { title: "Cyber Radar", subtitle: "ACR", fullSub: "AI-powered Cyber Radar", description: "An exclusive cyber threat intelligence service that delivers real-time, curated, and actionable cyber threat insights that can be used in network security solutions. ", icon: <RadarIcon className="w-6 h-6" />, color: "text-blue-500", href: "/dashboard/acr" },
        { title: "Tunnel Hunter", subtitle: "ATH", fullSub: "AI-driven Tunnel Hunter", description: " An advanced AI-driven network visibility solution that helps ISPs/Enterprises/LEAs to detect TOR connections, VPN tunnels and DNS tunneling activity in real time.", icon: <Zap className="w-6 h-6" />, color: "text-amber-500", href: "/dashboard/ath" },
        { title: "Zero Day Phishing", subtitle: "AZP", fullSub: "AI-enabled Zero Day Phishing", description: "A real-time phishing detection solution that accurately identifies phishing domains of critical institutions the moment they go live, powered by expert-crafted detection logic and Visual AI. ", icon: <ShieldAlert className="w-6 h-6" />, color: "text-emerald-500", href: "/dashboard/azp" },
        { title: "Recon Shield", subtitle: "ARS", fullSub: "AI-based Recon Shield", description: "A proactive AI-based network intelligence solution for enterprises that delivers real-time detection of anomalous traffic including scanning acitvities to expose threats before exploitation begins.", icon: <ShieldCheckIcon className="w-6 h-6" />, color: "text-purple-500", href: "/dashboard/ars" },
    ];

    return (
        <div
            onMouseMove={handleMouseMove}
            className={`relative min-h-screen flex flex-col items-center pt-2 pb-5 px-4 sm:px-6 overflow-x-hidden transition-all duration-700
            ${isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}
        >
            <NeuralBackground isHovered={isHovered} />

            {/* --- HEADER --- */}
            <motion.div
                style={{ rotateX, rotateY, perspective: 1000 }}
                className="relative z-10 w-full max-w-6xl mb-1 md:mb-10 text-center"
            >
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <h2 className={`text-4xl sm:text-5xl md:text-5xl font-black tracking-tighter mb-4 drop-shadow-2xl ${isDark ? "text-white" : "text-slate-950"}`}>
                        CDOT-GARUDA
                    </h2>
                    <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-hidden">
                        <div className="hidden sm:block h-[1px] w-12 bg-blue-600" />
                        <p className="text-[10px] sm:text-xs md:text-sm font-extrabold uppercase tracking-[0.3em] sm:tracking-[0.6em] text-blue-500 text-center">
                            GUARDIAN WITH AI DRIVEN REAL TIME ULTRASCALE DATA ANALYTICS
                        </p>
                        <div className="hidden sm:block h-[1px] w-12 bg-blue-600" />
                    </div>
                </motion.div>
            </motion.div>

            {/* --- RESPONSIVE GRID --- */}
            <div className="relative z-10 w-full max-w-6xl">
                <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {categories.map((item, idx) => (
                        <Link key={item.subtitle} href={item.href} className="group flex">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative flex-1 flex flex-col p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-2 transition-all duration-500 
                                ${isDark
                                        ? "bg-slate-900/60 border-blue-900/20 backdrop-blur-xl group-hover:border-blue-500/50 shadow-xl"
                                        : "bg-gray-50/80 border-gray-200 backdrop-blur-md group-hover:border-blue-400 group-hover:shadow-2xl"
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-8 sm:mb-12">
                                    <div className={`p-3 sm:p-4 rounded-xl transition-all duration-500 border-2 
                                    ${isDark ? "bg-slate-800/80 border-slate-700 group-hover:bg-blue-600" : "bg-white border-gray-100 group-hover:bg-blue-500"} group-hover:text-white`}>
                                        <div className={item.color + " group-hover:text-white"}>{item.icon}</div>
                                    </div>
                                    <ArrowUpRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${isDark ? "text-slate-600" : "text-slate-400"} group-hover:text-blue-500`} />
                                </div>

                                <div>
                                    <span className="text-[0.9rem] sm:text-xs font-mono text-blue-500 font-bold tracking-widest uppercase mb-2 block">
                                        {item.fullSub} ({item.subtitle})
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-black mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* --- FOOTER --- */}
                <footer className={`mt-16 sm:mt-24 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[9px] tracking-[0.2em] px-4 transition-colors ${isDark ? "text-slate-700" : "text-slate-400"}`}>
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isHovered ? 'bg-blue-500 animate-pulse' : 'bg-blue-600/30'}`} />
                        <span>SYSTEM ACTIVE</span>
                    </div>
                    <span className="text-center">© 2026 C-DOT DEFENSE INTELLIGENCE</span>
                </footer>
            </div>
        </div>
    );
}
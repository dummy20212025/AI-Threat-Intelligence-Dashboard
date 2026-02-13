"use client";

import Link from "next/link";
import { Activity, ShieldAlert, Zap, Search, ArrowUpRight, ShieldCheckIcon ,Radar, RadarIcon} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

// --- NEURAL MOTION BACKGROUND ---
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
// Neuronal drift speed
this.vx = (Math.random() - 0.5) * 0.4;
this.vy = (Math.random() - 0.5) * 0.4;
this.size = Math.random() * 2 + 0.5;
}
update() {
const targetSpeed = isHovered ? 3.5 : 1;
speed.current = speed.current + (targetSpeed - speed.current) * 0.05;
this.x += this.vx * speed.current;
this.y += this.vy * speed.current;

// Wrap around screen for continuous motion
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
particles = Array.from({ length: 90 }, () => new Particle());
};

const drawLines = () => {
for (let i = 0; i < particles.length; i++) {
for (let j = i + 1; j < particles.length; j++) {
const dx = particles[i].x - particles[j].x;
const dy = particles[i].y - particles[j].y;
const distance = Math.sqrt(dx * dx + dy * dy);
if (distance < 170) {
ctx!.beginPath();
const opacity = (1 - distance / 170) * (isHovered ? 0.7 : 0.25);
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
ctx.fillStyle = isDark ? "#020617" : "#ffffff";
ctx.fillRect(0, 0, canvas.width, canvas.height);
const gradient = ctx.createRadialGradient(
canvas.width / 2, canvas.height / 2, 0,
canvas.width / 2, canvas.height / 2, canvas.width / 1.5
);
if (isDark) {
gradient.addColorStop(0, isHovered ? "rgba(30, 64, 175, 0.25)" : "rgba(30, 58, 138, 0.1)");
gradient.addColorStop(1, "rgba(2, 6, 23, 0)");
} else {
gradient.addColorStop(0, isHovered ? "rgba(219, 234, 254, 0.5)" : "rgba(241, 245, 249, 0.3)");
gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
}
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);
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

return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none transition-colors duration-700" />;
};

export default function DashboardPage() {
const { theme } = useTheme();
const [isHovered, setIsHovered] = useState(false);
const [mounted, setMounted] = useState(false);

// Parallax Values
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
const x = e.clientX - (rect.left + rect.width / 2);
const y = e.clientY - (rect.top + rect.height / 2);
mouseX.set(x);
mouseY.set(y);
};

const categories = [
{ title: "Cyber Radar", subtitle: "AI-powered Cyber Radar (ACR) ", description: "An exclusive cyber threat intelligence service that delivers real-time, curated, and actionable cyber threat insights that can be used in network security solutions. ", icon: <RadarIcon className="w-6 h-6" />, color: "text-blue-500", href: "/dashboard/acr" },
{ title: "Tunnel Hunter", subtitle: "AI-driven Tunnel Hunter (ATH)", description: " An advanced AI-driven network visibility solution that helps ISPs/Enterprises/LEAs to detect TOR connections, VPN tunnels and DNS tunneling activity in real time.", icon: <Zap className="w-6 h-6" />, color: "text-amber-500", href: "/dashboard/ath" },
{ title: "Zero Day Phishing", subtitle: "AI-enabled Zero Day Phishing (AZP)", description: "A real-time phishing detection solution that accurately identifies phishing domains of critical institutions the moment they go live, powered by expert-crafted detection logic and Visual AI. ", icon: <ShieldAlert className="w-6 h-6" />, color: "text-emerald-500", href: "/dashboard/azp" },
{ title: "Recon Shield", subtitle: "AI-based Recon Shield (ARS)", description: "A proactive AI-based network intelligence solution for enterprises that delivers real-time detection of anomalous traffic including scanning acitvities to expose threats before exploitation begins.", icon: <ShieldCheckIcon className="w-6 h-6" />, color: "text-purple-500", href: "/dashboard/ars" },
];

return (
<div 
onMouseMove={handleMouseMove}
className={`relative min-h-[calc(100vh-96px)] flex flex-col items-center pt-16 pb-12 px-6 overflow-hidden transition-all duration-700
${isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}
>
<NeuralBackground isHovered={isHovered} />

{/* --- PARALLAX CENTRAL HEADER --- */}
<motion.div 
style={{ rotateX, rotateY, perspective: 1000 }}
className="relative z-10 w-full max-w-[1440px] mb-20 text-center pointer-events-none"
>
<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
<h2 className={`text-7xl md:text-9xl font-black tracking-tighter  mb-4 transition-colors duration-700 drop-shadow-2xl
${isDark ? "text-white" : "text-slate-950"}`}>
CDOT-GARUDA
</h2>
<div className="flex items-center justify-center gap-4">
<motion.div initial={{ width: 0 }} animate={{ width: 48 }} className="h-[2px] bg-blue-600" />
<p className="text-sm md:text-base font-extrabold uppercase tracking-[0.6em] text-blue-500 whitespace-nowrap">
GUARDIAN WITH AI DRIVEN REAL TIME ULTRA DATA ANALYTICS
</p>
<motion.div initial={{ width: 0 }} animate={{ width: 48 }} className="h-[2px] bg-blue-600" />
</div>
</motion.div>
</motion.div>

{/* --- CARDS GRID --- */}
<div className="relative z-10 w-full max-w-[1440px]">
<div 
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4"
onMouseEnter={() => setIsHovered(true)}
onMouseLeave={() => setIsHovered(false)}
>
{categories.map((item, idx) => (
<Link key={item.subtitle} href={item.href} className="group flex">
<motion.div 
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: idx * 0.1, duration: 0.6 }}
className={`relative flex-1 flex flex-col p-8 rounded-[2rem] border-2 transition-all duration-500 
${isDark 
? "bg-slate-900/60 border-blue-900/20 backdrop-blur-xl group-hover:border-blue-500/50 group-hover:bg-slate-900/90 shadow-[0_8px_32px_rgba(0,0,0,0.3)]" 
: "bg-gray-50/80 border-gray-200 backdrop-blur-md group-hover:border-blue-400 group-hover:bg-white group-hover:shadow-2xl shadow-gray-200"
}`}
>
<div className="flex justify-between items-center mb-12">
<div className={`p-4 rounded-2xl transition-all duration-500 shadow-sm border-2 
${isDark ? "bg-slate-800/80 border-slate-700 group-hover:bg-blue-600 group-hover:text-white" : "bg-white border-gray-100 group-hover:bg-blue-500 group-hover:text-white"}`}>
<div className={item.color}>{item.icon}</div>
</div>
<AnimatePresence>
{isHovered && (
<motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
<span className="text-[9px] font-mono text-blue-500 font-bold tracking-tighter animate-pulse">SYSTEM_SCAN</span>
<ArrowUpRight className={`w-5 h-5 ${isDark ? "text-slate-600" : "text-slate-400"} group-hover:text-blue-500`} />
</motion.div>
)}
</AnimatePresence>
</div>
<div className="mt-auto">
<span className="text-[11px] font-mono text-blue-500 font-extrabold tracking-[0.2em] uppercase mb-3 block italic">
{item.subtitle}
</span>
<h3 className="text-2xl font-black mb-4 tracking-tight transition-colors group-hover:text-blue-600">
{item.title}
</h3>
<p className={`text-sm leading-relaxed min-h-[64px] font-semibold transition-colors ${isDark ? "text-slate-400" : "text-slate-500"}`}>
{item.description}
</p>
</div>
</motion.div>
</Link>
))}
</div>

<footer className={`mt-24 flex justify-between items-center font-mono text-[10px] tracking-[0.3em] px-10 transition-colors ${isDark ? "text-slate-700" : "text-slate-400"}`}>
<div className="flex items-center gap-3">
<span className={`w-2 h-2 rounded-full ${isHovered ? 'bg-blue-500 animate-ping' : 'bg-blue-600/30'} transition-all`} />
</div>
<div className="flex items-center gap-4">
<span className="opacity-50"></span>
<span className="h-4 w-[1px] bg-current opacity-20" />
<span>© 2026 C-DOT Defense Intelligence</span>
</div>
</footer>
</div>
</div>
);

}

"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const GAUGE_DATA = [
    { name: '5000-10000', value: 5000, color: '#10b981' },
    { name: '10,000-15,000', value: 10000, color: '#f59e0b' },
    { name: '15,000-20,000', value: 20000, color: '#ef4444' },
];

export default function PieChartWithNeedle({ label, currentValue }: { label: string; currentValue: number }) {
    const min = 5000;
    const max = 20000;
    const clampedValue = Math.min(Math.max(currentValue, min), max);

    // This is where the needle should end up
    const targetAngle = 180 - ((clampedValue - min) / (max - min)) * 180;
    
    // Start at 180 degrees
    const [angle, setAngle] = useState(180);

    useEffect(() => {
        // Use requestAnimationFrame to ensure the initial 180 position is rendered 
        // before jumping to the target, allowing the CSS transition to trigger.
        const animationRequest = requestAnimationFrame(() => {
            setAngle(targetAngle);
        });
        
        return () => cancelAnimationFrame(animationRequest);
    }, [targetAngle]);

    const statusColor = useMemo(() => {
        if (clampedValue <= 10000) return '#10b981';
        if (clampedValue <= 15000) return '#f59e0b';
        return '#ef4444';
    }, [clampedValue]);

    const cx = 105;
    const cy = 100;
    const iR = 60;
    const oR = 100;

    const RADIAN = Math.PI / 180;
    const length = oR * 0.8;
    const xp = cx + length * Math.cos(angle * RADIAN);
    const yp = cy - length * Math.sin(angle * RADIAN);

    return (
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 group">
            <div className="relative w-[210px] h-[120px]">
                <div
                    className="absolute inset-0 opacity-5 blur-2xl transition-colors duration-1000 rounded-full"
                    style={{ backgroundColor: statusColor }}
                />

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            dataKey="value"
                            startAngle={180}
                            endAngle={0}
                            data={GAUGE_DATA}
                            cx={cx}
                            cy={cy}
                            innerRadius={iR}
                            outerRadius={oR}
                            stroke="none"
                            isAnimationActive={false}
                        >
                            {GAUGE_DATA.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    className="opacity-90 group-hover:opacity-90 transition-opacity"
                                />
                            ))}
                        </Pie>

                        <g className="needle-layer">
                            <circle cx={cx} cy={cy} r={6} fill="#1e293b" />
                            <line
                                x1={cx}
                                y1={cy}
                                x2={xp}
                                y2={yp}
                                stroke="#1e293b"
                                strokeWidth="4"
                                strokeLinecap="round"
                                // The magic: CSS handles the interpolation between x/y coordinates
                                style={{ transition: 'all 1.5s cubic-bezier(0.22, 1, 0.36, 1)' }}
                            />
                        </g>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="flex justify-between w-full px-4 -mt-2 mb-6 pointer-events-none">
                <span className="text-[10px] font-bold text-slate-300">5,000</span>
                <span className="text-[10px] font-bold text-slate-300">20,000</span>
            </div>

            <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    {label}
                </p>
                <p className="text-2xl font-black tabular-nums" style={{ color: statusColor }}>
                    {currentValue.toLocaleString()}
                </p>
            </div>
        </div>
    );
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-[10px] font-bold shadow-xl border border-white/10">
               Range {payload[0].name} 
            </div>
        );
    }
    return null;
};
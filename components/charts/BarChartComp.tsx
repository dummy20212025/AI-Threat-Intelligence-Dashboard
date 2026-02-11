"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import DashboardCard from "../DashboardCard";
import FullscreenChart from "../FullscreenChart";
import { useState } from "react";

export default function BarChartComp({ title, data }: any) {
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(10);

  const filtered = data.slice(0, limit);

  const Chart = (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={filtered}>
        <defs>
          <linearGradient id="barGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--primary))" />
            <stop offset="100%" stopColor="rgb(var(--accent))" />
          </linearGradient>
        </defs>

        <XAxis dataKey="name" hide />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="url(#barGlow)" radius={[10, 10, 0, 0]}>
          <LabelList dataKey="value" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <>
      <DashboardCard title={title}>
        {/* FILTER */}
        <div className="flex justify-end mb-3">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="text-xs rounded-md border bg-transparent px-2 py-1"
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={15}>Top 15</option>
          </select>
        </div>

        <div
          onClick={() => setOpen(true)}
          className="h-[420px] cursor-pointer transition-transform hover:scale-[1.015]"
        >
          {Chart}
        </div>
      </DashboardCard>

      <FullscreenChart open={open} onClose={() => setOpen(false)}>
        <div className="h-full">{Chart}</div>
      </FullscreenChart>
    </>
  );
}

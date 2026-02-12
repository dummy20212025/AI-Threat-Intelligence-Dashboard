"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { Pie, PieChart, PieSectorShapeProps, Sector, Tooltip, ResponsiveContainer, Cell, Legend, Label } from 'recharts';
import Papa from 'papaparse';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

const PieGradient = (props: PieSectorShapeProps) => {
  const { cx, cy, outerRadius, index, isActive } = props;
  
  return (
    <g>
      <defs>
        <radialGradient id={`fillGradient${index}`} cx={cx} cy={cy} r={outerRadius} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={isActive ? 0.6 : 0.3} />
          <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={isActive ? 1 : 0.85} />
        </radialGradient>
      </defs>
      <Sector
        {...props}
        fill={`url(#fillGradient${index})`}
        stroke={COLORS[index % COLORS.length]}
        strokeWidth={isActive ? 2 : 1}
      />
    </g>
  );
};

export default function PieWithGradient() {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // Calculate total count using useMemo for performance
  const totalCount = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/phish_ip_count .csv');
        const csvString = await response.text();
        Papa.parse(csvString, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const formattedData = results.data
              .map((row: any) => ({
                name: row['Top values of DstIP.keyword'],
                value: parseInt(row['Count of records'], 10)
              }))
              .filter((item: any) => item.name && !isNaN(item.value))
              .sort((a: any, b: any) => b.value - a.value)
              .slice(0, 10);
            setChartData(formattedData);
          },
        });
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <Pie
            activeIndex={activeIndex}
            activeShape={PieGradient}
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="42%" 
            cy="50%"
            innerRadius="55%" 
            outerRadius="90%" 
            paddingAngle={0} 
            shape={PieGradient}
            isAnimationActive={true}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(undefined)}
          >
            {/* Added Label for the Total Count */}
            {/* <Label 
              value={totalCount.toLocaleString()} 
              position="center" 
              fill="#334155"
              dx={-25}
              style={{ fontSize: '20px', fontWeight: 'bold', marginLeft: '10' }}
            /> */}
            <Label 
              value="Top Attacker IPs" 
              position="center" 
              dx={-25}
              dy={5} // Offsets this text slightly below the count
              fill="#94a3b8"
              style={{ fontSize: '10px', textTransform: 'uppercase' }}
            />

            {chartData.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                style={{ 
                  outline: 'none', 
                  cursor: 'pointer',
                  filter: activeIndex !== undefined && activeIndex !== index ? 'grayscale(30%) opacity(0.4)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Pie>
          
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              fontSize: '12px'
            }} 
          />
          
          <Legend 
            layout="vertical" 
            align="right" 
            verticalAlign="middle"
            iconType="circle" 
            iconSize={10}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(undefined)}
            wrapperStyle={{ 
              right: 0,
              width: '45%',
              paddingLeft: '10px'
            }}
            formatter={(value) => {
              const item = chartData.find(d => d.name === value);
              const isSelected = activeIndex !== undefined && chartData[activeIndex]?.name === value;
              return (
                <span className={`ml-2 transition-all duration-300 cursor-pointer ${isSelected ? 'text-blue-600 font-bold' : 'text-slate-500'}`} style={{ fontSize: '11px' }}>
                  {value} ({item?.value.toLocaleString()})
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { MoodEntry } from '../types';
import { getMoodData } from '../constants';

interface Props {
  entries: MoodEntry[];
}

const TrendChart: React.FC<Props> = ({ entries }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const chartData = useMemo(() => {
    if (entries.length < 2) return null;

    const width = 1000;
    const height = 400;
    const paddingX = 60;
    const paddingY = 60;

    const usableWidth = width - paddingX * 2;
    const usableHeight = height - paddingY * 2;

    const points = entries.map((e, i) => {
      const x = paddingX + (i / (entries.length - 1)) * usableWidth;
      const y = height - paddingY - ((e.mood - 1) / 9) * usableHeight;
      return { x, y, mood: e.mood, date: e.date, timestamp: e.timestamp };
    });

    // Path for the line
    const linePath = points.reduce((path, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
    }, "");

    // Path for the area fill
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

    return { width, height, points, linePath, areaPath, paddingY };
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 italic">
        <span className="text-4xl mb-2">📈</span>
        <p className="text-xs font-black uppercase tracking-widest">Insufficient data for trajectory</p>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 italic">
        <p className="text-xs font-black uppercase tracking-widest">More logs needed for trend analysis</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[2.5/1] mt-4">
      <svg 
        viewBox={`0 0 ${chartData.width} ${chartData.height}`} 
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grid Lines */}
        {[1, 5, 10].map(val => {
          const y = chartData.height - 60 - ((val - 1) / 9) * (chartData.height - 120);
          return (
            <g key={val} className="opacity-10 dark:opacity-5">
              <line x1="60" y1={y} x2={chartData.width - 60} y2={y} stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              <text x="40" y={y + 4} className="text-[20px] font-black fill-current" textAnchor="end">{val}</text>
            </g>
          );
        })}

        {/* Area Fill */}
        <path 
          d={chartData.areaPath} 
          fill="url(#chartGradient)" 
          className="transition-all duration-1000 ease-out"
          style={{ 
            opacity: animate ? 1 : 0,
            transform: animate ? 'none' : 'translateY(20px)'
          }}
        />

        {/* The Line */}
        <path 
          d={chartData.linePath} 
          fill="none" 
          stroke="#7c3aed" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="transition-all duration-1000 ease-out"
          style={{ 
            strokeDasharray: 2000, 
            strokeDashoffset: animate ? 0 : 2000,
            filter: 'url(#glow)'
          }}
        />

        {/* Data Points */}
        {chartData.points.map((p, i) => {
          const moodInfo = getMoodData(p.mood);
          const isAnomaly = i > 0 && (chartData.points[i - 1].mood - p.mood >= 3);
          
          return (
            <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
              {/* Interaction Target */}
              <circle cx={p.x} cy={p.y} r="30" fill="transparent" />
              
              {/* Visible Point */}
              <circle 
                cx={p.x} 
                cy={p.y} 
                r={hoveredIndex === i ? 14 : 10} 
                fill={moodInfo.color} 
                stroke="white" 
                strokeWidth="4"
                className="transition-all duration-300 shadow-xl"
                style={{ 
                  opacity: animate ? 1 : 0,
                  transform: `scale(${animate ? 1 : 0})`,
                  transformOrigin: `${p.x}px ${p.y}px`,
                  filter: hoveredIndex === i ? 'brightness(1.1) drop-shadow(0 4px 10px rgba(0,0,0,0.2))' : 'none'
                }}
              />

              {/* Anomaly Indicator */}
              {isAnomaly && (
                <text 
                  x={p.x} 
                  y={p.y - 30} 
                  className="text-[24px] fill-rose-500 font-black animate-bounce" 
                  textAnchor="middle"
                >
                  !
                </text>
              )}

              {/* Date Label on Axis */}
              <text 
                x={p.x} 
                y={chartData.height - 20} 
                className="text-[18px] font-black fill-slate-400 dark:fill-slate-600 uppercase tracking-tighter"
                textAnchor="middle"
              >
                {new Date(p.timestamp).toLocaleDateString(undefined, { weekday: 'short' })}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip Overlay */}
      {hoveredIndex !== null && chartData.points[hoveredIndex] && (
        <div 
          className="absolute z-50 pointer-events-none bg-slate-900 dark:bg-slate-800 text-white p-4 rounded-3xl shadow-2xl animate-fade-in border border-white/10"
          style={{ 
            left: `${(chartData.points[hoveredIndex].x / chartData.width) * 100}%`,
            top: `${(chartData.points[hoveredIndex].y / chartData.height) * 100}%`,
            transform: 'translate(-50%, -120%)'
          }}
        >
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">{getMoodData(chartData.points[hoveredIndex].mood).emoji}</span>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {new Date(chartData.points[hoveredIndex].timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
              <span className="font-bold text-lg">Mood: {chartData.points[hoveredIndex].mood}/10</span>
            </div>
          </div>
          <div 
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 dark:bg-slate-800 rotate-45 border-r border-b border-white/10"
          ></div>
        </div>
      )}
    </div>
  );
};

export default TrendChart;

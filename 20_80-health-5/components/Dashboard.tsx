
import React from 'react';
import { getMoodData } from '../constants';

interface Props {
  avg: number;
}

const Dashboard: React.FC<Props> = ({ avg }) => {
  const moodData = getMoodData(avg);
  
  const getBannerConfig = () => {
    if (avg === 0) return { 
      gradient: 'hero-gradient', 
      message: 'Start tracking to see your weekly mood average and unlock personalized insights.' 
    };
    if (avg >= 7) return { 
      gradient: 'from-emerald-600 to-teal-700', 
      message: 'Your mental clarity is thriving. Focus on maintaining these high-impact habits.' 
    };
    if (avg >= 4) return { 
      gradient: 'from-indigo-600 to-purple-700', 
      message: 'You are navigating life with balance. Small reflections today lead to stability tomorrow.' 
    };
    if (avg >= 1) return { 
      gradient: 'from-rose-600 to-rose-800', 
      message: 'Your wellbeing is our priority. Please take a moment for gentle self-care today.' 
    };
    return { 
      gradient: 'from-slate-700 to-slate-900', 
      message: 'Begin your journey with a single mood log.' 
    };
  };

  const config = getBannerConfig();

  return (
    <div className={`w-full bg-gradient-to-br ${config.gradient} rounded-[3rem] p-10 md:p-14 text-white shadow-2xl transition-all duration-700 relative overflow-hidden group border border-white/10`}>
      {/* Ambient background blur */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
      
      <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
        <div className="flex-shrink-0 bg-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] text-center min-w-[160px] border border-white/20 shadow-2xl transform transition-transform group-hover:scale-105">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">7-Day Score</p>
          <div className="flex items-center justify-center">
            <p className="text-7xl font-bold tracking-tighter tabular-nums">{avg === 0 ? '--' : avg}</p>
            <span className="text-xl opacity-40 font-bold ml-1 self-end mb-2">/10</span>
          </div>
          <div className="mt-4 text-3xl transition-transform duration-500 hover:rotate-12" title={moodData.label}>
            {avg === 0 ? '✨' : moodData.emoji}
          </div>
        </div>
        
        <div className="flex-grow text-center md:text-left space-y-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            Status: {avg === 0 ? 'Awaiting Data' : moodData.label}
          </div>
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Weekly Wellbeing Pulse</h3>
          <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
            {config.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

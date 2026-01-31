
import React from 'react';
import { getMoodData } from '../constants';
import AIRecommendationsBox from './AIRecommendationsBox';
import TrendChart from './TrendChart';
import Dashboard from './Dashboard';

interface Props {
  stats: any;
  onClear: () => void;
}

const DashboardTab: React.FC<Props> = ({ stats, onClear }) => {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* High-level Summary Component */}
      <Dashboard avg={stats.avg7} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AIRecommendationsBox avg={stats.avg7} recentEntries={stats.recent} />
        
        <div className="glass-card p-10">
          <h3 className="text-2xl font-bold mb-8 text-slate-800 dark:text-white flex items-center gap-3">
            <span className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-xl text-lg">📊</span> Weekly Trend
          </h3>
          <TrendChart entries={stats.recent.reverse()} />
        </div>
      </div>

      <ThresholdAlert stats={stats} />

      <div className="space-y-6">
        <div className="flex justify-between items-end px-2">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Recent Entries</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Your historical mood logs</p>
          </div>
          <button onClick={onClear} className="text-rose-500 text-xs font-black uppercase tracking-widest hover:text-rose-600 px-4 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/40">
            🗑️ Clear Data
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.recent.length > 0 ? (
            stats.recent.map((entry: any, i: number) => {
              const data = getMoodData(entry.mood);
              return (
                <div key={i} className="glass-card p-7 border-l-[10px] hover:translate-x-2 flex items-start gap-5 group" style={{ borderLeftColor: data.color }}>
                  <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{data.emoji}</div>
                  <div className="flex-grow">
                    <div className="flex justify-between mb-2 items-center">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{new Date(entry.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      <span className="font-black text-[10px] px-3 py-1 rounded-full text-white uppercase tracking-wider" style={{ backgroundColor: data.color }}>{entry.mood} / 10</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                      {entry.note ? `"${entry.note}"` : 'Reflected in silence.'}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-24 text-center glass-card border-dashed">
              <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-sm">No log history found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ThresholdAlert = ({ stats }: any) => {
  const last3 = stats.recent.slice(0, 3);
  const avg3 = last3.length >= 3 ? last3.reduce((acc: any, e: any) => acc + e.mood, 0) / 3 : 10;
  
  if (avg3 < 4) {
    return (
      <div className="bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-200 dark:border-rose-900/30 p-8 rounded-[2rem] flex items-start gap-6 animate-pulse shadow-xl shadow-rose-100 dark:shadow-none">
        <span className="text-5xl">🚨</span>
        <div>
          <h3 className="text-2xl font-bold text-rose-800 dark:text-rose-400 mb-2">Urgent Support Reminder</h3>
          <p className="text-rose-700 dark:text-rose-500 font-medium text-lg leading-relaxed">
            Your mood has been consistently low recently. Please prioritize your safety and well-being. Reach out to a professional or call <b>112</b> for immediate help.
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default DashboardTab;

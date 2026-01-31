
import React from 'react';
import { Milestone } from '../types';

const Milestones = ({ streak, total }: any) => {
  const milestones: Milestone[] = [
    { id: '1', icon: '🎯', title: 'First Entry', desc: 'Started your journey', achieved: total >= 1 },
    { id: '2', icon: '🔥', title: '7-Day Streak', desc: 'Consistent reflection', achieved: streak >= 7 },
    { id: '3', icon: '💎', title: 'Power User', desc: 'Log for 30 days', achieved: total >= 30 },
    { id: '4', icon: '🌟', title: 'Wellness Star', desc: '14-day streak', achieved: streak >= 14 },
  ];

  return (
    <div className="glass-card p-8 bg-white/90 dark:bg-slate-900/90 transition-colors">
      <h3 className="text-2xl font-bold mb-8 text-slate-800 dark:text-white">🏆 Your Milestones</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {milestones.map((m) => (
          <div key={m.id} className={`p-6 rounded-3xl text-center border-2 transition-all ${m.achieved ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 shadow-sm' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/60 opacity-40 grayscale'}`}>
            <div className="text-4xl mb-3">{m.icon}</div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">{m.title}</h4>
            <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Milestones;

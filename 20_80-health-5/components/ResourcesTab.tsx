
import React from 'react';
import { User } from '../types';
import PsychiatristSection from './PsychiatristSection';

interface Props {
  user: User;
  onResetOnboarding?: () => void;
}

const ResourcesTab: React.FC<Props> = ({ user, onResetOnboarding }) => {
  return (
    <div className="space-y-12">
      {/* Local Psychiatrists Finder - Higher Priority */}
      <PsychiatristSection user={user} />

      <section className="glass-card p-10 md:p-14 bg-white/95 dark:bg-slate-900/95 border-l-[16px] border-rose-500 transition-colors shadow-2xl">
        <h2 className="text-4xl font-bold text-rose-600 dark:text-rose-500 mb-10 flex items-center gap-4 tracking-tighter">
          <span className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-3xl">🚨</span> Immediate Support
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <ResourceItem 
            title="National Crisis Line" 
            contact="112" 
            desc="Global standard emergency contact for immediate help. Available 24/7 for urgent crisis management."
            urgent
          />
          <ResourceItem 
            title="Mental Helpline" 
            contact="1800-599-0019" 
            desc="Specialized mental health support line offering empathetic listening and professional guidance."
            urgent
          />
        </div>
      </section>

      <section className="glass-card p-10 md:p-14 bg-white/95 dark:bg-slate-900/95 transition-colors shadow-2xl">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-10 flex items-center gap-4 tracking-tight">
          <span className="p-4 bg-brand-indigo/10 rounded-3xl">🏛️</span> App Sanctuary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
            <h4 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Need a Refresher?</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-xs">Restart the onboarding tutorial to revisit the core philosophy of 20/80 Health.</p>
            <button 
              onClick={onResetOnboarding}
              className="w-full py-4 px-8 rounded-2xl bg-brand-purple text-white font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all shadow-lg"
            >
              Restart Tutorial
            </button>
          </div>
          <div className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
            <h4 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Privacy Status</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-xs">All records are locally encrypted. Your health data never leaves your device.</p>
            <div className="px-5 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-200/50">
              Verified Secure
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card p-10 md:p-14 bg-white/95 dark:bg-slate-900/95 transition-colors shadow-2xl">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-10 flex items-center gap-4 tracking-tight">
          <span className="p-4 bg-brand-teal/10 rounded-3xl">🌱</span> The 20/80 Toolkit
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Nature Walk (20min)', 'Journaling Protocol', 'Box Breathing', 'Flow State Hobby', 'Active Connection', 'Kinetic Movement', 'Digital Fasting', 'Stillness Practice'].map(a => (
            <div key={a} className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-black uppercase tracking-[0.2em] text-center hover:bg-white dark:hover:bg-slate-700 hover:shadow-2xl hover:scale-110 transition-all cursor-default flex items-center justify-center">
              {a}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ResourceItem = ({ title, contact, desc, link, urgent }: any) => (
  <div className={`p-10 rounded-[3rem] transition-all hover:translate-y-[-8px] shadow-sm ${urgent ? 'bg-rose-50/40 dark:bg-rose-950/20 border-2 border-rose-100/50 dark:border-rose-900/20' : 'bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800'}`}>
    <h4 className={`text-2xl font-bold mb-4 tracking-tight ${urgent ? 'text-rose-800 dark:text-rose-400' : 'text-slate-800 dark:text-white'}`}>{title}</h4>
    {contact && <p className="text-5xl font-black text-brand-purple dark:text-brand-purple mb-6 tabular-nums tracking-tighter">{contact}</p>}
    <p className="text-base text-slate-500 dark:text-slate-400 mb-8 font-medium leading-relaxed">{desc}</p>
    {link && (
      <a href={link} target="_blank" className="inline-flex items-center text-brand-purple dark:text-brand-purple font-black uppercase text-[11px] tracking-[0.3em] hover:opacity-70 transition-opacity">
        Visit Resource →
      </a>
    )}
  </div>
);

export default ResourcesTab;

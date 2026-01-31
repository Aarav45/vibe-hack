
import React, { useState } from 'react';
import { getMoodData } from '../constants';

interface Props {
  onSave: (mood: number, note: string) => void;
}

const MoodEntryForm: React.FC<Props> = ({ onSave }) => {
  const [mood, setMood] = useState(5);
  const [note, setNote] = useState('');
  const [shake, setShake] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const moodData = getMoodData(mood);
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trigger confetti if mood is high (9 or 10)
    if (mood >= 9) {
      triggerConfetti();
    }

    onSave(mood, note);
    setNote('');
    setIsSaved(true);
    
    setTimeout(() => setIsSaved(false), 3000);
  };

  const triggerConfetti = () => {
    const colors = ['#6B46C1', '#14B8A6', '#FF6B6B', '#FFA500', '#50C878', '#FFFFFF'];
    const count = 100;
    
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      
      const startX = 50 + (Math.random() - 0.5) * 20; 
      confetti.style.left = `${startX}vw`;
      confetti.style.bottom = '10vh';
      
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      confetti.style.zIndex = '1000';
      
      document.body.appendChild(confetti);

      const destinationX = (Math.random() - 0.5) * 1000;
      const destinationY = -(500 + Math.random() * 500);

      const animation = confetti.animate([
        { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${destinationX}px, ${destinationY}px) rotate(${Math.random() * 1440}deg)`, opacity: 0 }
      ], {
        duration: 2000 + Math.random() * 1000,
        easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
        fill: 'forwards'
      });

      animation.onfinish = () => confetti.remove();
    }
  };

  return (
    <section className={`glass-card p-8 md:p-12 relative overflow-hidden transition-all duration-500 hover:shadow-2xl ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
      {/* Dynamic Background Glow */}
      <div 
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] transition-all duration-700 opacity-20"
        style={{ backgroundColor: moodData.color }}
      ></div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 relative z-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white transition-colors">How are you today?</h2>
          <p className="text-slate-400 dark:text-slate-500 font-semibold tracking-wide mt-1 uppercase text-xs">{today}</p>
        </div>
        <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/50 dark:border-white/5 shadow-sm text-[10px] font-black tracking-[0.2em] text-purple-600 dark:text-purple-400 uppercase">
          Daily Reflection
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
        <div className="space-y-8">
          <div className="flex flex-col items-center justify-center gap-6">
            <div 
              className="text-9xl transition-all duration-500 transform hover:scale-110 drop-shadow-2xl cursor-default select-none animate-[pulse_3s_ease-in-out_infinite]"
              style={{ filter: `drop-shadow(0 0 20px ${moodData.color}44)` }}
            >
              {moodData.emoji}
            </div>
            <div className="text-center">
              <span className="text-5xl font-bold text-slate-800 dark:text-white tabular-nums">{mood}</span>
              <span className="text-slate-400 dark:text-slate-600 text-2xl font-medium">/10</span>
              <p 
                className="text-lg font-black uppercase tracking-[0.3em] mt-3 transition-colors duration-500" 
                style={{ color: moodData.color }}
              >
                {moodData.label}
              </p>
            </div>
          </div>

          <div className="px-2 space-y-4">
            <div className="relative h-12 flex items-center group/slider">
              {/* Enhanced Focused Breathing Aura */}
              <div 
                className="absolute -inset-x-12 inset-y-0 opacity-0 group-focus-within/slider:opacity-100 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none animate-[slider-pulse_2.5s_ease-in-out_infinite]"
                style={{ backgroundColor: `${moodData.color}22` }}
              ></div>

              {/* Custom Track Background */}
              <div className="absolute w-full h-3 bg-slate-200 dark:bg-slate-800/50 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(0,0,0,0.1)] relative"
                  style={{ width: `${(mood / 10) * 100}%`, backgroundColor: moodData.color }}
                >
                  {/* Active Shimmer Effect */}
                  <div className="absolute inset-0 w-full h-full opacity-0 group-focus-within/slider:opacity-30 bg-gradient-to-r from-transparent via-white to-transparent animate-[shimmer_2s_infinite] pointer-events-none"></div>
                </div>
              </div>

              {/* Range Input with Polished Focus States */}
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(parseInt(e.target.value))}
                className="absolute w-full appearance-none bg-transparent cursor-pointer z-20 outline-none
                  [&::-webkit-slider-thumb]:appearance-none 
                  [&::-webkit-slider-thumb]:w-9 
                  [&::-webkit-slider-thumb]:h-9 
                  [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-white 
                  [&::-webkit-slider-thumb]:shadow-xl 
                  [&::-webkit-slider-thumb]:border-4 
                  [&::-webkit-slider-thumb]:border-brand-purple 
                  [&::-webkit-slider-thumb]:transition-all 
                  [&::-webkit-slider-thumb]:duration-300
                  [&::-webkit-slider-thumb]:hover:scale-110
                  focus:[&::-webkit-slider-thumb]:scale-125
                  focus:[&::-webkit-slider-thumb]:ring-[12px]
                  focus:[&::-webkit-slider-thumb]:ring-brand-purple/10
                  focus:[&::-webkit-slider-thumb]:shadow-[0_0_30px_rgba(107,70,193,0.4)]
                  focus:[&::-webkit-slider-thumb]:border-brand-purple"
                style={{ 
                  '--thumb-color': moodData.color 
                } as any}
              />
            </div>
            <div className="flex justify-between text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.25em] px-1">
              <span>😢 Struggling</span>
              <span className="opacity-40">Slide your mood</span>
              <span>😄 Radiant</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <label htmlFor="note" className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Journal Note</label>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors ${note.length >= 180 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              {note.length} / 200
            </span>
          </div>
          <div className="relative group">
            <div 
              className="absolute -inset-0.5 rounded-3xl blur-md opacity-0 group-focus-within:opacity-30 transition-opacity duration-500 animate-pulse"
              style={{ background: moodData.color }}
            ></div>
            <textarea
              id="note"
              placeholder="What's making your day feel this way?"
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 200))}
              className="relative w-full min-h-[140px] p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-100 dark:border-slate-800 focus:border-brand-purple/50 focus:bg-white/80 dark:focus:bg-slate-900/80 transition-all outline-none text-lg text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-inner resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-5 rounded-3xl text-white font-bold text-xl shadow-2xl transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 overflow-hidden group
            ${isSaved ? 'bg-emerald-500 shadow-emerald-200' : 'hero-gradient hover:brightness-110'}`}
        >
          {isSaved ? (
            <>
              <span className="animate-[bounce_0.5s_ease-in-out]">✨</span>
              <span>Entry Logged</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span>Save Reflection</span>
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover:animate-[shine_1.2s_ease-in-out_infinite]" />
            </>
          )}
        </button>
      </form>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes slider-pulse {
          0%, 100% { transform: scaleX(1); opacity: 0.15; }
          50% { transform: scaleX(1.05); opacity: 0.3; }
        }
      `}} />
    </section>
  );
};

export default MoodEntryForm;

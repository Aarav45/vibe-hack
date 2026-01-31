
import React, { useState, useEffect, useCallback } from 'react';
import { MoodEntry } from '../types';
import { generateAIRecommendations } from '../services/geminiService';

interface Props {
  avg: number;
  recentEntries: MoodEntry[];
}

const AIRecommendationsBox: React.FC<Props> = ({ avg, recentEntries }) => {
  const [recommendations, setRecommendations] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    if (recentEntries.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await generateAIRecommendations(avg, recentEntries);
      setRecommendations(res);
    } catch (err: any) {
      if (err?.message?.includes('Quota') || err?.message?.includes('429')) {
        setError(err.message || 'The wellness sanctuary is resting. Please try again in 1 minute.');
      } else {
        setError('We encountered a minor ripple in the stream. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [avg, recentEntries.length]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  if (recentEntries.length === 0) {
    return (
      <div className="glass rounded-3xl p-8 border border-white/50 dark:border-slate-800 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🧠</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Log your first few days to unlock personalized AI wellbeing insights.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-8 shadow-xl border border-white/50 dark:border-slate-800 relative min-h-[300px] bg-white/70 dark:bg-slate-900/70 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 hero-gradient rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-lg">✨</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">AI Personal Insights</h3>
        </div>
        {error && (
          <button 
            onClick={fetchInsights}
            className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition-all"
          >
            Retry
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-12 h-12 border-4 border-purple-200 dark:border-purple-900 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-gray-400 dark:text-gray-500 font-medium pulse-slow">Gathering insights from your journey...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-in fade-in duration-500">
          <span className="text-4xl">⏳</span>
          <p className="text-rose-500 dark:text-rose-400 font-medium max-w-xs">{error}</p>
          <button 
            onClick={fetchInsights}
            className="py-3 px-8 rounded-2xl hero-gradient text-white text-xs font-black uppercase tracking-widest shadow-lg transform active:scale-95 transition-all"
          >
            Refresh Insights
          </button>
        </div>
      ) : (
        <div className="prose prose-sm prose-purple dark:prose-invert text-gray-600 dark:text-slate-300 animate-in fade-in duration-1000">
           <div className="whitespace-pre-wrap leading-relaxed">
            {recommendations.split('\n').map((line, i) => {
              if (line.startsWith('#')) {
                return <h4 key={i} className="text-lg font-bold text-gray-800 dark:text-white mt-4 mb-2">{line.replace(/^#+\s/, '')}</h4>;
              }
              if (line.startsWith('-') || line.startsWith('*')) {
                return (
                  <div key={i} className="flex gap-2 mb-2 items-start bg-white/40 dark:bg-slate-800/40 p-3 rounded-xl border border-white/20 dark:border-white/5">
                    <span className="mt-0.5">•</span>
                    <span>{line.replace(/^[-*]\s/, '')}</span>
                  </div>
                );
              }
              return line.trim() ? <p key={i} className="mb-2">{line}</p> : null;
            })}
          </div>
        </div>
      )}

      {!loading && !error && recommendations && (
        <div className="mt-8 pt-4 border-t border-gray-100/50 dark:border-slate-800 flex justify-between items-center text-[10px] text-gray-400 dark:text-slate-600 font-bold uppercase tracking-widest">
          <span>Powered by Gemini AI</span>
          <span>Updated just now</span>
        </div>
      )}
    </div>
  );
};

export default AIRecommendationsBox;

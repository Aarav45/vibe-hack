
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { generateImprovementPlan } from '../services/geminiService';
import { MoodEntry } from '../types';
import Milestones from './Milestones';

interface Props {
  entries: MoodEntry[];
  stats: any;
}

const InsightsTab: React.FC<Props> = ({ entries, stats }) => {
  const [plan, setPlan] = useState('');
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);

  const fetchPlan = useCallback(async () => {
    if (entries.length < 5) return;
    setLoadingPlan(true);
    setPlanError(null);
    try {
      const res = await generateImprovementPlan(stats.avg7, entries);
      setPlan(res);
    } catch (err: any) {
      if (err?.message?.includes('Quota') || err?.message?.includes('429')) {
        setPlanError(err.message || 'API quota reached. Retrying in 1 minute.');
      } else {
        setPlanError('The intelligence engine is resting. Click to wake it.');
      }
    } finally {
      setLoadingPlan(false);
    }
  }, [entries.length, stats.avg7]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const anomalies = useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp);
    const results = [];
    for (let i = 1; i < sorted.length; i++) {
      const drop = sorted[i - 1].mood - sorted[i].mood;
      if (drop >= 3) {
        results.push({
          date: sorted[i].date,
          timestamp: sorted[i].timestamp,
          drop,
          from: sorted[i - 1].mood,
          to: sorted[i].mood,
          note: sorted[i].note
        });
      }
    }
    return results.reverse();
  }, [entries]);

  return (
    <div className="space-y-8">
      {anomalies.length > 0 && (
        <div className="glass-card p-10 bg-white/95 dark:bg-slate-900/90 border-l-[12px] border-rose-500 animate-fade-in shadow-2xl">
          <h3 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-4">
            <span className="text-4xl">⚠️</span> Mood Insights
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg font-medium">
            We've identified significant shifts in your recent mood flow. These insights help you understand your triggers more deeply.
          </p>
          <div className="space-y-5">
            {anomalies.slice(0, 3).map((anomaly, idx) => (
              <div key={idx} className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/20 p-6 rounded-[2rem] flex items-start gap-5 hover:bg-rose-100/50 dark:hover:bg-rose-900/30 transition-all">
                <div className="bg-rose-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-lg shadow-rose-200/50 dark:shadow-none">
                  -{anomaly.drop} Points
                </div>
                <div>
                  <p className="text-rose-900 dark:text-rose-300 font-bold text-lg">
                    {new Date(anomaly.timestamp).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-rose-700 dark:text-rose-400/80 mt-2 leading-relaxed">
                    Mood shifted from {anomaly.from} to {anomaly.to}. {anomaly.note ? `Context: "${anomaly.note}"` : 'No note recorded for this drop.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] italic text-center">
            💡 Healing happens in the flow, not the peaks.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-10">
          <h3 className="text-2xl font-bold mb-8 text-slate-800 dark:text-white flex items-center gap-4">
            <span className="bg-brand-purple/10 p-2 rounded-xl">📅</span> Weekly Rhythm
          </h3>
          {entries.length < 7 ? (
            <div className="py-12 text-center">
              <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-xs">Need 7 days of logs</p>
            </div>
          ) : (
            <PatternAnalysis entries={entries} />
          )}
        </div>

        <div className="glass-card p-10">
          <h3 className="text-2xl font-bold mb-8 text-slate-800 dark:text-white flex items-center gap-4">
            <span className="bg-brand-teal/10 p-2 rounded-xl">📊</span> Distribution
          </h3>
          <MoodDistribution entries={entries} />
        </div>
      </div>

      <div className="glass-card p-10 border-l-[12px] border-brand-teal overflow-hidden relative min-h-[400px]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-4">
            <span className="bg-teal-500/10 p-2 rounded-xl">💡</span> Growth Strategy
          </h3>
          {planError && (
             <button 
              onClick={fetchPlan}
              className="text-xs font-black uppercase tracking-widest text-teal-600 hover:text-teal-700 transition-colors"
            >
              Retry
            </button>
          )}
        </div>

        {loadingPlan ? (
          <div className="flex flex-col items-center py-20 gap-6">
            <div className="w-12 h-12 border-4 border-teal-100 dark:border-teal-900 border-t-teal-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 dark:text-slate-600 font-black uppercase text-xs tracking-[0.3em] animate-pulse">Synthesizing data</p>
          </div>
        ) : planError ? (
          <div className="flex flex-col items-center py-20 text-center space-y-4">
            <span className="text-4xl">⏳</span>
            <p className="text-slate-500 dark:text-slate-400 font-medium">{planError}</p>
            <button 
              onClick={fetchPlan}
              className="py-3 px-8 rounded-2xl bg-teal-500 text-white text-xs font-black uppercase tracking-widest shadow-lg hover:bg-teal-600 transition-all active:scale-95"
            >
              Regenerate Plan
            </button>
          </div>
        ) : plan ? (
          <div className="prose prose-slate dark:prose-invert max-w-none prose-h3:text-teal-700 dark:prose-h3:text-teal-400 prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-li:text-slate-600 dark:prose-li:text-slate-400 leading-relaxed text-lg animate-in fade-in duration-1000">
            <div dangerouslySetInnerHTML={{ __html: plan.replace(/\n/g, '<br/>') }} />
          </div>
        ) : (
          <div className="py-20 text-center">
             <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-sm">Waiting for more data points...</p>
          </div>
        )}
      </div>

      <Milestones streak={stats.streak} total={stats.total} />
    </div>
  );
};

const PatternAnalysis = ({ entries }: any) => {
  const dayStats = entries.reduce((acc: any, e: any) => {
    const day = new Date(e.timestamp).toLocaleDateString(undefined, { weekday: 'long' });
    if (!acc[day]) acc[day] = { sum: 0, count: 0 };
    acc[day].sum += e.mood;
    acc[day].count += 1;
    return acc;
  }, {});

  const bestDay = Object.entries(dayStats).sort(([, a]: any, [, b]: any) => (b.sum / b.count) - (a.sum / a.count))[0];
  const worstDay = Object.entries(dayStats).sort(([, a]: any, [, b]: any) => (a.sum / a.count) - (b.sum / b.count))[0];

  return (
    <div className="space-y-5">
      <div className="p-6 rounded-[2rem] bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 group">
        <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mb-2">Peak Wellbeing Day</p>
        <p className="text-lg text-emerald-900 dark:text-emerald-200 font-semibold leading-snug">
          You consistently feel brightest on <span className="underline decoration-emerald-500 decoration-2 underline-offset-4">{bestDay[0]}s</span>.
        </p>
      </div>
      <div className="p-6 rounded-[2rem] bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 group">
        <p className="text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-2">High-Energy Reflection Day</p>
        <p className="text-lg text-amber-900 dark:text-amber-200 font-semibold leading-snug">
          <span className="underline decoration-amber-500 decoration-2 underline-offset-4">{worstDay[0]}s</span> tend to bring more challenges to your flow.
        </p>
      </div>
      <p className="text-slate-500 dark:text-slate-500 text-sm italic mt-6 px-2">
        Pro-tip: Schedule something joyful for {worstDay[0]} mornings.
      </p>
    </div>
  );
};

const MoodDistribution = ({ entries }: any) => {
  const dist = entries.slice(-30).reduce((acc: any, e: any) => {
    if (e.mood >= 8) acc.great++;
    else if (e.mood >= 5) acc.good++;
    else acc.low++;
    return acc;
  }, { great: 0, good: 0, low: 0 });

  const total = Math.max(1, dist.great + dist.good + dist.low);
  const getW = (n: number) => `${(n / total) * 100}%`;

  return (
    <div className="space-y-8">
      <Bar label="Vibrant" color="bg-emerald-400" width={getW(dist.great)} count={dist.great} />
      <Bar label="Balanced" color="bg-amber-400" width={getW(dist.good)} count={dist.good} />
      <Bar label="Challenging" color="bg-rose-400" width={getW(dist.low)} count={dist.low} />
    </div>
  );
};

const Bar = ({ label, color, width, count }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
      <span>{label}</span>
      <span>{count} days</span>
    </div>
    <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded-full overflow-hidden shadow-inner">
      <div className={`h-full ${color} transition-all duration-1000 ease-out shadow-lg`} style={{ width }}></div>
    </div>
  </div>
);

export default InsightsTab;

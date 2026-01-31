
import React from 'react';
import { MoodEntry } from '../types';
import { getMoodData } from '../constants';

interface Props {
  entries: MoodEntry[];
}

const MoodHistory: React.FC<Props> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="glass rounded-3xl p-12 text-center shadow-xl flex flex-col items-center justify-center">
        <div className="text-6xl mb-6 opacity-30">☁️</div>
        <h3 className="text-xl font-bold text-gray-800">No entries yet</h3>
        <p className="text-gray-400 mt-2">Start your journey by logging your first mood!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
        <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">Last 7 Entries</span>
      </div>
      
      <div className="flex flex-col gap-4">
        {entries.map((entry) => {
          const data = getMoodData(entry.mood);
          const date = new Date(entry.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });

          return (
            <div 
              key={entry.timestamp}
              className="glass p-5 rounded-2xl flex items-center gap-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border-l-8 group"
              style={{ borderLeftColor: data.color }}
            >
              <div className="flex-shrink-0 text-3xl group-hover:scale-110 transition-transform">
                {data.emoji}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-gray-800 truncate">{date}</span>
                  <span 
                    className="text-[10px] font-black px-2 py-0.5 rounded-full text-white uppercase"
                    style={{ backgroundColor: data.color }}
                  >
                    Score: {entry.mood}
                  </span>
                </div>
                <p className="text-sm text-gray-500 italic truncate">
                  {entry.note ? `"${entry.note}"` : 'No thoughts recorded'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoodHistory;


import { MoodData } from './types';

export const MOOD_MAP: Record<number, MoodData> = {
  1: { emoji: '😢', color: '#EF4444', label: 'Very Low' },
  2: { emoji: '😢', color: '#F87171', label: 'Low' },
  3: { emoji: '😢', color: '#FCA5A5', label: 'Down' },
  4: { emoji: '😐', color: '#FACC15', label: 'Meh' },
  5: { emoji: '😐', color: '#FDE047', label: 'Neutral' },
  6: { emoji: '😐', color: '#FEF08A', label: 'Okay' },
  7: { emoji: '🙂', color: '#4ADE80', label: 'Good' },
  8: { emoji: '🙂', color: '#22C55E', label: 'Great' },
  9: { emoji: '😄', color: '#16A34A', label: 'Excellent' },
  10: { emoji: '😄', color: '#15803D', label: 'Amazing' },
};

export const getMoodData = (mood: number): MoodData => {
  return MOOD_MAP[Math.round(mood)] || MOOD_MAP[5];
};

export const STORAGE_KEY = 'moodEntries';

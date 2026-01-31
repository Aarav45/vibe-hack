
import React, { useState, useEffect, useMemo } from 'react';
import { MoodEntry, TabType, User } from './types';
import { STORAGE_KEY } from './constants';
import { authService } from './services/authService';
import TrackerTab from './components/TrackerTab';
import DashboardTab from './components/DashboardTab';
import ChatbotTab from './components/ChatbotTab';
import InsightsTab from './components/InsightsTab';
import ResourcesTab from './components/ResourcesTab';
import AuthScreen from './components/AuthScreen';
import ProfileScreen from './components/ProfileScreen';
import ExploreTab from './components/ExploreTab';

const THEME_KEY = 'health2080Theme_v2';
const ONBOARDING_KEY = 'health2080_onboarded_v2';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('tracker');
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    // Load User Session
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Load Data (Filter by user if logged in)
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { 
        const allEntries: MoodEntry[] = JSON.parse(saved);
        if (currentUser) {
          setEntries(allEntries.filter(e => e.userId === currentUser.id));
        } else {
          setEntries(allEntries);
        }
      } catch (e) { console.error(e); }
    }

    // Load Theme
    const savedTheme = localStorage.getItem(THEME_KEY);
    const initialDark = savedTheme === 'dark';
    setIsDark(initialDark);
    if (initialDark) document.documentElement.classList.add('dark');

    // Load Onboarding State
    const onboardingComplete = localStorage.getItem(ONBOARDING_KEY);
    if (!onboardingComplete) {
      setShowOnboarding(true);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem(ONBOARDING_KEY, 'true');
  };

  const resetTutorial = () => {
    setShowOnboarding(true);
    setOnboardingStep(0);
    setActiveTab('tracker');
  };

  const saveEntry = (mood: number, note: string, source: 'ai-vision' | 'manual' = 'manual') => {
    const newEntry: MoodEntry = {
      date: new Date().toISOString().split('T')[0],
      mood,
      note,
      timestamp: Date.now(),
      detectionMethod: source,
      userId: user?.id
    };
    
    // Save to all entries but filter for display
    const saved = localStorage.getItem(STORAGE_KEY);
    const allEntries = saved ? JSON.parse(saved) : [];
    const updatedAll = [...allEntries, newEntry];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAll));
    
    setEntries(prev => [...prev, newEntry]);
    setActiveTab('dashboard');
  };

  const clearData = () => {
    if (confirm("Permanently delete your wellbeing records?")) {
      const saved = localStorage.getItem(STORAGE_KEY);
      const allEntries = saved ? JSON.parse(saved) : [];
      const filtered = allEntries.filter((e: any) => e.userId !== user?.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      setEntries([]);
    }
  };

  const stats = useMemo(() => {
    const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp);
    const avg7 = entries.length > 0 
      ? parseFloat((entries.slice(-7).reduce((acc, e) => acc + e.mood, 0) / Math.min(7, entries.length)).toFixed(1))
      : 0;
    
    let streak = 0;
    const dates = new Set(entries.map(e => e.date));
    let current = new Date();
    while (dates.has(current.toISOString().split('T')[0])) {
      streak++;
      current.setDate(current.getDate() - 1);
    }

    return { 
      avg7, 
      streak, 
      recent: sorted.slice(0, 7),
      total: entries.length,
      today: entries.find(e => e.date === new Date().toISOString().split('T')[0])?.mood
    };
  }, [entries]);

  if (!user) {
    return <AuthScreen onAuthSuccess={() => {
      const u = authService.getCurrentUser();
      setUser(u);
      // Reload entries for the new user
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && u) {
        setEntries(JSON.parse(saved).filter((e: any) => e.userId === u.id));
      }
    }} />;
  }

  return (
    <div className={`min-h-screen pb-16 transition-colors duration-1000 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#fdfcff] text-slate-800'}`}>
      
      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingOverlay 
          step={onboardingStep} 
          setStep={setOnboardingStep} 
          onComplete={completeOnboarding} 
        />
      )}

      {/* Hero Header */}
      <header className="hero-gradient pt-24 pb-40 text-center px-4 relative overflow-hidden">
        {/* Profile Circle Top Right */}
        <div className="absolute top-8 right-8 flex items-center gap-4 z-50">
          <button onClick={toggleTheme} className="p-4 rounded-3xl bg-white/10 hover:bg-white/20 transition-all text-white border border-white/10 backdrop-blur-xl">
            {isDark ? '☀️' : '🌙'}
          </button>
          <div className="relative">
            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-14 h-14 hero-gradient rounded-full flex items-center justify-center text-xl font-black text-white border-4 border-white/20 shadow-2xl hover:scale-110 transition-transform">
              {user.fullName.split(' ').map(n => n[0]).join('')}
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-4 w-64 glass-card p-4 shadow-2xl animate-fade-in border-white/30 !bg-white/90 dark:!bg-slate-900/90 text-left">
                <div className="pb-4 border-b border-slate-100 dark:border-slate-800 mb-4 px-2">
                  <p className="font-black text-slate-800 dark:text-white truncate">{user.fullName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.city}, {user.state}</p>
                </div>
                <button onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }} className="w-full text-left py-3 px-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 transition-colors">
                  👤 View Profile
                </button>
                <button onClick={() => { authService.logout(); window.location.reload(); }} className="w-full text-left py-3 px-4 rounded-2xl hover:bg-rose-50 text-sm font-bold text-rose-500 transition-colors mt-2">
                  🚪 Log Out
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
          <div className={`absolute -top-20 -left-20 w-96 h-96 rounded-full blur-[140px] animate-pulse ${isDark ? 'bg-indigo-600/20' : 'bg-white/50'}`}></div>
          <div className={`absolute -bottom-20 -right-20 w-[30rem] h-[30rem] rounded-full blur-[160px] ${isDark ? 'bg-pink-900/10' : 'bg-pink-100/30'}`}></div>
        </div>
        
        <h1 className="text-7xl md:text-9xl font-bold text-white mb-8 tracking-tighter drop-shadow-2xl">20/80 Health</h1>
        <p className="text-white/80 text-xl md:text-3xl font-light max-w-4xl mx-auto drop-shadow-sm tracking-wide leading-relaxed">
          The essential sanctuary for mindful mental performance.
        </p>
      </header>

      {/* Navigation */}
      <main className="container max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <nav className="glass-card mb-12 p-3 flex flex-wrap justify-center gap-2 md:gap-4 shadow-2xl">
          <TabButton active={activeTab === 'tracker'} onClick={() => setActiveTab('tracker')} icon="📊" label="Tracker" isDark={isDark} />
          <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon="📈" label="Analysis" isDark={isDark} />
          <TabButton active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} icon="🌟" label="Explore" isDark={isDark} />
          <TabButton active={activeTab === 'chatbot'} onClick={() => setActiveTab('chatbot')} icon="💬" label="Companion" isDark={isDark} />
          <TabButton active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} icon="🔍" label="Intelligence" isDark={isDark} />
          <TabButton active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} icon="🆘" label="Resources" isDark={isDark} />
        </nav>

        {/* Dynamic Content Area */}
        <div className="animate-fade-in min-h-[500px]">
          {activeTab === 'tracker' && <TrackerTab stats={stats} onSave={saveEntry} />}
          {activeTab === 'dashboard' && <DashboardTab stats={stats} onClear={clearData} />}
          {activeTab === 'explore' && <ExploreTab user={user} />}
          {activeTab === 'chatbot' && <ChatbotTab recentEntries={stats.recent} />}
          {activeTab === 'insights' && <InsightsTab entries={entries} stats={stats} />}
          {activeTab === 'resources' && <ResourcesTab user={user} onResetOnboarding={resetTutorial} />}
          {activeTab === 'profile' && <ProfileScreen user={user} onBack={() => setActiveTab('tracker')} onUpdate={() => setUser(authService.getCurrentUser())} stats={stats} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 text-center py-16 border-t border-slate-100 dark:border-slate-900/60">
        <p className="text-slate-400 dark:text-slate-600 font-bold tracking-widest uppercase text-xs mb-4">20/80 Health • Refined Wellbeing</p>
        <p className="text-slate-300 dark:text-slate-800 text-[10px] uppercase tracking-[0.5em] font-black">Private • Sovereign • Encrypted</p>
      </footer>
    </div>
  );
};

const OnboardingOverlay = ({ step, setStep, onComplete }: any) => {
  const slides = [
    { icon: '🏛️', title: '20/80 Health', description: 'The Pareto Principle for your mind. We focus on the 20% of habits that generate 80% of your emotional balance.' },
    { icon: '🧠', title: 'Gemini AI Insights', description: 'Powerful AI analysis tracks your mood fluctuations and provides clinical-grade wellbeing strategies tailored just for you.' },
    { icon: '🛡️', title: 'Ultimate Privacy', description: 'Your data is sovereign. 20/80 Health stores everything strictly on your local device. No clouds, no tracking, just sanctuary.' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-3xl animate-fade-in">
      <div className="glass-card max-w-xl w-full p-12 md:p-16 text-center relative overflow-hidden shadow-2xl border-white/20">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-100 dark:bg-slate-800">
          <div className="h-full hero-gradient transition-all duration-700 ease-out" style={{ width: `${((step + 1) / slides.length) * 100}%` }}></div>
        </div>
        <div className="text-8xl mb-10 transform transition-transform duration-700 hover:scale-110 drop-shadow-2xl">{slides[step].icon}</div>
        <h2 className="text-4xl font-bold mb-6 dark:text-white tracking-tighter">{slides[step].title}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xl leading-relaxed mb-12 font-medium">{slides[step].description}</p>
        <div className="flex gap-4">
          {step > 0 && <button onClick={() => setStep(s => s - 1)} className="flex-1 py-5 rounded-3xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">Back</button>}
          <button onClick={() => step < slides.length - 1 ? setStep(s => s + 1) : onComplete()} className="flex-[2] py-5 rounded-3xl font-bold text-white hero-gradient shadow-2xl hover:brightness-110 active:scale-95 transition-all">
            {step === slides.length - 1 ? 'Enter the Sanctuary' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label, isDark }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 group px-8 py-4 rounded-[2rem] font-black transition-all duration-500 whitespace-nowrap border
      ${active 
        ? (isDark ? 'bg-slate-800 text-brand-purple shadow-2xl scale-110 border-brand-purple/40' : 'bg-white text-brand-purple shadow-2xl scale-110 border-purple-500/10') 
        : (isDark ? 'text-slate-500 border-transparent hover:text-slate-200 hover:bg-slate-800/40' : 'text-slate-400 border-transparent hover:text-slate-800 hover:bg-white/60')}`}
  >
    <span className="text-2xl transition-transform duration-500 group-hover:scale-125">{icon}</span>
    <span className="hidden sm:inline uppercase text-[12px] tracking-widest">{label}</span>
  </button>
);

export default App;

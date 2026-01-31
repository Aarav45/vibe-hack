
import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '../services/geminiService';
import { ChatMessage, MoodEntry } from '../types';

interface Props {
  recentEntries: MoodEntry[];
}

const ChatbotTab: React.FC<Props> = ({ recentEntries }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'bot', text: "Hello! I'm your wellness companion. How's your heart feeling today?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const botText = await getChatbotResponse(input, messages, recentEntries);
    const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'bot', text: botText, timestamp: Date.now() };
    
    setIsTyping(false);
    setMessages(prev => [...prev, botMsg]);
  };

  return (
    <div className="glass-card flex flex-col h-[750px] overflow-hidden shadow-2xl relative border-none">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/30 dark:bg-slate-900/30">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 hero-gradient rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-brand-purple/20 dark:shadow-none">🤖</div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Wellness Companion</h2>
            <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Safe & Private
            </div>
          </div>
        </div>
        <div className="hidden lg:flex gap-3">
          <QuickTopicBtn onClick={() => setInput("I'm feeling stressed...")} label="😰 Stress" />
          <QuickTopicBtn onClick={() => setInput("Can we practice mindfulness?")} label="🧘 Mindfulness" />
        </div>
      </div>

      <div ref={scrollRef} className="flex-grow overflow-y-auto p-8 space-y-8 scroll-smooth bg-white/10 dark:bg-slate-950/10">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[80%] md:max-w-[70%] p-6 rounded-[2rem] shadow-sm text-lg leading-relaxed
              ${m.role === 'user' 
                ? 'hero-gradient text-white rounded-tr-none shadow-brand-purple/20' 
                : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700/50'}`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-3xl flex gap-2">
              <div className="w-2 h-2 bg-purple-400 dark:bg-purple-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 dark:bg-purple-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-purple-400 dark:bg-purple-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-white/40 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800">
        <div className="flex gap-4">
          <input 
            type="text" value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Share your thoughts..."
            className="flex-grow py-5 px-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-300 dark:focus:border-purple-500 focus:ring-8 focus:ring-purple-100 dark:focus:ring-purple-900/20 outline-none transition-all text-lg shadow-sm text-slate-800 dark:text-white dark:placeholder:text-slate-700"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="hero-gradient text-white px-8 rounded-3xl font-bold shadow-xl hover:brightness-110 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const QuickTopicBtn = ({ onClick, label }: any) => (
  <button onClick={onClick} className="px-5 py-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all border border-purple-100 dark:border-purple-900/40">
    {label}
  </button>
);

export default ChatbotTab;

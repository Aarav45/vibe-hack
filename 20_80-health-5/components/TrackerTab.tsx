
import React, { useState, useRef, useEffect } from 'react';
import { getMoodData } from '../constants';
import { analyzeMoodFromImage } from '../services/geminiService';

// Expose detection mode globally as requested
declare global {
  interface Window {
    currentDetectionMode: 'camera' | 'manual';
  }
}

interface Props {
  stats: any;
  onSave: (mood: number, note: string, source: 'ai-vision' | 'manual') => void;
}

const TrackerTab: React.FC<Props> = ({ stats, onSave }) => {
  const [mood, setMood] = useState(5);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [detectionMode, setDetectionMode] = useState<'camera' | 'manual'>('camera');
  
  // Camera States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const moodData = getMoodData(mood);

  // Sync detection mode with window variable
  useEffect(() => {
    window.currentDetectionMode = detectionMode;
  }, [detectionMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setError(null);
    try {
      const constraints = { 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setIsCameraActive(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(e => console.error("Play failed:", e));
          };
        }
      }, 150);
    } catch (err: any) {
      console.error("Camera access error:", err);
      setError("❌ Could not access camera. Please ensure camera permissions are granted.");
      setDetectionMode('manual');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureAndAnalyze = async () => {
    if (!isCameraActive) {
      await startCamera();
      return;
    }

    if (!videoRef.current || !canvasRef.current) return;

    setIsAnalyzing(true);
    setIsAccepted(false);
    setAnalysisResult(null);
    setError(null);

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Canvas context missing");
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const base64Image = dataUrl.split(',')[1];
      
      const result = await analyzeMoodFromImage(base64Image);
      console.log("AI Analysis Result:", result);
      
      setAnalysisResult(result);
      setMood(Math.round(result.mood));
      
      if (result.confidence < 50) {
        setError("⚠️ Low confidence in detection. Please adjust the score if needed.");
      }
    } catch (err: any) {
      console.error("Analysis pipeline failed:", err);
      setError("❌ Analysis failed. Please try again or switch to manual mode.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const acceptMood = () => {
    setIsAccepted(true);
    // Use an id that matches the one in our rendering below
    document.getElementById('deep-reflection-note')?.focus();
  };

  const retakePhoto = () => {
    setAnalysisResult(null);
    setIsAccepted(false);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (detectionMode === 'camera' && !analysisResult) {
      setError("⚠️ Please capture and analyze your mood first using the camera.");
      return;
    }

    setIsSaving(true);
    if (mood >= 9) triggerConfetti();
    
    setTimeout(() => {
      onSave(mood, note, detectionMode === 'camera' ? 'ai-vision' : 'manual');
      setIsSaving(false);
      setNote('');
      setAnalysisResult(null);
      setIsAccepted(false);
      stopCamera();
    }, 600);
  };

  const triggerConfetti = () => {
    const colors = ['#6B46C1', '#14B8A6', '#FF6B6B', '#FFA500', '#50C878', '#FFFFFF'];
    const count = 100;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'confetti';
      el.style.left = `${50 + (Math.random() - 0.5) * 20}vw`;
      el.style.bottom = '15vh';
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.width = `${Math.random() * 8 + 4}px`;
      el.style.height = `${Math.random() * 8 + 4}px`;
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '1px';
      el.style.zIndex = '1000';
      document.body.appendChild(el);
      el.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${(Math.random() - 0.5) * 800}px, ${-(400 + Math.random() * 600)}px) rotate(${Math.random() * 1080}deg)`, opacity: 0 }
      ], { duration: 2500, easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)', fill: 'forwards' }).onfinish = () => el.remove();
    }
  };

  const confidenceBadgeClass = analysisResult?.confidence > 80 ? 'badge-high' : analysisResult?.confidence > 50 ? 'badge-good' : 'badge-low';
  const confidenceColor = analysisResult?.confidence > 80 ? '#50C878' : analysisResult?.confidence > 50 ? '#7c3aed' : '#fb7185';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Mode Selector */}
      <div className="flex justify-center">
        <div className="glass-card p-1.5 flex gap-1 rounded-[2rem] shadow-xl border-white/40">
          <button 
            type="button"
            onClick={() => { setDetectionMode('camera'); stopCamera(); setAnalysisResult(null); setIsAccepted(false); setMood(5); }}
            className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${detectionMode === 'camera' ? 'hero-gradient text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
          >
            📸 AI Vision
          </button>
          <button 
            type="button"
            onClick={() => { setDetectionMode('manual'); stopCamera(); setAnalysisResult(null); setMood(5); }}
            className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${detectionMode === 'manual' ? 'hero-gradient text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
          >
            🎚️ Manual Entry
          </button>
        </div>
      </div>

      <section className="glass-card p-10 md:p-14 relative overflow-hidden bg-white/80 dark:bg-slate-900/80 transition-all duration-500">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-100 dark:bg-purple-900/10 rounded-full blur-3xl opacity-50"></div>
        
        <h2 className="text-3xl font-bold mb-10 text-slate-800 dark:text-white text-center">
          {detectionMode === 'camera' ? 'AI Facial Expression Analysis' : 'Log Your Mood Manually'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-12">
          {detectionMode === 'camera' && (
            <div className="flex flex-col items-center gap-10">
              {/* Webcam View Section */}
              <div className="relative w-full max-w-[500px] aspect-video rounded-[3rem] overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-2xl border-4 border-white/20 dark:border-slate-800 group">
                {!isCameraActive ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-900/50">
                    <div className="text-7xl mb-6 opacity-20">📷</div>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Vision System Ready</p>
                  </div>
                ) : (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                    {isAnalyzing && <div className="scanner-line"></div>}
                  </>
                )}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm flex flex-col items-center justify-center z-30 animate-fade-in">
                    <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin mb-4"></div>
                    <p className="text-white font-black uppercase tracking-[0.4em] text-[10px]">Scanning features...</p>
                  </div>
                )}
              </div>

              {!analysisResult && !isAnalyzing && (
                <button 
                  type="button" onClick={captureAndAnalyze}
                  className="px-12 py-5 rounded-[2.5rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl transition-all duration-300 flex items-center gap-4 hero-gradient text-white hover:scale-105 active:scale-95"
                >
                  {isCameraActive ? '📸 Capture & Analyze Mood' : '🎥 Start AI Vision'}
                </button>
              )}

              {/* Analysis Results Section */}
              {analysisResult && !isAnalyzing && (
                <div className="w-full max-w-[600px] detected-mood-card animate-fade-in border border-slate-100 dark:border-slate-800">
                  <div className="mood-header">
                    <span className="detected-emoji-large">{getMoodData(analysisResult.mood).emoji}</span>
                    <div className="flex-grow">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Emotion Detected</p>
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-white capitalize leading-tight">{analysisResult.emotion}</h3>
                      <div className="mood-score-display mt-1">{analysisResult.mood}<span className="text-base text-slate-400 font-medium tracking-normal">/10</span></div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="confidence-section">
                      <div className="confidence-header">
                        <span>Analysis Confidence: {analysisResult.confidence}%</span>
                        <span className={`confidence-badge ${confidenceBadgeClass}`}>
                          {analysisResult.confidence > 80 ? '✅ High' : analysisResult.confidence > 50 ? '✓ Good' : '⚠️ Low'}
                        </span>
                      </div>
                      <div className="confidence-bar">
                        <div className="confidence-fill" style={{ width: `${analysisResult.confidence}%`, backgroundColor: confidenceColor }}></div>
                      </div>
                    </div>

                    <div className="analysis-description">
                      <p className="text-slate-700 dark:text-slate-300"><strong>AI Insight:</strong> {analysisResult.description}</p>
                    </div>

                    <div className="facial-features-breakdown">
                      <p className="text-[10px] font-black uppercase text-brand-purple mb-4 tracking-widest">Facial Features Summary</p>
                      <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong className="text-slate-800 dark:text-slate-200">Eyes:</strong> {analysisResult.facialFeatures.eyes}</li>
                        <li><strong className="text-slate-800 dark:text-slate-200">Mouth:</strong> {analysisResult.facialFeatures.mouth}</li>
                        <li><strong className="text-slate-800 dark:text-slate-200">Tension:</strong> {analysisResult.facialFeatures.overallTension}</li>
                      </ul>
                    </div>

                    <div className="ai-suggestion-box">
                      <p className="text-sm text-brand-teal font-medium">💡 <strong>Personal Tip:</strong> {analysisResult.suggestions}</p>
                    </div>

                    {/* Low Confidence Emergency Slider */}
                    {analysisResult.confidence < 50 && (
                      <div className="low-confidence-warning">
                        <p className="text-xs font-black uppercase text-amber-700 dark:text-amber-500 mb-2">⚠️ Low Confidence Detected</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400/80 mb-6 leading-relaxed">
                          The AI is a bit uncertain. Please confirm the mood score with the slider below if it doesn't match your feelings.
                        </p>
                        <div className="emergency-slider">
                          <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block">Fine-tune Mood Score:</label>
                          <input type="range" min="1" max="10" value={mood} onChange={(e) => setMood(parseInt(e.target.value))} />
                          <div className="flex justify-between text-[10px] font-black mt-3 uppercase tracking-widest text-slate-400">
                            <span>Struggling</span>
                            <span className="text-xl text-brand-purple font-black">{mood}</span>
                            <span>Radiant</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Accept/Retake Action Buttons */}
                    {!isAccepted ? (
                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button type="button" onClick={acceptMood} className="btn-accept flex items-center justify-center gap-2">
                          <span>✅ Accept This Mood ({mood}/10)</span>
                        </button>
                        <button type="button" onClick={retakePhoto} className="btn-retake flex items-center justify-center gap-2">
                          <span>🔄 Retake Photo</span>
                        </button>
                      </div>
                    ) : (
                      <div className="confirmation-message animate-fade-in flex items-center gap-3">
                        <span className="text-2xl">🎉</span>
                        <span>Mood score accepted! Please add a note below if you wish.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Manual Mode View */}
          {detectionMode === 'manual' && (
            <div className="space-y-12 animate-fade-in">
              <div className="flex flex-col items-center gap-6">
                <div className="text-9xl transform hover:scale-110 transition-all duration-500 select-none" style={{ filter: `drop-shadow(0 0 35px ${moodData.color}66)` }}>
                  {moodData.emoji}
                </div>
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-6xl font-black text-slate-800 dark:text-white tabular-nums">{mood}</span>
                    <span className="text-slate-400 dark:text-slate-600 text-2xl font-bold">/10</span>
                  </div>
                  <p className="text-sm font-black uppercase tracking-[0.4em] mt-4" style={{ color: moodData.color }}>{moodData.label}</p>
                </div>
              </div>
              
              <div className="px-4">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Set Your Wellbeing Level</p>
                </div>
                <div className="relative h-2 flex items-center">
                  <div className="absolute w-full h-full bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                  <div className="absolute h-full rounded-full transition-all duration-300" style={{ width: `${(mood / 10) * 100}%`, backgroundColor: moodData.color }}></div>
                  <input type="range" min="1" max="10" value={mood} onChange={(e) => setMood(parseInt(e.target.value))} className="absolute w-full h-8 opacity-0 cursor-pointer z-10" />
                  <div className="absolute w-6 h-6 bg-white border-4 rounded-full shadow-lg pointer-events-none" style={{ left: `calc(${(mood / 10) * 100}% - 12px)`, borderColor: moodData.color }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-black text-slate-300 dark:text-slate-600 mt-8 px-1 uppercase tracking-widest">
                  <span>😢 Struggling</span><span>😐 Neutral</span><span>😄 Radiant</span>
                </div>
              </div>
            </div>
          )}

          {/* Shared Reflection Input */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] px-2">
              <label htmlFor="deep-reflection-note">Journal Note <span className="opacity-40">(Optional)</span></label>
              <span className={note.length > 180 ? 'text-rose-500' : ''}>{note.length}/200</span>
            </div>
            <textarea 
              id="deep-reflection-note" value={note} onChange={(e) => setNote(e.target.value.slice(0, 200))}
              placeholder="What context describes your energy today?"
              className="w-full h-40 p-8 rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-[16px] focus:ring-purple-100 dark:focus:ring-purple-900/10 transition-all outline-none text-lg text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-inner resize-none"
            />
          </div>

          {/* Form Errors */}
          {error && (
            <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold animate-pulse text-center leading-relaxed">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" disabled={isSaving || isAnalyzing || (detectionMode === 'camera' && !analysisResult)}
            className={`w-full py-6 rounded-[2.5rem] text-white font-black uppercase text-sm tracking-[0.4em] shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 relative group
              ${(isSaving || (detectionMode === 'camera' && !analysisResult)) ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-50' : 'hero-gradient hover:brightness-110 shadow-purple-200/50 dark:shadow-none'}`}
          >
            {isSaving ? (
              <span className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Committing Entry...
              </span>
            ) : (
              <><span className="text-xl">🛡️</span>Securely Save Reflection</>
            )}
          </button>
        </form>
      </section>

      {/* Stats Footprint */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard value={stats.today ? `${stats.today}/10` : '—'} label="Today" icon="💎" />
        <StatCard value={stats.avg7 || '—'} label="7D Avg" icon="🧿" />
        <StatCard value={stats.streak} label="Streak" icon="⚡" />
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

const StatCard = ({ value, label, icon }: any) => (
  <div className="glass-card p-8 flex items-center gap-6 border-l-[6px] border-brand-purple group hover:translate-y-[-4px] bg-white/60 dark:bg-slate-900/60">
    <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500">{icon}</div>
    <div>
      <div className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">{value}</div>
      <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-2">{label}</div>
    </div>
  </div>
);

export default TrackerTab;

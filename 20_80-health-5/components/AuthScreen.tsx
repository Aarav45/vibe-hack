
import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { psychiatristService, stateCityMap } from '../services/psychiatristService';

interface Props {
  onAuthSuccess: () => void;
}

const AuthScreen: React.FC<Props> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    city: '',
    state: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    if (formData.state) {
      setAvailableCities(stateCityMap[formData.state] || []);
    } else {
      setAvailableCities([]);
    }
  }, [formData.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    if (name === 'contactNumber') {
      const cleaned = ('' + value).replace(/\D/g, '').slice(0, 10);
      let formatted = cleaned;
      if (cleaned.length > 5) {
        formatted = cleaned.slice(0, 5) + ' ' + cleaned.slice(5);
      }
      setFormData({ ...formData, [name]: formatted });
      return;
    }

    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const result = authService.loginUser(formData.email, formData.password);
      if (typeof result === 'string') {
        setError(result);
      } else {
        onAuthSuccess();
      }
    } else {
      if (formData.fullName.length < 2) {
        setError("Name must be at least 2 characters.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (!formData.terms) {
        setError("You must agree to the terms.");
        return;
      }
      if (formData.contactNumber.replace(/\D/g, '').length !== 10) {
        setError("Please enter a valid 10-digit mobile number.");
        return;
      }
      if (!formData.state || !formData.city) {
        setError("Please select your state and city.");
        return;
      }

      const result = authService.createUserAccount({
        fullName: formData.fullName,
        email: formData.email,
        contactNumber: `+91 ${formData.contactNumber}`,
        city: formData.city,
        state: formData.state,
        password: formData.password
      });

      if (typeof result === 'string') {
        setError(result);
      } else {
        onAuthSuccess();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-brand-purple/20 to-brand-teal/20 animate-fade-in">
      <div className="glass-card max-w-lg w-full p-10 shadow-2xl border-white/40 bg-white/90 dark:bg-slate-900/90">
        <div className="text-center mb-10">
          <div className="w-20 h-20 hero-gradient rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl animate-bounce">🌊</div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Sanctuary'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {isLogin ? 'Resume your 20/80 wellbeing journey.' : 'Begin your journey to emotional balance.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-sm font-bold animate-pulse text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Alex Rivers" required />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">State</label>
                  <select 
                    name="state" 
                    value={formData.state} 
                    onChange={handleInputChange} 
                    className="w-full py-4 px-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700 outline-none focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all text-sm" 
                    required
                  >
                    <option value="">Select State</option>
                    {psychiatristService.getStates().map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">City</label>
                  <select 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                    className="w-full py-4 px-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700 outline-none focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all text-sm disabled:opacity-50" 
                    disabled={!formData.state}
                    required
                  >
                    <option value="">Select City</option>
                    {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+91</span>
                  <input 
                    name="contactNumber" 
                    value={formData.contactNumber} 
                    onChange={handleInputChange} 
                    placeholder="XXXXX XXXXX" 
                    className="w-full py-4 pl-16 pr-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700 outline-none focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all text-sm"
                    required 
                  />
                </div>
              </div>
            </>
          )}

          <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="alex@flow.com" required />
          <Input label="Password" type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" required />
          
          {!isLogin && (
            <div className="space-y-5">
              <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" required />
              <label className="flex items-center gap-3 px-2 cursor-pointer group">
                <input type="checkbox" name="terms" checked={formData.terms} onChange={handleInputChange} className="w-5 h-5 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-brand-purple focus:ring-0" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                  I agree to the Terms of Service & Privacy Policy.
                </span>
              </label>
            </div>
          )}

          <button type="submit" className="w-full py-5 rounded-3xl hero-gradient text-white font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:brightness-110 active:scale-95 transition-all mt-6">
            {isLogin ? 'Log In to Dashboard' : 'Create My Account'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-brand-purple font-black uppercase text-[11px] tracking-widest hover:underline">
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">{label}</label>
    <input className="w-full py-4 px-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700 outline-none focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all text-sm" {...props} />
  </div>
);

export default AuthScreen;

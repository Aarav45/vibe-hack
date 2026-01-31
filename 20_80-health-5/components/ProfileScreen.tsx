
import React, { useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { psychiatristService, stateCityMap } from '../services/psychiatristService';

interface Props {
  user: User;
  onBack: () => void;
  onUpdate: () => void;
  stats: any;
}

const ProfileScreen: React.FC<Props> = ({ user, onBack, onUpdate, stats }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user, password: '', confirmPassword: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMsg({ text: "Passwords don't match", type: 'error' });
      return;
    }

    const updatedUser: User = {
      ...user,
      fullName: formData.fullName,
      contactNumber: formData.contactNumber.startsWith('+91') ? formData.contactNumber : `+91 ${formData.contactNumber}`,
      city: formData.city,
      state: formData.state
    };

    if (formData.password) {
      updatedUser.password = btoa(formData.password);
    }

    authService.updateUser(updatedUser);
    setMsg({ text: "Profile updated successfully!", type: 'success' });
    setIsEditing(false);
    onUpdate();
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handleDelete = () => {
    if (confirm("Permanently delete your account? This cannot be undone.")) {
      authService.deleteAccount(user.id);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex items-center justify-between px-2">
        <button onClick={onBack} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-brand-purple flex items-center gap-2 group transition-colors">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
        </button>
        <button onClick={() => { authService.logout(); window.location.reload(); }} className="text-xs font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors">
          Log Out
        </button>
      </div>

      <div className="glass-card p-10 md:p-14 bg-white/80 dark:bg-slate-900/80 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-12 mb-14">
          <div className="relative group">
            <div className="w-32 h-32 hero-gradient rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl group-hover:scale-105 transition-transform">
              {user.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
              <span className="text-white text-[10px]">✓</span>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2">{user.fullName}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
              Mindful Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
              <ProfileBadge label="Location" value={`${user.city}, ${user.state}`} icon="📍" />
              <ProfileBadge label="Phone" value={user.contactNumber} icon="📱" />
            </div>
          </div>
        </div>

        {msg.text && (
          <div className={`mb-8 p-4 rounded-2xl text-sm font-bold text-center animate-bounce ${msg.type === 'error' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Wellbeing Impact</h3>
            <div className="grid grid-cols-2 gap-6">
              <StatCard label="Total Logs" value={stats.total} />
              <StatCard label="Current Streak" value={stats.streak} />
            </div>
            <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 shadow-inner">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Account Control</p>
              <div className="space-y-4">
                <button onClick={() => setIsEditing(true)} className="w-full py-4 rounded-2xl border-2 border-brand-purple text-brand-purple font-black uppercase text-[10px] tracking-widest hover:bg-brand-purple hover:text-white transition-all">
                  Change Credentials
                </button>
                <button onClick={handleDelete} className="w-full py-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 font-black uppercase text-[10px] tracking-widest hover:bg-rose-100 transition-all">
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="lg:col-span-2 space-y-8 bg-slate-50/30 dark:bg-slate-800/10 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Personal Information</h3>
              {isEditing && <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Editing Mode</span>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input label="Full Name" value={formData.fullName} onChange={(e: any) => setFormData({...formData, fullName: e.target.value})} disabled={!isEditing} icon="👤" />
              <Input label="Mobile Number" value={formData.contactNumber} onChange={(e: any) => setFormData({...formData, contactNumber: e.target.value})} disabled={!isEditing} icon="📱" />
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">State</label>
                <select 
                  value={formData.state} 
                  onChange={(e) => setFormData({...formData, state: e.target.value, city: ''})} 
                  disabled={!isEditing}
                  className="w-full py-4 px-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-800 outline-none focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all text-sm disabled:opacity-50"
                >
                  {psychiatristService.getStates().map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">City</label>
                <select 
                  value={formData.city} 
                  onChange={(e) => setFormData({...formData, city: e.target.value})} 
                  disabled={!isEditing || !formData.state}
                  className="w-full py-4 px-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-800 outline-none focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all text-sm disabled:opacity-50"
                >
                  <option value="">Select City</option>
                  {stateCityMap[formData.state]?.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {isEditing && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                  <Input label="New Password" type="password" value={formData.password} onChange={(e: any) => setFormData({...formData, password: e.target.value})} placeholder="New Password" icon="🔒" />
                  <Input label="Confirm New Password" type="password" value={formData.confirmPassword} onChange={(e: any) => setFormData({...formData, confirmPassword: e.target.value})} placeholder="Confirm Password" icon="🔒" />
                </div>
              )}
            </div>

            <div className="pt-6">
              {!isEditing ? (
                <button type="button" onClick={() => setIsEditing(true)} className="w-full py-5 rounded-3xl hero-gradient text-white font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] transition-all">
                  Edit My Details
                </button>
              ) : (
                <div className="flex gap-4">
                  <button type="button" onClick={() => { setIsEditing(false); setFormData({...user, password: '', confirmPassword: ''}); }} className="flex-1 py-5 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">
                    Cancel
                  </button>
                  <button type="submit" className="flex-[2] py-5 rounded-3xl hero-gradient text-white font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] transition-all">
                    Update Profile
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ProfileBadge = ({ label, value, icon }: any) => (
  <div className="flex items-center gap-3 bg-slate-50/80 dark:bg-slate-800/60 px-5 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
    <span className="text-xl">{icon}</span>
    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{value}</span>
  </div>
);

const StatCard = ({ label, value }: any) => (
  <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 text-center hover:scale-105 transition-all">
    <p className="text-4xl font-black text-brand-purple mb-2 tabular-nums">{value}</p>
    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</p>
  </div>
);

const Input = ({ label, icon, ...props }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30">{icon}</span>}
      <input className={`w-full py-4 ${icon ? 'pl-14' : 'px-6'} pr-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-800 outline-none focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all text-sm disabled:opacity-50`} {...props} />
    </div>
  </div>
);

export default ProfileScreen;

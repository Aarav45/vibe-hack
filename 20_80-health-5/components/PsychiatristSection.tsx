
import React, { useState, useEffect } from 'react';
import { psychiatristService, stateCityMap } from '../services/psychiatristService';
import { Psychiatrist, User } from '../types';

interface Props {
  user: User;
}

const PsychiatristSection: React.FC<Props> = ({ user }) => {
  const [psychiatrists, setPsychiatrists] = useState<Psychiatrist[]>([]);
  const [isChanging, setIsChanging] = useState(false);
  const [tempLocation, setTempLocation] = useState({ city: user.city, state: user.state });

  useEffect(() => {
    setPsychiatrists(psychiatristService.loadLocalPsychiatrists(user.city));
  }, [user.city]);

  const handleLocationChange = () => {
    const results = psychiatristService.loadLocalPsychiatrists(tempLocation.city);
    setPsychiatrists(results);
    setIsChanging(false);
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Search & Location Header */}
      <div className="glass-card p-10 bg-white/40 dark:bg-slate-900/40 border-l-[16px] border-brand-indigo shadow-2xl relative overflow-hidden">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-inner animate-pulse">
              🩺
            </div>
            <div>
              <h3 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Psychiatrist Finder</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed max-w-lg italic">
                Connect with the finest mental health professionals in your vicinity for personalized clinical care.
              </p>
              
              <div className="flex items-center gap-3 mt-6">
                <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 px-5 py-2.5 rounded-full border-2 border-brand-indigo shadow-lg group">
                  <span className="text-xl group-hover:rotate-12 transition-transform">📍</span>
                  {!isChanging ? (
                    <>
                      <span className="text-sm font-black uppercase tracking-widest text-brand-indigo">{tempLocation.city}, {tempLocation.state}</span>
                      <button 
                        onClick={() => setIsChanging(true)} 
                        className="text-[11px] font-black uppercase text-slate-400 hover:text-brand-indigo transition-all ml-2 underline underline-offset-4 decoration-2"
                      >
                        Change
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3 animate-fade-in">
                      <select 
                        value={tempLocation.state} 
                        onChange={e => setTempLocation({state: e.target.value, city: ''})} 
                        className="px-4 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-700 text-xs font-bold border-none outline-none focus:ring-2 focus:ring-indigo-300"
                      >
                        <option value="">State</option>
                        {psychiatristService.getStates().map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <select 
                        value={tempLocation.city} 
                        onChange={e => setTempLocation({...tempLocation, city: e.target.value})} 
                        className="px-4 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-700 text-xs font-bold border-none outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
                        disabled={!tempLocation.state}
                      >
                        <option value="">City</option>
                        {stateCityMap[tempLocation.state]?.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <button onClick={handleLocationChange} className="px-5 py-1.5 bg-brand-indigo text-white rounded-xl text-[10px] font-black uppercase shadow-lg hover:scale-105 active:scale-95 transition-all">
                        Update
                      </button>
                      <button onClick={() => setIsChanging(false)} className="text-[10px] font-black uppercase text-slate-400">Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Psychiatrists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {psychiatrists.length > 0 ? (
          psychiatrists.map(psy => (
            <PsychiatristCard key={psy.id} psy={psy} />
          ))
        ) : (
          <div className="col-span-full py-32 text-center glass-card border-dashed bg-slate-50/30 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-6xl mb-8 grayscale opacity-40">
              🔭
            </div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-lg">No specialists found in {tempLocation.city}.</p>
            <p className="text-slate-300 dark:text-slate-600 text-xs uppercase tracking-widest mt-4">
              We are expanding our network across India. Try searching for a neighboring Tier-1 city.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const PsychiatristCard = ({ psy }: { psy: Psychiatrist }) => {
  return (
    <div className="glass-card p-10 border-l-[12px] border-brand-purple bg-white/80 dark:bg-slate-900/80 hover:translate-y-[-12px] hover:shadow-3xl transition-all duration-700 group relative">
      {/* Status Badge Top Right */}
      <div className="absolute top-8 right-8 flex flex-col items-end gap-2">
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2
          ${psy.acceptingNewPatients 
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
            : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
          <span className={`w-2 h-2 rounded-full ${psy.acceptingNewPatients ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
          {psy.acceptingNewPatients ? 'Accepting Patients' : 'Waitlist Only'}
        </div>
        <div className="text-[11px] font-black text-brand-purple uppercase tracking-[0.2em] bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-lg">
          {psy.consultationFee} / Session
        </div>
      </div>

      {/* Profile Header */}
      <div className="mb-8">
        <div className="w-16 h-16 bg-brand-purple/10 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner group-hover:rotate-6 transition-transform">
          👨‍⚕️
        </div>
        <h4 className="text-3xl font-black text-slate-800 dark:text-white leading-tight mb-2 group-hover:text-brand-purple transition-colors">
          {psy.name}
        </h4>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-black text-brand-purple uppercase tracking-widest border-2 border-brand-purple/20 px-4 py-1 rounded-xl bg-white dark:bg-slate-800">
            {psy.specialty}
          </span>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {psy.qualifications}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <MetricBox icon="⭐" value={psy.rating.toString()} label="Rating" />
        <MetricBox icon="📈" value={psy.experience.split(' ')[0]} label="Yrs Exp" />
        <MetricBox icon="🗓️" value={psy.availableDays.split('-')[1] || 'Sat'} label="Avail" />
      </div>

      {/* Detailed Info List */}
      <div className="space-y-5 mb-12">
        <IconDetailRow icon="🏢" label="Medical Institution" value={psy.hospitalAffiliation || 'Private Consultation'} />
        <IconDetailRow icon="📍" label="Clinic Location" value={psy.address} />
        <IconDetailRow icon="🗣️" label="Languages Offered" value={psy.languages.join(', ')} />
      </div>

      {/* Action Footer */}
      <div className="flex gap-4 pt-8 border-t border-slate-100 dark:border-slate-800">
        <a 
          href={`tel:${psy.contactNumber.replace(/\s/g, '')}`} 
          className="flex-[2] py-5 rounded-[2rem] bg-emerald-500 text-white flex items-center justify-center gap-4 hover:brightness-110 hover:scale-[1.02] transition-all shadow-xl shadow-emerald-200/50 dark:shadow-none font-black uppercase text-xs tracking-widest group/btn"
        >
          <span className="text-lg group-hover/btn:rotate-12 transition-transform">📞</span> Call Now
        </a>
        <a 
          href={`mailto:${psy.email}?subject=Wellbeing Inquiry via 20/80 Health&body=Hello ${psy.name}, I found your profile on the 20/80 Health tracker and would like to inquire about a consultation.`} 
          className="flex-1 py-5 rounded-[2rem] border-2 border-brand-purple text-brand-purple flex items-center justify-center gap-4 hover:bg-brand-purple hover:text-white transition-all font-black uppercase text-xs tracking-widest group/btn"
        >
          <span className="text-lg group-hover/btn:scale-110 transition-transform">📧</span> Email
        </a>
      </div>
    </div>
  );
};

const MetricBox = ({ icon, value, label }: any) => (
  <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-[2.5rem] text-center border border-slate-100 dark:border-slate-800 shadow-inner group-hover:border-brand-purple/20 transition-all">
    <p className="text-2xl font-black text-brand-purple mb-1 tabular-nums">{icon} {value}</p>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
  </div>
);

const IconDetailRow = ({ icon, label, value }: any) => (
  <div className="flex items-start gap-5">
    <div className="w-10 h-10 flex-shrink-0 bg-white/50 dark:bg-slate-800/50 rounded-xl flex items-center justify-center text-xl shadow-sm grayscale group-hover:grayscale-0 transition-all group-hover:bg-white dark:group-hover:bg-slate-800">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm text-slate-700 dark:text-slate-300 font-bold leading-relaxed truncate">{value}</p>
    </div>
  </div>
);

export default PsychiatristSection;

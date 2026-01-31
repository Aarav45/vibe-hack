
import React, { useState, useEffect } from 'react';
import { User, Place, CityPlacesData } from '../types';
import { placesService } from '../services/placesService';

interface Props {
  user: User;
}

type Category = 'parks' | 'cinemas' | 'events' | 'sightseeing';

const ExploreTab: React.FC<Props> = ({ user }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('parks');
  const [cityData, setCityData] = useState<CityPlacesData | null>(null);

  useEffect(() => {
    const data = placesService.loadLocalPlaces(user.city);
    setCityData(data);
  }, [user.city]);

  if (!cityData) {
    return (
      <div className="animate-fade-in space-y-8">
        <div className="glass-card p-12 text-center border-dashed bg-slate-50/50">
          <span className="text-6xl mb-6 block opacity-20">🔍</span>
          <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
            We're still building our database for {user.city}
          </p>
          <p className="text-slate-300 dark:text-slate-600 text-[10px] uppercase tracking-widest mt-3">
            Visiting new places can boost your mood. Check back soon for local gems!
          </p>
        </div>
      </div>
    );
  }

  const currentPlaces = cityData[activeCategory] || [];

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="glass-card p-10 bg-white/60 dark:bg-slate-900/40 border-l-[12px] border-brand-teal shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <span className="text-5xl animate-bounce">🌟</span>
            <div>
              <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Discover Your City</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Exploring new surroundings can reduce stress and elevate your spirits.</p>
              <div className="flex items-center gap-2 mt-4">
                <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-full border-2 border-brand-teal flex items-center gap-2 shadow-sm">
                  <span className="text-slate-400">📍</span>
                  <span className="text-xs font-black uppercase tracking-widest text-brand-teal">{user.city}, {user.state}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 overflow-x-auto pb-2 scrollbar-hide">
        <CategoryTab 
          active={activeCategory === 'parks'} 
          onClick={() => setActiveCategory('parks')} 
          label="Parks & Gardens" 
          icon="🌳" 
        />
        <CategoryTab 
          active={activeCategory === 'cinemas'} 
          onClick={() => setActiveCategory('cinemas')} 
          label="Cinemas & Theaters" 
          icon="🎬" 
        />
        <CategoryTab 
          active={activeCategory === 'events'} 
          onClick={() => setActiveCategory('events')} 
          label="Concerts & Events" 
          icon="🎵" 
        />
        <CategoryTab 
          active={activeCategory === 'sightseeing'} 
          onClick={() => setActiveCategory('sightseeing')} 
          label="Sightseeing" 
          icon="🏛️" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentPlaces.length > 0 ? (
          currentPlaces.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))
        ) : (
          <div className="col-span-full py-24 text-center glass-card border-dashed bg-slate-50/50">
            <span className="text-4xl mb-4 block opacity-30">🍃</span>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No entries in this category for {user.city} yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryTab = ({ active, onClick, label, icon }: any) => (
  <button 
    onClick={onClick}
    className={`px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-3 whitespace-nowrap shadow-lg
      ${active 
        ? 'hero-gradient text-white scale-105' 
        : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-brand-purple hover:bg-slate-50 dark:hover:bg-slate-700'}`}
  >
    <span className="text-xl">{icon}</span>
    {label}
  </button>
);

const PlaceCard = ({ place }: { place: Place }) => {
  return (
    <div className="glass-card bg-white dark:bg-slate-900/60 p-8 border-l-[8px] border-brand-purple hover:translate-y-[-10px] transition-all duration-500 group shadow-lg flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
          {place.image}
        </div>
        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-xl border border-amber-100 dark:border-amber-900/40">
          <span className="text-xs">⭐</span>
          <span className="text-xs font-black text-amber-600 dark:text-amber-500">{place.rating}</span>
        </div>
      </div>

      <div className="flex-grow">
        <h4 className="text-2xl font-black text-slate-800 dark:text-white leading-tight mb-3 group-hover:text-brand-purple transition-colors">
          {place.name}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium leading-relaxed italic">
          "{place.description}"
        </p>

        <div className="space-y-4 mb-8">
          <DetailRow icon="📍" label="Location" value={place.address} />
          {place.timings && <DetailRow icon="🕒" label="Timings" value={place.timings} />}
          {place.entryFee && <DetailRow icon="💰" label="Entry Fee" value={place.entryFee} />}
          {place.ticketRange && <DetailRow icon="🎫" label="Tickets" value={place.ticketRange} />}
          {/* Display upcoming events if present */}
          {place.upcomingEvents && <DetailRow icon="📅" label="Events" value={place.upcomingEvents} />}
        </div>

        {(place.highlights || place.amenities) && (
          <div className="flex flex-wrap gap-2 mb-8">
            {/* Display chips for either highlights or amenities */}
            {(place.highlights || place.amenities)?.map((h, i) => (
              <span key={i} className="text-[9px] font-black uppercase tracking-widest bg-brand-purple/5 text-brand-purple px-2.5 py-1 rounded-lg border border-brand-purple/10">
                {h}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
        {/* Only show maps button if link is available */}
        {place.googleMapsLink && (
          <button 
            onClick={() => window.open(place.googleMapsLink, '_blank')}
            className="flex-[2] py-4 rounded-2xl bg-emerald-500 text-white flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-lg shadow-emerald-200/50 dark:shadow-none font-black uppercase text-[10px] tracking-widest"
          >
            <span>📍</span> View on Map
          </button>
        )}
        {place.website && place.website !== 'N/A' && (
          <button 
            onClick={() => window.open(place.website, '_blank')}
            className="flex-1 py-4 rounded-2xl border-2 border-brand-purple text-brand-purple flex items-center justify-center gap-3 hover:bg-brand-purple hover:text-white transition-all font-black uppercase text-[10px] tracking-widest"
          >
            <span>🌐</span> Site
          </button>
        )}
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value }: any) => (
  <div className="flex items-start gap-3">
    <span className="text-sm grayscale group-hover:grayscale-0 transition-all opacity-60">{icon}</span>
    <div className="min-w-0">
      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-bold leading-relaxed truncate">{value}</p>
    </div>
  </div>
);

export default ExploreTab;

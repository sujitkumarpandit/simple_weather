import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, X, Heart } from 'lucide-react';
import { useWeatherStore } from '../store/useWeatherStore';

export function SavedLocations() {
  const { favorites, toggleFavorite, fetchWeather, currentWeather } = useWeatherStore();

  if (favorites.length === 0) return null;

  return (
    <div className="dashboard-card p-6 h-full flex flex-col bg-slate-900/40">
      <div className="flex items-center gap-3 px-2 border-b border-white/5 pb-4 mb-4">
        <div className="w-1.5 h-1.5 rounded-sm bg-white/20 rotate-45" />
        <h3 className="mission-text italic uppercase">Monitoring Stations</h3>
      </div>
      
      <div className="flex flex-col gap-1">
        {favorites.map((loc) => {
          const isActive = currentWeather?.name.toLowerCase().includes(loc.name.toLowerCase());
          
          return (
            <motion.div 
              key={`${loc.lat}-${loc.lon}`}
              whileHover={{ x: 4 }}
              className={`p-4 rounded-xl flex items-center justify-between group transition-all duration-300 cursor-pointer ${
                isActive ? 'bg-white/[0.03] border border-white/10' : 'hover:bg-white/[0.02] border border-transparent'
              }`}
              onClick={() => fetchWeather(loc.lat, loc.lon)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-1.5 rounded bg-white/5 font-mono text-[9px] uppercase tracking-tighter ${isActive ? 'text-sky-400' : 'text-white/20'}`}>
                  {isActive ? 'Active' : 'Standby'}
                </div>
                <div>
                  <p className="text-sm font-medium tracking-tight text-white/90">{loc.name}</p>
                  <p className="font-mono text-[8px] text-white/20 uppercase tracking-[0.2em]">{loc.country}</p>
                </div>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(loc);
                }}
                className="p-2 rounded hover:bg-white/5 text-white/5 hover:text-white/40 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

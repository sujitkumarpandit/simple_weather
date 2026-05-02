import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { useWeatherStore } from '../store/useWeatherStore';
import { GeocodingResult } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const { searchLocation, fetchWeather, theme, toggleTheme } = useWeatherStore();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        const results = await searchLocation(query);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, searchLocation]);

  const handleSelect = (loc: GeocodingResult) => {
    fetchWeather(loc.lat, loc.lon);
    setQuery('');
    setSuggestions([]);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        fetchWeather(pos.coords.latitude, pos.coords.longitude);
      });
    }
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 px-2 md:px-4 py-4 md:py-6">
      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-6">
        {/* Dark Mode Toggle */}
        <div className="flex flex-col items-center gap-1 min-w-[70px]">
          <div 
            onClick={toggleTheme}
            className={`w-14 h-7 rounded-full relative p-1 cursor-pointer transition-colors duration-300 ${theme === 'dark' ? 'bg-white/20' : 'bg-black/20'}`}
          >
             <motion.div 
               animate={{ x: theme === 'dark' ? 28 : 0 }}
               transition={{ type: "spring", stiffness: 500, damping: 30 }}
               className={`w-5 h-5 rounded-full shadow-md ${theme === 'dark' ? 'bg-white' : 'bg-white'}`} 
             />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-tighter mt-1 transition-colors ${theme === 'dark' ? 'text-white' : 'text-black/60'}`}>
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </div>
      </div>

      {/* Pill Search */}
      <div className="flex-1 w-full max-w-2xl relative group">
        <div className={`rounded-full flex items-center px-6 md:px-8 py-3 md:py-3.5 shadow-inner transition-colors duration-300 ${theme === 'dark' ? 'bg-[#444444]' : 'bg-[#e0e0e0]'}`}>
          <Search className={`w-5 h-5 md:w-6 md:h-6 mr-3 md:mr-4 transition-colors ${theme === 'dark' ? 'text-white/40' : 'text-black/30'}`} />
          <Input
            placeholder="Search for your preferred city..."
            className={`bg-transparent border-none focus-visible:ring-0 h-8 p-0 text-base md:text-lg font-medium transition-colors ${theme === 'dark' ? 'text-white placeholder:text-white/30' : 'text-black placeholder:text-black/30'}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Suggestions list */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`absolute top-full left-0 right-0 mt-3 rounded-[30px] overflow-hidden shadow-2xl p-2 z-[100] border transition-colors ${theme === 'dark' ? 'bg-[#333333] border-white/5' : 'bg-[#f0f0f0] border-black/5'}`}
            >
              {suggestions.map((loc, i) => (
                <button
                  key={`${loc.lat}-${loc.lon}-${i}`}
                  onClick={() => handleSelect(loc)}
                  className={`w-full flex items-center gap-4 p-4 rounded-[20px] transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
                >
                  <MapPin className={`w-5 h-5 ${theme === 'dark' ? 'text-white/40' : 'text-black/30'}`} />
                  <div className="flex flex-col text-left">
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{loc.name}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>{loc.state ? `${loc.state}, ` : ''}{loc.country}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Green Location Button */}
      <button
        onClick={getUserLocation}
        className="btn-location hidden sm:flex items-center gap-3 whitespace-nowrap px-6 md:px-8 py-2.5 md:py-3 rounded-full bg-[#4ca12c] hover:bg-[#5db33a] text-white font-bold transition-all shadow-lg text-sm md:text-base"
      >
        <MapPin className="w-5 h-5" />
        Current Location
      </button>

      {/* Mobile Location Icon */}
      <button
        onClick={getUserLocation}
        className="sm:hidden p-3 rounded-full bg-[#4ca12c] text-white shadow-lg fixed bottom-6 right-6 z-[60]"
      >
        <MapPin className="w-6 h-6" />
      </button>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useWeatherStore } from '../store/useWeatherStore';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Droplets, Wind, Gauge, Compass, Sun, Moon } from 'lucide-react';
import { format } from 'date-fns';

export function CurrentWeather() {
  const { currentWeather, aqi, theme } = useWeatherStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentWeather) return null;

  const { name, main, weather, wind, sys } = currentWeather;
  const condition = weather[0].main;
  const iconCode = weather[0].icon;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 w-full">
      {/* Clock Card */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="lg:col-span-4 dashboard-card p-8 md:p-12 flex flex-col items-center justify-center text-center group"
      >
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 md:mb-6 uppercase tracking-wider group-hover:text-green-400 transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{name}</h2>
        <div className="flex flex-col items-center">
          <motion.span 
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`text-[80px] md:text-[120px] font-bold leading-none tracking-tight font-mono transition-colors ${theme === 'dark' ? 'text-white drop-shadow-2xl' : 'text-black'}`}
          >
            {format(currentTime, 'HH:mm')}
          </motion.span>
          <span className={`text-lg md:text-xl font-bold mt-2 md:mt-4 uppercase transition-colors ${theme === 'dark' ? 'text-white/50' : 'text-black/40'}`}>
            {format(currentTime, 'EEEE, d MMM')}
          </span>
        </div>
      </motion.div>

      {/* Main Weather Card */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="lg:col-span-8 dashboard-card p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12"
      >
        <div className="flex flex-col gap-6 md:gap-10 flex-1 w-full md:w-auto text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <motion.span 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`text-[80px] md:text-[120px] font-bold leading-none tracking-tighter transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'}`}
            >
              {Math.round(main.temp)}°C
            </motion.span>
            <span className={`text-lg md:text-xl font-bold md:ml-2 transition-colors ${theme === 'dark' ? 'text-white/50' : 'text-black/40'}`}>
              Feels like: <span className={theme === 'dark' ? 'text-white' : 'text-black'}>{Math.round(main.feels_like)}°C</span>
            </span>
          </div>

          <div className={`flex items-center justify-center md:justify-start gap-8 md:gap-10 mt-2 p-4 md:p-6 rounded-3xl transition-colors ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}>
             <div className="flex items-center gap-3">
               <ArrowUp className={`w-6 h-6 md:w-8 md:h-8 ${theme === 'dark' ? 'text-white/40' : 'text-black/30'}`} />
               <div className="flex flex-col text-left">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-black/30'}`}>Sunrise</span>
                  <span className={`text-xs md:text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{format(new Date(sys.sunrise * 1000), 'HH:mm')} AM</span>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <ArrowDown className={`w-6 h-6 md:w-8 md:h-8 ${theme === 'dark' ? 'text-white/40' : 'text-black/30'}`} />
               <div className="flex flex-col text-left">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-black/30'}`}>Sunset</span>
                  <span className={`text-xs md:text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{format(new Date(sys.sunset * 1000), 'HH:mm')} PM</span>
               </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 flex-1 pt-4">
          <motion.img 
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`} 
            alt={condition}
            className={`w-40 h-40 md:w-56 md:h-56 object-contain filter transition-all duration-500 ${theme === 'dark' ? 'drop-shadow-[0_20px_50px_rgba(255,255,255,0.2)]' : 'drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]'}`}
          />
          <h3 className={`text-3xl md:text-5xl font-bold uppercase tracking-wider transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{condition}</h3>
        </div>

        <div className="grid grid-cols-2 gap-x-8 md:gap-x-12 gap-y-8 md:gap-y-12 min-w-full md:min-w-[240px] pt-8 md:pt-0">
          {[
            { icon: <Droplets className={`w-10 h-10 ${theme === 'dark' ? 'text-white' : 'text-black/60'}`} />, value: `${main.humidity}%`, label: 'Humidity' },
            { icon: <Wind className={`w-10 h-10 ${theme === 'dark' ? 'text-white' : 'text-black/60'}`} />, value: `${Math.round(wind.speed)}km/h`, label: 'Wind Speed' },
            { icon: <Gauge className={`w-10 h-10 ${theme === 'dark' ? 'text-white' : 'text-black/60'}`} />, value: `${main.pressure}hPa`, label: 'Pressure' },
            { icon: <Compass className={`w-10 h-10 ${theme === 'dark' ? 'text-white' : 'text-black/60'}`} />, value: aqi?.list[0].main.aqi || 8, label: 'UV Index' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="p-2 rounded-full transition-colors">
                {stat.icon}
              </div>
              <span className={`text-lg font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{stat.value}</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-white/30' : 'text-black/30'}`}>{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

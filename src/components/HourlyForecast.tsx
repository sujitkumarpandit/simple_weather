import React from 'react';
import { useWeatherStore } from '../store/useWeatherStore';
import { format } from 'date-fns';
import { Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

export function HourlyForecast() {
  const { forecast, theme } = useWeatherStore();

  if (!forecast) return null;

  // Process the forecast data to get items for the horizontal cards
  const hourlyData = forecast.list.slice(0, 5);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card p-6 md:p-10 flex flex-col h-full"
    >
      <h3 className={`text-xl md:text-2xl font-bold mb-6 md:mb-10 text-center uppercase tracking-widest leading-loose ${theme === 'dark' ? 'text-white' : 'text-black/80'}`}>Hourly Forecast:</h3>
      
      <div className="flex items-center justify-between gap-4 md:gap-6 overflow-x-auto pb-4 px-2 md:px-4 scrollbar-hide">
        {hourlyData.map((hour, i) => (
          <motion.div 
            key={hour.dt} 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
            style={{ backgroundColor: 'var(--subcard-bg)' }}
            className="flex-1 rounded-[32px] md:rounded-[48px] p-6 md:p-10 flex flex-col items-center gap-4 md:gap-8 shadow-xl min-w-[140px] md:min-w-[160px] transition-transform"
          >
            <span className={`text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              {format(new Date(hour.dt * 1000), 'HH:mm')}
            </span>
            
            <motion.img 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
              src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`} 
              alt={hour.weather[0].main}
              className="w-16 h-16 md:w-20 md:h-20 object-contain filter drop-shadow-xl"
            />
            
            <span className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              {Math.round(hour.main.temp)}°C
            </span>
            
            <div className="flex flex-col items-center gap-2 md:gap-3">
               <motion.div 
                 animate={{ rotate: hour.wind.deg }}
                 className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center"
               >
                 <Navigation 
                   className="w-6 h-6 md:w-10 md:h-10 text-[#3b82f6] fill-[#3b82f6]" 
                 />
               </motion.div>
               <span className={`text-base md:text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{Math.round(hour.wind.speed)}km/h</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

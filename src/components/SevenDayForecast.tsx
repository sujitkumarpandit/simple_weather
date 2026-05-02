import React from 'react';
import { useWeatherStore } from '../store/useWeatherStore';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Sun, Moon, CloudSun, CloudMoon, Cloud, CloudRain, CloudLightning, CloudSnow, Wind } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  '01d': <Sun className="w-4 h-4" />,
  '01n': <Moon className="w-4 h-4" />,
  '02d': <CloudSun className="w-4 h-4" />,
  '02n': <CloudMoon className="w-4 h-4" />,
  '03d': <Cloud className="w-4 h-4" />,
  '03n': <Cloud className="w-4 h-4" />,
  '04d': <Cloud className="w-4 h-4" />,
  '04n': <Cloud className="w-4 h-4" />,
  '09d': <CloudRain className="w-4 h-4" />,
  '09n': <CloudRain className="w-4 h-4" />,
  '10d': <CloudRain className="w-4 h-4" />,
  '10n': <CloudRain className="w-4 h-4" />,
  '11d': <CloudLightning className="w-4 h-4" />,
  '11n': <CloudLightning className="w-4 h-4" />,
  '13d': <CloudSnow className="w-4 h-4" />,
  '13n': <CloudSnow className="w-4 h-4" />,
  '50d': <Wind className="w-4 h-4" />,
  '50n': <Wind className="w-4 h-4" />,
};

export function SevenDayForecast() {
  const { forecast, theme } = useWeatherStore();

  if (!forecast) return null;

  const dailyData = forecast.list.filter((f) => f.dt_txt.includes('12:00:00')).slice(0, 5);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="dashboard-card p-6 md:p-10 flex flex-col h-full"
    >
      <h3 className={`text-xl md:text-2xl font-bold mb-6 md:mb-10 pb-4 border-b flex items-center gap-4 transition-colors ${theme === 'dark' ? 'text-white border-white/10' : 'text-black border-black/10'}`}>
        <Calendar className={`w-6 h-6 md:w-8 md:h-8 transition-colors ${theme === 'dark' ? 'text-white/20' : 'text-black/20'}`} />
        5 Days Forecast:
      </h3>
      
      <div className="flex flex-col gap-6 md:gap-10">
        {dailyData.map((day, i) => (
          <motion.div 
            key={day.dt} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between group cursor-default"
          >
            <div className="flex items-center gap-4 md:gap-8">
              <motion.img 
                whileHover={{ rotate: 10, scale: 1.2 }}
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} 
                alt={day.weather[0].main}
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
              />
              <span className={`text-xl md:text-2xl font-bold min-w-[50px] md:min-w-[60px] transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                {Math.round(day.main.temp)}°C
              </span>
            </div>
            
            <span className={`text-lg md:text-xl font-medium transition-colors ${theme === 'dark' ? 'text-white/40 group-hover:text-white' : 'text-black/40 group-hover:text-black'}`}>
              {format(new Date(day.dt * 1000), 'EEEE, d MMM')}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

import React, { useEffect } from 'react';
import { useWeatherStore } from './store/useWeatherStore';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast';
import { SevenDayForecast } from './components/SevenDayForecast';
import { WeatherBackground } from './components/WeatherBackground';
import { TooltipProvider } from '../components/ui/tooltip';
import { Toaster } from '../components/ui/sonner';
import { Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function App() {
  const { fetchWeather, currentWeather, isLoading, theme } = useWeatherStore();

  useEffect(() => {
    const savedString = localStorage.getItem('weather_favorites');
    const saved = savedString ? JSON.parse(savedString) : [];
    if (saved.length > 0) {
       fetchWeather(saved[0].lat, saved[0].lon);
    } else {
       fetchWeather(40.7128, -74.0060);
    }
  }, [fetchWeather]);

  return (
    <TooltipProvider>
      <div 
        data-theme={theme}
        className={`min-h-screen relative overflow-hidden transition-colors duration-500 selection:bg-green-500/30 ${theme === 'dark' ? 'bg-[#2c2c2c] text-white' : 'bg-[#f5f5f5] text-black'}`}
      >
        <WeatherBackground />
        
        <main className="relative z-10 w-full max-w-[1600px] mx-auto min-h-screen flex flex-col p-4 md:p-8 gap-6 md:gap-12">
          {/* Header Bar */}
          <SearchBar />

          {/* Top Row: Clock and Main Weather */}
          {currentWeather && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2
                  }
                }
              }}
              className="flex flex-col gap-8"
            >
              <motion.section
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <CurrentWeather />
              </motion.section>

              {/* Bottom Row: Forecasts */}
              <motion.section 
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch pb-12"
              >
                <div className="lg:col-span-4 h-full">
                  <SevenDayForecast />
                </div>
                <div className="lg:col-span-8 h-full">
                  <HourlyForecast />
                </div>
              </motion.section>
            </motion.div>
          )}

          {!currentWeather && !isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 opacity-40">
              <Compass className="w-20 h-20 animate-pulse" />
              <p className="text-xl font-bold uppercase tracking-widest">Initialising Grid...</p>
            </div>
          )}
        </main>
        
        <Toaster theme="dark" position="bottom-right" />
      </div>
    </TooltipProvider>
  );
}

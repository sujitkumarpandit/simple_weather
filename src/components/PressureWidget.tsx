import React from 'react';
import { motion } from 'framer-motion';
import { Gauge } from 'lucide-react';
import { useWeatherStore } from '../store/useWeatherStore';

export function PressureWidget() {
  const { currentWeather } = useWeatherStore();
  
  if (!currentWeather) return null;
  
  const pressure = currentWeather.main.pressure;
  
  const getPressureStatus = (p: number) => {
    if (p < 1000) return 'Depression Threshold';
    if (p > 1020) return 'Anticyclonic Stability';
    return 'Barometric Equilibrium';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="dashboard-card p-5 flex flex-col justify-between bg-[#0f172a]/40 group"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-sky-500/40" />
            <p className="mission-text italic text-[9px]">Barometric Delta</p>
          </div>
          <div className="w-1 h-1 rounded-full bg-sky-500/20" />
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-white data-value">{pressure}</p>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">mb</p>
        </div>
      </div>
      
      <div className="pt-4 border-t border-white/5 mt-4 space-y-2">
        <p className="text-[8px] text-white/40 font-mono uppercase tracking-[0.2em]">{getPressureStatus(pressure)}</p>
        <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
           <div 
            className="h-full bg-sky-500/40" 
            style={{ width: `${Math.min(Math.max((pressure - 950) / 100 * 100, 10), 100)}%` }} 
           />
        </div>
      </div>
    </motion.div>
  );
}

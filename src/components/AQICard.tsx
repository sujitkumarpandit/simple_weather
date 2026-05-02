import React from 'react';
import { useWeatherStore } from '../store/useWeatherStore';
import { Wind, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export function AQICard() {
  const { aqi } = useWeatherStore();

  if (!aqi) return null;

  const aqiValue = aqi.list[0].main.aqi;
  
  const getAQIInfo = (val: number) => {
    switch (val) {
      case 1: return { label: 'Good', color: 'bg-emerald-500', text: 'Air quality is satisfactory.' };
      case 2: return { label: 'Fair', color: 'bg-yellow-500', text: 'Moderate air quality.' };
      case 3: return { label: 'Moderate', color: 'bg-orange-500', text: 'Sensitive groups may be affected.' };
      case 4: return { label: 'Poor', color: 'bg-red-500', text: 'Health effects immediately felt.' };
      case 5: return { label: 'Very Poor', color: 'bg-purple-500', text: 'Emergency warning.' };
      default: return { label: 'Unknown', color: 'bg-gray-500', text: 'Data unavailable.' };
    }
  };

  const info = getAQIInfo(aqiValue);
  const progress = (aqiValue / 5) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card p-5 flex flex-col justify-between bg-[#0f172a]/40 group"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
             <Wind className="w-4 h-4 text-sky-500/40" />
            <p className="mission-text italic text-[9px]">Atmospheric Quality</p>
          </div>
          <div className="flex gap-1">
             {[1, 2, 3].map(i => (
               <div key={i} className={`w-1 h-1 rounded-full ${i <= aqiValue ? 'bg-sky-500/60' : 'bg-white/10'}`} />
             ))}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-white data-value">{aqiValue}</p>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{info.label}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
        <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full ${info.color} opacity-40`} 
          />
        </div>
        <p className="text-[8px] text-white/30 italic uppercase tracking-[0.1em] font-mono leading-relaxed">
          {info.text}
        </p>
      </div>
    </motion.div>
  );
}

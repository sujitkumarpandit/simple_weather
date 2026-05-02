import React from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Sunset, Moon, Sun } from 'lucide-react';
import { useWeatherStore } from '../store/useWeatherStore';
import { getMoonPhase, formatTime } from '../lib/astro';

export function SunMoonCard() {
  const { currentWeather } = useWeatherStore();
  
  if (!currentWeather) return null;
  
  const { sys } = currentWeather;
  const moonPhase = getMoonPhase(new Date());
  const now = Date.now() / 1000;
  
  // Calculate relative solar position
  const totalDaylight = sys.sunset - sys.sunrise;
  const elapsed = Math.max(0, Math.min(now - sys.sunrise, totalDaylight));
  const sunPos = (elapsed / totalDaylight) * 100;
  const isDay = now > sys.sunrise && now < sys.sunset;

  // SVG Arc Math: Semi-circle path
  // Center: (50, 80), Radius: 45
  // angle 180 (Sunrise) to 0 (Sunset)
  const angle = 180 - (sunPos * 1.8);
  const radians = (angle * Math.PI) / 180;
  const sunX = 50 + 45 * Math.cos(radians);
  const sunY = 80 - 45 * Math.sin(radians);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const timeRemaining = isDay ? sys.sunset - now : (now < sys.sunrise ? sys.sunrise - now : 86400 - (now - sys.sunrise));

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="dashboard-card p-6 min-h-[240px] flex flex-col justify-between relative overflow-hidden bg-[#0a1120]/60 glass-glow group"
    >
      <div className="scanline" />
      
      <div className="flex items-center justify-between relative z-10 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500/50 group-hover:text-amber-400 transition-colors">
            <Sun className="w-4 h-4" />
          </div>
          <p className="mission-text italic tracking-[0.3em] font-black">Celestial Dynamics</p>
        </div>
        <div className="text-[10px] font-mono text-white/10 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
           NODE: SOL-LUN
        </div>
      </div>

      {/* Visual Arc Area - Technical HUD Style */}
      <div className="relative h-32 mb-4 flex flex-col items-center justify-end overflow-hidden mt-2">
         <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
         
         <svg viewBox="0 0 100 100" className="w-full h-full mb-[-20px] drop-shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            {/* Background Arc - Technical Grid Lines */}
            <path 
              d="M 5 80 A 45 45 0 0 1 95 80" 
              fill="none" 
              stroke="rgba(255,255,255,0.03)" 
              strokeWidth="2" 
            />
            <path 
              d="M 5 80 A 45 45 0 0 1 95 80" 
              fill="none" 
              stroke="rgba(255,255,255,0.05)" 
              strokeWidth="0.5" 
              strokeDasharray="1 3" 
            />
            
            {/* Active Path with Technical Dash */}
            {isDay && (
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: sunPos / 100 }}
                transition={{ duration: 2, ease: "circOut" }}
                d="M 5 80 A 45 45 0 0 1 95 80" 
                fill="none" 
                stroke="url(#sunGradient)" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            )}

            <defs>
              <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(251,191,36,0.1)" />
                <stop offset="100%" stopColor="rgba(251,191,36,0.8)" />
              </linearGradient>
            </defs>

            {/* Glowing Sun Indicator */}
            {isDay && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                <circle cx={sunX} cy={sunY} r="2.5" className="fill-amber-400 shadow-[0_0_12px_rgba(251,191,36,1)]" />
                <circle cx={sunX} cy={sunY} r="6" className="fill-amber-400/10 animate-pulse" />
              </motion.g>
            )}
         </svg>

         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-10">
            <span className="text-4xl font-black text-white/90 tracking-tighter uppercase italic">{isDay ? 'Daylight' : 'Night'}</span>
            <div className="flex items-center gap-2 mt-1">
               <div className="w-1 h-1 rounded-full bg-sky-500 animate-pulse" />
               <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">
                  {isDay ? `REMAINING: ${formatDuration(timeRemaining)}` : `DAWN SEQUENCE: ${formatDuration(timeRemaining)}`}
               </span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10 bg-white/[0.02] p-3 rounded-xl border border-white/5">
        <div className="flex flex-col gap-1">
           <div className="flex items-center gap-2">
              <Sunrise className="w-3 h-3 text-amber-500/40" />
              <span className="mission-text text-[7px]">Sunrise</span>
           </div>
           <span className="font-mono text-lg font-black text-white/90 leading-none tracking-tighter">{formatTime(sys.sunrise)}</span>
        </div>
        <div className="flex flex-col gap-1 items-end">
           <div className="flex items-center gap-2">
              <span className="mission-text text-[7px]">Sunset</span>
              <Sunset className="w-3 h-3 text-orange-500/40" />
           </div>
           <span className="font-mono text-lg font-black text-white/90 leading-none tracking-tighter">{formatTime(sys.sunset)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
         <div className="flex items-center gap-3 group/moon cursor-pointer">
            <motion.div 
               whileHover={{ rotate: 15 }}
               className="text-2xl filter drop-shadow-lg"
            >
               {moonPhase.icon}
            </motion.div>
            <div className="flex flex-col">
               <span className="text-[10px] text-white/70 font-mono font-black uppercase tracking-tighter group-hover:text-sky-400 transition-colors">{moonPhase.name}</span>
               <span className="text-[7px] text-white/20 uppercase font-black tracking-widest leading-none">Lunar Tracking</span>
            </div>
         </div>
         <div className="flex flex-col items-end">
            <span className="text-[10px] text-white/40 font-mono font-bold">{formatDuration(totalDaylight)}</span>
            <span className="text-[7px] text-white/10 uppercase font-black tracking-widest leading-none">Day Length</span>
         </div>
      </div>
    </motion.div>
  );
}

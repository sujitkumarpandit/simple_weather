import React from 'react';
import { useWeatherStore } from '../store/useWeatherStore';
import { Bike, Footprints, Camera, Plane, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function ActivityScores() {
  const { currentWeather } = useWeatherStore();

  if (!currentWeather) return null;

  const calculateScores = () => {
    const temp = currentWeather.main.temp;
    const wind = currentWeather.wind.speed;
    const humidity = currentWeather.main.humidity;
    const clear = currentWeather.weather[0].main.toLowerCase() === 'clear';
    const rain = currentWeather.weather[0].main.toLowerCase().includes('rain');

    // Simple heuristic scores (0-10)
    let running = 7;
    if (temp > 25 || temp < 5) running -= 2;
    if (humidity > 70) running -= 1;
    if (rain) running -= 4;

    let cycling = 8;
    if (wind > 15) cycling -= 3;
    if (rain) cycling -= 5;
    if (temp > 30) cycling -= 2;

    let photography = clear ? 9 : 5;
    if (rain) photography = 2;

    return { running, cycling, photography };
  };

  const scores = calculateScores();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card p-5 h-full bg-[#0f172a]/40 group"
    >
      <div className="scanline" />
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-500/50" />
          <p className="mission-text italic text-[8px] tracking-[0.3em] font-black">Environmental Suitability Index</p>
        </div>
        <div className="w-12 h-[1px] bg-sky-500/20" />
      </div>

      <div className="grid grid-cols-1 gap-6 relative z-10">
        <ScoreItem icon={<Footprints className="w-4 h-4" />} label="Running" score={scores.running} color="bg-green-500" />
        <ScoreItem icon={<Bike className="w-4 h-4" />} label="Cycling" score={scores.cycling} color="bg-sky-500" />
        <ScoreItem icon={<Camera className="w-4 h-4" />} label="Photography" score={scores.photography} color="bg-purple-500" />
      </div>
    </motion.div>
  );
}

function ScoreItem({ icon, label, score, color }: { icon: React.ReactNode, label: string, score: number, color: string }) {
  const getVerdict = (s: number) => {
    if (s >= 8) return "Optimum";
    if (s >= 6) return "Permissible";
    if (s >= 4) return "Marginal";
    return "Adverse";
  };

  return (
    <div className="flex flex-col gap-3 group cursor-default">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-white/30 group-hover:text-sky-400 group-hover:bg-sky-500/5 transition-all border border-white/5">
            {icon}
          </div>
          <div className="flex flex-col">
            <p className="text-[12px] font-bold text-white/90 uppercase tracking-tight">{label}</p>
            <p className="text-[7px] text-white/20 font-black uppercase tracking-[0.2em]">{getVerdict(score)}</p>
          </div>
        </div>
        <span className="text-[12px] font-mono font-bold text-white/40 tracking-tighter">{score * 10} / 100</span>
      </div>
      
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
         <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 1, ease: "circOut" }}
          className={`h-full ${color} opacity-40 shadow-[0_0_12px_${color}]`} 
         />
      </div>
    </div>
  );
}

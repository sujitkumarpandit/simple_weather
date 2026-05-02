import React from 'react';
import { useWeatherStore } from '../store/useWeatherStore';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';

export function UnitToggle() {
  const { units, setUnits } = useWeatherStore();

  return (
    <div className="bg-[#0f172a]/40 border border-white/5 p-1 rounded-xl flex items-center gap-1">
      <button
        onClick={() => setUnits('metric')}
        className={`px-4 py-1.5 rounded-lg text-[10px] font-black font-mono transition-all duration-300 border ${
          units === 'metric' 
            ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' 
            : 'text-white/20 border-transparent hover:text-white/40 hover:bg-white/5'
        }`}
      >
        METRIC
      </button>
      <button
        onClick={() => setUnits('imperial')}
        className={`px-4 py-1.5 rounded-lg text-[10px] font-black font-mono transition-all duration-300 border ${
          units === 'imperial' 
            ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' 
            : 'text-white/20 border-transparent hover:text-white/40 hover:bg-white/5'
        }`}
      >
        IMPERIAL
      </button>
    </div>
  );
}

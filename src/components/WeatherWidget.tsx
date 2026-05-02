import React from 'react';
import { motion } from 'framer-motion';

interface WeatherWidgetProps {
  label: string;
  value: string;
  subValue: string;
  icon?: React.ReactNode;
}

export function WeatherWidget({ label, value, subValue, icon }: WeatherWidgetProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="dashboard-card p-5 mt-4 flex flex-col justify-between h-full group relative overflow-hidden bg-[#0a1120]/60 glass-glow cursor-pointer transition-all duration-300"
    >
      {/* Dynamic Background Detail */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-sky-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Decorative Technical Crosshair */}
      <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-white/10 pointer-events-none group-hover:border-sky-500/30 transition-colors" />
      <div className="absolute bottom-4 left-4 w-1.5 h-1.5 border-l border-b border-sky-500/30 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="text-sky-500/30 group-hover:text-sky-400 transition-colors duration-300">
              {icon}
            </div>
            <p className="mission-text italic text-[8px] tracking-[0.3em] font-black">{label}</p>
          </div>
          <motion.div 
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-1 rounded-full bg-sky-400" 
          />
        </div>
        
        <div className="flex flex-col">
          <p className="text-4xl font-bold tracking-tighter text-white data-value group-hover:text-sky-400 transition-colors duration-300">
            {value}
          </p>
          <div className="flex items-center gap-2 mt-1">
             <div className="w-1 h-1 rounded-full bg-emerald-500/60 shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
             <p className="text-[7px] text-white/20 uppercase tracking-[0.3em] font-mono">Channel: Primary</p>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 pt-4 mt-4 border-t border-white/5 flex items-end justify-between">
         <p className="text-[9px] text-white/40 font-mono tracking-tighter leading-tight max-w-[70%]">
           {subValue}
         </p>
         <div className="flex gap-0.5 mb-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-0.5 h-3 bg-sky-500/20" />
            ))}
         </div>
      </div>
    </motion.div>
  );
}

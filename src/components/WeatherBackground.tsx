import React from 'react';
import { useWeatherStore } from '../store/useWeatherStore';

export function WeatherBackground() {
  const { theme } = useWeatherStore();
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-colors duration-500 ${theme === 'dark' ? 'bg-[#2c2c2c]' : 'bg-[#f5f5f5]'}`}>
      {/* Subtle Grid Pattern */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${theme === 'dark' ? 'opacity-[0.05]' : 'opacity-[0.1]'}`} 
        style={{ 
          backgroundImage: `radial-gradient(${theme === 'dark' ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} 
      />
      
      {/* Soft Vignette */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)]' : 'bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.05)_100%)]'}`} />
    </div>
  );
}

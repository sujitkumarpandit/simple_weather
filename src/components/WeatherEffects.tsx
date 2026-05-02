import React from 'react';
import { useWeatherStore } from '../store/useWeatherStore';
import { motion, AnimatePresence } from 'framer-motion';

export function WeatherEffects() {
  const { currentWeather } = useWeatherStore();

  if (!currentWeather) return null;

  const condition = currentWeather.weather[0].main.toLowerCase();
  const isRain = condition.includes('rain') || condition.includes('drizzle');
  const isSnow = condition.includes('snow');
  const isThunder = condition.includes('thunderstorm');

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <AnimatePresence>
        {isRain && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            {[...Array(50)].map((_, i) => (
              <RainDrop key={i} delay={Math.random() * 2} left={Math.random() * 100} />
            ))}
          </motion.div>
        )}
        
        {isSnow && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            {[...Array(40)].map((_, i) => (
              <SnowFlake key={i} delay={Math.random() * 4} left={Math.random() * 100} size={Math.random() * 4 + 2} />
            ))}
          </motion.div>
        )}

        {isThunder && (
          <LightningEffect />
        )}
      </AnimatePresence>
    </div>
  );
}

function RainDrop({ delay, left }: { delay: number, left: number }) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ 
        y: ['0vh', '110vh'],
        opacity: [0, 1, 0]
      }}
      transition={{ 
        duration: 0.8, 
        repeat: Infinity, 
        delay, 
        ease: "linear" 
      }}
      className="absolute bg-sky-400 w-[1px] h-[20px]"
      style={{ left: `${left}%` }}
    />
  );
}

function SnowFlake({ delay, left, size }: { delay: number, left: number, size: number }) {
  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ 
        y: ['0vh', '110vh'],
        x: [0, 20, -20, 0],
        opacity: [0, 1, 0]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        delay, 
        ease: "linear" 
      }}
      className="absolute bg-white rounded-full blur-[1px]"
      style={{ left: `${left}%`, width: size, height: size }}
    />
  );
}

function LightningEffect() {
  return (
    <motion.div
      animate={{ 
        backgroundColor: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0)'],
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity, 
        repeatDelay: Math.random() * 10 + 5 
      }}
      className="absolute inset-0 z-10"
    />
  );
}

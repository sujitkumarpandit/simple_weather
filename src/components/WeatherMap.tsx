import React from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useWeatherStore } from '../store/useWeatherStore';
import { Map as MapIcon, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 10);
  return null;
}

export function WeatherMap() {
  const { currentWeather } = useWeatherStore();

  if (!currentWeather) return null;

  const center: [number, number] = [currentWeather.coord.lat, currentWeather.coord.lon];

  // OpenWeatherMap Tiles (Free tier often requires individual layer integration or custom proxying)
  // For this demo, we'll use standard tiles and simulate the 'weather layers' look with a custom overlay
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="dashboard-card overflow-hidden h-full min-h-[300px] relative group"
    >
      <div className="absolute top-6 left-6 z-40 flex items-center gap-3 bg-black/60 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/10">
        <MapIcon className="w-4 h-4 text-white/40" />
        <span className="text-[10px] font-bold tracking-widest text-white/60 uppercase">Precipitation Radar</span>
      </div>

      <button className="absolute top-6 right-6 z-40 p-2.5 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10">
        <Maximize2 className="w-4 h-4 text-white/80" />
      </button>

      <div className="absolute inset-0 z-10 brightness-[0.8] saturate-[0.8]">
        <MapContainer 
          center={center} 
          zoom={10} 
          scrollWheelZoom={false} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <ChangeView center={center} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        </MapContainer>
      </div>

      <div className="absolute bottom-6 left-6 right-6 z-40 bg-black/60 backdrop-blur-2xl py-4 px-6 rounded-2xl flex items-center justify-between border border-white/10 shadow-2xl">
        <div className="flex gap-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Rain</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Storms</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

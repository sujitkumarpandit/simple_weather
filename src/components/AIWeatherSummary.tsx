import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { useWeatherStore } from '../store/useWeatherStore';
import { GoogleGenAI } from '@google/genai';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export function AIWeatherSummary() {
  const { currentWeather, forecast, units } = useWeatherStore();
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentWeather || !forecast) return;

    const generateSummary = async () => {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        setSummary(null);
        return;
      }

      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey });
        const model = "gemini-1.5-flash";

        const prompt = `
          Analyze for ${currentWeather.name}: ${Math.round(currentWeather.main.temp)}${units === 'metric' ? '°C' : '°F'}, ${currentWeather.weather[0].description}.
          Next 24h: ${forecast.list.slice(0, 8).map(f => f.weather[0].description).join(', ')}.
          
          Provide a premium Apple-style briefing. Include practical advice about umbrellas, runs, or commutes if relevant. Max 1 sentence.
        `;

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });

        setSummary(response.text || null);
      } catch (error) {
        console.error("AI Error:", error);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(generateSummary, 1000);
    return () => clearTimeout(timer);
  }, [currentWeather, forecast, units]);

  if (!currentWeather || !forecast) return null;

  const chartData = forecast.list.slice(0, 10).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(item.main.temp)
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card p-6 flex flex-col h-full relative group overflow-hidden bg-[#0f172a]/40"
    >
      {/* Background Grid Accent */}
      <div className="absolute inset-0 tech-grid pointer-events-none opacity-[0.2]" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5 shadow-inner group-hover:bg-white/10 transition-all duration-500">
            {summary ? (
              <Sparkles className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors" />
            ) : (
              <TrendingUp className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors" />
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-40">
              {summary ? 'AI Insights' : 'Trend Analysis'}
            </h3>
            <p className="editorial-header text-white/60 text-xs mt-0.5">
              Atmospheric Briefing 01
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-2 py-1 rounded bg-white/5 border border-white/5">
             <p className="font-mono text-[8px] text-white/40 tracking-widest">{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit'})} UTC</p>
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 flex-1 relative z-10">
        {summary && (
          <div className="flex flex-col min-h-[60px]">
            {loading ? (
              <div className="space-y-3">
                <div className="h-1 bg-white/10 rounded-full w-full animate-pulse" />
                <div className="h-1 bg-white/10 rounded-full w-[80%] animate-pulse" />
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative"
              >
                <p className="text-[14px] md:text-[15px] font-medium text-white/90 leading-relaxed tracking-tight">
                  {summary}
                </p>
                <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-sky-500/30" />
              </motion.div>
            )}
          </div>
        )}

        <div className="h-[100px] w-full mt-auto relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fff" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-black/90 backdrop-blur-xl px-3 py-2 rounded-xl border border-white/10 shadow-2xl">
                        <p className="mission-text mb-1 opacity-60">Temperature</p>
                        <p className="text-sm font-mono font-bold text-white leading-none">{payload[0].value}°</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="stepAfter" 
                dataKey="temp" 
                stroke="#fff" 
                strokeWidth={1}
                strokeOpacity={0.4}
                fillOpacity={1} 
                fill="url(#colorTemp)" 
                animationBegin={0}
                animationDuration={1500}
              />
              <XAxis dataKey="time" hide />
              <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
            </AreaChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-x-0 bottom-0 flex justify-between items-center px-1">
            <span className="font-mono text-[7px] text-white/20 tracking-tighter uppercase">{chartData[0].time}</span>
            <div className="h-[1px] flex-1 mx-4 bg-white/5" />
            <span className="font-mono text-[7px] text-white/20 tracking-tighter uppercase">{chartData[chartData.length - 1].time}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

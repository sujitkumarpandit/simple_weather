import { create } from 'zustand';
import { WeatherData, ForecastData, Units, GeocodingResult, UVData, AQIData } from '../types';
import { weatherService } from '../services/weatherService';

interface WeatherStore {
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  uvIndex: UVData | null;
  aqi: AQIData | null;
  units: Units;
  isLoading: boolean;
  error: string | null;
  searchHistory: GeocodingResult[];
  favorites: GeocodingResult[];
  theme: 'dark' | 'light';
  
  setUnits: (units: Units) => void;
  fetchWeather: (lat: number, lon: number) => Promise<void>;
  searchLocation: (query: string) => Promise<GeocodingResult[]>;
  addToHistory: (location: GeocodingResult) => void;
  toggleFavorite: (location: GeocodingResult) => void;
  toggleTheme: () => void;
}

const getStoredItems = (key: string): any[] => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  } catch (e) {
    return [];
  }
};

const getStoredTheme = (): 'dark' | 'light' => {
  try {
    return (localStorage.getItem('weather_theme') as 'dark' | 'light') || 'dark';
  } catch {
    return 'dark';
  }
};

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  currentWeather: null,
  forecast: null,
  uvIndex: null,
  aqi: null,
  units: 'metric',
  isLoading: false,
  error: null,
  searchHistory: getStoredItems('weather_search_history'),
  favorites: getStoredItems('weather_favorites'),
  theme: getStoredTheme(),

  setUnits: (units: Units) => {
    set({ units });
    const current = get().currentWeather;
    if (current) {
      get().fetchWeather(current.coord.lat, current.coord.lon);
    }
  },

  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('weather_theme', newTheme);
    set({ theme: newTheme });
  },

  fetchWeather: async (lat: number, lon: number) => {
    set({ isLoading: true, error: null });
    try {
      const { units } = get();
      
      const [current, forecast] = await Promise.all([
        weatherService.getCurrentWeather(lat, lon, units),
        weatherService.getForecast(lat, lon, units),
      ]);

      let uv = null;
      let aqiData = null;
      try {
        const [uvRes, aqiRes] = await Promise.allSettled([
          weatherService.getUVIndex(lat, lon),
          weatherService.getAirPollution(lat, lon),
        ]);
        uv = uvRes.status === 'fulfilled' ? uvRes.value : null;
        aqiData = aqiRes.status === 'fulfilled' ? aqiRes.value : null;
      } catch (secondaryError) {
        console.warn('Secondary data fetch failed:', secondaryError);
      }

      set({ currentWeather: current, forecast, uvIndex: uv, aqi: aqiData, isLoading: false });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to fetch weather data';
      set({ error: errorMessage, isLoading: false });
    }
  },

  searchLocation: async (query: string) => {
    try {
      return await weatherService.searchLocations(query);
    } catch (err) {
      console.error('Search error:', err);
      return [];
    }
  },

  addToHistory: (location: GeocodingResult) => {
    set((state) => {
      const filtered = state.searchHistory.filter(
        (l) => l.lat !== location.lat || l.lon !== location.lon
      );
      const updated = [location, ...filtered].slice(0, 5);
      localStorage.setItem('weather_search_history', JSON.stringify(updated));
      return { searchHistory: updated };
    });
  },

  toggleFavorite: (location: GeocodingResult) => {
    set((state) => {
      const isFav = state.favorites.some(
        (l) => l.lat === location.lat && l.lon === location.lon
      );
      let updated;
      if (isFav) {
        updated = state.favorites.filter((l) => l.lat !== location.lat || l.lon !== location.lon);
      } else {
        updated = [...state.favorites, location];
      }
      localStorage.setItem('weather_favorites', JSON.stringify(updated));
      return { favorites: updated };
    });
  },
}));

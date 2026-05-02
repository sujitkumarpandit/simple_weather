import { create } from 'zustand';
import { WeatherData, ForecastData, Units, GeocodingResult, UVData, AQIData } from '../types';

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

const API_KEY = (import.meta as any).env?.VITE_OPENWEATHER_API_KEY;

const buildUrl = (base: string, params: Record<string, string>) => {
  const query = new URLSearchParams(params);
  return `${base}?${query.toString()}`;
};

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    const message = data?.message || data?.error || response.statusText || 'OpenWeather request failed';
    throw new Error(message);
  }
  return data;
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
      if (!API_KEY) {
        throw new Error('OpenWeather API key is not configured. Set VITE_OPENWEATHER_API_KEY.');
      }

      const { units } = get();
      const currentUrl = buildUrl('https://api.openweathermap.org/data/2.5/weather', {
        lat: String(lat),
        lon: String(lon),
        units,
        appid: API_KEY,
      });

      const forecastUrl = buildUrl('https://api.openweathermap.org/data/2.5/forecast', {
        lat: String(lat),
        lon: String(lon),
        units,
        appid: API_KEY,
      });

      const [current, forecast] = await Promise.all([
        fetchJson<WeatherData>(currentUrl),
        fetchJson<ForecastData>(forecastUrl),
      ]);

      const uvPromise = fetchJson<UVData>(
        buildUrl('https://api.openweathermap.org/data/2.5/uvi', {
          lat: String(lat),
          lon: String(lon),
          appid: API_KEY,
        })
      ).catch(() => null);

      const aqiPromise = fetchJson<AQIData>(
        buildUrl('https://api.openweathermap.org/data/2.5/air_pollution', {
          lat: String(lat),
          lon: String(lon),
          appid: API_KEY,
        })
      ).catch(() => null);

      const [uvIndex, aqi] = await Promise.all([uvPromise, aqiPromise]);
      set({ currentWeather: current, forecast, uvIndex, aqi, isLoading: false });
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch weather data';
      set({ error: errorMessage, isLoading: false });
    }
  },

  searchLocation: async (query: string) => {
    try {
      if (!API_KEY || !query.trim()) return [];

      const url = buildUrl('https://api.openweathermap.org/geo/1.0/direct', {
        q: query,
        limit: '5',
        appid: API_KEY,
      });

      const response = await fetch(url);
      const results = await response.json();
      if (!response.ok || !Array.isArray(results)) {
        return [];
      }

      return results.map((item: any) => ({
        name: item.name,
        lat: item.lat,
        lon: item.lon,
        country: item.country,
        state: item.state,
      }));
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

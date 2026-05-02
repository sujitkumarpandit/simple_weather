import axios from 'axios';
import { WeatherData, ForecastData, GeocodingResult, Units, UVData, AQIData } from '../types';

const API_BASE = '/api/weather';

export const weatherService = {
  async getCurrentWeather(lat: number, lon: number, units: Units = 'metric'): Promise<WeatherData> {
    const response = await axios.get(`${API_BASE}/current`, {
      params: { lat, lon, units },
    });
    return response.data;
  },

  async getForecast(lat: number, lon: number, units: Units = 'metric'): Promise<ForecastData> {
    const response = await axios.get(`${API_BASE}/forecast`, {
      params: { lat, lon, units },
    });
    return response.data;
  },

  async getUVIndex(lat: number, lon: number): Promise<UVData> {
    const response = await axios.get(`${API_BASE}/uv`, {
      params: { lat, lon },
    });
    return response.data;
  },

  async getAirPollution(lat: number, lon: number): Promise<AQIData> {
    const response = await axios.get(`${API_BASE}/air_pollution`, {
      params: { lat, lon },
    });
    return response.data;
  },

  async searchLocations(query: string): Promise<GeocodingResult[]> {
    if (!query) return [];
    const response = await axios.get(`${API_BASE}/geocoding`, {
      params: { q: query },
    });
    return response.data;
  },
};

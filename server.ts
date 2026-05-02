import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(helmet({
    contentSecurityPolicy: false, // For development and iframe compatibility
  }));
  app.use(morgan("dev"));
  app.use(express.json());

  const getApiKey = () => process.env.VITE_OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY;

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      apiKeyConfigured: !!getApiKey()
    });
  });

  // Proxy for Weather API (to hide keys)
  app.get("/api/weather/current", async (req, res) => {
    const { lat, lon, units = 'metric' } = req.query;
    const apiKey = getApiKey();
    
    if (!apiKey) {
      return res.status(401).json({ error: "OpenWeather API key is missing. Please add VITE_OPENWEATHER_API_KEY to your Secrets/Env." });
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=0c82d8d0d6310e5a70397a28d38769ca`
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }
      
      res.json(data);
    } catch (error) {
      console.error("Weather API Error:", error);
      res.status(500).json({ error: "Failed to connect to weather service" });
    }
  });

  app.get("/api/weather/forecast", async (req, res) => {
    const { lat, lon, units = 'metric' } = req.query;
    const apiKey = getApiKey();
    
    if (!apiKey) {
      return res.status(401).json({ error: "OpenWeather API key is missing" });
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`
      );
      
      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      console.error("Forecast API Error:", error);
      res.status(500).json({ error: "Failed to fetch forecast data" });
    }
  });

  app.get("/api/weather/uv", async (req, res) => {
    const { lat, lon } = req.query;
    const apiKey = getApiKey();
    
    if (!apiKey) {
      return res.status(401).json({ error: "OpenWeather API key is missing" });
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );
      
      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      console.error("UV API Error:", error);
      res.status(500).json({ error: "Failed to fetch UV data" });
    }
  });

  app.get("/api/weather/air_pollution", async (req, res) => {
    const { lat, lon } = req.query;
    const apiKey = getApiKey();
    
    if (!apiKey) {
      return res.status(401).json({ error: "OpenWeather API key is missing" });
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );
      
      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      console.error("AQI API Error:", error);
      res.status(500).json({ error: "Failed to fetch AQI data" });
    }
  });

  app.get("/api/weather/geocoding", async (req, res) => {
    const { q, limit = 5 } = req.query;
    const apiKey = getApiKey();
    
    if (!apiKey) {
      return res.status(401).json({ error: "OpenWeather API key is missing" });
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=${limit}&appid=${apiKey}`
      );
      
      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.json(data);
    } catch (error) {
      console.error("Geocoding API Error:", error);
      res.status(500).json({ error: "Failed to fetch geocoding data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

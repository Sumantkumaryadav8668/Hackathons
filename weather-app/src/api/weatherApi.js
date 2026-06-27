import { weatherClient } from './axios';
import { defaultForecastOptions, endpoints } from './endpoints';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 4;

const withKey = (params = {}) => {
  if (!API_KEY || API_KEY === 'your_weatherapi_key_here') {
    throw new Error('Add VITE_WEATHER_API_KEY to your .env file to load live weather data.');
  }

  return { key: API_KEY, ...params };
};

const getCached = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
};

const setCached = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};

const withRetry = async (request, retries = 2) => {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await request();
    } catch (error) {
      lastError = error;
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') throw error;
      if (attempt === retries) break;
      await new Promise((resolve) => setTimeout(resolve, 450 * (attempt + 1)));
    }
  }

  throw lastError;
};

const normalizeDirection = (degrees) => {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(degrees / 45) % 8];
};

const normalizeAirQuality = (airQuality = {}) => {
  const epaIndex = airQuality['us-epa-index'];
  const labels = {
    1: 'Good',
    2: 'Moderate',
    3: 'Unhealthy for sensitive groups',
    4: 'Unhealthy',
    5: 'Very unhealthy',
    6: 'Hazardous',
  };

  return {
    index: epaIndex,
    label: labels[epaIndex] || 'Unavailable',
    pm25: airQuality.pm2_5,
    pm10: airQuality.pm10,
    co: airQuality.co,
    no2: airQuality.no2,
    o3: airQuality.o3,
  };
};

const normalizeMoonPhase = (phase) => phase || 'Unavailable';

const normalizeForecast = (payload) => {
  const current = payload.current;
  const todayAstro = payload.forecast.forecastday[0]?.astro || {};
  const location = payload.location;

  return {
    location: {
      id: `${location.lat},${location.lon}`,
      name: location.name,
      region: location.region,
      country: location.country,
      lat: location.lat,
      lon: location.lon,
      localtime: location.localtime,
      timezone: location.tz_id,
    },
    current: {
      tempC: current.temp_c,
      tempF: current.temp_f,
      feelsLikeC: current.feelslike_c,
      feelsLikeF: current.feelslike_f,
      condition: current.condition?.text,
      icon: current.condition?.icon?.startsWith('//') ? `https:${current.condition.icon}` : current.condition?.icon,
      windKph: current.wind_kph,
      windMph: current.wind_mph,
      windDegree: current.wind_degree,
      windDirection: current.wind_dir || normalizeDirection(current.wind_degree),
      humidity: current.humidity,
      pressureMb: current.pressure_mb,
      visibilityKm: current.vis_km,
      cloud: current.cloud,
      dewPointC: current.dewpoint_c,
      uv: current.uv,
      updatedAt: current.last_updated,
      airQuality: normalizeAirQuality(current.air_quality),
    },
    astro: {
      sunrise: todayAstro.sunrise,
      sunset: todayAstro.sunset,
      moonrise: todayAstro.moonrise,
      moonset: todayAstro.moonset,
      moonPhase: normalizeMoonPhase(todayAstro.moon_phase),
      moonIllumination: todayAstro.moon_illumination,
    },
    hourly: payload.forecast.forecastday
      .flatMap((day) => day.hour)
      .filter((hour) => new Date(hour.time.replace(' ', 'T')) >= new Date(current.last_updated.replace(' ', 'T')))
      .slice(0, 24)
      .map((hour) => ({
        time: hour.time,
        tempC: hour.temp_c,
        chanceOfRain: hour.chance_of_rain,
        condition: hour.condition?.text,
        icon: hour.condition?.icon?.startsWith('//') ? `https:${hour.condition.icon}` : hour.condition?.icon,
        windKph: hour.wind_kph,
        humidity: hour.humidity,
        cloud: hour.cloud,
        feelsLikeC: hour.feelslike_c,
      })),
    daily: payload.forecast.forecastday.map((day) => ({
      date: day.date,
      maxC: day.day.maxtemp_c,
      minC: day.day.mintemp_c,
      avgC: day.day.avgtemp_c,
      chanceOfRain: day.day.daily_chance_of_rain,
      condition: day.day.condition?.text,
      icon: day.day.condition?.icon?.startsWith('//') ? `https:${day.day.condition.icon}` : day.day.condition?.icon,
      uv: day.day.uv,
      sunrise: day.astro.sunrise,
      sunset: day.astro.sunset,
      moonPhase: normalizeMoonPhase(day.astro.moon_phase),
    })),
    alerts: payload.alerts?.alert || [],
  };
};

export const getForecast = async (query, { signal, force = false } = {}) => {
  const cacheKey = `forecast:${query}`;
  if (!force) {
    const cached = getCached(cacheKey);
    if (cached) return cached;
  }

  const response = await withRetry(() =>
    weatherClient.get(endpoints.forecast, {
      signal,
      params: withKey({ q: query, ...defaultForecastOptions }),
    }),
  );

  return setCached(cacheKey, normalizeForecast(response.data));
};

export const searchLocations = async (query, { signal } = {}) => {
  if (!query || query.trim().length < 2) return [];
  const normalized = query.trim();
  const cacheKey = `search:${normalized.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const response = await withRetry(
    () =>
      weatherClient.get(endpoints.search, {
        signal,
        params: withKey({ q: normalized }),
      }),
    1,
  );

  return setCached(
    cacheKey,
    response.data.map((item) => ({
      id: item.id || `${item.lat},${item.lon}`,
      name: item.name,
      region: item.region,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
      label: [item.name, item.region, item.country].filter(Boolean).join(', '),
      query: `${item.lat},${item.lon}`,
    })),
  );
};

export const getWeatherByCoordinates = (latitude, longitude, options) =>
  getForecast(`${latitude},${longitude}`, options);

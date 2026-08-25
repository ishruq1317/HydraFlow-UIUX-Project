/**
 * HydraFlow Live Geolocation & Weather Service
 * 
 * Interacts with browser GPS (navigator.geolocation) and Open-Meteo API
 * to fetch live real-world ambient conditions and dynamically calculate
 * hydration adjustments.
 */

export interface LiveWeatherData {
  city: string
  country: string
  latitude: number
  longitude: number
  temperatureC: number
  feelsLikeC: number
  humidityPct: number
  uvIndex: number
  weatherCode: number
  conditionText: string
  conditionEmoji: string
  heatImpactPct: number
  humidityImpactPct: number
  totalDemandIncreasePct: number
  isLiveGps: boolean
  lastUpdated: string
}

const WEATHER_STORAGE_KEY = 'hydraflow_live_weather'

type Listener = (weather: LiveWeatherData) => void

// WMO Weather interpretation table
function interpretWeatherCode(code: number): { text: string; emoji: string } {
  if (code === 0) return { text: 'Clear sky', emoji: '☀️' }
  if (code === 1) return { text: 'Mainly clear', emoji: '🌤' }
  if (code === 2) return { text: 'Partly cloudy', emoji: '⛅' }
  if (code === 3) return { text: 'Overcast', emoji: '☁️' }
  if (code >= 45 && code <= 48) return { text: 'Foggy', emoji: '🌫' }
  if (code >= 51 && code <= 55) return { text: 'Drizzle', emoji: '🌦' }
  if (code >= 61 && code <= 65) return { text: 'Rain', emoji: '🌧' }
  if (code >= 71 && code <= 77) return { text: 'Snow', emoji: '❄️' }
  if (code >= 80 && code <= 82) return { text: 'Rain showers', emoji: '🌦' }
  if (code >= 95) return { text: 'Thunderstorm', emoji: '⛈' }
  return { text: 'Clear', emoji: '🌤' }
}

class WeatherService {
  private listeners: Listener[] = []
  private isFetching: boolean = false

  public getCurrentWeather(): LiveWeatherData {
    try {
      const cached = localStorage.getItem(WEATHER_STORAGE_KEY)
      if (cached) {
        return JSON.parse(cached)
      }
    } catch {}

    // Fallback standard weather
    return {
      city: 'Current Area',
      country: '',
      latitude: 23.8103,
      longitude: 90.4125,
      temperatureC: 29,
      feelsLikeC: 34,
      humidityPct: 78,
      uvIndex: 7,
      weatherCode: 2,
      conditionText: 'Partly cloudy',
      conditionEmoji: '🌤',
      heatImpactPct: 12,
      humidityImpactPct: 8,
      totalDemandIncreasePct: 40,
      isLiveGps: false,
      lastUpdated: 'Just now',
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notify(data: LiveWeatherData): void {
    this.listeners.forEach((l) => l(data))
  }

  // Request real device GPS location and fetch weather
  public async fetchLiveDeviceLocation(): Promise<{ success: boolean; data?: LiveWeatherData; error?: string }> {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return { success: false, error: 'Geolocation is not supported by your browser.' }
    }

    if (this.isFetching) {
      return { success: true, data: this.getCurrentWeather() }
    }

    this.isFetching = true

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords
            const weather = await this.fetchWeatherForCoordinates(latitude, longitude, true)
            this.isFetching = false
            resolve({ success: true, data: weather })
          } catch {
            this.isFetching = false
            resolve({ success: false, error: 'Failed to fetch weather telemetry.' })
          }
        },
        async (err) => {
          this.isFetching = false
          console.warn('Geolocation permission error / timeout:', err.message)
          // Fallback to IP / default
          const fallback = this.getCurrentWeather()
          resolve({
            success: false,
            error: 'GPS permission denied or unavailable. Using standard location.',
            data: fallback,
          })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      )
    })
  }

  // Fetch Open-Meteo weather and BigDataCloud reverse geocode
  public async fetchWeatherForCoordinates(
    lat: number,
    lon: number,
    isGps: boolean = true
  ): Promise<LiveWeatherData> {
    try {
      // 1. Fetch Open-Meteo Current Weather
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,uv_index&timezone=auto`
      const weatherRes = await fetch(weatherUrl)
      const weatherJson = await weatherRes.json()
      const current = weatherJson.current || {}

      const temp = Math.round((current.temperature_2m ?? 28) * 10) / 10
      const feelsLike = Math.round((current.apparent_temperature ?? temp + 3) * 10) / 10
      const humidity = Math.round(current.relative_humidity_2m ?? 70)
      const uv = Math.round(current.uv_index ?? 5)
      const weatherCode = current.weather_code ?? 1
      const { text: conditionText, emoji: conditionEmoji } = interpretWeatherCode(weatherCode)

      // 2. Fetch City Name (Reverse Geocode)
      let cityName = 'Local City'
      let countryName = ''
      try {
        const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        const geoRes = await fetch(geoUrl)
        const geoJson = await geoRes.json()
        cityName = geoJson.city || geoJson.locality || geoJson.principalSubdivision || 'Local Area'
        countryName = geoJson.countryName || ''
      } catch {
        cityName = 'Local Device Location'
      }

      // 3. Dynamic Hydration Math
      // Base comfort baseline is 22°C and 50% humidity
      const heatImpact = Math.max(0, Math.round((temp - 22) * 1.6))
      const humidityImpact = Math.max(0, Math.round((humidity - 50) * 0.25))
      const totalIncrease = Math.min(60, heatImpact + humidityImpact + 15) // +15% baseline activity

      const nowTime = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

      const liveData: LiveWeatherData = {
        city: cityName,
        country: countryName,
        latitude: lat,
        longitude: lon,
        temperatureC: temp,
        feelsLikeC: feelsLike,
        humidityPct: humidity,
        uvIndex: uv,
        weatherCode,
        conditionText,
        conditionEmoji,
        heatImpactPct: heatImpact,
        humidityImpactPct: humidityImpact,
        totalDemandIncreasePct: totalIncrease,
        isLiveGps: isGps,
        lastUpdated: nowTime,
      }

      localStorage.setItem(WEATHER_STORAGE_KEY, JSON.stringify(liveData))
      this.notify(liveData)
      return liveData
    } catch (e) {
      console.error('Weather fetch failed:', e)
      return this.getCurrentWeather()
    }
  }
}

export const weatherService = new WeatherService()

import { useEffect, useState } from 'react'
import { weatherService, type LiveWeatherData } from '../services/weather'

type Tab = 'Today' | 'Tomorrow' | '7 Days'

export default function ForecastScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('Today')
  const [weather, setWeather] = useState<LiveWeatherData>(() => weatherService.getCurrentWeather())
  const [locating, setLocating] = useState(false)
  const [activeScenario, setActiveScenario] = useState<'live' | 'heat' | 'mild' | 'rain'>('live')

  useEffect(() => {
    const unsub = weatherService.subscribe((w) => setWeather(w))
    return unsub
  }, [])

  const handleLocateGps = async () => {
    setLocating(true)
    setActiveScenario('live')
    await weatherService.fetchLiveDeviceLocation()
    setLocating(false)
  }

  // Preset weather simulations for demo/evaluator showcase
  const handleScenarioChange = (scenario: 'live' | 'heat' | 'mild' | 'rain') => {
    setActiveScenario(scenario)
    if (scenario === 'live') {
      weatherService.fetchLiveDeviceLocation()
    } else if (scenario === 'heat') {
      // 36°C heatwave simulation
      const simulated: LiveWeatherData = {
        ...weather,
        city: `${weather.city} (Heatwave Sim)`,
        temperatureC: 36,
        feelsLikeC: 42,
        humidityPct: 85,
        uvIndex: 9,
        weatherCode: 0,
        conditionText: 'Extreme Heatwave',
        conditionEmoji: '🔥',
        heatImpactPct: 22,
        humidityImpactPct: 9,
        totalDemandIncreasePct: 46,
        isLiveGps: false,
        lastUpdated: 'Simulated',
      }
      localStorage.setItem('hydraflow_live_weather', JSON.stringify(simulated))
      setWeather(simulated)
    } else if (scenario === 'mild') {
      const simulated: LiveWeatherData = {
        ...weather,
        city: `${weather.city} (Mild Sim)`,
        temperatureC: 22,
        feelsLikeC: 22,
        humidityPct: 48,
        uvIndex: 4,
        weatherCode: 2,
        conditionText: 'Optimal Spring',
        conditionEmoji: '⛅',
        heatImpactPct: 0,
        humidityImpactPct: 0,
        totalDemandIncreasePct: 15,
        isLiveGps: false,
        lastUpdated: 'Simulated',
      }
      localStorage.setItem('hydraflow_live_weather', JSON.stringify(simulated))
      setWeather(simulated)
    } else if (scenario === 'rain') {
      const simulated: LiveWeatherData = {
        ...weather,
        city: `${weather.city} (Rain Sim)`,
        temperatureC: 18,
        feelsLikeC: 17,
        humidityPct: 92,
        uvIndex: 2,
        weatherCode: 61,
        conditionText: 'Cool Rainy',
        conditionEmoji: '🌧️',
        heatImpactPct: 0,
        humidityImpactPct: 4,
        totalDemandIncreasePct: 10,
        isLiveGps: false,
        lastUpdated: 'Simulated',
      }
      localStorage.setItem('hydraflow_live_weather', JSON.stringify(simulated))
      setWeather(simulated)
    }
  }

  const baseTarget = 2.4
  const multiplier = 1 + (weather.totalDemandIncreasePct / 100) * 0.5
  const dynamicTarget = Math.round(baseTarget * multiplier * 10) / 10

  const summaryVal = activeTab === '7 Days' ? '2.5 L' : `${dynamicTarget} L`
  const summaryLabel = activeTab === '7 Days' ? 'weekly avg' : `today in ${weather.city}`

  const weatherImpact = [
    { label: 'Ambient Heat', value: weather.heatImpactPct, detail: `${weather.temperatureC}°C → +${Math.round(weather.heatImpactPct * 15)} mL today`, color: '#e8510a' },
    { label: 'Air Humidity', value: weather.humidityImpactPct, detail: `${weather.humidityPct}% → +${Math.round(weather.humidityImpactPct * 12)} mL sweat rate`, color: '#0891b2' },
    { label: 'UV Radiation', value: Math.min(weather.uvIndex * 2, 18), detail: `UV index ${weather.uvIndex} — sweat rate catalyst`, color: '#d97706' },
    { label: 'Workout Demand', value: 15, detail: 'Scheduled gym session adds ~650 mL', color: '#7c3aed' },
  ]

  const hourlyData = [
    { hour: '7', recommended: 200, actual: 220, demand: 190 },
    { hour: '9', recommended: 250, actual: 240, demand: 250 + weather.heatImpactPct * 4 },
    { hour: '11', recommended: 200, actual: 190, demand: 220 + weather.heatImpactPct * 5 },
    { hour: '13', recommended: 300, actual: 275, demand: 320 + weather.heatImpactPct * 6 },
    { hour: '15', recommended: 250, actual: 0, demand: 300 + weather.heatImpactPct * 5 },
    { hour: '17', recommended: 300, actual: 0, demand: 320 + weather.heatImpactPct * 4 },
    { hour: '19', recommended: 200, actual: 0, demand: 185 },
  ]

  const weekData = [
    { day: 'Mon', target: 2.4, actual: 2.2, demand: 2.5 },
    { day: 'Tue', target: 2.6, actual: 2.5, demand: 2.8 },
    { day: 'Wed', target: 2.2, actual: 2.4, demand: 2.1 },
    { day: 'Thu', target: 2.8, actual: 2.9, demand: 3.0 },
    { day: 'Fri', target: 2.5, actual: 2.3, demand: 2.6 },
    { day: 'Sat', target: 2.0, actual: 1.8, demand: 2.1 },
    { day: 'Sun', target: dynamicTarget, actual: 1.4, demand: dynamicTarget + 0.3 },
  ]

  const peakInsights: Record<Tab, string> = {
    Today: `Live telemetry in ${weather.city} (${weather.temperatureC}°C, ${weather.humidityPct}% humidity) peaks fluid demand between 1–4 PM.`,
    Tomorrow: `Forecast for ${weather.city} projects moderate conditions with an afternoon hydration peak.`,
    '7 Days': 'Thursday was your highest demand day this week — high heat and physical activity combined.',
  }

  return (
    <div style={{ background: '#f2f5f9', minHeight: '100%', paddingBottom: 28 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(175deg, #071525 0%, #0b2d4e 100%)',
        padding: '18px 24px 20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: -0.3 }}>
              Hydration Forecast
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: '2px 0 0' }}>
              📍 {weather.city} · {weather.temperatureC}°C {weather.conditionEmoji}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLocateGps}
            disabled={locating}
            style={{
              background: 'rgba(0,180,216,0.18)',
              border: '1px solid rgba(0,180,216,0.35)',
              borderRadius: 10,
              padding: '7px 12px',
              color: '#38bdf8',
              fontSize: 11,
              fontWeight: 700,
              cursor: locating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>📍</span>
            <span>{locating ? 'GPS...' : 'Locate Device'}</span>
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.07)',
          borderRadius: 13,
          padding: 4,
          gap: 3,
          border: '1px solid rgba(255,255,255,0.07)',
          marginTop: 14,
        }}>
          {(['Today', 'Tomorrow', '7 Days'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                background: activeTab === tab ? '#fff' : 'transparent',
                border: 'none',
                borderRadius: 10,
                padding: '8px 6px',
                color: activeTab === tab ? '#071525' : 'rgba(255,255,255,0.5)',
                fontSize: 13,
                fontWeight: activeTab === tab ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.18s',
                fontFamily: 'Inter, system-ui, sans-serif',
                minHeight: 36,
                boxShadow: activeTab === tab ? '0 1px 6px rgba(0,0,0,0.15)' : 'none',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Live Weather Simulator Pills */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '12px 14px',
          border: '1px solid rgba(10,108,188,0.08)',
          boxShadow: '0 1px 6px rgba(10,50,100,0.04)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#8aaac8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
            Environment Simulation Engine
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'live' as const, label: '📍 Live GPS', icon: '' },
              { id: 'heat' as const, label: '🔥 Heat (36°C)', icon: '' },
              { id: 'mild' as const, label: '⛅ Mild (22°C)', icon: '' },
              { id: 'rain' as const, label: '🌧️ Rain (18°C)', icon: '' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleScenarioChange(s.id)}
                style={{
                  flex: 1,
                  background: activeScenario === s.id ? 'linear-gradient(135deg, #0a6cbc, #00b4d8)' : '#f8faff',
                  border: activeScenario === s.id ? '1px solid #0a6cbc' : '1px solid rgba(10,108,188,0.1)',
                  borderRadius: 10,
                  padding: '7px 4px',
                  color: activeScenario === s.id ? '#fff' : '#0d1b2a',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textAlign: 'center',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary stat row */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: 'Predicted target', value: summaryVal, sub: summaryLabel, color: '#0a6cbc', bg: '#eff6ff' },
            { label: 'Demand level', value: weather.temperatureC > 28 ? 'High Heat' : 'Moderate', sub: `+${weather.totalDemandIncreasePct}% from baseline`, color: weather.temperatureC > 28 ? '#e8510a' : '#0891b2', bg: '#fff3ee' },
          ].map((card) => (
            <div key={card.label} style={{
              flex: 1,
              background: '#fff',
              borderRadius: 16,
              padding: '14px 16px',
              border: '1px solid rgba(10,108,188,0.08)',
              boxShadow: '0 1px 6px rgba(10,50,100,0.05)',
            }}>
              <div style={{ color: '#8aaac8', fontSize: 10, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 5 }}>
                {card.label}
              </div>
              <div style={{ color: card.color, fontSize: 19, fontWeight: 800, letterSpacing: -0.3 }}>{card.value}</div>
              <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 3 }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Peak insight */}
        <div style={{
          background: 'linear-gradient(135deg, #071525, #0b3055)',
          borderRadius: 16,
          padding: '14px 16px',
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}>
          <div style={{ fontSize: 18, lineHeight: 1, marginTop: 1 }}>💡</div>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 1.55 }}>
            {peakInsights[activeTab]}
          </p>
        </div>

        {/* Chart card */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '18px 18px 14px',
          border: '1px solid rgba(10,108,188,0.08)',
          boxShadow: '0 1px 8px rgba(10,50,100,0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ color: '#0d1b2a', fontSize: 15, fontWeight: 700 }}>
                {activeTab === '7 Days' ? 'Weekly Overview' : activeTab === 'Today' ? `${weather.city} Timeline` : "Tomorrow's Forecast"}
              </div>
              <div style={{ color: '#8aaac8', fontSize: 12, marginTop: 2 }}>
                {activeTab === '7 Days' ? 'Litres per day' : 'Intake in mL'}
              </div>
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[
                { label: 'Recommended', color: '#0a6cbc' },
                { label: 'Actual', color: '#22c55e' },
                { label: 'Demand', color: '#f97316' },
              ].map((l) => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 3, borderRadius: 2, background: l.color }} />
                  <span style={{ color: '#94a3b8', fontSize: 10 }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {activeTab === '7 Days' ? (
            <WeeklyChart data={weekData} />
          ) : (
            <HourlyChart data={hourlyData} isTomorrow={activeTab === 'Tomorrow'} />
          )}
        </div>

        {/* Weather influence */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '18px',
          border: '1px solid rgba(10,108,188,0.08)',
          boxShadow: '0 1px 8px rgba(10,50,100,0.05)',
        }}>
          <div style={{ color: '#0d1b2a', fontSize: 15, fontWeight: 700, marginBottom: 3 }}>Live Environmental Signals</div>
          <div style={{ color: '#8aaac8', fontSize: 12, marginBottom: 16 }}>Measured in {weather.city}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {weatherImpact.map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ color: item.color, fontSize: 13, fontWeight: 700 }}>+{item.value}%</span>
                </div>
                <div style={{ flex: 1, height: 6, background: '#edf1f7', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min((item.value / 25) * 100, 100)}%`,
                    background: item.color,
                    borderRadius: 3,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
                <div style={{ width: 130, flexShrink: 0 }}>
                  <div style={{ color: '#0d1b2a', fontSize: 12, fontWeight: 500 }}>{item.label}</div>
                  <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 1 }}>{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function HourlyChart({ data, isTomorrow }: { data: any[]; isTomorrow: boolean }) {
  const maxVal = 450
  const chartH = 130
  const totalWidth = 310
  const barGroupW = totalWidth / data.length
  const barW = isTomorrow ? 10 : 8

  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${totalWidth} ${chartH + 24}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a6cbc" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0a6cbc" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="demGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((frac) => (
          <line key={frac}
            x1="0" y1={chartH - chartH * frac}
            x2={totalWidth} y2={chartH - chartH * frac}
            stroke="#edf1f7" strokeWidth="1"
          />
        ))}

        {data.map((d, i) => {
          const cx = barGroupW * i + barGroupW / 2
          const recH = (d.recommended / maxVal) * chartH
          const actH = (d.actual / maxVal) * chartH
          const demH = (d.demand / maxVal) * chartH
          const isPast = !isTomorrow && d.actual > 0
          const isNow = !isTomorrow && d.hour === '13'

          return (
            <g key={i}>
              <rect x={cx - barW * 1.5} y={chartH - demH} width={barW * 3} height={demH}
                fill="url(#demGrad)" rx="3" opacity="0.45"
              />
              <rect x={cx - barW / 2 - (isTomorrow ? 0 : 4)} y={chartH - recH} width={barW} height={recH}
                fill="url(#recGrad)" rx="3"
                opacity={isPast ? 0.5 : 1}
              />
              {!isTomorrow && d.actual > 0 && (
                <rect x={cx + barW / 2 - 2} y={chartH - actH} width={barW} height={actH}
                  fill="url(#actGrad)" rx="3"
                />
              )}
              {isNow && (
                <line x1={cx} y1={0} x2={cx} y2={chartH}
                  stroke="#0a6cbc" strokeWidth="1" strokeDasharray="4 3" opacity="0.4"
                />
              )}
              <text x={cx} y={chartH + 16} textAnchor="middle"
                fill={isNow ? '#0a6cbc' : '#94a3b8'} fontSize="10"
                fontWeight={isNow ? '700' : '400'}
                fontFamily="Inter, system-ui, sans-serif"
              >
                {d.hour}h
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function WeeklyChart({ data }: { data: any[] }) {
  const maxVal = 3.8
  const chartH = 120
  const totalWidth = 310
  const barGroupW = totalWidth / data.length
  const barW = 14

  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${totalWidth} ${chartH + 26}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="wkActGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a6cbc" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0a6cbc" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {[0.5, 1].map((frac) => (
          <line key={frac}
            x1="0" y1={chartH - chartH * frac}
            x2={totalWidth} y2={chartH - chartH * frac}
            stroke="#edf1f7" strokeWidth="1"
          />
        ))}

        {data.map((d, i) => {
          const isToday = i === 6
          const cx = barGroupW * i + barGroupW / 2
          const actualH = (d.actual / maxVal) * chartH
          const targetH = (d.target / maxVal) * chartH
          const metGoal = d.actual >= d.target

          return (
            <g key={d.day}>
              <rect x={cx - barW / 2} y={chartH - actualH} width={barW} height={actualH}
                fill={metGoal ? 'url(#wkActGrad)' : '#c4cfd8'} rx="4"
                opacity={isToday ? 1 : 0.65}
              />
              <line
                x1={cx - barW / 2 - 3} y1={chartH - targetH}
                x2={cx + barW / 2 + 3} y2={chartH - targetH}
                stroke={metGoal ? '#22c55e' : '#f97316'} strokeWidth="2" strokeLinecap="round"
              />
              {isToday && (
                <circle cx={cx} cy={chartH - actualH - 6} r="3" fill="#0a6cbc" />
              )}
              <text x={cx} y={chartH + 14} textAnchor="middle"
                fill={isToday ? '#0a6cbc' : '#94a3b8'} fontSize="10"
                fontWeight={isToday ? '700' : '400'}
                fontFamily="Inter, system-ui, sans-serif">
                {d.day}
              </text>
              <text x={cx} y={chartH + 25} textAnchor="middle"
                fill={isToday ? '#0d1b2a' : '#c4cfd8'} fontSize="9"
                fontFamily="Inter, system-ui, sans-serif">
                {d.actual}L
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

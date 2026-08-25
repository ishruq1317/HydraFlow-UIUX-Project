import { useEffect, useState } from 'react'
import { hydrationService, type HydrationState } from '../services/hydration'
import { weatherService, type LiveWeatherData } from '../services/weather'

interface Props {
  onClose: () => void
}

export default function ElectrolyteSheet({ onClose }: Props) {
  const [hydraState, setHydraState] = useState<HydrationState>(() => hydrationService.getState())
  const [weather, setWeather] = useState<LiveWeatherData>(() => weatherService.getCurrentWeather())

  useEffect(() => {
    const unsubH = hydrationService.subscribe((h) => setHydraState(h))
    const unsubW = weatherService.subscribe((w) => setWeather(w))
    return () => {
      unsubH()
      unsubW()
    }
  }, [])

  const consumed = hydraState.consumedLiters
  const target = hydraState.targetLiters
  const fluidPct = Math.min(Math.round((consumed / target) * 100), 100)

  // Dynamic Sodium & Potassium estimation based on temperature & sweat rate
  const isHighHeat = weather.temperatureC > 28
  const sodiumTargetMg = isHighHeat ? 2400 : 2000
  const sodiumConsumedMg = Math.round(920 + consumed * 380)
  const sodiumPct = Math.min(Math.round((sodiumConsumedMg / sodiumTargetMg) * 100), 100)

  const potassiumTargetMg = isHighHeat ? 3500 : 3200
  const potassiumConsumedMg = Math.round(1760 + consumed * 420)
  const potassiumPct = Math.min(Math.round((potassiumConsumedMg / potassiumTargetMg) * 100), 100)

  const magnesiumTargetMg = 420
  const magnesiumConsumedMg = Math.round(210 + consumed * 60)
  const magnesiumPct = Math.min(Math.round((magnesiumConsumedMg / magnesiumTargetMg) * 100), 100)

  const electrolytes = [
    {
      name: 'Hydration Fluid',
      icon: '💧',
      value: fluidPct,
      consumed: `${consumed} L`,
      target: `${target} L`,
      color: '#0891b2',
      bg: '#ecfeff',
      need: fluidPct >= 80 ? 'Optimal' : 'Moderate',
      needColor: fluidPct >= 80 ? '#22c55e' : '#0891b2',
      note: fluidPct >= 100 ? 'Daily goal reached! Keep sipping as needed.' : `${Math.max(0, Math.round((target - consumed) * 10) / 10)} L remaining to hit daily hydration target.`,
    },
    {
      name: 'Sodium (Na+)',
      icon: '🧂',
      value: sodiumPct,
      consumed: `~${sodiumConsumedMg} mg`,
      target: `~${sodiumTargetMg} mg`,
      color: '#e8510a',
      bg: '#fff3ee',
      need: isHighHeat ? 'High Need' : 'Moderate',
      needColor: isHighHeat ? '#e8510a' : '#0891b2',
      note: isHighHeat
        ? `${weather.temperatureC}°C ambient increases sodium sweat loss — consider an electrolyte sachet.`
        : 'Normal sodium retention for current ambient conditions.',
    },
    {
      name: 'Potassium (K+)',
      icon: '🍌',
      value: potassiumPct,
      consumed: `~${potassiumConsumedMg} mg`,
      target: `~${potassiumTargetMg} mg`,
      color: '#7c3aed',
      bg: '#f5f3ff',
      need: 'Optimal',
      needColor: '#22c55e',
      note: 'Within healthy cellular equilibrium range for active lifestyle.',
    },
    {
      name: 'Magnesium (Mg2+)',
      icon: '⚡',
      value: magnesiumPct,
      consumed: `~${magnesiumConsumedMg} mg`,
      target: `~${magnesiumTargetMg} mg`,
      color: '#0a6cbc',
      bg: '#eff6ff',
      need: 'Moderate',
      needColor: '#0a6cbc',
      note: 'Helps prevent muscle cramps during workout and recovery.',
    },
  ]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      background: 'rgba(7,21,37,0.65)',
      display: 'flex', alignItems: 'flex-end',
      backdropFilter: 'blur(3px)',
    }} onClick={onClose}>
      <div
        style={{
          width: '100%',
          background: '#fff',
          borderRadius: '28px 28px 0 0',
          maxHeight: '88%',
          overflowY: 'auto',
          boxShadow: '0 -8px 40px rgba(10,50,100,0.2)',
        }}
        className="no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 0' }}>
          <div style={{ width: 38, height: 4, borderRadius: 2, background: '#dde5ef' }} />
        </div>

        <div style={{ padding: '16px 24px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0d1b2a', letterSpacing: -0.3 }}>
                Electrolyte & Mineral Telemetry
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#8aaac8' }}>
                Calibrated to {weather.city}'s {weather.temperatureC}°C weather & sweat rate
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#f2f5f9', border: 'none', borderRadius: 10,
                width: 36, height: 36, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5a7a9a" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Overall Need Card */}
          <div style={{
            background: 'linear-gradient(135deg, #071525, #0a3558)',
            borderRadius: 18,
            padding: '16px 18px',
            marginBottom: 16,
            marginTop: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(7,21,37,0.25)',
          }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4 }}>
                Overall Mineral Demand
              </div>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>
                {isHighHeat ? 'Elevated Heat Loss' : 'Balanced Intake'}
              </div>
            </div>
            <div style={{ textAlign: 'right', maxWidth: 130 }}>
              <div style={{ color: '#00b4d8', fontSize: 12, lineHeight: 1.4, fontWeight: 500 }}>
                {weather.temperatureC}°C in {weather.city} · {weather.humidityPct}% hum
              </div>
            </div>
          </div>

          {/* Individual Electrolyte Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {electrolytes.map((e) => (
              <div key={e.name} style={{
                background: '#f8faff',
                borderRadius: 18,
                padding: '16px',
                border: '1px solid rgba(10,108,188,0.07)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: e.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18,
                    }}>
                      {e.icon}
                    </div>
                    <div>
                      <div style={{ color: '#0d1b2a', fontSize: 15, fontWeight: 700 }}>{e.name}</div>
                      <div style={{ color: '#8aaac8', fontSize: 12, marginTop: 1 }}>
                        {e.consumed} of {e.target}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    background: e.bg,
                    color: e.needColor,
                    borderRadius: 8, padding: '4px 10px',
                    fontSize: 12, fontWeight: 700,
                  }}>
                    {e.need}
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: 8, background: '#e4ebf4', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{
                    height: '100%',
                    width: `${e.value}%`,
                    background: `linear-gradient(90deg, ${e.color}90, ${e.color})`,
                    borderRadius: 4,
                    transition: 'width 0.6s ease',
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#8aaac8', fontSize: 11 }}>{e.value}% of daily estimated need</span>
                  <span style={{ color: e.color, fontSize: 11, fontWeight: 600 }}>Target: {e.target}</span>
                </div>

                <div style={{
                  background: e.bg,
                  borderRadius: 10,
                  padding: '8px 12px',
                  border: `1px solid ${e.color}20`,
                }}>
                  <span style={{ color: e.color, fontSize: 12, lineHeight: 1.45 }}>{e.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

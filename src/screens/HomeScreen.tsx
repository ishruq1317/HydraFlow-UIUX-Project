import { useEffect, useState } from 'react'
import TimelineSheet from '../components/TimelineSheet'
import ElectrolyteSheet from '../components/ElectrolyteSheet'
import LogDrinkSheet from '../components/LogDrinkSheet'
import { hydrationService, type HydrationState } from '../services/hydration'
import { weatherService, type LiveWeatherData } from '../services/weather'
import type { UserAccount } from '../services/auth'

interface Props {
  currentUser?: UserAccount | null
}

export default function HomeScreen({ currentUser }: Props) {
  const [showTimeline, setShowTimeline] = useState(false)
  const [showElectrolyte, setShowElectrolyte] = useState(false)
  const [showLogSheet, setShowLogSheet] = useState(false)
  const [detailsExpanded, setDetailsExpanded] = useState(false)
  const [locating, setLocating] = useState(false)

  const defaultTarget = currentUser?.profile?.baseTargetLiters || 2.8

  // Hydration state
  const [hydraState, setHydraState] = useState<HydrationState>(() =>
    hydrationService.getState(defaultTarget)
  )

  // Live weather & GPS state
  const [weather, setWeather] = useState<LiveWeatherData>(() =>
    weatherService.getCurrentWeather()
  )

  useEffect(() => {
    const unsubHydra = hydrationService.subscribe((updated) => setHydraState(updated))
    const unsubWeather = weatherService.subscribe((w) => setWeather(w))

    // Automatically attempt live device GPS geolocation on startup
    weatherService.fetchLiveDeviceLocation()

    return () => {
      unsubHydra()
      unsubWeather()
    }
  }, [])

  // Manual GPS refresh trigger
  const handleLocateGps = async () => {
    setLocating(true)
    await weatherService.fetchLiveDeviceLocation()
    setLocating(false)
  }

  const fullName = currentUser?.fullName || 'Jamie Mitchell'
  const firstName = fullName.split(' ')[0]
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'JM'

  // Calculate dynamic target based on live weather adjustment
  const weatherMultiplier = 1 + (weather.totalDemandIncreasePct / 100) * 0.5
  const dynamicTarget = Math.round(defaultTarget * weatherMultiplier * 10) / 10
  const consumed = hydraState.consumedLiters
  const pct = Math.min(consumed / dynamicTarget, 1.5)
  const remaining = Math.max(0, Math.round((dynamicTarget - consumed) * 10) / 10)
  const goalAchieved = consumed >= dynamicTarget

  const factors = [
    {
      label: 'Heat',
      value: weather.heatImpactPct,
      icon: '🌡',
      color: '#e8510a',
      bg: '#fff3ee',
      detail: `${weather.temperatureC}°C ambient — ${weather.temperatureC > 25 ? 'higher than 22°C baseline' : 'optimal baseline'}`,
    },
    {
      label: 'Humidity',
      value: weather.humidityImpactPct,
      icon: '💧',
      color: '#0891b2',
      bg: '#ecfeff',
      detail: `${weather.humidityPct}% relative humidity increases natural sweat loss`,
    },
    {
      label: 'Activity',
      value: 15,
      icon: '⚡',
      color: '#7c3aed',
      bg: '#f5f3ff',
      detail: 'Scheduled sessions add estimated 600–800 mL fluid demand',
    },
    {
      label: 'Schedule',
      value: 5,
      icon: '📅',
      color: '#0a6cbc',
      bg: '#eff6ff',
      detail: 'Busy afternoon shifts drink distribution into earlier hours',
    },
  ]

  const timelineItems = hydraState.drinks.map((d) => ({
    time: d.timeLabel,
    amount: d.amountMl,
    status: 'done' as const,
  }))

  if (timelineItems.length === 0) {
    timelineItems.push({ time: '9:00 AM', amount: 250, status: 'done' as const })
  }

  const handleQuickAdd = (amountMl: number) => {
    hydrationService.logDrink(amountMl, 'water', `Quick +${amountMl} mL`)
  }

  return (
    <div style={{ background: '#f2f5f9', minHeight: '100%', paddingBottom: 28 }}>

      {/* ── HEADER ── */}
      <div style={{
        background: 'linear-gradient(175deg, #071525 0%, #0b2d4e 100%)',
        padding: '18px 24px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient orb */}
        <div style={{
          position: 'absolute', top: -50, right: -30, width: 240, height: 240,
          background: 'radial-gradient(circle, rgba(0,180,216,0.16) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 4px', letterSpacing: 0.1 }}>
              Good morning, {firstName}
            </p>
            <h1 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
              Your plan has adapted<br />
              <span style={{ color: '#48cbe0', fontWeight: 400, fontSize: 16 }}>to {weather.city}'s live weather.</span>
            </h1>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0a6cbc 0%, #00b4d8 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid rgba(255,255,255,0.15)',
            boxShadow: '0 2px 10px rgba(0,180,216,0.3)',
          }}>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{initials}</span>
          </div>
        </div>

        {/* Live Weather & GPS Strip */}
        <div style={{
          background: 'rgba(255,255,255,0.07)',
          borderRadius: 14,
          padding: '11px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: '1px solid rgba(255,255,255,0.09)',
        }}>
          <span style={{ fontSize: 24, lineHeight: 1 }}>{weather.conditionEmoji}</span>
          <div style={{ display: 'flex', gap: 12, flex: 1, alignItems: 'center' }}>
            <div>
              <div style={{ color: '#fff', fontSize: 16, fontWeight: 700, lineHeight: 1.1 }}>
                {weather.temperatureC}°C
              </div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>📍 {weather.city}</span>
              </div>
            </div>
            <div style={{ width: 1, height: 26, background: 'rgba(255,255,255,0.12)' }} />
            <div>
              <div style={{ color: '#7dd8ed', fontSize: 13, fontWeight: 500 }}>
                {weather.humidityPct}% humidity
              </div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 1 }}>
                Feels like {weather.feelsLikeC}°C
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLocateGps}
            title="Locate via device GPS"
            style={{
              background: weather.temperatureC > 28 ? 'rgba(234,88,12,0.25)' : 'rgba(0,180,216,0.22)',
              border: weather.temperatureC > 28 ? '1px solid rgba(234,88,12,0.4)' : '1px solid rgba(0,180,216,0.35)',
              borderRadius: 8,
              padding: '6px 9px',
              textAlign: 'center',
              lineHeight: 1.2,
              cursor: 'pointer',
              color: weather.temperatureC > 28 ? '#fb923c' : '#38bdf8',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.3,
            }}
          >
            {locating ? 'GPS...' : weather.temperatureC > 28 ? 'HIGH HEAT' : 'LIVE GPS'}
          </button>
        </div>
      </div>

      {/* ── HYDRATION RING & PROGRESS ── */}
      <div style={{
        background: '#fff',
        marginTop: 0,
        padding: '24px 24px 20px',
        borderBottom: '1px solid rgba(10,108,188,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <HydrationRing pct={pct} consumed={consumed} target={dynamicTarget} goalAchieved={goalAchieved} />

          {/* Right column stats */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Demand */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#fff8f3',
              borderRadius: 12,
              padding: '9px 12px',
              border: '1px solid rgba(234,88,12,0.15)',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316', flexShrink: 0 }} />
              <div>
                <div style={{ color: '#92400e', fontSize: 10, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>Demand</div>
                <div style={{ color: '#ea580c', fontSize: 13, fontWeight: 700, lineHeight: 1.1 }}>
                  +{weather.totalDemandIncreasePct}% {weather.city}
                </div>
              </div>
            </div>

            {/* Remaining or Achieved */}
            <div style={{
              background: goalAchieved ? '#f0fdf4' : '#f0f6ff',
              borderRadius: 12,
              padding: '9px 12px',
              border: goalAchieved ? '1px solid #86efac' : '1px solid rgba(10,108,188,0.1)',
            }}>
              <div style={{ color: goalAchieved ? '#166534' : '#5a7a9a', fontSize: 10, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
                {goalAchieved ? 'Status' : 'Remaining'}
              </div>
              <div style={{ color: goalAchieved ? '#15803d' : '#0a6cbc', fontSize: 17, fontWeight: 800, lineHeight: 1.1 }}>
                {goalAchieved ? 'Goal Reached! 🎉' : `${remaining} L`}
              </div>
              <div style={{ color: goalAchieved ? '#15803d' : '#8aaac8', fontSize: 10 }}>
                {goalAchieved ? 'Hydration complete' : 'to reach your goal'}
              </div>
            </div>

            {/* Micro progress bar */}
            <div>
              <div style={{ height: 6, background: '#e8eef5', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(pct * 100, 100)}%`,
                  background: goalAchieved
                    ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                    : 'linear-gradient(90deg, #0a6cbc, #00b4d8)',
                  borderRadius: 3,
                  transition: 'width 0.4s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ color: '#8aaac8', fontSize: 10 }}>0 L</span>
                <span style={{ color: '#8aaac8', fontSize: 10 }}>{dynamicTarget} L</span>
              </div>
            </div>
          </div>
        </div>

        {/* One-Tap Quick Log Pills */}
        <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
          <button
            type="button"
            onClick={() => handleQuickAdd(250)}
            style={{
              flex: 1,
              background: '#f0f6ff',
              border: '1px solid rgba(10,108,188,0.15)',
              borderRadius: 10,
              padding: '8px 4px',
              color: '#0a6cbc',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <span>+250 mL</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd(500)}
            style={{
              flex: 1,
              background: '#f0f6ff',
              border: '1px solid rgba(10,108,188,0.15)',
              borderRadius: 10,
              padding: '8px 4px',
              color: '#0a6cbc',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <span>+500 mL</span>
          </button>
          <button
            type="button"
            onClick={() => setShowLogSheet(true)}
            style={{
              flex: 1.2,
              background: 'linear-gradient(135deg, #0a6cbc, #00b4d8)',
              border: 'none',
              borderRadius: 10,
              padding: '8px 4px',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(10,108,188,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <span>+ Custom</span>
          </button>
        </div>

        {/* Next drink prompt */}
        <div style={{
          marginTop: 14,
          background: 'linear-gradient(135deg, #eff7ff, #e8f3fb)',
          border: '1px solid rgba(10,108,188,0.14)',
          borderRadius: 14,
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: '#0a6cbc',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#0a1929', fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>Next drink recommended in 25 min</div>
            <div style={{ color: '#5a7a9a', fontSize: 11, marginTop: 1 }}>250 mL at 1:30 PM ({weather.conditionText})</div>
          </div>
          <button
            type="button"
            onClick={() => setShowLogSheet(true)}
            style={{
              background: '#0a6cbc',
              border: 'none',
              borderRadius: 9,
              padding: '8px 14px',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Inter, system-ui, sans-serif',
              minHeight: 36,
              boxShadow: '0 2px 8px rgba(10,108,188,0.3)',
            }}
          >
            Log
          </button>
        </div>
      </div>

      {/* ── WHY YOUR TARGET CHANGED ── */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{
          background: '#fff',
          borderRadius: 20,
          border: '1px solid rgba(10,108,188,0.08)',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(10,50,100,0.06)',
        }}>
          {/* Card header */}
          <div style={{
            padding: '16px 18px 14px',
            borderBottom: '1px solid rgba(10,108,188,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: 'linear-gradient(135deg, #0a6cbc, #00b4d8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              <div>
                <div style={{ color: '#0d1b2a', fontSize: 15, fontWeight: 700 }}>Why your target changed</div>
                <div style={{ color: '#7a9ab5', fontSize: 12 }}>Driven by live telemetry in {weather.city}</div>
              </div>
            </div>
            <button
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#0a6cbc', fontSize: 12, fontWeight: 600,
                fontFamily: 'Inter, system-ui, sans-serif',
                padding: '4px 0',
                minHeight: 32,
              }}
            >
              {detailsExpanded ? 'Less' : 'Details'}
            </button>
          </div>

          {/* Factor rows */}
          <div style={{ padding: '14px 18px' }}>
            {factors.map((f, i) => (
              <div
                key={f.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  paddingBottom: i < factors.length - 1 ? 11 : 0,
                  marginBottom: i < factors.length - 1 ? 11 : 0,
                  borderBottom: i < factors.length - 1 ? '1px solid #f2f5f9' : 'none',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: f.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#1a2e40', fontSize: 13, fontWeight: 500 }}>{f.label}</div>
                  {detailsExpanded && (
                    <div style={{ color: '#8aaac8', fontSize: 11, marginTop: 2 }}>
                      {f.detail}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 64, height: 5, background: '#edf1f7', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min((f.value / 20) * 100, 100)}%`,
                      background: f.color,
                      borderRadius: 3,
                    }} />
                  </div>
                  <span style={{ color: f.color, fontSize: 13, fontWeight: 700, minWidth: 36, textAlign: 'right' }}>+{f.value}%</span>
                </div>
              </div>
            ))}

            <div style={{
              marginTop: 14,
              background: 'linear-gradient(135deg, #eff7ff, #e4f0fb)',
              borderRadius: 12,
              padding: '12px 14px',
              border: '1px solid rgba(10,108,188,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <div style={{ fontSize: 20, lineHeight: 1 }}>📈</div>
              <p style={{ margin: 0, color: '#1a3a5c', fontSize: 13, lineHeight: 1.5 }}>
                {weather.city}'s live conditions adjust your goal by <span style={{ color: '#0a6cbc', fontWeight: 700 }}>+{weather.totalDemandIncreasePct}%</span> today.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div style={{ padding: '12px 20px 0', display: 'flex', gap: 10 }}>
        <QuickAction
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a6cbc" strokeWidth="2" strokeLinecap="round">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          }
          iconBg="rgba(10,108,188,0.1)"
          label="Timeline"
          sub={`${hydraState.drinks.length} drinks today`}
          subColor="#5a7a9a"
          onClick={() => setShowTimeline(true)}
        />
        <QuickAction
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          }
          iconBg="rgba(124,58,237,0.1)"
          label="Electrolytes"
          sub="Moderate need"
          subColor="#7c3aed"
          onClick={() => setShowElectrolyte(true)}
        />
      </div>

      {/* Sheets */}
      {showTimeline && (
        <TimelineSheet timeline={timelineItems} onClose={() => setShowTimeline(false)} />
      )}
      {showElectrolyte && (
        <ElectrolyteSheet onClose={() => setShowElectrolyte(false)} />
      )}
      {showLogSheet && (
        <LogDrinkSheet onClose={() => setShowLogSheet(false)} />
      )}
    </div>
  )
}

function HydrationRing({
  pct,
  consumed,
  target,
  goalAchieved,
}: {
  pct: number
  consumed: number
  target: number
  goalAchieved: boolean
}) {
  const size = 180
  const r = 72
  const strokeW = 13
  const cx = size / 2
  const cy = size / 2
  const circ = 2 * Math.PI * r
  const cappedPct = Math.min(pct, 1)
  const dashOffset = circ * (1 - cappedPct)

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="ringGrad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={goalAchieved ? '#4ade80' : '#00c8e8'} />
            <stop offset="100%" stopColor={goalAchieved ? '#22c55e' : '#0a6cbc'} />
          </linearGradient>
          <filter id="ringGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e4ebf4" strokeWidth={strokeW} />

        {/* Fill arc */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="url(#ringGrad2)"
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${cx} ${cy})`}
          filter="url(#ringGlow)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />

        {/* Tick dot at end */}
        <circle
          cx={cx + r * Math.cos(-Math.PI / 2 + 2 * Math.PI * cappedPct)}
          cy={cy + r * Math.sin(-Math.PI / 2 + 2 * Math.PI * cappedPct)}
          r="5"
          fill="#fff"
          stroke={goalAchieved ? '#22c55e' : '#0a6cbc'}
          strokeWidth="2"
          style={{ transition: 'all 0.5s ease' }}
        />
      </svg>

      {/* Center content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ color: '#0d1b2a', fontSize: 28, fontWeight: 800, lineHeight: 1, letterSpacing: -1 }}>
          {consumed}<span style={{ fontSize: 16, fontWeight: 500, color: '#8aaac8', letterSpacing: 0 }}>L</span>
        </div>
        <div style={{ color: '#8aaac8', fontSize: 11, marginTop: 2, letterSpacing: 0.2 }}>of {target} L</div>
        <div style={{
          marginTop: 8,
          background: goalAchieved
            ? 'linear-gradient(135deg, #22c55e, #16a34a)'
            : 'linear-gradient(135deg, #0a6cbc, #00b4d8)',
          borderRadius: 20,
          padding: '3px 12px',
          boxShadow: goalAchieved ? '0 2px 8px rgba(34,197,94,0.3)' : 'none',
        }}>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>
            {Math.round(pct * 100)}%
          </span>
        </div>
      </div>
    </div>
  )
}

function QuickAction({
  icon, iconBg, label, sub, subColor, onClick,
}: {
  icon: React.ReactNode
  iconBg: string
  label: string
  sub: string
  subColor: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        background: '#fff',
        border: '1px solid rgba(10,108,188,0.09)',
        borderRadius: 16,
        padding: '13px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        minHeight: 56,
        fontFamily: 'Inter, system-ui, sans-serif',
        boxShadow: '0 1px 6px rgba(10,50,100,0.05)',
        textAlign: 'left',
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: 9,
        background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ color: '#0d1b2a', fontSize: 13, fontWeight: 600 }}>{label}</div>
        <div style={{ color: subColor, fontSize: 11, marginTop: 1 }}>{sub}</div>
      </div>
    </button>
  )
}

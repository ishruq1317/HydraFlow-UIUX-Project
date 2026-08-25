import { useEffect, useState } from 'react'
import { hydrationService, type HydrationState } from '../services/hydration'
import { weatherService, type LiveWeatherData } from '../services/weather'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today']
const pastWeekValues = [2.2, 2.4, 2.3, 2.9, 2.5, 2.1] // Mon - Sat past days
const pastWeekTargets = [2.4, 2.4, 2.4, 2.8, 2.5, 2.2]

export default function InsightsScreen() {
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

  const todayConsumed = hydraState.consumedLiters
  const todayTarget = hydraState.targetLiters

  const weekValues = [...pastWeekValues, todayConsumed]
  const weekTargets = [...pastWeekTargets, todayTarget]

  const totalConsumedWeek = weekValues.reduce((a, b) => a + b, 0)
  const avgDailyIntake = Math.round((totalConsumedWeek / 7) * 10) / 10

  const daysGoalMet = weekValues.filter((v, i) => v >= weekTargets[i]).length
  const goalAchievementPct = Math.round((daysGoalMet / 7) * 100)

  const maxVal = Math.max(...weekValues, ...weekTargets, 3.5)
  const chartH = 110
  const totalW = 310
  const barW = (totalW / 7) * 0.55

  // Date range formatted
  const now = new Date()
  const weekRangeStr = `${new Date(now.getTime() - 6 * 86400000).toLocaleDateString([], { month: 'short', day: 'numeric' })} – ${now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`

  return (
    <div style={{ background: '#f2f5f9', minHeight: '100%', paddingBottom: 28 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(175deg, #071525 0%, #0b2d4e 100%)',
        padding: '18px 24px 24px',
      }}>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: '0 0 3px', letterSpacing: -0.3 }}>
          Weekly Health Insights
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0 }}>
          {weekRangeStr} · 📍 {weather.city}
        </p>
      </div>

      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Key stats 2×2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Avg daily intake', value: `${avgDailyIntake} L`, sub: '+0.3 L vs baseline', trend: true, color: '#22c55e' },
            { label: 'Goal achievement', value: `${goalAchievementPct}%`, sub: `${daysGoalMet} of 7 days hit goal`, trend: true, color: '#0a6cbc' },
            { label: 'Top Intake Day', value: 'Thursday', sub: '2.9 L — Personal Best', trend: false, color: '#7c3aed' },
            { label: 'Weather Impact', value: `+${weather.totalDemandIncreasePct}%`, sub: `Driven by ${weather.city} heat`, trend: false, color: '#e8510a' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: '#fff',
              borderRadius: 16,
              padding: '14px 15px',
              border: '1px solid rgba(10,108,188,0.08)',
              boxShadow: '0 1px 6px rgba(10,50,100,0.05)',
            }}>
              <div style={{ color: '#8aaac8', fontSize: 10, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 5 }}>
                {stat.label}
              </div>
              <div style={{ color: stat.color, fontSize: 20, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.1 }}>
                {stat.value}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                {stat.trend && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="3" strokeLinecap="round">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                )}
                <span style={{ color: stat.trend ? stat.color : '#94a3b8', fontSize: 11, lineHeight: 1.3 }}>{stat.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly chart */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '18px 18px 14px',
          border: '1px solid rgba(10,108,188,0.08)',
          boxShadow: '0 1px 8px rgba(10,50,100,0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <div style={{ color: '#0d1b2a', fontSize: 15, fontWeight: 700 }}>Hydration vs. Target</div>
              <div style={{ color: '#8aaac8', fontSize: 12, marginTop: 2 }}>Litres per day this week</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 4, borderRadius: 2, background: '#0a6cbc' }} />
                <span style={{ color: '#94a3b8', fontSize: 10 }}>Consumed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 3, borderRadius: 2, background: '#e2eaf3', border: '1px dashed #94a3b8' }} />
                <span style={{ color: '#94a3b8', fontSize: 10 }}>Target</span>
              </div>
            </div>
          </div>

          {/* SVG chart */}
          <svg width="100%" viewBox={`0 0 ${totalW} ${chartH + 30}`} style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="insightBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00c8e8" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#0a6cbc" stopOpacity="0.75" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0.33, 0.66, 1].map((frac) => (
              <line key={frac}
                x1="0" y1={chartH - chartH * frac}
                x2={totalW} y2={chartH - chartH * frac}
                stroke="#edf1f7" strokeWidth="1"
              />
            ))}

            {weekDays.map((day, i) => {
              const val = weekValues[i]
              const target = weekTargets[i]
              const isToday = i === 6
              const metGoal = val >= target
              const colX = (totalW / 7) * i + totalW / 14
              const barH = (val / maxVal) * chartH
              const targetY = chartH - (target / maxVal) * chartH

              return (
                <g key={day}>
                  {/* Bar */}
                  <rect
                    x={colX - barW / 2}
                    y={chartH - barH}
                    width={barW}
                    height={barH}
                    fill={isToday ? 'url(#insightBarGrad)' : (metGoal ? 'rgba(10,108,188,0.6)' : '#c4cfd8')}
                    rx="4"
                    style={{ transition: 'all 0.5s ease' }}
                  />
                  {/* Target tick line */}
                  <line
                    x1={colX - barW / 2 - 3}
                    y1={targetY}
                    x2={colX + barW / 2 + 3}
                    y2={targetY}
                    stroke={metGoal ? '#22c55e' : '#f97316'}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Today dot */}
                  {isToday && (
                    <circle cx={colX} cy={chartH - barH - 7} r="4" fill="#0a6cbc" />
                  )}
                  {/* Day label */}
                  <text x={colX} y={chartH + 14} textAnchor="middle"
                    fill={isToday ? '#0a6cbc' : '#94a3b8'} fontSize="10"
                    fontWeight={isToday ? '700' : '400'}
                    fontFamily="Inter, system-ui, sans-serif">
                    {day}
                  </text>
                  {/* Value label */}
                  <text x={colX} y={chartH + 26} textAnchor="middle"
                    fill={isToday ? '#0d1b2a' : '#94a3b8'} fontSize="9"
                    fontWeight={isToday ? '700' : '400'}
                    fontFamily="Inter, system-ui, sans-serif">
                    {val}L
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Goal Consistency Heatmap */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '18px',
          border: '1px solid rgba(10,108,188,0.08)',
          boxShadow: '0 1px 8px rgba(10,50,100,0.05)',
        }}>
          <div style={{ color: '#0d1b2a', fontSize: 15, fontWeight: 700, marginBottom: 3 }}>Goal Consistency Matrix</div>
          <div style={{ color: '#8aaac8', fontSize: 12, marginBottom: 14 }}>Daily target completion history</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {weekDays.map((day, i) => {
              const val = weekValues[i]
              const target = weekTargets[i]
              const met = val >= target
              const isToday = i === 6
              return (
                <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: isToday && !met ? 'rgba(248,115,22,0.12)' : met ? 'rgba(34,197,94,0.1)' : '#f2f5f9',
                    border: isToday ? `2px solid ${met ? '#22c55e' : '#f97316'}` : '2px solid transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14,
                  }}>
                    <span style={{ color: met ? '#22c55e' : '#94a3b8', fontSize: 13, fontWeight: 700 }}>
                      {met ? '✓' : isToday ? '…' : '–'}
                    </span>
                  </div>
                  <span style={{ color: isToday ? '#0a6cbc' : '#94a3b8', fontSize: 10, fontWeight: isToday ? 700 : 400 }}>{day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Streak card */}
        <div style={{
          background: 'linear-gradient(135deg, #071525, #0a3558)',
          borderRadius: 20,
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: '0 4px 20px rgba(7,21,37,0.25)',
        }}>
          <div style={{
            width: 54, height: 54, borderRadius: 16,
            background: 'rgba(0,180,216,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, border: '1px solid rgba(0,180,216,0.2)',
          }}>
            🔥
          </div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 3 }}>
              Current Streak
            </div>
            <div style={{ color: '#fff', fontSize: 26, fontWeight: 800, lineHeight: 1, letterSpacing: -0.5 }}>
              {daysGoalMet} Days
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 3 }}>
              {daysGoalMet >= 5 ? 'Exceptional consistency! Keep it up.' : 'Log your drinks daily to maintain streak.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

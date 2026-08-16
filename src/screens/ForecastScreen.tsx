import { useState } from 'react'

type Tab = 'Today' | 'Tomorrow' | '7 Days'

const hourlyData = [
  { hour: '7', recommended: 200, actual: 220, demand: 190 },
  { hour: '9', recommended: 250, actual: 240, demand: 265 },
  { hour: '11', recommended: 200, actual: 190, demand: 215 },
  { hour: '13', recommended: 300, actual: 275, demand: 345 },
  { hour: '15', recommended: 250, actual: 0, demand: 315 },
  { hour: '17', recommended: 300, actual: 0, demand: 360 },
  { hour: '19', recommended: 200, actual: 0, demand: 185 },
]

const weekData = [
  { day: 'Mon', target: 2.4, actual: 2.2, demand: 2.5 },
  { day: 'Tue', target: 2.6, actual: 2.5, demand: 2.8 },
  { day: 'Wed', target: 2.2, actual: 2.4, demand: 2.1 },
  { day: 'Thu', target: 2.8, actual: 2.9, demand: 3.0 },
  { day: 'Fri', target: 2.5, actual: 2.3, demand: 2.6 },
  { day: 'Sat', target: 2.0, actual: 1.8, demand: 2.1 },
  { day: 'Sun', target: 2.8, actual: 1.4, demand: 3.1 },
]

const weatherImpact = [
  { label: 'Temperature', value: 12, detail: '29°C → +0.3 L today', color: '#e8510a' },
  { label: 'Humidity', value: 8, detail: '78% → +0.2 L today', color: '#0891b2' },
  { label: 'UV Index', value: 5, detail: 'High UV (7) — increases sweat', color: '#d97706' },
  { label: 'Wind speed', value: 2, detail: '12 km/h — minor factor', color: '#64748b' },
]

const peakInsights: Record<Tab, string> = {
  Today: 'Demand peaks between 1–4 PM due to high humidity and your scheduled gym session.',
  Tomorrow: 'Forecast shows moderate demand throughout the day with a slight evening drop.',
  '7 Days': 'Thursday was your highest-demand day this week — heat and outdoor activity combined.',
}

export default function ForecastScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('Today')

  const summaryVal = activeTab === '7 Days' ? '2.5 L' : '2.8 L'
  const summaryLabel = activeTab === '7 Days' ? 'weekly avg' : 'today'

  return (
    <div style={{ background: '#f2f5f9', minHeight: '100%', paddingBottom: 28 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(175deg, #071525 0%, #0b2d4e 100%)',
        padding: '18px 24px 24px',
      }}>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: '0 0 3px', letterSpacing: -0.3 }}>
          Hydration Forecast
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '0 0 18px' }}>
          Predicted demand based on today's signals
        </p>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.07)',
          borderRadius: 13,
          padding: 4,
          gap: 3,
          border: '1px solid rgba(255,255,255,0.07)',
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
                padding: '9px 6px',
                color: activeTab === tab ? '#071525' : 'rgba(255,255,255,0.5)',
                fontSize: 13,
                fontWeight: activeTab === tab ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.18s',
                fontFamily: 'Inter, system-ui, sans-serif',
                minHeight: 38,
                boxShadow: activeTab === tab ? '0 1px 6px rgba(0,0,0,0.15)' : 'none',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Summary stat row */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: 'Predicted target', value: summaryVal, sub: summaryLabel, color: '#0a6cbc', bg: '#eff6ff' },
            { label: 'Demand level', value: 'Moderate', sub: 'heat + activity', color: '#e8510a', bg: '#fff3ee' },
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
              <div style={{ color: card.color, fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>{card.value}</div>
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
                {activeTab === '7 Days' ? 'Weekly Overview' : activeTab === 'Today' ? "Today's Timeline" : "Tomorrow's Forecast"}
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
          <div style={{ color: '#0d1b2a', fontSize: 15, fontWeight: 700, marginBottom: 3 }}>Weather Influence</div>
          <div style={{ color: '#8aaac8', fontSize: 12, marginBottom: 16 }}>How today's conditions shift your target</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {weatherImpact.map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ color: item.color, fontSize: 13, fontWeight: 700 }}>+{item.value}%</span>
                </div>
                <div style={{ flex: 1, height: 6, background: '#edf1f7', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(item.value / 15) * 100}%`,
                    background: item.color,
                    borderRadius: 3,
                    maxWidth: '100%',
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

        {/* Calendar schedule card */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '18px',
          border: '1px solid rgba(10,108,188,0.08)',
          boxShadow: '0 1px 8px rgba(10,50,100,0.05)',
        }}>
          <div style={{ color: '#0d1b2a', fontSize: 15, fontWeight: 700, marginBottom: 3 }}>Schedule Intelligence</div>
          <div style={{ color: '#8aaac8', fontSize: 12, marginBottom: 16 }}>How your calendar shapes the forecast</div>
          {[
            { time: '10:00 AM', event: 'Lecture', impact: 'Low', delta: null, color: '#94a3b8' },
            { time: '1:00 PM', event: 'Gym', impact: 'High', delta: '+250 mL', color: '#0891b2' },
            { time: '3:30 PM', event: 'Outdoor commute', impact: 'High', delta: '+180 mL', color: '#0a6cbc' },
            { time: '6:00 PM', event: 'Study session', impact: 'Low', delta: null, color: '#94a3b8' },
          ].map((item, i, arr) => (
            <div key={item.event} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              paddingBottom: i < arr.length - 1 ? 12 : 0,
              marginBottom: i < arr.length - 1 ? 12 : 0,
              borderBottom: i < arr.length - 1 ? '1px solid #f2f5f9' : 'none',
            }}>
              <div style={{
                width: 3, height: 42, borderRadius: 2,
                background: item.color, flexShrink: 0,
                opacity: item.impact === 'High' ? 1 : 0.3,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: '#8aaac8', fontSize: 11 }}>{item.time}</div>
                <div style={{ color: '#0d1b2a', fontSize: 14, fontWeight: 500, marginTop: 1 }}>{item.event}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                <div style={{
                  background: item.impact === 'High' ? `${item.color}18` : '#f8f9fb',
                  color: item.impact === 'High' ? item.color : '#94a3b8',
                  borderRadius: 7, padding: '3px 9px',
                  fontSize: 11, fontWeight: 600,
                }}>
                  {item.impact} impact
                </div>
                {item.delta && <div style={{ color: item.color, fontSize: 12, fontWeight: 700 }}>{item.delta}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HourlyChart({ data, isTomorrow }: { data: typeof hourlyData; isTomorrow: boolean }) {
  const maxVal = 400
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
        {/* Grid lines */}
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
              {/* Demand bar (background) */}
              <rect x={cx - barW * 1.5} y={chartH - demH} width={barW * 3} height={demH}
                fill="url(#demGrad)" rx="3" opacity="0.45"
              />
              {/* Recommended bar */}
              <rect x={cx - barW / 2 - (isTomorrow ? 0 : 4)} y={chartH - recH} width={barW} height={recH}
                fill="url(#recGrad)" rx="3"
                opacity={isPast ? 0.5 : 1}
              />
              {/* Actual bar */}
              {!isTomorrow && d.actual > 0 && (
                <rect x={cx + barW / 2 - 2} y={chartH - actH} width={barW} height={actH}
                  fill="url(#actGrad)" rx="3"
                />
              )}
              {/* "Now" marker */}
              {isNow && (
                <line x1={cx} y1={0} x2={cx} y2={chartH}
                  stroke="#0a6cbc" strokeWidth="1" strokeDasharray="4 3" opacity="0.4"
                />
              )}
              {/* Hour label */}
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

function WeeklyChart({ data }: { data: typeof weekData }) {
  const maxVal = 3.5
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
        {/* Grid */}
        {[0.5, 1].map((frac) => (
          <line key={frac}
            x1="0" y1={chartH - chartH * frac}
            x2={totalWidth} y2={chartH - chartH * frac}
            stroke="#edf1f7" strokeWidth="1"
          />
        ))}
        {/* Y axis labels */}
        {['1.75L', '3.5L'].map((label, i) => (
          <text key={label} x={totalWidth + 4} y={chartH - chartH * (i === 0 ? 0.5 : 1) + 4}
            fill="#c0ccda" fontSize="9" fontFamily="Inter, system-ui, sans-serif">
            {label}
          </text>
        ))}

        {data.map((d, i) => {
          const isToday = i === 6
          const cx = barGroupW * i + barGroupW / 2
          const actualH = (d.actual / maxVal) * chartH
          const targetH = (d.target / maxVal) * chartH
          const metGoal = d.actual >= d.target

          return (
            <g key={d.day}>
              {/* Bar */}
              <rect x={cx - barW / 2} y={chartH - actualH} width={barW} height={actualH}
                fill={metGoal ? 'url(#wkActGrad)' : '#c4cfd8'} rx="4"
                opacity={isToday ? 1 : 0.65}
              />
              {/* Target tick */}
              <line
                x1={cx - barW / 2 - 3} y1={chartH - targetH}
                x2={cx + barW / 2 + 3} y2={chartH - targetH}
                stroke={metGoal ? '#22c55e' : '#f97316'} strokeWidth="2" strokeLinecap="round"
              />
              {/* Today indicator dot above bar */}
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

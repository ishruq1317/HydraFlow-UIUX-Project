import { useState } from 'react'
import TimelineSheet from '../components/TimelineSheet'
import ElectrolyteSheet from '../components/ElectrolyteSheet'

const FACTORS = [
  { label: 'Heat', value: 12, icon: '🌡', color: '#e8510a', bg: '#fff3ee' },
  { label: 'Humidity', value: 8, icon: '💧', color: '#0891b2', bg: '#ecfeff' },
  { label: 'Activity', value: 15, icon: '⚡', color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Schedule', value: 5, icon: '📅', color: '#0a6cbc', bg: '#eff6ff' },
]

const TIMELINE: { time: string; amount: number; status: 'done' | 'next' | 'upcoming' }[] = [
  { time: '9:00 AM', amount: 250, status: 'done' },
  { time: '11:15 AM', amount: 200, status: 'done' },
  { time: '1:30 PM', amount: 300, status: 'next' },
  { time: '3:45 PM', amount: 250, status: 'upcoming' },
  { time: '6:30 PM', amount: 300, status: 'upcoming' },
]

export default function HomeScreen() {
  const [showTimeline, setShowTimeline] = useState(false)
  const [showElectrolyte, setShowElectrolyte] = useState(false)
  const [detailsExpanded, setDetailsExpanded] = useState(false)
  const consumed = 1.4
  const target = 2.8
  const pct = consumed / target

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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 4px', letterSpacing: 0.1 }}>
              Good morning, Jamie
            </p>
            <h1 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
              Your plan has adapted<br />
              <span style={{ color: '#48cbe0', fontWeight: 400, fontSize: 16 }}>to today's conditions.</span>
            </h1>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0a6cbc 0%, #00b4d8 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid rgba(255,255,255,0.15)',
          }}>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>JM</span>
          </div>
        </div>

        {/* Weather strip */}
        <div style={{
          background: 'rgba(255,255,255,0.07)',
          borderRadius: 14,
          padding: '11px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: '1px solid rgba(255,255,255,0.09)',
        }}>
          <span style={{ fontSize: 22, lineHeight: 1 }}>🌤</span>
          <div style={{ display: 'flex', gap: 14, flex: 1 }}>
            <div>
              <div style={{ color: '#fff', fontSize: 17, fontWeight: 700, lineHeight: 1.1 }}>29°C</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 1 }}>Partly cloudy</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
            <div>
              <div style={{ color: '#7dd8ed', fontSize: 13, fontWeight: 500 }}>78% humidity</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 1 }}>Feels like 34°C</div>
            </div>
          </div>
          <div style={{
            background: 'rgba(234,88,12,0.22)',
            border: '1px solid rgba(234,88,12,0.35)',
            borderRadius: 8,
            padding: '5px 9px',
            textAlign: 'center',
            lineHeight: 1.2,
          }}>
            <span style={{ color: '#fb923c', fontSize: 10, fontWeight: 700, letterSpacing: 0.3 }}>HIGH<br />HEAT</span>
          </div>
        </div>
      </div>

      {/* ── HYDRATION RING ── */}
      <div style={{
        background: '#fff',
        marginTop: 0,
        padding: '28px 24px 24px',
        borderBottom: '1px solid rgba(10,108,188,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <HydrationRing pct={pct} consumed={consumed} target={target} />

          {/* Right column stats */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Demand */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#fff8f3',
              borderRadius: 12,
              padding: '10px 12px',
              border: '1px solid rgba(234,88,12,0.15)',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316', flexShrink: 0 }} />
              <div>
                <div style={{ color: '#92400e', fontSize: 10, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>Demand</div>
                <div style={{ color: '#ea580c', fontSize: 14, fontWeight: 700, lineHeight: 1.1 }}>MODERATE</div>
              </div>
            </div>

            {/* Remaining */}
            <div style={{
              background: '#f0f6ff',
              borderRadius: 12,
              padding: '10px 12px',
              border: '1px solid rgba(10,108,188,0.1)',
            }}>
              <div style={{ color: '#5a7a9a', fontSize: 10, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>Remaining</div>
              <div style={{ color: '#0a6cbc', fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>1.4 L</div>
              <div style={{ color: '#8aaac8', fontSize: 11 }}>to reach your goal</div>
            </div>

            {/* Progress bar micro */}
            <div>
              <div style={{ height: 6, background: '#e8eef5', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${pct * 100}%`,
                  background: 'linear-gradient(90deg, #0a6cbc, #00b4d8)',
                  borderRadius: 3,
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ color: '#8aaac8', fontSize: 10 }}>0 L</span>
                <span style={{ color: '#8aaac8', fontSize: 10 }}>2.8 L</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next drink prompt — full width below ring */}
        <div style={{
          marginTop: 20,
          background: 'linear-gradient(135deg, #eff7ff, #e8f3fb)',
          border: '1px solid rgba(10,108,188,0.14)',
          borderRadius: 14,
          padding: '13px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: '#0a6cbc',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#0a1929', fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>Next drink in 25 min</div>
            <div style={{ color: '#5a7a9a', fontSize: 12, marginTop: 1 }}>250 mL recommended at 1:30 PM</div>
          </div>
          <button style={{
            background: '#0a6cbc',
            border: 'none',
            borderRadius: 10,
            padding: '9px 15px',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
            minHeight: 38,
            minWidth: 50,
          }}>
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
                <div style={{ color: '#7a9ab5', fontSize: 12 }}>4 factors driving today's plan</div>
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
            {FACTORS.map((f, i) => (
              <div
                key={f.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  paddingBottom: i < FACTORS.length - 1 ? 11 : 0,
                  marginBottom: i < FACTORS.length - 1 ? 11 : 0,
                  borderBottom: i < FACTORS.length - 1 ? '1px solid #f2f5f9' : 'none',
                }}
              >
                {/* Icon chip */}
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: f.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                {/* Label */}
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#1a2e40', fontSize: 13, fontWeight: 500 }}>{f.label}</div>
                  {detailsExpanded && (
                    <div style={{ color: '#8aaac8', fontSize: 11, marginTop: 2 }}>
                      {f.label === 'Heat' && '29°C ambient — higher than your avg 22°C'}
                      {f.label === 'Humidity' && '78% relative humidity increases sweat rate'}
                      {f.label === 'Activity' && 'Gym session adds est. 600–800 mL sweat loss'}
                      {f.label === 'Schedule' && 'Busy afternoon reduces natural drink triggers'}
                    </div>
                  )}
                </div>
                {/* Bar + value */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 64, height: 5, background: '#edf1f7', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(f.value / 20) * 100}%`,
                      background: f.color,
                      borderRadius: 3,
                    }} />
                  </div>
                  <span style={{ color: f.color, fontSize: 13, fontWeight: 700, minWidth: 36, textAlign: 'right' }}>+{f.value}%</span>
                </div>
              </div>
            ))}

            {/* Summary callout */}
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
                Today's target is <span style={{ color: '#0a6cbc', fontWeight: 700 }}>40% higher</span> than your typical day.
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
          sub="5 sessions today"
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

      {/* ── TODAY'S SCHEDULE IMPACT ── */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h3 style={{ margin: 0, color: '#0d1b2a', fontSize: 15, fontWeight: 700 }}>Today's Schedule Impact</h3>
          <span style={{ color: '#0a6cbc', fontSize: 13, fontWeight: 500 }}>View all</span>
        </div>
        <div style={{
          background: '#fff',
          borderRadius: 18,
          border: '1px solid rgba(10,108,188,0.08)',
          overflow: 'hidden',
          boxShadow: '0 1px 8px rgba(10,50,100,0.05)',
        }}>
          {[
            { time: '10:00 AM', event: 'Lecture', impact: 'Low', delta: null, color: '#94a3b8', impactBg: '#f8f9fb' },
            { time: '1:00 PM', event: 'Gym session', impact: 'High', delta: '+250 mL', color: '#0891b2', impactBg: '#ecfeff' },
            { time: '3:30 PM', event: 'Outdoor commute', impact: 'High', delta: '+180 mL', color: '#0a6cbc', impactBg: '#eff6ff' },
            { time: '6:00 PM', event: 'Study session', impact: 'Low', delta: null, color: '#94a3b8', impactBg: '#f8f9fb' },
          ].map((item, i, arr) => (
            <div key={item.event} style={{
              padding: '13px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              borderBottom: i < arr.length - 1 ? '1px solid #f2f5f9' : 'none',
            }}>
              {/* Impact accent bar */}
              <div style={{
                width: 3,
                height: 38,
                borderRadius: 2,
                background: item.color,
                flexShrink: 0,
                opacity: item.impact === 'High' ? 1 : 0.35,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: '#8aaac8', fontSize: 11, marginBottom: 2 }}>{item.time}</div>
                <div style={{ color: '#0d1b2a', fontSize: 14, fontWeight: 500 }}>{item.event}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                <div style={{
                  background: item.impactBg,
                  color: item.impact === 'High' ? item.color : '#94a3b8',
                  borderRadius: 7,
                  padding: '3px 9px',
                  fontSize: 11,
                  fontWeight: 600,
                  border: item.impact === 'High' ? `1px solid ${item.color}25` : '1px solid transparent',
                }}>
                  {item.impact} impact
                </div>
                {item.delta && (
                  <div style={{ color: item.color, fontSize: 12, fontWeight: 700 }}>{item.delta}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showTimeline && <TimelineSheet timeline={TIMELINE} onClose={() => setShowTimeline(false)} />}
      {showElectrolyte && <ElectrolyteSheet onClose={() => setShowElectrolyte(false)} />}
    </div>
  )
}

function HydrationRing({ pct, consumed, target }: { pct: number; consumed: number; target: number }) {
  const size = 180
  const r = 72
  const strokeW = 13
  const cx = size / 2
  const cy = size / 2
  const circ = 2 * Math.PI * r
  const dashOffset = circ * (1 - pct)

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="ringGrad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00c8e8" />
            <stop offset="100%" stopColor="#0a6cbc" />
          </linearGradient>
          {/* Drop shadow filter for ring */}
          <filter id="ringGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {/* Outer background ring */}
        <circle cx={cx} cy={cy} r={r + strokeW / 2 + 4}
          fill="none" stroke="rgba(10,108,188,0.05)" strokeWidth="1" />
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="#e4ebf4" strokeWidth={strokeW} />
        {/* Fill arc */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="url(#ringGrad2)"
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${cx} ${cy})`}
          filter="url(#ringGlow)"
        />
        {/* Tick at 100% end */}
        <circle
          cx={cx + r * Math.cos(-Math.PI / 2 + 2 * Math.PI * pct)}
          cy={cy + r * Math.sin(-Math.PI / 2 + 2 * Math.PI * pct)}
          r="5"
          fill="#fff"
          stroke="#0a6cbc"
          strokeWidth="2"
        />
      </svg>

      {/* Center content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ color: '#0d1b2a', fontSize: 30, fontWeight: 800, lineHeight: 1, letterSpacing: -1 }}>
          {consumed}<span style={{ fontSize: 16, fontWeight: 500, color: '#8aaac8', letterSpacing: 0 }}>L</span>
        </div>
        <div style={{ color: '#8aaac8', fontSize: 11, marginTop: 2, letterSpacing: 0.2 }}>of {target} L</div>
        <div style={{
          marginTop: 9,
          background: 'linear-gradient(135deg, #0a6cbc, #00b4d8)',
          borderRadius: 20,
          padding: '4px 14px',
        }}>
          <span style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>{Math.round(pct * 100)}%</span>
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

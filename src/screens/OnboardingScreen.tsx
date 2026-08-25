import { useState } from 'react'

interface Props {
  onComplete: (activityLevel?: string) => void
  formattedTime?: string
}

const steps = [
  {
    key: 'welcome',
    title: 'Hydration that adapts\nto your day.',
    subtitle: 'HydraFlow learns your body, your schedule, and your environment — then builds a hydration plan that actually fits your life.',
    cta: 'Get Started',
    visual: 'drop',
  },
  {
    key: 'bottle',
    title: 'Connect your\nsmart bottle.',
    subtitle: 'HydraFlow pairs with your smart bottle to track intake automatically — no manual logging needed.',
    cta: 'Connect Bottle',
    skip: 'Skip for now',
    visual: 'bottle',
  },
  {
    key: 'activity',
    title: "Tell us about\nyour lifestyle.",
    subtitle: 'We use this to calibrate your baseline and estimate sweat rate accurately.',
    cta: 'Continue',
    visual: 'activity',
  },
  {
    key: 'location',
    title: 'Weather-aware\nhydration.',
    subtitle: 'HydraFlow adjusts your targets in real time based on temperature, humidity, and UV index.',
    cta: 'Enable Location',
    skip: 'Not now',
    visual: 'weather',
  },
  {
    key: 'calendar',
    title: 'Let your schedule\nshape your plan.',
    subtitle: "Connecting your calendar lets HydraFlow predict high-demand periods — like a gym session or a long commute — before they happen.",
    cta: 'Connect Calendar',
    skip: 'Skip',
    visual: 'calendar',
  },
]

const activityLevels = ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active']

export default function OnboardingScreen({ onComplete, formattedTime }: Props) {
  const [step, setStep] = useState(0)
  const [activity, setActivity] = useState('Moderate')

  // Fallback local time if not passed
  const [localTime] = useState(() => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))
  
  const displayTime = formattedTime || localTime

  const current = steps[step]
  const progress = (step + 1) / steps.length

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1)
    else onComplete(activity)
  }

  return (
    <div style={{ width: '100%', height: '100%', background: '#0a1929', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(0,180,216,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Status bar */}
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0, position: 'relative', zIndex: 2 }}>
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: 0.1 }}>{displayTime}</span>
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          {/* Signal */}
          <svg width="17" height="12" viewBox="0 0 17 12" fill="rgba(255,255,255,0.85)">
            <rect x="0" y="5" width="3" height="7" rx="1" />
            <rect x="4.5" y="3" width="3" height="9" rx="1" />
            <rect x="9" y="1" width="3" height="11" rx="1" />
            <rect x="13.5" y="0" width="3" height="12" rx="1" />
          </svg>

          {/* WiFi */}
          <svg width="16" height="12" viewBox="0 0 24 16" fill="rgba(255,255,255,0.85)">
            <path d="M1 5C5.2 1.4 9.4 0 12 0s6.8 1.4 11 5L12 16z" />
          </svg>

          {/* Battery */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 23, height: 12, border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: 3.5, padding: '1.5px 2px', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '78%', height: '100%', background: '#4ade80', borderRadius: 2 }} />
            </div>
            <div style={{ width: 2, height: 5, background: 'rgba(255,255,255,0.4)', borderRadius: '0 1px 1px 0', marginLeft: 1 }} />
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: 'rgba(255,255,255,0.1)', margin: '0 24px', borderRadius: 2, position: 'relative', zIndex: 2 }}>
        <div style={{ height: '100%', width: `${progress * 100}%`, background: '#00b4d8', borderRadius: 2, transition: 'width 0.5s ease' }} />
      </div>

      {/* Visual */}
      <div style={{ flex: '0 0 280px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <OnboardingVisual type={current.visual} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '0 28px 24px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, lineHeight: 1.25, whiteSpace: 'pre-line', margin: '0 0 12px' }}>
          {current.title}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.6, margin: '0 0 20px' }}>
          {current.subtitle}
        </p>

        {/* Activity selector on step 2 */}
        {current.key === 'activity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {activityLevels.map((level) => (
              <button
                key={level}
                onClick={() => setActivity(level)}
                style={{
                  background: activity === level ? 'rgba(0,180,216,0.2)' : 'rgba(255,255,255,0.06)',
                  border: activity === level ? '1.5px solid #00b4d8' : '1.5px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  padding: '12px 16px',
                  color: activity === level ? '#00b4d8' : 'rgba(255,255,255,0.7)',
                  fontSize: 14,
                  fontWeight: activity === level ? 600 : 400,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {level}
              </button>
            ))}
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={next}
            style={{
              background: 'linear-gradient(135deg, #0a6cbc, #00b4d8)',
              border: 'none',
              borderRadius: 14,
              padding: '16px',
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, system-ui, sans-serif',
              minHeight: 52,
            }}
          >
            {step === steps.length - 1 ? "I'm ready" : current.cta}
          </button>
          {current.skip && (
            <button
              onClick={next}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 14, cursor: 'pointer', padding: '8px', fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {current.skip}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function OnboardingVisual({ type }: { type: string }) {
  if (type === 'drop') {
    return (
      <div style={{ position: 'relative', width: 160, height: 180 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle, rgba(0,180,216,0.3) 0%, transparent 70%)',
          borderRadius: '50%', transform: 'scale(1.4)',
        }} />
        <svg viewBox="0 0 160 180" width="160" height="180">
          <defs>
            <linearGradient id="dropGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00b4d8" />
              <stop offset="100%" stopColor="#0077b6" />
            </linearGradient>
          </defs>
          <path
            d="M80 20 C80 20, 30 80, 30 115 C30 145, 52 165, 80 165 C108 165, 130 145, 130 115 C130 80, 80 20, 80 20Z"
            fill="url(#dropGrad)"
            opacity="0.9"
          />
          <path
            d="M80 30 C80 30, 40 85, 40 115 C40 140, 58 155, 80 155"
            fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"
          />
          {/* Percentage fill wave */}
          <clipPath id="dropClip">
            <path d="M80 20 C80 20, 30 80, 30 115 C30 145, 52 165, 80 165 C108 165, 130 145, 130 115 C130 80, 80 20, 80 20Z" />
          </clipPath>
          <rect x="30" y="100" width="100" height="70" fill="rgba(255,255,255,0.15)" clipPath="url(#dropClip)" />
          <text x="80" y="118" textAnchor="middle" fill="white" fontSize="22" fontWeight="700" fontFamily="Inter">50%</text>
          <text x="80" y="136" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="Inter">hydrated</text>
        </svg>
        <div style={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 32 }}>
          {['1.4L', '2.8L'].map((v, i) => (
            <div key={v} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={{ color: i === 0 ? '#00b4d8' : 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 700 }}>{v}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{i === 0 ? 'consumed' : 'target'}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'bottle') {
    return (
      <svg viewBox="0 0 160 200" width="140" height="180">
        <defs>
          <linearGradient id="bottleGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0a6cbc" />
            <stop offset="100%" stopColor="#00b4d8" />
          </linearGradient>
        </defs>
        <rect x="60" y="10" width="40" height="14" rx="6" fill="rgba(0,180,216,0.5)" />
        <rect x="55" y="22" width="50" height="155" rx="20" fill="url(#bottleGrad)" opacity="0.85" />
        <rect x="55" y="100" width="50" height="77" rx="0 0 20 20" fill="rgba(255,255,255,0.15)" />
        <text x="80" y="145" textAnchor="middle" fill="white" fontSize="13" fontWeight="600" fontFamily="Inter">420 mL</text>
        <text x="80" y="162" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="Inter">of 750 mL</text>
        <circle cx="115" cy="40" r="8" fill="#4ade80" />
        <text x="115" y="44" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="Inter">●</text>
      </svg>
    )
  }

  if (type === 'weather') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 72, lineHeight: 1 }}>🌤</div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[['29°C', 'Temp'], ['78%', 'Humidity'], ['34°C', 'Feels']].map(([val, label]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ color: '#00b4d8', fontSize: 18, fontWeight: 700 }}>{val}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(0,180,216,0.15)', borderRadius: 10, padding: '10px 16px', border: '1px solid rgba(0,180,216,0.3)' }}>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Target increased by <span style={{ color: '#00b4d8', fontWeight: 600 }}>+40%</span> today</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', padding: '0 20px' }}>
      {[
        { time: '10:00 AM', event: 'Lecture', impact: 'Low', color: '#64748b' },
        { time: '1:00 PM', event: 'Gym', impact: 'High +250mL', color: '#00b4d8' },
        { time: '3:30 PM', event: 'Outdoor commute', impact: 'High', color: '#0a6cbc' },
      ].map((item) => (
        <div key={item.event} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${item.color}30` }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{item.time}</div>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>{item.event}</div>
          </div>
          <div style={{ color: item.color, fontSize: 12, fontWeight: 600 }}>{item.impact}</div>
        </div>
      ))}
    </div>
  )
}

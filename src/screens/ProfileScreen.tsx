import { useState } from 'react'

const activityLevels = ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active']
const sweatRates = ['Low', 'Moderate', 'High', 'Very High']

export default function ProfileScreen() {
  const [activity, setActivity] = useState('Active')
  const [sweatRate, setSweatRate] = useState('Moderate')
  const [locationEnabled, setLocationEnabled] = useState(true)
  const [calendarConnected, setCalendarConnected] = useState(true)
  const [notifications, setNotifications] = useState(true)

  return (
    <div style={{ background: '#f2f5f9', minHeight: '100%', paddingBottom: 32 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(175deg, #071525 0%, #0b2d4e 100%)',
        padding: '18px 24px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', bottom: -50, right: -30, width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(0,180,216,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: '0 0 18px', letterSpacing: -0.3 }}>Profile</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0a6cbc, #00c8e8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700, color: '#fff',
            border: '2px solid rgba(255,255,255,0.2)',
          }}>
            JM
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>Jamie Mitchell</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 }}>jamie@example.com</div>
            <div style={{ color: '#48cbe0', fontSize: 12, fontWeight: 500, marginTop: 3 }}>
              HydraFlow Pro · Member since 2025
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px', marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Personal info */}
        <SectionCard title="Personal Information">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Age', value: '28' },
              { label: 'Weight', value: '72 kg' },
              { label: 'Height', value: '178 cm' },
              { label: 'Sex', value: 'Male' },
            ].map((item) => (
              <div key={item.label} style={{
                background: '#f8faff',
                borderRadius: 12,
                padding: '12px 13px',
                border: '1px solid rgba(10,108,188,0.07)',
              }}>
                <div style={{ color: '#94a3b8', fontSize: 11, marginBottom: 3 }}>{item.label}</div>
                <div style={{ color: '#0d1b2a', fontSize: 16, fontWeight: 600 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Activity level */}
        <SectionCard title="Activity Level" subtitle="Used to estimate your baseline fluid need">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {activityLevels.map((level) => (
              <button
                key={level}
                onClick={() => setActivity(level)}
                style={{
                  background: activity === level ? '#0a6cbc' : '#f2f5f9',
                  border: activity === level ? '1.5px solid #0a6cbc' : '1.5px solid transparent',
                  borderRadius: 10,
                  padding: '8px 13px',
                  color: activity === level ? '#fff' : '#5a7a9a',
                  fontSize: 13,
                  fontWeight: activity === level ? 600 : 400,
                  cursor: 'pointer',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'all 0.18s',
                  minHeight: 36,
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </SectionCard>

        {/* Sweat rate */}
        <SectionCard title="Sweat Rate" subtitle="Helps calibrate your electrolyte estimates">
          <div style={{ display: 'flex', gap: 6 }}>
            {sweatRates.map((rate) => (
              <button
                key={rate}
                onClick={() => setSweatRate(rate)}
                style={{
                  flex: 1,
                  background: sweatRate === rate ? 'rgba(8,145,178,0.1)' : '#f2f5f9',
                  border: sweatRate === rate ? '1.5px solid #0891b2' : '1.5px solid transparent',
                  borderRadius: 10,
                  padding: '8px 4px',
                  color: sweatRate === rate ? '#0891b2' : '#5a7a9a',
                  fontSize: 12,
                  fontWeight: sweatRate === rate ? 600 : 400,
                  cursor: 'pointer',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'all 0.18s',
                  minHeight: 36,
                  textAlign: 'center',
                }}
              >
                {rate}
              </button>
            ))}
          </div>
        </SectionCard>

        {/* Connections & Permissions */}
        <SectionCard title="Connections & Permissions">
          {[
            {
              label: 'Location & Weather',
              sub: locationEnabled ? 'Enabled — real-time adjustments active' : 'Disabled — using default targets',
              icon: '📍',
              state: locationEnabled,
              toggle: () => setLocationEnabled(!locationEnabled),
              connected: locationEnabled,
            },
            {
              label: 'Calendar',
              sub: calendarConnected ? 'Google Calendar connected' : 'Not connected',
              icon: '📅',
              state: calendarConnected,
              toggle: () => setCalendarConnected(!calendarConnected),
              connected: calendarConnected,
            },
            {
              label: 'Smart Bottle',
              sub: 'HydraFlow Pro · Connected',
              icon: '🔗',
              state: true,
              toggle: () => {},
              connected: true,
            },
            {
              label: 'Notifications',
              sub: notifications ? 'Hydration reminders on' : 'Reminders paused',
              icon: '🔔',
              state: notifications,
              toggle: () => setNotifications(!notifications),
              connected: notifications,
            },
          ].map((item, i, arr) => (
            <div key={item.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              paddingBottom: i < arr.length - 1 ? 15 : 0,
              marginBottom: i < arr.length - 1 ? 15 : 0,
              borderBottom: i < arr.length - 1 ? '1px solid #f2f5f9' : 'none',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: '#f2f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#0d1b2a', fontSize: 14, fontWeight: 500 }}>{item.label}</div>
                <div style={{
                  color: item.connected ? '#22c55e' : '#94a3b8',
                  fontSize: 11, marginTop: 2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {item.sub}
                </div>
              </div>
              <Toggle on={item.state} onToggle={item.toggle} />
            </div>
          ))}
        </SectionCard>

        {/* Hydration preferences */}
        <SectionCard title="Hydration Preferences">
          {[
            { label: 'Daily base target', value: '2.0 L' },
            { label: 'Reminder style', value: 'Gentle' },
            { label: 'Preferred drink size', value: '250 mL' },
          ].map((pref, i, arr) => (
            <div key={pref.label} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: 44,
              paddingBottom: i < arr.length - 1 ? 2 : 0,
              marginBottom: i < arr.length - 1 ? 2 : 0,
              borderBottom: i < arr.length - 1 ? '1px solid #f2f5f9' : 'none',
            }}>
              <div style={{ color: '#0d1b2a', fontSize: 14 }}>{pref.label}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#0a6cbc', fontSize: 14, fontWeight: 600 }}>{pref.value}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b0bec8" strokeWidth="2" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          ))}
        </SectionCard>

        {/* Sign out */}
        <button style={{
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.14)',
          borderRadius: 16,
          padding: '15px',
          color: '#ef4444',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'Inter, system-ui, sans-serif',
          minHeight: 52,
        }}>
          Sign Out
        </button>
      </div>
    </div>
  )
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      padding: '18px',
      border: '1px solid rgba(10,108,188,0.08)',
      boxShadow: '0 1px 6px rgba(10,50,100,0.05)',
    }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ color: '#0d1b2a', fontSize: 15, fontWeight: 700 }}>{title}</div>
        {subtitle && <div style={{ color: '#8aaac8', fontSize: 12, marginTop: 3 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  )
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={on}
      style={{
        width: 46,
        height: 28,
        borderRadius: 14,
        background: on ? '#0a6cbc' : '#dde5ef',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
        minWidth: 46,
        minHeight: 28,
        padding: 0,
      }}
    >
      <div style={{
        position: 'absolute',
        top: 4,
        left: on ? 22 : 4,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
        transition: 'left 0.18s',
      }} />
    </button>
  )
}

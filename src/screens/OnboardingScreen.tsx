import { useState } from 'react'
import {
  type ScheduleBlock,
  type UserProfile,
  DEFAULT_SCHEDULE,
  calculateComprehensiveIntake,
} from '../services/auth'

interface Props {
  onComplete: (detailedProfile: Partial<UserProfile>) => void
  formattedTime?: string
}

export default function OnboardingScreen({ onComplete, formattedTime }: Props) {
  const [step, setStep] = useState(0)

  // ── DETAILED BIOMETRICS & LIFESTYLE STATE ──
  const [weight, setWeight] = useState<number>(70)
  const [height, setHeight] = useState<number>(175)
  const [age, setAge] = useState<number>(24)
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male')
  const [workType, setWorkType] = useState<UserProfile['workType']>('desk')
  const [exerciseMins, setExerciseMins] = useState<number>(45)
  const [sweatRate, setSweatRate] = useState<UserProfile['sweatRate']>('Moderate')
  const [caffeineCups, setCaffeineCups] = useState<number>(1)

  // ── INTERACTIVE SCHEDULE STATE ──
  const [schedule, setSchedule] = useState<ScheduleBlock[]>(DEFAULT_SCHEDULE)
  const [newTitle, setNewTitle] = useState('')
  const [newTime, setNewTime] = useState('5:00 PM')
  const [newDemand, setNewDemand] = useState<number>(250)
  const [showAddModal, setShowAddModal] = useState(false)

  // ── REAL-TIME INTAKE CALCULATION ──
  const calculated = calculateComprehensiveIntake({
    weightKg: weight,
    heightCm: height,
    age,
    gender,
    workType,
    exerciseMins,
    caffeineCups,
    sweatRate,
    schedule,
  })

  // Fallback local time
  const [localTime] = useState(() => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }))
  const displayTime = formattedTime || localTime

  const totalSteps = 5
  const progress = (step + 1) / totalSteps

  // Toggle a schedule block on/off
  const toggleScheduleItem = (id: string) => {
    setSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    )
  }

  // Remove a schedule block
  const removeScheduleItem = (id: string) => {
    setSchedule((prev) => prev.filter((item) => item.id !== id))
  }

  // Add custom schedule block
  const handleAddScheduleBlock = () => {
    if (!newTitle.trim()) return
    const newBlock: ScheduleBlock = {
      id: 'sch_' + Date.now(),
      title: newTitle.trim(),
      time: newTime,
      category: 'workout',
      impactLevel: newDemand >= 300 ? 'High' : newDemand >= 200 ? 'Moderate' : 'Low',
      fluidDemandMl: newDemand,
      enabled: true,
    }
    setSchedule((prev) => [...prev, newBlock])
    setNewTitle('')
    setShowAddModal(false)
  }

  // Finish onboarding
  const handleFinish = () => {
    onComplete({
      weight,
      height,
      age,
      gender,
      workType,
      exerciseMins,
      sweatRate,
      caffeineCups,
      schedule,
      baseTargetLiters: calculated.totalRecommendedLiters,
    })
  }

  const next = () => {
    if (step < totalSteps - 1) setStep(step + 1)
    else handleFinish()
  }

  const prev = () => {
    if (step > 0) setStep(step - 1)
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(180deg, #071525 0%, #0a1f38 60%, #061220 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute', top: -80, right: -60, width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(0,180,216,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Status bar */}
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0, position: 'relative', zIndex: 2 }}>
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: 0.1 }}>{displayTime}</span>
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          <svg width="17" height="12" viewBox="0 0 17 12" fill="rgba(255,255,255,0.85)">
            <rect x="0" y="5" width="3" height="7" rx="1" />
            <rect x="4.5" y="3" width="3" height="9" rx="1" />
            <rect x="9" y="1" width="3" height="11" rx="1" />
            <rect x="13.5" y="0" width="3" height="12" rx="1" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 24 16" fill="rgba(255,255,255,0.85)">
            <path d="M1 5C5.2 1.4 9.4 0 12 0s6.8 1.4 11 5L12 16z" />
          </svg>
          <div style={{ width: 23, height: 12, border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: 3.5, padding: '1.5px 2px', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '85%', height: '100%', background: '#4ade80', borderRadius: 2 }} />
          </div>
        </div>
      </div>

      {/* Top progress header & Back button */}
      <div style={{ padding: '4px 24px 10px', display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 2 }}>
        {step > 0 ? (
          <button
            type="button"
            onClick={prev}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: 10,
              width: 32,
              height: 32,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            ←
          </button>
        ) : (
          <div style={{ width: 32 }} />
        )}
        <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress * 100}%`, background: 'linear-gradient(90deg, #0a6cbc, #00c8e8)', borderRadius: 2, transition: 'width 0.4s ease' }} />
        </div>
        <span style={{ color: '#00c8e8', fontSize: 12, fontWeight: 700 }}>
          {step + 1}/{totalSteps}
        </span>
      </div>

      {/* Main Screen Content Body (Scrollable) */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '0 24px 20px', position: 'relative', zIndex: 2 }} className="no-scrollbar">

        {/* ════════ STEP 0: WELCOME ════════ */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 20 }}>
            <div style={{
              width: 130, height: 130, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,180,216,0.25) 0%, rgba(10,108,188,0.05) 70%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 64, marginBottom: 24,
              border: '1px solid rgba(0,180,216,0.3)',
              boxShadow: '0 0 30px rgba(0,180,216,0.2)',
            }}>
              💧
            </div>
            <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 12px', lineHeight: 1.3 }}>
              Hydration that adapts<br />
              <span style={{ color: '#00c8e8' }}>scientifically to you.</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6, margin: '0 0 24px', maxWidth: 300 }}>
              HydraFlow learns your body weight, your daily occupation, workout routine, and live weather to build a medical-grade fluid plan.
            </p>
            <div style={{
              background: 'rgba(0,180,216,0.08)',
              border: '1px solid rgba(0,180,216,0.2)',
              borderRadius: 16,
              padding: '14px 18px',
              textAlign: 'left',
              width: '100%',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
              <div style={{ color: '#00c8e8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Key Capabilities
              </div>
              <div style={{ color: '#fff', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🧬</span> <span>Biometric Body Calibration (Weight, Height, Age)</span>
              </div>
              <div style={{ color: '#fff', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📅</span> <span>Custom Daily Schedule & Workout Awareness</span>
              </div>
              <div style={{ color: '#fff', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🌤</span> <span>Real-Time Device GPS & Weather Adaptation</span>
              </div>
            </div>
          </div>
        )}

        {/* ════════ STEP 1: SMART BOTTLE ════════ */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 10 }}>
            <div style={{
              width: 120, height: 160,
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 24,
              border: '1.5px solid rgba(0,180,216,0.3)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              position: 'relative', marginBottom: 20,
              boxShadow: '0 8px 32px rgba(0,180,216,0.15)',
            }}>
              <div style={{ fontSize: 52 }}>🍾</div>
              <div style={{
                position: 'absolute', top: 12, right: 12,
                width: 10, height: 10, borderRadius: '50%', background: '#4ade80',
                boxShadow: '0 0 8px #4ade80',
              }} />
              <div style={{ color: '#00c8e8', fontSize: 12, fontWeight: 700, marginTop: 6 }}>
                HydraFlow Pro 750 mL
              </div>
            </div>
            <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: '0 0 10px' }}>
              Connect your Smart Bottle
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6, margin: '0 0 20px' }}>
              Pairs over Bluetooth to log every sip in real time. If you don't have one, you can still log manually with 1 tap.
            </p>
            <div style={{
              background: 'rgba(74,222,128,0.1)',
              border: '1px solid rgba(74,222,128,0.3)',
              borderRadius: 12,
              padding: '10px 16px',
              color: '#4ade80',
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span>✓</span> <span>Simulated Bluetooth Sensor Paired</span>
            </div>
          </div>
        )}

        {/* ════════ STEP 2: DETAILED LIFESTYLE & BIOMETRICS ════════ */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>
                Your Physical & Lifestyle Profile
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>
                Enter your real details so HydraFlow can accurately calculate your fluid need.
              </p>
            </div>

            {/* LIVE DYNAMIC TARGET BANNER */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0,180,216,0.18), rgba(10,108,188,0.25))',
              border: '1.5px solid #00b4d8',
              borderRadius: 16,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(0,180,216,0.2)',
            }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>
                  Calibrated Fluid Target
                </div>
                <div style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>
                  {calculated.totalRecommendedLiters} L <span style={{ fontSize: 13, color: '#00c8e8', fontWeight: 500 }}>/ day</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ background: '#00b4d8', color: '#071525', borderRadius: 8, padding: '4px 8px', fontSize: 11, fontWeight: 700 }}>
                  Active Live Formula
                </span>
              </div>
            </div>

            {/* 1. Biometrics Grid (Weight, Height, Age, Sex) */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 16,
              padding: '14px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ color: '#00c8e8', fontSize: 12, fontWeight: 700, marginBottom: 10, textTransform: 'uppercase' }}>
                1. Biometrics
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, display: 'block', marginBottom: 4 }}>
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Math.max(30, parseFloat(e.target.value) || 70))}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(0,180,216,0.4)',
                      borderRadius: 10,
                      padding: '8px 10px',
                      color: '#fff',
                      fontSize: 15,
                      fontWeight: 700,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, display: 'block', marginBottom: 4 }}>
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 175)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(0,180,216,0.4)',
                      borderRadius: 10,
                      padding: '8px 10px',
                      color: '#fff',
                      fontSize: 15,
                      fontWeight: 700,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, display: 'block', marginBottom: 4 }}>
                    Age (years)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value, 10) || 24)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(0,180,216,0.4)',
                      borderRadius: 10,
                      padding: '8px 10px',
                      color: '#fff',
                      fontSize: 15,
                      fontWeight: 700,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, display: 'block', marginBottom: 4 }}>
                    Biological Sex
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    style={{
                      width: '100%',
                      background: '#0a1f38',
                      border: '1px solid rgba(0,180,216,0.4)',
                      borderRadius: 10,
                      padding: '8px 10px',
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 600,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Daily Occupation / Work Style */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 16,
              padding: '14px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ color: '#00c8e8', fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>
                2. Daily Occupation Style
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {[
                  { id: 'desk' as const, label: '💻 Desk / Student', sub: 'Indoor baseline' },
                  { id: 'standing' as const, label: '🏥 Standing / Active', sub: '+200 mL need' },
                  { id: 'outdoor' as const, label: '🏗️ Outdoor / Field', sub: '+450 mL heat need' },
                  { id: 'athlete' as const, label: '🏃 Athlete / Labor', sub: '+700 mL heavy' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setWorkType(item.id)}
                    style={{
                      background: workType === item.id ? 'rgba(0,180,216,0.25)' : 'rgba(255,255,255,0.06)',
                      border: workType === item.id ? '1.5px solid #00b4d8' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10,
                      padding: '8px 10px',
                      color: workType === item.id ? '#fff' : 'rgba(255,255,255,0.7)',
                      fontSize: 12,
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div>{item.label}</div>
                    <div style={{ fontSize: 10, color: workType === item.id ? '#00c8e8' : 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                      {item.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Workout Duration & Sweat Rate */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 16,
              padding: '14px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ color: '#00c8e8', fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>
                3. Daily Workout & Sweat Rate
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, display: 'block', marginBottom: 6 }}>
                  Average Daily Exercise: <strong style={{ color: '#00c8e8' }}>{exerciseMins} mins</strong>
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[0, 30, 45, 60, 90].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setExerciseMins(mins)}
                      style={{
                        flex: 1,
                        background: exerciseMins === mins ? '#00b4d8' : 'rgba(255,255,255,0.06)',
                        border: 'none',
                        borderRadius: 8,
                        padding: '6px 2px',
                        color: exerciseMins === mins ? '#071525' : '#fff',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {mins === 0 ? 'None' : `${mins}m`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, display: 'block', marginBottom: 6 }}>
                  Natural Sweat Tendency:
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['Low', 'Moderate', 'High', 'Very High'] as UserProfile['sweatRate'][]).map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setSweatRate(rate)}
                      style={{
                        flex: 1,
                        background: sweatRate === rate ? 'rgba(0,180,216,0.3)' : 'rgba(255,255,255,0.06)',
                        border: sweatRate === rate ? '1.5px solid #00b4d8' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                        padding: '6px 2px',
                        color: sweatRate === rate ? '#fff' : 'rgba(255,255,255,0.6)',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {rate}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════ STEP 3: WEATHER AWARENESS ════════ */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 10 }}>
            <div style={{ fontSize: 60, marginBottom: 12 }}>🌤</div>
            <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: '0 0 8px' }}>
              Live Weather Adaptation
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6, margin: '0 0 20px' }}>
              HydraFlow automatically adjusts your targets based on real-time temperature, humidity, and heat index at your device location.
            </p>

            <div style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: '16px',
              border: '1px solid rgba(0,180,216,0.3)',
              width: '100%',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Ambient Temperature</span>
                <span style={{ color: '#e8510a', fontSize: 15, fontWeight: 700 }}>28°C – 34°C (+18% Demand)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Relative Humidity</span>
                <span style={{ color: '#00b4d8', fontSize: 15, fontWeight: 700 }}>78% (+8% Sweat Rate)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Electrolyte Loss</span>
                <span style={{ color: '#fb923c', fontSize: 15, fontWeight: 700 }}>Moderate Sodium Need</span>
              </div>
            </div>
          </div>
        )}

        {/* ════════ STEP 4: INTERACTIVE SCHEDULE BUILDER (FIXING SCREENSHOT) ════════ */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>
                Customize Your Daily Schedule
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>
                Toggle your actual activities or add your own to distribute your hydration plan.
              </p>
            </div>

            {/* Live Schedule Surge Summary */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0,180,216,0.15), rgba(10,108,188,0.2))',
              border: '1px solid rgba(0,180,216,0.3)',
              borderRadius: 14,
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ color: '#00c8e8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Goal for Today
                </div>
                <div style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>
                  {calculated.totalRecommendedLiters} L
                </div>
              </div>
              <div style={{ textAlign: 'right', color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                {schedule.filter((s) => s.enabled).length} active events today
              </div>
            </div>

            {/* Interactive Schedule Item Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {schedule.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleScheduleItem(item.id)}
                  style={{
                    background: item.enabled ? 'rgba(0,180,216,0.12)' : 'rgba(255,255,255,0.04)',
                    borderRadius: 14,
                    padding: '12px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: item.enabled ? '1.5px solid rgba(0,180,216,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Checkbox circle */}
                    <div style={{
                      width: 22, height: 22, borderRadius: 6,
                      background: item.enabled ? '#00b4d8' : 'rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: item.enabled ? '#071525' : 'transparent',
                      fontSize: 14, fontWeight: 800,
                      flexShrink: 0,
                    }}>
                      ✓
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{item.time}</div>
                      <div style={{ color: item.enabled ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 600 }}>
                        {item.title}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      background: item.impactLevel === 'High' ? 'rgba(234,88,12,0.2)' : 'rgba(0,180,216,0.15)',
                      color: item.impactLevel === 'High' ? '#fb923c' : '#38bdf8',
                      borderRadius: 6,
                      padding: '3px 8px',
                      fontSize: 11,
                      fontWeight: 700,
                    }}>
                      +{item.fluidDemandMl} mL
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeScheduleItem(item.id)
                      }}
                      style={{
                        background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)',
                        cursor: 'pointer', fontSize: 14, padding: '2px',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Schedule Block Button / Modal */}
            {!showAddModal ? (
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1.5px dashed rgba(0,180,216,0.4)',
                  borderRadius: 14,
                  padding: '12px',
                  color: '#00c8e8',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <span>➕</span> <span>Add Custom Schedule Activity</span>
              </button>
            ) : (
              <div style={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '12px',
                border: '1px solid #00b4d8',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}>
                <div style={{ color: '#00c8e8', fontSize: 12, fontWeight: 700 }}>Add Activity</div>
                <input
                  type="text"
                  placeholder="e.g. Football match, Lab work"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 8, padding: '8px', color: '#fff', fontSize: 13,
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Time (e.g. 5:00 PM)"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 8, padding: '8px', color: '#fff', fontSize: 12,
                    }}
                  />
                  <select
                    value={newDemand}
                    onChange={(e) => setNewDemand(parseInt(e.target.value, 10))}
                    style={{
                      background: '#071525',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 8, padding: '8px', color: '#fff', fontSize: 12,
                    }}
                  >
                    <option value={150}>+150 mL (Light)</option>
                    <option value={250}>+250 mL (Moderate)</option>
                    <option value={400}>+400 mL (Heavy)</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={handleAddScheduleBlock}
                    style={{
                      flex: 1, background: '#00b4d8', color: '#071525', border: 'none',
                      borderRadius: 8, padding: '8px', fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    Add to Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    style={{
                      background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none',
                      borderRadius: 8, padding: '8px 12px', cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Navigation Button */}
      <div style={{ padding: '12px 24px 24px', position: 'relative', zIndex: 2, background: 'rgba(7,21,37,0.85)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          type="button"
          onClick={next}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #0a6cbc, #00b4d8)',
            border: 'none',
            borderRadius: 16,
            padding: '16px',
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
            boxShadow: '0 4px 20px rgba(0,180,216,0.3)',
            minHeight: 52,
          }}
        >
          {step === totalSteps - 1 ? 'Start My Personalized Plan 🚀' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}

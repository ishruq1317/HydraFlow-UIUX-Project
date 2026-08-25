import { useState } from 'react'
import { authService, type UserAccount, type UserProfile, DEFAULT_SCHEDULE } from '../services/auth'

const activityLevels: UserProfile['activityLevel'][] = ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active']
const sweatRates: UserProfile['sweatRate'][] = ['Low', 'Moderate', 'High', 'Very High']

interface Props {
  currentUser?: UserAccount | null
  onProfileUpdate?: (user: UserAccount) => void
  onSignOut?: () => void
}

export default function ProfileScreen({ currentUser, onProfileUpdate, onSignOut }: Props) {
  // User profile local state
  const [profile, setProfile] = useState<UserProfile>(() => {
    return currentUser?.profile || {
      age: 26,
      weight: 70,
      height: 175,
      gender: 'Male',
      activityLevel: 'Moderate',
      workType: 'desk',
      exerciseMins: 45,
      outdoorHours: 1.5,
      caffeineCups: 1,
      sweatRate: 'Moderate',
      schedule: DEFAULT_SCHEDULE,
      baseTargetLiters: 2.8,
      locationEnabled: true,
      calendarConnected: true,
      notificationsEnabled: true,
    }
  })

  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [editAge, setEditAge] = useState(String(profile.age || 26))
  const [editWeight, setEditWeight] = useState(String(profile.weight || 70))
  const [editHeight, setEditHeight] = useState(String(profile.height || 175))
  const [editGender, setEditGender] = useState<'Male' | 'Female' | 'Other'>(profile.gender || 'Male')
  const [editWorkType, setEditWorkType] = useState<UserProfile['workType']>(profile.workType || 'desk')
  const [editExerciseMins, setEditExerciseMins] = useState(profile.exerciseMins || 45)

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmNewPass, setConfirmNewPass] = useState('')
  const [passError, setPassError] = useState('')
  const [passSuccess, setPassSuccess] = useState('')
  const [passLoading, setPassLoading] = useState(false)

  // Save personal info updates
  const handleSavePersonalInfo = () => {
    const w = parseFloat(editWeight) || 70
    const h = parseFloat(editHeight) || 175
    const a = parseInt(editAge, 10) || 26

    const updates: Partial<UserProfile> = {
      weight: w,
      height: h,
      age: a,
      gender: editGender,
      workType: editWorkType,
      exerciseMins: editExerciseMins,
    }

    setProfile((prev) => ({ ...prev, ...updates }))
    setIsEditingInfo(false)

    if (currentUser) {
      const updated = authService.updateProfile(currentUser.id, updates)
      if (updated && onProfileUpdate) {
        onProfileUpdate(updated)
      }
    }
  }

  // Update activity level
  const handleActivityChange = (level: UserProfile['activityLevel']) => {
    setProfile((prev) => ({ ...prev, activityLevel: level }))
    if (currentUser) {
      const updated = authService.updateProfile(currentUser.id, { activityLevel: level })
      if (updated && onProfileUpdate) {
        onProfileUpdate(updated)
      }
    }
  }

  // Update sweat rate
  const handleSweatRateChange = (rate: UserProfile['sweatRate']) => {
    setProfile((prev) => ({ ...prev, sweatRate: rate }))
    if (currentUser) {
      const updated = authService.updateProfile(currentUser.id, { sweatRate: rate })
      if (updated && onProfileUpdate) {
        onProfileUpdate(updated)
      }
    }
  }

  // Toggle settings
  const handleToggle = (key: keyof UserProfile) => {
    const updatedVal = !profile[key]
    setProfile((prev) => ({ ...prev, [key]: updatedVal }))
    if (currentUser) {
      const updated = authService.updateProfile(currentUser.id, { [key]: updatedVal })
      if (updated && onProfileUpdate) {
        onProfileUpdate(updated)
      }
    }
  }

  // Change Password submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPassError('')
    setPassSuccess('')

    if (newPass !== confirmNewPass) {
      setPassError('New passwords do not match.')
      return
    }

    if (!currentUser) {
      setPassError('No active user found.')
      return
    }

    setPassLoading(true)
    try {
      const res = await authService.updatePassword(currentUser.id, currentPass, newPass)
      if (res.success) {
        setPassSuccess('Password changed successfully!')
        setCurrentPass('')
        setNewPass('')
        setConfirmNewPass('')
        setTimeout(() => setShowPasswordChange(false), 1500)
      } else {
        setPassError(res.error || 'Failed to update password.')
      }
    } catch {
      setPassError('An error occurred while updating password.')
    } finally {
      setPassLoading(false)
    }
  }

  const fullName = currentUser?.fullName || 'Jamie Mitchell'
  const email = currentUser?.email || 'jamie@example.com'
  const username = currentUser?.username || 'jamie'
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'JM'

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
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: '0 0 18px', letterSpacing: -0.3 }}>
          Profile & Health Settings
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0a6cbc, #00c8e8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700, color: '#fff',
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: '0 4px 14px rgba(0,180,216,0.3)',
          }}>
            {initials}
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{fullName}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2 }}>
              @{username} · {email}
            </div>
            <div style={{ color: '#48cbe0', fontSize: 12, fontWeight: 500, marginTop: 3 }}>
              Daily Calibrated Target: {profile.baseTargetLiters} L / day
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px', marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ── SECURITY & PASSWORD CARD ── */}
        <SectionCard title="Account Security">
          {!showPasswordChange ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#0d1b2a', fontSize: 14, fontWeight: 600 }}>Password</div>
                  <div style={{ color: '#8aaac8', fontSize: 12 }}>Protected with SHA-256 encryption</div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswordChange(true)}
                  style={{
                    background: '#f0f6ff',
                    border: '1px solid rgba(10,108,188,0.2)',
                    borderRadius: 10,
                    padding: '8px 14px',
                    color: '#0a6cbc',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  Change Password
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ color: '#0a6cbc', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                Update Your Password
              </div>

              {passError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 10px', color: '#b91c1c', fontSize: 12 }}>
                  ⚠️ {passError}
                </div>
              )}
              {passSuccess && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '8px 10px', color: '#15803d', fontSize: 12 }}>
                  ✅ {passSuccess}
                </div>
              )}

              <input
                type="password"
                placeholder="Current Password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                required
                style={{
                  width: '100%', background: '#f8faff', border: '1px solid #d1dbe8',
                  borderRadius: 10, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box',
                }}
              />
              <input
                type="password"
                placeholder="New Password (min 6 chars)"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                required
                style={{
                  width: '100%', background: '#f8faff', border: '1px solid #d1dbe8',
                  borderRadius: 10, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box',
                }}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmNewPass}
                onChange={(e) => setConfirmNewPass(e.target.value)}
                required
                style={{
                  width: '100%', background: '#f8faff', border: '1px solid #d1dbe8',
                  borderRadius: 10, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box',
                }}
              />

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                  type="submit"
                  disabled={passLoading}
                  style={{
                    flex: 1, background: '#0a6cbc', border: 'none', borderRadius: 10,
                    padding: '10px', color: '#fff', fontSize: 13, fontWeight: 600,
                    cursor: passLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {passLoading ? 'Saving...' : 'Save Password'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowPasswordChange(false); setPassError(''); setPassSuccess(''); }}
                  style={{
                    background: '#f1f5f9', border: 'none', borderRadius: 10,
                    padding: '10px 14px', color: '#64748b', fontSize: 13, cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </SectionCard>

        {/* ── PERSONAL BIOMETRICS & LIFESTYLE ── */}
        <SectionCard
          title="Biometrics & Occupation"
          subtitle="Scientifically shapes your baseline water requirement"
        >
          {!isEditingInfo ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                {[
                  { label: 'Weight', value: `${profile.weight || 70} kg` },
                  { label: 'Height', value: `${profile.height || 175} cm` },
                  { label: 'Age', value: `${profile.age || 26} yrs` },
                  { label: 'Sex', value: profile.gender || 'Male' },
                  { label: 'Work Style', value: profile.workType === 'outdoor' ? 'Outdoor' : profile.workType === 'standing' ? 'Standing' : profile.workType === 'athlete' ? 'Athlete' : 'Desk/Study' },
                  { label: 'Daily Workout', value: `${profile.exerciseMins || 45} mins` },
                ].map((item) => (
                  <div key={item.label} style={{
                    background: '#f8faff',
                    borderRadius: 12,
                    padding: '12px 13px',
                    border: '1px solid rgba(10,108,188,0.07)',
                  }}>
                    <div style={{ color: '#94a3b8', fontSize: 11, marginBottom: 3 }}>{item.label}</div>
                    <div style={{ color: '#0d1b2a', fontSize: 15, fontWeight: 700 }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIsEditingInfo(true)}
                style={{
                  width: '100%', background: '#f8faff', border: '1px solid rgba(10,108,188,0.15)',
                  borderRadius: 10, padding: '9px', color: '#0a6cbc', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                Edit Biometrics & Lifestyle
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Weight (kg)</label>
                  <input
                    type="number"
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Height (cm)</label>
                  <input
                    type="number"
                    value={editHeight}
                    onChange={(e) => setEditHeight(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Age</label>
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Occupation</label>
                  <select
                    value={editWorkType}
                    onChange={(e) => setEditWorkType(e.target.value as any)}
                    style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #cbd5e1', boxSizing: 'border-box', background: '#fff' }}
                  >
                    <option value="desk">Desk / Student</option>
                    <option value="standing">Standing / Active</option>
                    <option value="outdoor">Outdoor / Field</option>
                    <option value="athlete">Athlete / Heavy</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={handleSavePersonalInfo}
                  style={{ flex: 1, background: '#0a6cbc', color: '#fff', border: 'none', borderRadius: 8, padding: '9px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save & Recalculate
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingInfo(false)}
                  style={{ background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: 8, padding: '9px 12px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </SectionCard>

        {/* ── ACTIVITY LEVEL ── */}
        <SectionCard title="Overall Activity Level" subtitle="Adjusts fluid baseline intensity">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {activityLevels.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => handleActivityChange(level)}
                style={{
                  background: profile.activityLevel === level ? '#0a6cbc' : '#f2f5f9',
                  border: profile.activityLevel === level ? '1.5px solid #0a6cbc' : '1.5px solid transparent',
                  borderRadius: 10,
                  padding: '8px 13px',
                  color: profile.activityLevel === level ? '#fff' : '#5a7a9a',
                  fontSize: 13,
                  fontWeight: profile.activityLevel === level ? 600 : 400,
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

        {/* ── SWEAT RATE ── */}
        <SectionCard title="Sweat Rate" subtitle="Estimates electrolyte depletion speed">
          <div style={{ display: 'flex', gap: 6 }}>
            {sweatRates.map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => handleSweatRateChange(rate)}
                style={{
                  flex: 1,
                  background: profile.sweatRate === rate ? 'rgba(8,145,178,0.1)' : '#f2f5f9',
                  border: profile.sweatRate === rate ? '1.5px solid #0891b2' : '1.5px solid transparent',
                  borderRadius: 10,
                  padding: '8px 4px',
                  color: profile.sweatRate === rate ? '#0891b2' : '#5a7a9a',
                  fontSize: 12,
                  fontWeight: profile.sweatRate === rate ? 600 : 400,
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

        {/* ── CONNECTIONS & SENSORS ── */}
        <SectionCard title="Connections & Sensors">
          {[
            {
              label: 'Device GPS & Weather',
              sub: profile.locationEnabled ? 'Active — Real-time climate adaptation' : 'Disabled',
              icon: '📍',
              state: profile.locationEnabled,
              toggle: () => handleToggle('locationEnabled'),
            },
            {
              label: 'Calendar & Schedule Sync',
              sub: profile.calendarConnected ? 'Connected — High demand awareness' : 'Disconnected',
              icon: '📅',
              state: profile.calendarConnected,
              toggle: () => handleToggle('calendarConnected'),
            },
            {
              label: 'Hydration Notifications',
              sub: profile.notificationsEnabled ? 'Enabled — Context-aware alerts' : 'Muted',
              icon: '🔔',
              state: profile.notificationsEnabled,
              toggle: () => handleToggle('notificationsEnabled'),
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
                  color: item.state ? '#22c55e' : '#94a3b8',
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

        {/* ── SIGN OUT / LOGOUT ── */}
        <button
          type="button"
          onClick={onSignOut}
          style={{
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.18)',
            borderRadius: 16,
            padding: '16px',
            color: '#ef4444',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
            minHeight: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out of Account
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
      type="button"
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

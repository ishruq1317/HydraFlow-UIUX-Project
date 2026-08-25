import { useState } from 'react'
import { authService, type UserAccount } from '../services/auth'

interface Props {
  onAuthSuccess: (user: UserAccount) => void
  formattedTime?: string
}

export default function AuthScreen({ onAuthSuccess, formattedTime }: Props) {
  const [isLogin, setIsLogin] = useState(true)
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  
  // Sign up form state
  const [fullName, setFullName] = useState('')
  const [signupUsername, setSignupUsername] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Live time fallback
  const [localTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  )
  const displayTime = formattedTime || localTime

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '#e2e8f0' }
    if (pass.length < 6) return { score: 1, label: 'Too short (min 6 chars)', color: '#ef4444' }
    let score = 1
    if (/[A-Z]/.test(pass)) score++
    if (/[0-9]/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass) || pass.length >= 10) score++

    if (score <= 2) return { score: 2, label: 'Fair', color: '#f59e0b' }
    if (score === 3) return { score: 3, label: 'Good', color: '#3b82f6' }
    return { score: 4, label: 'Strong', color: '#22c55e' }
  }

  const strength = getPasswordStrength(signupPassword)

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setLoading(true)

    try {
      const res = await authService.login(loginIdentifier, loginPassword)
      if (res.success && res.user) {
        onAuthSuccess(res.user)
      } else {
        setErrorMessage(res.error || 'Failed to sign in. Please verify your credentials.')
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (signupPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.')
      return
    }

    setLoading(true)
    try {
      const res = await authService.signUp(fullName, signupUsername, signupEmail, signupPassword)
      if (res.success && res.user) {
        setSuccessMessage('Account created successfully! Welcome to HydraFlow.')
        setTimeout(() => {
          if (res.user) onAuthSuccess(res.user)
        }, 600)
      } else {
        setErrorMessage(res.error || 'Failed to create account.')
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Quick demo account creator/login
  const handleQuickDemo = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      let res = await authService.login('jamie', 'password123')
      if (!res.success) {
        res = await authService.signUp('Jamie Mitchell', 'jamie', 'jamie@example.com', 'password123')
      }
      if (res.user) {
        onAuthSuccess(res.user)
      }
    } catch {
      setErrorMessage('Failed to load demo account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#071525',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      {/* Background ambient lighting */}
      <div style={{
        position: 'absolute',
        top: -60,
        right: -40,
        width: 280,
        height: 280,
        background: 'radial-gradient(circle, rgba(0,180,216,0.22) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: 50,
        left: -50,
        width: 240,
        height: 240,
        background: 'radial-gradient(circle, rgba(10,108,188,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Status bar */}
      <div style={{
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        flexShrink: 0,
        position: 'relative',
        zIndex: 2,
      }}>
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: 0.1 }}>
          {displayTime}
        </span>
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 23, height: 12, border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: 3.5, padding: '1.5px 2px', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '78%', height: '100%', background: '#4ade80', borderRadius: 2 }} />
            </div>
            <div style={{ width: 2, height: 5, background: 'rgba(255,255,255,0.4)', borderRadius: '0 1px 1px 0', marginLeft: 1 }} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '16px 24px 28px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #0a6cbc, #00b4d8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,180,216,0.35)',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
                fill="#ffffff"
                opacity="0.95"
              />
            </svg>
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: -0.3 }}>
              HydraFlow
            </h1>
            <div style={{ color: '#00b4d8', fontSize: 12, fontWeight: 500 }}>
              Adaptive Hydration Intelligence
            </div>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 14,
          padding: 4,
          marginBottom: 20,
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrorMessage(''); }}
            style={{
              flex: 1,
              background: isLogin ? 'linear-gradient(135deg, #0a6cbc, #00b4d8)' : 'transparent',
              border: 'none',
              borderRadius: 11,
              padding: '11px 0',
              color: '#fff',
              fontSize: 14,
              fontWeight: isLogin ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'Inter, system-ui, sans-serif',
              boxShadow: isLogin ? '0 2px 10px rgba(10,108,188,0.4)' : 'none',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrorMessage(''); }}
            style={{
              flex: 1,
              background: !isLogin ? 'linear-gradient(135deg, #0a6cbc, #00b4d8)' : 'transparent',
              border: 'none',
              borderRadius: 11,
              padding: '11px 0',
              color: '#fff',
              fontSize: 14,
              fontWeight: !isLogin ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'Inter, system-ui, sans-serif',
              boxShadow: !isLogin ? '0 2px 10px rgba(10,108,188,0.4)' : 'none',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 12,
            padding: '10px 14px',
            color: '#fca5a5',
            fontSize: 13,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div style={{
            background: 'rgba(34,197,94,0.15)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 12,
            padding: '10px 14px',
            color: '#86efac',
            fontSize: 13,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span>✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* ── FORM ── */}
        {isLogin ? (
          /* Log In Form */
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                Username or Email
              </label>
              <input
                type="text"
                placeholder="e.g. jamie or jamie@example.com"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  padding: '13px 14px',
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600 }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: '#00b4d8', fontSize: 12, cursor: 'pointer', padding: 0 }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  padding: '13px 14px',
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 6,
                background: 'linear-gradient(135deg, #0a6cbc, #00b4d8)',
                border: 'none',
                borderRadius: 14,
                padding: '15px',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif',
                minHeight: 50,
                boxShadow: '0 4px 16px rgba(10,108,188,0.4)',
                transition: 'opacity 0.2s',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Jamie Mitchell"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>
                Username
              </label>
              <input
                type="text"
                placeholder="e.g. jamiem"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                required
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. jamie@example.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>
                Password (min 6 characters)
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              />
              {/* Strength bar */}
              {signupPassword && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(strength.score / 4) * 100}%`,
                      background: strength.color,
                      transition: 'all 0.3s',
                    }} />
                  </div>
                  <div style={{ color: strength.color, fontSize: 11, marginTop: 3 }}>
                    Password: {strength.label}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 6,
                background: 'linear-gradient(135deg, #0a6cbc, #00b4d8)',
                border: 'none',
                borderRadius: 14,
                padding: '15px',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif',
                minHeight: 50,
                boxShadow: '0 4px 16px rgba(10,108,188,0.4)',
                transition: 'opacity 0.2s',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Creating account...' : 'Create Account & Begin'}
            </button>
          </form>
        )}

        {/* Quick Demo Login Option */}
        <div style={{ marginTop: 'auto', paddingTop: 20, textAlign: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 12,
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Evaluation Shortcut
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
          </div>

          <button
            type="button"
            onClick={handleQuickDemo}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(0,180,216,0.25)',
              borderRadius: 12,
              padding: '10px 16px',
              color: '#00b4d8',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, system-ui, sans-serif',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'background 0.2s',
            }}
          >
            <span>⚡</span>
            <span>1-Click Sample Account</span>
          </button>
        </div>
      </div>
    </div>
  )
}

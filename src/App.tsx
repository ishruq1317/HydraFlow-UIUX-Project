import { useEffect, useState } from 'react'
import type React from 'react'
import HomeScreen from './screens/HomeScreen'
import ForecastScreen from './screens/ForecastScreen'
import BottleScreen from './screens/BottleScreen'
import InsightsScreen from './screens/InsightsScreen'
import ProfileScreen from './screens/ProfileScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import AuthScreen from './screens/AuthScreen'
import { authService, type UserAccount } from './services/auth'

type Screen = 'home' | 'forecast' | 'bottle' | 'insights' | 'profile'

const NAV_ITEMS: { id: Screen; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  {
    id: 'home',
    label: 'Home',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#0a6cbc' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" fill="none" />
      </svg>
    ),
  },
  {
    id: 'forecast',
    label: 'Forecast',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? '2.2' : '1.8'} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
  {
    id: 'bottle',
    label: 'Bottle',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? '2.2' : '1.8'} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2h8M9 2v2.5a4 4 0 00-4 4v11a2 2 0 002 2h10a2 2 0 002-2v-11a4 4 0 00-4-4V2" />
        <line x1="12" y1="10" x2="12" y2="16" />
        <line x1="9" y1="13" x2="15" y2="13" />
      </svg>
    ),
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? '2.2' : '1.8'} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? '2.2' : '1.8'} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

export default function App() {
  // Current active user session
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    return authService.getCurrentUser()
  })

  const [activeScreen, setActiveScreen] = useState<Screen>('home')
  const [isRerunningWizard, setIsRerunningWizard] = useState(false)

  // Real-time clock
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })

  // Handle successful login or signup
  const handleAuthSuccess = (user: UserAccount) => {
    setCurrentUser(user)
  }

  // Handle onboarding completion with rich biometrics & schedule
  const handleCompleteOnboarding = (detailedProfile: any) => {
    if (currentUser) {
      const updated = authService.completeDetailedOnboarding(currentUser.id, detailedProfile)
      setCurrentUser(updated)
      setIsRerunningWizard(false)
    }
  }

  // Handle sign out
  const handleSignOut = () => {
    authService.logout()
    setCurrentUser(null)
    setActiveScreen('home')
    setIsRerunningWizard(false)
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #05111f 0%, #082540 50%, #0a3560 100%)',
      padding: '24px 0',
    }}>
      <div style={{
        width: 390,
        height: 844,
        background: '#f2f5f9',
        borderRadius: 48,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        {/* 1. If not logged in -> Show Auth Screen */}
        {!currentUser ? (
          <AuthScreen onAuthSuccess={handleAuthSuccess} formattedTime={formattedTime} />
        ) : (!currentUser.onboarded || isRerunningWizard) ? (
          /* 2. If logged in but hasn't completed onboarding OR wants to re-run wizard -> Show Onboarding Screen */
          <OnboardingScreen onComplete={handleCompleteOnboarding} formattedTime={formattedTime} />
        ) : (
          /* 3. If logged in & onboarded -> Show Main App */
          <>
            {/* Status bar */}
            <div style={{
              height: 44,
              background: '#071525',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 28px',
              flexShrink: 0,
            }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: 0.1 }}>
                {formattedTime}
              </span>

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

            {/* Screen content */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }} className="no-scrollbar">
              {activeScreen === 'home' && <HomeScreen currentUser={currentUser} />}
              {activeScreen === 'forecast' && <ForecastScreen />}
              {activeScreen === 'bottle' && <BottleScreen />}
              {activeScreen === 'insights' && <InsightsScreen />}
              {activeScreen === 'profile' && (
                <ProfileScreen
                  currentUser={currentUser}
                  onProfileUpdate={(u) => setCurrentUser(u)}
                  onSignOut={handleSignOut}
                  onRerunOnboarding={() => setIsRerunningWizard(true)}
                />
              )}
            </div>

            {/* Bottom navigation */}
            <div style={{
              height: 78,
              background: '#ffffff',
              borderTop: '1px solid rgba(10,108,188,0.08)',
              display: 'flex',
              alignItems: 'center',
              paddingBottom: 4,
              flexShrink: 0,
              boxShadow: '0 -4px 20px rgba(10,50,100,0.06)',
            }}>
              {NAV_ITEMS.map((item) => {
                const active = item.id === activeScreen
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveScreen(item.id)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 3,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: active ? '#0a6cbc' : '#b0bec8',
                      padding: '6px 0 0',
                      transition: 'color 0.15s',
                      minHeight: 48,
                      position: 'relative',
                    }}
                  >
                    {/* Active indicator — thin line at top */}
                    {active && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 28,
                        height: 2.5,
                        background: '#0a6cbc',
                        borderRadius: '0 0 3px 3px',
                      }} />
                    )}
                    {item.icon(active)}
                    <span style={{
                      fontSize: 10,
                      fontWeight: active ? 600 : 400,
                      letterSpacing: 0.2,
                      lineHeight: 1,
                    }}>
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

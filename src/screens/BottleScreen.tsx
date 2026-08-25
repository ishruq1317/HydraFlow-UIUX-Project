import { useEffect, useState } from 'react'
import { hydrationService, type HydrationState } from '../services/hydration'

export default function BottleScreen() {
  const [hydraState, setHydraState] = useState<HydrationState>(() => hydrationService.getState())
  const [syncing, setSyncing] = useState(false)
  const [justDrunk, setJustDrunk] = useState(false)

  useEffect(() => {
    const unsubscribe = hydrationService.subscribe((updated) => {
      setHydraState(updated)
    })
    return unsubscribe
  }, [])

  const bottle = hydraState.bottle
  const level = bottle.levelMl
  const capacity = bottle.capacityMl
  const levelPct = Math.min(Math.max(level / capacity, 0), 1)

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => {
      hydrationService.syncBottle()
      setSyncing(false)
    }, 1200)
  }

  const handleDrinkSip = () => {
    if (level <= 0) return
    hydrationService.drinkFromBottle(200)
    setJustDrunk(true)
    setTimeout(() => setJustDrunk(false), 800)
  }

  const handleRefill = () => {
    hydrationService.refillBottle(750)
  }

  return (
    <div style={{ background: '#f2f5f9', minHeight: '100%', paddingBottom: 28 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(175deg, #071525 0%, #0b2d4e 100%)',
        padding: '18px 24px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -60, right: -40, width: 240, height: 240,
          background: 'radial-gradient(circle, rgba(0,180,216,0.14) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: '0 0 6px', letterSpacing: -0.3 }}>
          Smart Bottle
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
            Connected — HydraFlow Pro (Bluetooth)
          </span>
        </div>
      </div>

      <div style={{ padding: '0 20px', marginTop: -1 }}>

        {/* Hero bottle card */}
        <div style={{
          background: '#fff',
          borderRadius: 24,
          padding: '24px 24px 20px',
          marginBottom: 14,
          boxShadow: '0 4px 24px rgba(10,50,100,0.1)',
          border: '1px solid rgba(10,108,188,0.07)',
        }}>
          {/* Bottle centered hero */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
            <BottleSvg levelPct={levelPct} level={level} capacity={capacity} justDrunk={justDrunk} />
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { label: 'Current level', value: `${level} mL`, sub: `${Math.round(levelPct * 100)}% full`, color: '#0a6cbc', icon: '💧' },
              { label: 'Temperature', value: `${bottle.temperatureC}°C`, sub: 'optimal', color: '#0891b2', icon: '🌡' },
              { label: 'Battery', value: `${bottle.batteryPct}%`, sub: 'healthy', color: '#22c55e', icon: '⚡' },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: '#f8faff',
                borderRadius: 14,
                padding: '12px 8px',
                border: '1px solid rgba(10,108,188,0.07)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 18, marginBottom: 3 }}>{stat.icon}</div>
                <div style={{ color: stat.color, fontSize: 14, fontWeight: 700, lineHeight: 1.1 }}>{stat.value}</div>
                <div style={{ color: '#94a3b8', fontSize: 10, marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Level progress bar */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#5a7a9a', fontSize: 12 }}>Water Capacity</span>
              <span style={{ color: '#0a6cbc', fontSize: 12, fontWeight: 600 }}>{level} of {capacity} mL</span>
            </div>
            <div style={{ height: 8, background: '#e4ebf4', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${levelPct * 100}%`,
                background: 'linear-gradient(90deg, #0a6cbc, #00c8e8)',
                borderRadius: 4,
                transition: 'width 0.5s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ color: '#94a3b8', fontSize: 10 }}>Empty</span>
              <span style={{ color: '#94a3b8', fontSize: 10 }}>Full ({capacity} mL)</span>
            </div>
          </div>
        </div>

        {/* Sync status bar */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '13px 16px',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: '1px solid rgba(10,108,188,0.07)',
          boxShadow: '0 1px 6px rgba(10,50,100,0.05)',
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: syncing ? 'rgba(249,115,22,0.1)' : 'rgba(34,197,94,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={syncing ? '#f97316' : '#22c55e'} strokeWidth="2" strokeLinecap="round">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0115.13-2.09L23 10M1 14l4.36 3.09A9 9 0 0020.49 15" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#0d1b2a', fontSize: 14, fontWeight: 500 }}>
              {syncing ? 'Syncing sensor logs…' : `Last synced: ${bottle.lastSync}`}
            </div>
            <div style={{ color: '#8aaac8', fontSize: 12 }}>Real-time sensor telemetry</div>
          </div>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: syncing ? '#f97316' : '#22c55e',
            flexShrink: 0,
          }} />
        </div>

        {/* Interactive Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          {/* Drink from bottle button */}
          <button
            type="button"
            onClick={handleDrinkSip}
            disabled={level <= 0}
            style={{
              background: level <= 0 ? '#94a3b8' : 'linear-gradient(135deg, #0a6cbc, #00b4d8)',
              border: 'none',
              borderRadius: 16,
              padding: '14px',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              cursor: level <= 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              boxShadow: level <= 0 ? 'none' : '0 4px 14px rgba(10,108,188,0.3)',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: 18 }}>🥤</span>
            <span>Take Sip (-200 mL)</span>
          </button>

          {/* Refill bottle button */}
          <button
            type="button"
            onClick={handleRefill}
            style={{
              background: '#fff',
              border: '1.5px solid rgba(10,108,188,0.2)',
              borderRadius: 16,
              padding: '14px',
              color: '#0a6cbc',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              boxShadow: '0 2px 8px rgba(10,50,100,0.04)',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: 18 }}>🚰</span>
            <span>Refill Bottle (750 mL)</span>
          </button>
        </div>

        {/* Sync Bottle full width button */}
        <button
          type="button"
          onClick={handleSync}
          disabled={syncing}
          style={{
            width: '100%',
            background: '#f0f6ff',
            border: '1px solid rgba(10,108,188,0.15)',
            borderRadius: 14,
            padding: '12px',
            color: '#0a6cbc',
            fontSize: 14,
            fontWeight: 600,
            cursor: syncing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 14,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0115.13-2.09L23 10M1 14l4.36 3.09A9 9 0 0020.49 15" />
          </svg>
          <span>{syncing ? 'Syncing sensor logs...' : 'Sync Bottle Bluetooth Logs'}</span>
        </button>

        {/* Drink history */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '18px',
          border: '1px solid rgba(10,108,188,0.07)',
          boxShadow: '0 1px 8px rgba(10,50,100,0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ color: '#0d1b2a', fontSize: 15, fontWeight: 700 }}>Drink History Today</div>
            <div style={{ color: '#0a6cbc', fontSize: 12, fontWeight: 600 }}>{hydraState.drinks.length} logged</div>
          </div>

          {hydraState.drinks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '16px', color: '#94a3b8', fontSize: 13 }}>
              No drinks logged yet today. Take a sip or log a drink!
            </div>
          ) : (
            hydraState.drinks.slice(0, 5).map((drink, i, arr) => (
              <div key={drink.id || i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                paddingBottom: i < arr.length - 1 ? 12 : 0,
                marginBottom: i < arr.length - 1 ? 12 : 0,
                borderBottom: i < arr.length - 1 ? '1px solid #f2f5f9' : 'none',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: drink.type === 'bottle' ? 'rgba(10,108,188,0.1)' : 'rgba(0,180,216,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 16 }}>{drink.type === 'bottle' ? '🍾' : drink.type === 'electrolyte' ? '⚡' : '💧'}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#0d1b2a', fontSize: 14, fontWeight: 600 }}>{drink.amountMl} mL</div>
                  <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 1 }}>{drink.note}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#5a7a9a', fontSize: 12 }}>{drink.timeLabel}</div>
                  <div style={{ color: '#22c55e', fontSize: 10, marginTop: 1 }}>✓ verified</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function BottleSvg({
  levelPct,
  level,
  capacity,
  justDrunk,
}: {
  levelPct: number
  level: number
  capacity: number
  justDrunk: boolean
}) {
  const W = 90
  const H = 220
  const capH = 22
  const neckTop = capH
  const neckH = 18
  const bodyTop = neckTop + neckH
  const bodyH = H - bodyTop - 10
  const rx = 20

  const waterH = bodyH * levelPct
  const waterY = bodyTop + bodyH - waterH

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="bottleShell" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0a6cbc" stopOpacity="0.12" />
            <stop offset="40%" stopColor="#0a6cbc" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#0a6cbc" stopOpacity="0.14" />
          </linearGradient>
          <linearGradient id="waterFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00c8e8" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#0060a8" stopOpacity="0.92" />
          </linearGradient>
          <linearGradient id="capFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a7cd0" />
            <stop offset="100%" stopColor="#0a5498" />
          </linearGradient>
          <clipPath id="bodyClip">
            <rect x="5" y={bodyTop} width={W - 10} height={bodyH} rx={rx} />
          </clipPath>
          <filter id="waterGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Cap */}
        <rect x={W / 2 - 14} y={2} width={28} height={capH} rx={7} fill="url(#capFill)" />
        <rect x={W / 2 - 10} y={1} width={20} height={7} rx={4} fill="#2a8de0" opacity="0.6" />

        {/* Neck */}
        <path
          d={`M${W / 2 - 14} ${neckTop} L${W / 2 - 20} ${neckTop + neckH} L${W / 2 + 20} ${neckTop + neckH} L${W / 2 + 14} ${neckTop} Z`}
          fill="url(#bottleShell)"
          stroke="rgba(10,108,188,0.18)"
          strokeWidth="1"
        />

        {/* Body shell */}
        <rect x="5" y={bodyTop} width={W - 10} height={bodyH} rx={rx}
          fill="url(#bottleShell)"
          stroke="rgba(10,108,188,0.18)"
          strokeWidth="1.5"
        />

        {/* Water */}
        <rect x="5" y={waterY} width={W - 10} height={waterH}
          fill="url(#waterFill)"
          clipPath="url(#bodyClip)"
          filter="url(#waterGlow)"
          style={{ transition: 'all 0.5s ease' }}
        />

        {/* Wave surface */}
        {waterH > 10 && (
          <path
            d={`M5 ${waterY} Q${W / 4} ${waterY - (justDrunk ? 10 : 6)} ${W / 2} ${waterY} Q${(W * 3) / 4} ${waterY + (justDrunk ? 10 : 6)} ${W - 5} ${waterY}`}
            fill="rgba(100,220,240,0.4)"
            clipPath="url(#bodyClip)"
            style={{ transition: 'd 0.3s ease' }}
          />
        )}

        {/* Reflection highlight */}
        <rect x="12" y={bodyTop + 10} width="7" height={bodyH - 24} rx="3.5"
          fill="rgba(255,255,255,0.2)"
        />

        {/* Level tick marks */}
        {[0.25, 0.5, 0.75].map((mark) => {
          const y = bodyTop + bodyH - bodyH * mark
          return (
            <g key={mark}>
              <line x1={W - 18} y1={y} x2={W - 9} y2={y}
                stroke="rgba(10,108,188,0.25)" strokeWidth="1.2" />
              <text x={W - 6} y={y + 3} fill="rgba(10,108,188,0.4)" fontSize="8"
                textAnchor="start" fontFamily="Inter, system-ui, sans-serif">
                {Math.round(capacity * mark)}
              </text>
            </g>
          )
        })}

        {/* Connected indicator */}
        <circle cx={W - 12} cy={bodyTop + 14} r={9} fill="#4ade80" />
        <text x={W - 12} y={bodyTop + 18} textAnchor="middle" fill="white" fontSize="9" fontWeight="700">✓</text>
      </svg>

      {/* Level label below */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ color: '#0a6cbc', fontSize: 32, fontWeight: 800, lineHeight: 1, letterSpacing: -1 }}>
          {level}
        </span>
        <span style={{ color: '#5a7a9a', fontSize: 16, fontWeight: 500 }}>mL</span>
      </div>
      <div style={{ color: '#8aaac8', fontSize: 12 }}>
        {Math.round(levelPct * 100)}% of {capacity} mL capacity
      </div>
    </div>
  )
}

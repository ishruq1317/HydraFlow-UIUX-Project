import { useState } from 'react'
import { hydrationService, type DrinkLogItem } from '../services/hydration'

interface Props {
  onClose: () => void
  onLogged?: () => void
}

const PRESET_AMOUNTS = [
  { label: 'Glass', amount: 250, icon: '🥛' },
  { label: 'Mug', amount: 350, icon: '☕' },
  { label: 'Bottle', amount: 500, icon: '💧' },
  { label: 'Large Bottle', amount: 750, icon: '🍶' },
]

const DRINK_TYPES: { id: DrinkLogItem['type']; label: string; icon: string }[] = [
  { id: 'water', label: 'Pure Water', icon: '💧' },
  { id: 'electrolyte', label: 'Electrolyte', icon: '⚡' },
  { id: 'tea', label: 'Herbal Tea', icon: '🍵' },
]

export default function LogDrinkSheet({ onClose, onLogged }: Props) {
  const [selectedAmount, setSelectedAmount] = useState<number>(250)
  const [selectedType, setSelectedType] = useState<DrinkLogItem['type']>('water')
  const [customAmount, setCustomAmount] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const handleLog = () => {
    const finalAmount = customAmount ? parseInt(customAmount, 10) : selectedAmount
    if (!finalAmount || finalAmount <= 0) return

    hydrationService.logDrink(finalAmount, selectedType, note || `${finalAmount} mL ${selectedType}`)
    setIsSuccess(true)

    setTimeout(() => {
      if (onLogged) onLogged()
      onClose()
    }, 450)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(7,21,37,0.65)',
        display: 'flex',
        alignItems: 'flex-end',
        backdropFilter: 'blur(3px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          background: '#ffffff',
          borderRadius: '28px 28px 0 0',
          padding: '16px 24px 32px',
          boxShadow: '0 -8px 40px rgba(10,50,100,0.22)',
          boxSizing: 'border-box',
          maxHeight: '90%',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <div style={{ width: 38, height: 4, borderRadius: 2, background: '#dde5ef' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0d1b2a', letterSpacing: -0.3 }}>
              Log Fluid Intake
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: 13, color: '#8aaac8' }}>
              Add to your daily hydration progress
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f2f5f9',
              border: 'none',
              borderRadius: 10,
              width: 34,
              height: 34,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5a7a9a" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Success confirmation */}
        {isSuccess ? (
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
            borderRadius: 16,
            padding: '24px',
            textAlign: 'center',
            border: '1px solid #86efac',
          }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
            <div style={{ color: '#15803d', fontSize: 18, fontWeight: 700 }}>Logged Successfully!</div>
            <div style={{ color: '#166534', fontSize: 13, marginTop: 4 }}>
              +{customAmount || selectedAmount} mL added to today's hydration
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Preset Amount Grid */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5a7a9a', marginBottom: 8 }}>
                SELECT AMOUNT
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {PRESET_AMOUNTS.map((item) => {
                  const isSelected = selectedAmount === item.amount && !customAmount
                  return (
                    <button
                      key={item.amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(item.amount)
                        setCustomAmount('')
                      }}
                      style={{
                        background: isSelected ? 'linear-gradient(135deg, #0a6cbc, #00b4d8)' : '#f8faff',
                        border: isSelected ? '1.5px solid #0a6cbc' : '1px solid rgba(10,108,188,0.1)',
                        borderRadius: 14,
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.18s',
                        boxShadow: isSelected ? '0 4px 12px rgba(10,108,188,0.25)' : 'none',
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{item.icon}</span>
                      <div>
                        <div style={{ color: isSelected ? '#fff' : '#0d1b2a', fontSize: 15, fontWeight: 700 }}>
                          {item.amount} mL
                        </div>
                        <div style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : '#8aaac8', fontSize: 11 }}>
                          {item.label}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5a7a9a', marginBottom: 6 }}>
                OR CUSTOM AMOUNT (mL)
              </label>
              <input
                type="number"
                placeholder="e.g. 400"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                style={{
                  width: '100%',
                  background: '#f8faff',
                  border: customAmount ? '1.5px solid #0a6cbc' : '1px solid #d1dbe8',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#0d1b2a',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Beverage Type */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5a7a9a', marginBottom: 8 }}>
                BEVERAGE TYPE
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {DRINK_TYPES.map((t) => {
                  const active = selectedType === t.id
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedType(t.id)}
                      style={{
                        flex: 1,
                        background: active ? 'rgba(10,108,188,0.1)' : '#f8faff',
                        border: active ? '1.5px solid #0a6cbc' : '1px solid rgba(10,108,188,0.08)',
                        borderRadius: 12,
                        padding: '10px 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                        cursor: 'pointer',
                        transition: 'all 0.18s',
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{t.icon}</span>
                      <span style={{ color: active ? '#0a6cbc' : '#5a7a9a', fontSize: 11, fontWeight: active ? 700 : 500 }}>
                        {t.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Note input */}
            <div>
              <input
                type="text"
                placeholder="Optional note (e.g. Post-workout drink)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{
                  width: '100%',
                  background: '#f8faff',
                  border: '1px solid #d1dbe8',
                  borderRadius: 12,
                  padding: '11px 14px',
                  fontSize: 13,
                  color: '#0d1b2a',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleLog}
              style={{
                marginTop: 4,
                background: 'linear-gradient(135deg, #0a6cbc, #00b4d8)',
                border: 'none',
                borderRadius: 16,
                padding: '16px',
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif',
                boxShadow: '0 4px 16px rgba(10,108,188,0.35)',
                minHeight: 52,
              }}
            >
              Log +{customAmount || selectedAmount} mL
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

interface Props {
  onClose: () => void
}

const electrolytes = [
  {
    name: 'Fluid',
    icon: '💧',
    value: 60,
    consumed: '1.4 L',
    target: '2.8 L',
    color: '#0891b2',
    bg: '#ecfeff',
    need: 'Moderate',
    needColor: '#0891b2',
    note: 'On track — keep drinking through the afternoon.',
  },
  {
    name: 'Sodium',
    icon: '🧂',
    value: 45,
    consumed: '~920 mg',
    target: '~2,000 mg',
    color: '#e8510a',
    bg: '#fff3ee',
    need: 'Moderate',
    needColor: '#e8510a',
    note: 'Gym session will increase loss — consider an electrolyte drink.',
  },
  {
    name: 'Potassium',
    icon: '🍌',
    value: 55,
    consumed: '~1,760 mg',
    target: '~3,200 mg',
    color: '#7c3aed',
    bg: '#f5f3ff',
    need: 'Low',
    needColor: '#94a3b8',
    note: 'Within range for current activity level.',
  },
]

export default function ElectrolyteSheet({ onClose }: Props) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(7,21,37,0.55)',
      display: 'flex', alignItems: 'flex-end',
      backdropFilter: 'blur(2px)',
    }} onClick={onClose}>
      <div
        style={{
          width: '100%',
          background: '#fff',
          borderRadius: '26px 26px 0 0',
          maxHeight: '88%',
          overflowY: 'auto',
          boxShadow: '0 -8px 40px rgba(10,50,100,0.18)',
        }}
        className="no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#dde5ef' }} />
        </div>

        <div style={{ padding: '16px 24px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0d1b2a', letterSpacing: -0.3 }}>
                Electrolyte Insights
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#8aaac8' }}>
                Based on your activity and sweat patterns
              </p>
            </div>
            <button onClick={onClose} style={{
              background: '#f2f5f9', border: 'none', borderRadius: 10,
              width: 36, height: 36, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minWidth: 36,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5a7a9a" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Disclaimer */}
          <div style={{
            background: '#f8faff',
            border: '1px solid rgba(10,108,188,0.1)',
            borderRadius: 12,
            padding: '10px 13px',
            marginBottom: 18,
            marginTop: 12,
          }}>
            <p style={{ margin: 0, color: '#5a7a9a', fontSize: 12, lineHeight: 1.55 }}>
              These are estimated indicators only — not medical advice. Consult a healthcare professional for clinical guidance.
            </p>
          </div>

          {/* Overall need */}
          <div style={{
            background: 'linear-gradient(135deg, #071525, #0a3558)',
            borderRadius: 18,
            padding: '16px 18px',
            marginBottom: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4 }}>
                Overall Need Today
              </div>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>Moderate</div>
            </div>
            <div style={{ textAlign: 'right', maxWidth: 130 }}>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: 1.5 }}>
                Gym + outdoor commute increase sweat rate today
              </div>
            </div>
          </div>

          {/* Individual indicators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {electrolytes.map((e) => (
              <div key={e.name} style={{
                background: '#f8faff',
                borderRadius: 18,
                padding: '16px',
                border: '1px solid rgba(10,108,188,0.07)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: e.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18,
                    }}>
                      {e.icon}
                    </div>
                    <div>
                      <div style={{ color: '#0d1b2a', fontSize: 15, fontWeight: 700 }}>{e.name}</div>
                      <div style={{ color: '#8aaac8', fontSize: 12, marginTop: 1 }}>
                        {e.consumed} of {e.target}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    background: e.bg,
                    color: e.needColor,
                    borderRadius: 8, padding: '4px 10px',
                    fontSize: 12, fontWeight: 600,
                  }}>
                    {e.need}
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: 8, background: '#e4ebf4', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{
                    height: '100%',
                    width: `${e.value}%`,
                    background: `linear-gradient(90deg, ${e.color}80, ${e.color})`,
                    borderRadius: 4,
                    transition: 'width 0.6s ease',
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#8aaac8', fontSize: 11 }}>{e.value}% of estimated daily need</span>
                  <span style={{ color: e.color, fontSize: 11, fontWeight: 600 }}>Target: {e.target}</span>
                </div>

                <div style={{
                  background: e.bg,
                  borderRadius: 10,
                  padding: '9px 12px',
                  border: `1px solid ${e.color}20`,
                }}>
                  <span style={{ color: e.color, fontSize: 12, lineHeight: 1.45 }}>{e.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

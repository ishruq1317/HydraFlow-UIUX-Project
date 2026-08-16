interface TimelineItem {
  time: string
  amount: number
  status: 'done' | 'next' | 'upcoming'
}

interface Props {
  timeline: TimelineItem[]
  onClose: () => void
}

const statusConfig = {
  done: { label: 'Completed', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)', dot: '✓' },
  next: { label: 'Up next', color: '#0a6cbc', bg: 'rgba(10,108,188,0.1)', border: 'rgba(10,108,188,0.3)', dot: '◉' },
  upcoming: { label: 'Upcoming', color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'transparent', dot: '○' },
}

export default function TimelineSheet({ timeline, onClose }: Props) {
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
          maxHeight: '85%',
          overflowY: 'auto',
          boxShadow: '0 -8px 40px rgba(10,50,100,0.18)',
        }}
        className="no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#dde5ef' }} />
        </div>

        <div style={{ padding: '16px 24px 36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0d1b2a', letterSpacing: -0.3 }}>
                Hydration Timeline
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#8aaac8' }}>
                Today's 5 recommended sessions
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

          {/* Progress summary */}
          <div style={{
            background: '#f8faff',
            borderRadius: 14,
            padding: '12px 16px',
            border: '1px solid rgba(10,108,188,0.1)',
            marginBottom: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ color: '#8aaac8', fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>Progress</div>
              <div style={{ color: '#0a6cbc', fontSize: 18, fontWeight: 700, marginTop: 2 }}>2 of 5 done</div>
            </div>
            <div style={{ width: 80, height: 6, background: '#e4ebf4', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: '40%', height: '100%', background: 'linear-gradient(90deg, #0a6cbc, #00c8e8)', borderRadius: 3 }} />
            </div>
          </div>

          {/* Timeline items */}
          <div style={{ position: 'relative' }}>
            {/* Vertical connector */}
            <div style={{
              position: 'absolute', left: 19, top: 20, bottom: 20,
              width: 1.5, background: '#edf1f7', borderRadius: 1,
            }} />

            {timeline.map((item, i) => {
              const cfg = statusConfig[item.status]
              return (
                <div key={i} style={{
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  marginBottom: i < timeline.length - 1 ? 18 : 0,
                }}>
                  {/* Status dot */}
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: item.status === 'next' ? 'linear-gradient(135deg, rgba(10,108,188,0.12), rgba(0,180,216,0.12))' : cfg.bg,
                    border: `1.5px solid ${cfg.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, position: 'relative', zIndex: 1,
                  }}>
                    <span style={{ color: cfg.color, fontSize: 13, fontWeight: 700 }}>{cfg.dot}</span>
                  </div>

                  {/* Content */}
                  <div style={{
                    flex: 1,
                    background: item.status === 'next' ? 'linear-gradient(135deg, #eff7ff, #e8f3fb)' : '#f8faff',
                    borderRadius: 14,
                    padding: '12px 14px',
                    border: item.status === 'next'
                      ? '1.5px solid rgba(10,108,188,0.2)'
                      : '1px solid rgba(10,108,188,0.07)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: '#8aaac8', fontSize: 11, marginBottom: 3 }}>{item.time}</div>
                        <div style={{ color: '#0d1b2a', fontSize: 17, fontWeight: 700 }}>{item.amount} mL</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                        <div style={{
                          background: cfg.bg,
                          color: cfg.color,
                          borderRadius: 8, padding: '3px 10px',
                          fontSize: 11, fontWeight: 600,
                        }}>
                          {cfg.label}
                        </div>
                        {item.status === 'next' && (
                          <button style={{
                            background: '#0a6cbc',
                            border: 'none', borderRadius: 8,
                            padding: '6px 14px',
                            color: '#fff', fontSize: 12, fontWeight: 600,
                            cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
                            minHeight: 30,
                          }}>
                            Log it
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

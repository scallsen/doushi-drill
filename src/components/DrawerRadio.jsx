const srOnly = {
  position: 'absolute', width: 1, height: 1, padding: 0,
  margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap', border: 0,
}

export default function DrawerRadio({ value, onChange, options, name }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
      {options.map(opt => {
        const selected = value === opt.value
        return (
          <label key={opt.value} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={selected}
              onChange={() => onChange(opt.value)}
              style={srOnly}
            />
            <div style={{
              width: 14,
              height: 14,
              flexShrink: 0,
              borderRadius: '50%',
              border: selected ? 'none' : '1px solid rgba(255,255,255,0.35)',
              background: selected ? 'rgba(255,255,255,0.85)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 130ms',
            }}>
              {selected && (
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2E2E2E' }} />
              )}
            </div>
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, fontFamily: 'inherit' }}>
              {opt.label}
            </span>
          </label>
        )
      })}
    </div>
  )
}

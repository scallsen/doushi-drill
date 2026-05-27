import { FONT } from '../data/theme.js'
import { useTranslation } from '../i18n/index.jsx'

export default function ModeToggle({ value, onChange }) {
  const { t } = useTranslation()
  const options = [
    { key: 'input', label: t('ui.mode_input') },
    { key: 'speed', label: t('ui.mode_speed') },
  ]
  return (
    <div style={{
      display: 'inline-flex',
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: 8,
      padding: 2,
      gap: 2,
    }}>
      {options.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            padding: '5px 12px',
            fontSize: 13,
            fontFamily: FONT,
            background: value === key ? 'rgba(255,255,255,0.15)' : 'transparent',
            color: value === key ? '#fff' : 'rgba(255,255,255,0.45)',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            letterSpacing: '0.05em',
            transition: 'background 130ms, color 130ms',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

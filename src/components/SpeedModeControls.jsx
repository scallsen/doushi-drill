import { useTranslation } from '../i18n/index.jsx'

export default function SpeedModeControls({ isFlipped, transitioning, onVerdict }) {
  const { t } = useTranslation()
  return (
    <div style={{ height: 52, width: 'min(380px, calc(100vw - 32px))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {isFlipped ? (
        <div style={{ display: 'flex', width: '100%', gap: 12 }}>
          <button
            onClick={() => onVerdict(false)}
            disabled={transitioning}
            className="verdict-btn"
            style={{
              flex: 1,
              padding: '10px 0',
              fontSize: 14,
              fontFamily: 'inherit',
              background: 'rgba(192, 57, 43, 0.85)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            {t('card.incorrect')} [Z]
          </button>
          <button
            onClick={() => onVerdict(true)}
            disabled={transitioning}
            className="verdict-btn"
            style={{
              flex: 1,
              padding: '10px 0',
              fontSize: 14,
              fontFamily: 'inherit',
              background: 'rgba(39, 174, 96, 0.85)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            {t('card.correct')} [X]
          </button>
        </div>
      ) : (
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
          {navigator.maxTouchPoints > 0 ? t('card.tap_to_flip') : t('card.click_to_flip')}
        </div>
      )}
    </div>
  )
}

import { buildFurigana, buildFuriganaForConjugation } from '../../utils/furigana.js'
import { FONT } from '../../data/theme.js'
import { useTranslation } from '../../i18n/index.jsx'

export default function CardContent({ label, n, past, word, kana = null, wordKanji = null, showFurigana = false, pixelFont = true, answerLabel = null, translation = null }) {
  const { t } = useTranslation()
  const jaFont = pixelFont ? FONT : "system-ui, sans-serif"
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {past && (
        <div style={{ position: 'absolute', bottom: 12, left: 20, fontFamily: FONT, fontSize: '5.5cqw', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#222', pointerEvents: 'none' }}>
          {t('tense.past')}
        </div>
      )}
      {answerLabel && (
        <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontSize: '5.5cqw', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#222' }}>
          {answerLabel}
        </div>
      )}
      {n && (
        <div style={{ position: 'absolute', bottom: 12, right: 20, fontFamily: FONT, fontSize: '5.5cqw', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#222', pointerEvents: 'none' }}>
          {t('polarity.negative')}
        </div>
      )}

      {/* Word + label */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: '0 16px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: jaFont,
            fontSize: '12.63cqw',
            fontWeight: 400,
            color: '#222',
            letterSpacing: 'normal',
            lineHeight: 1.2,
            textShadow: '2px 2px 0 rgba(0,0,0,0.25)',
          }}
        >
          {showFurigana && kana ? (() => {
            const f = wordKanji
              ? buildFuriganaForConjugation(word, wordKanji, kana)
              : buildFurigana(word, kana)
            if (!f) return word
            return (
              <span>
                {f.prefix}
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  <span style={{
                    position: 'absolute',
                    bottom: '100%',
                    marginBottom: 2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.45em',
                    fontFamily: jaFont,
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                  }}>
                    {f.furigana}
                  </span>
                  {f.kanjiPart}
                </span>
                {f.okurigana}
              </span>
            )
          })() : word}
        </div>
        {translation && (
          <div
            style={{
              fontFamily: FONT,
              fontSize: '5.26cqw',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: '#555',
            }}
          >
            {translation}
          </div>
        )}
        {label && (
          <div
            style={{
              fontFamily: FONT,
              fontSize: '6.84cqw',
              fontWeight: 400,
              letterSpacing: '0.05em',
              color: '#222',
              textShadow: '2px 2px 0 rgba(0,0,0,0.15)',
            }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  )
}

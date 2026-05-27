import VARIANTS from './variants.js'
import CardShell from './CardShell.jsx'
import CardContent from './CardContent.jsx'
import FlipCard from '../../FlipCard.jsx'
import { FORMS } from '../../data/forms.js'
import { useTranslation } from '../../i18n/index.jsx'

export default function ConjugationCard({ variant = 'plain', word = '', kana = null, showFurigana = false, pixelFont = true, answer = null, negative = false, past = false, bgComponent = null, registerLabel = null, flipped = false, onFlip = null, animate = true, showAnts = true, translation = null, showTranslation = 'off', focusHint = null, onFocusActivate = null }) {
  const { t } = useTranslation()
  const config = VARIANTS[variant] ?? VARIANTS.plain
  const FrontBg = bgComponent ?? config.BgComponent
  const answerLabel = FORMS[variant]?.axes?.includes('register') ? registerLabel : null
  const frontTranslation = showTranslation === 'both' ? translation : null
  const backTranslation  = showTranslation === 'both' || showTranslation === 'back' ? translation : null
  const label = t(config.labelKey)

  const front = (
    <CardShell bgColor={config.bgColor} border={config.border} BgComponent={FrontBg}>
      <CardContent label={label} n={negative} past={past} word={word} kana={kana} showFurigana={showFurigana} pixelFont={pixelFont} answerLabel={answerLabel} translation={frontTranslation} />
    </CardShell>
  )

  const back = (
    <CardShell bgColor={config.bgColor} border={config.border} BgComponent={FrontBg}>
      {answer && <CardContent label={label} n={negative} past={past} word={answer} kana={kana} wordKanji={word} showFurigana={showFurigana} pixelFont={pixelFont} answerLabel={answerLabel} translation={backTranslation} />}
    </CardShell>
  )

  const ants = flipped && animate && showAnts ? (
    <svg viewBox="0 0 380 280" className="mc-overlay" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10, overflow: 'visible' }} aria-hidden="true">
      <rect className="mc-ants" x="-4" y="-4" width="388" height="288" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeDasharray="6 6" />
      <rect className="mc-ants--offset" x="-4" y="-4" width="388" height="288" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="2" strokeDasharray="6 6" />
    </svg>
  ) : null

  return (
    <div style={{ width: 'min(380px, calc(100vw - 32px))', aspectRatio: '380 / 280', containerType: 'size' }}>
      <FlipCard front={front} back={back} width="100%" height="100%" flipped={flipped} onFlip={onFlip} animate={animate} overlay={ants} focusHint={focusHint ?? t('card.flip')} onFocusActivate={onFocusActivate} />
    </div>
  )
}

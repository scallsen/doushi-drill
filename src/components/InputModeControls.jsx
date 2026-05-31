import { useRef, useEffect, forwardRef } from 'react'
import { useTranslation } from '../i18n/index.jsx'
import * as wanakana from 'wanakana'

const InputModeControls = forwardRef(function InputModeControls({ value, onValueChange, onSubmit, isFlipped, onVerdict, transitioning }, ref) {
  const { t } = useTranslation()
  const inputRef = useRef(null)
  const onVerdictRef = useRef(onVerdict)
  useEffect(() => { onVerdictRef.current = onVerdict })

  useEffect(() => {
    if (transitioning || isFlipped) return
    // preventScroll: keyboard is already open — don't trigger a browser scroll
    inputRef.current?.focus({ preventScroll: true })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transitioning])

  useEffect(() => {
    if (!isFlipped) return
    // Defer activation by one tick — the Enter keydown that triggered the flip is still
    // propagating when this effect fires, and would otherwise immediately advance the card.
    let active = false
    const timer = setTimeout(() => { active = true }, 0)
    function onKey(e) {
      if (!active) return
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        onVerdictRef.current(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
    }
  }, [isFlipped])

  // When keyboard first opens, override the browser's default scroll (which puts the
  // input near the top) and anchor it to the bottom of the visible area instead.
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    let prevH = vv.height
    const handler = () => {
      const h = vv.height
      if (h < prevH && document.activeElement === inputRef.current) {
        setTimeout(() => inputRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' }), 50)
      }
      prevH = h
    }
    vv.addEventListener('resize', handler)
    return () => vv.removeEventListener('resize', handler)
  }, [])

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    fontSize: 16,
    fontFamily: 'inherit',
    background: 'rgba(255,255,255,0.07)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 8,
    outline: 'none',
    letterSpacing: '0.05em',
  }

  return (
    <div style={{ position: 'relative', height: 52, width: 'min(380px, calc(100vw - 32px))', display: 'flex', alignItems: 'center' }}>
      <input
        ref={node => { inputRef.current = node; if (ref) ref.current = node; }}
        type="text"
        value={value}
        onChange={isFlipped ? undefined : e => onValueChange(wanakana.toHiragana(e.target.value, { IMEMode: true }))}
        onKeyDown={isFlipped ? undefined : e => { if (e.key === 'Enter') onSubmit() }}
        readOnly={isFlipped || transitioning}
        onPointerDown={e => {
          if (isFlipped) { e.preventDefault(); return }
          const vv = window.visualViewport
          const kbOpen = vv && vv.height < window.screen.height * 0.75
          if (!kbOpen) {
            e.preventDefault()
            inputRef.current?.focus({ preventScroll: true })
          }
        }}
        placeholder={t('card.input_placeholder')}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        style={{ ...inputStyle, ...(isFlipped ? { background: 'rgba(248,113,113,0.12)', border: '1px solid transparent', color: 'rgba(248,113,113,0.9)' } : {}) }}
      />
      {isFlipped && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }} aria-hidden="true">
          <rect x="0" y="0" width="100%" height="100%" rx="8" ry="8" fill="none" stroke="rgba(248,113,113,0.6)" strokeWidth="2" />
        </svg>
      )}
    </div>
  )
})

export default InputModeControls

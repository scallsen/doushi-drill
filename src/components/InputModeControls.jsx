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
    inputRef.current?.focus()
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
    <div style={{ height: 52, width: 'min(380px, calc(100vw - 32px))', display: 'flex', alignItems: 'center' }}>
      <input
        ref={node => { inputRef.current = node; if (ref) ref.current = node; }}
        type="text"
        value={value}
        onChange={isFlipped ? undefined : e => onValueChange(wanakana.toHiragana(e.target.value, { IMEMode: true }))}
        onKeyDown={isFlipped ? undefined : e => { if (e.key === 'Enter') onSubmit() }}
        readOnly={isFlipped}
        disabled={isFlipped || transitioning}
        placeholder={t('card.input_placeholder')}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        style={{ ...inputStyle, ...(isFlipped ? { opacity: 0.5 } : {}) }}
      />
    </div>
  )
})

export default InputModeControls

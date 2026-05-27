import { useState, useRef, useEffect } from 'react'
import { useTranslation } from '../i18n/index.jsx'
// TODO: npm install wanakana
// import * as wanakana from 'wanakana'

export default function InputModeControls({ card, isFlipped, onVerdict, onFlipToReveal, transitioning }) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const inputRef = useRef(null)
  const onVerdictRef = useRef(onVerdict)
  useEffect(() => { onVerdictRef.current = onVerdict })

  useEffect(() => {
    setValue('')
  }, [card.id])

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

  // TODO: bind wanakana once installed
  // useEffect(() => {
  //   const el = inputRef.current
  //   if (!el) return
  //   wanakana.bind(el, { IMEMode: 'toHiragana' })
  //   return () => wanakana.unbind(el)
  // }, [])

  function handleKeyDown(e) {
    if (e.key !== 'Enter') return
    const trimmed = value.trim()
    if (!trimmed) return
    // TODO: normalize trimmed through wanakana.toHiragana before comparison
    const correct = card.acceptedAnswers.includes(trimmed)
    if (correct) {
      onVerdict(true)
    } else {
      onFlipToReveal()
    }
  }

  const formLabel = t(`forms.${card.variant}`) ?? card.variant

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

  if (isFlipped) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 'min(380px, calc(100vw - 32px))' }}>
        <input
          type="text"
          value={value}
          readOnly
          disabled
          style={{ ...inputStyle, opacity: 0.5 }}
        />
        <button
          onClick={() => onVerdict(false)}
          disabled={transitioning}
          className="verdict-btn"
          style={{
            width: '100%',
            padding: '10px 0',
            fontSize: 14,
            fontFamily: 'inherit',
            background: 'rgba(255,255,255,0.12)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          {t('card.next_card')}
        </button>
      </div>
    )
  }

  return (
    <div style={{ width: 'min(380px, calc(100vw - 32px))' }}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={transitioning}
        placeholder={`${t('card.input_placeholder_prefix')} ${formLabel} ${t('card.input_placeholder_suffix')}`}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        style={inputStyle}
      />
    </div>
  )
}

import { conjugate } from './data/conjugation.js'

function inResult(result, entry) {
  return Array.isArray(result) && result.includes(entry)
}

export function getErrorHint(card, entry) {
  const { word, formKey, register, tense, polarity } = card
  const { wordType, group, kana } = word
  const w = word.kanji

  const plainNegSuffixes = ['なかった', 'ないで', 'ない']
  const politeSuffixes   = ['ませんでした', 'ました', 'ましょう', 'ません', 'ます', 'です']
  const negSuffixes      = ['ませんでした', 'ません', 'なかった', 'ないで', 'ない']

  // ── Word-type error ─────────────────────────────────────────────────────
  let wordTypeHint = null

  if (wordType === 'adjective' && group === 'na' && entry.includes('くない'))
    wordTypeHint = `${w} is a な-adjective.`
  else if (wordType === 'adjective' && group === 'i' && entry.includes('じゃない'))
    wordTypeHint = `${w} is an い-adjective.`
  else if (wordType === 'verb' && group === 2) {
    const nS = kana.slice(0, -1), kS = w.slice(0, -1)
    if (inResult(conjugate({ ...word, group: 1 }, formKey, register, tense, polarity), entry) ||
        entry.startsWith(nS + 'り') || entry.startsWith(kS + 'り') ||
        (entry.startsWith(nS + 'ら') && !entry.startsWith(nS + 'られ')) ||
        (entry.startsWith(kS + 'ら') && !entry.startsWith(kS + 'られ')))
      wordTypeHint = `${w} is a る-verb.`
  } else if (wordType === 'verb' && group === 1) {
    if (inResult(conjugate({ ...word, group: 2 }, formKey, register, tense, polarity), entry))
      wordTypeHint = `${w} is an う-verb.`
  } else if (wordType === 'verb' && group === 3) {
    if (kana.endsWith('する') && kana !== 'する') {
      const prefix = kana.slice(0, -2)
      if (entry.startsWith(prefix) && !entry.slice(prefix.length).startsWith('し'))
        wordTypeHint = `${w} is a する compound verb.`
    } else if (kana === 'する') {
      if (inResult(conjugate({ ...word, group: 1 }, formKey, register, tense, polarity), entry) ||
          inResult(conjugate({ ...word, group: 2 }, formKey, register, tense, polarity), entry))
        wordTypeHint = 'する is an irregular verb.'
    } else if (kana === 'くる') {
      if (inResult(conjugate({ ...word, group: 1 }, formKey, register, tense, polarity), entry) ||
          inResult(conjugate({ ...word, group: 2 }, formKey, register, tense, polarity), entry))
        wordTypeHint = 'くる is an irregular verb.'
    }
  }

  // ── Register error ──────────────────────────────────────────────────────
  let registerHint = null

  if (register === 'polite') {
    if (inResult(conjugate(word, formKey, 'plain', tense, polarity), entry))
      registerHint = (formKey === 'default' && wordType === 'adjective')
        ? 'です missing from polite form.'
        : 'Polite form required.'
  } else if (register === 'plain') {
    if (inResult(conjugate(word, formKey, 'polite', tense, polarity), entry))
      registerHint = 'Plain form required.'
  }
  // Pattern fallback: multi-axis cases where the conjugate comparison misses
  if (!registerHint) {
    if (register === 'plain' && politeSuffixes.some(s => entry.endsWith(s)))
      registerHint = 'Plain form required.'
    else if (register === 'polite' && plainNegSuffixes.some(s => entry.endsWith(s)))
      registerHint = 'Polite form required.'
  }

  // ── Tense error ─────────────────────────────────────────────────────────
  let tenseHint = null

  if (tense === 'past' && inResult(conjugate(word, formKey, register, 'present', polarity), entry))
    tenseHint = 'Past form missing.'
  else if (tense === 'present' && inResult(conjugate(word, formKey, register, 'past', polarity), entry))
    tenseHint = 'Present form required.'
  // Pattern fallback: present-negative markers when past is expected
  if (!tenseHint && tense === 'past' && polarity === 'negative') {
    if ((entry.endsWith('ない') && !entry.endsWith('なかった')) ||
        (entry.endsWith('ません') && !entry.endsWith('ませんでした')))
      tenseHint = 'Past form missing.'
  }

  // ── Polarity error ──────────────────────────────────────────────────────
  let polarityHint = null

  if (polarity === 'negative' && inResult(conjugate(word, formKey, register, tense, 'positive'), entry))
    polarityHint = 'Negative form missing.'
  else if (polarity === 'positive' && inResult(conjugate(word, formKey, register, tense, 'negative'), entry))
    polarityHint = 'Positive form required.'
  // Pattern fallback
  if (!polarityHint) {
    if (polarity === 'positive' && negSuffixes.some(s => entry.endsWith(s)))
      polarityHint = 'Positive form required.'
    else if (polarity === 'negative' && ['ました', 'ます', 'ましょう'].some(s => entry.endsWith(s)))
      polarityHint = 'Negative form missing.'
  }

  // ── Adjective pattern confusion ─────────────────────────────────────────
  let adjHint = null

  if (wordType === 'adjective' && group === 'i' && tense === 'past' && polarity === 'positive' && entry.endsWith('でした'))
    adjHint = 'い-adjective past tense uses かった, not でした.'
  else if (wordType === 'adjective' && group === 'na' && tense === 'past' && entry.endsWith('かった'))
    adjHint = 'な-adjective past tense uses だった, not かった.'

  // ── Collect and decide ──────────────────────────────────────────────────
  const hints = [wordTypeHint, registerHint, tenseHint, polarityHint, adjHint].filter(Boolean)

  // Te-form fallback: only fires when nothing else was detected
  if (formKey === 'te' && hints.length === 0)
    return 'Wrong て form used.'

  // If only the word-type hint fired, confirm the entry matches the wrong-group
  // conjugation for the CORRECT tense/register/polarity. The stem-based patterns
  // (e.g. startsWith(stem + 'り')) fire regardless of what follows, so they catch
  // wrong-group + wrong-tense as a single hit. If the entry doesn't match the
  // wrong-group + correct-axes form, there are multiple errors → generic.
  if (hints.length === 1 && wordTypeHint && wordType === 'verb') {
    const wrongGroup = group === 2 ? 1 : group === 1 ? 2 : null
    if (wrongGroup && !inResult(conjugate({ ...word, group: wrongGroup }, formKey, register, tense, polarity), entry))
      return null
  }

  // Single detected error → show it. Multiple → too ambiguous, fall back to generic.
  return hints.length === 1 ? hints[0] : null
}

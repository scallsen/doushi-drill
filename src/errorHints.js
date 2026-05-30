import { conjugate } from './data/conjugation.js'

function inResult(result, entry) {
  return Array.isArray(result) && result.includes(entry)
}

export function getErrorHint(card, entry) {
  const { word, formKey, register, tense, polarity } = card
  const { wordType, group, kana } = word
  const w = word.kanji

  // 1. Word-type confusion
  if (wordType === 'adjective' && group === 'na' && entry.includes('くない'))
    return `${w} is a な-adjective. Use じゃない, not くない.`

  if (wordType === 'adjective' && group === 'i' && entry.includes('じゃない'))
    return `${w} is an い-adjective. Use くない, not じゃない.`

  if (wordType === 'verb' && group === 2) {
    if (inResult(conjugate({ ...word, group: 1 }, formKey, register, tense, polarity), entry))
      return `${w} is a る-verb. Drop る from the verb stem.`
  }

  if (wordType === 'verb' && group === 1) {
    if (inResult(conjugate({ ...word, group: 2 }, formKey, register, tense, polarity), entry))
      return `${w} is an う-verb. Change the stem vowel.`
  }

  if (wordType === 'verb' && group === 3 && kana.endsWith('する') && kana !== 'する') {
    const prefix = kana.slice(0, -2)
    if (entry.startsWith(prefix) && !entry.slice(prefix.length).startsWith('し'))
      return `${w} is a する compound verb. Conjugate the する part.`
  }

  if (wordType === 'verb' && group === 3 && kana === 'する') {
    if (inResult(conjugate({ ...word, group: 1 }, formKey, register, tense, polarity), entry) ||
        inResult(conjugate({ ...word, group: 2 }, formKey, register, tense, polarity), entry))
      return 'する is an irregular verb.'
  }

  if (wordType === 'verb' && group === 3 && kana === 'くる') {
    if (inResult(conjugate({ ...word, group: 1 }, formKey, register, tense, polarity), entry) ||
        inResult(conjugate({ ...word, group: 2 }, formKey, register, tense, polarity), entry))
      return 'くる is an irregular verb.'
  }

  // 2. Register confusion
  if (register === 'polite') {
    if (inResult(conjugate(word, formKey, 'plain', tense, polarity), entry))
      return 'Polite form required.'
  }

  if (register === 'plain') {
    if (inResult(conjugate(word, formKey, 'polite', tense, polarity), entry))
      return 'Plain form required.'
  }

  if (formKey === 'default' && register === 'polite') {
    if (wordType === 'adjective' && group === 'i') {
      if (inResult(conjugate(word, formKey, 'plain', tense, polarity), entry))
        return 'です missing from polite form.'
    }
    if (wordType === 'adjective' && group === 'na') {
      if (inResult(conjugate(word, formKey, 'plain', tense, polarity), entry))
        return 'です missing from polite form.'
    }
  }

  // 3. Tense confusion
  if (tense === 'past') {
    if (inResult(conjugate(word, formKey, register, 'present', polarity), entry))
      return 'Past form missing.'
  }

  if (tense === 'present') {
    if (inResult(conjugate(word, formKey, register, 'past', polarity), entry))
      return 'Present form required.'
  }

  // 4. Polarity confusion
  if (polarity === 'negative') {
    if (inResult(conjugate(word, formKey, register, tense, 'positive'), entry))
      return 'Negative form missing.'
  }

  if (polarity === 'positive') {
    if (inResult(conjugate(word, formKey, register, tense, 'negative'), entry))
      return 'Positive form required.'
  }

  // 5. Adjective pattern confusion
  if (wordType === 'adjective' && group === 'i' && tense === 'past' && polarity === 'positive') {
    if (entry.endsWith('でした'))
      return 'い-adjective past tense uses かった, not でした.'
  }

  if (wordType === 'adjective' && group === 'na' && tense === 'past') {
    if (entry.endsWith('かった'))
      return 'な-adjective past tense uses だった, not かった.'
  }

  // 6. Te-form fallback
  if (formKey === 'te')
    return 'Wrong て form used.'

  return null
}

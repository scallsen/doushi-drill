export const WARN_MISC = new Set([
  'arch', 'obs', 'rare', 'dated', 'hist',
  'id',      // idiomatic — can't conjugate in isolation
  'on-mim',  // onomatopoeic (ドキドキする etc.)
  'X',       // rude/vulgar
  'derog', 'vulg', 'sens',
  'yoji',    // four-character compounds
])

export const WARN_FIELD = new Set([
  'med', 'chem', 'phys', 'biol', 'bot', 'zool',
  'anat', 'math', 'law', 'archit', 'geol', 'astron',
])

export const WARN_POS = new Set([
  'hon',  // honorific — not covered by the conjugation engine
  'hum',  // humble
])

export function hasBadTags(sense) {
  return (
    (sense.misc  ?? []).some(t => WARN_MISC.has(t))  ||
    (sense.field ?? []).some(t => WARN_FIELD.has(t)) ||
    (sense.partOfSpeech ?? []).some(t => WARN_POS.has(t))
  )
}

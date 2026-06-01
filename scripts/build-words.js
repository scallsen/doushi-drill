import { loadDictionary } from '@scriptin/jmdict-simplified-loader'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const JMDICT_PATH = process.argv[2] || resolve(__dirname, 'data', 'jmdict-eng.json')
const SEED_PATH = resolve(__dirname, 'words-seed.json')
const OUTPUT_PATH = resolve(__dirname, '../src/data/words.json')

if (!existsSync(JMDICT_PATH)) {
  console.error(`JMdict file not found: ${JMDICT_PATH}`)
  console.error()
  console.error('Download from: https://github.com/scriptin/jmdict-simplified/releases/latest')
  console.error('Grab the jmdict-eng-*.json.zip, unzip it, and place the JSON at:')
  console.error(`  ${JMDICT_PATH}`)
  console.error('Or pass the path as an argument: node scripts/build-words.js /path/to/jmdict-eng.json')
  process.exit(1)
}

const seed = JSON.parse(readFileSync(SEED_PATH, 'utf8'))

// Pre-build sets of kanji/kana we care about (including stripped base forms for する compounds)
// Compound する verbs: group 3, ends in する, but NOT plain する itself
function isSuruCompound(w) {
  return w.wordType === 'verb' && w.group === 3 && w.kanji !== 'する' && w.kanji.endsWith('する')
}
const targetKanji = new Set(seed.map(w => isSuruCompound(w) ? w.kanji.slice(0, -2) : w.kanji))
const targetKana  = new Set(seed.map(w => isSuruCompound(w) ? w.kana.slice(0, -2)  : w.kana))

// index: text → JMdict entry[]
const byKanji = new Map()
const byKana = new Map()

function addToIndex(map, key, entry) {
  if (!map.has(key)) map.set(key, [])
  map.get(key).push(entry)
}

function extractEnglish(entry) {
  return entry.sense[0]?.gloss[0]?.text ?? null
}

// Returns true/false for clearly transitive/intransitive verbs, null if both or neither.
function extractTransitive(entry) {
  const posTags = new Set(entry.sense.flatMap(s => s.partOfSpeech))
  const isVt = posTags.has('vt')
  const isVi = posTags.has('vi')
  if (isVt && !isVi) return true
  if (isVi && !isVt) return false
  return null
}

// Returns true if the matched kanji or kana element is marked common.
function extractCommon(entry, word) {
  const base = baseForm(word)
  if (base.kanji !== base.kana) {
    const kanjiEl = entry.kanji.find(k => k.text === base.kanji)
    if (kanjiEl) return kanjiEl.common
  }
  const kanaEl = entry.kana.find(k => k.text === base.kana)
  return kanaEl ? kanaEl.common : false
}

// For compound する verbs (e.g. 勉強する/べんきょうする), JMdict stores only the
// base noun form (勉強/べんきょう) with POS "vs". Strip する before looking up.
function baseForm(word) {
  if (isSuruCompound(word)) return { kanji: word.kanji.slice(0, -2), kana: word.kana.slice(0, -2) }
  return word
}

function lookupEntry(word) {
  const base = baseForm(word)
  // For words where kanji === kana (e.g. する, kana-only), use kana index
  const candidates =
    base.kanji && base.kanji !== base.kana
      ? (byKanji.get(base.kanji) || [])
      : (byKana.get(base.kana) || [])

  if (candidates.length === 0) return null

  // Prefer entry whose kana list includes our reading
  return (
    candidates.find(e => e.kana.some(k => k.text === base.kana)) ||
    candidates[0]
  )
}

console.log(`Loading JMdict from ${JMDICT_PATH} ...`)

loadDictionary('jmdict', JMDICT_PATH)
  .onMetadata(() => {})
  .onEntry((entry) => {
    for (const k of entry.kanji) {
      if (targetKanji.has(k.text)) addToIndex(byKanji, k.text, entry)
    }
    for (const k of entry.kana) {
      if (targetKana.has(k.text)) addToIndex(byKana, k.text, entry)
    }
  })
  .onEnd(() => {
    console.log('Building words.json ...')
    let missing = 0

    const words = seed.map(word => {
      const entry = lookupEntry(word)
      let english = null
      let transitive = null
      let common = false

      if (entry) {
        english = extractEnglish(entry)
        transitive = word.wordType === 'verb' ? extractTransitive(entry) : null
        common = extractCommon(entry, word)
        if (!common) console.warn(`  WARN: not marked common in JMdict: ${word.id} (${word.kanji})`)
      }

      if (!english) {
        console.warn(`  WARN: no English found for ${word.id} (${word.kanji})`)
        english = ''
        missing++
      }

      return { ...word, english, transitive, common }
    })

    writeFileSync(OUTPUT_PATH, JSON.stringify(words, null, 2) + '\n')
    console.log(`Wrote ${words.length} words to ${OUTPUT_PATH}${missing ? ` (${missing} missing English)` : ''}`)
  })

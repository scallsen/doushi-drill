/**
 * suggest-words.js — generates candidate words from JMdict for expansion of words-seed.json.
 *
 * Usage:
 *   node scripts/suggest-words.js [--target N] [--category <posTag>]
 *
 *   --target N        Scale all category targets by N/324 (default 324)
 *   --category <tag>  Only output candidates for one bucket (e.g. v5k, v1, adj-i)
 *
 * Output: one JSON array per category, printed to stdout. Each entry is ready to
 * paste into words-seed.json. A comment line above each entry shows the English gloss.
 *
 * Run:  npm run suggest-words
 */

import { loadDictionary } from '@scriptin/jmdict-simplified-loader'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { hasBadTags } from './filters.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const JMDICT_PATH = resolve(__dirname, 'data', 'jmdict-eng.json')
const JLPT_PATH   = resolve(__dirname, 'data', 'jlpt.json')
const SEED_PATH   = resolve(__dirname, 'words-seed.json')

// jlpt.json: { kanji: { kana: level } } where 5=N5, 4=N4
const jlpt = existsSync(JLPT_PATH) ? JSON.parse(readFileSync(JLPT_PATH, 'utf8')) : null
if (!jlpt) console.error('WARN: scripts/data/jlpt.json not found — candidates will not be JLPT-prioritized')

function jlptLevel(kanji, kana) {
  if (!jlpt) return 0
  const entry = jlpt[kanji] ?? jlpt[kana]
  if (!entry) return 0
  return entry[kana] ?? Math.max(...Object.values(entry))
}

if (!existsSync(JMDICT_PATH)) {
  console.error(`JMdict not found: ${JMDICT_PATH}`)
  console.error('Download from: https://github.com/scriptin/jmdict-simplified/releases/latest')
  process.exit(1)
}

// ── CLI args ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const targetArg    = args.includes('--target')   ? Number(args[args.indexOf('--target')   + 1]) : null
const categoryArg  = args.includes('--category') ? args[args.indexOf('--category') + 1]         : null

// ── Category specs ────────────────────────────────────────────────────────────
// posTags: JMdict POS tags that identify this bucket
// wordType / group: values written into the seed entry
// target: total desired count (existing + new combined)
const CATEGORIES = [
  { key: 'v5k',  posTags: ['v5k'],               wordType: 'verb',      group: 1,    target: 20 },
  { key: 'v5g',  posTags: ['v5g'],               wordType: 'verb',      group: 1,    target: 10 },
  { key: 'v5s',  posTags: ['v5s'],               wordType: 'verb',      group: 1,    target: 20 },
  { key: 'v5t',  posTags: ['v5t'],               wordType: 'verb',      group: 1,    target: 12 },
  { key: 'v5u',  posTags: ['v5u', 'v5u-s'],      wordType: 'verb',      group: 1,    target: 16 },
  { key: 'v5r',  posTags: ['v5r'],               wordType: 'verb',      group: 1,    target: 12 },
  { key: 'v5n',  posTags: ['v5n'],               wordType: 'verb',      group: 1,    target: 2  },
  { key: 'v5b',  posTags: ['v5b'],               wordType: 'verb',      group: 1,    target: 12 },
  { key: 'v5m',  posTags: ['v5m'],               wordType: 'verb',      group: 1,    target: 14 },
  { key: 'v1',   posTags: ['v1'],                wordType: 'verb',      group: 2,    target: 70 },
  { key: 'vk',   posTags: ['vk'],                wordType: 'verb',      group: 3,    target: 2  },
  { key: 'vs',   posTags: ['vs-i', 'vs-s', 'vs'],wordType: 'verb',      group: 3,    target: 14 },
  { key: 'adj-i',posTags: ['adj-i'],             wordType: 'adjective', group: 'i',  target: 35 },
  { key: 'adj-na',posTags: ['adj-na'],           wordType: 'adjective', group: 'na', target: 35 },
  { key: 'n',    posTags: ['n'],                 wordType: 'noun',      group: null, target: 50 },
]

const BASE_TOTAL = CATEGORIES.reduce((s, c) => s + c.target, 0)
const scale = targetArg ? targetArg / BASE_TOTAL : 1

const activeCats = categoryArg
  ? CATEGORIES.filter(c => c.key === categoryArg || c.posTags.includes(categoryArg))
  : CATEGORIES

if (categoryArg && activeCats.length === 0) {
  console.error(`Unknown category: ${categoryArg}`)
  console.error('Valid keys:', CATEGORIES.map(c => c.key).join(', '))
  process.exit(1)
}

// ── Seed exclusion set ────────────────────────────────────────────────────────
const seed = JSON.parse(readFileSync(SEED_PATH, 'utf8'))
const existingIds  = new Set(seed.map(w => w.id))
const existingKeys = new Set(seed.map(w => `${w.kanji}|${w.kana}`))

// ── Kana → romaji conversion ──────────────────────────────────────────────────
const KANA_MAP = {
  あ:'a',い:'i',う:'u',え:'e',お:'o',
  か:'ka',き:'ki',く:'ku',け:'ke',こ:'ko',
  が:'ga',ぎ:'gi',ぐ:'gu',げ:'ge',ご:'go',
  さ:'sa',し:'shi',す:'su',せ:'se',そ:'so',
  ざ:'za',じ:'ji',ず:'zu',ぜ:'ze',ぞ:'zo',
  た:'ta',ち:'chi',つ:'tsu',て:'te',と:'to',
  だ:'da',ぢ:'di',づ:'du',で:'de',ど:'do',
  な:'na',に:'ni',ぬ:'nu',ね:'ne',の:'no',
  は:'ha',ひ:'hi',ふ:'fu',へ:'he',ほ:'ho',
  ば:'ba',び:'bi',ぶ:'bu',べ:'be',ぼ:'bo',
  ぱ:'pa',ぴ:'pi',ぷ:'pu',ぺ:'pe',ぽ:'po',
  ま:'ma',み:'mi',む:'mu',め:'me',も:'mo',
  や:'ya',ゆ:'yu',よ:'yo',
  ら:'ra',り:'ri',る:'ru',れ:'re',ろ:'ro',
  わ:'wa',ゐ:'wi',ゑ:'we',を:'wo',ん:'n',
  // digraphs
  きゃ:'kya',きゅ:'kyu',きょ:'kyo',
  しゃ:'sha',しゅ:'shu',しょ:'sho',
  ちゃ:'cha',ちゅ:'chu',ちょ:'cho',
  にゃ:'nya',にゅ:'nyu',にょ:'nyo',
  ひゃ:'hya',ひゅ:'hyu',ひょ:'hyo',
  みゃ:'mya',みゅ:'myu',みょ:'myo',
  りゃ:'rya',りゅ:'ryu',りょ:'ryo',
  ぎゃ:'gya',ぎゅ:'gyu',ぎょ:'gyo',
  じゃ:'ja', じゅ:'ju', じょ:'jo',
  びゃ:'bya',びゅ:'byu',びょ:'byo',
  ぴゃ:'pya',ぴゅ:'pyu',ぴょ:'pyo',
}

function kanaToRomaji(kana) {
  let result = ''
  let i = 0
  while (i < kana.length) {
    const digraph = KANA_MAP[kana[i] + kana[i + 1]]
    if (digraph) { result += digraph; i += 2; continue }
    // double consonant (っ)
    if (kana[i] === 'っ') {
      const next = KANA_MAP[kana[i + 1] + kana[i + 2]] || KANA_MAP[kana[i + 1]] || ''
      result += next[0] || ''
      i++
      continue
    }
    result += KANA_MAP[kana[i]] || kana[i]
    i++
  }
  return result
}

function makeId(kana, catKey, existingIds) {
  const base = catKey === 'vs'
    ? kanaToRomaji(kana.slice(0, -2)) + '_suru'  // strip する from kana
    : kanaToRomaji(kana)
  if (!existingIds.has(base)) return base
  for (let n = 2; n < 20; n++) {
    const candidate = `${base}_${n}`
    if (!existingIds.has(candidate)) return candidate
  }
  return base + '_x'
}

// ── POS matching helpers ──────────────────────────────────────────────────────
function matchesCategory(entryPosTags, cat) {
  return cat.posTags.some(p => entryPosTags.has(p))
}

function isSuruCompound(entry, entryPosTags) {
  // Compound する verb: has vs/vs-i/vs-s POS, has a noun sense, no standalone する kana
  const hasSuru = entryPosTags.has('vs-i') || entryPosTags.has('vs-s') || entryPosTags.has('vs')
  const hasNoun = entry.sense.some(s => s.partOfSpeech.includes('n'))
  const isStandaloneSuru = entry.kana.some(k => k.text === 'する')
  return hasSuru && hasNoun && !isStandaloneSuru
}

// ── Collect candidates ────────────────────────────────────────────────────────
const candidates = Object.fromEntries(activeCats.map(c => [c.key, []]))
// JMdict POS tag → kana ending (for godan verbs)
const POS_TO_ENDING = {
  v5k:'く', v5g:'ぐ', v5s:'す', v5t:'つ', 'v5u':'う', 'v5u-s':'う',
  v5r:'る', v5n:'ぬ', v5b:'ぶ', v5m:'む',
}

function countExisting(cat) {
  const ending = POS_TO_ENDING[cat.key]
  return seed.filter(w => {
    if (w.wordType !== cat.wordType || String(w.group) !== String(cat.group)) return false
    if (ending) return w.kana.endsWith(ending)
    return true
  }).length
}

const needed = Object.fromEntries(activeCats.map(c => [
  c.key,
  Math.max(0, Math.ceil(c.target * scale) - countExisting(c)),
]))

console.error('Loading JMdict ...')

loadDictionary('jmdict', JMDICT_PATH)
  .onMetadata(() => {})
  .onEntry((entry) => {
    const entryPosTags = new Set(entry.sense.flatMap(s => s.partOfSpeech))

    for (const cat of activeCats) {
      if (!matchesCategory(entryPosTags, cat)) continue

      // Determine kanji/kana to use
      let kanji, kana
      if (cat.key === 'vs') {
        if (!isSuruCompound(entry, entryPosTags)) continue
        const kanjiEl = entry.kanji.find(k => k.common)
        const kanaEl  = entry.kana.find(k => k.common)
        if (!kanjiEl || !kanaEl) continue
        kanji = kanjiEl.text + 'する'
        kana  = kanaEl.text  + 'する'
      } else {
        const kanjiEl = entry.kanji.find(k => k.common)
        const kanaEl  = entry.kana.find(k => k.common && !k.noKanji)
        // For kana-only entries (する, くる, or kana-only nouns/adj)
        if (!kanjiEl && !kanaEl) continue
        kanji = kanjiEl ? kanjiEl.text : (entry.kana.find(k => k.common)?.text)
        kana  = kanaEl  ? kanaEl.text  : kanji
        if (!kanji || !kana) continue
      }

      // Skip already in seed
      if (existingKeys.has(`${kanji}|${kana}`)) continue

      // Skip bad tags on primary sense
      if (hasBadTags(entry.sense[0])) continue

      // English gloss
      const english = entry.sense[0]?.gloss[0]?.text
      if (!english) continue

      candidates[cat.key].push({ kanji, kana, english, jlptLevel: jlptLevel(kanji, kana) })
    }
  })
  .onEnd(() => {
    console.error('Done. Candidates per category:\n')

    const usedIds = new Set(existingIds)

    for (const cat of activeCats) {
      // Sort N5 first, then N4, then unlevelled — take only what's needed
      candidates[cat.key].sort((a, b) => b.jlptLevel - a.jlptLevel)
      candidates[cat.key] = candidates[cat.key].slice(0, needed[cat.key])

      const list = candidates[cat.key]
      const want = needed[cat.key]
      console.error(`${cat.key} (${cat.wordType} group=${cat.group}): ${list.length} found, ${want} needed`)

      if (list.length === 0) continue

      console.log(`\n// ── ${cat.key} (${cat.wordType} group=${String(cat.group)}) ─────────────`)
      for (const c of list) {
        const id = makeId(c.kana, cat.key, usedIds)
        usedIds.add(id)
        const entry = {
          id,
          kanji:    c.kanji,
          kana:     c.kana,
          romaji:   cat.key === 'vs'
            ? kanaToRomaji(c.kana.slice(0, -2))
            : kanaToRomaji(c.kana),
          wordType: cat.wordType,
          group:    cat.group,
        }
        console.log(`// ${c.english}`)
        console.log(JSON.stringify(entry) + ',')
      }
    }
  })

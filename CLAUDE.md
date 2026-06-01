# Katsuyō Drill — codebase guide

Japanese verb conjugation drill app. Vite + React, no TypeScript.

## Hosting
- Served at `scallsen.ca/katsuyou-drill/` via GitHub Pages. `base: '/katsuyou-drill/'` in `vite.config.js` must match the repo name — changing it breaks asset loading.
- `scallsen.ca` DNS is managed in Cloudflare (A records → GitHub Pages IPs, DNS only / grey cloud). The custom domain is set in the `scallsen.github.io` repo's GitHub Pages settings, not this one.

## Git workflow
- **Always create a feature branch before making any code changes.** Never commit directly to `main`.
- **Always run `npm run build` and `npm run lint` before committing.** Fix any errors before proceeding.
- **Commit messages must describe what changed and why** — not just what the code does.
- **After merging a branch, switch back to `main` and pull** (`git checkout main && git pull`).

## Conventions
- **Inline styles only** — no CSS modules, no Tailwind. CSS files are only for things that can't be expressed inline: `FlipCard.css` (3D flip animation), `global.css` (pseudo-element styles like custom scrollbars).
- **No comments** unless the WHY is non-obvious (a hidden constraint, a workaround, a subtle invariant).
- **No TypeScript** — plain JS throughout.
- `DrillPage` is the real entry point (`App.jsx` renders it).

## How the drill works

Options drawer → `buildPool()` → `useDrill(pool, { engine, seekCardId })` → renders cards one at a time.

- **Pool** — flat array of card specs, one per valid `(word × form × register/tense/polarity)` combo. Built by `src/data/drill.js::buildPool()`.
- **Float** — the active hand of ~7 cards. `float[0]` is always current. Correct answers retire the card and pull a fresh one from the pool. Wrong answers reinsert the card a few positions ahead so it returns after a short gap.
- **Streak** — increments on correct, resets to 0 on wrong.
- **Seek** — when a sidebar filter is toggled, `DrillPage` synchronously computes the new pool, finds the best matching card via `findSeekCard` (scoring: same word +8, same form +4, same register/tense/polarity +2 each), and passes its id as `seekCardId` to `useDrill`. On pool reinit, `useDrill` moves that card to `float[0]`. Adding a filter biases toward cards that match the new axis/value; removing one just finds the most similar valid card.

## Adding a new drill engine

Create `src/engines/myEngine.js` with this contract:

```js
export const label = 'Display Name'
export const description = 'One sentence shown in the Algorithm section of the options drawer.'

export function init(pool, floatSize) {
  // shuffle pool, take first floatSize as float
  return { float, pool, retired, streak, bestStreak: 0, totalCorrect, totalWrong, prevSnapshot: null }
}

export function onCorrect(state) {
  // retire float[0], pull next card from pool, increment streak
  // must update bestStreak and set prevSnapshot: { ...state, prevSnapshot: null }
  return newState
}

export function onWrong(state) {
  // reinsert float[0] later in float, reset streak
  // must set prevSnapshot: { ...state, prevSnapshot: null }
  return newState
}

// optional — enables undo
export function onUndo(state) {
  if (!state.prevSnapshot) return state
  return { ...state.prevSnapshot, prevSnapshot: null }
}
```

Then register it in `src/hooks/useDrill.js`:

```js
import * as MyEngine from '../engines/myEngine.js'

export const ENGINES = {
  simpleQueue: SimpleQueue,
  myEngine: MyEngine,   // ← add here
}
```

It will automatically appear as a selectable option in the options drawer.

## Word list — how it works

`src/data/words.json` is **generated** — do not edit it directly. The source of truth is:

- **`scripts/words-seed.json`** — curated list of `{ id, kanji, kana, romaji, wordType, group }`. Edit this to add/remove/change words.
- **`scripts/build-words.js`** — reads the seed, looks up each word in JMdict, fills in generated fields, writes `src/data/words.json`.

### Required data files (gitignored, one-time downloads)

Both files live in `scripts/data/` which is gitignored.

| File | Source | Notes |
|---|---|---|
| `jmdict-eng.json` | [scriptin/jmdict-simplified releases](https://github.com/scriptin/jmdict-simplified/releases/latest) — grab `jmdict-eng-common-*.json.zip`, unzip | Common-only variant (~16 MB) |
| `jlpt.json` | Run `node scripts/fetch-jlpt.js` (downloads from Bluskyo/JLPT_Vocabulary on GitHub) | N5 + N4 only, ~1 300 entries |

To regenerate `jlpt.json` manually: download `data/vocab/results/JLPT_vocab_ALL.json` from the [Bluskyo/JLPT_Vocabulary](https://github.com/Bluskyo/JLPT_Vocabulary) repo and run the fetch script.

### Adding new words (assisted)

Use `npm run suggest-words` to generate JLPT-prioritised candidates for any category that is below its target count. Output goes to stdout as paste-ready JSON with English glosses as comments.

```
npm run suggest-words                  # all categories
npm run suggest-words -- --category v5k   # only く-verbs
npm run suggest-words -- --target 400     # scale targets to 400 total
```

Review the output, paste accepted entries into `scripts/words-seed.json`, then run `npm run build:words`.

### Adding a single word manually

1. Add an entry to `scripts/words-seed.json`. Do not add `english`, `transitive`, `common`, or `difficulty` — those come from JMdict/JLPT data.
2. Run `npm run build:words` to regenerate `src/data/words.json`.
3. Verify the entry got a sensible English gloss, correct transitivity, `common: true`, and the expected `difficulty`; the script warns on any issues.

### Seed entry schema

```json
{
  "id": "kaku",
  "kanji": "書く",
  "kana": "かく",
  "romaji": "kaku",
  "wordType": "verb",
  "group": 1
}
```

- `id` — romaji of the kana reading. Append a suffix to disambiguate homophones: `kiru_cut` (切る, godan) vs `kiru_wear` (着る, ichidan). The `romaji` field always holds the bare pronunciation without the suffix.
- `wordType` — `"verb"`, `"adjective"`, or `"noun"`.
- `group` — `1`/`2`/`3` for verbs; `"i"`/`"na"` for adjectives; `null` for nouns.

No `english`, `transitive`, `common`, or `difficulty` — those are generated. No `jlpt` — that was dropped; difficulty is derived from the JLPT data file instead.

### Generated fields (added by build-words.js)

| Field | Type | Notes |
|---|---|---|
| `english` | `string` | First English gloss from sense[0] in JMdict |
| `transitive` | `boolean \| null` | `true` = transitive (`vt`), `false` = intransitive (`vi`), `null` = both, neither, or non-verb |
| `common` | `boolean` | `true` if the matched kanji/kana element is marked common in JMdict; build script warns if `false` |
| `difficulty` | `string` | `"beginner"` (N5), `"upper_beginner"` (N4), or `"common"` (JMdict common, unlevelled) — UI labels these as Beginner / Upper beginner / Intermediate |

### JMdict POS tags → group mapping

| JMdict tag | group |
|---|---|
| `v5k`, `v5g`, `v5s`, `v5t`, `v5u`, `v5r`, `v5n`, `v5b`, `v5m` | `1` (godan) |
| `v1` | `2` (ichidan) |
| `vk` | `3` (来る) |
| `vs-i`, `vs-s`, `vs` | `3` (する / compound する) |
| `adj-i` | `"i"` |
| `adj-na` | `"na"` |
| `n` | `null` |

For compound する verbs (e.g. 勉強する), the kanji field is the full compound (`"勉強する"`) and JMdict will have it as its own entry with `vs-i` POS.

### Distribution targets

Prioritise N5 then N4; use `npm run suggest-words` to generate candidates. The script encodes these targets and outputs only what is missing. Only go beyond N4 if a bucket genuinely can't fill from N5/N4 (mainly ぬ).

**Group 1 verbs — distribute by ending (JMdict POS tag):**
| Ending | POS tag | Target | Notes |
|--------|---------|--------|-------|
| く | `v5k` | 30 | includes 行く (special て form: いって) |
| ぐ | `v5g` | 12 | て form: いで |
| す | `v5s` | 25 | |
| つ | `v5t` | 15 | |
| う | `v5u` | 25 | |
| る-godan | `v5r` | 20 | only true godan-る (乗る, 走る, 知る); never ichidan |
| ぬ | `v5n` | 2 | 死ぬ is the only common N5/N4 word |
| ぶ | `v5b` | 15 | |
| む | `v5m` | 20 | |

**Group 2 verbs (ichidan, `v1`) — 100 total**

**Group 3 (irregular) — 18 total** — する (`vs-i`) + くる (`vk`) + compound する verbs (`vs`)

**い-adjectives (`adj-i`) — 50 total**

**な-adjectives (`adj-na`) — 40 total**

**Nouns (`n`) — 70 total**

## Key files

| File | Purpose |
|---|---|
| `src/data/conjugation.js` | `conjugate(word, formKey, register, tense, polarity)` — algorithmic conjugation for verbs, adjectives, nouns; returns accepted-answer array (kanji + kana) |
| `src/data/drill.js` | `buildPool`, `filterWords` (exported — used by DrillPage for live word count), `resolveVariant` |
| `src/data/illegalCombos.js` | Declarative list of card combos to suppress (e.g. trivial/duplicate answers); checked in `buildPool()` |
| `src/data/forms.js` | `FORMS` — all form/register definitions with axes and colors |
| `scripts/words-seed.json` | Curated word list (id, kanji, kana, romaji, wordType, group) — edit this, not words.json |
| `scripts/build-words.js` | Generates `src/data/words.json` from the seed + JMdict (`npm run build:words`) |
| `scripts/suggest-words.js` | Generates JLPT-prioritised candidate entries for any under-target category (`npm run suggest-words`) |
| `scripts/filters.js` | Shared `WARN_MISC / WARN_FIELD / WARN_POS` sets and `hasBadTags()` — used by both build and suggest scripts |
| `src/data/words.json` | **Generated** — word entries with `english`, `transitive`, `common`, `difficulty` from JMdict/JLPT; do not edit directly |
| `src/engines/simpleQueue.js` | Default engine — float + wrong-card reinsertion |
| `src/hooks/useDrill.js` | React wrapper for any engine; `ENGINES` registry; seek-on-reinit |
| `src/hooks/useTTS.js` | Web Speech API wrapper; speaks `conjugation` on card flip-to-back; `ttsEnabled` persisted in localStorage |
| `src/hooks/useSFX.js` | Web Audio API sound effects: `flip_card`, `draw_card`, `flip_card_correct` (pitch scales with streak), `flip_card_wrong`, `best_streak_broken` |
| `src/errorHints.js` | `getErrorHint(card, entry) → string \| null` — detects why a wrong input answer was wrong (word-type confusion, wrong register/tense/polarity); returns a short hint or null for generic |
| `src/components/DrillHUD.jsx` | HUD wrapper: streak display with pop/wiggle/wave animations, best streak, show/hide stats toggle, undo button |
| `src/pages/DrillPage.jsx` | Main page — options state, pool memoization, drill rendering, `findSeekCard` |
| `src/components/ConjugationCard/` | Card component family (CardShell, CardContent, variants) |

## Card spec shape

Output of `buildPool()`, input to engine and card rendering:

```js
{
  id,              // "${word.id}__${formKey}__${register}__..." — unique, used as React key
  word,            // full word object from words.json
  formKey, register, tense, polarity,
  conjugation,     // canonical answer string (kanji form) — shown on card back, spoken by TTS
  acceptedAnswers, // string[] — all accepted answers for grading (kanji + kana variants)
  variant,         // variant key for ConjugationCard (e.g. 'plain', 'te', 'potential')
  bgColor,         // form accent color string
}
// UI derives: bgComponent (register==='plain' → PlainBg), registerLabel (VARIANTS[register]?.label)
```

## Error hint system (input mode)

`src/errorHints.js` exports `getErrorHint(card, entry)`. Called in `DrillPage.jsx` on wrong answers in input mode; the result replaces the generic "Incorrect" message when exactly one error category fires. If two or more fire simultaneously, it returns `null` (generic).

Detection categories: word-type confusion (ichidan/godan swap, な/い adjective swap, する/くる irregulars), wrong register, wrong tense, wrong polarity, adjective pattern mistakes (でした vs かった), and a て-form catch-all.

**To remove the feature entirely:** delete `src/errorHints.js`; in `DrillPage.jsx` remove the `import { getErrorHint }` line, the `errorHint` const, and restore the original `errorMessage` line: `const errorMessage = inputMode === 'input' && inputIncorrect ? t('card.incorrect') : null`.

## Mobile keyboard handling (input mode)

The scroll container uses a CSS custom property `--vp-height` (set directly on `document.documentElement` via a `visualViewport.resize` listener) rather than React state, so the container resizes when the keyboard opens without triggering a React re-render — avoiding a layout flash. The container height is `calc(var(--vp-height, 100dvh) - headerHeight)`.

`keyboardOpen` is derived from `visualViewport.height < baseH - 100` (baseH captured at mount). A 100px threshold avoids false positives from browser chrome changes.

`hideHeader` (`isMobile && inputMode === 'input' && keyboardOpen`) hides the header with `visibility: hidden` (not `display: none`) so `ResizeObserver` keeps reporting the correct `headerHeight` for when it reappears.

In `InputModeControls`, the input is never `disabled` — setting `disabled` closes the iOS keyboard. `readOnly={isFlipped || transitioning}` blocks text entry in both states without dismissing the keyboard. When `isFlipped`, `onPointerDown` short-circuits with `e.preventDefault()` to suppress iOS text-selection handles on the inactive-looking field. Programmatic `focus()` uses `{ preventScroll: true }` since the keyboard is already open. A `visualViewport.resize` listener inside `InputModeControls` calls `scrollIntoView({ block: 'end', behavior: 'smooth' })` when the keyboard opens with the input focused, overriding iOS's default scroll (which anchors the input near the top of the visible area rather than the bottom).

## Known quirks

- **Sidebar tab scroll** — the outer panel wrapper uses `overflow: hidden` for the slide-in width animation. This makes the browser's Tab-triggered scroll-into-view target the wrong container, so focused elements above the current scroll position have no visible focus ring. Fix: `handleSidebarFocus` on each `.sidebar-scroll` div directly scrolls the container whenever a descendant receives focus. Do not remove `overflow: hidden` from the outer wrapper — it's needed for the animation.

## Card appearance notes

- **`backColor`** — optional field in `FORMS` / `variants`. Overrides the back-face background color (e.g. plain/polite use `#4C4C4C`; all others fall back to `keyColor`). When set, `PlainBg` on the back also receives `backColor` as its `color` prop so the ruled lines are derived from the dark bg rather than the form accent color.
- **Stamps** — rendered as plain text labels (`DotGothic16`, uppercase, same color as the word text). Past label sits bottom-left, Negative bottom-right.
- **`PlainBg` contrast** — front lines use `lightenHex(hex, 0.60/0.68)`, back lines use `lightenHex(hex, 0.20/0.25)` (lower = closer to the vivid key color, less contrast).

import { FORMS } from './forms.js'

export const WORD_TYPES = [
  { key: 'u-verb',    line1: 'う',  line2Key: 'wordTypes.verbs' },
  { key: 'ru-verb',   line1: 'る',  line2Key: 'wordTypes.verbs' },
  { key: 'irregular', line1Key: 'wordTypes.group3_short', line2Key: 'wordTypes.verbs' },
  { key: 'i-adj',     line1: 'い',  line2Key: 'wordTypes.adj_short' },
  { key: 'na-adj',    line1: 'な',  line2Key: 'wordTypes.adj_short' },
  { key: 'noun',      line1Key: 'wordTypes.noun' },
]

export const REGISTERS = [
  { key: 'plain',  subtext: '〜う・る' },
  { key: 'polite', subtext: '〜ます' },
]

const REGISTER_KEYS = REGISTERS.map(r => r.key)

const FORM_SUBTEXTS = {
  te:               '〜て',
  potential:        '〜られる',
  volitional:       '〜よう',
  conditional:      '〜えば',
  adverbial:        '〜く·に',
  passive:          '〜られる',
  causative:        '〜させる',
  passive_causative: '〜させられる',
  imperative:       '〜え',
}

export const GRAMMAR_FORMS = Object.entries(FORMS)
  .filter(([key]) => !REGISTER_KEYS.includes(key))
  .map(([key, form]) => ({
    key,
    labelKey:       form.labelKey,
    keyColor:       form.color,
    subtext:        FORM_SUBTEXTS[key] ?? null,
    validWordTypes: form.validWordTypes,
  }))

export const TENSES = [
  { key: 'present', labelKey: 'tense.present', subtext: '今' },
  { key: 'past',    labelKey: 'tense.past',    subtext: '先' },
]

export const POLARITIES = [
  { key: 'positive', labelKey: 'polarity.positive', subtext: '+' },
  { key: 'negative', labelKey: 'polarity.negative', subtext: '–' },
]

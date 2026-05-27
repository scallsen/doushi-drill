import { lightenHex } from '../utils/color.js'

function def(labelKey, hex, axes, validWordTypes, icon = null) {
  return { labelKey, color: `#${hex}`, bgColor: lightenHex(hex), icon, axes, validWordTypes }
}

// Single source of truth for all form and register definitions.
// axes: which drill dimensions apply to this form ('register', 'tense', 'polarity')
// validWordTypes: which word types this form is valid for
export const FORMS = {
  // ── Registers ─────────────────────────────────────────────────────
  plain:             def('register.plain',          'D0D0D0', ['tense', 'polarity'],            ['verb', 'adjective']),
  polite:            def('register.polite',         'D0D0D0', ['tense', 'polarity'],            ['verb']),

  // ── Verb / word forms ──────────────────────────────────────────────
  default:           def('forms.default',           '888888', ['register', 'tense', 'polarity'], ['verb', 'adjective', 'noun']),
  te:                def('forms.te',                '3A7FEF', ['polarity'],                      ['verb', 'adjective', 'noun']),
  potential:         def('forms.potential',         'E8962E', ['register', 'tense', 'polarity'], ['verb']),
  volitional:        def('forms.volitional',        '3CC25E', ['register'],                      ['verb']),
  conditional:       def('forms.conditional',       '8A55E0', ['polarity'],                      ['verb', 'adjective']),
  adverbial:         def('forms.adverb',            '2D7A4F', [],                                ['adjective']),
  passive:           def('forms.passive',           '25B4C4', ['register', 'tense', 'polarity'], ['verb']),
  causative:         def('forms.causative',         'D83C3C', ['register', 'tense', 'polarity'], ['verb']),
  passive_causative: def('forms.causative_passive', 'CC4888', ['register', 'tense', 'polarity'], ['verb']),
  imperative:        def('forms.imperative',        'E02040', ['polarity'],                      ['verb']),
}

/**
 * English locale — source of truth
 *
 * When adding new strings to the app, add them here first,
 * then mirror the key (with a translation) in every other locale file.
 *
 * Key conventions:
 *   forms.*       — conjugation form names shown on cards and selectors
 *   axes.*        — axis group labels (the headings above register/tense/polarity)
 *   register.*    — register option labels
 *   tense.*       — tense option labels
 *   polarity.*    — polarity option labels
 *   ui.*          — general interface copy
 *   wordTypes.*   — word type labels (verb, adjective, noun)
 *   card.*        — text that appears on or near drill cards
 *   settings.*    — settings drawer copy
 *   errors.*      — error states
 */

const en = {
  meta: {
    // Used to label the locale selector
    localeName: 'English',
    localeCode: 'en',
    // Direction: 'ltr' | 'rtl'
    dir: 'ltr',
  },

  // ── Conjugation form names ────────────────────────────────────────────────
  // These appear on form selector chips, card badges, and answer labels.
  forms: {
    default:          'Basic forms',
    te:               'Te-form',
    potential:        'Potential',
    passive:          'Passive',
    causative:        'Causative',
    causative_passive:'Causative-passive',
    volitional:       'Volitional',
    conditional:      'Conditional',
    imperative:       'Imperative',
    tai:              'Tai-form',        // ~たい "want to"
    nagara:           'Nagara-form',     // ~ながら "while doing"
    // Adjective-specific forms
    adverb:           'Adverb form',     // く-form for i-adj
    stem:             'Stem form',       // な-adj stem
  },

  // ── Modifier axis labels ──────────────────────────────────────────────────
  // Headings shown above groups of toggles/selectors.
  axes: {
    register: 'Register',
    tense:    'Tense',
    polarity: 'Polarity',
    form:     'Form',
  },

  // ── Axis values ───────────────────────────────────────────────────────────
  register: {
    plain:  'Plain',
    polite: 'Polite',
  },

  tense: {
    present: 'Non-past',   // "Non-past" is the linguistically accurate English term
    past:    'Past',
    // Used where space is tight (card badges, chips):
    present_short: 'Npst',
    past_short:    'Past',
  },

  polarity: {
    positive: 'Positive',
    negative: 'Negative',
    // Short variants
    positive_short: '+',
    negative_short: '−',
  },

  // ── Word / part-of-speech types ───────────────────────────────────────────
  wordTypes: {
    verb:      'Verb',
    i_adj:     'い-adjective',
    na_adj:    'な-adjective',
    noun:      'Nouns',
    // Verb groups
    group1:    'Group 1 (う-verbs)',
    group2:    'Group 2 (る-verbs)',
    group3:    'Irregular',
    // Short labels for compact UI
    group1_short: 'G1',
    group2_short: 'G2',
    group3_short: 'Irregular',
    // Word-type button line labels
    verbs:        'Verbs',
    adj_short:    'Adjectives',
  },

  // ── Card-face copy ────────────────────────────────────────────────────────
  card: {
    tap_to_reveal:   'Tap to reveal',
    tap_to_flip:     'Tap card to flip',
    click_to_flip:   'Click card or press spacebar to flip',
    flip:            '↵ Flip card',
    plain_only:      'Plain only',    // Badge on forms that have no polite variant
    correct:         'Correct',
    incorrect:       'Incorrect',
    skip:            'Skip',
    conjugate_hint:  'Conjugate the verb below,\nthen flip to check.',
    mark_hint:       'Did you get it right?\nMark your answer.',
    input_hint:      'Conjugate the word below,\nthen type your answer.',
    input_placeholder: 'Type your answer',
    submit_answer:     'Submit answer (Enter)',
    next_card:         'Next card (Space/Enter)',
    focus_input:       '↵ Type answer',
    next_card_hint:    '↵ Next card',
  },

  // ── General UI ────────────────────────────────────────────────────────────
  ui: {
    app_name:       'Doushi Drill',
    start_drill:    'Start Drill',
    end_drill:      'End Drill',
    restart:        'Restart',
    settings:       'Settings',
    back:           'Back',
    select_all:     'Select all',
    deselect_all:   'Deselect all',
    all:            'All',
    words_selected: '{{count}} word selected',
    words_selected_plural: '{{count}} words selected',
    no_words_selected: 'No words selected',
    forms_selected: '{{count}} form selected',
    forms_selected_plural: '{{count}} forms selected',
    language:       'Language',
    undo:           'Undo',
    hide_options:   'Hide options',
    show_options:   'Show options',
    report_issue:   'Report issue',
    streak:         'Streak: {{count}}',
    streak_lost:    'Streak lost',
    best_streak:    'Best streak: {{count}}',
    best_streak_label: 'BEST STREAK',
    vocabulary_from: 'Use vocabulary from',
    explore_hint:    'Tap to explore conjugations ↑',
    mode_speed:      'Flip card',
    mode_input:      'Type answer',
  },

  // ── Settings drawer ───────────────────────────────────────────────────────
  // ── Difficulty levels ─────────────────────────────────────────────────────
  difficulty: {
    beginner:       'Beginner',        // N5
    upper_beginner: 'Upper beginner',  // N4
    common:         'Common',          // JMdict common, unlevelled
  },

  settings: {
    heading:              'Options',
    words_section:        'Words',
    forms_section:        'Forms',
    modifiers_section:    'Modifiers',
    display_section:      'Display',
    additional_section:   'Additional Settings',
    tts_label:            'Read answer aloud',
    tts_description:      'Speaks the conjugated form when the card flips',
    tts_short:            'Text to speech',
    show_romaji:          'Show rōmaji',
    show_english:         'Show English meaning',
    filter_word_type:     'Word type',
    filter_difficulty:    'Difficulty',
    show_streak:          'Show streak',
    show_furigana:        'Show furigana',
    show_visual_effects:  'Show visual effects',
    pixel_font:           'Use pixel font',
    show_translation:     'Show translation',
    translation_when:     'When to show translation',
    translation_answer_only: 'Answer only',
    translation_both_sides:  'Both sides',
    enable_audio:         'Enable audio',
    sfx_label:            'Sound effects',
    sfx_description:      'Silent mode may mute sound effects',
    voice:                'Voice',
    voice_default:        'Default',
    voice_description:    'Availability based on your device or browser',
  },

  // ── Session summary ───────────────────────────────────────────────────────
  summary: {
    heading:        'Session complete',
    correct:        'Correct',
    incorrect:      'Incorrect',
    accuracy:       'Accuracy',
    total_cards:    'Cards drilled',
    play_again:     'Drill again',
    change_options: 'Change options',
  },

  // ── Error states ──────────────────────────────────────────────────────────
  errors: {
    no_valid_cards:      'No cards match your current selection. Try adding more forms or words.',
    no_selection:        'No cards match current settings',
    select_at_least_one: 'Select at least 1 option',
    load_failed:         'Failed to load word data.',
    tts_unsupported:     'Your browser doesn\'t support text-to-speech.',
  },
};

export default en;

/**
 * Japanese locale (日本語)
 *
 * Grammar terminology sourced from:
 *  - Japanese school grammar (学校文法 gakkō bunpō)
 *  - Genki I & II (The Japan Times) — standard JFL textbook series
 *  - Minna no Nihongo — widely-used classroom series
 *  - 日本語文法の基礎 (Basics of Japanese Grammar)
 *
 * REVIEWER NOTE: If you are a native Japanese speaker reviewing this file,
 * please pay special attention to the `forms.*` and `axes.*` keys, as these
 * use technical grammar terms. The 〜形 (〜kei, "〜form") naming convention
 * follows standard school grammar and should be familiar to any learner who
 * has used Genki or a similar textbook.
 *
 * "Plain only" notice (card.plain_only): indicates forms that have no polite
 * equivalent, e.g. て形, 命令形. Uses a softer phrasing (普通形のみ) rather than
 * the more abrupt 丁寧なし to better match the learner-facing register of the UI.
 */

const ja = {
  meta: {
    localeName: '日本語',
    localeCode: 'ja',
    dir: 'ltr',
  },

  // ── 活用形の名前 ─────────────────────────────────────────────────────────
  // Source: Genki appendix + school grammar 〜形 convention
  forms: {
    default:           '基本形',          // きほんけい
    te:                'て形',            // てけい
    potential:         '可能形',          // かのうけい
    passive:           '受身形',          // うけみけい (also 受動形 judōkei; うけみけい is more common in JFL)
    causative:         '使役形',          // しえきけい
    causative_passive: '使役受身形',       // しえきうけみけい
    volitional:        '意向形',          // いこうけい (Genki uses this; also called 意志形 ishikei)
    conditional:       '仮定形',          // かていけい (covers たら/ば conditional)
    imperative:        '命令形',          // めいれいけい
    tai:               'たい形',          // "want to ~" form
    nagara:            'ながら形',         // "while doing ~"
    // Adjective-specific
    adverb:            'く形',            // i-adj → adverb (早い→早く)
    stem:              '語幹',            // ごかん — na-adj stem
  },

  // ── 軸のラベル ────────────────────────────────────────────────────────────
  axes: {
    register: '文体',     // ぶんたい — register/style
    tense:    '時制',     // じせい — tense
    polarity: '極性',     // きょくせい — polarity (affirmative vs negative)
    form:     '形',       // けい — form
  },

  // ── 文体 ──────────────────────────────────────────────────────────────────
  // 普通体 (futsūtai) and 丁寧体 (teineItai) are the standard school grammar terms.
  // Genki uses 普通体 / 丁寧体 consistently.
  register: {
    plain:  '普通体',    // ふつうたい (also 常体 jōtai — 普通体 preferred in JFL context)
    polite: '丁寧体',    // ていねいたい
  },

  // ── 時制 ──────────────────────────────────────────────────────────────────
  // Japanese grammar distinguishes 非過去 (non-past) rather than "present",
  // since the ~る/~ます form covers both present and future.
  tense: {
    present:       '非過去',    // ひかこ — non-past (linguistically accurate)
    past:          '過去',      // かこ
    present_short: '非過去',
    past_short:    '過去',
  },

  // ── 極性 ──────────────────────────────────────────────────────────────────
  polarity: {
    positive:       '肯定',     // こうてい — affirmative
    negative:       '否定',     // ひてい — negative
    positive_short: '肯',
    negative_short: '否',
  },

  // ── 品詞 (word types) ─────────────────────────────────────────────────────
  wordTypes: {
    verb:         '動詞',           // どうし
    i_adj:        'い形容詞',        // いけいようし
    na_adj:       'な形容詞',        // なけいようし
    noun:         '名詞',            // めいし
    group1:       '五段動詞',        // ごだんどうし (う-verbs)
    group2:       '一段動詞',        // いちだんどうし (る-verbs)
    group3:       '不規則動詞',      // ふきそくどうし
    group1_short: '五段',
    group2_short: '一段',
    group3_short: '不規',
    verbs:        '動詞',
    adj_short:    '形容詞',
  },

  // ── JLPT ──────────────────────────────────────────────────────────────────
  jlpt: {
    n5:         'N5',
    n4:         'N4',
    n3:         'N3',
    n2:         'N2',
    n1:         'N1',
    unlisted:   '未分類',         // みぶんるい — unclassified
    all_levels: 'すべてのレベル',
  },

  // ── カード上のテキスト ─────────────────────────────────────────────────────
  card: {
    tap_to_reveal:  'タップして答えを見る',
    tap_to_flip:    'タップしてカードをめくる',
    click_to_flip:  'クリックまたはスペースキーでめくる',
    flip:           '↵ カードをめくる',
    plain_only:     '普通形のみ',     // "Plain form only" — shown on te-form, imperative etc.
    correct:        '正解',          // せいかい
    incorrect:      '不正解',        // ふせいかい
    skip:           'スキップ',
    conjugate_hint: '以下の動詞を活用させ、\nカードをめくって確認しよう',
    mark_hint:      '正解でしたか？\n答えをマークしてください',
    input_hint:     '以下の言葉を活用させ、\n答えをタイプしてください',
    input_placeholder_prefix: '',
    input_placeholder_suffix: 'の形をタイプしてください',
    next_card:      '次のカード (Space/Enter)',
  },

  // ── 一般UI ────────────────────────────────────────────────────────────────
  ui: {
    app_name:              '動詞ドリル',
    start_drill:           'ドリルを始める',
    end_drill:             'ドリルを終わる',
    restart:               'やり直す',
    settings:              '設定',
    back:                  '戻る',
    select_all:            'すべて選択',
    deselect_all:          'すべて解除',
    all:                   'すべて',
    words_selected:        '{{count}}語選択中',
    words_selected_plural: '{{count}}語選択中',   // Japanese doesn't pluralize
    no_words_selected:     '語彙が選択されていません',
    forms_selected:        '{{count}}形選択中',
    forms_selected_plural: '{{count}}形選択中',
    language:              '言語',
    undo:                  '元に戻す',
    hide_options:          'オプションを隠す',
    show_options:          'オプションを表示',
    report_issue:          '問題を報告',
    streak:                'ストリーク: {{count}}',
    streak_lost:           'ストリーク消失',
    best_streak:           'ベスト: {{count}}',
    best_streak_label:     'ベストストリーク',
    vocabulary_from:       '使用語彙:',
    explore_hint:          '活用を見るにはタップ ↑',
    mode_speed:            'スピード',
    mode_input:            '入力',
  },

  // ── 設定ドロワー ──────────────────────────────────────────────────────────
  settings: {
    heading:           'オプション',
    words_section:     '語彙',
    forms_section:     '活用形',
    modifiers_section: '修飾子',
    display_section:   '表示',
    additional_section: 'その他の設定',
    tts_label:         '答えを読み上げる',
    tts_description:   'カードをめくったときに活用形を読み上げます',
    tts_short:         '音声読み上げ',
    show_romaji:       'ローマ字を表示',
    show_english:      '英語の意味を表示',
    filter_jlpt:       'JLPTレベル',
    filter_word_type:  '品詞',
    show_streak:          'ストリークを表示',
    show_furigana:        'ふりがなを表示',
    show_visual_effects:  '視覚効果を表示',
    pixel_font:           'ピクセルフォントを使用',
    show_translation:     '翻訳を表示',
    translation_when:     '翻訳タイミング',
    translation_answer_only: '回答のみ',
    translation_both_sides:  '両面',
    enable_audio:         '音声を有効にする',
    sfx_label:            '効果音',
    sfx_description:      'サイレントモードで効果音がミュートされる場合があります',
    voice:                '音声',
    voice_default:        'デフォルト',
    voice_description:    'ご利用のデバイスまたはブラウザにより異なります',
  },

  // ── セッションのまとめ ─────────────────────────────────────────────────────
  summary: {
    heading:        'セッション終了',
    correct:        '正解',
    incorrect:      '不正解',
    accuracy:       '正答率',
    total_cards:    '問題数',
    play_again:     'もう一度',
    change_options: 'オプションを変える',
  },

  // ── エラー状態 ────────────────────────────────────────────────────────────
  errors: {
    no_valid_cards:      '現在の設定に合うカードがありません。形や語彙を追加してください。',
    no_selection:        '現在の設定に合うカードがありません',
    select_at_least_one: '1つ以上選択してください',
    load_failed:         '語彙データの読み込みに失敗しました。',
    tts_unsupported:     'お使いのブラウザは音声読み上げに対応していません。',
  },
};

export default ja;

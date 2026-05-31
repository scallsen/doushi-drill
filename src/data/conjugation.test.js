import { describe, it, expect } from 'vitest'
import { conjugate } from './conjugation.js'

const kaku        = { kanji: '書く',       kana: 'かく',           wordType: 'verb', group: 1 }
const taberu      = { kanji: '食べる',     kana: 'たべる',         wordType: 'verb', group: 2 }
const benkyousuru = { kanji: '勉強する',   kana: 'べんきょうする', wordType: 'verb', group: 3 }
const kuru        = { kanji: '来る',       kana: 'くる',           wordType: 'verb', group: 3 }

describe('godan (u-verb) — 書く', () => {
  it('present',    () => expect(conjugate(kaku, 'default',    'plain', 'present', 'positive')).toEqual(['書く',     'かく']))
  it('past',       () => expect(conjugate(kaku, 'default',    'plain', 'past',    'positive')).toEqual(['書いた',   'かいた']))
  it('te-form',    () => expect(conjugate(kaku, 'te',         'plain', 'present', 'positive')).toEqual(['書いて',   'かいて']))
  it('volitional', () => expect(conjugate(kaku, 'volitional', 'plain', 'present', 'positive')).toEqual(['書こう',   'かこう']))
  it('passive',    () => expect(conjugate(kaku, 'passive',    'plain', 'present', 'positive')).toEqual(['書かれる', 'かかれる']))
  it('causative',  () => expect(conjugate(kaku, 'causative',  'plain', 'present', 'positive')).toEqual(['書かせる', 'かかせる']))
  it('potential',  () => expect(conjugate(kaku, 'potential',  'plain', 'present', 'positive')).toEqual(['書ける',   'かける']))
  it('imperative', () => expect(conjugate(kaku, 'imperative', 'plain', 'present', 'positive')).toEqual(['書け',     'かけ']))
})

describe('ichidan (ru-verb) — 食べる', () => {
  it('present',    () => expect(conjugate(taberu, 'default',    'plain', 'present', 'positive')).toEqual(['食べる',       'たべる']))
  it('past',       () => expect(conjugate(taberu, 'default',    'plain', 'past',    'positive')).toEqual(['食べた',       'たべた']))
  it('te-form',    () => expect(conjugate(taberu, 'te',         'plain', 'present', 'positive')).toEqual(['食べて',       'たべて']))
  it('volitional', () => expect(conjugate(taberu, 'volitional', 'plain', 'present', 'positive')).toEqual(['食べよう',     'たべよう']))
  it('passive',    () => expect(conjugate(taberu, 'passive',    'plain', 'present', 'positive')).toEqual(['食べられる',   'たべられる']))
  it('causative',  () => expect(conjugate(taberu, 'causative',  'plain', 'present', 'positive')).toEqual(['食べさせる',   'たべさせる']))
  it('potential',  () => expect(conjugate(taberu, 'potential',  'plain', 'present', 'positive')).toEqual(['食べられる',   'たべられる', '食べれる', 'たべれる']))
  it('imperative', () => expect(conjugate(taberu, 'imperative', 'plain', 'present', 'positive')).toEqual(['食べろ',       'たべろ']))
})

describe('irregular する — 勉強する', () => {
  it('present',    () => expect(conjugate(benkyousuru, 'default',    'plain', 'present', 'positive')).toEqual(['勉強する',     'べんきょうする']))
  it('past',       () => expect(conjugate(benkyousuru, 'default',    'plain', 'past',    'positive')).toEqual(['勉強した',     'べんきょうした']))
  it('te-form',    () => expect(conjugate(benkyousuru, 'te',         'plain', 'present', 'positive')).toEqual(['勉強して',     'べんきょうして']))
  it('volitional', () => expect(conjugate(benkyousuru, 'volitional', 'plain', 'present', 'positive')).toEqual(['勉強しよう',   'べんきょうしよう']))
  it('passive',    () => expect(conjugate(benkyousuru, 'passive',    'plain', 'present', 'positive')).toEqual(['勉強される',   'べんきょうされる']))
  it('causative',  () => expect(conjugate(benkyousuru, 'causative',  'plain', 'present', 'positive')).toEqual(['勉強させる',   'べんきょうさせる']))
  it('potential',  () => expect(conjugate(benkyousuru, 'potential',  'plain', 'present', 'positive')).toEqual(['勉強できる',   'べんきょうできる']))
  it('imperative', () => expect(conjugate(benkyousuru, 'imperative', 'plain', 'present', 'positive')).toEqual(['勉強しろ',     'べんきょうしろ']))
})

describe('irregular くる — 来る', () => {
  it('present',    () => expect(conjugate(kuru, 'default',    'plain', 'present', 'positive')).toEqual(['来る',       'くる']))
  it('past',       () => expect(conjugate(kuru, 'default',    'plain', 'past',    'positive')).toEqual(['来た',       'きた']))
  it('te-form',    () => expect(conjugate(kuru, 'te',         'plain', 'present', 'positive')).toEqual(['来て',       'きて']))
  it('volitional', () => expect(conjugate(kuru, 'volitional', 'plain', 'present', 'positive')).toEqual(['来よう',     'こよう']))
  it('passive',    () => expect(conjugate(kuru, 'passive',    'plain', 'present', 'positive')).toEqual(['来られる',   'こられる']))
  it('causative',  () => expect(conjugate(kuru, 'causative',  'plain', 'present', 'positive')).toEqual(['来させる',   'こさせる']))
  it('potential',  () => expect(conjugate(kuru, 'potential',  'plain', 'present', 'positive')).toEqual(['来られる',   'こられる', '来れる', 'これる']))
  it('imperative', () => expect(conjugate(kuru, 'imperative', 'plain', 'present', 'positive')).toEqual(['来い',       'こい']))
})

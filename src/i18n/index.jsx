/**
 * i18n — lightweight locale system
 *
 * No dependencies. Drop-in React context + hook.
 *
 * Usage:
 *   1. Wrap your app in <LocaleProvider> (in main.jsx or App.jsx)
 *   2. In any component: const { t, locale, setLocale } = useTranslation();
 *   3. Use strings:  t('forms.potential')  →  "Potential" | "可能形"
 *   4. Interpolate:  t('ui.words_selected', { count: 5 })  →  "5 words selected"
 */

import { createContext, useContext, useState, useCallback } from 'react';
import en from './locales/en.js';
import ja from './locales/ja.js';
import { safeLocalStorageGet, safeLocalStorageSet } from '../utils/storage.js';

// ── Registry ────────────────────────────────────────────────────────────────
// Add new locales here. The key becomes the locale code stored in localStorage.
const LOCALES = {
  en,
  ja,
};

const DEFAULT_LOCALE = 'en';
const STORAGE_KEY = 'doushi-drill-locale';

// ── Context ──────────────────────────────────────────────────────────────────
const LocaleContext = createContext(null);

// ── Provider ─────────────────────────────────────────────────────────────────
export function LocaleProvider({ children }) {
  const [localeCode, setLocaleCode] = useState(() => {
    const saved = safeLocalStorageGet(STORAGE_KEY);
    return saved && LOCALES[saved] ? saved : DEFAULT_LOCALE;
  });

  const setLocale = useCallback((code) => {
    if (!LOCALES[code]) {
      console.warn(`[i18n] Unknown locale "${code}". Falling back to "${DEFAULT_LOCALE}".`);
      return;
    }
    setLocaleCode(code);
    safeLocalStorageSet(STORAGE_KEY, code);
  }, []);

  return (
    <LocaleContext.Provider value={{ localeCode, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useTranslation() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useTranslation must be used inside <LocaleProvider>');

  const { localeCode, setLocale } = ctx;
  const strings = LOCALES[localeCode] ?? LOCALES[DEFAULT_LOCALE];

  /**
   * t(key, vars?)
   *
   * key  — dot-separated path into the locale object, e.g. 'forms.potential'
   * vars — optional object for interpolation, e.g. { count: 3 }
   *
   * Pluralization: if the key ends with a count in vars and a `key_plural`
   * variant exists, it uses that when count !== 1.
   * Japanese doesn't pluralize, so both `words_selected` and
   * `words_selected_plural` can be identical — the logic still works.
   */
  const t = useCallback((key, vars = {}) => {
    // Handle pluralization
    let resolvedKey = key;
    if (vars.count !== undefined && vars.count !== 1) {
      const pluralKey = key + '_plural';
      if (getNestedValue(strings, pluralKey) !== undefined) {
        resolvedKey = pluralKey;
      }
    }

    const raw = getNestedValue(strings, resolvedKey);

    if (raw === undefined) {
      // Fall back to English
      const fallback = getNestedValue(LOCALES[DEFAULT_LOCALE], resolvedKey);
      if (fallback === undefined) {
        console.warn(`[i18n] Missing key: "${resolvedKey}" in both "${localeCode}" and "${DEFAULT_LOCALE}"`);
        return resolvedKey; // Return the key itself as last resort
      }
      return interpolate(fallback, vars);
    }

    return interpolate(raw, vars);
  }, [strings, localeCode]);

  // Expose available locales for a language picker component
  const availableLocales = Object.values(LOCALES).map((l) => ({
    code: l.meta.localeCode,
    name: l.meta.localeName,
    dir:  l.meta.dir,
  }));

  return { t, locale: localeCode, setLocale, availableLocales };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Traverse a nested object by dot-separated key. Returns undefined if missing. */
function getNestedValue(obj, dotKey) {
  return dotKey.split('.').reduce((acc, k) => acc?.[k], obj);
}

/** Replace {{varName}} placeholders in a string with values from `vars`. */
function interpolate(str, vars) {
  if (!vars || Object.keys(vars).length === 0) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, name) => vars[name] ?? `{{${name}}}`);
}

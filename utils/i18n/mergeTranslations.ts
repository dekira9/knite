import * as S from './strings';
import { TRANSLATION_KEYS, type TranslationKey } from './translationKeys';

export type Locale = keyof typeof S.onboardingLanguage;
type LocaleStrings = Record<TranslationKey, string>;

export function buildMergedTranslations(): Record<Locale, LocaleStrings> {
  const locales = Object.keys(S.onboardingLanguage) as Locale[];

  return Object.fromEntries(
    locales.map((locale) => [
      locale,
      Object.fromEntries(
        TRANSLATION_KEYS.map((key) => [key, S[key][locale]])
      ) as LocaleStrings,
    ])
  ) as Record<Locale, LocaleStrings>;
}

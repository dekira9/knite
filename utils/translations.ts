import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import { reaction } from 'mobx';
import onboardingState from '@/state/onboardingState';
import { buildMergedTranslations } from './i18n/mergeTranslations';
import {
  isSupportedLanguage,
  resolveInitialLanguage,
} from './i18n/supportedLanguages';

const i18n = new I18n(buildMergedTranslations());
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export function updateLocale(locale: string) {
  i18n.locale = isSupportedLanguage(locale) ? locale : 'en';
}

const initialLocale = isSupportedLanguage(onboardingState.language)
  ? onboardingState.language
  : resolveInitialLanguage(Localization.getLocales()[0]?.languageCode);

i18n.locale = initialLocale;

const originalT = i18n.t.bind(i18n);

/**
 * Wrap t() so observer components that call i18n.t() re-render when
 * onboardingState.language changes (i18n.locale alone is not observable).
 */
i18n.t = ((scope: string | string[], options?: object) => {
  const lang = onboardingState.language;
  const next = isSupportedLanguage(lang) ? lang : 'en';
  if (i18n.locale !== next) {
    i18n.locale = next;
  }
  return originalT(scope as never, options as never);
}) as typeof i18n.t;

reaction(
  () => onboardingState.language,
  (lang) => updateLocale(lang),
);

export default i18n;

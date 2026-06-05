import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import onboardingState from '@/state/onboardingState';
import { buildMergedTranslations } from './i18n/mergeTranslations';

const i18n = new I18n(buildMergedTranslations());

export function updateLocale(locale: string) {
  i18n.locale = locale;
}

i18n.locale =
  onboardingState.language || Localization.getLocales()[0]?.languageCode || 'en';

export default i18n;

/** Languages selectable in onboarding / settings (full product set). */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' },
] as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

const SUPPORTED_CODES = new Set<string>(
  SUPPORTED_LANGUAGES.map((lang) => lang.code),
);

export function isSupportedLanguage(code: string): code is SupportedLanguageCode {
  return SUPPORTED_CODES.has(code);
}

export function findLanguage(code: string) {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
}

/** Prefer device language when supported; otherwise English. */
export function resolveInitialLanguage(deviceLanguageCode?: string | null): SupportedLanguageCode {
  if (deviceLanguageCode && isSupportedLanguage(deviceLanguageCode)) {
    return deviceLanguageCode;
  }
  return 'en';
}

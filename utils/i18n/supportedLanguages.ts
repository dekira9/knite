/** Languages selectable in onboarding / settings (full product set). */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
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

import {
  findLanguage,
  isSupportedLanguage,
  resolveInitialLanguage,
  SUPPORTED_LANGUAGES,
} from '../supportedLanguages';

describe('supportedLanguages', () => {
  it('includes the full product locale set', () => {
    expect(SUPPORTED_LANGUAGES.map((l) => l.code)).toEqual([
      'en',
      'ru',
      'sv',
      'no',
      'fi',
      'de',
      'fr',
      'es',
      'ja',
      'cs',
      'bg',
      'sk',
      'ko',
      'tr',
      'ar',
      'pt',
      'lt',
    ]);
  });

  it('validates supported codes', () => {
    expect(isSupportedLanguage('de')).toBe(true);
    expect(isSupportedLanguage('xx')).toBe(false);
  });

  it('resolves device language when supported', () => {
    expect(resolveInitialLanguage('ru')).toBe('ru');
    expect(resolveInitialLanguage('ja')).toBe('ja');
    expect(resolveInitialLanguage('xx')).toBe('en');
    expect(resolveInitialLanguage(null)).toBe('en');
  });

  it('finds language metadata', () => {
    expect(findLanguage('ru')?.nativeName).toBe('Русский');
    expect(findLanguage('xx')).toBeUndefined();
  });
});

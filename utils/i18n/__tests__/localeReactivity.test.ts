import onboardingState from '@/state/onboardingState';
import i18n, { updateLocale } from '@/utils/translations';

describe('i18n locale reactivity', () => {
  afterEach(() => {
    onboardingState.setLanguage('en');
    updateLocale('en');
  });

  it('returns Russian copy after language change', () => {
    onboardingState.setLanguage('ru');
    updateLocale('ru');
    expect(i18n.t('next')).toBe('Далее');
    expect(i18n.t('settings')).toBe('Настройки');
  });

  it('returns English copy for en', () => {
    onboardingState.setLanguage('en');
    updateLocale('en');
    expect(i18n.t('next')).toBe('Next');
  });

  it('syncs locale from onboardingState when calling t()', () => {
    onboardingState.setLanguage('de');
    // Intentionally leave i18n.locale stale; t() should sync.
    i18n.locale = 'en';
    expect(i18n.t('next')).toBe('Nächste');
    expect(i18n.locale).toBe('de');
  });
});

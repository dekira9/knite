import { buildMergedTranslations } from '../mergeTranslations';

describe('buildMergedTranslations', () => {
  const merged = buildMergedTranslations();

  it('includes all locales from onboardingLanguage', () => {
    expect(Object.keys(merged).sort()).toEqual(
      expect.arrayContaining(['en', 'ru', 'de', 'ja'])
    );
  });

  it('maps keys for English', () => {
    expect(merged.en.next).toBe('Next');
    expect(merged.en.calculate).toBe('Calculate');
    expect(merged.en.chooseStyle).toBe('Choose Your Style');
  });

  it('maps keys for Russian', () => {
    expect(merged.ru.next).toBe('Далее');
  });
});

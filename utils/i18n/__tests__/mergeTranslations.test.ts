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
    expect(merged.en.chooseStyle).toBe('Choose neckline type');
  });

  it('maps new onboarding keys for every locale', () => {
    expect(merged.de.chooseMeasurementSystem).toBe('Maßsystem wählen');
    expect(merged.ru.metricUnitsHint).toBe('сантиметры (см)');
    expect(merged.ja.subscribe).toBe('登録する');
  });
});

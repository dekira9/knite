# i18n layout

| File | Purpose |
|------|---------|
| `strings/onboarding.ts` | Onboarding, settings, style picker |
| `strings/input.ts` | Measurement wizard labels |
| `strings/result.ts` | Result steps, increases, instructions |
| `strings/charts.ts` | Raglan chart screens |
| `translationKeys.ts` | Canonical list of `i18n.t()` keys |
| `mergeTranslations.ts` | Builds per-locale object for i18n-js |
| `../translations.ts` | `I18n` instance + `updateLocale()` |

## Add a new string

1. Add `export const myKey = { en: "...", ru: "...", ... }` to the right `strings/*.ts` file.
2. Append `"myKey"` to `TRANSLATION_KEYS` in `translationKeys.ts`.
3. Use `i18n.t('myKey')` in UI.

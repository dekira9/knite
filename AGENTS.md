# Knite (Raglan Planner) — agent guide

Expo React Native app: knit raglan sweater measurements, step-by-step results, and chart screens. **Not** Expo Router — navigation is React Navigation stacks under `navigation/`.

## Quick map

| Area | Path |
|------|------|
| App root | `App.tsx` → Onboarding or Main |
| Navigators | `navigation/*.tsx` |
| Measurements + charts UI | `screens/styles/`, `screens/onboarding/` |
| Global knitting state | `state/introState.ts` (MST + persistence) |
| Locale / units onboarding | `state/onboardingState.ts` |
| i18n | `utils/translations.ts` + `utils/i18n/strings/{onboarding,input,result/,charts}.ts` |
| Remote raglan math | `utils/calculateRaglanCoreRemote.ts` → Supabase `calculate-raglan` |
| Raglan core (shared with edge) | `utils/raglan/` — `calculateRaglan.ts` re-exports; see `docs/RAGLAN_GLOSSARY.md` |
| Local increase-row helpers | `screens/styles/input/result/helpers.ts` |
| Raglan output types | `utils/raglan/types.ts` (`RaglanOutput`) |
| Legacy field meanings | `docs/RAGLAN_GLOSSARY.md` — **grep before reading `introState.ts`** |
| Typed raglan state access | `state/raglanSelectors.ts` — `pickRaglanVariant`, `pickActiveRaglanVariant` |

See `docs/ARCHITECTURE.md` for flow diagram; `docs/TASK_ROUTER.md` for task→file lookup; `docs/HOTSPOTS.md` for line-level edit map; `docs/SYMBOLS.md` for grep index.

## Navigation flow

```
App
├── OnboardingNavigator (language, measurement — Welcome optional)
└── MainNavigator (tabs)
    └── StylesNavigator
        ├── StylesHome
        ├── InputNavigator (measurement wizard)
        ├── ResultNavigator (single Result screen)
        └── RaglanNavigator (ribbing, back, front, sleeve charts)
```

## Style variants: `regular` vs `v-neck`

- Type: `RaglanStyleId` in `constants/samplePresets.ts` — `'regular' | 'v-neck'`.
- Stored on `introState.style`; set from `screens/styles/styles.tsx`.
- **Facade pattern** — thin routers pick implementation:
  - `screens/styles/input/result/result.tsx` → `RegularResult` | `VNeckResult`
  - `screens/styles/raglan/{ribbing,front,back,sleeve}.tsx` → `*O.tsx` (regular) | `*V.tsx` (v-neck)
- Input steps differ: `components/IntroProgress.tsx` lists `INTRO_STEPS_REGULAR` vs `INTRO_STEPS_V_NECK` (extra `DepthNeckV`, `RibbingWidthV`, `LineraglanV`).
- State fields are often duplicated (`Sgor` / `SgorV`, etc.) — use `state/raglanSelectors.ts` or `RAGLAN_VARIANT_FIELDS` instead of memorizing pairs; when changing shared logic, update both variants.

## State rules

- **introState**: all measurement strings, computed numbers, saved projects (`AsyncStorage`). Actions include `setStyle`, `syncRaglanFromSupabase()`, project save/load.
- **onboardingState**: `language`, `measurementSystem`, `hasCompletedOnboarding`, `hasSubscription`.
- Reset helper: `state/reset.ts`.
- Sample values: `constants/samplePresets.ts` (`SAMPLE_MEASUREMENTS`).

## Calculations

- Primary path: Supabase edge function `calculate-raglan` (see `SUPABASE_SETUP.md`). Client: `calculateRaglanRemote()` in `utils/calculateRaglanCoreRemote.ts`.
- UI-only row/increase strings: `screens/styles/input/result/helpers.ts` (many `calculate*` exports; `*V` suffix = v-neck variants).
- Do not assume `utils/calculateRaglan.ts` runs on device unless explicitly wired.

## i18n

- `utils/i18n/strings/` — one `export const keyName` per UI string. **New keys: all locales in `SUPPORTED_LANGUAGES`** (`utils/i18n/supportedLanguages.ts`); at least `en` + `ru`, other locales may temporarily copy `en`. Result domain split: `strings/result/{shared,steps,legend,help}.ts` — see `docs/i18n/RESULT_KEY_INDEX.md`.
- Register new keys in `utils/i18n/translationKeys.ts`. Use `i18n.t('key')` in screens.
- Result-step math split: `screens/styles/input/result/{increaseRowsRegular,vNeckCornerIncreases,increaseRowsVNeck}.ts` (re-exported from `helpers.ts`).

## What to avoid without explicit request

- Editing `ios/`, `android/`, EAS config, or bulk `assets/`.
- Reading entire monolith screens (`frontV.tsx`, `ribbingV.tsx`, `RegularResult.tsx`) — use `docs/HOTSPOTS.md` or shared `screens/styles/raglan/increaseRowSelection.ts`.
- Merging `*O`/`*V` screens or collapsing `introState` fields in one PR (persistence risk).

## Regression checklist

`docs/TEST_PLAN.md` — run after nav/state/calculation changes.

## Commands

```bash
yarn install
yarn start          # expo start
yarn ios / yarn android
yarn test          # unit tests (incl. utils/raglan)
yarn test:raglan   # golden compare + raglan tests
yarn lint
```

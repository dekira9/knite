# Knite (Raglan Calculator) — agent guide

Expo React Native app: knit raglan sweater measurements, step-by-step results, and chart screens. **Not** Expo Router — navigation is React Navigation stacks under `navigation/`.

## Quick map

| Area | Path |
|------|------|
| App root | `App.tsx` → Onboarding or Main |
| Navigators | `navigation/*.tsx` |
| Measurements + charts UI | `screens/styles/`, `screens/onboarding/` |
| Global knitting state | `state/introState.ts` (MST + persistence) |
| Locale / units onboarding | `state/onboardingState.ts` |
| i18n | `utils/translations.ts` (large — grep keys, don’t read whole file) |
| Remote raglan math | `utils/calculateRaglanCoreRemote.ts` → Supabase `calculate-raglan` |
| Local increase-row helpers | `screens/styles/input/result/helpers.ts` |
| Legacy local calc types | `utils/calculateRaglan.ts` (`RaglanOutput` type) |

See `docs/ARCHITECTURE.md` for flow diagram and file-size hotspots.

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
- State fields are often duplicated (`Sgor` / `SgorV`, etc.) — when changing one variant, check the paired field in `introState.ts`.

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

- `utils/translations.ts` — one object per key, all locales inline. Add the same key to every language block. Use `i18n.t('key')` in screens.

## What to avoid without explicit request

- Editing `ios/`, `android/`, EAS config, or bulk `assets/`.
- Reading entire `translations.ts` or monolith screens (`frontV.tsx`, `ribbingV.tsx`, `RegularResult.tsx`) — open the smallest file that owns the change.
- Merging `*O`/`*V` screens or collapsing `introState` fields in one PR (persistence risk).

## Regression checklist

`docs/TEST_PLAN.md` — run after nav/state/calculation changes.

## Commands

```bash
yarn install
yarn start          # expo start
yarn ios / yarn android
yarn test
yarn lint
```

# Task router (agent quick lookup)

Grep the symbol or key first. Open **only** the files listed for your task.

## Calculations & types

| Task | Files |
|------|-------|
| Full raglan output formula | `utils/raglan/calculateRaglanCore.ts` → submodules in `utils/raglan/` |
| Input/output types | `utils/raglan/types.ts` |
| Field meaning (Sgor, Sfx, …) | `docs/RAGLAN_GLOSSARY.md` |
| Typed introState raglan fields | `state/raglanSelectors.ts` — `pickRaglanVariant`, `RAGLAN_VARIANT_FIELDS` |
| Persistence rename (future) | `state/introStateMigration.ts` |
| Remote sync to device | `utils/calculateRaglanCoreRemote.ts`, `state/introState.ts` → `syncRaglanFromSupabase` |
| Golden regression | `utils/raglan/__tests__/goldenSample.json`, `yarn test:raglan` |

## Raglan increase rows (result steps)

| Symbol | File |
|--------|------|
| `calculateIncreaseRows1x2_1x4` … `1x4_1x3` | `screens/styles/input/result/increaseRowsRegular.ts` |
| `calculateIncreaseRows*V` | `screens/styles/input/result/increaseRowsVNeck.ts` |
| `calculateVNeckIncreases01` … `22` | `screens/styles/input/result/vNeckCornerIncreases.ts` |
| Barrel re-exports | `screens/styles/input/result/helpers.ts` |

## Raglan chart screens (back / front / sleeve)

| Task | Files |
|------|-------|
| Increase type switch, row strings, side cell count | `screens/styles/raglan/increaseRowSelection.ts` |
| Left/right/body grid JSX (regular) | `screens/styles/raglan/increaseArrayRenderers.tsx` |
| V-neck front shaping grid | `screens/styles/raglan/vNeckFrontGrid.tsx` |
| Chart row highlight / type picker state | `screens/styles/raglan/useRaglanChartState.ts` |
| Routing regular vs v-neck | Facades: `screens/styles/raglan/{ribbing,back,front,sleeve}.tsx` |
| Layout-only per piece | `*O.tsx` (regular) or `*V.tsx` (v-neck) |

## V-neck collar chart (ribbing)

| Task | Files |
|------|-------|
| Cell counts per row, increase dispatch | `screens/styles/raglan/ribbingVCollarGrid.ts` |
| Layout, transforms, JSX | `screens/styles/raglan/ribbingV.tsx` |

## Result wizard

| Task | Files |
|------|-------|
| Style routing | `screens/styles/input/result/result.tsx` |
| Regular orchestrator | `screens/styles/input/result/RegularResult.tsx` (~160 lines) |
| Carousel + scroll handlers | `RegularResultCarousel.tsx`, `useRegularResultScroll.ts` |
| Final summary card | `RegularResultSummary.tsx` |
| Regular increase precompute | `useRegularIncreasePrecompute.ts` (`computeRegularIncreasePrecompute`) |
| V-neck orchestrator | `screens/styles/input/result/VNeckResult.tsx` |
| Step UI (regular) | `Step1Ribbing.tsx` … `Step4SeparatingSleeves.tsx` |
| Step UI (v-neck) | `Step*V.tsx`, `ResultStepV.tsx`, `FrontV.tsx` |

## State & persistence

| Task | Files |
|------|-------|
| Measurement strings, computed fields | `state/introState.ts` — grep `types.model({` |
| Persisted AsyncStorage keys | `state/introStatePersistedKeys.ts` |
| Paired regular/V fields | `.cursor/rules/state.mdc`, `docs/RAGLAN_GLOSSARY.md` |
| Set from Supabase | `setRaglanData` (Object.assign) |
| AsyncStorage save/load | `persistState`, `setPersistedState` |
| Chart option-picker styling | `screens/styles/raglan/raglanChartChromeStyles.ts` |
| Onboarding locale/units | `state/onboardingState.ts` |
| Global reset | `state/reset.ts` |

## i18n

| Screen area | `utils/i18n/strings/` file |
|-------------|---------------------------|
| Onboarding, settings | `onboarding.ts` |
| Measurement wizard | `input.ts` |
| Result steps | `result.ts` |
| Raglan charts | `charts.ts` |

Workflow: grep key in `translationKeys.ts` → edit one `export const` in the domain file.

## Navigation

| Task | File |
|------|------|
| New input step | `navigation/InputNavigator.tsx` + `components/IntroProgress.tsx` |
| New chart screen | `navigation/RaglanNavigator.tsx` + facade in `screens/styles/raglan/` |

## Do not open unless asked

- `ios/`, `android/`, bulk `assets/`
- Full `introState.ts` when only changing one action — grep the action name
- Entire `utils/i18n/strings/*.ts` when grep shows the exact `export const`

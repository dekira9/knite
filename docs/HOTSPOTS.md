# File hotspots (surgical edits for agents)

Open **only** the section that matches your task. Grep symbols in `docs/SYMBOLS.md` or `docs/TASK_ROUTER.md` before reading whole files.

## Shared chart helpers (`screens/styles/raglan/`)

| File | Lines | Use when |
|------|-------|----------|
| `increaseRowSelection.ts` | ~145 | Raglan increase-row strings, type switch, side cell counts |
| `increaseArrayRenderers.tsx` | ~101 | Left/right increase columns, body grid cells |
| `vNeckFrontGrid.tsx` | ~430 | V-neck front chart shaping (left/right arrays, stitch counts) |
| `useRaglanChartState.ts` | ~40 | Highlighted row + increase-type picker state |
| `ribbingVCollarGrid.ts` | ~95 | V-neck collar increase dispatch + cell counts |
| `raglanChartChromeStyles.ts` | ~100 | Shared option-picker + bottom controls styles |

Chart screens (`*O`, `*V`) import these — fix increase logic **once** here, not in six screens.

## `frontV.tsx` (~590 lines) — v-neck front chart

| Lines | Section |
|-------|---------|
| 35–67 | State hook, `increaseRows` via shared helpers |
| 68–107 | `vNeckData` + stitch counters (delegates to `vNeckFrontGrid.tsx`) |
| 112–320 | JSX layout, increase-type carousel, legend |
| 321+ | `StyleSheet` |

V-neck grid math: `vNeckFrontGrid.tsx`. Raglan line increases: `increaseRowSelection.ts` + `increaseArrayRenderers.tsx`.

## `ribbingV.tsx` (~820 lines) — v-neck collar chart

| Lines | Grep / section |
|-------|----------------|
| 22–50 | State, angle transforms, `collarIncreaseInput` |
| 46–90 | `computeRibbingVCellCounts` usage |
| 116–255 | `renderLine1` … `renderRightSleeve` |
| 257–430 | `renderRows`, `renderRowsRight` (use `selectVNeckCollarIncreases`) |
| 431–500 | Row navigation, main JSX |
| 500+ | `StyleSheet` |

Collar increase dispatch: `ribbingVCollarGrid.ts`.

## `result/FrontV.tsx` (~519 lines) — v-neck front result preview

Uses `mapPrecomputedVStrings` + `getIncreaseRowsFromType` from `increaseRowSelection.ts`. V-neck yellow-cell math stays local.

## `RegularResult.tsx` (~160 lines) — regular result orchestrator

| Area | File |
|------|------|
| Scroll refs + carousel handlers | `useRegularResultScroll.ts` |
| Plan images carousel | `RegularResultCarousel.tsx` |
| Final corpus/sleeve summary | `RegularResultSummary.tsx` |
| Increase precompute (4 schemes) | `useRegularIncreasePrecompute.ts` |
| Step 1–4 UI | `Step1Ribbing.tsx` … `Step4SeparatingSleeves.tsx` |
| Core increase math | `increaseRowsRegular.ts` |

## Result steps (large)

| File | ~lines | Notes |
|------|--------|-------|
| `Step2AddingStitches.tsx` | 546 | Regular step 2 — increase tables |
| `Step2AddingStitchesV.tsx` | 589 | V-neck step 2 |
| `Step1RibbingV.tsx` | 492 | V-neck step 1 |
| `Step3BackLengthening.tsx` / `*V.tsx` | 465 | Back lengthening |
| `VNeckResult.tsx` | 508 | V-neck orchestrator |
| `ResultStepV.tsx` | 492 | Shared v-neck result step shell |

## `introState.ts` (~425 lines)

| Section | Grep |
|---------|------|
| Model fields | `types.model({` |
| Remote → state | `setRaglanData` (Object.assign) |
| `syncRaglanFromSupabase` | `syncRaglanFromSupabase` |
| Persisted field list | `state/introStatePersistedKeys.ts` → `INTRO_STATE_PERSISTED_KEYS` |
| Save/load | `persistState`, `setPersistedState` (use helpers above) |
| `calculateRaglan()` view | `calculateRaglan()` |

**New persisted field:** add to MST model + append key to `INTRO_STATE_PERSISTED_KEYS` only.

Paired regular/V fields: `.cursor/rules/state.mdc`. Do not rename persisted keys without a migration plan.

## i18n strings

| Domain file | ~keys | Screens |
|-------------|-------|---------|
| `utils/i18n/strings/onboarding.ts` | 18 | Onboarding, settings |
| `utils/i18n/strings/input.ts` | 25 | Measurement wizard |
| `utils/i18n/strings/result.ts` | 36 | Result steps |
| `utils/i18n/strings/charts.ts` | 31 | Raglan charts |

Grep the key in `translationKeys.ts`, edit **one** `export const` in the matching domain file.

## Raglan calculation core

| File | Role |
|------|------|
| `utils/raglan/types.ts` | `RaglanInput`, `RaglanOutput` — read for types only |
| `utils/raglan/calculateRaglanCore.ts` | Full formula (shared with Supabase edge) |
| `utils/calculateRaglan.ts` | Re-exports only (~7 lines) |

Field glossary: `docs/RAGLAN_GLOSSARY.md`.

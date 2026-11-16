# File hotspots (surgical edits for agents)

Open **only** the section that matches your task. Grep symbols in `docs/SYMBOLS.md` or `docs/TASK_ROUTER.md` before reading whole files.

## Shared chart helpers (`screens/styles/raglan/`)

| File | Lines | Use when |
|------|-------|----------|
| `increaseRowSelection.ts` | ~145 | Raglan increase-row strings, type switch, side cell counts |
| `increaseArrayRenderers.tsx` | ~101 | Left/right increase columns, body grid cells |
| `vNeckFrontGrid.tsx` → `vNeckFrontGridParts/` | ~480 total | V-neck front chart shaping (left/right arrays, stitch counts) |
| `useRaglanChartState.ts` | ~40 | Highlighted row + increase-type picker state |
| `ribbingVCollarGrid.ts` | ~95 | V-neck collar increase dispatch + cell counts |
| `raglanChartChromeStyles.ts` | ~100 | Shared option-picker + bottom controls styles |

Chart screens (`*O`, `*V`) import these — fix increase logic **once** here, not in six screens.

## Split screens: open the `*Parts/` file, not the entry

Big v-neck screens are thin entries (same path and exports) plus a sibling `<name>Parts/` folder. Each part starts with a one-line comment saying what it holds: `head -1 <folder>/*` is the cheapest map.

| Entry (lines) | Parts folder | Where things live |
|---|---|---|
| `raglan/frontV.tsx` (~175) | `raglan/frontVParts/` | `FrontVIncreaseOptions` (increase-type picker), `FrontVPaginationDots`, `styles.ts`; grid math in `vNeckFrontGridParts/` |
| `raglan/vNeckFrontGrid.tsx` (re-exports) | `raglan/vNeckFrontGridParts/` | `calc.ts` (`computeVNeckData`, row lengths, cell data), `renderVNeckLeftArray.tsx`, `renderVNeckRightArray.tsx`, `types.ts` |
| `raglan/ribbingV.tsx` (~120) | `raglan/ribbingVParts/` | `calc.ts` (angles, transforms, stop-row math), `useRibbingVHighlight.ts`, `RibbingVChartGrid` (layout), `RibbingVCollarRows` / `...Right` (collar increases via `ribbingVCollarGrid.ts`), `RibbingVStitchGrid`, `RibbingVLegend`, `styles.ts` |
| `result/FrontV.tsx` (~80) | `result/FrontVParts/` | `calc.ts` (row stitch counts), `FrontVAction1Intro` / `Action1CalcSection` / `Action2Section` / `Action3Section`, `FrontVRow1PairScroll`, `FrontVRow2PinkScroll`, `styles.ts`; increase strings via `mapPrecomputedVStrings` |
| `result/ResultStepV.tsx` (~30) | `result/ResultStepVParts/` | `calc.ts` (totals, length format), `ResultStepVCard`, `SleeveSideSection`, `CorpusBreakdownScroll`, `StitchesLengthRows`, `styles.ts` |
| `result/Step3BackLengthening.tsx` + `V` (~70 each) | `result/Step3BackLengtheningParts/` (shared) | `BackLengtheningCard`, `PartsDivisionCard` take precomputed values as props; per-variant `stylesRegular.ts` / `stylesVNeck.ts` |
| `result/Step4SeparatingSleeves.tsx` + `V` (~45 each) | `result/Step4SeparatingSleevesParts/` | `SeparatingSleevesRegularCard`, `SeparatingSleevesVNeckCard`, `stylesRegular.ts` / `stylesVNeck.ts` |

The entries pick which `results.*` fields (regular vs `*V`) go into the shared parts; fix field choice there, layout in the part.

## `RegularResult.tsx` (~160 lines) — regular result orchestrator

| Area | File |
|------|------|
| Scroll refs + carousel handlers | `useRegularResultScroll.ts` |
| Plan images carousel | `RegularResultCarousel.tsx` |
| Final corpus/sleeve summary | `RegularResultSummary.tsx` |
| Increase precompute (4 schemes) | `useRegularIncreasePrecompute.ts` |
| Step 1–4 UI | `Step1Ribbing.tsx` … `Step4SeparatingSleeves.tsx` |
| Core increase math | `increaseRowsRegular.ts` |

## `VNeckResult.tsx` (~190 lines) — v-neck result orchestrator

| Area | File |
|------|------|
| Scroll refs + carousel handlers | `useRegularResultScroll.ts` |
| Plan images carousel | `VNeckResultCarousel.tsx` |
| Increase precompute (collar + 4 schemes) | `useVNeckIncreasePrecompute.ts` |
| Step 1–4 UI | `Step1RibbingV.tsx` … `Step4SeparatingSleevesV.tsx`, `FrontV.tsx`, `ResultStepV.tsx` |

## Result steps (large)

| File | ~lines | Notes |
|------|--------|-------|
| `Step2AddingStitches.tsx` | 546 | Regular step 2 — increase tables |
| `Step2AddingStitchesV.tsx` | 589 | V-neck step 2 |
| `Step1RibbingV.tsx` | 492 | V-neck step 1 |

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
| `utils/i18n/strings/result/shared.ts` | ~300 | Nav, step chrome |
| `utils/i18n/strings/result/steps.ts` | ~460 | Step copy |
| `utils/i18n/strings/result/legend.ts` | ~220 | Color legend |
| `utils/i18n/strings/result/help.ts` | ~280 | Help modals |
| `utils/i18n/strings/charts.ts` | 31 | Raglan charts |

Grep the key in `translationKeys.ts`, edit **one** `export const` in the matching domain file. Result keys: `docs/i18n/RESULT_KEY_INDEX.md`.

## Row counter (standalone)

| File | Role |
|------|------|
| `state/rowCounterState.ts` | MST store; AsyncStorage key `rowCounters`; plan counters (`kind: 'plan'`) |
| `utils/knitPlan.ts` | Pure knit-by-plan engine (`buildKnitPlanSource`, row info, checkpoints) |
| `screens/counter/counterParts/` | Plan-mode counter UI (`PlanRowHint`, `PlanCheckpointCard`, …) |

## Raglan calculation core

| File | Role |
|------|------|
| `utils/raglan/types.ts` | `RaglanInput`, `RaglanOutput` — read for types only |
| `utils/raglan/calculateRaglanCore.ts` | Full formula (shared with Supabase edge) |
| `utils/calculateRaglan.ts` | Re-exports only (~7 lines) |

Field glossary: `docs/RAGLAN_GLOSSARY.md`.

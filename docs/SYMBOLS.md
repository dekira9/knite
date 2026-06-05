# Symbol index

Grep before reading. Paths are relative to project root.

## Raglan core (`utils/raglan/`)

| Symbol | File |
|--------|------|
| `calculateRaglanCore` | `calculateRaglanCore.ts` |
| `parseRaglanInput` | `parseInput.ts` |
| `computeStyleVariant` | `styleVariant.ts` |
| `computeVNeckFields` | `vNeck.ts` |
| `computeUsedIncreaseTypes` | `usedIncreaseTypes.ts` |
| `computeRegularRaglanLineMaxFromMeasurements` | `raglanLineBounds.ts` |
| `RaglanInput`, `RaglanOutput` | `types.ts` |

## Result increase helpers

| Symbol | File |
|--------|------|
| `determineIncreaseType` | `increaseRowsRegular.ts` |
| `calculateIncreaseRows1x2_1x4` | `increaseRowsRegular.ts` |
| `calculateIncreaseRows1x2_1x3` | `increaseRowsRegular.ts` |
| `calculateIncreaseRows1x2_1x1` | `increaseRowsRegular.ts` |
| `calculateIncreaseRows1x4_1x3` | `increaseRowsRegular.ts` |
| `calculateIncreaseRows*V` | `increaseRowsVNeck.ts` |
| `calculateVNeckIncreases01` … `22` | `vNeckCornerIncreases.ts` |
| `computeRegularIncreasePrecompute` | `useRegularIncreasePrecompute.ts` |

## Chart helpers (`screens/styles/raglan/`)

| Symbol | File |
|--------|------|
| `buildRegularIncreaseRowStrings` | `increaseRowSelection.ts` |
| `buildVNeckIncreaseRowStrings` | `increaseRowSelection.ts` |
| `getIncreaseRowsFromType` | `increaseRowSelection.ts` |
| `countSideArrayCells` | `increaseRowSelection.ts` |
| `mapPrecomputedVStrings` | `increaseRowSelection.ts` |
| `renderLeftIncreaseArray` | `increaseArrayRenderers.tsx` |
| `renderRightIncreaseArray` | `increaseArrayRenderers.tsx` |
| `renderBodyGrid` | `increaseArrayRenderers.tsx` |
| `computeVNeckData` | `vNeckFrontGrid.tsx` |
| `renderVNeckLeftArray` | `vNeckFrontGrid.tsx` |
| `renderVNeckRightArray` | `vNeckFrontGrid.tsx` |
| `useRaglanChartState` | `useRaglanChartState.ts` |
| `computeRibbingVCellCounts` | `ribbingVCollarGrid.ts` |
| `raglanChartChromeStyleDefs` | `raglanChartChromeStyles.ts` |
| `INTRO_STATE_PERSISTED_KEYS` | `state/introStatePersistedKeys.ts` |
| `pickPersistedIntroState` | `state/introStatePersistedKeys.ts` |
| `applyPersistedIntroState` | `state/introStatePersistedKeys.ts` |
| `useRegularResultScroll` | `useRegularResultScroll.ts` |

## State actions (`state/introState.ts`)

| Symbol | Grep |
|--------|------|
| `syncRaglanFromSupabase` | `syncRaglanFromSupabase` |
| `setRaglanData` | `setRaglanData` |
| `persistState` | `async persistState` |
| `setPersistedState` | `setPersistedState` |
| `applySamplePreset` | `applySamplePreset` |
| `calculateRaglan()` view | `calculateRaglan()` |

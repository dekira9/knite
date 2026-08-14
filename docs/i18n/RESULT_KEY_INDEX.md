# Result i18n key index

Grep the key name — edit **one** `export const` in the file below. Do not read the whole `strings/result/` tree.

| File | Keys | ~lines | Used by |
|------|------|--------|---------|
| `utils/i18n/strings/result/shared.ts` | `next`, `calculate`, `end`, `step`, `action`, `plan`, `back`, `front`, `sleeve`, `start`, `adding`, `create`, `Result`, `expandMeasurements`, `collapseMeasurements` | ~300 | Navigation, step chrome, measurements banner |
| `utils/i18n/strings/result/steps.ts` | `sequenceOfAdditions`, `drawingForUnderstanding`, `calculationForYou`, `knitTheStitchesFromTheCollar`, `thereAreNoStitches`, `addingStitchesAlongTheRaglanLine`, `decreaseTheStitches`, `decreasesOnOneSide`, `oneStitchFor*`, `RowsWithAdding`, `separateTheSleeve`, `raglanline`, `raglan`, `line`, `separatingBodyAndSleeves`, `parts`, `corpus`, `backLengthening`, `created`, `additionsOnOneSide` | ~460 | `Step1Ribbing*.tsx`, `Step2AddingStitches*.tsx`, `Step3*`, `Step4*`, `FrontV.tsx` |
| `utils/i18n/strings/result/legend.ts` | `resultLegendTitle`, `resultLegendStart`, `resultLegendCollar`, `resultLegendFront`, `resultLegendSleeve`, `resultLegendBack`, `resultLegendRaglan`, `resultLegendCorpus`, `resultLegendUnderarm`, `resultLegendExpand`, `resultLegendCollapse` | ~220 | `ResultColorLegend.tsx`, `raglanResultLegend.ts` |
| `utils/i18n/strings/result/help.ts` | `resultHelp*` (14 keys: title + body pairs) | ~280 | `ResultHelpModal.tsx`, `IncreaseOptionSection.tsx` |

Barrel: `utils/i18n/strings/result/index.ts` — re-exports all; `mergeTranslations.ts` unchanged.

**New key workflow:** add to `translationKeys.ts` → add `export const` in the matching sub-file above → **`en` + `ru` only** (other locales later).

**Prompt tip:** cite the key name and sub-file, not `@strings/result/`.

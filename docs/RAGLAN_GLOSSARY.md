# Raglan calculation glossary

Core implementation: `utils/raglan/` (assembled by `utils/calculateRaglan.ts`). Supabase edge `calculate-raglan` imports the same entry point.

Slider max for round-neck raglan line width: `computeRegularRaglanLineMaxFromMeasurements()` in `utils/raglan/raglanLineBounds.ts` (neck cast-on only, no full calc).

Field names match persisted `introState` keys. Suffix `V` = v-neck variant (parallel inputs: `ribbingWidthV`, `raglanLineWidthV`, etc.).

## Neck and cast-on

| Field | Meaning |
|-------|---------|
| `Sgor` / `SgorV` | Stitches around neck (горловина) |
| `NRrez` / `NRrezV` | Rows in ribbing height |
| `SFrontO` / `SFrontV` | Front neck stitches (переда) |
| `Lgor`, `LFront` | Lengths in cm (internal in `StyleVariantResult`) |

## Raglan line

| Field | Meaning |
|-------|---------|
| `K` / `KV` | Raglan line width in stitches |
| `SKfront` | Stitches on front piece at raglan join |
| `Sfx` | Raglan increase stitches to work (петли прибавления по реглану) |
| `NHFront` | Rows from ribbing to underarm on front |

## Increases

| Pattern | Meaning |
|---------|---------|
| `1x1`, `1x2`, `1x3`, `1x4` | One stitch every N rows |
| `prib_*` | Row counts; `*_f` = stitch counts for classification |
| `usedIncreaseType` | Detected combination (e.g. `1x2, 1x4`) |

Row placement strings for combined schemes (`resultString21`, etc.) are computed in `screens/styles/input/result/increaseRows*.ts`, not in core.

## V-neck only

| Field | Meaning |
|-------|---------|
| `LHV` / `NHV` | Neck depth (cm / rows) |
| `SpribVcorn` | Corner increases at ribbing |
| `resultStringV` | Increases per row-pair on front V shaping |

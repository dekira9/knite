# Raglan calculation glossary

**Agents:** grep this file before opening `state/introState.ts`. For typed access use `state/raglanSelectors.ts` (`pickRaglanVariant`, `pickActiveRaglanVariant`). Legacy keys stay in persistence — do not rename without `state/introStateMigration.ts`.

Core implementation: `utils/raglan/` (assembled by `utils/calculateRaglan.ts`). Supabase edge `calculate-raglan` imports the same entry point.

Slider max for round-neck raglan line width: `computeRegularRaglanLineMaxFromMeasurements()` in `utils/raglan/raglanLineBounds.ts`.

Suffix **`V`** on a field = v-neck parallel value. **`O`** in names like `SFrontO` = round (круглая) neck, not v-neck.

---

## Naming convention (legacy abbreviations)

| Prefix | Meaning | Unit |
|--------|---------|------|
| `S` | Stitches (петли) | count |
| `N` | Number of rows (ряды) | count |
| `L` | Length | cm |
| `K` | Raglan line width | stitches |
| `prib_` | Increase row counts (прибавления) | rows |
| `prib_*_f` | Increase **stitch** counts for scheme detection | stitches |
| `PR_` | Raglan-line increase rows (front body) | rows |
| `PRib_` | Rib-side increase rows in combined schemes | rows |
| `RowPrib` | Row indices for a single increase rate (1x1 … 1x4) | row #[] |
| `Hrez` | Ribbing height input | cm (internal) |
| `Lgor` | Neck circumference length | cm (internal in `StyleVariantResult`) |

Russian roots: **gor** = горловина, **rez** = резинка, **prib** = прибавления, **fx** = реглан (increase zone), **rostok** = росток (yoke), **ogr** = обхват груди, **podr** = подмышка.

---

## User inputs (already readable English)

| Legacy key | Canonical name | Notes |
|------------|----------------|-------|
| `headCircumference` | head circumference | cm, string in UI |
| `neckCircumference` | neck circumference | cm |
| `chestCircumference` | chest circumference | cm |
| `stitchDensity` | stitch gauge | stitches per 10 cm, string |
| `rowDensity` | row gauge | rows per 10 cm, string |
| `fitType` | fit ease preset | `fitted` / `semi-fitted` / `loose` / `oversized` |
| `ribbingWidth` | ribbing height (regular) | cm → drives `NRrez` |
| `ribbingWidthV` | ribbing height (v-neck) | cm → drives `NRrezV` |
| `raglanLineWidth` | raglan line width slider (regular) | stitches → `K` |
| `raglanLineWidthV` | raglan line width slider (v-neck) | stitches → `KV` |
| `depthNeckV` | v-neck depth input | cm → `LHV` / `NHV` |
| `style` | active style id | `'regular'` \| `'v-neck'` |
| `necklineStyle` | neckline UI choice | `'round'` \| `'v-neck'` |

---

## Neck, ribbing, cast-on

| Legacy (regular / v-neck) | Canonical | Unit | Source |
|---------------------------|-----------|------|--------|
| `Sgor` / `SgorV` | neck cast-on stitches | stitches | `computeSgor()` |
| `NRrez` / `NRrezV` | ribbing row count | rows | `Hrez * row gauge` |
| `SFrontO` / `SFrontV` | front neck stitches | stitches | `(Sgor - 4K)` formula |
| `LFrontO` / `LFrontV` | front neck width | cm | from `Lgor`, `K` |
| `Sa` / `SaV` | sleeve stitches at neck | stitches | `(Sgor - 2·SFront - 4K) / 2` |
| `NRostok` / `NRostokV` | yoke / rostok row count | rows | from neck depth formula |
| `SRostok` / `SRostokV` | yoke stitch count | stitches | `SFront + 2·Sfx + 2·SKfront` |

Internal (`StyleVariantResult`, before `calculateRaglanCore` maps to `*O`/`*V`): `SFront`, `LFront`, `Lgor`.

---

## Raglan line & body block

| Legacy (regular / v-neck) | Canonical | Unit | Notes |
|---------------------------|-----------|------|-------|
| `K` / `KV` | raglan line width | stitches | same as slider value |
| `SKfront` / `SKfrontV` | stitches on front at raglan join | stitches | |
| `SKa` / `SKaV` | remaining raglan-line stitches per side | stitches | `K - SKfront` |
| `Sfx` / `SfxV` | raglan increase stitches to work | stitches | `(SFrontGr - SFront) / 2` |
| `NRfx` / `NRfxV` | rows consumed by raglan increases | rows | `Sfx * 2` |
| `NHFront` / `NHFrontV` | rows from ribbing to underarm (front) | rows | |
| `SFrontOGr` / `SFrontOGrV` | front stitches at full chest width | stitches | grading target |
| `SPodr` / `SPodrV` | underarm stitches | stitches | ~8% of chest |
| `fit` | ease in cm | cm | from `fitType` |
| `SFit` | ease in stitches | stitches | rounded |
| `SOgr` | chest stitches | stitches | `chest * gauge` |
| `stitches` | parsed stitch gauge | stitches/cm | `stitchDensity / 10` |

---

## Increase scheme detection

Pattern **`1xN`**: one stitch increased every N rows.

| Legacy (regular / v-neck) | Canonical | Meaning |
|---------------------------|-----------|---------|
| `prib_1x1` / `prib_1x1V` | 1x1 increase rows (count) | row count |
| `prib_1x2` / `prib_1x2V` | 1x2 increase rows | row count |
| `prib_1x3` / `prib_1x3V` | 1x3 increase rows | row count |
| `PR_1x4` / `PR_1x4V` | 1x4 raglan-line rows | row count |
| `PR_1x2` / `PR_1x2V` | 1x2 raglan-line rows | row count |
| `PRib_1x4` / `PRib_1x4V` | 1x4 rib-side rows | row count |
| `PRib_1x3` / `PRib_1x3V` | 1x3 rib-side rows | row count |
| `prib_1x1_f` … `PRib_1x3_f` (+ `V`) | stitch counts for classification | stitches |
| `usedIncreaseType` / `usedIncreaseTypeV` | detected schemes | e.g. `['1x2, 1x4']` |
| `usedIncreaseTypeString` / `…V` | same, comma-separated | display |

---

## Single-rate increase row lists (from core `rowPrib`)

| Legacy (regular / v-neck) | Rate | Type |
|---------------------------|------|------|
| `RowPrib1x4` / `RowPrib1x4V` | 1x4 | `number[]` |
| `RowPrib1x4String` / `…V` | 1x4 | comma string |
| `RowPrib1x3` / `RowPrib1x3V` | 1x3 | |
| `RowPrib1x2` / `RowPrib1x2V` | 1x2 | |
| `RowPrib1x1` / `RowPrib1x1V` | 1x1 | |

---

## Combined increase schemes (UI-only, `increaseRows*.ts`)

Digits in `resultString**` encode the two rates (e.g. **24** = `1x2` + `1x4`).

| Legacy key | Scheme | Computed by | Used in |
|------------|--------|-------------|---------|
| `resultString24` / `resultString24V` | `1x2, 1x4` | `calculateIncreaseRows1x2_1x4(V)` | charts, step 2 |
| `resultString23` / `resultString23V` | `1x2, 1x3` | `calculateIncreaseRows1x2_1x3(V)` | |
| `resultString21` / `resultString21V` | `1x2, 1x1` | `calculateIncreaseRows1x2_1x1(V)` | |
| `resultString43` / `resultString43V` | `1x4, 1x3` | `calculateIncreaseRows1x4_1x3(V)` | |

Regular keys are computed at runtime in `useRegularIncreasePrecompute.ts` (not persisted). V-neck `resultString*V` keys are persisted.

Enum: `IncreaseScheme` in `state/raglanSelectors.ts`.

---

## V-neck shaping only (`computeVNeck` in `utils/raglan/vNeck.ts`)

| Legacy key | Canonical | Unit | Notes |
|------------|-----------|------|-------|
| `LHV` | neck depth | cm | user `depthNeckV` or min |
| `NHV` | neck depth | rows | |
| `LHVmin` / `LHVmax` | depth bounds | cm | |
| `NHVmin` / `NHVmax` | depth bounds | rows | |
| `LKmaxV` | max raglan line length | cm | |
| `KmaxV` | max raglan line width | stitches | slider cap |
| `LpribVcorn` | corner increase length | cm | |
| `SpribVcorn` | corner increase stitches | stitches | collar chart |
| `LVfront` | front V hypotenuse | cm | |
| `SVfront` | front V hypotenuse | stitches | |
| `SV` | stitches per V side (net) | stitches | `SVfront - SpribVcorn` |
| `SVO` | both V sides | stitches | `SV * 2` |
| `SOcutV` | neck opening adjustment | stitches | |
| `PribRVz` / `PribRV1s` / `PribRV2s` / `PribRV3s` | collar corner increase row counts | rows | by rate 0/1/2/3 |
| `RowPribRVz` / `RowPribRV1` … `RowPribRV3` | collar corner increase row indices | rows | ribbing chart |
| `isV` | base increases per V row-pair | stitches | |
| `isPlusOneV` | alternate rate (`isV + 1`) | stitches | |
| `pairsWithIsV` / `pairsWithIsPlusOneV` | row-pairs at each rate | count | |
| `rowsWithIsV` / `rowsWithIsPlusOneV` | rows at each rate | rows | |
| `krV` | row spacing factor | — | front V grid |
| `positionsWithIsV` / `positionsWithIsPlusOneV` | row-pair positions | `number[]` | front chart |
| `resultStringV` | increases per V row-pair | string | e.g. `"2, 3, 2, …"` |

---

## Gauge helpers (persisted, sparse use)

| Legacy key | Canonical | Unit |
|------------|-----------|------|
| `Ls` / `LsV` | cm per stitch | cm | `1 / stitches` |
| `hs` / `hsV` | cm per row | cm | `1 / rows` |

---

## App / persistence meta (not raglan math)

| Key | Meaning |
|-----|---------|
| `styleChosen` | user picked a style |
| `introFinished` | wizard complete |
| `usesSampleMeasurements` | example preset flow |
| `hasCustomMeasurements` | saved custom project |
| `chartHighlightedRows` | per-chart row highlight map |

---

## Style variant pairs (quick reference)

Use `pickRaglanVariant(state, 'regular' | 'v-neck')` instead of memorizing pairs.

| Canonical | Regular key | V-neck key |
|-----------|-------------|------------|
| neckCastOnStitches | `Sgor` | `SgorV` |
| ribbingRows | `NRrez` | `NRrezV` |
| frontNeckStitches | `SFrontO` | `SFrontV` |
| sleeveStitches | `Sa` | `SaV` |
| raglanLineWidthStitches | `K` | `KV` |
| frontLengthCm | `LFrontO` | `LFrontV` |
| raglanJoinFrontStitches | `SKfront` | `SKfrontV` |
| raglanJoinSideStitches | `SKa` | `SKaV` |
| rowsToUnderarm | `NHFront` | `NHFrontV` |
| yokeStitches | `SRostok` | `SRostokV` |
| frontGradingStitches | `SFrontOGr` | `SFrontOGrV` |
| underarmStitches | `SPodr` | `SPodrV` |
| raglanIncreaseStitches | `Sfx` | `SfxV` |
| raglanIncreaseRows | `NRfx` | `NRfxV` |
| usedIncreaseTypes | `usedIncreaseType` | `usedIncreaseTypeV` |

Full registry: `RAGLAN_VARIANT_FIELDS` in `state/raglanSelectors.ts`.

---

## File map

| Need | File |
|------|------|
| Full calc | `utils/raglan/calculateRaglanCore.ts` |
| Per-style body | `utils/raglan/styleVariant.ts` |
| V-neck extras | `utils/raglan/vNeck.ts` |
| Combined row strings | `screens/styles/input/result/increaseRowsRegular.ts`, `increaseRowsVNeck.ts` |
| Collar corner cases | `screens/styles/input/result/vNeckCornerIncreases.ts` |
| Typed state access | `state/raglanSelectors.ts` |
| Future rename migration | `state/introStateMigration.ts` |

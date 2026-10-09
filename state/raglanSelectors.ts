import type { RaglanStyleId } from '@/constants/samplePresets';

/** Active style for variant field lookup. */
export type RaglanVariantStyle = RaglanStyleId;

/** Combined increase scheme ids — digits match legacy `resultString**` keys. */
export const IncreaseScheme = {
  OneX2_OneX4: '1x2_1x4',
  OneX2_OneX3: '1x2_1x3',
  OneX2_OneX1: '1x2_1x1',
  OneX4_OneX3: '1x4_1x3',
} as const;

export type IncreaseSchemeId = (typeof IncreaseScheme)[keyof typeof IncreaseScheme];

/** Maps scheme id → legacy resultString key suffix (21, 23, 24, 43). */
export const INCREASE_SCHEME_RESULT_KEY: Record<
  IncreaseSchemeId,
  { regular: string; vNeck: string }
> = {
  [IncreaseScheme.OneX2_OneX4]: { regular: 'resultString24', vNeck: 'resultString24V' },
  [IncreaseScheme.OneX2_OneX3]: { regular: 'resultString23', vNeck: 'resultString23V' },
  [IncreaseScheme.OneX2_OneX1]: { regular: 'resultString21', vNeck: 'resultString21V' },
  [IncreaseScheme.OneX4_OneX3]: { regular: 'resultString43', vNeck: 'resultString43V' },
};

/** Human-readable labels stored in `usedIncreaseType`. */
export const INCREASE_SCHEME_LABEL: Record<IncreaseSchemeId, string> = {
  [IncreaseScheme.OneX2_OneX4]: '1x2, 1x4',
  [IncreaseScheme.OneX2_OneX3]: '1x2, 1x3',
  [IncreaseScheme.OneX2_OneX1]: '1x2, 1x1',
  [IncreaseScheme.OneX4_OneX3]: '1x4, 1x3',
};

/**
 * Canonical metrics for one style variant (regular or v-neck).
 * Property names are English; values come from legacy introState keys.
 */
export interface RaglanVariantMetrics {
  neckCastOnStitches: number;
  ribbingRows: number;
  frontNeckStitches: number;
  sleeveStitches: number;
  raglanLineWidthStitches: number;
  frontLengthCm: number;
  raglanJoinFrontStitches: number;
  raglanJoinSideStitches: number;
  rowsToUnderarm: number;
  yokeRowCount: number;
  yokeStitches: number;
  frontGradingStitches: number;
  underarmStitches: number;
  raglanIncreaseStitches: number;
  raglanIncreaseRows: number;
  usedIncreaseTypes: string[];
  usedIncreaseTypesLabel: string;
  increaseRows1x1: number[];
  increaseRows1x2: number[];
  increaseRows1x3: number[];
  increaseRows1x4: number[];
  increaseRows1x1Label: string;
  increaseRows1x2Label: string;
  increaseRows1x3Label: string;
  increaseRows1x4Label: string;
  combinedIncreaseRows: Record<IncreaseSchemeId, string>;
  increaseStitchCounts: RaglanIncreaseStitchCounts;
}

export interface RaglanIncreaseStitchCounts {
  oneX1: number;
  oneX2: number;
  oneX3: number;
  prOneX4: number;
  prOneX2: number;
  pribOneX4: number;
  pribOneX3: number;
}

/** Fields shared between regular and v-neck (no V suffix). */
export interface RaglanSharedMetrics {
  fitEaseCm: number;
  fitEaseStitches: number;
  chestStitches: number;
  stitchGauge: number;
  ribbingHeightCm: number;
  raglanLineWidthSlider: number;
}

/** V-neck-only shaping (from `computeVNeck`). */
export interface RaglanVNeckShaping {
  neckDepthCm: number;
  neckDepthRows: number;
  neckDepthCmMin: number;
  neckDepthCmMax: number;
  neckDepthRowsMin: number;
  neckDepthRowsMax: number;
  maxRaglanLineLengthCm: number;
  maxRaglanLineWidthStitches: number;
  cornerIncreaseLengthCm: number;
  cornerIncreaseStitches: number;
  frontVLengthCm: number;
  frontVStitches: number;
  vSideStitches: number;
  vBothSidesStitches: number;
  neckOpeningAdjustment: number;
  collarIncreaseRows: RaglanCollarIncreaseRows;
  frontVIncreasePattern: RaglanFrontVIncreasePattern;
  vRowPairIncreasesLabel: string;
}

export interface RaglanCollarIncreaseRows {
  zeroRateRows: number;
  oneRateRows: number;
  twoRateRows: number;
  threeRateRows: number;
  rowIndexZero: number;
  rowIndexOne: number;
  rowIndexTwo: number;
  rowIndexThree: number;
}

export interface RaglanFrontVIncreasePattern {
  baseIncreasesPerPair: number;
  plusOneIncreasesPerPair: number;
  pairsAtBaseRate: number;
  pairsAtPlusOneRate: number;
  rowsAtBaseRate: number;
  rowsAtPlusOneRate: number;
  rowSpacingFactor: number;
  positionsAtBaseRate: number[];
  positionsAtPlusOneRate: number[];
}

/** Canonical name → legacy introState keys per variant. */
export const RAGLAN_VARIANT_FIELDS = {
  neckCastOnStitches: { regular: 'Sgor', vNeck: 'SgorV' },
  ribbingRows: { regular: 'NRrez', vNeck: 'NRrezV' },
  frontNeckStitches: { regular: 'SFrontO', vNeck: 'SFrontV' },
  sleeveStitches: { regular: 'Sa', vNeck: 'SaV' },
  raglanLineWidthStitches: { regular: 'K', vNeck: 'KV' },
  frontLengthCm: { regular: 'LFrontO', vNeck: 'LFrontV' },
  raglanJoinFrontStitches: { regular: 'SKfront', vNeck: 'SKfrontV' },
  raglanJoinSideStitches: { regular: 'SKa', vNeck: 'SKaV' },
  rowsToUnderarm: { regular: 'NHFront', vNeck: 'NHFrontV' },
  yokeRowCount: { regular: 'NRostok', vNeck: 'NRostokV' },
  yokeStitches: { regular: 'SRostok', vNeck: 'SRostokV' },
  frontGradingStitches: { regular: 'SFrontOGr', vNeck: 'SFrontOGrV' },
  underarmStitches: { regular: 'SPodr', vNeck: 'SPodrV' },
  raglanIncreaseStitches: { regular: 'Sfx', vNeck: 'SfxV' },
  raglanIncreaseRows: { regular: 'NRfx', vNeck: 'NRfxV' },
  usedIncreaseTypes: { regular: 'usedIncreaseType', vNeck: 'usedIncreaseTypeV' },
  usedIncreaseTypesLabel: {
    regular: 'usedIncreaseTypeString',
    vNeck: 'usedIncreaseTypeStringV',
  },
} as const satisfies Record<
  string,
  { regular: string; vNeck: string }
>;

export type RaglanVariantFieldName = keyof typeof RAGLAN_VARIANT_FIELDS;

type RaglanStateSlice = Record<string, unknown>;

function variantKey(field: RaglanVariantFieldName, style: RaglanVariantStyle): string {
  const pair = RAGLAN_VARIANT_FIELDS[field];
  return style === 'v-neck' ? pair.vNeck : pair.regular;
}

function readNumber(state: RaglanStateSlice, key: string): number {
  return Number(state[key] ?? 0);
}

function readStringArray(state: RaglanStateSlice, key: string): string[] {
  const value = state[key];
  return Array.isArray(value) ? (value as string[]) : [];
}

function readNumberArray(state: RaglanStateSlice, key: string): number[] {
  const value = state[key];
  return Array.isArray(value) ? (value as number[]) : [];
}

function readString(state: RaglanStateSlice, key: string): string {
  const value = state[key];
  return typeof value === 'string' ? value : '';
}

function suffixForStyle(style: RaglanVariantStyle): '' | 'V' {
  return style === 'v-neck' ? 'V' : '';
}

function pickIncreaseStitchCounts(
  state: RaglanStateSlice,
  style: RaglanVariantStyle,
): RaglanIncreaseStitchCounts {
  const s = suffixForStyle(style);
  return {
    oneX1: readNumber(state, `prib_1x1_f${s}`),
    oneX2: readNumber(state, `prib_1x2_f${s}`),
    oneX3: readNumber(state, `prib_1x3_f${s}`),
    prOneX4: readNumber(state, `PR_1x4_f${s}`),
    prOneX2: readNumber(state, `PR_1x2_f${s}`),
    pribOneX4: readNumber(state, `PRib_1x4_f${s}`),
    pribOneX3: readNumber(state, `PRib_1x3_f${s}`),
  };
}

function pickCombinedIncreaseRows(
  state: RaglanStateSlice,
  style: RaglanVariantStyle,
): Record<IncreaseSchemeId, string> {
  const result = {} as Record<IncreaseSchemeId, string>;
  for (const scheme of Object.values(IncreaseScheme)) {
    const keys = INCREASE_SCHEME_RESULT_KEY[scheme];
    const key = style === 'v-neck' ? keys.vNeck : keys.regular;
    result[scheme] = readString(state, key);
  }
  return result;
}

/** Read one paired variant field by canonical name. */
export function pickRaglanField<K extends RaglanVariantFieldName>(
  state: RaglanStateSlice,
  field: K,
  style: RaglanVariantStyle,
): K extends 'usedIncreaseTypes' ? string[] : number | string[] {
  const key = variantKey(field, style);
  if (field === 'usedIncreaseTypes') {
    return readStringArray(state, key) as K extends 'usedIncreaseTypes' ? string[] : never;
  }
  if (field === 'usedIncreaseTypesLabel') {
    return readString(state, key) as K extends 'usedIncreaseTypes' ? string[] : never;
  }
  return readNumber(state, key) as K extends 'usedIncreaseTypes' ? string[] : number;
}

/** All variant metrics for regular or v-neck in canonical English names. */
export function pickRaglanVariant(
  state: RaglanStateSlice,
  style: RaglanVariantStyle,
): RaglanVariantMetrics {
  const s = suffixForStyle(style);

  return {
    neckCastOnStitches: readNumber(state, variantKey('neckCastOnStitches', style)),
    ribbingRows: readNumber(state, variantKey('ribbingRows', style)),
    frontNeckStitches: readNumber(state, variantKey('frontNeckStitches', style)),
    sleeveStitches: readNumber(state, variantKey('sleeveStitches', style)),
    raglanLineWidthStitches: readNumber(state, variantKey('raglanLineWidthStitches', style)),
    frontLengthCm: readNumber(state, variantKey('frontLengthCm', style)),
    raglanJoinFrontStitches: readNumber(state, variantKey('raglanJoinFrontStitches', style)),
    raglanJoinSideStitches: readNumber(state, variantKey('raglanJoinSideStitches', style)),
    rowsToUnderarm: readNumber(state, variantKey('rowsToUnderarm', style)),
    yokeRowCount: readNumber(state, variantKey('yokeRowCount', style)),
    yokeStitches: readNumber(state, variantKey('yokeStitches', style)),
    frontGradingStitches: readNumber(state, variantKey('frontGradingStitches', style)),
    underarmStitches: readNumber(state, variantKey('underarmStitches', style)),
    raglanIncreaseStitches: readNumber(state, variantKey('raglanIncreaseStitches', style)),
    raglanIncreaseRows: readNumber(state, variantKey('raglanIncreaseRows', style)),
    usedIncreaseTypes: readStringArray(state, variantKey('usedIncreaseTypes', style)),
    usedIncreaseTypesLabel: readString(state, variantKey('usedIncreaseTypesLabel', style)),
    increaseRows1x1: readNumberArray(state, `RowPrib1x1${s}`),
    increaseRows1x2: readNumberArray(state, `RowPrib1x2${s}`),
    increaseRows1x3: readNumberArray(state, `RowPrib1x3${s}`),
    increaseRows1x4: readNumberArray(state, `RowPrib1x4${s}`),
    increaseRows1x1Label: readString(state, `RowPrib1x1String${s}`),
    increaseRows1x2Label: readString(state, `RowPrib1x2String${s}`),
    increaseRows1x3Label: readString(state, `RowPrib1x3String${s}`),
    increaseRows1x4Label: readString(state, `RowPrib1x4String${s}`),
    combinedIncreaseRows: pickCombinedIncreaseRows(state, style),
    increaseStitchCounts: pickIncreaseStitchCounts(state, style),
  };
}

/** Metrics shared across both neckline styles. */
export function pickRaglanShared(state: RaglanStateSlice): RaglanSharedMetrics {
  const style = (state.style as RaglanVariantStyle | undefined) ?? 'regular';
  const ribbingKey = style === 'v-neck' ? 'ribbingWidthV' : 'ribbingWidth';
  const raglanSliderKey = style === 'v-neck' ? 'raglanLineWidthV' : 'raglanLineWidth';

  return {
    fitEaseCm: readNumber(state, 'fit'),
    fitEaseStitches: readNumber(state, 'SFit'),
    chestStitches: readNumber(state, 'SOgr'),
    stitchGauge: readNumber(state, 'stitches'),
    ribbingHeightCm: readNumber(state, ribbingKey),
    raglanLineWidthSlider: readNumber(state, raglanSliderKey),
  };
}

/** V-neck shaping block; returns zeros when fields are absent. */
export function pickRaglanVNeckShaping(state: RaglanStateSlice): RaglanVNeckShaping {
  return {
    neckDepthCm: readNumber(state, 'LHV'),
    neckDepthRows: readNumber(state, 'NHV'),
    neckDepthCmMin: readNumber(state, 'LHVmin'),
    neckDepthCmMax: readNumber(state, 'LHVmax'),
    neckDepthRowsMin: readNumber(state, 'NHVmin'),
    neckDepthRowsMax: readNumber(state, 'NHVmax'),
    maxRaglanLineLengthCm: readNumber(state, 'LKmaxV'),
    maxRaglanLineWidthStitches: readNumber(state, 'KmaxV'),
    cornerIncreaseLengthCm: readNumber(state, 'LpribVcorn'),
    cornerIncreaseStitches: readNumber(state, 'SpribVcorn'),
    frontVLengthCm: readNumber(state, 'LVfront'),
    frontVStitches: readNumber(state, 'SVfront'),
    vSideStitches: readNumber(state, 'SV'),
    vBothSidesStitches: readNumber(state, 'SVO'),
    neckOpeningAdjustment: readNumber(state, 'SOcutV'),
    collarIncreaseRows: {
      zeroRateRows: readNumber(state, 'PribRVz'),
      oneRateRows: readNumber(state, 'PribRV1s'),
      twoRateRows: readNumber(state, 'PribRV2s'),
      threeRateRows: readNumber(state, 'PribRV3s'),
      rowIndexZero: readNumber(state, 'RowPribRVz'),
      rowIndexOne: readNumber(state, 'RowPribRV1'),
      rowIndexTwo: readNumber(state, 'RowPribRV2'),
      rowIndexThree: readNumber(state, 'RowPribRV3'),
    },
    frontVIncreasePattern: {
      baseIncreasesPerPair: readNumber(state, 'isV'),
      plusOneIncreasesPerPair: readNumber(state, 'isPlusOneV'),
      pairsAtBaseRate: readNumber(state, 'pairsWithIsV'),
      pairsAtPlusOneRate: readNumber(state, 'pairsWithIsPlusOneV'),
      rowsAtBaseRate: readNumber(state, 'rowsWithIsV'),
      rowsAtPlusOneRate: readNumber(state, 'rowsWithIsPlusOneV'),
      rowSpacingFactor: readNumber(state, 'krV'),
      positionsAtBaseRate: readNumberArray(state, 'positionsWithIsV'),
      positionsAtPlusOneRate: readNumberArray(state, 'positionsWithIsPlusOneV'),
    },
    vRowPairIncreasesLabel: readString(state, 'resultStringV'),
  };
}

/** Resolve active style from introState (`style` field). */
export function activeRaglanStyle(state: RaglanStateSlice): RaglanVariantStyle {
  return state.style === 'v-neck' ? 'v-neck' : 'regular';
}

/** Variant metrics for whichever style is currently selected. */
export function pickActiveRaglanVariant(state: RaglanStateSlice): RaglanVariantMetrics {
  return pickRaglanVariant(state, activeRaglanStyle(state));
}

/** Legacy key for a canonical variant field (for logging or migration). */
export function legacyKeyForVariantField(
  field: RaglanVariantFieldName,
  style: RaglanVariantStyle,
): string {
  return variantKey(field, style);
}

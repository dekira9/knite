/**
 * Persistence schema migration (not wired yet).
 *
 * introState v1 uses flat legacy keys (`Sgor`, `SgorV`, …) listed in
 * `introStatePersistedKeys.ts`. A future v2 could nest by variant or rename
 * to English keys. Run migration only from `loadPersistedState()` after reading
 * AsyncStorage, before `applyPersistedIntroState`.
 */

import {
  RAGLAN_VARIANT_FIELDS,
  type RaglanVariantFieldName,
} from '@/state/raglanSelectors';

/** Bump when persisted shape changes. */
export const INTRO_STATE_SCHEMA_VERSION = 1;

export const INTRO_STATE_SCHEMA_VERSION_KEY = 'introStateSchemaVersion';

/** Example v2 nested shape (reference only — not used in MST yet). */
export interface IntroStateV2RaglanSnapshot {
  schemaVersion: 2;
  measurements: {
    headCircumference: string;
    neckCircumference: string;
    chestCircumference: string;
    stitchDensity: string;
    rowDensity: string;
    fitType: string;
  };
  style: string;
  regular: Record<RaglanVariantFieldName, number | string | string[]>;
  vNeck: Record<RaglanVariantFieldName, number | string | string[]>;
  vNeckShaping: Record<string, unknown>;
  meta: Record<string, unknown>;
}

/** Flat v1 key → canonical name (variant fields only). */
export function legacyKeyToCanonical(field: string): RaglanVariantFieldName | null {
  for (const [canonical, pair] of Object.entries(RAGLAN_VARIANT_FIELDS)) {
    if (pair.regular === field || pair.vNeck === field) {
      return canonical as RaglanVariantFieldName;
    }
  }
  return null;
}

/** Canonical name → legacy flat key for one variant. */
export function canonicalToLegacyKey(
  field: RaglanVariantFieldName,
  variant: 'regular' | 'vNeck',
): string {
  const pair = RAGLAN_VARIANT_FIELDS[field];
  return variant === 'vNeck' ? pair.vNeck : pair.regular;
}

/**
 * Example migration: flat v1 persisted blob → nested v2 reference shape.
 * Does not mutate input. Wire into load path when schemaVersion < 2.
 */
export function migrateIntroStateV1toV2(
  v1: Record<string, unknown>,
): IntroStateV2RaglanSnapshot {
  const regular = {} as Record<RaglanVariantFieldName, number | string | string[]>;
  const vNeck = {} as Record<RaglanVariantFieldName, number | string | string[]>;

  for (const [canonical, pair] of Object.entries(RAGLAN_VARIANT_FIELDS)) {
    const key = canonical as RaglanVariantFieldName;
    const regularValue = v1[pair.regular];
    const vNeckValue = v1[pair.vNeck];
    if (regularValue !== undefined) {
      regular[key] = regularValue as number | string | string[];
    }
    if (vNeckValue !== undefined) {
      vNeck[key] = vNeckValue as number | string | string[];
    }
  }

  const vNeckShapingKeys = [
    'LHV',
    'NHV',
    'LHVmin',
    'LHVmax',
    'NHVmin',
    'NHVmax',
    'LKmaxV',
    'KmaxV',
    'LpribVcorn',
    'SpribVcorn',
    'LVfront',
    'SVfront',
    'SV',
    'SVO',
    'SOcutV',
    'PribRVz',
    'PribRV1s',
    'PribRV2s',
    'PribRV3s',
    'RowPribRVz',
    'RowPribRV1',
    'RowPribRV2',
    'RowPribRV3',
    'isV',
    'isPlusOneV',
    'pairsWithIsV',
    'pairsWithIsPlusOneV',
    'rowsWithIsV',
    'rowsWithIsPlusOneV',
    'krV',
    'positionsWithIsV',
    'positionsWithIsPlusOneV',
    'resultStringV',
    'depthNeckV',
  ] as const;

  const vNeckShaping: Record<string, unknown> = {};
  for (const key of vNeckShapingKeys) {
    if (v1[key] !== undefined) {
      vNeckShaping[key] = v1[key];
    }
  }

  const measurementKeys = [
    'headCircumference',
    'neckCircumference',
    'chestCircumference',
    'stitchDensity',
    'rowDensity',
    'fitType',
  ] as const;

  const measurements = {} as IntroStateV2RaglanSnapshot['measurements'];
  for (const key of measurementKeys) {
    measurements[key] = String(v1[key] ?? '');
  }

  const metaKeys = [
    'styleChosen',
    'projectName',
    'introFinished',
    'usesSampleMeasurements',
    'hasCustomMeasurements',
    'chartHighlightedRows',
    'chartStoppedRows',
    'chartStoppedStitches',
    'lastChartStoppedId',
    'lastChartStoppedRow',
    'lastChartStoppedStitches',
    'necklineStyle',
    'ribbingWidth',
    'ribbingWidthV',
    'raglanLineWidth',
    'raglanLineWidthV',
    'fitType',
    'garmentFitFor',
    'fit',
    'SFit',
    'SOgr',
    'stitches',
  ] as const;

  const meta: Record<string, unknown> = { style: v1.style ?? '' };
  for (const key of metaKeys) {
    if (v1[key] !== undefined) {
      meta[key] = v1[key];
    }
  }

  return {
    schemaVersion: 2,
    measurements,
    style: String(v1.style ?? ''),
    regular,
    vNeck,
    vNeckShaping,
    meta,
  };
}

/** Detect whether a blob is already v2 (reference shape). */
export function isIntroStateV2Snapshot(
  state: Record<string, unknown>,
): state is IntroStateV2RaglanSnapshot {
  return state.schemaVersion === 2 && typeof state.regular === 'object';
}

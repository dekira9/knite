/** Fields written to AsyncStorage `introState`. Add new persisted fields here only. */
export const INTRO_STATE_PERSISTED_KEYS = [
  'styleChosen',
  'style',
  'headCircumference',
  'neckCircumference',
  'chestCircumference',
  'stitchDensity',
  'rowDensity',
  'fitType',
  'Sgor',
  'SgorV',
  'NRrez',
  'NRrezV',
  'LFrontO',
  'LFrontV',
  'SFrontO',
  'SFrontV',
  'Sa',
  'SaV',
  'K',
  'KV',
  'SKfront',
  'SKfrontV',
  'SKa',
  'SKaV',
  'NHFront',
  'NHFrontV',
  'NRostok',
  'NRostokV',
  'SFrontOGr',
  'SFrontOGrV',
  'SPodr',
  'SPodrV',
  'Sfx',
  'SfxV',
  'prib_1x1',
  'prib_1x1V',
  'prib_1x2',
  'prib_1x2V',
  'prib_1x3',
  'prib_1x3V',
  'PR_1x4',
  'PR_1x4V',
  'PR_1x2',
  'PR_1x2V',
  'PRib_1x4',
  'PRib_1x4V',
  'PRib_1x3',
  'PRib_1x3V',
  'prib_1x1_f',
  'prib_1x1_fV',
  'prib_1x2_f',
  'prib_1x2_fV',
  'prib_1x3_f',
  'prib_1x3_fV',
  'PR_1x4_f',
  'PR_1x4_fV',
  'PR_1x2_f',
  'PR_1x2_fV',
  'PRib_1x4_f',
  'PRib_1x4_fV',
  'PRib_1x3_f',
  'PRib_1x3_fV',
  'usedIncreaseType',
  'usedIncreaseTypeV',
  'usedIncreaseTypeString',
  'usedIncreaseTypeStringV',
  'fit',
  'SFit',
  'SOgr',
  'SRostok',
  'SRostokV',
  'stitches',
  'ribbingWidth',
  'raglanLineWidth',
  'raglanLineWidthV',
  'depthNeckV',
  'ribbingWidthV',
  'RowPrib1x4',
  'RowPrib1x4V',
  'RowPrib1x3',
  'RowPrib1x3V',
  'RowPrib1x4String',
  'RowPrib1x4StringV',
  'RowPrib1x3String',
  'RowPrib1x3StringV',
  'RowPrib1x2',
  'RowPrib1x2V',
  'RowPrib1x2String',
  'RowPrib1x2StringV',
  'RowPrib1x1',
  'RowPrib1x1V',
  'RowPrib1x1String',
  'RowPrib1x1StringV',
  'resultString21V',
  'resultString23V',
  'resultString24V',
  'resultString43V',
  'resultStringV',
  'Ls',
  'LsV',
  'hs',
  'hsV',
  'NRfx',
  'NRfxV',
  'SV',
  'SVfront',
  'SVO',
  'LHV',
  'LKmaxV',
  'KmaxV',
  'LHVmin',
  'LHVmax',
  'NHVmax',
  'NHVmin',
  'NHV',
  'LVfront',
  'necklineStyle',
  'SOcutV',
  'LpribVcorn',
  'SpribVcorn',
  'PribRVz',
  'PribRV1s',
  'PribRV2s',
  'PribRV3s',
  'RowPribRV1',
  'RowPribRVz',
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
  'introFinished',
  'usesSampleMeasurements',
  'hasCustomMeasurements',
  'chartHighlightedRows',
] as const;

export type IntroStatePersistedKey = (typeof INTRO_STATE_PERSISTED_KEYS)[number];

export function pickPersistedIntroState(self: Record<string, unknown>): Record<string, unknown> {
  const state: Record<string, unknown> = {};
  for (const key of INTRO_STATE_PERSISTED_KEYS) {
    state[key] = self[key];
  }
  return state;
}

export function applyPersistedIntroState(
  self: Record<string, unknown>,
  state: Record<string, unknown>,
): void {
  for (const key of INTRO_STATE_PERSISTED_KEYS) {
    if (key === 'SRostok') {
      self.SRostok =
        state.SRostok ??
        (Number(state.SFrontO) + 2 * Number(state.Sfx) + 2 * Number(state.SKfront));
      continue;
    }
    if (key === 'SRostokV') {
      self.SRostokV =
        state.SRostokV ??
        (Number(state.SFrontV) + 2 * Number(state.SfxV) + 2 * Number(state.SKfrontV));
      continue;
    }
    if (key === 'positionsWithIsV' || key === 'positionsWithIsPlusOneV') {
      self[key] = state[key] ?? [];
      continue;
    }
    if (state[key] !== undefined) {
      self[key] = state[key];
    }
  }

  self.usesSampleMeasurements = state.usesSampleMeasurements ?? false;
  if (state.hasCustomMeasurements === true) {
    self.hasCustomMeasurements = true;
    self.usesSampleMeasurements = false;
  } else if (state.introFinished === true && state.hasCustomMeasurements === undefined) {
    self.hasCustomMeasurements = true;
    self.usesSampleMeasurements = false;
  } else {
    self.hasCustomMeasurements = state.hasCustomMeasurements ?? false;
  }
}

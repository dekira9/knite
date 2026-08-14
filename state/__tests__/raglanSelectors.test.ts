import {
  IncreaseScheme,
  INCREASE_SCHEME_LABEL,
  pickActiveRaglanVariant,
  pickRaglanField,
  pickRaglanVariant,
  pickRaglanVNeckShaping,
  legacyKeyForVariantField,
} from '@/state/raglanSelectors';
import {
  canonicalToLegacyKey,
  legacyKeyToCanonical,
  migrateIntroStateV1toV2,
  isIntroStateV2Snapshot,
} from '@/state/introStateMigration';

const sampleV1: Record<string, unknown> = {
  style: 'regular',
  Sgor: 120,
  SgorV: 118,
  NRrez: 64,
  NRrezV: 62,
  SFrontO: 30,
  SFrontV: 28,
  Sa: 20,
  SaV: 19,
  K: 4,
  KV: 3,
  Sfx: 12,
  SfxV: 11,
  NHFront: 80,
  NHFrontV: 78,
  usedIncreaseType: ['1x2, 1x4'],
  usedIncreaseTypeV: ['1x2, 1x3'],
  LHV: 5,
  NHV: 40,
  SpribVcorn: 6,
  resultString24V: '1, 3, 5',
};

describe('raglanSelectors', () => {
  it('maps legacy keys for regular and v-neck', () => {
    expect(legacyKeyForVariantField('neckCastOnStitches', 'regular')).toBe('Sgor');
    expect(legacyKeyForVariantField('neckCastOnStitches', 'v-neck')).toBe('SgorV');
  });

  it('pickRaglanField reads paired values', () => {
    expect(pickRaglanField(sampleV1, 'neckCastOnStitches', 'regular')).toBe(120);
    expect(pickRaglanField(sampleV1, 'neckCastOnStitches', 'v-neck')).toBe(118);
    expect(pickRaglanField(sampleV1, 'usedIncreaseTypes', 'regular')).toEqual(['1x2, 1x4']);
  });

  it('pickRaglanVariant returns canonical English names', () => {
    const regular = pickRaglanVariant(sampleV1, 'regular');
    expect(regular.neckCastOnStitches).toBe(120);
    expect(regular.raglanIncreaseStitches).toBe(12);
    expect(regular.rowsToUnderarm).toBe(80);

    const vNeck = pickRaglanVariant(sampleV1, 'v-neck');
    expect(vNeck.frontNeckStitches).toBe(28);
    expect(vNeck.combinedIncreaseRows[IncreaseScheme.OneX2_OneX4]).toBe('1, 3, 5');
  });

  it('pickActiveRaglanVariant follows style field', () => {
    expect(pickActiveRaglanVariant(sampleV1).neckCastOnStitches).toBe(120);
    expect(pickActiveRaglanVariant({ ...sampleV1, style: 'v-neck' }).neckCastOnStitches).toBe(
      118,
    );
  });

  it('pickRaglanVNeckShaping reads v-neck-only fields', () => {
    const shaping = pickRaglanVNeckShaping(sampleV1);
    expect(shaping.neckDepthCm).toBe(5);
    expect(shaping.cornerIncreaseStitches).toBe(6);
  });

  it('INCREASE_SCHEME_LABEL matches usedIncreaseType strings', () => {
    expect(INCREASE_SCHEME_LABEL[IncreaseScheme.OneX2_OneX4]).toBe('1x2, 1x4');
  });
});

describe('introStateMigration', () => {
  it('legacyKeyToCanonical resolves variant pairs', () => {
    expect(legacyKeyToCanonical('Sgor')).toBe('neckCastOnStitches');
    expect(legacyKeyToCanonical('SgorV')).toBe('neckCastOnStitches');
    expect(legacyKeyToCanonical('fit')).toBeNull();
  });

  it('canonicalToLegacyKey round-trips', () => {
    expect(canonicalToLegacyKey('raglanIncreaseStitches', 'regular')).toBe('Sfx');
    expect(canonicalToLegacyKey('raglanIncreaseStitches', 'vNeck')).toBe('SfxV');
  });

  it('migrateIntroStateV1toV2 nests variant fields', () => {
    const v2 = migrateIntroStateV1toV2(sampleV1);
    expect(v2.schemaVersion).toBe(2);
    expect(v2.regular.neckCastOnStitches).toBe(120);
    expect(v2.vNeck.neckCastOnStitches).toBe(118);
    expect(v2.vNeckShaping.LHV).toBe(5);
    expect(isIntroStateV2Snapshot(v2)).toBe(true);
  });

  it('isIntroStateV2Snapshot rejects flat v1', () => {
    expect(isIntroStateV2Snapshot(sampleV1)).toBe(false);
  });
});

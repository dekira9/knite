import { computeBodyBlock, computeFitCm } from './fit';
import { parseRaglanInput } from './parseInput';
import { computeStyleVariant } from './styleVariant';
import type { RaglanInput, RaglanOutput } from './types';
import { computeVNeck } from './vNeck';

export function calculateRaglan(input: RaglanInput): RaglanOutput | string {
  const parsed = parseRaglanInput(input);
  if (typeof parsed === 'string') {
    return parsed;
  }

  const { head, neck, chest, stitches, rows, ribbing, ribbingV, K, KV } = parsed;
  const fit = computeFitCm(input.fitType, stitches);
  const { SFit, SOgr, SPodr } = computeBodyBlock(chest, fit, stitches);

  const sharedVariantParams = {
    head,
    neck,
    chest,
    stitches,
    rows,
    fit,
    SFit,
    SOgr,
    SPodr,
  };

  const regular = computeStyleVariant({
    ...sharedVariantParams,
    Hrez: ribbing,
    K,
  });

  const vNeck = computeStyleVariant({
    ...sharedVariantParams,
    Hrez: ribbingV,
    K: KV,
    evenRibbingRows: true,
  });

  const NRostok = Math.round(((neck / 6 - 1) * rows) / 2) * 2;
  const vNeckExtras = computeVNeck({
    depthNeckV: input.depthNeckV,
    stitches,
    rows,
    HrezV: ribbingV,
    SgorRegular: regular.Sgor,
    vNeck,
  });

  const LsV = 1 / stitches;
  const hsV = 1 / rows;

  return {
    Sgor: regular.Sgor,
    SgorV: vNeck.Sgor,
    NRrez: regular.NRrez,
    NRrezV: vNeck.NRrez,
    SFrontO: regular.SFront,
    SFrontV: vNeck.SFront,
    Sa: regular.Sa,
    SaV: vNeck.Sa,
    K,
    KV,
    LFrontO: regular.LFront,
    LFrontV: vNeck.LFront,
    SKfront: regular.SKfront,
    SKfrontV: vNeck.SKfront,
    SKa: regular.SKa,
    SKaV: vNeck.SKa,
    NHFront: regular.NHFront,
    NHFrontV: vNeck.NHFront,
    NRostok,
    SFrontOGr: regular.SFrontGr,
    SFrontOGrV: vNeck.SFrontGr,
    SPodr,
    SPodrV: SPodr,
    Sfx: regular.Sfx,
    SfxV: vNeck.Sfx,
    prib_1x1: regular.prib_1x1,
    prib_1x1V: vNeck.prib_1x1,
    prib_1x2: regular.prib_1x2,
    prib_1x2V: vNeck.prib_1x2,
    prib_1x3: regular.prib_1x3,
    prib_1x3V: vNeck.prib_1x3,
    PR_1x4: regular.PR_1x4,
    PR_1x4V: vNeck.PR_1x4,
    PR_1x2: regular.PR_1x2,
    PR_1x2V: vNeck.PR_1x2,
    PRib_1x4: regular.PRib_1x4,
    PRib_1x4V: vNeck.PRib_1x4,
    PRib_1x3: regular.PRib_1x3,
    PRib_1x3V: vNeck.PRib_1x3,
    prib_1x1_f: regular.prib_1x1_f,
    prib_1x1_fV: vNeck.prib_1x1_f,
    prib_1x2_f: regular.prib_1x2_f,
    prib_1x2_fV: vNeck.prib_1x2_f,
    prib_1x3_f: regular.prib_1x3_f,
    prib_1x3_fV: vNeck.prib_1x3_f,
    PR_1x4_f: regular.PR_1x4_f,
    PR_1x4_fV: vNeck.PR_1x4_f,
    PR_1x2_f: regular.PR_1x2_f,
    PR_1x2_fV: vNeck.PR_1x2_f,
    PRib_1x4_f: regular.PRib_1x4_f,
    PRib_1x4_fV: vNeck.PRib_1x4_f,
    PRib_1x3_f: regular.PRib_1x3_f,
    PRib_1x3_fV: vNeck.PRib_1x3_f,
    RowPrib1x4: regular.rowPrib.RowPrib1x4,
    RowPrib1x4V: vNeck.rowPrib.RowPrib1x4,
    RowPrib1x4String: regular.rowPrib.RowPrib1x4String,
    RowPrib1x4StringV: vNeck.rowPrib.RowPrib1x4String,
    RowPrib1x3: regular.rowPrib.RowPrib1x3,
    RowPrib1x3V: vNeck.rowPrib.RowPrib1x3,
    RowPrib1x3String: regular.rowPrib.RowPrib1x3String,
    RowPrib1x3StringV: vNeck.rowPrib.RowPrib1x3String,
    RowPrib1x2: regular.rowPrib.RowPrib1x2,
    RowPrib1x2V: vNeck.rowPrib.RowPrib1x2,
    RowPrib1x2String: regular.rowPrib.RowPrib1x2String,
    RowPrib1x2StringV: vNeck.rowPrib.RowPrib1x2String,
    RowPrib1x1: regular.rowPrib.RowPrib1x1,
    RowPrib1x1V: vNeck.rowPrib.RowPrib1x1,
    RowPrib1x1String: regular.rowPrib.RowPrib1x1String,
    RowPrib1x1StringV: vNeck.rowPrib.RowPrib1x1String,
    resultString21V: '',
    resultString23V: '',
    resultString24V: '',
    resultString43V: '',
    usedIncreaseType: regular.usedIncreaseType,
    usedIncreaseTypeString: regular.usedIncreaseTypeString,
    usedIncreaseTypeV: vNeck.usedIncreaseType,
    usedIncreaseTypeStringV: vNeck.usedIncreaseTypeString,
    fit,
    SFit,
    SOgr,
    SRostok: regular.SRostok,
    SRostokV: vNeck.SRostok,
    stitches,
    ...vNeckExtras,
    NRfx: regular.NRfx,
    NRfxV: vNeck.NRfx,
    hsV,
    LsV,
  };
}

import type { RaglanOutput } from '@/utils/calculateRaglan';
import {
  calculateIncreaseRows1x2_1x4V,
  calculateIncreaseRows1x2_1x3V,
  calculateIncreaseRows1x2_1x1V,
  calculateIncreaseRows1x4_1x3V,
  calculateVNeckIncreases01,
  calculateVNeckIncreases11,
  calculateVNeckIncreases12,
  calculateVNeckIncreases22,
  calculateVNeckIncreases23,
} from './helpers';

type CollarInputs = {
  NRrezV: number;
  SpribVcorn: number;
  RowPribRV1: number;
  RowPribRVz: number;
  RowPribRV2: number;
  RowPribRV3: number;
};

function computeCollarStrings({
  NRrezV,
  SpribVcorn,
  RowPribRV1,
  RowPribRVz,
  RowPribRV2,
  RowPribRV3,
}: CollarInputs) {
  const collarReady = NRrezV > 0 && SpribVcorn > 0;
  const spribRatio = collarReady ? Math.floor(SpribVcorn / NRrezV) : -1;

  return {
    resultStringV01:
      collarReady && spribRatio === 0
        ? calculateVNeckIncreases01(NRrezV, SpribVcorn, RowPribRV1, RowPribRVz).resultStringV01
        : '',
    resultStringV11:
      collarReady && SpribVcorn === NRrezV
        ? calculateVNeckIncreases11(NRrezV, RowPribRV1, SpribVcorn).resultStringV11
        : '',
    resultStringV12:
      collarReady && spribRatio === 1 && SpribVcorn > NRrezV && RowPribRV1 > 0
        ? calculateVNeckIncreases12(NRrezV, RowPribRV1, RowPribRV2, SpribVcorn).resultStringV12
        : '',
    resultStringV22:
      collarReady && SpribVcorn === 2 * NRrezV
        ? calculateVNeckIncreases22(NRrezV, RowPribRV2, SpribVcorn).resultStringV22
        : '',
    resultStringV23:
      collarReady && spribRatio === 2 && SpribVcorn > 2 * NRrezV && RowPribRV2 > 0
        ? calculateVNeckIncreases23(NRrezV, RowPribRV2, RowPribRV3).resultStringV23
        : '',
  };
}

function buildRowPribStrings(sfx: number) {
  const length = sfx || 0;
  const toString = (step: number) =>
    Array.from({ length }, (_, index) => 1 + index * step).join(', ');

  return {
    RowPrib1x4StringV: toString(4),
    RowPrib1x3StringV: toString(3),
    RowPrib1x2StringV: toString(2),
    RowPrib1x1StringV: toString(1),
  };
}

/** Precomputes collar + raglan increase strings for the v-neck result wizard. */
export function computeVNeckIncreasePrecompute(results: RaglanOutput, collar: CollarInputs) {
  const collarStrings = computeCollarStrings(collar);

  const { resultString24V } = calculateIncreaseRows1x2_1x4V(
    results.NHFrontV,
    results.SfxV,
    results.PR_1x4_fV,
    results.PR_1x2_fV,
  );
  const { resultString23V } = calculateIncreaseRows1x2_1x3V(
    results.NHFrontV,
    results.SfxV,
    results.prib_1x3_fV,
    results.prib_1x2_fV,
  );
  const { resultString21V } = calculateIncreaseRows1x2_1x1V(
    results.NHFrontV,
    results.SfxV,
    results.prib_1x1_fV,
    results.prib_1x2_fV,
  );
  const { resultString43V } = calculateIncreaseRows1x4_1x3V(
    results.NHFrontV,
    results.SfxV,
    results.PRib_1x4_fV,
    results.PRib_1x3_fV,
  );

  return {
    ...collarStrings,
    resultString24V,
    resultString23V,
    resultString21V,
    resultString43V,
    ...buildRowPribStrings(results.SfxV),
  };
}

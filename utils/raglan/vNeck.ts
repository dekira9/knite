import type { StyleVariantResult } from './styleVariant';

export interface VNeckParams {
  depthNeckV: number | undefined;
  stitches: number;
  rows: number;
  HrezV: number;
  SgorRegular: number;
  vNeck: StyleVariantResult;
}

export interface VNeckResult {
  NHVmax: number;
  LHVmax: number;
  LKmaxV: number;
  KmaxV: number;
  LHVmin: number;
  NHVmin: number;
  LHV: number;
  NHV: number;
  LpribVcorn: number;
  SpribVcorn: number;
  LVfront: number;
  SVfront: number;
  SV: number;
  SVO: number;
  SOcutV: number;
  PribRVz: number;
  PribRV1s: number;
  PribRV2s: number;
  PribRV3s: number;
  RowPribRVz: number;
  RowPribRV1: number;
  RowPribRV2: number;
  RowPribRV3: number;
  isV: number;
  isPlusOneV: number;
  pairsWithIsV: number;
  pairsWithIsPlusOneV: number;
  rowsWithIsV: number;
  rowsWithIsPlusOneV: number;
  krV: number;
  positionsWithIsV: number[];
  positionsWithIsPlusOneV: number[];
  resultStringV: string;
}

export function computeVNeck(params: VNeckParams): VNeckResult {
  const { depthNeckV, stitches, rows, HrezV, SgorRegular, vNeck } = params;
  const { LFront: LFrontV, NHFront: NHFrontV, Sgor: SgorV, SFront: SFrontV, NRrez: NRrezV } =
    vNeck;

  const LHVmin = (2 * HrezV * LFrontV ** 2) / (LFrontV ** 2 - 4 * HrezV ** 2);
  const NHVmin = Math.round((LHVmin * rows) / 2) * 2;
  const NHVmax = NHFrontV - 2;
  const LHVmax = NHVmax / rows;

  const LgorV = vNeck.Lgor;
  const LKmaxV =
    (LgorV -
      Math.sqrt(
        ((256 * (NHFrontV - 2)) / rows) *
          (HrezV ** 2) /
          ((9 * (NHFrontV - 2)) / rows - 18 * HrezV)
      )) /
    4;

  let KmaxV: number;
  if (LKmaxV * stitches < 1) {
    KmaxV = 1;
  } else if (LKmaxV * stitches > SgorRegular / 8) {
    KmaxV = Math.floor(SgorRegular / 8);
  } else {
    KmaxV = Math.floor(LKmaxV * stitches);
  }

  const LHV = depthNeckV !== undefined ? depthNeckV : LHVmin;
  const NHV = Math.round((LHV * rows) / 2) * 2;

  const LpribVcorn = (LHV * HrezV) / (LFrontV / 2);
  const SpribVcorn = Math.round((LpribVcorn * stitches) / 2) * 2;
  const LVfront = Math.sqrt((LFrontV / 2) ** 2 + LHV ** 2);
  const SVfront = Math.round(LVfront * stitches / 2) * 2;
  const SV = SVfront - SpribVcorn;
  const SVO = SV * 2;
  const SOcutV = SgorV - SFrontV + SVO;

  const PribRVz = NRrezV > SpribVcorn ? NRrezV - SpribVcorn : 0;
  const PribRV3s =
    Math.floor(SpribVcorn / NRrezV) === 2 ? 3 * (SpribVcorn - 2 * NRrezV) : 0;
  const PribRV2s =
    Math.floor(SpribVcorn / NRrezV) === 1
      ? 2 * (SpribVcorn - NRrezV)
      : Math.floor(SpribVcorn / NRrezV) === 2
        ? SpribVcorn - PribRV3s
        : 0;
  const PribRV1s = NRrezV > SpribVcorn ? NRrezV - PribRVz : SpribVcorn - PribRV2s;
  const RowPribRVz = PribRVz;
  const RowPribRV3 = PribRV3s / 3;
  const RowPribRV2 =
    Math.floor(SpribVcorn / NRrezV) === 1
      ? PribRV2s / 2
      : Math.floor(SpribVcorn / NRrezV) === 2
        ? NRrezV - RowPribRV3
        : 0;
  const RowPribRV1 = NRrezV - RowPribRVz - RowPribRV2;

  const isV = Math.floor(SVfront / (NHV / 2));
  const isPlusOneV = isV + 1;
  const pairsWithIsPlusOneV = SVfront - (isV * NHV) / 2;
  const rowsWithIsPlusOneV = 2 * pairsWithIsPlusOneV;
  const stitchesWithIsPlusOneV = isPlusOneV * pairsWithIsPlusOneV;
  const pairsWithIsV = (SVfront - stitchesWithIsPlusOneV) / isV;
  const rowsWithIsV = 2 * pairsWithIsV;
  const krV = NHV / 2 / pairsWithIsV;

  const positionsWithIsV = Array.from({ length: pairsWithIsV }, (_, i) =>
    Math.floor(krV * (i + 1))
  );
  const positionsWithIsPlusOneV = Array.from({ length: NHV / 2 }, (_, i) => i + 1).filter(
    (pos) => !positionsWithIsV.includes(pos)
  );

  const resultArrayV = Array.from({ length: NHV / 2 }, (_, i) => {
    const position = i + 1;
    return positionsWithIsV.includes(position) ? isV : isPlusOneV;
  });
  const resultStringV = resultArrayV.join(', ');

  return {
    NHVmax,
    LHVmax,
    LKmaxV,
    KmaxV,
    LHVmin,
    NHVmin,
    LHV,
    NHV,
    LpribVcorn,
    SpribVcorn,
    LVfront,
    SVfront,
    SV,
    SVO,
    SOcutV,
    PribRVz,
    PribRV1s,
    PribRV2s,
    PribRV3s,
    RowPribRVz,
    RowPribRV1,
    RowPribRV2,
    RowPribRV3,
    isV,
    isPlusOneV,
    pairsWithIsV,
    pairsWithIsPlusOneV,
    rowsWithIsV,
    rowsWithIsPlusOneV,
    krV,
    positionsWithIsV,
    positionsWithIsPlusOneV,
    resultStringV,
  };
}

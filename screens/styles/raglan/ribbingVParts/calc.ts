// V-neck ribbing chart: angles, transforms, and stop-row stitch math.
import introState from '@/state/introState';
import { computeStitchMetrics } from '@/utils/stitchMetrics';
import type { RibbingVIncreaseInput } from '../ribbingVCollarGrid';
import { computeRibbingVCellCounts } from '../ribbingVCollarGrid';

export const { heightPer25RowsCm: Hc, widthPer25StitchesCm: Lc } = computeStitchMetrics(
  introState.stitchDensity,
  introState.rowDensity,
);

export type RibbingVCollarIncreaseInput = RibbingVIncreaseInput & { sv: number };

export function buildCollarIncreaseInput(fields: {
  NRrezV: number;
  SpribVcorn: number;
  RowPribRV1: number;
  RowPribRV2: number;
  RowPribRV3: number;
  RowPribRVz: number;
  SV: number;
}): RibbingVCollarIncreaseInput {
  return {
    nrRezV: fields.NRrezV,
    spribVcorn: fields.SpribVcorn,
    rowPribRV1: fields.RowPribRV1,
    rowPribRV2: fields.RowPribRV2,
    rowPribRV3: fields.RowPribRV3,
    rowPribRVz: fields.RowPribRVz,
    sv: fields.SV,
  };
}

export function computeVNeckRibbingAngleRadians(SFrontV: number, LsV: number, SVfront: number): number {
  return Math.acos((SFrontV * LsV) / 2 / ((SVfront + 1) * LsV));
}

export function computeVNeckRibbingAngleDegrees(angleInRadians: number): number {
  return angleInRadians * (180 / Math.PI) + 3;
}

export function buildLeftSleeveTransform(KV: number, angleInRadians: number) {
  return [
    { translateY: -(KV * Lc) * Math.sin(angleInRadians) },
    { translateX: KV * Lc - KV * Lc * Math.cos(angleInRadians) },
    { rotate: '90deg' },
  ];
}

export function buildRightSleeveTransform(KV: number, angleInRadians: number) {
  return [
    { translateY: -KV * Lc * Math.sin(angleInRadians) },
    { translateX: -(KV * Lc - KV * Lc * Math.cos(angleInRadians)) },
    { rotate: '-90deg' },
  ];
}

export function buildLine3Transform(NRrezV: number, KV: number, angleInDegrees: number) {
  return [
    { translateY: (NRrezV + 1) * Hc },
    { translateX: KV * Lc },
    { rotate: `-${180 + angleInDegrees}deg` },
  ];
}

export function buildLine4Transform(NRrezV: number, KV: number, angleInDegrees: number) {
  return [
    { translateY: (NRrezV + 1) * Hc },
    { translateX: -KV * Lc },
    { rotate: `${180 + angleInDegrees}deg` },
  ];
}

export function computeStopStitchCount(
  KV: number,
  SFrontV: number,
  SaV: number,
  highlightedRow: number,
  collarIncreaseInput: RibbingVCollarIncreaseInput,
): number {
  const currentRowStitches = computeRibbingVCellCounts(highlightedRow, collarIncreaseInput);
  return (
    KV * 4 +
    SFrontV +
    2 * SaV +
    2 * (typeof currentRowStitches === 'number' ? currentRowStitches : 0)
  );
}

/** Displayed 1-based row; cast-on highlight (-1) maps to row 1 for stop bookmarks. */
export function computeStopRowNumber(highlightedRow: number): number {
  return highlightedRow < 0 ? 1 : highlightedRow + 1;
}

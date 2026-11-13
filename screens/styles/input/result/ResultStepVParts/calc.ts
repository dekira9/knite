// Pure stitch totals and length formatting for ResultStepV.

import { formatResultLength } from '../formatResultLength';
import { stitchesFromBack } from '../stitchesFromBack';

export interface ResultStepVMetrics {
  corpusTotal: number;
  corpusLength: ReturnType<typeof formatResultLength>;
  fromBackStitches: number;
  sleeveTotal: number;
  sleeveLength: ReturnType<typeof formatResultLength>;
  stitchesPerCm: number;
}

export function computeResultStepVMetrics(
  results: {
    SRostok: number;
    SPodr: number;
    SaV: number;
    SfxV: number;
    SKaV: number;
    NRostok: number;
  },
  stitchDensity: string,
  rowDensity: string,
): ResultStepVMetrics {
  const corpusTotal = results.SRostok * 2 + results.SPodr * 2;
  const stitchesPerCm =
    parseFloat(String(stitchDensity).replace(',', '.')) / 10;
  const corpusLength = formatResultLength(corpusTotal, stitchesPerCm);
  const fromBackStitches = stitchesFromBack(
    results.NRostok,
    stitchDensity,
    rowDensity,
  );
  const sleeveTotal =
    results.SaV +
    2 * results.SfxV +
    2 * results.SKaV +
    results.SPodr +
    fromBackStitches;
  const sleeveLength = formatResultLength(sleeveTotal, stitchesPerCm);

  return {
    corpusTotal,
    corpusLength,
    fromBackStitches,
    sleeveTotal,
    sleeveLength,
    stitchesPerCm,
  };
}

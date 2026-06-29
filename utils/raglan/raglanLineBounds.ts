import { calculateRaglan } from './calculateRaglanCore';
import { computeSgorFromMeasurements } from './neckCastOn';
import type { RaglanInput } from './types';

export type VNeckSliderInput = Pick<
  RaglanInput,
  | 'headCircumference'
  | 'neckCircumference'
  | 'chestCircumference'
  | 'stitchDensity'
  | 'rowDensity'
  | 'fitType'
  | 'ribbingWidth'
  | 'ribbingWidthV'
  | 'raglanLineWidth'
  | 'raglanLineWidthV'
  | 'depthNeckV'
>;

export interface RegularRaglanLineSliderInput {
  headCircumference: string;
  neckCircumference: string;
  stitchDensity: string;
  ribbingWidth: number | string;
}

/** Max raglan line width (stitches) for round-neck slider; matches legacy `(Sgor - 16) / 4`. */
export function computeRegularRaglanLineMax(sgor: number): number {
  return Math.max(1, Math.floor((sgor - 16) / 4));
}

export function computeRegularRaglanLineMaxFromMeasurements(
  input: RegularRaglanLineSliderInput
): number {
  const parsed = computeSgorFromMeasurements(input);
  if (!parsed) {
    return 5;
  }
  return computeRegularRaglanLineMax(parsed.sgor);
}

function runVNeckCalc(input: VNeckSliderInput) {
  return calculateRaglan(input);
}

/** V-neck neck depth slider bounds (cm, excluding ribbing height). */
export function computeVNeckDepthBoundsFromMeasurements(
  input: VNeckSliderInput
): { min: number; max: number } {
  const result = runVNeckCalc(input);
  if (typeof result === 'string') {
    return { min: 1, max: 5 };
  }
  return {
    min: parseFloat(result.LHVmin.toFixed(1)),
    max: parseFloat(result.LHVmax.toFixed(1)),
  };
}

/** Max v-neck raglan line width (stitches) for the input slider. */
export function computeVNeckRaglanLineMaxFromMeasurements(input: VNeckSliderInput): number {
  const result = runVNeckCalc(input);
  if (typeof result === 'string') {
    return 5;
  }
  return Math.max(1, Math.floor(result.KmaxV));
}

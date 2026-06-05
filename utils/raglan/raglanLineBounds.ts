import { computeSgorFromMeasurements } from './neckCastOn';

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

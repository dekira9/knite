import { parseNumericInput } from './parseInput';

export function computeLgor(head: number, neck: number, Hrez: number): number {
  const pi = Math.PI;
  const dr = (head - neck) / (2 * pi);
  return Hrez <= dr ? head - pi * Hrez : neck + pi * Hrez;
}

export function computeSgor(Lgor: number, stitches: number): number {
  return Math.round((Lgor * stitches) / 2) * 2;
}

export interface NeckCastOnInput {
  headCircumference: string;
  neckCircumference: string;
  stitchDensity: string;
  ribbingWidth: number | string;
}

export function computeSgorFromMeasurements(
  input: NeckCastOnInput
): { sgor: number; stitches: number } | null {
  const head = parseNumericInput(input.headCircumference);
  const neck = parseNumericInput(input.neckCircumference);
  const stitches = parseFloat(input.stitchDensity.replace(',', '.')) / 10;
  const Hrez = parseNumericInput(input.ribbingWidth);

  if (isNaN(head) || isNaN(neck) || isNaN(stitches)) {
    return null;
  }

  const Lgor = computeLgor(head, neck, Hrez);
  return { sgor: computeSgor(Lgor, stitches), stitches };
}

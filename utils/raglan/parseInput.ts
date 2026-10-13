import type { RaglanInput, ParsedRaglanNumbers } from './types';

export function parseNumericInput(value: number | string): number {
  if (typeof value === 'number') {
    return value;
  }
  return parseFloat(value.replace(',', '.'));
}

export function parseRaglanInput(input: RaglanInput): ParsedRaglanNumbers | string {
  const head = parseNumericInput(input.headCircumference);
  const neck = parseNumericInput(input.neckCircumference);
  const chest = parseNumericInput(input.chestCircumference);
  const stitches = parseFloat(input.stitchDensity.replace(',', '.')) / 10;
  const rows = parseFloat(input.rowDensity.replace(',', '.')) / 10;
  const ribbing = parseNumericInput(input.ribbingWidth);
  const ribbingV = parseNumericInput(input.ribbingWidthV);

  if (isNaN(head) || isNaN(neck) || isNaN(chest) || isNaN(stitches) || isNaN(rows)) {
    return 'Please enter all values correctly.';
  }

  const K = input.raglanLineWidth ?? 0;
  const KV = input.raglanLineWidthV !== undefined ? input.raglanLineWidthV : 2;

  return { head, neck, chest, stitches, rows, ribbing, ribbingV, K, KV };
}

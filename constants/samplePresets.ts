/** Example measurements (~women's M, metric) for first-time preview. */
export const SAMPLE_MEASUREMENTS = {
  headCircumference: '58',
  neckCircumference: '36',
  chestCircumference: '92',
  stitchDensity: '24',
  rowDensity: '32',
  fitType: 'fitted',
  ribbingWidth: 2,
  ribbingWidthV: 2,
  raglanLineWidth: 2,
  raglanLineWidthV: 1,
  depthNeckV: 4,
} as const;

export type RaglanStyleId = 'regular' | 'v-neck';

export type StitchMetrics = {
  stitchesPerCm: number;
  rowsPerCm: number;
  loopWidthCm: number;
  loopHeightCm: number;
  heightPer25RowsCm: number;
  widthPer25StitchesCm: number;
};

export function computeStitchMetrics(stitchDensity: string, rowDensity: string): StitchMetrics {
  const stitchesPerCm = parseFloat(stitchDensity.replace(',', '.')) / 10;
  const rowsPerCm = parseFloat(rowDensity.replace(',', '.')) / 10;
  const loopWidthCm = 1 / stitchesPerCm;
  const loopHeightCm = 1 / rowsPerCm;

  return {
    stitchesPerCm,
    rowsPerCm,
    loopWidthCm,
    loopHeightCm,
    heightPer25RowsCm: loopHeightCm * 25,
    widthPer25StitchesCm: loopWidthCm * 25,
  };
}

/** Stitches cast on / created from the back at sleeve split. */
export function stitchesFromBack(
  nRostok: number,
  stitchDensity: string,
  rowDensity: string,
): number {
  const stitchesPerCm = parseFloat(String(stitchDensity).replace(',', '.')) / 10;
  const rowsPerCm = parseFloat(String(rowDensity).replace(',', '.')) / 10;
  if (!(rowsPerCm > 0) || !(stitchesPerCm > 0) || !(nRostok > 0)) {
    return 0;
  }
  return Math.round((nRostok / rowsPerCm) * stitchesPerCm);
}

export function computeFitCm(fitType: string, stitches: number): number {
  switch (fitType) {
    case 'semi-fitted':
      return Math.round(2 * stitches) / stitches;
    case 'loose':
      return Math.round(6 * stitches) / stitches;
    case 'oversized':
      return Math.round(10 * stitches) / stitches;
    default:
      return 0;
  }
}

export function computeBodyBlock(chest: number, fit: number, stitches: number) {
  const SFit = Math.round(fit * stitches / 2) * 2;
  const SOgr = Math.round(chest * stitches / 2) * 2;
  const SPodr = Math.round((SOgr * 0.08) / 2) * 2;
  return { fit, SFit, SOgr, SPodr };
}

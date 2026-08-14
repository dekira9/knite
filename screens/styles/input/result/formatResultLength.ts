import onboardingState from '@/state/onboardingState';
import i18n from '@/utils/translations';

const CM_PER_INCH = 2.54;

/** Circumference length from stitch count + gauge, in the user's measurement units. */
export function formatResultLength(
  stitchCount: number,
  stitchesPerCm: number,
): { value: number; unitLabel: string } | null {
  if (!(stitchesPerCm > 0)) {
    return null;
  }
  const lengthCm = stitchCount / stitchesPerCm;
  const isMetric = onboardingState.measurementSystem === 'metric';
  return {
    value: parseFloat((isMetric ? lengthCm : lengthCm / CM_PER_INCH).toFixed(1)),
    unitLabel: isMetric ? i18n.t('sm') : 'in',
  };
}

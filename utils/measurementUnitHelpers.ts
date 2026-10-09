export const CM_PER_INCH = 2.54;

export function cmToIn(cm: string): string {
  const val = parseFloat(cm.replace(',', '.'));
  if (isNaN(val)) return '';
  return (val / CM_PER_INCH).toFixed(1);
}

export function inToCm(inches: string): string {
  const val = parseFloat(inches.replace(',', '.'));
  if (isNaN(val)) return '';
  return (val * CM_PER_INCH).toFixed(1);
}

export function parseMeasurementString(value: string, fallback: number): number {
  const n = parseFloat(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : fallback;
}

export function buildNumericRange(min: number, max: number, step: number): number[] {
  const items: number[] = [];
  const steps = Math.round((max - min) / step);
  for (let i = 0; i <= steps; i++) {
    const v = min + i * step;
    items.push(Math.round(v * 1000) / 1000);
  }
  return items;
}

export function formatWheelValue(n: number, decimals: number): string {
  if (decimals <= 0) return String(Math.round(n));
  return n.toFixed(decimals);
}

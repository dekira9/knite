export const CM_PER_INCH = 2.54;

/** Digits + at most one decimal separator; at most 1 digit after it. Strips -, letters, 2nd dot, etc. */
export function sanitizeOneDecimalInput(raw: string): string {
  const normalized = raw.replace(',', '.');
  let out = '';
  let seenDot = false;
  let decimals = 0;
  for (const ch of normalized) {
    if (ch >= '0' && ch <= '9') {
      if (seenDot) {
        if (decimals >= 1) continue;
        decimals += 1;
      }
      out += ch;
    } else if (ch === '.' && !seenDot) {
      seenDot = true;
      out += ch;
    }
  }
  return out;
}

export function isPositiveMeasurement(value: string): boolean {
  if (!value || value === '.') return false;
  const n = parseFloat(String(value).replace(',', '.'));
  return Number.isFinite(n) && n > 0;
}

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

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { calculateRaglan } from '../utils/calculateRaglan.ts';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const goldenPath = join(repoRoot, 'utils/raglan/__tests__/goldenSample.json');
const golden = JSON.parse(readFileSync(goldenPath, 'utf8'));

const input = {
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
};

const result = calculateRaglan(input);
if (typeof result === 'string') {
  console.error('validation failed:', result);
  process.exit(1);
}

const keys = Object.keys(golden).sort();
let diff = 0;
for (const k of keys) {
  if (JSON.stringify(result[k as keyof typeof result]) !== JSON.stringify(golden[k])) {
    console.log('DIFF', k);
    diff++;
  }
}
console.log(diff === 0 ? 'IDENTICAL to goldenSample.json' : `${diff} field(s) differ`);
process.exit(diff === 0 ? 0 : 1);

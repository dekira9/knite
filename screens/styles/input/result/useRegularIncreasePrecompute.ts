import type { RaglanOutput } from '@/utils/calculateRaglan';
import {
  calculateIncreaseRows1x2_1x4,
  calculateIncreaseRows1x2_1x3,
  calculateIncreaseRows1x2_1x1,
  calculateIncreaseRows1x4_1x3,
} from './increaseRowsRegular';

/** Precomputes all four regular increase-row strings for the result wizard. */
export function computeRegularIncreasePrecompute(results: RaglanOutput) {
  const rows1x2_1x4 = calculateIncreaseRows1x2_1x4(
    results.NHFront,
    results.Sfx,
    results.PR_1x4_f,
    results.PR_1x2_f,
  );
  const rows1x2_1x3 = calculateIncreaseRows1x2_1x3(
    results.NHFront,
    results.Sfx,
    results.prib_1x3_f,
    results.prib_1x2_f,
  );
  const rows1x2_1x1 = calculateIncreaseRows1x2_1x1(
    results.NHFront,
    results.Sfx,
    results.prib_1x1_f,
    results.prib_1x2_f,
  );
  const rows1x4_1x3 = calculateIncreaseRows1x4_1x3(
    results.NHFront,
    results.Sfx,
    results.PRib_1x4_f,
    results.PRib_1x3_f,
  );

  return {
    resultString24: rows1x2_1x4.resultString24,
    resultString23: rows1x2_1x3.resultString23,
    resultString21: rows1x2_1x1.resultString21,
    resultString43: rows1x4_1x3.resultString43,
  };
}

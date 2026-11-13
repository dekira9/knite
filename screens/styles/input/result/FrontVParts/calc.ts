// Raglan / v-neck row stitch counts for FrontV calculation blocks.

import type { RaglanOutput } from '@/utils/calculateRaglan';
import {
  getIncreaseRowsFromType,
  type IncreaseRowStrings,
} from '@/screens/styles/raglan/increaseRowSelection';

export function isRaglanOutput(value: unknown): value is RaglanOutput {
  return value !== null && typeof value === 'object' && 'PR_1x2_fV' in value;
}

export function firstRowRaglanCreateDisplay(
  results: RaglanOutput,
  increaseStrings: IncreaseRowStrings,
): string {
  const selectedType = results.usedIncreaseTypeV?.[0] || '';
  const increaseRows = getIncreaseRowsFromType(selectedType, increaseStrings, {
    nullable: true,
  });
  const firstRowIncreaseCount = increaseRows.filter(
    (rowNum) => rowNum === 1,
  ).length;
  return firstRowIncreaseCount > 0 ? '1' : '0';
}

export function firstPairCollarStitchesDisplay(results: RaglanOutput): number {
  const vNeckIncreaseRows = results.resultStringV
    ? results.resultStringV.split(', ').map(Number)
    : [];
  const firstPairAdditionalCells =
    1 <= results.NHV / 2 && vNeckIncreaseRows.length > 0
      ? vNeckIncreaseRows[0] || 0
      : 0;
  return firstPairAdditionalCells;
}

export function row2PinkStitchesSum(
  results: RaglanOutput,
  increaseStrings: IncreaseRowStrings,
): number {
  const selectedType = results.usedIncreaseTypeV?.[0] || '';
  const raglanIncreaseRows = getIncreaseRowsFromType(
    selectedType,
    increaseStrings,
    {
      nullable: true,
    },
  );
  const raglanFirstRowIncrease =
    raglanIncreaseRows.filter((rowNum) => rowNum === 1).length > 0 ? 1 : 0;

  const vNeckIncreaseRows = results.resultStringV
    ? results.resultStringV.split(', ').map(Number)
    : [];
  const vNeckFirstRowYellow =
    1 <= results.NHV / 2 && vNeckIncreaseRows.length > 0
      ? vNeckIncreaseRows[0] || 0
      : 0;

  return raglanFirstRowIncrease + vNeckFirstRowYellow;
}

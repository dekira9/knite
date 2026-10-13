import {
  calculateVNeckIncreases01,
  calculateVNeckIncreases11,
  calculateVNeckIncreases12,
  calculateVNeckIncreases22,
  calculateVNeckIncreases23,
} from '@/screens/styles/input/result/helpers';

export type RibbingVIncreaseInput = {
  nrRezV: number;
  spribVcorn: number;
  rowPribRV1: number;
  rowPribRV2: number;
  rowPribRV3: number;
  rowPribRVz: number;
};

export type RibbingVIncreaseResult = {
  increases: number[];
  resultString: string;
};

export function selectVNeckCollarIncreases(input: RibbingVIncreaseInput): RibbingVIncreaseResult {
  const { nrRezV, spribVcorn, rowPribRV1, rowPribRV2, rowPribRV3, rowPribRVz } = input;
  let increases: number[] = [];
  let resultString = '';

  if (Math.floor(spribVcorn / nrRezV) === 1 && spribVcorn > nrRezV) {
    const { increases12, resultStringV12 } = calculateVNeckIncreases12(
      nrRezV,
      rowPribRV1,
      rowPribRV2,
      spribVcorn,
    );
    increases = increases12;
    resultString = resultStringV12 || '';
  } else if (Math.floor(spribVcorn / nrRezV) === 0) {
    const { increases01, resultStringV01 } = calculateVNeckIncreases01(
      nrRezV,
      spribVcorn,
      rowPribRV1,
      rowPribRVz,
    );
    increases = increases01?.map((val) => (val === null ? 0 : val)) || [];
    resultString = resultStringV01 || '';
  } else if (spribVcorn === nrRezV) {
    const { increases11, resultStringV11 } = calculateVNeckIncreases11(nrRezV, rowPribRV1, spribVcorn);
    increases = increases11;
    resultString = resultStringV11 || '';
  } else if (spribVcorn === 2 * nrRezV) {
    const { increases22, resultStringV22 } = calculateVNeckIncreases22(nrRezV, rowPribRV2, spribVcorn);
    increases = increases22;
    resultString = resultStringV22 || '';
  }

  if (Math.floor(spribVcorn / nrRezV) === 2 && spribVcorn > nrRezV) {
    const { increases23, resultStringV23 } = calculateVNeckIncreases23(nrRezV, rowPribRV2, rowPribRV3);
    increases = increases23;
    resultString = resultStringV23 || '';
  }

  return { increases, resultString };
}

export function computeRibbingVCellCounts(
  highlightedRow: number,
  input: RibbingVIncreaseInput & { sv: number },
): number | undefined {
  const { nrRezV, spribVcorn, sv } = input;
  const totalRows = nrRezV + 1;

  if (!nrRezV || !spribVcorn || !sv || totalRows <= 1) {
    return undefined;
  }

  const { increases } = selectVNeckCollarIncreases(input);
  const cellCounts: number[] = [];
  let currentSquares = sv;

  cellCounts.push(currentSquares);

  for (let i = 0; i < increases.length; i++) {
    currentSquares += increases[i];
    cellCounts.push(currentSquares);
  }

  return cellCounts[highlightedRow + 1];
}

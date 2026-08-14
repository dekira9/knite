import {
  calculateIncreaseRows1x2_1x4,
  calculateIncreaseRows1x2_1x3,
  calculateIncreaseRows1x2_1x1,
  calculateIncreaseRows1x4_1x3,
} from '@/screens/styles/input/result/increaseRowsRegular';
import {
  calculateIncreaseRows1x2_1x4V,
  calculateIncreaseRows1x2_1x3V,
  calculateIncreaseRows1x2_1x1V,
  calculateIncreaseRows1x4_1x3V,
} from '@/screens/styles/input/result/increaseRowsVNeck';

export type PrecomputedVStringProps = {
  resultString24V: string;
  resultString23V: string;
  resultString21V: string;
  resultString43V: string;
  RowPrib1x4StringV: string;
  RowPrib1x3StringV: string;
  RowPrib1x2StringV: string;
  RowPrib1x1StringV: string;
};

export function mapPrecomputedVStrings(props: PrecomputedVStringProps): IncreaseRowStrings {
  return {
    resultString24: props.resultString24V,
    resultString23: props.resultString23V,
    resultString21: props.resultString21V,
    resultString43: props.resultString43V,
    rowPrib1x4String: props.RowPrib1x4StringV,
    rowPrib1x3String: props.RowPrib1x3StringV,
    rowPrib1x2String: props.RowPrib1x2StringV,
    rowPrib1x1String: props.RowPrib1x1StringV,
  };
}

export type IncreaseRowStrings = {
  resultString24: string;
  resultString23: string;
  resultString21: string;
  resultString43: string;
  rowPrib1x4String: string;
  rowPrib1x3String: string;
  rowPrib1x2String: string;
  rowPrib1x1String: string;
};

export type IncreaseRowInputs = {
  nhFront: number;
  sfx: number;
  pr1x4_f: number;
  pr1x2_f: number;
  prib1x1_f: number;
  prib1x2_f: number;
  prib1x3_f: number;
  prib1x4_f: number;
  prib1x3_rib_f: number;
};

function buildRowPribStrings(sfx: number): Pick<
  IncreaseRowStrings,
  'rowPrib1x4String' | 'rowPrib1x3String' | 'rowPrib1x2String' | 'rowPrib1x1String'
> {
  return {
    rowPrib1x4String: Array.from({ length: sfx }, (_, index) => 1 + index * 4).join(', '),
    rowPrib1x3String: Array.from({ length: sfx }, (_, index) => 1 + index * 3).join(', '),
    rowPrib1x2String: Array.from({ length: sfx }, (_, index) => 1 + index * 2).join(', '),
    rowPrib1x1String: Array.from({ length: sfx }, (_, index) => 1 + index * 1).join(', '),
  };
}

export function buildRegularIncreaseRowStrings(input: IncreaseRowInputs): IncreaseRowStrings {
  const { nhFront, sfx, pr1x4_f, pr1x2_f, prib1x1_f, prib1x2_f, prib1x3_f, prib1x4_f, prib1x3_rib_f } =
    input;
  const { resultString24 } = calculateIncreaseRows1x2_1x4(nhFront, sfx, pr1x4_f, pr1x2_f);
  const { resultString23 } = calculateIncreaseRows1x2_1x3(nhFront, sfx, prib1x3_f, prib1x2_f);
  const { resultString21 } = calculateIncreaseRows1x2_1x1(nhFront, sfx, prib1x1_f, prib1x2_f);
  const { resultString43 } = calculateIncreaseRows1x4_1x3(nhFront, sfx, prib1x4_f, prib1x3_rib_f);

  return {
    resultString24,
    resultString23,
    resultString21,
    resultString43,
    ...buildRowPribStrings(sfx),
  };
}

export function buildVNeckIncreaseRowStrings(input: IncreaseRowInputs): IncreaseRowStrings {
  const { nhFront, sfx, pr1x4_f, pr1x2_f, prib1x1_f, prib1x2_f, prib1x3_f, prib1x4_f, prib1x3_rib_f } =
    input;
  const { resultString24V } = calculateIncreaseRows1x2_1x4V(nhFront, sfx, pr1x4_f, pr1x2_f);
  const { resultString23V } = calculateIncreaseRows1x2_1x3V(nhFront, sfx, prib1x3_f, prib1x2_f);
  const { resultString21V } = calculateIncreaseRows1x2_1x1V(nhFront, sfx, prib1x1_f, prib1x2_f);
  const { resultString43V } = calculateIncreaseRows1x4_1x3V(nhFront, sfx, prib1x4_f, prib1x3_rib_f);

  return {
    resultString24: resultString24V ?? '',
    resultString23: resultString23V ?? '',
    resultString21: resultString21V ?? '',
    resultString43: resultString43V ?? '',
    ...buildRowPribStrings(sfx),
  };
}

function parseRowString(value: string, nullable: boolean): number[] {
  if (nullable && !value) {
    return [];
  }
  return value.split(', ').map(Number);
}

export function getIncreaseRowsFromType(
  selectedType: string,
  strings: IncreaseRowStrings,
  options?: { nullable?: boolean }
): number[] {
  if (!selectedType) {
    return [];
  }

  const nullable = options?.nullable ?? false;

  switch (selectedType) {
    case '1x2, 1x4':
      return parseRowString(strings.resultString24, nullable);
    case '1x2, 1x3':
      return parseRowString(strings.resultString23, nullable);
    case '1x2, 1x1':
      return parseRowString(strings.resultString21, nullable);
    case '1x3, 1x4':
      return parseRowString(strings.resultString43, nullable);
    case '1x3':
      return parseRowString(strings.rowPrib1x3String, nullable);
    case '1x4':
      return parseRowString(strings.rowPrib1x4String, nullable);
    case '1x2':
      return parseRowString(strings.rowPrib1x2String, nullable);
    case '1x1':
      return parseRowString(strings.rowPrib1x1String, nullable);
    default:
      return [];
  }
}

export function countSideArrayCells(
  increaseRows: number[],
  nhFront: number,
  highlightedRow: number
): number {
  let additionalCells = 0;
  if (highlightedRow < nhFront) {
    for (let i = 0; i <= highlightedRow; i++) {
      if (increaseRows.includes(i + 1)) {
        additionalCells++;
      }
    }
  }
  return additionalCells;
}

import {
  getIncreaseRowsFromType,
  countSideArrayCells,
  mapPrecomputedVStrings,
  type IncreaseRowStrings,
} from '../increaseRowSelection';

const sampleStrings: IncreaseRowStrings = {
  resultString24: '2, 6',
  resultString23: '',
  resultString21: '',
  resultString43: '',
  rowPrib1x4String: '1, 5',
  rowPrib1x3String: '1, 4',
  rowPrib1x2String: '1, 3',
  rowPrib1x1String: '1, 2',
};

describe('increaseRowSelection', () => {
  it('maps increase type to row numbers', () => {
    expect(getIncreaseRowsFromType('1x2, 1x4', sampleStrings)).toEqual([2, 6]);
    expect(getIncreaseRowsFromType('1x4', sampleStrings)).toEqual([1, 5]);
  });

  it('returns empty for unknown type', () => {
    expect(getIncreaseRowsFromType('', sampleStrings)).toEqual([]);
    expect(getIncreaseRowsFromType('unknown', sampleStrings)).toEqual([]);
  });

  it('maps precomputed V-neck result strings', () => {
    expect(
      getIncreaseRowsFromType(
        '1x2',
        mapPrecomputedVStrings({
          resultString24V: '',
          resultString23V: '',
          resultString21V: '',
          resultString43V: '',
          RowPrib1x4StringV: '1, 5',
          RowPrib1x3StringV: '1, 4',
          RowPrib1x2StringV: '1, 3',
          RowPrib1x1StringV: '1, 2',
        }),
        { nullable: true }
      )
    ).toEqual([1, 3]);
  });

  it('counts side cells up to highlighted row', () => {
    const rows = [1, 3, 5];
    expect(countSideArrayCells(rows, 10, 0)).toBe(1);
    expect(countSideArrayCells(rows, 10, 2)).toBe(2);
    expect(countSideArrayCells(rows, 10, 4)).toBe(3);
  });
});

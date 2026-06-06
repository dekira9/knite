import { buildFlatChartModel } from '../buildFlatChartModel';

describe('buildFlatChartModel', () => {
  it('builds collar row and increase symbols on outer raglan cells', () => {
    const model = buildFlatChartModel(3, 2, [1, 3], 0);

    expect(model.bodyRows).toHaveLength(4);
    expect(model.bodyRows[0]).toEqual([
      { kind: 'ribbing' },
      { kind: 'ribbing' },
    ]);
    expect(model.leftRows[0]).toEqual([{ kind: 'increase', symbol: '↗' }]);
    expect(model.rightRows[0]).toEqual([{ kind: 'increase', symbol: '↖' }]);
    expect(model.leftRows[1]).toEqual([{ kind: 'increasePad' }]);
    expect(model.leftRows[2]).toEqual([
      { kind: 'increase' },
      { kind: 'increase', symbol: '↗' },
    ]);
  });

  it('handles no increase rows', () => {
    const model = buildFlatChartModel(2, 4, [], 1);

    expect(model.leftRows).toEqual([[], []]);
    expect(model.rightRows).toEqual([[], []]);
    expect(model.bodyRows).toHaveLength(3);
    expect(model.highlightedRow).toBe(1);
  });
});

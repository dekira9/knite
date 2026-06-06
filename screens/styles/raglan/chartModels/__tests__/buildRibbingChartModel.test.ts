import { buildRibbingChartModel } from '../buildRibbingChartModel';

describe('buildRibbingChartModel', () => {
  it('builds eight raglan ribbing sections', () => {
    const model = buildRibbingChartModel(44, 14, 2, 6, 1);

    expect(model.sections).toHaveLength(8);
    expect(model.sections.map((s) => s.id)).toEqual([
      'line3',
      'back',
      'line4',
      'leftSleeve',
      'line1',
      'front',
      'line2',
      'rightSleeve',
    ]);
    expect(model.sections.find((s) => s.id === 'front')).toMatchObject({
      cols: 44,
      rows: 6,
      showRowAxis: true,
      showStitchAxis: true,
    });
    expect(model.sections.find((s) => s.id === 'line1')).toMatchObject({
      cols: 2,
      rows: 6,
    });
    expect(model.highlightedRow).toBe(1);
    expect(model.width).toBeGreaterThan(0);
    expect(model.height).toBeGreaterThan(0);
  });
});

import { buildRibbingChartModel } from '../buildRibbingChartModel';
import { RAGLAN_CELL_SIZE } from '../../raglanChartGridConstants';

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
    expect(model.sections.find((s) => s.id === 'back')).toMatchObject({
      showRowAxis: true,
    });
    expect(model.sections.find((s) => s.id === 'back')?.showStitchAxis).toBeUndefined();
    expect(model.sections.find((s) => s.id === 'line1')).toMatchObject({
      cols: 2,
      rows: 6,
    });
    expect(model.highlightedRow).toBe(1);
    expect(model.width).toBeGreaterThan(0);
    expect(model.height).toBeGreaterThan(0);
  });

  it('positions corners from grid-only body width (legacy ribbingO layout)', () => {
    const k = 2;
    const nr = 6;
    const sa = 14;
    const sFront = 44;
    const cell = RAGLAN_CELL_SIZE;
    const model = buildRibbingChartModel(sFront, sa, k, nr, 0);

    const bodyLeft = 20 + sa * cell + k * cell;
    const line3 = model.sections.find((s) => s.id === 'line3')!;
    const line4 = model.sections.find((s) => s.id === 'line4')!;
    const back = model.sections.find((s) => s.id === 'back')!;

    expect(back.layoutX).toBe(bodyLeft);
    expect(line3.layoutX).toBe(bodyLeft - k * cell);
    expect(line4.layoutX).toBe(bodyLeft + sFront * cell);
    expect(line3.svgTransform).toBe(
      `translate(${line3.layoutX}, ${line3.layoutY}) translate(0, ${nr * cell}) translate(${k * cell}, 0) rotate(-225)`,
    );
    expect(line4.svgTransform).toBe(
      `translate(${line4.layoutX + k * cell}, ${line4.layoutY}) translate(0, ${nr * cell}) translate(${-k * cell}, 0) rotate(225) translate(${-k * cell}, 0)`,
    );

    const kc = k * cell;
    const sin45 = Math.sin(Math.PI / 4);
    const cos45 = Math.cos(Math.PI / 4);
    const leftSleeve = model.sections.find((s) => s.id === 'leftSleeve')!;
    const rightSleeve = model.sections.find((s) => s.id === 'rightSleeve')!;
    const sleeveW = sa * cell;

    expect(leftSleeve.svgTransform).toBe(
      `translate(${leftSleeve.layoutX + sleeveW}, ${leftSleeve.layoutY}) translate(${kc * (1 - cos45)}, ${-kc * sin45}) rotate(90) translate(${-sleeveW}, 0)`,
    );
    expect(rightSleeve.svgTransform).toBe(
      `translate(${rightSleeve.layoutX}, ${rightSleeve.layoutY}) translate(${kc * (cos45 - 1)}, ${-kc * sin45}) rotate(-90)`,
    );
  });
});

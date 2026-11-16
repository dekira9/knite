/// <reference types="jest" />

import golden from '@/utils/raglan/__tests__/goldenSample.json';
import {
  buildKnitPlan,
  buildKnitPlanSource,
  getKnitPlanRowInfo,
  getNeckbandStitches,
  type KnitPlanIntroInput,
} from '@/utils/knitPlan';

function goldenAsIntro(): KnitPlanIntroInput {
  return {
    introFinished: true,
    style: 'regular',
    ...golden,
  } as KnitPlanIntroInput;
}

describe('knitPlan (regular, golden sample)', () => {
  const source = buildKnitPlanSource(goldenAsIntro());

  it('buildKnitPlanSource returns source with increase rows', () => {
    expect(source).not.toBeNull();
    expect(source?.increaseRows.length).toBeGreaterThan(0);
    expect(source?.selectedIncreaseType).toBe('1x2, 1x4');
  });

  it('phase row counts match NRrez / NHFront / NRostok', () => {
    const plan = buildKnitPlan(source!);
    expect(plan.phases[0]).toEqual({ id: 'neckband', rows: golden.NRrez });
    expect(plan.phases[1]).toEqual({
      id: 'raglanIncreases',
      rows: golden.NHFront,
    });
    const lengthen = plan.phases.find((p) => p.id === 'lengthening');
    expect(lengthen).toEqual({ id: 'lengthening', rows: golden.NRostok });
  });

  it('flags first increase row and rowsToNextIncrease', () => {
    const firstIncrease = source!.increaseRows[0];
    const info = getKnitPlanRowInfo(source!, 1, firstIncrease);
    expect(info.isIncreaseRow).toBe(true);
    expect(info.phaseId).toBe('raglanIncreases');

    const plainRow = source!.increaseRows.includes(1) ? 2 : 1;
    if (!source!.increaseRows.includes(plainRow)) {
      const plain = getKnitPlanRowInfo(source!, 1, plainRow);
      expect(plain.isIncreaseRow).toBe(false);
      const next = source!.increaseRows.find((r) => r > plainRow);
      expect(plain.rowsToNextIncrease).toBe(
        next != null ? next - plainRow : null,
      );
    }
  });

  it('stitch totals increase by 8 on increase rows', () => {
    const incRows = new Set(source!.increaseRows);
    for (let row = 2; row <= golden.NHFront; row++) {
      if (!incRows.has(row) || !incRows.has(row - 1)) {
        continue;
      }
      const prev = getKnitPlanRowInfo(source!, 1, row - 1);
      const curr = getKnitPlanRowInfo(source!, 1, row);
      if (prev.totalStitchesAfter != null && curr.totalStitchesAfter != null) {
        expect(curr.totalStitchesAfter - prev.totalStitchesAfter).toBe(8);
      }
    }
  });

  it('end of increase phase matches chart round total', () => {
    const end = getKnitPlanRowInfo(source!, 1, golden.NHFront);
    const back = golden.SFrontO + 2 * golden.Sfx;
    const sleeve = golden.Sa + 2 * golden.Sfx;
    const expectedRound =
      golden.K * 4 + back + back + 2 * sleeve;
    expect(end.parts?.back).toBe(back);
    expect(end.parts?.sleeve).toBe(sleeve);
    expect(end.totalStitchesAfter).toBe(expectedRound);
  });

  it('neckband stitch count matches ribbing chart', () => {
    expect(getNeckbandStitches(source!)).toBe(
      golden.K * 4 + 2 * golden.SFrontO + 2 * golden.Sa,
    );
  });
});

describe('buildKnitPlanSource guards', () => {
  it('returns null when introFinished is false', () => {
    const intro = { ...goldenAsIntro(), introFinished: false };
    expect(buildKnitPlanSource(intro)).toBeNull();
  });
});

describe('knitPlan v-neck smoke', () => {
  it('builds phases without throwing', () => {
    const intro: KnitPlanIntroInput = {
      ...goldenAsIntro(),
      style: 'v-neck',
      introFinished: true,
    };
    const source = buildKnitPlanSource(intro);
    expect(source).not.toBeNull();
    expect(source?.style).toBe('v-neck');
    const plan = buildKnitPlan(source!);
    expect(plan.phases.length).toBeGreaterThanOrEqual(4);
    expect(getKnitPlanRowInfo(source!, 1, 1).phaseId).toBe('raglanIncreases');
  });
});

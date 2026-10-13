import { SAMPLE_MEASUREMENTS } from '@/constants/samplePresets';
import {
  calculateRaglan,
  computeRegularRaglanLineMax,
  computeRegularRaglanLineMaxFromMeasurements,
  computeVNeckDepthBoundsFromMeasurements,
  computeVNeckRaglanLineMaxFromMeasurements,
} from '@/utils/calculateRaglan';
import type { RaglanOutput } from '@/utils/raglan/types';
import goldenSample from './goldenSample.json';

const sampleInput = {
  headCircumference: SAMPLE_MEASUREMENTS.headCircumference,
  neckCircumference: SAMPLE_MEASUREMENTS.neckCircumference,
  chestCircumference: SAMPLE_MEASUREMENTS.chestCircumference,
  stitchDensity: SAMPLE_MEASUREMENTS.stitchDensity,
  rowDensity: SAMPLE_MEASUREMENTS.rowDensity,
  fitType: SAMPLE_MEASUREMENTS.fitType,
  ribbingWidth: SAMPLE_MEASUREMENTS.ribbingWidth,
  ribbingWidthV: SAMPLE_MEASUREMENTS.ribbingWidthV,
  raglanLineWidth: SAMPLE_MEASUREMENTS.raglanLineWidth,
  raglanLineWidthV: SAMPLE_MEASUREMENTS.raglanLineWidthV,
  depthNeckV: SAMPLE_MEASUREMENTS.depthNeckV,
};

function assertOutput(result: RaglanOutput | string): asserts result is RaglanOutput {
  expect(typeof result).toBe('object');
}

describe('calculateRaglan', () => {
  it('rejects invalid input', () => {
    expect(
      calculateRaglan({
        ...sampleInput,
        headCircumference: '',
      })
    ).toBe('Please enter all values correctly.');
  });

  it('matches golden output for sample measurements', () => {
    const result = calculateRaglan(sampleInput);
    assertOutput(result);
    expect(result).toEqual(goldenSample);
  });

  it('exposes key regular and v-neck fields for sample measurements', () => {
    const result = calculateRaglan(sampleInput);
    assertOutput(result);

    expect(result.Sgor).toBe(124);
    expect(result.SgorV).toBe(124);
    expect(result.SFrontO).toBe(44);
    expect(result.SFrontV).toBe(46);
    expect(result.K).toBe(2);
    expect(result.KV).toBe(1);
    expect(result.usedIncreaseTypeString).not.toBe('Нет подходящего типа прибавок');
    expect(result.resultStringV).toBe('4, 4, 4, 4, 4, 4');
  });

  it('raglan line slider max matches full calc Sgor', () => {
    const result = calculateRaglan(sampleInput);
    assertOutput(result);
    expect(computeRegularRaglanLineMax(result.Sgor)).toBe(
      computeRegularRaglanLineMaxFromMeasurements(sampleInput)
    );
    expect(computeRegularRaglanLineMax(result.Sgor)).toBe(27);
  });

  it('v-neck depth slider bounds match full calc', () => {
    const result = calculateRaglan(sampleInput);
    assertOutput(result);
    expect(computeVNeckDepthBoundsFromMeasurements(sampleInput)).toEqual({
      min: parseFloat(result.LHVmin.toFixed(1)),
      max: parseFloat(result.LHVmax.toFixed(1)),
    });
  });

  it('v-neck raglan line slider max matches full calc', () => {
    const result = calculateRaglan(sampleInput);
    assertOutput(result);
    expect(computeVNeckRaglanLineMaxFromMeasurements(sampleInput)).toBe(result.KmaxV);
  });

  it('semi-fitted adds ease to SFit', () => {
    const slim = calculateRaglan({ ...sampleInput, fitType: 'fitted' });
    const semi = calculateRaglan({ ...sampleInput, fitType: 'semi-fitted' });
    assertOutput(slim);
    assertOutput(semi);
    expect(semi.SFit).toBeGreaterThan(slim.SFit);
  });

  it('men garmentFitFor increases NHFront by armhole ease', () => {
    const women = calculateRaglan({ ...sampleInput, garmentFitFor: 'women' });
    const men = calculateRaglan({ ...sampleInput, garmentFitFor: 'men' });
    assertOutput(women);
    assertOutput(men);
    expect(men.NHFront).toBeGreaterThan(women.NHFront);
    expect(men.NHFrontV).toBeGreaterThan(women.NHFrontV);
  });
});

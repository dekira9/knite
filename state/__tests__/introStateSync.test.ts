jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@/utils/calculateRaglanCoreRemote', () => ({
  calculateRaglanRemote: jest.fn(),
}));

import { applySnapshot } from 'mobx-state-tree';
import { calculateRaglanRemote } from '@/utils/calculateRaglanCoreRemote';
import introState from '@/state/introState';

const mockRemote = calculateRaglanRemote as jest.Mock;

describe('introState syncRaglanFromSupabase', () => {
  beforeEach(() => {
    mockRemote.mockReset();
    applySnapshot(introState, {
      headCircumference: '58',
      neckCircumference: '36',
      chestCircumference: '92',
      stitchDensity: '24',
      rowDensity: '32',
      fitType: 'fitted',
      ribbingWidth: 2,
      ribbingWidthV: 2,
      raglanLineWidth: 2,
      raglanLineWidthV: 1,
      depthNeckV: 4,
      Sgor: 0,
    });
  });

  it('falls back to local calculateRaglan when remote returns null', async () => {
    mockRemote.mockResolvedValue(null);

    const ok = await introState.syncRaglanFromSupabase();

    expect(ok).toBe(true);
    expect(introState.Sgor).toBeGreaterThan(0);
  });

  it('populates raglan fields in beginSampleFlow when remote is unavailable', async () => {
    mockRemote.mockResolvedValue(null);

    await introState.beginSampleFlow('regular');

    expect(introState.Sgor).toBeGreaterThan(0);
    expect(introState.usesSampleMeasurements).toBe(true);
  });
});

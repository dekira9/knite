jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@/utils/analytics', () => ({
  track: jest.fn(),
}));

import {
  compareVersions,
  isSnoozeActive,
  SOFT_UPDATE_SNOOZE_MS,
} from '@/utils/appUpdateCheck';

describe('compareVersions', () => {
  it('orders dotted versions', () => {
    expect(compareVersions('1.0.3', '1.0.4')).toBe(-1);
    expect(compareVersions('1.0.4', '1.0.4')).toBe(0);
    expect(compareVersions('1.1.0', '1.0.9')).toBe(1);
    expect(compareVersions('2.0', '1.9.9')).toBe(1);
  });

  it('treats missing patch as zero', () => {
    expect(compareVersions('1.0', '1.0.0')).toBe(0);
    expect(compareVersions('1.0', '1.0.1')).toBe(-1);
  });
});

describe('isSnoozeActive', () => {
  it('is inactive when never prompted', () => {
    expect(isSnoozeActive(null, 1_000_000)).toBe(false);
  });

  it('stays active inside the snooze window', () => {
    const now = 10_000_000;
    expect(isSnoozeActive(now - SOFT_UPDATE_SNOOZE_MS + 1, now)).toBe(true);
  });

  it('expires after the snooze window', () => {
    const now = 10_000_000;
    expect(isSnoozeActive(now - SOFT_UPDATE_SNOOZE_MS, now)).toBe(false);
  });
});

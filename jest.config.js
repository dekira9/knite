/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  /** Raglan golden tests are JSON fixtures, not snapshots */
  snapshotFormat: {
    escapeString: false,
    printBasicPrototype: false,
  },
};

/** AsyncStorage has no native module in Jest: use the package's in-memory mock everywhere. */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

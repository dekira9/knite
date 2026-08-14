import { StyleSheet } from 'react-native';

/** Shared full-bleed page chrome for raglan chart screens. */
export const raglanChartPageStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  legendStrip: {
    paddingBottom: 2,
  },
  chartArea: {
    flex: 1,
    width: '100%',
  },
  metaText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});

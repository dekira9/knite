import { StyleSheet } from 'react-native';

export const RESULT_COLORS = {
  textPrimary: '#1A1A1A',
  textSecondary: '#6b7280',
  background: '#F8F9FA',
  card: '#ffffff',
  divider: '#CCCCCC',
  chipBackground: '#E6E6E6',
  lastRowCollar: '#FAEE25',
  start: '#FF4444',
  back: '#A29FCF',
  front: '#FDCFE1',
  sleeve: '#DAEDBD',
  raglan: '#E76F51',
  corpus: '#009FE3',
  underarm: '#FF00FF',
  knitFromCollar: '#fb93bc',
  decrease: '#000000',
} as const;

export const resultTypography = StyleSheet.create({
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 8,
    color: RESULT_COLORS.textPrimary,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: RESULT_COLORS.textPrimary,
  },
  label: {
    fontSize: 14,
    color: RESULT_COLORS.textSecondary,
  },
  value: {
    fontSize: 17,
    fontWeight: '700',
    color: RESULT_COLORS.textPrimary,
  },
  chipValue: {
    fontSize: 15,
    fontWeight: '600',
    color: RESULT_COLORS.textPrimary,
  },
  body: {
    fontSize: 14,
    color: RESULT_COLORS.textPrimary,
    lineHeight: 20,
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: RESULT_COLORS.textSecondary,
    letterSpacing: 0.2,
  },
  legendLabel: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 14,
  },
});

export const resultCardStyles = StyleSheet.create({
  card: {
    backgroundColor: RESULT_COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: RESULT_COLORS.divider,
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});

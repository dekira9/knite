// StyleSheet for v-neck Step 4 separating sleeves UI.

import { StyleSheet } from 'react-native';
import { resultTypography } from '../resultSharedStyles';
import { STEP4_COLORS as COLORS } from './colors';

export const step4SeparatingSleevesStylesVNeck = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  resultCard: {
    backgroundColor: COLORS.CARD,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subtitle: {
    ...resultTypography.sectionTitle,
  },
  leftLabel: {
    ...resultTypography.label,
  },
  boldNumber: {
    ...resultTypography.value,
  },
  resultText: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center' as const,
    color: COLORS.TEXT_PRIMARY,
  },
  KnitCircleImage: {
    width: 25,
    height: 25,
    marginLeft: 0,
    marginRight: 0,
  },
  startendImage: {
    width: 30,
    height: 20,
  },
  textBox: {
    borderWidth: 1,
    borderColor: COLORS.BLACK,
    padding: 3,
    borderRadius: 5,
    marginBottom: 3,
    justifyContent: 'center',
  },
  textInsideBox: {
    fontSize: 12,
    color: COLORS.BLACK,
  },
  createText: {
    fontSize: 12,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  separatingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  startRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  knittingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  divider: {
    height: 0.5,
    backgroundColor: COLORS.DIVIDER,
    marginTop: 5,
    marginBottom: 20,
  },
  separatingLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stitchBox: {
    marginBottom: 0,
    marginLeft: 0,
    padding: 10,
    backgroundColor: COLORS.GRAY,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  roundDot: {
    width: 17,
    height: 17,
    borderRadius: 8,
    marginLeft: 0,
    borderWidth: 2,
    borderColor: COLORS.DIVIDER,
  },
  grayIndicator: {
    width: 17,
    height: 17,
    backgroundColor: COLORS.DIVIDER,
    marginLeft: 10,
    borderWidth: 1,
  },
  magentaIndicator: {
    width: 17,
    height: 17,
    backgroundColor: COLORS.UNDERARM,
    marginLeft: 10,
    borderWidth: 1,
  },
});

export type Step4SeparatingSleevesStylesVNeck = typeof step4SeparatingSleevesStylesVNeck;

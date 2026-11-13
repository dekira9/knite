// StyleSheet for regular (O) Step 3 back lengthening UI.

import { StyleSheet } from 'react-native';
import { resultTypography } from '../resultSharedStyles';
import { STEP3_COLORS_BASE } from './colors';

const COLORS = { ...STEP3_COLORS_BASE, PRIMARY: '#007AFF' };

export const step3BackLengtheningStylesRegular = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  resultCard: {
    backgroundColor: COLORS.WHITE,
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
  slouchHint: {
    marginTop: 4,
    marginBottom: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  leftLabel: {
    ...resultTypography.label,
  },
  boldNumber: {
    ...resultTypography.value,
  },
  knitIcon: {
    width: 25,
    height: 25,
  },
  startIcon: {
    width: 25,
    height: 20,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center' as const,
    color: COLORS.TEXT_PRIMARY,
  },
  textBox: {
    borderWidth: 1,
    borderColor: COLORS.BLACK,
    padding: 3,
    borderRadius: 5,
    marginBottom: 3,
    marginLeft:3,
    marginRight:3,
    justifyContent: 'center',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  indicatorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  divider: {
    height: 0.5,
    backgroundColor: COLORS.DIVIDER,
    marginTop: 5,
    marginBottom: 20,
  },
  indicator: {
    width: 17,
    height: 17,
    marginLeft: 10,
    borderWidth: 1,
  },
  orangeIndicator: {
    width: 17,
    height: 17,
    backgroundColor: COLORS.ORANGE,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  purpleIndicator: {
    width: 17,
    height: 17,
    backgroundColor: COLORS.PURPLE,
    borderWidth: 1,
    borderBottomWidth: 0.5,
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
  horizontalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  planImage: {
    width: 30,
    height: 30,
  },
  planText: {
    marginLeft: 5,
    color: COLORS.PRIMARY,
    textDecorationLine: 'underline',
  },
  frontPartsLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 3,
  },
  frontPartsContainer: {
    flexDirection: 'row',
  },
  frontPartsItem: {
    marginBottom: 1,
    marginRight: 1,
    padding: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frontPartsItemWithMargin: {
    marginBottom: 1,
    marginLeft: 1,
    padding: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  frontPartsText: {
    textAlign: 'center',
  },
  frontPartsTextWithMargin: {
    textAlign: 'center',
    marginLeft: 5,
  },
  sleevePartsLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 3,
  },
  sleevePartsContainer: {
    flexDirection: 'row',
  },
  sleevePartsItem: {
    marginBottom: 1,
    marginLeft: 0,
    padding: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  sleevePartsItemWithMargin: {
    marginBottom: 1,
    marginLeft: 0,
    padding: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  sleevePartsText: {
    textAlign: 'center',
  },
  sleevePartsTextWithMargin: {
    textAlign: 'center',
    marginLeft: 5,
  },
  indicatorLarge: {
    width: 34,
    height: 17,
    marginLeft: 10,
    borderWidth: 1,
  },
});

export type Step3BackLengtheningStylesRegular = typeof step3BackLengtheningStylesRegular;

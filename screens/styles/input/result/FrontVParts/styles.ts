// StyleSheet for FrontV result step layout and stitch boxes.

import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  resultCard: {
    backgroundColor: COLORS.WHITE,
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  resultText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 5,
  },
  viewImage: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  styleZntsImage: {
    width: 40,
    height: 40,
    marginLeft: 10,
    marginRight: 10,
  },
  styleznsfImage: {
    width: 35,
    height: 35,
    marginLeft: 0,
    marginRight: 0,
  },
  styleKnitCircleImage: {
    width: 25,
    height: 25,
    marginLeft: 0,
    marginRight: 0,
  },
  styleZnkr: {
    width: 30,
    height: 30,
    marginLeft: 0,
    marginRight: 0,
  },
  frontImage: {
    width: '100%',
    aspectRatio: 2,
    height: undefined,
    resizeMode: 'contain',
    padding: 300,
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
  indicator: {
    width: 17,
    height: 17,
    marginLeft: 10,
    borderWidth: 1,
  },
  divider: {
    height: 0.5,
    backgroundColor: COLORS.DIVIDER,
    marginTop: 5,
    marginBottom: 20,
  },
  infoRowmin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  leftLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#6b7280',
  },
  knitIconznts: {
    width: 30,
    height: 30,
    marginLeft: 0,
    marginRight: 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  boldNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  horizontalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stitchBox: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 10,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#00ADF2',
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  pinkIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#FDCFE1',
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  blackIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  roundDot: {
    width: 17,
    height: 17,
    borderRadius: 8,
    marginLeft: 0,
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },
});

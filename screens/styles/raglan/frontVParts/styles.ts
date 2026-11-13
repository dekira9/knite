// StyleSheet for the v-neck front raglan chart screen.
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import introState from '@/state/introState';
import { computeStitchMetrics } from '@/utils/stitchMetrics';
import { raglanChartChromeStyleDefs } from '../raglanChartChromeStyles';

const { heightPer25RowsCm: Hc, widthPer25StitchesCm: Lc } = computeStitchMetrics(
  introState.stitchDensity,
  introState.rowDensity,
);

export const styles = StyleSheet.create({
  ...raglanChartChromeStyleDefs,
  container: {
    flexDirection: 'column',
  },
  horContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: '#C6C6C6',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  verticalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'grey',
  },
 
 
 
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  cell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#A29FCF',
  },
  firstCell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#DAEDBD',
  },
  Front: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
 
    
  selectedOptionButton: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: 'red',
  },  
  increaseCell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#00ADF2',
  },
  leftRow: {
    justifyContent: 'flex-end',
  },
  defaultCell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#ffe9f1', 
  },
  ribbingCell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: '#715604',
    borderTopWidth: 3,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'yellow',
    borderBottomColor: '#715604',
    borderLeftColor: '#715604',
    borderRightColor: '#715604',
    backgroundColor: '#fb93bc',
    margin: 0,
  },
  increaseArrayLeft: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },  
  increaseArrayRight: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  backButton: {
    padding: 5,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    margin: 5,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  leftSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  rightSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  vNeckContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 0,
    borderWidth: 0,
    borderColor: 'blue',
    minWidth: 100,
  },
  vNeckLeftArray: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    borderWidth: 0,
    borderColor: 'green',
  },
  vNeckRightArray: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderWidth: 0,
    borderColor: 'green',
  },
  vNeckIncreaseCell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#FDCFE1',
    margin: 0,
  },
  vNeckDefaultCell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#E0E0E0',
    margin: 0,
  },
  decreaseCell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'black',
    margin: 0,
  },
  cellsBelow: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#808080',
    margin: 0,
  },
  paginationContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
    marginTop: 0,
   
    },
    paginationDot: {
      height: 8,
      width: 8,
      borderRadius: 4,
      backgroundColor: '#C6C6C6',
      marginHorizontal: 4,
    },
}) as Record<string, ViewStyle | TextStyle>;

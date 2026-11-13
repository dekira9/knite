// StyleSheet for the v-neck ribbing chart screen (cell sizes use module stitch metrics).
import { StyleSheet } from 'react-native';
import { Hc, Lc } from './calc';

export const ribbingVStyles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  footerContainer: {
    width: '100%',
    padding: 5,
  },
  mainContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },


  scrollViewOuter: {
    flex: 1,
    width: '100%',
  },
  scrollViewContentOuter: {
    paddingBottom: 300,
  },
  contentContainer: {
    minHeight: '300%',
  },
  scrollViewHorizontal: {
    width: '100%',
  },
  scrollViewContentHorizontal: {
    paddingRight: 50,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    top: 10,
  },
  horContainerTop: {
    flexDirection: 'row',
    alignItems: 'center',



  },
  horContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 0,
    borderColor: 'green',

       
  },
  horContainerRight: {
    flexDirection: 'row',

    alignItems: 'flex-start',

       
  },
  verticalContainer: {
    flexDirection: 'column',
    alignItems: 'center',


  },
  HorizontalContainer: {
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderColor: 'red',

  },
  LeftSleeve: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transformOrigin: 'top right',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'red',
  },
  RightSleeve: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transformOrigin: 'top left',
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: 'blue',
  },
  rotatedLine1: {
    transform: [{ rotate: '45deg' }],
    transformOrigin: 'top right',
  },
  rotatedLeftSleeve: {
    transformOrigin: 'top right',
  },
  rotatedRightSleeve: {
    transformOrigin: 'top left',
  },
  rotatedLine2: {

    transformOrigin: 'top left',
  },
  rotatedLine3: {
    transformOrigin: 'top left',
  },
  rotatedLine4: {
    transformOrigin: 'top right',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 0,
    alignItems: 'center',
    marginVertical: 0,
    position: 'relative',
  },
  cell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'yellow',
  },
  firstCell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'yellow',
  },
  Front: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  Back: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    transform: [{ rotate: '180deg' }],
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    padding: 5,
    gap: 15,
    backgroundColor: '#fff',
  },
  navButton: {
    padding: 5,


  },
  highlightedCell: {
    backgroundColor: 'red',
  },
  controlsInfoContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'column',
    width: '100%',
    backgroundColor: '#fff',
  },
  infoContainer: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },

  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  arrayContainer: {
    alignItems: 'flex-start',

    transformOrigin: 'left bottom',


  },
  arrayContainerRight: {
    alignItems: 'flex-end',

    transformOrigin: 'right bottom',



  },
  rowNumber: {
    position: 'absolute',
    left: -15,
    width: 12,
    textAlign: 'right',
    fontSize: 8,
    color: '#666',
  },
  squaresContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  square: {
    width: Lc,
    height: Hc,
    backgroundColor: 'yellow',
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 0,
  },
  firstRowSquare: {
    backgroundColor: 'yellow',
  },
  lastRowSquare: {
    backgroundColor: 'yellow',
  },
  squareCount: {
    position: 'absolute',
    right: -20,
    fontSize: 10,
    color: '#666',
  },
  leftSquareCount: {
    left: -20,
    textAlign: 'left',
  },
  grid: {
    flexDirection: 'column',

    margin: 0,
  },
  resultText: {
    fontSize: 12,
    marginBottom: 1,

    textAlign: 'center' as const,
    color: 'black',
  },
  horVcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zeroRowSquare: {
    backgroundColor: '#C6C6C6',
  },
  highlightedZeroRow: {

    backgroundColor: 'red',

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
  // Additional styles for inline replacements
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 500,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  grayIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#C6C6C6',
    marginLeft: 10,
    borderWidth: 1,
  },
  yellowIndicator: {
    width: 17,
    height: 17,
    backgroundColor: 'yellow',
    marginLeft: 10,
    borderWidth: 1,
  },
  redIndicator: {
    width: 17,
    height: 17,
    backgroundColor: 'red',
    marginLeft: 10,
    borderWidth: 1,
  },
  horizontalScrollContent: {
    paddingRight: 250,
  },
  relativeContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});

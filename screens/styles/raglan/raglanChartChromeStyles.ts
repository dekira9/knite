import { ViewStyle, TextStyle } from 'react-native';

/** Shared option-picker + bottom controls styles for back/front/sleeve chart screens. */
export const raglanChartChromeStyleDefs: Record<string, ViewStyle | TextStyle> = {
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 0,
    backgroundColor: '#FFFFFF',
  },
  horContainerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginRight: 5,
    marginTop: 5,
    backgroundColor: '#FFFFFF',
    width: 'auto',
    paddingHorizontal: 1,
    gap: 2,
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    marginBottom: 0,
    marginHorizontal: 0,
    padding: 0,
    backgroundColor: '#F1F1F2',
    borderRadius: 8,
    minWidth: '45%',
    alignSelf: 'flex-start',
  },
  resultText: {
    fontSize: 12,
    marginBottom: 1,
    textAlign: 'center' as const,
  },
  rowNumbersText: {
    fontSize: 12,
    marginBottom: 1,
    textAlign: 'center' as const,
    lineHeight: 16,
  },
  optionButton: {
    marginBottom: 5,
    padding: 5,
    backgroundColor: '#C6C6C6',
    borderRadius: 5,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chevronIcon: {
    marginLeft: 8,
  },
  selectedOptionText: {
    color: 'white',
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
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  controlsInfoContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'column',
    width: '100%',
    backgroundColor: '#fff',
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartArea: {
    flex: 1,
    minHeight: 200,
    width: '100%',
  },
};

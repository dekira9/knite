// Shared types for v-neck front grid data and chart cell styles.
import type { ViewStyle } from 'react-native';

export type VNeckGridStyles = {
  vNeckIncreaseCell: ViewStyle;
  ribbingCell: ViewStyle;
  decreaseCell: ViewStyle;
  cellsBelow: ViewStyle;
  highlightedCell: ViewStyle;
  row: ViewStyle;
  leftRow: ViewStyle;
};

export type VNeckData = {
  additionalCellsPerPair: number[];
  blackCells: [number, number, string][];
  calculatedGreyCells: Set<string>;
  blackCellsRight: [number, number, string][];
  calculatedGreyCellsRight: Set<string>;
};

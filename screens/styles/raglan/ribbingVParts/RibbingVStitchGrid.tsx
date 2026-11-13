// Fixed-width stitch cell grid (raglan lines, back, sleeves) for the v-neck ribbing chart.
import React from 'react';
import { View } from 'react-native';
import { computeRibbingVCellCounts } from '../ribbingVCollarGrid';
import type { RibbingVCollarIncreaseInput } from './calc';
import { ribbingVStyles as styles } from './styles';

type RibbingVStitchGridProps = {
  numRows: number;
  numCols: number;
  highlightedRow: number;
  collarIncreaseInput: RibbingVCollarIncreaseInput;
};

export function RibbingVStitchGrid({
  numRows,
  numCols,
  highlightedRow,
  collarIncreaseInput,
}: RibbingVStitchGridProps) {
  const cells = [];
  const _cellCounts = computeRibbingVCellCounts(highlightedRow, collarIncreaseInput);

  for (let i = -1; i < numRows; i++) {
    const row = [];
    for (let j = 0; j < numCols; j++) {
      row.push(
        <View
          key={`${i}-${j}`}
          style={[
            i === 0 ? styles.firstCell : styles.cell,
            i === -1 && styles.zeroRowSquare,
            i === numRows - 1 && styles.lastRowSquare,
            i === highlightedRow && styles.highlightedCell,
          ]}
        />,
      );
    }
    cells.push(
      <View key={i} style={styles.row}>
        {row}
      </View>,
    );
  }

  return <>{cells}</>;
}

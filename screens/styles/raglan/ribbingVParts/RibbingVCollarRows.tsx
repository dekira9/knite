// Left collar increase row squares and increase summary for the v-neck ribbing chart.
import React from 'react';
import { View, Text } from 'react-native';
import {
  computeRibbingVCellCounts,
  selectVNeckCollarIncreases,
} from '../ribbingVCollarGrid';
import type { RibbingVCollarIncreaseInput } from './calc';
import { ribbingVStyles as styles } from './styles';

type RibbingVCollarRowsProps = {
  nrRezV: number;
  spribVcorn: number;
  sv: number;
  highlightedRow: number;
  collarIncreaseInput: RibbingVCollarIncreaseInput;
};

export function RibbingVCollarRows({
  nrRezV,
  spribVcorn,
  sv,
  highlightedRow,
  collarIncreaseInput,
}: RibbingVCollarRowsProps) {
  const rows = [];
  const numRows = nrRezV;
  const _numCols = sv;
  const _cellCounts = computeRibbingVCellCounts(highlightedRow, collarIncreaseInput);

  if (!nrRezV || !spribVcorn || !sv || numRows <= 0) {
    return <Text>Загрузка данных...</Text>;
  }

  const { increases, resultString } = selectVNeckCollarIncreases(collarIncreaseInput);

  let currentSquares = sv;

  for (let i = -1; i < numRows; i++) {
    if (i >= 0) {
      currentSquares += increases[i];
    }

    const row = [];
    for (let j = 0; j < currentSquares; j++) {
      row.push(
        <View
          key={`${i}-${j}`}
          style={[
            styles.square,
            i === -1 && styles.zeroRowSquare,
            i === 0 && styles.firstRowSquare,
            i === numRows - 1 && styles.lastRowSquare,
            i === highlightedRow && styles.highlightedCell,
          ]}
        />,
      );
    }
    rows.push(
      <View key={i} style={styles.row}>
        <Text style={[styles.squareCount, styles.leftSquareCount]}>{currentSquares}</Text>
        <View style={styles.squaresContainer}>{row}</View>
      </View>,
    );
  }

  return (
    <>
      {rows}
      {resultString ? <Text style={styles.resultText}>{resultString}</Text> : null}
    </>
  );
}

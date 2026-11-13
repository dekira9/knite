// Right collar increase row squares for the v-neck ribbing chart.
import React from 'react';
import { View, Text } from 'react-native';
import {
  computeRibbingVCellCounts,
  selectVNeckCollarIncreases,
} from '../ribbingVCollarGrid';
import type { RibbingVCollarIncreaseInput } from './calc';
import { ribbingVStyles as styles } from './styles';

type RibbingVCollarRowsRightProps = {
  nrRezV: number;
  spribVcorn: number;
  sv: number;
  highlightedRow: number;
  collarIncreaseInput: RibbingVCollarIncreaseInput;
};

export function RibbingVCollarRowsRight({
  nrRezV,
  spribVcorn,
  sv,
  highlightedRow,
  collarIncreaseInput,
}: RibbingVCollarRowsRightProps) {
  const rows = [];
  const numRows = nrRezV;
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
          key={`right-${i}-${j}`}
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
      <View key={`right-${i}`} style={styles.row}>
        <View style={styles.squaresContainer}>{row}</View>
        <Text style={styles.squareCount}>{currentSquares}</Text>
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

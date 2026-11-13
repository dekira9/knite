// Renders the right v-neck stitch grid rows for the front chart.
import React from 'react';
import { View } from 'react-native';
import type { VNeckGridStyles } from './types';
import { buildAdditionalCellsPerPair } from './calc';

export function renderVNeckRightArray(params: {
  nhFrontV: number;
  nhv: number;
  svFront: number;
  sFrontV: number;
  highlightedRow: number;
  increaseRows: number[];
  styles: VNeckGridStyles;
}): React.ReactNode[] {
  const { nhFrontV, nhv, svFront, sFrontV, highlightedRow, increaseRows, styles } = params;
  const cells: React.ReactNode[] = [];
  const additionalCellsPerPair = buildAdditionalCellsPerPair(nhFrontV, nhv, increaseRows);

  const blackCellsRight: [number, number, string][] = [];
  let currentBlackCheckRowLength = 0;
  const totalPairs = Math.ceil(nhFrontV / 2);

  for (let i = 1; i <= totalPairs; i++) {
    const currentPairAdditionalCells = additionalCellsPerPair[i - 1] || 0;
    currentBlackCheckRowLength += currentPairAdditionalCells;

    for (let pairRow = 0; pairRow < 2; pairRow++) {
      const currentRow = (i - 1) * 2 + pairRow + 1;
      if (currentRow > nhFrontV) continue;

      const SdecV = svFront - sFrontV / 2;
      const NHVwork = nhv - 2;
      if (NHVwork <= 0 || SdecV <= 0) continue;

      const D = Math.floor(SdecV / (NHVwork / 2));
      const decCelA = (D + 1) * (SdecV - D * (NHVwork / 2));
      const pairRowA = decCelA > 0 && D + 1 > 0 ? decCelA / (D + 1) : 0;
      const Kd = pairRowA > 0 ? NHVwork / 2 / pairRowA : Infinity;

      const pozPairDecA = Array.from({ length: Math.max(0, Math.floor(pairRowA)) }, (_, idx) =>
        Math.floor(idx * Kd) + 2,
      );
      const pozPairAll = Array.from({ length: Math.max(0, Math.floor(NHVwork / 2)) }, (_, idx) => idx + 2);
      const pozPairDecB = pozPairAll.filter((p) => !pozPairDecA.includes(p));

      const decRowsA = pozPairDecA.map((pos) => pos * 2);
      const decRowsB = pozPairDecB.map((pos) => pos * 2);

      if (decRowsA.includes(currentRow)) {
        for (let k = 1; k <= 1 + D && k <= currentBlackCheckRowLength; k++) {
          const colIndex = currentBlackCheckRowLength - k - 1;
          if (colIndex >= 0) blackCellsRight.push([currentRow, colIndex, 'A']);
        }
      }
      if (D > 0 && decRowsB.includes(currentRow)) {
        for (let k = 1; k <= D && k <= currentBlackCheckRowLength; k++) {
          const colIndex = currentBlackCheckRowLength - k - 1;
          if (colIndex >= 0) blackCellsRight.push([currentRow, colIndex, 'B']);
        }
      }
    }
  }

  const calculatedGreyCellsRight = new Set<string>();
  for (const [blackRow, blackCol] of blackCellsRight) {
    for (let currentRow = blackRow + 1; currentRow <= nhFrontV; currentRow++) {
      calculatedGreyCellsRight.add(`${currentRow},${blackCol}`);
    }
  }

  let currentRowLength = 0;
  const totalPairsRenderRight = Math.ceil(nhFrontV / 2);
  let previousRowLength = 0;

  for (let i = 1; i <= totalPairsRenderRight; i++) {
    const currentPairAdditionalCells = additionalCellsPerPair[i - 1] || 0;
    previousRowLength = currentRowLength;
    currentRowLength += currentPairAdditionalCells;

    for (let pairRow = 0; pairRow < 2; pairRow++) {
      const row: React.ReactNode[] = [];
      const currentRow = (i - 1) * 2 + pairRow + 1;
      if (currentRow > nhFrontV) continue;

      const isOddRow = currentRow % 2 !== 0;

      for (let j = 0; j < currentRowLength; j++) {
        let cellStyle = styles.vNeckIncreaseCell;
        if (isOddRow && j >= previousRowLength && j < currentRowLength) {
          cellStyle = styles.ribbingCell;
        }

        let isBlackCell = false;
        const cellKey = `${currentRow},${j}`;

        for (const [blackRow, blackCol] of blackCellsRight) {
          if (currentRow === blackRow && j === blackCol) {
            cellStyle = styles.decreaseCell;
            isBlackCell = true;
            break;
          }
        }

        if (!isBlackCell && calculatedGreyCellsRight.has(cellKey)) {
          cellStyle = styles.cellsBelow;
        }

        row.push(
          <View
            key={`vneck-right-${currentRow}-${j}`}
            style={[cellStyle, currentRow === highlightedRow + 1 && styles.highlightedCell]}
          />,
        );
      }

      cells.push(
        <View key={`vneck-right-${currentRow}`} style={styles.row}>
          {row}
        </View>,
      );
    }
  }

  return cells;
}

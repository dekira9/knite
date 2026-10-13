import React from 'react';
import { View, ViewStyle } from 'react-native';

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

export function parseVNeckIncreaseRows(resultStringV: string | undefined): number[] {
  return resultStringV ? resultStringV.split(', ').map(Number) : [];
}

export function buildAdditionalCellsPerPair(
  nhFrontV: number,
  nhv: number,
  increaseRows: number[],
): number[] {
  return Array.from({ length: Math.ceil(nhFrontV / 2) }, (_, pairIndex) => {
    const pairNum = pairIndex + 1;
    return pairNum <= nhv / 2 ? increaseRows[pairNum - 1] || 0 : 0;
  });
}

export function getRowLength(rowNum: number, additionalCellsData: number[]): number {
  let length = 0;
  const targetPairIndex = Math.floor((rowNum - 1) / 2);
  for (let i = 0; i <= targetPairIndex; i++) {
    length += additionalCellsData[i] || 0;
  }
  return length;
}

export function computeVNeckData(params: {
  nhFrontV: number;
  nhv: number;
  svFront: number;
  sFrontV: number;
  increaseRows: number[];
}): VNeckData {
  const { nhFrontV, nhv, svFront, sFrontV, increaseRows } = params;
  const additionalCellsPerPair = buildAdditionalCellsPerPair(nhFrontV, nhv, increaseRows);

  const blackCells: [number, number, string][] = [];
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
          blackCells.push([currentRow, k, 'A']);
        }
      }
      if (D > 0 && decRowsB.includes(currentRow)) {
        for (let k = 1; k <= D && k <= currentBlackCheckRowLength; k++) {
          blackCells.push([currentRow, k, 'B']);
        }
      }
    }
  }

  const calculatedGreyCells = new Set<string>();
  for (const [blackRow, blackCol] of blackCells) {
    let greyCol = blackCol;
    for (let currentRow = blackRow + 1; currentRow <= nhFrontV; currentRow++) {
      if (currentRow % 2 !== 0) {
        const additionalCellsIndex = Math.floor(currentRow / 2);
        if (additionalCellsIndex >= 0 && additionalCellsIndex < additionalCellsPerPair.length) {
          greyCol += additionalCellsPerPair[additionalCellsIndex] || 0;
        }
      }
      calculatedGreyCells.add(`${currentRow},${greyCol}`);
    }
  }

  const blackCellsRight: [number, number, string][] = [];
  let currentBlackCheckRowLengthRight = 0;

  for (let i = 1; i <= totalPairs; i++) {
    const currentPairAdditionalCells = additionalCellsPerPair[i - 1] || 0;
    currentBlackCheckRowLengthRight += currentPairAdditionalCells;

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
        for (let k = 1; k <= 1 + D && k <= currentBlackCheckRowLengthRight; k++) {
          const colIndex = currentBlackCheckRowLengthRight - k - 1;
          if (colIndex >= 0) blackCellsRight.push([currentRow, colIndex, 'A']);
        }
      }
      if (D > 0 && decRowsB.includes(currentRow)) {
        for (let k = 1; k <= D && k <= currentBlackCheckRowLengthRight; k++) {
          const colIndex = currentBlackCheckRowLengthRight - k - 1;
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

  return {
    additionalCellsPerPair,
    blackCells,
    calculatedGreyCells,
    blackCellsRight,
    calculatedGreyCellsRight,
  };
}

export function getVNeckLeftStitchCount(
  data: VNeckData,
  nhFrontV: number,
  highlightedRow: number,
): number {
  const rowNum = highlightedRow + 1;
  if (rowNum < 1 || rowNum > nhFrontV) return 0;

  const { additionalCellsPerPair, blackCells, calculatedGreyCells } = data;
  const rowLength = getRowLength(rowNum, additionalCellsPerPair);
  let count = rowLength;

  for (let j = 0; j < rowLength; j++) {
    const isBlack = blackCells.some((cell) => cell[0] === rowNum && cell[1] === j);
    const isGrey = calculatedGreyCells.has(`${rowNum},${j}`);
    if (isBlack || isGrey) count--;
  }
  return Math.max(0, count);
}

export function getVNeckRightStitchCount(
  data: VNeckData,
  nhFrontV: number,
  highlightedRow: number,
): number {
  const rowNum = highlightedRow + 1;
  if (rowNum < 1 || rowNum > nhFrontV) return 0;

  const { additionalCellsPerPair, blackCellsRight, calculatedGreyCellsRight } = data;
  const rowLength = getRowLength(rowNum, additionalCellsPerPair);
  let count = rowLength;

  for (let j = 0; j < rowLength; j++) {
    const isBlack = blackCellsRight.some((cell) => cell[0] === rowNum && cell[1] === j);
    const isGrey = calculatedGreyCellsRight.has(`${rowNum},${j}`);
    if (isBlack || isGrey) count--;
  }
  return Math.max(0, count);
}

function getGreyCellsLeft(
  blackCells: [number, number, string][],
  additionalCellsPerPair: number[],
  totalRows: number,
): Set<string> {
  const greyCellsSet = new Set<string>();
  for (const [blackRow, blackCol] of blackCells) {
    let greyCol = blackCol;
    for (let currentRow = blackRow + 1; currentRow <= totalRows; currentRow++) {
      if (currentRow % 2 !== 0) {
        const additionalCellsIndex = Math.floor(currentRow / 2);
        if (additionalCellsIndex >= 0 && additionalCellsIndex < additionalCellsPerPair.length) {
          greyCol += additionalCellsPerPair[additionalCellsIndex] || 0;
        }
      }
      greyCellsSet.add(`${currentRow},${greyCol}`);
    }
  }
  return greyCellsSet;
}

export function renderVNeckLeftArray(params: {
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

  const blackCells: [number, number, string][] = [];
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
          blackCells.push([currentRow, k, 'A']);
        }
      }
      if (D > 0 && decRowsB.includes(currentRow)) {
        for (let k = 1; k <= D && k <= currentBlackCheckRowLength; k++) {
          blackCells.push([currentRow, k, 'B']);
        }
      }
    }
  }

  const calculatedGreyCells = getGreyCellsLeft(blackCells, additionalCellsPerPair, nhFrontV);

  let currentRowLength = 0;
  const totalPairsRender = Math.ceil(nhFrontV / 2);
  let previousRowLength = 0;

  for (let i = 1; i <= totalPairsRender; i++) {
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
        if (isOddRow && j < currentRowLength - previousRowLength) {
          cellStyle = styles.ribbingCell;
        }

        let isBlackCell = false;
        const cellKey = `${currentRow},${j}`;

        for (const [blackRow, blackCol] of blackCells) {
          if (currentRow === blackRow && j === blackCol) {
            cellStyle = styles.decreaseCell;
            isBlackCell = true;
            break;
          }
        }

        if (!isBlackCell && calculatedGreyCells.has(cellKey)) {
          cellStyle = styles.cellsBelow;
        }

        row.push(
          <View
            key={`vneck-left-${currentRow}-${j}`}
            style={[cellStyle, currentRow === highlightedRow + 1 && styles.highlightedCell]}
          />,
        );
      }

      cells.push(
        <View key={`vneck-left-${currentRow}`} style={[styles.row, styles.leftRow]}>
          {row}
        </View>,
      );
    }
  }

  return cells;
}

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

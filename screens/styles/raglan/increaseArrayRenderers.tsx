import React from 'react';
import { Text, View, type ViewStyle } from 'react-native';

export type IncreaseArrayStyles = {
  row: ViewStyle;
  leftRow: ViewStyle;
  increaseCell: ViewStyle;
  defaultCell: ViewStyle;
  highlightedCell: ViewStyle;
  cell: ViewStyle;
  ribbingCell: ViewStyle;
};

const INCREASE_SYMBOL_LEFT = '↗';
const INCREASE_SYMBOL_RIGHT = '↖';

function IncreaseCellSymbol({ symbol }: { symbol: string }) {
  return <Text style={cellSymbolStyle}>{symbol}</Text>;
}

const cellSymbolStyle = {
  fontSize: 7,
  fontWeight: '700' as const,
  color: '#003366',
  lineHeight: 8,
};

export function renderLeftIncreaseArray(
  nhFront: number,
  highlightedRow: number,
  increaseRows: number[],
  styles: IncreaseArrayStyles
): React.ReactNode[] {
  const cells: React.ReactNode[] = [];
  let additionalCells = 0;

  for (let i = 0; i < nhFront; i++) {
    if (increaseRows.includes(i + 1)) {
      additionalCells++;
    }
    const row: React.ReactNode[] = [];
    for (let j = 0; j < additionalCells; j++) {
      const isCurrentRowIncrease = increaseRows.includes(i + 1);
      const cellStyle = isCurrentRowIncrease ? styles.increaseCell : styles.defaultCell;
      row.push(
        <View
          key={`${i}-${j}`}
          style={[cellStyle, cellContentStyle, i === highlightedRow && styles.highlightedCell]}
        >
          {isCurrentRowIncrease && j === additionalCells - 1 ? (
            <IncreaseCellSymbol symbol={INCREASE_SYMBOL_LEFT} />
          ) : null}
        </View>
      );
    }
    cells.push(
      <View key={`left-${i}`} style={[styles.row, styles.leftRow]}>
        {row}
      </View>
    );
  }
  return cells;
}

export function renderRightIncreaseArray(
  nhFront: number,
  highlightedRow: number,
  increaseRows: number[],
  styles: IncreaseArrayStyles
): React.ReactNode[] {
  const cells: React.ReactNode[] = [];
  let additionalCells = 0;

  for (let i = 0; i < nhFront; i++) {
    if (increaseRows.includes(i + 1)) {
      additionalCells++;
    }
    const row: React.ReactNode[] = [];
    for (let j = 0; j < additionalCells; j++) {
      const isCurrentRowIncrease = increaseRows.includes(i + 1);
      const cellStyle = isCurrentRowIncrease ? styles.increaseCell : styles.defaultCell;
      row.push(
        <View
          key={`${i}-${j}`}
          style={[cellStyle, cellContentStyle, i === highlightedRow && styles.highlightedCell]}
        >
          {isCurrentRowIncrease && j === 0 ? (
            <IncreaseCellSymbol symbol={INCREASE_SYMBOL_RIGHT} />
          ) : null}
        </View>
      );
    }
    cells.push(
      <View key={`right-${i}`} style={styles.row}>
        {row}
      </View>
    );
  }
  return cells;
}

export function renderBodyGrid(
  stitchCount: number,
  nhFront: number,
  highlightedRow: number,
  styles: IncreaseArrayStyles
): React.ReactNode[] {
  const cells: React.ReactNode[] = [];
  for (let i = -1; i < nhFront; i++) {
    const row: React.ReactNode[] = [];
    for (let j = 0; j < stitchCount; j++) {
      row.push(
        <View
          key={`${i}-${j}`}
          style={[
            i === -1 ? styles.ribbingCell : styles.cell,
            i === highlightedRow && styles.highlightedCell,
          ]}
        />
      );
    }
    cells.push(
      <View key={i} style={styles.row}>
        {row}
      </View>
    );
  }
  return cells;
}

const cellContentStyle = {
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RAGLAN_CELL_SIZE, stitchLabelIndices } from './raglanChartGridConstants';

type RowAxisProps = {
  rowCount: number;
  cellSize?: number;
  highlightedRow?: number;
  hasCollarRow?: boolean;
};

export function RaglanRowAxis({
  rowCount,
  cellSize = RAGLAN_CELL_SIZE,
  highlightedRow,
  hasCollarRow = false,
}: RowAxisProps) {
  if (rowCount <= 0) {
    return null;
  }

  return (
    <View style={styles.rowAxis}>
      {Array.from({ length: rowCount }, (_, idx) => {
        const rowLabel = hasCollarRow && idx === 0 ? '0' : String(hasCollarRow ? idx : idx + 1);
        const isHighlighted = hasCollarRow
          ? idx > 0 && idx - 1 === highlightedRow
          : idx === highlightedRow;

        return (
          <View key={idx} style={[styles.rowLabelCell, { height: cellSize }]}>
            <Text style={[styles.axisLabel, isHighlighted && styles.axisLabelHighlighted]}>
              {rowLabel}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

type StitchAxisProps = {
  colCount: number;
  cellSize?: number;
};

export function RaglanStitchAxis({ colCount, cellSize = RAGLAN_CELL_SIZE }: StitchAxisProps) {
  if (colCount <= 0) {
    return null;
  }

  const labels = new Set(stitchLabelIndices(colCount));

  return (
    <View style={[styles.stitchAxis, { width: colCount * cellSize }]}>
      {Array.from({ length: colCount }, (_, idx) => (
        <View key={idx} style={[styles.stitchLabelCell, { width: cellSize }]}>
          {labels.has(idx + 1) ? (
            <Text style={styles.axisLabel}>{idx + 1}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rowAxis: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingRight: 4,
    minWidth: 18,
  },
  rowLabelCell: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  stitchAxis: {
    flexDirection: 'row',
    height: 14,
    marginTop: 2,
  },
  stitchLabelCell: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  axisLabel: {
    fontSize: 7,
    color: '#555',
    fontWeight: '500',
  },
  axisLabelHighlighted: {
    color: '#c00',
    fontWeight: '700',
  },
});

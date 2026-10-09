import type { ChartCell, FlatChartModel } from './types';

const SYMBOL_LEFT = '↗';
const SYMBOL_RIGHT = '↖';

function buildIncreaseSideRows(
  nhFront: number,
  increaseRows: number[],
  side: 'left' | 'right',
): ChartCell[][] {
  const rows: ChartCell[][] = [];
  let additionalCells = 0;

  for (let i = 0; i < nhFront; i++) {
    if (increaseRows.includes(i + 1)) {
      additionalCells++;
    }
    const row: ChartCell[] = [];
    for (let j = 0; j < additionalCells; j++) {
      const isCurrentRowIncrease = increaseRows.includes(i + 1);
      const isSymbolCell =
        isCurrentRowIncrease &&
        (side === 'left' ? j === additionalCells - 1 : j === 0);
      const cell = {
        kind: isCurrentRowIncrease ? ('increase' as const) : ('increasePad' as const),
        ...(isSymbolCell
          ? { symbol: side === 'left' ? SYMBOL_LEFT : SYMBOL_RIGHT }
          : {}),
      };
      row.push(cell);
    }
    rows.push(row);
  }

  return rows;
}

function buildBodyRows(stitchCount: number, nhFront: number): ChartCell[][] {
  const rows: ChartCell[][] = [];
  for (let i = -1; i < nhFront; i++) {
    const row: ChartCell[] = [];
    for (let j = 0; j < stitchCount; j++) {
      row.push({ kind: i === -1 ? 'ribbing' : 'knit' });
    }
    rows.push(row);
  }
  return rows;
}

export function buildFlatChartModel(
  nhFront: number,
  stitchCount: number,
  increaseRows: number[],
  highlightedRow: number,
): FlatChartModel {
  return {
    nhFront,
    stitchCount,
    highlightedRow,
    bodyRows: buildBodyRows(stitchCount, nhFront),
    leftRows: buildIncreaseSideRows(nhFront, increaseRows, 'left'),
    rightRows: buildIncreaseSideRows(nhFront, increaseRows, 'right'),
  };
}

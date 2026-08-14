import React from 'react';
import { Path, Rect, Text as SvgText } from 'react-native-svg';
import {
  cellFill,
  CHART_AXIS_FILL,
  CHART_AXIS_HIGHLIGHT,
  CHART_HIGHLIGHT_FILL,
  CHART_PALETTE,
  CHART_STROKE,
} from './chartModels/palette';
import { RAGLAN_CELL_SIZE, stitchLabelIndices } from './raglanChartGridConstants';

export const ROW_AXIS_WIDTH = 20;
export const STITCH_AXIS_HEIGHT = 14;

/** Single path for outer border + internal grid lines (replaces per-cell strokes). */
export function buildGridLinesPath(
  cols: number,
  rows: number,
  offsetX: number,
  offsetY: number,
): string {
  if (cols <= 0 || rows <= 0) {
    return '';
  }

  const width = cols * RAGLAN_CELL_SIZE;
  const height = rows * RAGLAN_CELL_SIZE;
  const right = offsetX + width;
  const bottom = offsetY + height;
  const parts: string[] = [`M${offsetX},${offsetY}H${right}V${bottom}H${offsetX}Z`];

  for (let col = 1; col < cols; col++) {
    const x = offsetX + col * RAGLAN_CELL_SIZE;
    parts.push(`M${x},${offsetY}V${bottom}`);
  }

  for (let row = 1; row < rows; row++) {
    const y = offsetY + row * RAGLAN_CELL_SIZE;
    parts.push(`M${offsetX},${y}H${right}`);
  }

  return parts.join('');
}

export function renderRowAxisLabels(
  rowCount: number,
  highlightedRow: number,
  keyPrefix: string,
): React.ReactNode[] {
  const labels: React.ReactNode[] = [];
  for (let rowIdx = 0; rowIdx < rowCount; rowIdx++) {
    const y = rowIdx * RAGLAN_CELL_SIZE;
    const rowHighlighted = rowIdx === highlightedRow;
    labels.push(
      <SvgText
        key={`${keyPrefix}-row-${rowIdx}`}
        x={ROW_AXIS_WIDTH - 4}
        y={y + RAGLAN_CELL_SIZE * 0.72}
        fontSize={7}
        fill={rowHighlighted ? CHART_AXIS_HIGHLIGHT : CHART_AXIS_FILL}
        fontWeight={rowHighlighted ? '700' : '500'}
        textAnchor="end"
      >
        {String(rowIdx + 1)}
      </SvgText>,
    );
  }
  return labels;
}

export function renderStitchAxisLabels(
  colCount: number,
  gridYOffset: number,
  gridXOffset: number,
  keyPrefix: string,
): React.ReactNode[] {
  const labels = new Set(stitchLabelIndices(colCount));
  const nodes: React.ReactNode[] = [];
  for (let col = 1; col <= colCount; col++) {
    if (!labels.has(col)) {
      continue;
    }
    nodes.push(
      <SvgText
        key={`${keyPrefix}-stitch-${col}`}
        x={gridXOffset + (col - 1) * RAGLAN_CELL_SIZE + RAGLAN_CELL_SIZE / 2}
        y={gridYOffset + 11}
        fontSize={7}
        fill={CHART_AXIS_FILL}
        textAnchor="middle"
      >
        {String(col)}
      </SvgText>,
    );
  }
  return nodes;
}

export function renderUniformGridStatic(
  cols: number,
  rows: number,
  keyPrefix: string,
  offsetX = 0,
  offsetY = 0,
  baseFill = CHART_PALETTE.ribbing,
): React.ReactNode[] {
  if (cols <= 0 || rows <= 0) {
    return [];
  }

  const width = cols * RAGLAN_CELL_SIZE;
  const height = rows * RAGLAN_CELL_SIZE;
  const gridPath = buildGridLinesPath(cols, rows, offsetX, offsetY);

  return [
    <Rect
      key={`${keyPrefix}-bg`}
      x={offsetX}
      y={offsetY}
      width={width}
      height={height}
      fill={baseFill}
    />,
    <Path
      key={`${keyPrefix}-grid`}
      d={gridPath}
      stroke={CHART_STROKE}
      strokeWidth={1}
      fill="none"
    />,
  ];
}

export function renderUniformGridHighlight(
  cols: number,
  rows: number,
  highlightedRow: number,
  keyPrefix: string,
  offsetX = 0,
  offsetY = 0,
): React.ReactNode | null {
  if (cols <= 0 || highlightedRow < 0 || highlightedRow >= rows) {
    return null;
  }

  return (
    <Rect
      key={`${keyPrefix}-hl`}
      x={offsetX}
      y={offsetY + highlightedRow * RAGLAN_CELL_SIZE}
      width={cols * RAGLAN_CELL_SIZE}
      height={RAGLAN_CELL_SIZE}
      fill={CHART_HIGHLIGHT_FILL}
    />
  );
}

/** @deprecated Prefer renderUniformGridStatic + renderUniformGridHighlight. */
export function renderUniformGrid(
  cols: number,
  rows: number,
  highlightedRow: number,
  keyPrefix: string,
  offsetX = 0,
  offsetY = 0,
): React.ReactNode[] {
  return [
    ...renderUniformGridStatic(cols, rows, keyPrefix, offsetX, offsetY),
    renderUniformGridHighlight(cols, rows, highlightedRow, keyPrefix, offsetX, offsetY),
  ].filter(Boolean);
}

export function renderLabeledGridSectionStatic(
  cols: number,
  rows: number,
  sectionId: string,
  options?: { showRowAxis?: boolean; showStitchAxis?: boolean },
): React.ReactNode[] {
  const showRowAxis = options?.showRowAxis ?? false;
  const showStitchAxis = options?.showStitchAxis ?? false;
  const gridX = showRowAxis ? ROW_AXIS_WIDTH : 0;
  const gridHeight = rows * RAGLAN_CELL_SIZE;
  const nodes: React.ReactNode[] = [];

  nodes.push(...renderUniformGridStatic(cols, rows, sectionId, gridX, 0));

  if (showStitchAxis) {
    nodes.push(...renderStitchAxisLabels(cols, gridHeight, gridX, sectionId));
  }

  return nodes;
}

export function renderLabeledGridSectionOverlay(
  cols: number,
  rows: number,
  highlightedRow: number,
  sectionId: string,
  options?: { showRowAxis?: boolean },
): React.ReactNode[] {
  const showRowAxis = options?.showRowAxis ?? false;
  const gridX = showRowAxis ? ROW_AXIS_WIDTH : 0;
  const nodes: React.ReactNode[] = [];

  const highlight = renderUniformGridHighlight(cols, rows, highlightedRow, sectionId, gridX, 0);
  if (highlight) {
    nodes.push(highlight);
  }

  if (showRowAxis) {
    nodes.push(...renderRowAxisLabels(rows, highlightedRow, sectionId));
  }

  return nodes;
}

export function renderLabeledGridSection(
  cols: number,
  rows: number,
  highlightedRow: number,
  sectionId: string,
  options?: { showRowAxis?: boolean; showStitchAxis?: boolean },
): React.ReactNode[] {
  return [
    ...renderLabeledGridSectionStatic(cols, rows, sectionId, options),
    ...renderLabeledGridSectionOverlay(cols, rows, highlightedRow, sectionId, options),
  ];
}

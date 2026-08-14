import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Rect, Text as SvgText } from 'react-native-svg';
import { RaglanZoomableView } from './RaglanZoomableView';
import type { FlatChartModel } from './chartModels/types';
import {
  cellFill,
  CHART_AXIS_FILL,
  CHART_AXIS_HIGHLIGHT,
  CHART_HIGHLIGHT_FILL,
  CHART_PALETTE,
  CHART_SYMBOL_FILL,
} from './chartModels/palette';
import { buildGridLinesPath } from './raglanSvgPrimitives';
import { RAGLAN_CELL_SIZE, stitchLabelIndices } from './raglanChartGridConstants';

const ROW_AXIS_WIDTH = 20;
const STITCH_AXIS_HEIGHT = 14;
const CHART_PADDING = 8;

type Layout = {
  width: number;
  height: number;
  bodyX: number;
  bodyWidth: number;
  chartHeight: number;
  leftWidth: number;
  rightWidth: number;
};

function computeLayout(model: FlatChartModel): Layout {
  const maxLeft = Math.max(0, ...model.leftRows.map((row) => row.length));
  const maxRight = Math.max(0, ...model.rightRows.map((row) => row.length));
  const bodyWidth = model.stitchCount * RAGLAN_CELL_SIZE;
  const leftWidth = maxLeft * RAGLAN_CELL_SIZE;
  const rightWidth = maxRight * RAGLAN_CELL_SIZE;
  const chartHeight = (model.nhFront + 1) * RAGLAN_CELL_SIZE;

  return {
    width: ROW_AXIS_WIDTH + leftWidth + bodyWidth + rightWidth + CHART_PADDING * 2,
    height: chartHeight + STITCH_AXIS_HEIGHT + CHART_PADDING * 2,
    bodyX: CHART_PADDING + ROW_AXIS_WIDTH + leftWidth,
    bodyWidth,
    chartHeight: chartHeight + CHART_PADDING,
    leftWidth,
    rightWidth,
  };
}

type Props = {
  model: FlatChartModel;
  highlightedRow: number;
};

export function RaglanSvgChart({ model, highlightedRow }: Props) {
  const layout = useMemo(
    () => computeLayout(model),
    [model.nhFront, model.stitchCount, model.leftRows, model.rightRows],
  );

  const stitchLabels = useMemo(
    () => new Set(stitchLabelIndices(model.stitchCount)),
    [model.stitchCount],
  );

  const top = CHART_PADDING;
  const { bodyX, bodyWidth, chartHeight } = layout;

  const staticNodes = useMemo(() => {
    const nodes: React.ReactNode[] = [];
    const cell = RAGLAN_CELL_SIZE;
    const bodyRows = model.nhFront + 1;

    nodes.push(
      <Rect
        key="body-collar"
        x={bodyX}
        y={top}
        width={bodyWidth}
        height={cell}
        fill={CHART_PALETTE.ribbing}
      />,
    );

    if (model.nhFront > 0) {
      nodes.push(
        <Rect
          key="body-knit"
          x={bodyX}
          y={top + cell}
          width={bodyWidth}
          height={model.nhFront * cell}
          fill={CHART_PALETTE.knit}
        />,
      );
    }

    const bodyGridPath = buildGridLinesPath(model.stitchCount, bodyRows, bodyX, top);
    if (bodyGridPath) {
      nodes.push(
        <Path key="body-grid" d={bodyGridPath} stroke="#000000" strokeWidth={1} fill="none" />,
      );
    }

    model.leftRows.forEach((row, rowIdx) => {
      if (row.length === 0) {
        return;
      }

      const y = top + (rowIdx + 1) * cell;
      const rowStartX = bodyX - row.length * cell;

      row.forEach((chartCell, colIdx) => {
        const x = rowStartX + colIdx * cell;
        nodes.push(
          <Rect
            key={`left-${rowIdx}-${colIdx}`}
            x={x}
            y={y}
            width={cell}
            height={cell}
            fill={cellFill(chartCell.kind, false)}
          />,
        );
      });

      const rowGridPath = buildGridLinesPath(row.length, 1, rowStartX, y);
      if (rowGridPath) {
        nodes.push(
          <Path
            key={`left-grid-${rowIdx}`}
            d={rowGridPath}
            stroke="#000000"
            strokeWidth={1}
            fill="none"
          />,
        );
      }
    });

    model.rightRows.forEach((row, rowIdx) => {
      if (row.length === 0) {
        return;
      }

      const y = top + (rowIdx + 1) * cell;
      const rowStartX = bodyX + bodyWidth;

      row.forEach((chartCell, colIdx) => {
        const x = rowStartX + colIdx * cell;
        nodes.push(
          <Rect
            key={`right-${rowIdx}-${colIdx}`}
            x={x}
            y={y}
            width={cell}
            height={cell}
            fill={cellFill(chartCell.kind, false)}
          />,
        );
      });

      const rowGridPath = buildGridLinesPath(row.length, 1, rowStartX, y);
      if (rowGridPath) {
        nodes.push(
          <Path
            key={`right-grid-${rowIdx}`}
            d={rowGridPath}
            stroke="#000000"
            strokeWidth={1}
            fill="none"
          />,
        );
      }
    });

    for (let col = 1; col <= model.stitchCount; col++) {
      if (!stitchLabels.has(col)) {
        continue;
      }
      const x = bodyX + (col - 1) * cell + cell / 2;
      nodes.push(
        <SvgText
          key={`stitch-${col}`}
          x={x}
          y={chartHeight + 11}
          fontSize={7}
          fill={CHART_AXIS_FILL}
          textAnchor="middle"
        >
          {String(col)}
        </SvgText>,
      );
    }

    return nodes;
  }, [
    model.nhFront,
    model.stitchCount,
    model.leftRows,
    model.rightRows,
    layout,
    stitchLabels,
    bodyX,
    bodyWidth,
    chartHeight,
    top,
  ]);

  const overlayNodes = useMemo(() => {
    const nodes: React.ReactNode[] = [];
    const cell = RAGLAN_CELL_SIZE;
    const bodyHighlightRow = highlightedRow + 1;

    if (bodyHighlightRow > 0 && bodyHighlightRow <= model.nhFront) {
      nodes.push(
        <Rect
          key="body-highlight"
          x={bodyX}
          y={top + bodyHighlightRow * cell}
          width={bodyWidth}
          height={cell}
          fill={CHART_HIGHLIGHT_FILL}
        />,
      );
    }

    model.leftRows.forEach((row, rowIdx) => {
      if (row.length === 0 || rowIdx !== highlightedRow) {
        return;
      }

      const y = top + (rowIdx + 1) * cell;
      const rowStartX = bodyX - row.length * cell;
      nodes.push(
        <Rect
          key={`left-highlight-${rowIdx}`}
          x={rowStartX}
          y={y}
          width={row.length * cell}
          height={cell}
          fill={CHART_HIGHLIGHT_FILL}
        />,
      );
    });

    model.rightRows.forEach((row, rowIdx) => {
      if (row.length === 0 || rowIdx !== highlightedRow) {
        return;
      }

      const y = top + (rowIdx + 1) * cell;
      const rowStartX = bodyX + bodyWidth;
      nodes.push(
        <Rect
          key={`right-highlight-${rowIdx}`}
          x={rowStartX}
          y={y}
          width={row.length * cell}
          height={cell}
          fill={CHART_HIGHLIGHT_FILL}
        />,
      );
    });

    return nodes;
  }, [highlightedRow, model.nhFront, model.leftRows, model.rightRows, bodyX, bodyWidth, top]);

  const symbolNodes = useMemo(() => {
    const nodes: React.ReactNode[] = [];
    const cell = RAGLAN_CELL_SIZE;

    const pushSideSymbols = (
      rows: FlatChartModel['leftRows'],
      side: 'left' | 'right',
    ) => {
      rows.forEach((row, rowIdx) => {
        if (row.length === 0) {
          return;
        }

        const y = top + (rowIdx + 1) * cell;
        const rowStartX =
          side === 'left' ? bodyX - row.length * cell : bodyX + bodyWidth;

        row.forEach((chartCell, colIdx) => {
          if (!chartCell.symbol) {
            return;
          }

          const x = rowStartX + colIdx * cell;
          nodes.push(
            <SvgText
              key={`${side}-symbol-${rowIdx}-${colIdx}`}
              x={x + cell / 2}
              y={y + cell * 0.72}
              fontSize={7}
              fill={CHART_SYMBOL_FILL}
              fontWeight="700"
              textAnchor="middle"
            >
              {chartCell.symbol}
            </SvgText>,
          );
        });
      });
    };

    pushSideSymbols(model.leftRows, 'left');
    pushSideSymbols(model.rightRows, 'right');

    return nodes;
  }, [model.leftRows, model.rightRows, bodyX, bodyWidth, top]);

  const rowLabels = useMemo(() => {
    const nodes: React.ReactNode[] = [];
    const cell = RAGLAN_CELL_SIZE;

    for (let rowIdx = 0; rowIdx <= model.nhFront; rowIdx++) {
      const y = top + rowIdx * cell;
      const knittingRowIdx = rowIdx - 1;
      const rowHighlighted = rowIdx > 0 && knittingRowIdx === highlightedRow;
      const rowLabel = rowIdx === 0 ? '0' : String(rowIdx);

      nodes.push(
        <SvgText
          key={`row-${rowIdx}`}
          x={CHART_PADDING + ROW_AXIS_WIDTH - 4}
          y={y + cell * 0.72}
          fontSize={7}
          fill={rowHighlighted ? CHART_AXIS_HIGHLIGHT : CHART_AXIS_FILL}
          fontWeight={rowHighlighted ? '700' : '500'}
          textAnchor="end"
        >
          {rowLabel}
        </SvgText>,
      );
    }

    return nodes;
  }, [highlightedRow, model.nhFront, top]);

  return (
    <View style={styles.chartArea}>
      <RaglanZoomableView>
        <Svg width={layout.width} height={layout.height}>
          <Rect
            x={CHART_PADDING + ROW_AXIS_WIDTH}
            y={top}
            width={layout.leftWidth + bodyWidth + layout.rightWidth}
            height={model.nhFront * RAGLAN_CELL_SIZE}
            fill="none"
            stroke="#C6C6C6"
            strokeWidth={1}
          />
          {staticNodes}
          {overlayNodes}
          {symbolNodes}
          {rowLabels}
        </Svg>
      </RaglanZoomableView>
    </View>
  );
}

const styles = StyleSheet.create({
  chartArea: {
    flex: 1,
    minHeight: 200,
    width: '100%',
  },
});

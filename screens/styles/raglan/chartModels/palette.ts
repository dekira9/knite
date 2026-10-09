import type { ChartCellKind } from './types';

export const CHART_PALETTE: Record<ChartCellKind, string> = {
  ribbing: 'yellow',
  knit: '#FDCFE1',
  increasePad: '#ffe9f1',
  increase: '#00ADF2',
};

export const CHART_HIGHLIGHT_FILL = '#ff0000';
export const CHART_STROKE = '#000000';
export const CHART_SYMBOL_FILL = '#003366';
export const CHART_AXIS_FILL = '#555555';
export const CHART_AXIS_HIGHLIGHT = '#cc0000';

export function cellFill(kind: ChartCellKind, highlighted: boolean): string {
  return highlighted ? CHART_HIGHLIGHT_FILL : CHART_PALETTE[kind];
}

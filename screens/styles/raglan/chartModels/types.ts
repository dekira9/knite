export type ChartCellKind = 'ribbing' | 'knit' | 'increasePad' | 'increase';

export interface ChartCell {
  kind: ChartCellKind;
  symbol?: string;
}

/** Flat front/back/sleeve chart: collar row + raglan increase wings + body. */
export interface FlatChartModel {
  nhFront: number;
  stitchCount: number;
  highlightedRow: number;
  /** Collar row first, then nhFront knitting rows. */
  bodyRows: ChartCell[][];
  /** nhFront rows aligned with knitting rows (not collar). */
  leftRows: ChartCell[][];
  rightRows: ChartCell[][];
}

export type RibbingSectionId =
  | 'line3'
  | 'back'
  | 'line4'
  | 'leftSleeve'
  | 'line1'
  | 'front'
  | 'line2'
  | 'rightSleeve';

export interface RibbingGridSection {
  id: RibbingSectionId;
  cols: number;
  rows: number;
  layoutX: number;
  layoutY: number;
  svgTransform: string;
  showRowAxis?: boolean;
  showStitchAxis?: boolean;
}

export interface RibbingChartModel {
  nrRez: number;
  highlightedRow: number;
  stitchCountFront: number;
  sections: RibbingGridSection[];
  width: number;
  height: number;
}

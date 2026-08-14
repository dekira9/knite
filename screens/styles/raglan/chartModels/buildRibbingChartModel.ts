import { RAGLAN_CELL_SIZE } from '../raglanChartGridConstants';
import type { RibbingChartModel, RibbingGridSection } from './types';

const ROW_AXIS_WIDTH = 20;
const STITCH_AXIS_HEIGHT = 14;
const CHART_PADDING = 0;
const SIN45 = Math.sin(Math.PI / 4);
const COS45 = Math.cos(Math.PI / 4);

/** Same transform chain as legacy ribbingO View layout (transformOrigin top-left). */
function line3Transform(nr: number, k: number, lx: number, ly: number): string {
  const c = RAGLAN_CELL_SIZE;
  return `translate(${lx}, ${ly}) translate(0, ${nr * c}) translate(${k * c}, 0) rotate(-225)`;
}

/** Same transform chain as legacy ribbingO View layout (transformOrigin top-right). */
function line4Transform(nr: number, k: number, lx: number, ly: number): string {
  const c = RAGLAN_CELL_SIZE;
  const w = k * c;
  return `translate(${lx + w}, ${ly}) translate(0, ${nr * c}) translate(${-w}, 0) rotate(225) translate(${-w}, 0)`;
}

function line1Transform(lx: number, ly: number, k: number): string {
  const w = k * RAGLAN_CELL_SIZE;
  return `translate(${lx + w}, ${ly}) rotate(45) translate(${-w}, 0)`;
}

function line2Transform(lx: number, ly: number): string {
  return `translate(${lx}, ${ly}) rotate(-45)`;
}

/** Legacy ribbingO: transformOrigin top-right; translateY, translateX, then rotate 90°. */
function leftSleeveTransform(lx: number, ly: number, sa: number, k: number): string {
  const c = RAGLAN_CELL_SIZE;
  const w = sa * c;
  const kc = k * c;
  const ty = -kc * SIN45;
  const tx = kc * (1 - COS45);
  return `translate(${lx + w}, ${ly}) translate(${tx}, ${ty}) rotate(90) translate(${-w}, 0)`;
}

/** Legacy ribbingO: transformOrigin top-left; translateY, translateX, then rotate -90°. */
function rightSleeveTransform(lx: number, ly: number, k: number): string {
  const c = RAGLAN_CELL_SIZE;
  const kc = k * c;
  const ty = -kc * SIN45;
  const tx = kc * (COS45 - 1);
  return `translate(${lx}, ${ly}) translate(${tx}, ${ty}) rotate(-90)`;
}

function labeledBodyTransform(lx: number, ly: number): string {
  return `translate(${lx - ROW_AXIS_WIDTH}, ${ly})`;
}

function backTransform(bodyLeft: number, topY: number, bodyWidth: number, gridHeight: number): string {
  const pivotX = ROW_AXIS_WIDTH + bodyWidth / 2;
  return `${labeledBodyTransform(bodyLeft, topY)} rotate(180, ${pivotX}, ${gridHeight / 2})`;
}

export function buildRibbingChartModel(
  sFront: number,
  sa: number,
  k: number,
  nrRez: number,
  highlightedRow: number,
): RibbingChartModel {
  const cell = RAGLAN_CELL_SIZE;
  const gridHeight = nrRez * cell;
  const bodyWidth = sFront * cell;

  // Legacy ribbingO: flex row widths are grid-only; row-axis sits in left margin.
  const originX = ROW_AXIS_WIDTH + CHART_PADDING;
  const originY = CHART_PADDING + k * cell * SIN45;

  const bodyLeft = originX + sa * cell + k * cell;
  const topY = originY;
  const bottomY = topY + gridHeight + sa * cell + 2 * k * cell * SIN45;

  const line3X = originX + sa * cell;
  const line4X = bodyLeft + bodyWidth;
  const line1X = originX + sa * cell;
  const line2X = bodyLeft + bodyWidth;
  const rightSleeveX = line2X + k * cell;

  const sections: RibbingGridSection[] = [
    {
      id: 'line3',
      cols: k,
      rows: nrRez,
      layoutX: line3X,
      layoutY: topY,
      svgTransform: line3Transform(nrRez, k, line3X, topY),
    },
    {
      id: 'back',
      cols: sFront,
      rows: nrRez,
      layoutX: bodyLeft,
      layoutY: topY,
      svgTransform: backTransform(bodyLeft, topY, bodyWidth, gridHeight),
      showRowAxis: true,
    },
    {
      id: 'line4',
      cols: k,
      rows: nrRez,
      layoutX: line4X,
      layoutY: topY,
      svgTransform: line4Transform(nrRez, k, line4X, topY),
    },
    {
      id: 'leftSleeve',
      cols: sa,
      rows: nrRez,
      layoutX: originX,
      layoutY: bottomY,
      svgTransform: leftSleeveTransform(originX, bottomY, sa, k),
    },
    {
      id: 'line1',
      cols: k,
      rows: nrRez,
      layoutX: line1X,
      layoutY: bottomY,
      svgTransform: line1Transform(line1X, bottomY, k),
    },
    {
      id: 'front',
      cols: sFront,
      rows: nrRez,
      layoutX: bodyLeft,
      layoutY: bottomY,
      svgTransform: labeledBodyTransform(bodyLeft, bottomY),
      showRowAxis: true,
      showStitchAxis: true,
    },
    {
      id: 'line2',
      cols: k,
      rows: nrRez,
      layoutX: line2X,
      layoutY: bottomY,
      svgTransform: line2Transform(line2X, bottomY),
    },
    {
      id: 'rightSleeve',
      cols: sa,
      rows: nrRez,
      layoutX: rightSleeveX,
      layoutY: bottomY,
      svgTransform: rightSleeveTransform(rightSleeveX, bottomY, k),
    },
  ];

  const rowWidth = (2 * sa + 2 * k + sFront) * cell;
  const width = originX + rowWidth + CHART_PADDING + k * cell;
  const height =
    bottomY +
    gridHeight +
    STITCH_AXIS_HEIGHT +
    CHART_PADDING +
    sa * cell +
    k * cell * 2;

  return {
    nrRez,
    highlightedRow,
    stitchCountFront: sFront,
    sections,
    width,
    height,
  };
}

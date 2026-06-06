import { RAGLAN_CELL_SIZE } from '../raglanChartGridConstants';
import type { RibbingChartModel, RibbingGridSection } from './types';

const ROW_AXIS_WIDTH = 20;
const STITCH_AXIS_HEIGHT = 14;
const CHART_PADDING = 8;
const SIN45 = Math.sin(Math.PI / 4);
const COS45 = Math.cos(Math.PI / 4);

function line3Transform(nr: number, k: number, lx: number, ly: number): string {
  const c = RAGLAN_CELL_SIZE;
  return `translate(${lx}, ${ly}) translate(0, ${nr * c}) translate(${k * c}, 0) rotate(-225)`;
}

function line4Transform(nr: number, k: number, lx: number, ly: number): string {
  const c = RAGLAN_CELL_SIZE;
  return `translate(${lx}, ${ly}) translate(0, ${nr * c}) translate(${-k * c}, 0) rotate(225)`;
}

function line1Transform(lx: number, ly: number, k: number): string {
  const w = k * RAGLAN_CELL_SIZE;
  return `translate(${lx + w}, ${ly}) rotate(45) translate(${-w}, 0)`;
}

function line2Transform(lx: number, ly: number): string {
  return `translate(${lx}, ${ly}) rotate(-45)`;
}

function leftSleeveTransform(lx: number, ly: number, sa: number, k: number): string {
  const c = RAGLAN_CELL_SIZE;
  const w = sa * c;
  const ty = -k * c * SIN45;
  const tx = k * c - k * c * COS45;
  return `translate(${lx + w}, ${ly}) rotate(90) translate(${-w}, 0) translate(${tx}, ${ty})`;
}

function rightSleeveTransform(lx: number, ly: number, k: number): string {
  const c = RAGLAN_CELL_SIZE;
  const ty = -k * c * SIN45;
  const tx = -k * c + k * c * COS45;
  return `translate(${lx}, ${ly}) rotate(-90) translate(${tx}, ${ty})`;
}

function backTransform(lx: number, ly: number, width: number, height: number): string {
  return `translate(${lx}, ${ly}) rotate(180, ${width / 2}, ${height / 2})`;
}

export function buildRibbingChartModel(
  sFront: number,
  sa: number,
  k: number,
  nrRez: number,
  highlightedRow: number,
): RibbingChartModel {
  const cell = RAGLAN_CELL_SIZE;
  const labeledWidth = ROW_AXIS_WIDTH + sFront * cell;
  const labeledHeight = nrRez * cell + STITCH_AXIS_HEIGHT;
  const frontX = sa * cell + k * cell;
  const topY = CHART_PADDING;
  const bottomY = topY + labeledHeight + sa * cell + 2 * k * cell * SIN45;

  const line3X = frontX - k * cell;
  const backX = frontX;
  const line4X = frontX + labeledWidth;
  const line1X = sa * cell;
  const line2X = frontX + labeledWidth;
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
      layoutX: backX,
      layoutY: topY,
      svgTransform: backTransform(backX, topY, labeledWidth, labeledHeight),
      showRowAxis: true,
      showStitchAxis: true,
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
      layoutX: 0,
      layoutY: bottomY,
      svgTransform: leftSleeveTransform(0, bottomY, sa, k),
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
      layoutX: frontX,
      layoutY: bottomY,
      svgTransform: `translate(${frontX}, ${bottomY})`,
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

  const width = CHART_PADDING * 2 + rightSleeveX + sa * cell + k * cell;
  const height = CHART_PADDING * 2 + bottomY + nrRez * cell + sa * cell + k * cell * 2;

  return {
    nrRez,
    highlightedRow,
    stitchCountFront: sFront,
    sections,
    width,
    height,
  };
}

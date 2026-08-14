export const RAGLAN_CELL_SIZE = 10;

/** 1-based stitch indices to label under the grid. */
export function stitchLabelIndices(colCount: number): number[] {
  if (colCount <= 0) {
    return [];
  }
  const step = colCount > 30 ? 10 : colCount > 15 ? 5 : 1;
  const indices: number[] = [];
  for (let i = 1; i <= colCount; i += step) {
    indices.push(i);
  }
  if (indices[indices.length - 1] !== colCount) {
    indices.push(colCount);
  }
  return indices;
}

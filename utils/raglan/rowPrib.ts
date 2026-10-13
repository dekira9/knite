export function buildEveryNthRows(count: number, step: number): number[] {
  return Array.from({ length: count }, (_, index) => 1 + index * step);
}

export function buildRowPribBundle(sfx: number) {
  const RowPrib1x4 = buildEveryNthRows(sfx, 4);
  const RowPrib1x3 = buildEveryNthRows(sfx, 3);
  const RowPrib1x2 = buildEveryNthRows(sfx, 2);
  const RowPrib1x1 = buildEveryNthRows(sfx, 1);
  return {
    RowPrib1x4,
    RowPrib1x3,
    RowPrib1x2,
    RowPrib1x1,
    RowPrib1x4String: RowPrib1x4.join(', '),
    RowPrib1x3String: RowPrib1x3.join(', '),
    RowPrib1x2String: RowPrib1x2.join(', '),
    RowPrib1x1String: RowPrib1x1.join(', '),
  };
}

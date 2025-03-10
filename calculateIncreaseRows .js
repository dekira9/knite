const calculateIncreaseRows = (NHFront: number, Sfx: number, PR_1x4_f: number, PR_1x2_f: number) => {
  const KB = Sfx / PR_1x4_f;
  const B = Array.from({ length: PR_1x4_f }, (_, b) => b + 1);
  const PozB = B.map(b => Math.round(KB * b));
  console.log('PozB', PozB);
  const A = Array.from({ length: PR_1x2_f }, (_, a) => a + 1);

  const increaseRows = [];
  let currentRow = 1;
  let aIndex = 0;
  let bIndex = 0;

  while (currentRow <= NHFront && (aIndex < A.length || bIndex < B.length)) {
    if (aIndex < A.length) {
      increaseRows.push(currentRow);
      currentRow += 2; // Один ряд с прибавкой, один без
      aIndex++;
    }
    if (bIndex < B.length && currentRow <= NHFront) {
      increaseRows.push(currentRow);
      currentRow += 4; // Один ряд с прибавкой, три без
      bIndex++;
    }
  }

  return increaseRows;
};

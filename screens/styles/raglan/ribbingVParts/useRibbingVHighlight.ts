// Row highlight state and prev/next navigation for the v-neck ribbing chart.
import { useState } from 'react';

export function useRibbingVHighlight(nrRezV: number) {
  const [highlightedRow, setHighlightedRow] = useState(-1);

  const highlightNextRow = () => {
    setHighlightedRow((prev) => {
      const newRow = (prev + 1) % (nrRezV + 1);
      return newRow === nrRezV ? -1 : newRow;
    });
  };

  const highlightPreviousRow = () => {
    setHighlightedRow((prev) => {
      const newRow = (prev - 1 + (nrRezV + 1)) % (nrRezV + 1);
      return newRow === nrRezV ? -1 : newRow;
    });
  };

  return { highlightedRow, highlightNextRow, highlightPreviousRow };
}

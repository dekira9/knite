import React, { useMemo } from 'react';
import { buildFlatChartModel } from './chartModels/buildFlatChartModel';
import { RaglanSvgChart } from './RaglanSvgChart';

type Props = {
  nhFront: number;
  stitchCount: number;
  highlightedRow: number;
  increaseRows: number[];
};

export function RaglanFlatChartGrid({
  nhFront,
  stitchCount,
  highlightedRow,
  increaseRows,
}: Props) {
  const model = useMemo(
    () => buildFlatChartModel(nhFront, stitchCount, increaseRows, 0),
    [nhFront, stitchCount, increaseRows],
  );

  return <RaglanSvgChart model={model} highlightedRow={highlightedRow} />;
}

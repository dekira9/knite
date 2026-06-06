import { useState } from 'react';
import introState from '@/state/introState';
import type { RaglanChartId } from './chartIds';

export function useRaglanChartState(
  chartId: RaglanChartId,
  nhFront: number,
  usedIncreaseTypes: string[] | undefined,
) {
  const [selectedIncreaseType, setSelectedIncreaseType] = useState(usedIncreaseTypes?.[0] || '');
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const highlightedRow = introState.getChartHighlightedRow(chartId, nhFront);
  const currentIndex = usedIncreaseTypes ? usedIncreaseTypes.indexOf(selectedIncreaseType) : -1;

  const highlightNextRow = () => {
    introState.setChartHighlightedRow(chartId, (highlightedRow + 1) % nhFront);
  };

  const highlightPreviousRow = () => {
    introState.setChartHighlightedRow(chartId, (highlightedRow - 1 + nhFront) % nhFront);
  };

  const handleIncreaseTypePress = (type: string) => {
    setSelectedIncreaseType(type);
    if (selectedIncreaseType === type) {
      setIsDetailsExpanded(!isDetailsExpanded);
    } else {
      setIsDetailsExpanded(false);
    }
  };

  return {
    highlightedRow,
    selectedIncreaseType,
    isDetailsExpanded,
    currentIndex,
    highlightNextRow,
    highlightPreviousRow,
    handleIncreaseTypePress,
    setSelectedIncreaseType,
    setIsDetailsExpanded,
  };
}

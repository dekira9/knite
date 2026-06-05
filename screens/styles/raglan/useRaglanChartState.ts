import { useState } from 'react';

export function useRaglanChartState(nhFront: number, usedIncreaseTypes: string[] | undefined) {
  const [highlightedRow, setHighlightedRow] = useState(0);
  const [selectedIncreaseType, setSelectedIncreaseType] = useState(usedIncreaseTypes?.[0] || '');
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const currentIndex = usedIncreaseTypes ? usedIncreaseTypes.indexOf(selectedIncreaseType) : -1;

  const highlightNextRow = () => {
    setHighlightedRow((prev) => (prev + 1) % nhFront);
  };

  const highlightPreviousRow = () => {
    setHighlightedRow((prev) => (prev - 1 + nhFront) % nhFront);
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

import React, { useMemo } from 'react';
import { View } from 'react-native';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import { RAGLAN_CHART_IDS } from './chartIds';
import { buildRibbingChartModel } from './chartModels/buildRibbingChartModel';
import { RaglanChartLegend } from './RaglanChartLegend';
import { RaglanChartRowToolbar } from './RaglanChartRowToolbar';
import { raglanChartPageStyles } from './raglanChartPageStyles';
import { RaglanRibbingSvgChart } from './RaglanRibbingSvgChart';

const App = observer(() => {
  const { SFrontO, Sa, K, NRrez } = introState;
  const highlightedRow = introState.getChartHighlightedRow(RAGLAN_CHART_IDS.ribbingO, NRrez);
  const stitchCount = K * 4 + 2 * SFrontO + 2 * Sa;

  const chartModel = useMemo(
    () => buildRibbingChartModel(SFrontO, Sa, K, NRrez, 0),
    [SFrontO, Sa, K, NRrez],
  );

  const highlightNextRow = () => {
    introState.setChartHighlightedRow(RAGLAN_CHART_IDS.ribbingO, (highlightedRow + 1) % NRrez);
  };

  const highlightPreviousRow = () => {
    introState.setChartHighlightedRow(RAGLAN_CHART_IDS.ribbingO, (highlightedRow - 1 + NRrez) % NRrez);
  };

  return (
    <View style={raglanChartPageStyles.page}>
      <View style={raglanChartPageStyles.legendStrip}>
        <RaglanChartLegend variant="ribbing" layout="compact" />
      </View>

      <View style={raglanChartPageStyles.chartArea}>
        <RaglanRibbingSvgChart model={chartModel} highlightedRow={highlightedRow} />
      </View>

      <RaglanChartRowToolbar
        variant="slim"
        currentRow={highlightedRow}
        totalRows={NRrez}
        stitchCount={stitchCount}
        onStop={() =>
          introState.setChartStoppedRow(
            RAGLAN_CHART_IDS.ribbingO,
            highlightedRow + 1,
            stitchCount,
          )
        }
        onPreviousRow={highlightPreviousRow}
        onNextRow={highlightNextRow}
      />
    </View>
  );
});

export default App;

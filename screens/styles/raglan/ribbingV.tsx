import React from 'react';
import { View, ScrollView } from 'react-native';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';

import { RAGLAN_CHART_IDS } from './chartIds';
import { RaglanChartRowToolbar } from './RaglanChartRowToolbar';
import { VCollarIncreaseGuide } from './VCollarIncreaseGuide';
import { raglanChartPageStyles } from './raglanChartPageStyles';
import {
  buildCollarIncreaseInput,
  buildLeftSleeveTransform,
  buildLine3Transform,
  buildLine4Transform,
  buildRightSleeveTransform,
  computeStopRowNumber,
  computeStopStitchCount,
  computeVNeckRibbingAngleDegrees,
  computeVNeckRibbingAngleRadians,
} from './ribbingVParts/calc';
import { RibbingVChartGrid } from './ribbingVParts/RibbingVChartGrid';
import { RibbingVLegend } from './ribbingVParts/RibbingVLegend';
import { RibbingVMissingSpribWarning } from './ribbingVParts/RibbingVMissingSpribWarning';
import { ribbingVStyles as styles } from './ribbingVParts/styles';
import { useRibbingVHighlight } from './ribbingVParts/useRibbingVHighlight';

const App = observer(() => {
  const {
    SFrontV,
    SaV,
    KV,
    NRrezV,
    SpribVcorn,
    RowPribRV1,
    RowPribRV2,
    RowPribRV3,
    RowPribRVz,
    SV,
    SVfront,
    LsV,
  } = introState;

  const { highlightedRow, highlightNextRow, highlightPreviousRow } =
    useRibbingVHighlight(NRrezV);

  const angleInRadians = computeVNeckRibbingAngleRadians(SFrontV, LsV, SVfront);
  const angleInDegrees = computeVNeckRibbingAngleDegrees(angleInRadians);

  const collarIncreaseInput = buildCollarIncreaseInput({
    NRrezV,
    SpribVcorn,
    RowPribRV1,
    RowPribRV2,
    RowPribRV3,
    RowPribRVz,
    SV,
  });

  const stopStitchCount = computeStopStitchCount(
    KV,
    SFrontV,
    SaV,
    highlightedRow,
    collarIncreaseInput,
  );
  const stopRowNumber = computeStopRowNumber(highlightedRow);

  const leftSleeveTransform = buildLeftSleeveTransform(KV, angleInRadians);
  const rightSleeveTransform = buildRightSleeveTransform(KV, angleInRadians);
  const line3Transform = buildLine3Transform(NRrezV, KV, angleInDegrees);
  const line4Transform = buildLine4Transform(NRrezV, KV, angleInDegrees);

  if (!SpribVcorn) {
    return <RibbingVMissingSpribWarning />;
  }

  return (
    <View style={[styles.pageContainer, raglanChartPageStyles.page]}>
      <View style={styles.scrollContainer}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <RibbingVLegend />
          <VCollarIncreaseGuide />
          <RibbingVChartGrid
            NRrezV={NRrezV}
            SaV={SaV}
            KV={KV}
            SFrontV={SFrontV}
            SV={SV}
            SpribVcorn={SpribVcorn}
            highlightedRow={highlightedRow}
            collarIncreaseInput={collarIncreaseInput}
            angleInRadians={angleInRadians}
            angleInDegrees={angleInDegrees}
            leftSleeveTransform={leftSleeveTransform}
            rightSleeveTransform={rightSleeveTransform}
            line3Transform={line3Transform}
            line4Transform={line4Transform}
          />
        </ScrollView>
      </View>
      <RaglanChartRowToolbar
        variant="slim"
        currentRow={Math.max(highlightedRow, 0)}
        totalRows={NRrezV}
        stitchCount={stopStitchCount}
        onStop={() =>
          introState.setChartStoppedRow(
            RAGLAN_CHART_IDS.ribbingV,
            stopRowNumber,
            stopStitchCount,
          )
        }
        onPreviousRow={highlightPreviousRow}
        onNextRow={highlightNextRow}
      />
    </View>
  );
});

export default App;

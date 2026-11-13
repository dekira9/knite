import React, { useMemo } from 'react';
import { View, Dimensions, useColorScheme } from 'react-native';
import { observer } from 'mobx-react-lite';
import introState from '@/state/introState';
import {
  buildVNeckIncreaseRowStrings,
  getIncreaseRowsFromType,
  countSideArrayCells,
} from './increaseRowSelection';
import {
  renderLeftIncreaseArray,
  renderRightIncreaseArray,
} from './increaseArrayRenderers';
import { useRaglanChartState } from './useRaglanChartState';
import { RAGLAN_CHART_IDS } from './chartIds';
import { RaglanChartLegend } from './RaglanChartLegend';
import { RaglanChartRowToolbar } from './RaglanChartRowToolbar';
import { raglanChartPageStyles } from './raglanChartPageStyles';
import { RaglanRowAxis } from './RaglanGridAxes';
import { RaglanZoomableView } from './RaglanZoomableView';
import {
  computeVNeckData,
  getVNeckLeftStitchCount,
  getVNeckRightStitchCount,
  parseVNeckIncreaseRows,
  renderVNeckLeftArray,
  renderVNeckRightArray,
} from './vNeckFrontGrid';
import { isRaglanOutput } from './frontVParts/calc';
import { styles } from './frontVParts/styles';
import { FrontVIncreaseOptions } from './frontVParts/FrontVIncreaseOptions';
import { FrontVPaginationDots } from './frontVParts/FrontVPaginationDots';

const App = observer(() => {
  const { SFrontV,NHV, NHFrontV, SVfront, SfxV, PR_1x4_fV, PR_1x2_fV, prib_1x1_fV, prib_1x2_fV, prib_1x3_fV, PRib_1x3_fV, PRib_1x4_fV, usedIncreaseTypeV} = introState;
  const {
    highlightedRow,
    selectedIncreaseType,
    isDetailsExpanded,
    currentIndex,
    highlightNextRow,
    highlightPreviousRow,
    handleIncreaseTypePress,
  } = useRaglanChartState(RAGLAN_CHART_IDS.frontV, NHFrontV, usedIncreaseTypeV);
  const colorScheme = useColorScheme();
  const screenWidth = Dimensions.get('window').width;

  const results = introState.calculateRaglan();

  const increaseStrings = buildVNeckIncreaseRowStrings({
    nhFront: NHFrontV,
    sfx: SfxV,
    pr1x4_f: PR_1x4_fV,
    pr1x2_f: PR_1x2_fV,
    prib1x1_f: prib_1x1_fV,
    prib1x2_f: prib_1x2_fV,
    prib1x3_f: prib_1x3_fV,
    prib1x4_f: PRib_1x4_fV,
    prib1x3_rib_f: PRib_1x3_fV,
  });
  const increaseRows = getIncreaseRowsFromType(selectedIncreaseType, increaseStrings, {
    nullable: true,
  });
  const vNeckIncreaseRows =
    isRaglanOutput(results) ? parseVNeckIncreaseRows(results.resultStringV) : [];

  const vNeckGridStyles = {
    vNeckIncreaseCell: styles.vNeckIncreaseCell,
    ribbingCell: styles.ribbingCell,
    decreaseCell: styles.decreaseCell,
    cellsBelow: styles.cellsBelow,
    highlightedCell: styles.highlightedCell,
    row: styles.row,
    leftRow: styles.leftRow,
  };

  const vNeckData = useMemo(
    () =>
      computeVNeckData({
        nhFrontV: NHFrontV,
        nhv: NHV,
        svFront: SVfront,
        sFrontV: SFrontV,
        increaseRows: vNeckIncreaseRows,
      }),
    [NHFrontV, NHV, SVfront, SFrontV, vNeckIncreaseRows],
  );

  const vNeckGridParams = {
    nhFrontV: NHFrontV,
    nhv: NHV,
    svFront: SVfront,
    sFrontV: SFrontV,
    highlightedRow,
    increaseRows: vNeckIncreaseRows,
    styles: vNeckGridStyles,
  };

  const leftVNeckCount = getVNeckLeftStitchCount(vNeckData, NHFrontV, highlightedRow);
  const rightVNeckCount = getVNeckRightStitchCount(vNeckData, NHFrontV, highlightedRow);

  const leftCellCount = countSideArrayCells(increaseRows, NHFrontV, highlightedRow);
  const rightCellCount = countSideArrayCells(increaseRows, NHFrontV, highlightedRow);

  const totalStitchCount =
    leftCellCount + rightCellCount + leftVNeckCount + rightVNeckCount;

  return (
    <View style={[styles.container, raglanChartPageStyles.page]}>
      <FrontVIncreaseOptions
        usedIncreaseTypeV={usedIncreaseTypeV}
        screenWidth={screenWidth}
        colorScheme={colorScheme}
        selectedIncreaseType={selectedIncreaseType}
        isDetailsExpanded={isDetailsExpanded}
        handleIncreaseTypePress={handleIncreaseTypePress}
        results={results}
        increaseStrings={increaseStrings}
      />

      <FrontVPaginationDots
        usedIncreaseTypeV={usedIncreaseTypeV}
        currentIndex={currentIndex}
        colorScheme={colorScheme}
      />

      <View style={raglanChartPageStyles.legendStrip}>
        <RaglanChartLegend variant="v-neck" layout="compact" />
      </View>

      <View style={raglanChartPageStyles.chartArea}>
        <RaglanZoomableView>
          <View style={[styles.horContainer]}>
            <RaglanRowAxis
              rowCount={NHFrontV + 1}
              highlightedRow={highlightedRow}
              hasCollarRow
            />
            <View style={styles.increaseArrayLeft}>
              {renderLeftIncreaseArray(NHFrontV, highlightedRow, increaseRows, styles)}
            </View>
            <View style={styles.vNeckRightArray}>
              {renderVNeckRightArray(vNeckGridParams)}
            </View>
            <View style={styles.vNeckLeftArray}>
              {renderVNeckLeftArray(vNeckGridParams)}
            </View>
            <View style={styles.increaseArrayRight}>
              {renderRightIncreaseArray(NHFrontV, highlightedRow, increaseRows, styles)}
            </View>
          </View>
        </RaglanZoomableView>
      </View>

      <RaglanChartRowToolbar
        variant="slim"
        currentRow={highlightedRow}
        totalRows={NHFrontV}
        stitchCount={totalStitchCount}
        onStop={() =>
          introState.setChartStoppedRow(
            RAGLAN_CHART_IDS.frontV,
            highlightedRow + 1,
            totalStitchCount,
          )
        }
        onPreviousRow={highlightPreviousRow}
        onNextRow={highlightNextRow}
      />
    </View>
  );
});

export default App;

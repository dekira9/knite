import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import { Ionicons } from '@expo/vector-icons';
import i18n from '@/utils/translations';
import { RAGLAN_CHART_IDS } from './chartIds';
import { buildRibbingChartModel } from './chartModels/buildRibbingChartModel';
import { RaglanChartLegend } from './RaglanChartLegend';
import { RaglanRibbingSvgChart } from './RaglanRibbingSvgChart';

const App = observer(() => {
  const { SFrontO, Sa, K, NRrez } = introState;
  const highlightedRow = introState.getChartHighlightedRow(RAGLAN_CHART_IDS.ribbingO, NRrez);

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
    <View style={styles.pagecontainer}>
      <View style={styles.scrollContainer}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.contentContainer}>
            <RaglanChartLegend variant="ribbing" />
            <RaglanRibbingSvgChart model={chartModel} highlightedRow={highlightedRow} />
          </View>
        </ScrollView>
      </View>

      <View style={styles.controlsInfoContainer}>
        <View style={styles.infoContainer}>
          <View style={styles.bottomRow}>
            <View style={styles.redIndicator} />
            <Text style={styles.infoText}>
              {i18n.t('currentRow')}: {highlightedRow + 1}
            </Text>
          </View>
          <Text style={styles.infoText}>
            {i18n.t('stitches')}: {K * 4 + 2 * SFrontO + 2 * Sa}
          </Text>
        </View>
        <View style={styles.navigationButtons}>
          <TouchableOpacity onPress={highlightPreviousRow} style={styles.navButton}>
            <Ionicons name="chevron-up" size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={highlightNextRow} style={styles.navButton}>
            <Ionicons name="chevron-down" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  pagecontainer: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 120,
    paddingTop: 20,
  },
  contentContainer: {
    minHeight: 400,
  },
  redIndicator: {
    width: 17,
    height: 17,
    backgroundColor: 'red',
    borderWidth: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  controlsInfoContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'column',
    backgroundColor: '#fff',
    width: '100%',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    padding: 5,
    gap: 15,
    backgroundColor: '#fff',
  },
  navButton: {
    padding: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;

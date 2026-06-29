import React from 'react';
import { View, StyleSheet , ScrollView,TouchableOpacity,Text, Dimensions, useColorScheme   } from 'react-native';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import { Ionicons } from '@expo/vector-icons';
import type { RaglanOutput } from '@/utils/calculateRaglan';
import i18n from '@/utils/translations';
import { Colors } from '@/constants/Colors';

import {
  buildRegularIncreaseRowStrings,
  getIncreaseRowsFromType,
  countSideArrayCells,
} from './increaseRowSelection';
import { useRaglanChartState } from './useRaglanChartState';
import { raglanChartChromeStyleDefs } from './raglanChartChromeStyles';
import { RAGLAN_CHART_IDS } from './chartIds';
import { RaglanChartLegend } from './RaglanChartLegend';
import { RaglanChartRowToolbar } from './RaglanChartRowToolbar';
import { RaglanFlatChartGrid } from './RaglanFlatChartGrid';
import { raglanChartPageStyles } from './raglanChartPageStyles';

const App = observer(() => {
  const { SFrontO, Sa, K, NRrez, NHFront, Sfx, PR_1x4_f, PR_1x2_f,prib_1x1_f,prib_1x2_f, prib_1x3_f, PRib_1x3_f,  PRib_1x4_f, usedIncreaseType} = introState;
  const colorScheme = useColorScheme();
  const {
    highlightedRow,
    selectedIncreaseType,
    isDetailsExpanded,
    currentIndex,
    highlightNextRow,
    highlightPreviousRow,
    handleIncreaseTypePress,
  } = useRaglanChartState(RAGLAN_CHART_IDS.frontO, NHFront, usedIncreaseType);
  const screenWidth = Dimensions.get('window').width;

  const results = introState.calculateRaglan();
  

  const isRaglanOutput = (value: any): value is RaglanOutput => {
    return value !== null && typeof value === 'object' && 'PR_1x2_f' in value;
  };
  
  if (typeof results === 'string') {
    return (
      <View style={styles.container}>
        <Text>Error: {results}</Text>
      </View>
    );
  }

  const increaseStrings = buildRegularIncreaseRowStrings({
    nhFront: NHFront,
    sfx: Sfx,
    pr1x4_f: PR_1x4_f,
    pr1x2_f: PR_1x2_f,
    prib1x1_f: prib_1x1_f,
    prib1x2_f: prib_1x2_f,
    prib1x3_f: prib_1x3_f,
    prib1x4_f: PRib_1x4_f,
    prib1x3_rib_f: PRib_1x3_f,
  });
  const increaseRows = getIncreaseRowsFromType(selectedIncreaseType, increaseStrings);

  const leftCellCount = countSideArrayCells(increaseRows, NHFront, highlightedRow);
  const rightCellCount = countSideArrayCells(increaseRows, NHFront, highlightedRow);




  return (

    <View style={[styles.container, raglanChartPageStyles.page]}>
        <View style={styles.optionsContainer}>
            <ScrollView 
                horizontal 
                contentContainerStyle={styles.scrollContainer}
                showsHorizontalScrollIndicator={false}
                >
            <View style={[styles.horContainerTop]}>
                {usedIncreaseType && Array.isArray(usedIncreaseType) ? (
                usedIncreaseType.map(type  => (
                <View key={type} style={[styles.section, { marginRight: 10, width: screenWidth * 0.70 }]}>
                    <TouchableOpacity 
                      onPress={() => handleIncreaseTypePress(type)}
                      style={[styles.optionButton, selectedIncreaseType === type ? { backgroundColor: Colors[colorScheme ?? 'light'].tint } : null]}
                    >
                      <Text style={[styles.resultText, selectedIncreaseType === type ? styles.selectedOptionText : null, { fontWeight: 'bold', marginTop: 0 }]}>
                        {i18n.t?.('option') + ' ' + type}
                      </Text>
                      <Ionicons 
                        name={selectedIncreaseType === type && isDetailsExpanded ? "chevron-up" : "chevron-down"} 
                        size={16} 
                        color={selectedIncreaseType === type ? (Colors[colorScheme ?? 'light'].tint === '#FFFFFF' ? '#333' : '#FFFFFF') : Colors[colorScheme ?? 'light'].tint}
                        style={styles.chevronIcon}
                      />
                    </TouchableOpacity>
                    {/* 
                    <Text style={[styles.resultText, { fontWeight: 'bold', marginTop: 14 }]}>
                    {i18n.t?.('option') || 'Option'}
                    </Text> 
                    */} 
                    {type === '1x2, 1x4' && isRaglanOutput(results) && selectedIncreaseType === type && isDetailsExpanded && (
                    <>
                        <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.PR_1x2_f}</Text>
                        <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 4 ' + i18n.t('rows') + ': ' + results.PR_1x4_f}</Text>
                        <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                        <Text style={styles.rowNumbersText}>{increaseStrings.resultString24}</Text>
                    </>
                    )}
                    {type === '1x2, 1x3' && isRaglanOutput(results) && selectedIncreaseType === type && isDetailsExpanded && (
                    <>
                        <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.prib_1x2_f}</Text>
                        <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 3 ' + i18n.t('rows') + ': ' + results.prib_1x3_f}</Text>
                        <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                        <Text style={styles.rowNumbersText}>{increaseStrings.resultString23}</Text>
                    </>
                    )}
                    {type === '1x2, 1x1' && isRaglanOutput(results) && selectedIncreaseType === type && isDetailsExpanded && (
                    <>
                        <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.PR_1x2_f}</Text>
                        <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 1 ' + i18n.t('rows') + ': ' + results.prib_1x1_f}</Text>
                        <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                        <Text style={styles.rowNumbersText}>{increaseStrings.resultString21}</Text>
                    </>
                    )}
                    {type === '1x3, 1x4' && isRaglanOutput(results) && selectedIncreaseType === type && isDetailsExpanded && (
                    <>
                        <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 3 ' + i18n.t('rows') + ': ' + results.PRib_1x3_f}</Text>
                        <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 4 ' + i18n.t('rows') + ': ' + results.PRib_1x4_f}</Text>
                        <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                        <Text style={styles.rowNumbersText}>{increaseStrings.resultString43}</Text>
                    </>
                    )}
                    {type === '1x4' && isRaglanOutput(results) && selectedIncreaseType === type && isDetailsExpanded && (
                    <>
                        <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 4 ' + i18n.t('rows') + ': ' + results.PR_1x4_f}</Text>
                        <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                        <Text style={styles.rowNumbersText}>{increaseStrings.rowPrib1x4String}</Text>
                    </>
                    )}
                    {type === '1x3' && isRaglanOutput(results) && selectedIncreaseType === type && isDetailsExpanded && (
                    <>
                        <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 3 ' + i18n.t('rows') + ': ' + results.prib_1x3_f}</Text>
                        <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                        <Text style={styles.rowNumbersText}>{increaseStrings.rowPrib1x3String}</Text>
                    </>
                    )}
                    {type === '1x2' && isRaglanOutput(results) && selectedIncreaseType === type && isDetailsExpanded && (
                    <>
                        <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.prib_1x2_f}</Text>
                        <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                        <Text style={styles.rowNumbersText}>{increaseStrings.rowPrib1x2String}</Text>
                    </>
                    )}
                    {type === '1x1' && isRaglanOutput(results) && selectedIncreaseType === type && isDetailsExpanded && (
                    <>
                        <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 1 ' + i18n.t('rows') + ': ' + results.prib_1x1_f}</Text>
                        <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                        <Text style={styles.rowNumbersText}>{increaseStrings.rowPrib1x1String}</Text>
                    </>
                    )}  
                </View>
                ))
            ) : (
                <Text>No increase types selected</Text>
            )}
            </View>
            </ScrollView>
        </View>
      
        <View style={styles.paginationContainer}>
            {usedIncreaseType && Array.isArray(usedIncreaseType) && usedIncreaseType.map((_, index) => (
                <View
                    key={`dot-${index}`}
                    style={[
                        styles.paginationDot,
                        currentIndex === index && { backgroundColor: Colors[colorScheme ?? 'light'].tint }
                    ]}
                />
            ))}
        </View>
      
        <Text style={raglanChartPageStyles.metaText}>
          {i18n.t('lastRowOfCollar')}: {results.SFrontO} {i18n.t('stitches')}
        </Text>

        <View style={raglanChartPageStyles.legendStrip}>
          <RaglanChartLegend variant="regular" layout="compact" />
        </View>

        <View style={raglanChartPageStyles.chartArea}>
          <RaglanFlatChartGrid
            nhFront={NHFront}
            stitchCount={SFrontO}
            highlightedRow={highlightedRow}
            increaseRows={increaseRows}
          />
        </View>

        <RaglanChartRowToolbar
          variant="slim"
          currentRow={highlightedRow}
          totalRows={NHFront}
          stitchCount={SFrontO + leftCellCount + rightCellCount}
          onPreviousRow={highlightPreviousRow}
          onNextRow={highlightNextRow}
        />
    </View>
  
  );
});

const styles = StyleSheet.create({
  ...raglanChartChromeStyleDefs,
  container: {
    flexDirection: 'column',
  },
});

export default App;

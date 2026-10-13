import React from 'react';
import { useRaglanChartState } from './useRaglanChartState';
import { View, StyleSheet , ScrollView,TouchableOpacity,Text,Dimensions   } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Ionicons } from '@expo/vector-icons';
import i18n from '@/utils/translations';
import introState from '@/state/introState';
import onboardingState from '@/state/onboardingState';
import {
  buildVNeckIncreaseRowStrings,
  getIncreaseRowsFromType,
  countSideArrayCells,
} from './increaseRowSelection';
import { RAGLAN_CHART_IDS } from './chartIds';
import { RaglanChartLegend } from './RaglanChartLegend';
import { RaglanChartRowToolbar } from './RaglanChartRowToolbar';
import { RaglanFlatChartGrid } from './RaglanFlatChartGrid';
import { raglanChartPageStyles } from './raglanChartPageStyles';
import { raglanChartChromeStyleDefs } from './raglanChartChromeStyles';
import { computeStitchMetrics } from '@/utils/stitchMetrics';
import type { RaglanOutput } from '@/utils/calculateRaglan';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';


const { heightPer25RowsCm: Hc, widthPer25StitchesCm: Lc } = computeStitchMetrics(
  introState.stitchDensity,
  introState.rowDensity
);


const App = observer(() => {
  const { SFrontV, SaV, KV, NRrezV, NHFrontV, SfxV, PR_1x4_fV, PR_1x2_fV, prib_1x1_fV, prib_1x2_fV, prib_1x3_fV, PRib_1x3_fV, PRib_1x4_fV, usedIncreaseTypeV} = introState;
  const colorScheme = useColorScheme();
  const {
    highlightedRow,
    selectedIncreaseType,
    isDetailsExpanded,
    currentIndex,
    highlightNextRow,
    highlightPreviousRow,
    handleIncreaseTypePress,
  } = useRaglanChartState(RAGLAN_CHART_IDS.backV, NHFrontV, usedIncreaseTypeV);

  const results = introState.calculateRaglan();
  const screenWidth = Dimensions.get('window').width;

  const isRaglanOutput = (value: any): value is RaglanOutput => {
    return value !== null && typeof value === 'object' && 'PR_1x2_fV' in value;
  };

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

  const leftCellCount = countSideArrayCells(increaseRows, NHFrontV, highlightedRow);
  const rightCellCount = countSideArrayCells(increaseRows, NHFrontV, highlightedRow);
  return (

    <View style={[styles.container, raglanChartPageStyles.page]}>
      <View style={styles.optionsContainer}>
      <ScrollView 
          horizontal 
          contentContainerStyle={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}
        >
      <View style={[styles.horContainerTop]}>
        {usedIncreaseTypeV && Array.isArray(usedIncreaseTypeV) ? (
        usedIncreaseTypeV.map((type: string) => (
          <View key={type} style={[styles.section, { marginRight: 10, width: screenWidth * 0.7 }]}>
            <TouchableOpacity 
              onPress={() => handleIncreaseTypePress(type)}
              style={[styles.optionButton, selectedIncreaseType === type ?  { backgroundColor: Colors[colorScheme ?? 'light'].tint } : null]}
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
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.PR_1x2_fV}</Text>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 4 ' + i18n.t('rows') + ': ' + results.PR_1x4_fV}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{increaseStrings.resultString24}</Text>
               
              </>
            )}
            
            {type === '1x2, 1x3' && isRaglanOutput(results) && selectedIncreaseType === type && isDetailsExpanded && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.prib_1x2_fV}</Text>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 3 ' + i18n.t('rows') + ': ' + results.prib_1x3_fV}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{increaseStrings.resultString23}</Text>
              </>
            )}
            {type === '1x2, 1x1' && isRaglanOutput(results) && selectedIncreaseType === type && isDetailsExpanded && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.prib_1x2_fV}</Text>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 1 ' + i18n.t('rows') + ': ' + results.prib_1x1_fV}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{increaseStrings.resultString21}</Text>
              </>
            )}
            {type === '1x3, 1x4' && isRaglanOutput(results) && selectedIncreaseType === type && isDetailsExpanded && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 3 ' + i18n.t('rows') + ': ' + results.PRib_1x3_fV}</Text>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 4 ' + i18n.t('rows') + ': ' + results.PRib_1x4_fV}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{increaseStrings.resultString43}</Text>
              </>
            )}
            {type === '1x4' && isRaglanOutput(results) && selectedIncreaseType === type && isDetailsExpanded && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 4 ' + i18n.t('rows') + ': ' + results.PR_1x4_fV}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{results.RowPrib1x4StringV}</Text>
              </>
            )}
             {type === '1x3' && isRaglanOutput(results) && selectedIncreaseType === type && isDetailsExpanded && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 3 ' + i18n.t('rows') + ': ' + results.prib_1x3_fV}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{results.RowPrib1x3StringV}</Text>
              </>
            )}
            {type === '1x2' && isRaglanOutput(results) && selectedIncreaseType === type && isDetailsExpanded && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.prib_1x2_fV}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{results.RowPrib1x2StringV}</Text>
              </>
            )}
            {type === '1x1' && isRaglanOutput(results) && selectedIncreaseType === type && isDetailsExpanded && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 1 ' + i18n.t('rows') + ': ' + results.prib_1x1_fV}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{results.RowPrib1x1StringV}</Text>
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
        {usedIncreaseTypeV && Array.isArray(usedIncreaseTypeV) && usedIncreaseTypeV.map((_, index) => (
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
        {i18n.t('lastRowOfCollar')}: {isRaglanOutput(results) ? results.SFrontV : ''} {i18n.t('stitches')}
      </Text>

      <View style={raglanChartPageStyles.legendStrip}>
        <RaglanChartLegend variant="regular" layout="compact" />
      </View>

      <View style={raglanChartPageStyles.chartArea}>
        <RaglanFlatChartGrid
          nhFront={NHFrontV}
          stitchCount={SFrontV}
          highlightedRow={highlightedRow}
          increaseRows={increaseRows}
        />
      </View>

      <RaglanChartRowToolbar
        variant="slim"
        currentRow={highlightedRow}
        totalRows={NHFrontV}
        stitchCount={SFrontV + leftCellCount + rightCellCount}
        onStop={() =>
          introState.setChartStoppedRow(
            RAGLAN_CHART_IDS.backV,
            highlightedRow + 1,
            SFrontV + leftCellCount + rightCellCount,
          )
        }
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
  horContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#C6C6C6'
  },
  verticalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
  },
 
 
 
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  cell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#A29FCF',
  },
  firstCell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#DAEDBD',
  },
  Front: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
 
    
  selectedOptionButton: {
    backgroundColor: '#007AFF',
    width: '100%',
   },
  optionText: {
    fontSize: 14,
    color: 'red',
  },  
  increaseCell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#00ADF2',
  },
  leftRow: {
    justifyContent: 'flex-end',
  },
  defaultCell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black', 
    backgroundColor: '#dad9ef',
    
  },
  ribbingCell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'yellow',
  },
  increaseArrayLeft: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },  
  increaseArrayRight: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  backButton: {
    padding: 5,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    margin: 5,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  expandButton: {
    padding: 5,
    marginLeft: 5,
  },
  
});

export default App;

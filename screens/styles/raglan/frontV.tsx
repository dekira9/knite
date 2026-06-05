import React, { useMemo } from 'react';
import { View, StyleSheet , ScrollView,TouchableOpacity,Text, Dimensions, useColorScheme  } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Ionicons } from '@expo/vector-icons';
import i18n from '@/utils/translations';
import introState from '@/state/introState';
import type { RaglanOutput } from '@/utils/calculateRaglan';
import { Colors } from '@/constants/Colors';
import {
  buildVNeckIncreaseRowStrings,
  getIncreaseRowsFromType,
  countSideArrayCells,
} from './increaseRowSelection';
import {
  renderLeftIncreaseArray,
  renderRightIncreaseArray,
} from './increaseArrayRenderers';
import { computeStitchMetrics } from '@/utils/stitchMetrics';
import { useRaglanChartState } from './useRaglanChartState';
import { raglanChartChromeStyleDefs } from './raglanChartChromeStyles';
import {
  computeVNeckData,
  getVNeckLeftStitchCount,
  getVNeckRightStitchCount,
  parseVNeckIncreaseRows,
  renderVNeckLeftArray,
  renderVNeckRightArray,
} from './vNeckFrontGrid';

const { heightPer25RowsCm: Hc, widthPer25StitchesCm: Lc } = computeStitchMetrics(
  introState.stitchDensity,
  introState.rowDensity
);


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
  } = useRaglanChartState(NHFrontV, usedIncreaseTypeV);
  const colorScheme = useColorScheme();
  const screenWidth = Dimensions.get('window').width;

  const results = introState.calculateRaglan();
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

  


  return (

    <View style={styles.container}>
       <View style={styles.optionsContainer}>
      <ScrollView 
          horizontal 
          contentContainerStyle={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}
        >
      <View style={[styles.horContainerTop]}>
        {usedIncreaseTypeV && Array.isArray(usedIncreaseTypeV) ? (
        usedIncreaseTypeV.map((type: string) => (
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
        <View style={styles.section}>
          <Text style={styles.resultText}>No increase types selected</Text>
        </View>
      )}
      </View>
      </ScrollView>
      </View>
      
      
      <View style={styles.paginationContainer}  >
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
      <View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 0}}>
       <View style={{width: 17, height: 17, backgroundColor: '#fb93bc', marginLeft: 10, borderTopWidth: 3, borderBottomWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderTopColor: 'yellow', borderBottomColor: '#715604', borderLeftColor: '#715604', borderRightColor: '#715604'}}></View>
       <Text style={styles.resultText}> {i18n.t('knitTheStitchesFromTheCollar')} </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 0}}>
       <View style={{width: 17, height: 17, backgroundColor: 'black', marginLeft: 10, borderWidth: 1}}></View>
       <Text style={styles.resultText}> {i18n.t('decreaseTheStitches')} </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 0}}>
       <View style={{width: 17, height: 17, backgroundColor: 'grey', marginLeft: 10, borderWidth: 1}}></View>
       <Text style={styles.resultText}> {i18n.t('thereAreNoStitches')} </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 0}}>
       <View style={{width: 17, height: 17, backgroundColor: '#00ADF2', marginLeft: 10, borderWidth: 1}}></View>
       <Text style={styles.resultText}> {i18n.t('addingStitchesAlongTheRaglanLine')} </Text>
      </View>
      </View>
      <ScrollView 
          horizontal 
          contentContainerStyle={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}
        >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 0}}>
     
      <View style={[styles.horContainer]}>
        
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
      </ScrollView>
      </ScrollView>

<View style={styles.controlsInfoContainer}>
      <View style={styles.infoContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
      <View style={{width: 17, height: 17, backgroundColor: 'red', borderWidth: 1}}></View>
        <Text style={styles.infoText}>{i18n.t('currentRow')}: {highlightedRow + 1}</Text>
        </View>
        <Text style={styles.infoText}>{i18n.t('stitches')}: {leftCellCount + rightCellCount + leftVNeckCount + rightVNeckCount}</Text>
      </View>
      <View style={styles.navigationButtons}>

      
        <TouchableOpacity onPress={highlightPreviousRow} style={styles.navButton}>
          <Ionicons name="chevron-up" size={24} color='red' />
        </TouchableOpacity>
        <TouchableOpacity onPress={highlightNextRow} style={styles.navButton}>
          <Ionicons name="chevron-down" size={24} color='red' />
        </TouchableOpacity>
      </View>
      </View>
      
    </View>
  );
});

const styles = StyleSheet.create({
  ...raglanChartChromeStyleDefs,
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  horContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 110,
    borderWidth: 1,
    borderColor: '#C6C6C6',
    paddingHorizontal: 20,
    paddingTop: 10,
    
  },
  verticalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
    backgroundColor: '#ffe9f1', 
  },
  ribbingCell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: '#715604',
    borderTopWidth: 3,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopColor: 'yellow',
    borderBottomColor: '#715604',
    borderLeftColor: '#715604',
    borderRightColor: '#715604',
    backgroundColor: '#fb93bc',
    margin: 0,
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
  leftSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  rightSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  vNeckContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 0,
    borderWidth: 0,
    borderColor: 'blue',
    minWidth: 100,
  },
  vNeckLeftArray: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    borderWidth: 0,
    borderColor: 'green',
  },
  vNeckRightArray: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderWidth: 0,
    borderColor: 'green',
  },
  vNeckIncreaseCell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#FDCFE1',
    margin: 0,
  },
  vNeckDefaultCell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#E0E0E0',
    margin: 0,
  },
  decreaseCell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'black',
    margin: 0,
  },
  cellsBelow: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#808080',
    margin: 0,
  },
  paginationContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
    marginTop: 0,
   
    },
    paginationDot: {
      height: 8,
      width: 8,
      borderRadius: 4,
      backgroundColor: '#C6C6C6',
      marginHorizontal: 4,
    },
});

export default App;


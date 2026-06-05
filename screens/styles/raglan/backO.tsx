import React from 'react';
import { useRaglanChartState } from './useRaglanChartState';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Dimensions, useColorScheme } from 'react-native';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import { Ionicons } from '@expo/vector-icons';
import i18n from '@/utils/translations';
import { useNavigation } from '@react-navigation/native';
import type { RaglanOutput } from '@/utils/calculateRaglan';
import { Colors } from '@/constants/Colors';


import {
  buildRegularIncreaseRowStrings,
  getIncreaseRowsFromType,
  countSideArrayCells,
} from './increaseRowSelection';
import {
  renderLeftIncreaseArray,
  renderRightIncreaseArray,
  renderBodyGrid,
} from './increaseArrayRenderers';
import { raglanChartChromeStyleDefs } from './raglanChartChromeStyles';

const App = observer(() => {
  const { SFrontO, Sa, K, NRrez, NHFront, Sfx, PR_1x4_f, PR_1x2_f,prib_1x1_f,prib_1x2_f, prib_1x3_f, PRib_1x3_f,  PRib_1x4_f, usedIncreaseType} = introState;
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const {
    highlightedRow,
    selectedIncreaseType,
    isDetailsExpanded,
    currentIndex,
    highlightNextRow,
    highlightPreviousRow,
    handleIncreaseTypePress,
  } = useRaglanChartState(NHFront, usedIncreaseType);

  const results = introState.calculateRaglan();
  const screenWidth = Dimensions.get('window').width;

  // Type guard to check if results is RaglanOutput
  const isRaglanOutput = (value: any): value is RaglanOutput => {
    return value !== null && typeof value === 'object' && 'PR_1x2_f' in value;
  };
  
  // Early return if results is error string
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

    <View style={styles.container}>
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
            {type === '1x2, 1x4' && selectedIncreaseType === type && isDetailsExpanded && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.PR_1x2_f}</Text>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 4 ' + i18n.t('rows') + ': ' + results.PR_1x4_f}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.rowNumbersText}>{increaseStrings.resultString24}</Text>
              </>
            )}
            {type === '1x2, 1x3' && selectedIncreaseType === type && isDetailsExpanded && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.prib_1x2_f}</Text>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 3 ' + i18n.t('rows') + ': ' + results.prib_1x3_f}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.rowNumbersText}>{increaseStrings.resultString23}</Text>
              </>
            )}
            {type === '1x2, 1x1' && selectedIncreaseType === type && isDetailsExpanded && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.PR_1x2_f}</Text>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 1 ' + i18n.t('rows') + ': ' + results.prib_1x1_f}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.rowNumbersText}>{increaseStrings.resultString21}</Text>
              </>
            )}
            {type === '1x3, 1x4' && selectedIncreaseType === type && isDetailsExpanded && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 3 ' + i18n.t('rows') + ': ' + results.PRib_1x3_f}</Text>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 4 ' + i18n.t('rows') + ': ' + results.PRib_1x4_f}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.rowNumbersText}>{increaseStrings.resultString43}</Text>
              </>
            )}
            {type === '1x4' && selectedIncreaseType === type && isDetailsExpanded && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 4 ' + i18n.t('rows') + ': ' + results.PR_1x4_f}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.rowNumbersText}>{increaseStrings.rowPrib1x4String}</Text>
              </>
            )}
             {type === '1x3' && selectedIncreaseType === type && isDetailsExpanded && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 3 ' + i18n.t('rows') + ': ' + results.prib_1x3_f}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.rowNumbersText}>{increaseStrings.rowPrib1x3String}</Text>
              </>
            )}
            {type === '1x2' && selectedIncreaseType === type && isDetailsExpanded && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.prib_1x2_f}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.rowNumbersText}>{increaseStrings.rowPrib1x2String}</Text>
              </>
            )}
            {type === '1x1' && selectedIncreaseType === type && isDetailsExpanded && (
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
      
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 0}}>
       <View style={{width: 17, height: 17, backgroundColor: 'yellow', marginLeft: 10, borderWidth: 1, marginTop: 10, marginBottom: 10}}></View>
       <Text style={styles.resultText}> {i18n.t('lastRowOfCollar')}: {results.SFrontO} {i18n.t('stitches')} </Text>
      </View>
      <ScrollView 
          horizontal 
          contentContainerStyle={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}
        >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 0}}>
      
      <View style={[styles.horContainer]}>
      <View style={styles.increaseArrayLeft}>
          {renderLeftIncreaseArray(NHFront, highlightedRow, increaseRows, styles)}
        </View>
        <View style={styles.Front}>
          {renderBodyGrid(SFrontO, NHFront, highlightedRow, styles)}
        </View>
        <View style={styles.increaseArrayRight}>
          {renderRightIncreaseArray(NHFront, highlightedRow, increaseRows, styles)}
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
        <Text style={styles.infoText}>{i18n.t('stitches')}: {SFrontO + leftCellCount + rightCellCount}</Text>
        
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
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#A29FCF',
  },
  firstCell: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#DAEDBD',
  },
  Front: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
 
  infoTextRed: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
   
  increaseCell: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#00ADF2',
  },
  leftRow: {
    justifyContent: 'flex-end',
  },
  defaultCell: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#dad9ef',
  },
  ribbingCell: {
    width: 10,
    height: 10,
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
  
  
});

export default App;

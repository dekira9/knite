import React, { useEffect, useState } from 'react';
import { View, StyleSheet , ScrollView,TouchableOpacity,Text   } from 'react-native';
import introState from '@/state/introState';
import raglanState from '@/state/raglanState';
import { observer } from 'mobx-react-lite';
import { Ionicons } from '@expo/vector-icons';
import { calculateRaglan } from '@/utils/calculateRaglan';
import i18n from '@/utils/translations';
import { useRouter } from 'expo-router';



import { calculateIncreaseRows1x2_1x4, calculateIncreaseRows1x2_1x3, calculateIncreaseRows1x2_1x1, calculateIncreaseRows1x4_1x3 } from '@/app/(tabs)/index/input/result';

const App = observer(() => {
  const { SFrontO, Sa, K, NRrez, NHFront, Sfx, PR_1x4_f, PR_1x2_f,prib_1x1_f,prib_1x2_f, prib_1x3_f, PRib_1x3_f,  PRib_1x4_f, usedIncreaseType} = introState;
  const [highlightedRow, setHighlightedRow] = useState(0);
  const router = useRouter();
  const [selectedIncreaseType, setSelectedIncreaseType] = useState('');
  
  const results = introState.calculateRaglan();
  const { resultString24 } = calculateIncreaseRows1x2_1x4(NHFront, Sfx, PR_1x4_f, PR_1x2_f);
  const {  resultString23 } = calculateIncreaseRows1x2_1x3(NHFront, Sfx, prib_1x3_f, prib_1x2_f);
  const {  resultString21 } = calculateIncreaseRows1x2_1x1(NHFront, Sfx, prib_1x1_f,prib_1x2_f);
  const {  resultString43 } = calculateIncreaseRows1x4_1x3(NHFront, Sfx, PRib_1x4_f, PRib_1x3_f);  
  const RowPrib1x4 = Array.from({ length: Sfx }, (_, index) => 1 + index * 4);
  const RowPrib1x4String = RowPrib1x4.join(', ');
  const RowPrib1x3 = Array.from({ length: Sfx }, (_, index) => 1 + index * 3);
  const RowPrib1x3String = RowPrib1x3.join(', ');
  const RowPrib1x2 = Array.from({ length: Sfx }, (_, index) => 1 + index * 2);
  const RowPrib1x2String = RowPrib1x2.join(', ');
  const RowPrib1x1 = Array.from({ length: Sfx }, (_, index) => 1 + index * 1);
  const RowPrib1x1String = RowPrib1x1.join(', ');

   const getIncreaseRows = () => {
    switch (selectedIncreaseType) {
      case '1x2, 1x4':
        return resultString24.split(', ').map(Number);
      case '1x2, 1x3':
        return resultString23.split(', ').map(Number);
      case '1x2, 1x1':
        return resultString21.split(', ').map(Number);
      case '1x3, 1x4':
        return resultString43.split(', ').map(Number);
        case '1x3':
        return RowPrib1x3String.split(', ').map(Number);
      case '1x4':
        return RowPrib1x4String.split(', ').map(Number);
      case '1x2':
        return RowPrib1x2String.split(', ').map(Number);
      case '1x1':
        return RowPrib1x1String.split(', ').map(Number);
     
      default:
        return [];
    }
  };

  const renderLeftIncreaseArray = () => {
    const increaseRows = getIncreaseRows();
    const cells = [];
    let additionalCells = 0;
  
    for (let i = 0; i < NHFront; i++) {
      if (increaseRows.includes(i + 1)) {
        additionalCells++;
      }
      const row = [];
      for (let j = 0; j < additionalCells; j++) {
        const isCurrentRowIncrease = increaseRows.includes(i + 1);
      const cellStyle = isCurrentRowIncrease ? styles.increaseCell : styles.defaultCell;
        const cell = <View key={`left-${i}-${j}`} style={cellStyle} />;
        // Добавляем ячейки в конец для левого массива
        row.push(<View key={`${i}-${j}`} style={[cellStyle,
            i === highlightedRow && styles.highlightedCell]} />);
      }
      cells.push(
        <View key={`left-${i}`} style={[styles.row, styles.leftRow]}>
          {row}
        </View>
      );
    }
    return cells;
  };
  
  const renderRightIncreaseArray = () => {
    const increaseRows = getIncreaseRows();
    const cells = [];
    let additionalCells = 0;
  
    for (let i = 0; i < NHFront; i++) {
      if (increaseRows.includes(i + 1)) {
        additionalCells++;
      }
      const row = [];
      for (let j = 0; j < additionalCells; j++) {
        const isCurrentRowIncrease = increaseRows.includes(i + 1);
      const cellStyle = isCurrentRowIncrease ? styles.increaseCell : styles.defaultCell;

        const cell = <View key={`right-${i}-${j}`} style={cellStyle} />;
        // Добавляем ячейки в конец для правого массива
        row.push(
          <View key={`${i}-${j}`} style={[cellStyle,
            i === highlightedRow && styles.highlightedCell]} />
        );
      }
      cells.push(
        <View key={`right-${i}`} style={styles.row}>
          {row}
        </View>
      );
    }
    return cells;
  };

  const renderSleeve = () => {
    const cells = [];
    for (let i = -1; i < NHFront; i++) {
      const row = [];
      for (let j = 0; j < Sa; j++) {
        row.push(
          <View key={`${i}-${j}`} style={[i === -1 ? styles.ribbingCell : styles.cell, i === highlightedRow && styles.highlightedCell]} />
        );
      }
      cells.push(
        <View key={i} style={styles.row}>
          {row}
        </View>
      );
    }
    return cells;
  };

  const highlightNextRow = () => {
    setHighlightedRow((prev) => (prev + 1) % NHFront);
  };

  const highlightPreviousRow = () => {
    setHighlightedRow((prev) => (prev - 1 + NHFront) % NHFront);
  };

  const getLeftArrayCellCount = () => {
    const increaseRows = getIncreaseRows();
    let additionalCells = 0;
    if (highlightedRow < NHFront) {
      for (let i = 0; i <= highlightedRow; i++) {
        if (increaseRows.includes(i + 1)) {
          additionalCells++;
        }
      }
    }
    return additionalCells;
  };

  const getRightArrayCellCount = () => {
    const increaseRows = getIncreaseRows();
    let additionalCells = 0;
        if (highlightedRow < NHFront) {
            for (let i = 0; i <= highlightedRow; i++) {
                if (increaseRows.includes(i + 1)) {
                    additionalCells++;
                }
            }
        }
    return additionalCells;
  };
  const leftCellCount = getLeftArrayCellCount();
  const rightCellCount = getRightArrayCellCount();


  


  return (

    <View style={styles.container}>
      <ScrollView 
          horizontal 
          contentContainerStyle={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}
        >
      <View style={[styles.horContainerTop]}>
        {usedIncreaseType && Array.isArray(usedIncreaseType) ? (
        usedIncreaseType.map(type  => (
          <View key={type} style={[styles.section, { marginRight: 10 }]}>
            <TouchableOpacity onPress={() => setSelectedIncreaseType(type)} style={[styles.optionButton, selectedIncreaseType === type ? styles.selectedOptionButton : null]}>
              <Text style={[styles.resultText, selectedIncreaseType === type ? styles.selectedOptionText : null, { fontWeight: 'bold', marginTop: 0 }]}> {i18n.t?.('option') + ' ' + type}</Text>
            </TouchableOpacity>
            {/* 
            <Text style={[styles.resultText, { fontWeight: 'bold', marginTop: 14 }]}>
              {i18n.t?.('option') || 'Option'}
            </Text> 
            */} 
            {type === '1x2, 1x4' && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.PR_1x2_f}</Text>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 4 ' + i18n.t('rows') + ': ' + results.PR_1x4_f}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{resultString24}</Text>
              </>
            )}
            {type === '1x2, 1x3' && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.prib_1x2_f}</Text>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 3 ' + i18n.t('rows') + ': ' + results.prib_1x3_f}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{resultString23}</Text>
              </>
            )}
            {type === '1x2, 1x1' && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.PR_1x2_f}</Text>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 1 ' + i18n.t('rows') + ': ' + results.prib_1x1_f}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{resultString21}</Text>
              </>
            )}
            {type === '1x3, 1x4' && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 3 ' + i18n.t('rows') + ': ' + results.PRib_1x3_f}</Text>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 4 ' + i18n.t('rows') + ': ' + results.PRib_1x4_f}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{resultString43}</Text>
              </>
            )}
            {type === '1x4' && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 4 ' + i18n.t('rows') + ': ' + results.PR_1x4_f}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{RowPrib1x4String}</Text>
              </>
            )}
             {type === '1x3' && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 3 ' + i18n.t('rows') + ': ' + results.prib_1x3_f}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{RowPrib1x3String}</Text>
              </>
            )}
            {type === '1x2' && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.prib_1x2_f}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{RowPrib1x2String}</Text>
              </>
            )}
            {type === '1x1' && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 1 ' + i18n.t('rows') + ': ' + results.prib_1x1_f}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{RowPrib1x1String}</Text>
              </>
            )}  
          </View>
        ))
      ) : (
        <Text>No increase types selected</Text>
      )}
      </View>
      </ScrollView>
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 0}}>
       <View style={{width: 17, height: 17, backgroundColor: 'yellow', marginLeft: 10, borderWidth: 1, marginTop: 10, marginBottom: 10}}></View>
       <Text style={styles.resultText}> {i18n.t('lastRowOfRibbing')} </Text>
      </View>
      <ScrollView 
          horizontal 
          contentContainerStyle={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}
        >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 0}}>
      
      <View style={[styles.horContainer]}>
      <View style={styles.increaseArrayLeft}>
          {renderLeftIncreaseArray()}
        </View>
        <View style={styles.Sleeve}>
          {renderSleeve()}
        </View>
        <View style={styles.increaseArrayRight}>
          {renderRightIncreaseArray()}
        </View>
      </View>
      </ScrollView>
      </ScrollView>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Current Row: {highlightedRow + 1}</Text>
        <Text style={styles.infoText}>Stitches: {Sa + leftCellCount + rightCellCount}</Text>
        
      </View>
      <View style={styles.navigationButtons}>
        <TouchableOpacity onPress={highlightPreviousRow} style={styles.navButton}>
          <Ionicons name="chevron-up" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={highlightNextRow} style={styles.navButton}>
          <Ionicons name="chevron-down" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  horContainerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    //borderWidth: 1,
    //borderColor: 'green',
    marginRight: 5,
    marginTop: 5,
    backgroundColor: '#FFFFFF',
  },
  horContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 110,
    borderWidth: 1,
    borderColor: 'red',
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
    backgroundColor: '#DAEDBD',
  },
  firstCell: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#DAEDBD',
  },
  Sleeve: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
 
  navigationButtons: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
  },
  navButton: {
    padding: 10,
  },
  highlightedCell: {
    backgroundColor: 'red',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,  
  },
  resultText: {
    fontSize: 12,
    marginBottom: 1,

    textAlign: 'center' as const,
  },  
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    
   // borderWidth: 1,
    //borderColor: 'grey',
  },
  optionButton: {
    marginBottom: 5,
    padding: 5,
    backgroundColor: '#C6C6C6',
    borderRadius: 5,
    width: '100%',
  },
  selectedOptionButton: {
    backgroundColor: '#007AFF', // Измените цвет по своему вкусу
  },
  optionText: {
    fontSize: 14,
    color: 'red',
  },
  selectedOptionText: {
    color: 'white',
  },  
  increaseCell: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'green',
  },
  leftRow: {
    justifyContent: 'flex-end',
  },
  defaultCell: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: 'black', // Без фона для обычных ячеек
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

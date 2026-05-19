import React, { useEffect, useState } from 'react';
import { View, StyleSheet , ScrollView,TouchableOpacity,Text   } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Ionicons } from '@expo/vector-icons';
import i18n from '@/utils/translations';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import introState from '@/state/introState';
import onboardingState from '@/state/onboardingState';
import { calculateIncreaseRows1x2_1x4V, calculateIncreaseRows1x2_1x3V, calculateIncreaseRows1x2_1x1V, calculateIncreaseRows1x4_1x3V } from '@/app/(tabs)/index/input/resultV';
import type { RaglanOutput } from '@/utils/calculateRaglan';


const { stitchDensity, rowDensity } = introState;
const stitches = parseFloat(stitchDensity.replace(',', '.'))/10;
const rows = parseFloat(rowDensity.replace(',', '.'))/10;
const LsV = 1 / stitches;   //см ширина петли
const hsV = 1 / rows; //  см высота петли или ряда 
const Hc=hsV*25;
const Lc=LsV*25


const App = observer(() => {
  const { SFrontV,NHV, SaV, KV, NRrezV, NHFrontV, SVfront, SfxV, PR_1x4_fV, PR_1x2_fV, prib_1x1_fV, prib_1x2_fV, prib_1x3_fV, PRib_1x3_fV, PRib_1x4_fV, usedIncreaseType} = introState;
  const [highlightedRow, setHighlightedRow] = useState(0);
  const router = useRouter();
  const [selectedIncreaseType, setSelectedIncreaseType] = useState(usedIncreaseType?.[0] || '');
  
  const results = introState.calculateRaglan();
  const isRaglanOutput = (value: any): value is RaglanOutput => {
    return value !== null && typeof value === 'object' && 'PR_1x2_fV' in value;
  };

  const { resultString24V } = calculateIncreaseRows1x2_1x4V(NHFrontV, SfxV, PR_1x4_fV, PR_1x2_fV) ;
  const { resultString23V } = calculateIncreaseRows1x2_1x3V(NHFrontV, SfxV, prib_1x3_fV, prib_1x2_fV) ;
  const { resultString21V } = calculateIncreaseRows1x2_1x1V(NHFrontV, SfxV, prib_1x1_fV, prib_1x2_fV) ;
  const { resultString43V } = calculateIncreaseRows1x4_1x3V(NHFrontV, SfxV, PRib_1x4_fV, PRib_1x3_fV) ;
  const RowPrib1x4V = Array.from({ length: SfxV }, (_, index) => 1 + index * 4);
  const RowPrib1x4StringV = RowPrib1x4V.join(', ');
  const RowPrib1x3V = Array.from({ length: SfxV }, (_, index) => 1 + index * 3);
  const RowPrib1x3StringV = RowPrib1x3V.join(', ');
  const RowPrib1x2V = Array.from({ length: SfxV }, (_, index) => 1 + index * 2);
  const RowPrib1x2StringV = RowPrib1x2V.join(', ');
  const RowPrib1x1V = Array.from({ length: SfxV }, (_, index) => 1 + index * 1);
  const RowPrib1x1StringV = RowPrib1x1V.join(', ');

   const getIncreaseRowsV = () => {
    if (!selectedIncreaseType) return [];
    
    switch (selectedIncreaseType) {
      case '1x2, 1x4':
        return resultString24V ? resultString24V.split(', ').map(Number) : [];
      case '1x2, 1x3':
        return resultString23V ? resultString23V.split(', ').map(Number) : [];
      case '1x2, 1x1':
        return resultString21V ? resultString21V.split(', ').map(Number) : [];
      case '1x3, 1x4':
        return resultString43V ? resultString43V.split(', ').map(Number) : [];
      case '1x3':
        return RowPrib1x3StringV ? RowPrib1x3StringV.split(', ').map(Number) : [];
      case '1x4':
        return RowPrib1x4StringV ? RowPrib1x4StringV.split(', ').map(Number) : [];
      case '1x2':
        return RowPrib1x2StringV ? RowPrib1x2StringV.split(', ').map(Number) : [];
      case '1x1':
        return RowPrib1x1StringV ? RowPrib1x1StringV.split(', ').map(Number) : [];
      default:
        return [];
    }
  };

  const renderLeftIncreaseArrayV = () => {
    const increaseRowsV = getIncreaseRowsV();
    const cells = [];
    let additionalCells = 0;
  
    for (let i = 0; i < NHFrontV; i++) {
      if (increaseRowsV.includes(i + 1)) {
        additionalCells++;
      }
      const row = [];
      for (let j = 0; j < additionalCells; j++) {
        const isCurrentRowIncrease = increaseRowsV.includes(i + 1);
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
{/* расчет для V-выреза переда */}
const renderVNeckLeftArray = () => {
  const cells = [];
  const results = introState.calculateRaglan();
  const increaseRows = isRaglanOutput(results) && results.resultStringV
    ? results.resultStringV.split(', ').map(Number)
    : [];

  const blackCells = [];
  const blackColumnsA = new Set();
  const blackColumnsB = new Set();

  let currentRowLength = 0;
  const totalPairs = NHFrontV / 2;
  const SdecV = SVfront - SFrontV / 2;
  const NHVwork = NHV - 2;
  const D = Math.floor(SdecV / (NHVwork / 2));
  const decCelA = (D + 1) * (SdecV - D * (NHVwork / 2));
  const decCelB = SdecV - decCelA;
  const pairRowA = decCelA / (D + 1);
  const pairRowB = (NHVwork / 2) - pairRowA;
  const Kd = (NHVwork / 2) / pairRowA;

  const pozPairDecA = Array.from({ length: pairRowA }, (_, i) => Math.floor(i * Kd) + 2);
  const pozPairAll = Array.from({ length: NHVwork / 2 }, (_, i) => i + 2);
  const pozPairDecB = pozPairAll.filter(p => !pozPairDecA.includes(p));

  const decRowsA = pozPairDecA.map(pos => pos * 2);
  const decRowsB = pozPairDecB.map(pos => pos * 2);

  // Первый проход — собираем blackCells
  for (let i = 1; i <= totalPairs; i++) {
    const additionalCells = (i <= NHV / 2) ? (increaseRows[i - 1] || 0) : 0;
    currentRowLength += additionalCells;

    for (let pairRow = 0; pairRow < 2; pairRow++) {
      const currentRow = (i - 1) * 2 + pairRow + 1;

      // dec A
      if (decRowsA.includes(currentRow)) {
        for (let k = 1; k < 1 + D + 1 && k < currentRowLength; k++) {
          blackCells.push([currentRow, k, 'A']);
          blackColumnsA.add(k);
        }
      }
      // dec B
      if (D > 0 && decRowsB.includes(currentRow)) {
        for (let k = 1; k < 1 + D && k < currentRowLength; k++) {
          blackCells.push([currentRow, k, 'B']);
          blackColumnsB.add(k);
        }
      }
    }
  }

  // Минимальный ряд для каждой черной ячейки типа A
  const blackRowByColumnA = new Map();
  for (const [row, col, type] of blackCells) {
    if (type === 'A') {
      if (!blackRowByColumnA.has(col) || row < blackRowByColumnA.get(col)) {
        blackRowByColumnA.set(col, row);
      }
    }
  }

  // Второй проход — отрисовка всех рядов
  currentRowLength = 0;
  for (let i = 1; i <= totalPairs; i++) {
    const additionalCells = (i <= NHV / 2) ? (increaseRows[i - 1] || 0) : 0;
    currentRowLength += additionalCells;

    for (let pairRow = 0; pairRow < 2; pairRow++) {
      const row = [];
      const currentRow = (i - 1) * 2 + pairRow + 1;

      for (let j = 0; j < currentRowLength; j++) {
        let cellStyle = styles.vNeckIncreaseCell;
        let isBlackCell = false;

        for (const [blackRow, blackCol, blackType] of blackCells) {
          if (currentRow === blackRow && j === blackCol) {
            cellStyle = styles.decreaseCell;
            isBlackCell = true;
            break;
          }
        }

        if (!isBlackCell && blackColumnsA.has(j) &&
          blackRowByColumnA.has(j) &&
          currentRow > blackRowByColumnA.get(j)) {
          cellStyle = {
            width: Lc,
            height: Hc,
            borderWidth: 1,
            borderColor: 'black',
            backgroundColor: '#808080',
            margin: 0,
          };
        }

        row.push(
          <View
            key={`vneck-left-${currentRow}-${j}`}
            style={[
              cellStyle,
              currentRow === highlightedRow + 1 && styles.highlightedCell
            ]}
          />
        );
      }

      cells.push(
        <View key={`vneck-left-${currentRow}`} style={[styles.row, styles.leftRow]}>
          {row}
        </View>
      );
    }
  }

  return cells;
};

{/*
  const renderVNeckLeftArray = () => {
    const cells = [];
    const results = introState.calculateRaglan();
    const increaseRows = isRaglanOutput(results) && results.resultStringV ? results.resultStringV.split(', ').map(Number) : [];
    
    // Отслеживаем черные ячейки [ряд, столбец]
    const blackCells = [];
    const blackColumnsA = new Set(); // столбцы с черными ячейками для decCelA
   
    const blackColumnsB = new Set(); // столбцы с черными ячейками для decCelB
    
    
    // Первый проход - определяем позиции черных ячеек
    let currentRowLength = 0;
    for (let i = 1; i <= NHV / 2; i++) {
        const additionalCells = increaseRows[i - 1] || 0;
        currentRowLength += additionalCells;

        for (let pairRow = 0; pairRow < 2; pairRow++) {
            const currentRow = (i - 1) * 2 + pairRow + 1;
            
            const SdecV = SVfront - SFrontV / 2;
            const NHVwork = NHV - 2;
            const D = Math.floor(SdecV / (NHVwork / 2));

            const decCelA = (D + 1) * (SdecV - D * (NHVwork / 2));
            const decCelB = SdecV - decCelA;

            const pairRowA = decCelA / (D + 1);
            const pairRowB = (NHVwork / 2) - pairRowA;

            const Kd = (NHVwork / 2) / pairRowA;

            const pozPairDecA = Array.from({ length: pairRowA }, (_, i) =>  Math.floor(i * Kd) + 2);
            const pozPairAll = Array.from({ length: NHVwork / 2 }, (_, i) => i + 2);
            const pozRowNHV = Array.from({ length: NHVwork }, (_, i) => i + 2);
            const pozPairDecB = pozPairAll.filter(p => !pozPairDecA.includes(p));

            const decRowsA = pozPairDecA.map(pos => pos * 2);
            const decRowsB = pozPairDecB.map(pos => pos * 2);

            // Ищем и запоминаем черные ячейки для decCelA
            if (decRowsA.includes(currentRow)) {
                for (let k = 1; k < 1 + D + 1 && k < currentRowLength; k++) {
                    blackCells.push([currentRow, k, 'A']); // Добавляем тип 'A'
                    blackColumnsA.add(k);
                    console.log(`Found black cell type A at row ${currentRow}, column ${k}`);
                }
            }
            
            // Ищем и запоминаем черные ячейки для decCelB
            if (D > 0 && decRowsB.includes(currentRow)) {
                for (let k = 1; k < 1 + D && k < currentRowLength; k++) {
                    blackCells.push([currentRow, k, 'B']); // Добавляем тип 'B'
                    blackColumnsB.add(k);
                    console.log(`Found black cell type B at row ${currentRow}, column ${k}`);
                }
            }
        }
    }
    
    // Сортируем черные ячейки по рядам (для отладки)
    blackCells.sort((a, b) => a[0] - b[0]);
    console.log("Black cells type A:", blackCells.filter(cell => cell[2] === 'A'));
    console.log("Black cells type B:", blackCells.filter(cell => cell[2] === 'B'));
    console.log("Black columns type A:", Array.from(blackColumnsA));
    console.log("Black columns type B:", Array.from(blackColumnsB));
    
    // Находим минимальный ряд для каждого столбца с черной ячейкой типа A
    const blackRowByColumnA = new Map(); // столбец -> ряд для типа A
    for (const [row, col, type] of blackCells) {
        if (type === 'A') {
            if (!blackRowByColumnA.has(col) || row < blackRowByColumnA.get(col)) {
                blackRowByColumnA.set(col, row);
            }
        }
    }
    console.log("Black row by column type A:", Array.from(blackRowByColumnA.entries()));
    
    // Второй проход - рисуем ячейки
    currentRowLength = 0;
    for (let i = 1; i <= NHV / 2; i++) {
        const additionalCells = increaseRows[i - 1] || 0;
        currentRowLength += additionalCells;

        for (let pairRow = 0; pairRow < 2; pairRow++) {
            const row = [];
            const currentRow = (i - 1) * 2 + pairRow + 1;
            
            const SdecV = SVfront - SFrontV / 2;
            const NHVwork = NHV - 2;
            const D = Math.floor(SdecV / (NHVwork / 2));

            const decCelA = (D + 1) * (SdecV - D * (NHVwork / 2));
            const decCelB = SdecV - decCelA;

            const pairRowA = decCelA / (D + 1);
            const pairRowB = (NHVwork / 2) - pairRowA;

            const Kd = (NHVwork / 2) / pairRowA;

            const pozPairDecA = Array.from({ length: pairRowA }, (_, i) =>  Math.floor(i * Kd) + 2);
            const pozPairAll = Array.from({ length: NHVwork / 2 }, (_, i) => i + 2);
            const pozRowNHV = Array.from({ length: NHVwork }, (_, i) => i + 2);
            const pozPairDecB = pozPairAll.filter(p => !pozPairDecA.includes(p));

            const decRowsA = pozPairDecA.map(pos => pos * 2);
            const decRowsB = pozPairDecB.map(pos => pos * 2);

            // Добавляем ячейки для текущего ряда
            for (let j = 0; j < currentRowLength; j++) {
                let cellStyle = styles.vNeckIncreaseCell;
                let isBlackCell = false;
                
                // Проверяем, является ли текущая ячейка черной
                for (const [blackRow, blackCol, blackType] of blackCells) {
                    if (currentRow === blackRow && j === blackCol) {
                        cellStyle = styles.decreaseCell;
                        isBlackCell = true;
                        break;
                    }
                }
                
                // Если ячейка не черная, но находится в столбце с черной ячейкой типа A и ниже неё
                if (!isBlackCell && blackColumnsA.has(j) && 
                    blackRowByColumnA.has(j) && 
                    currentRow > blackRowByColumnA.get(j)) {
                    cellStyle = {
                        width: Lc,
                        height: Hc,
                        borderWidth: 1,
                        borderColor: 'black',
                        backgroundColor: '#808080', // Серый цвет
                        margin: 0,
                    };
                    console.log(`Gray cell at row ${currentRow}, column ${j} (A type)`);
                }

                row.push(
                    <View 
                        key={`vneck-left-${currentRow}-${j}`} 
                        style={[
                            cellStyle,
                            currentRow === highlightedRow + 1 && styles.highlightedCell
                        ]} 
                    />
                );
            }
            
            cells.push(
                <View key={`vneck-left-${currentRow}`} style={[styles.row, styles.leftRow]}>
                    {row}
                </View>
            );
        }
    }

    // Повторяем последний ряд (NHFrontV-NHV) раз
    for (let i = 0; i < NHFrontV-NHV; i++) {
        const row = [];
        const currentRow = NHV + i;
        for (let j = 0; j < currentRowLength; j++) {
            let cellStyle = styles.vNeckIncreaseCell;
            
            // Если ячейка находится в столбце с черной ячейкой типа A и ниже черной
            if (blackColumnsA.has(j) && 
                blackRowByColumnA.has(j) && 
                currentRow > blackRowByColumnA.get(j)) {
                cellStyle = {
                    width: Lc,
                    height: Hc,
                    borderWidth: 1,
                    borderColor: 'black',
                    backgroundColor: '#808080', // Серый цвет
                    margin: 0,
                };
                console.log(`Gray cell at repeated row ${currentRow}, column ${j} (A type)`);
            }
            
            row.push(
                <View 
                    key={`vneck-left-repeat-${currentRow}-${j}`} 
                    style={[
                        cellStyle,
                        currentRow === highlightedRow + 1 && styles.highlightedCell
                    ]} 
                />
            );
        }
        
        cells.push(
            <View key={`vneck-left-repeat-${currentRow}`} style={[styles.row, styles.leftRow]}>
                {row}
            </View>
        );
    }

    return cells;
  };
*/}
  const renderVNeckRightArray = () => {
    const cells = [];
    const results = introState.calculateRaglan();
    const increaseRows = isRaglanOutput(results) && results.resultStringV ? results.resultStringV.split(', ').map(Number) : [];
    
    console.log('V-neck right array:', {
      increaseRows,
      NHV,
      results: isRaglanOutput(results) ? results.resultStringV : 'No results'
    });

    let currentRowLength = 0;

    for (let i = 1; i <= NHV / 2; i++) {
        const additionalCells = increaseRows[i - 1] || 0;
        currentRowLength += additionalCells;
        
        for (let pairRow = 0; pairRow < 2; pairRow++) {
            const row = [];
            const currentRow = (i - 1) * 2 + pairRow + 1;
            
            // Добавляем ячейки для текущего ряда
            for (let j = 0; j < currentRowLength; j++) {
                const cellStyle = styles.vNeckIncreaseCell;
                row.push(
                    <View 
                        key={`vneck-right-${currentRow}-${j}`} 
                        style={[
                            cellStyle,
                            currentRow === highlightedRow + 1 && styles.highlightedCell
                        ]} 
                    />
                );
            }
            
            cells.push(
                <View key={`vneck-right-${currentRow}`} style={styles.row}>
                    {row}
                </View>
            );
        }
    }

    // Повторяем последний ряд (NHFrontV-NHV) раз
    for (let i = 0; i < NHFrontV-NHV; i++) {
        const row = [];
        const currentRow = NHV + i;
        for (let j = 0; j < currentRowLength; j++) {
            const cellStyle = styles.vNeckIncreaseCell;
            row.push(
                <View 
                    key={`vneck-right-repeat-${currentRow}-${j}`} 
                    style={[
                        cellStyle,
                        currentRow === highlightedRow + 1 && styles.highlightedCell
                    ]} 
                />
            );
        }
        
        cells.push(
            <View key={`vneck-right-repeat-${currentRow}`} style={styles.row}>
                {row}
            </View>
        );
    }

    return cells;
  };
  
  

 
    // рисует правый массив прибавок реглана
  const renderRightIncreaseArrayV = () => {
    const increaseRowsV = getIncreaseRowsV();
    const cells = [];
    let additionalCells = 0;
  
    for (let i = 0; i < NHFrontV; i++) {
      if (increaseRowsV.includes(i + 1)) {
        additionalCells++;
      }
      const row = [];
      for (let j = 0; j < additionalCells; j++) {
        const isCurrentRowIncrease = increaseRowsV.includes(i + 1);
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
{/*
  const renderFrontV = () => {
    const cells = [];
    for (let i = 0; i < NHFrontV-NHV; i++) {
      const row = [];
      for (let j = 0; j < SFrontV; j++) {
        row.push(
          <View key={`${i}-${j}`} style={[i === -1 ? styles.ribbingCell : styles.cell]} />
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
*/}
  const highlightNextRow = () => {
    setHighlightedRow((prev) => (prev + 1) % (NHFrontV));
  };

  const highlightPreviousRow = () => {
    setHighlightedRow((prev) => (prev - 1 + NHFrontV) % (NHFrontV));
  };

{/* счетчик ячеек левого и правого массива */}
  const getLeftArrayCellCount = () => {
    const increaseRowsV = getIncreaseRowsV();
    let additionalCells = 0;
    if (highlightedRow < NHFrontV-NHV) {
      for (let i = 0; i <= highlightedRow; i++) {
        if (increaseRowsV.includes(i + 1)) {
          additionalCells++;
        }
      }
    }
    return additionalCells;
  };

  const getRightArrayCellCount = () => {
    const increaseRowsV = getIncreaseRowsV();
    let additionalCells = 0;
        if (highlightedRow < NHFrontV) {
            for (let i = 0; i <= highlightedRow; i++) {
                if (increaseRowsV.includes(i + 1)) {
                    additionalCells++;
                }
            }
        }
    return additionalCells;
  };
  const leftCellCount = getLeftArrayCellCount();
    const rightCellCount = getRightArrayCellCount();
    
    
  useEffect(() => {
    console.log('Debug values:', {
      NHFrontV,
      SfxV,
      PR_1x4_fV,
      PR_1x2_fV,
      prib_1x3_fV,
      prib_1x2_fV,
      prib_1x1_fV,
      PRib_1x3_fV,
      PRib_1x4_fV
    });

    const result24 = calculateIncreaseRows1x2_1x4V(NHFrontV, SfxV, PR_1x4_fV, PR_1x2_fV);
    console.log('calculateIncreaseRows1x2_1x4V result:', result24);

    const result23 = calculateIncreaseRows1x2_1x3V(NHFrontV, SfxV, prib_1x3_fV, prib_1x2_fV);
    console.log('calculateIncreaseRows1x2_1x3V result:', result23);

    const result21 = calculateIncreaseRows1x2_1x1V(NHFrontV, SfxV, prib_1x1_fV, prib_1x2_fV);
    console.log('calculateIncreaseRows1x2_1x1V result:', result21);

    const result43 = calculateIncreaseRows1x4_1x3V(NHFrontV, SfxV, PRib_1x4_fV, PRib_1x3_fV);
    console.log('calculateIncreaseRows1x4_1x3V result:', result43);
  }, [NHFrontV, SfxV, PR_1x4_fV, PR_1x2_fV, prib_1x3_fV, prib_1x2_fV, prib_1x1_fV, PRib_1x3_fV, PRib_1x4_fV]);

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
            {type === '1x2, 1x4' && isRaglanOutput(results) && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.PR_1x2_fV}</Text>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 4 ' + i18n.t('rows') + ': ' + results.PR_1x4_fV}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{resultString24V}</Text>
               
              </>
            )}
            
            {type === '1x2, 1x3' && isRaglanOutput(results) && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.prib_1x2_fV}</Text>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 3 ' + i18n.t('rows') + ': ' + results.prib_1x3_fV}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{resultString23V}</Text>
              </>
            )}
            {type === '1x2, 1x1' && isRaglanOutput(results) && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.prib_1x2_fV}</Text>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 1 ' + i18n.t('rows') + ': ' + results.prib_1x1_fV}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{resultString21V}</Text>
              </>
            )}
            {type === '1x3, 1x4' && isRaglanOutput(results) && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 3 ' + i18n.t('rows') + ': ' + results.PRib_1x3_fV}</Text>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 4 ' + i18n.t('rows') + ': ' + results.PRib_1x4_fV}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{resultString43V}</Text>
              </>
            )}
            {type === '1x4' && isRaglanOutput(results) && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 4 ' + i18n.t('rows') + ': ' + results.PR_1x4_fV}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{results.RowPrib1x4StringV}</Text>
              </>
            )}
             {type === '1x3' && isRaglanOutput(results) && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 3 ' + i18n.t('rows') + ': ' + results.prib_1x3_fV}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{results.RowPrib1x3StringV}</Text>
              </>
            )}
            {type === '1x2' && isRaglanOutput(results) && (
              <>
                <Text style={styles.resultText}>{'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.prib_1x2_fV}</Text>
                <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                <Text style={styles.resultText}>{results.RowPrib1x2StringV}</Text>
              </>
            )}
            {type === '1x1' && isRaglanOutput(results) && (
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

      <ScrollView 
          horizontal 
          contentContainerStyle={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}
        >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 0}}>
      
      <View style={[styles.horContainer]}>
        
          <View style={styles.increaseArrayLeft}>
            {renderLeftIncreaseArrayV()}
          </View>
          <View style={styles.vNeckRightArray}>
            {renderVNeckRightArray()}
          </View>
          <View style={styles.vNeckLeftArray}>
            {renderVNeckLeftArray()}
          </View>
       
         
       
          <View style={styles.increaseArrayRight}>
            {renderRightIncreaseArrayV()}
          </View>
          
        
      </View>
      </ScrollView>
      </ScrollView>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Current Row: {highlightedRow + 1}</Text>
        <Text style={styles.infoText}>Stitches: {leftCellCount + rightCellCount}</Text>
      </View>
      <View style={styles.navigationButtons}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.push('/(tabs)/index/input/resultV')}
      >
        <Text style={styles.backButtonText}>← Back to Result</Text>
      </TouchableOpacity>
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
    borderWidth: 0,
    borderColor: 'red',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  verticalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderWidth: 0,
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
    marginLeft: 10,
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
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#F4A39B',
  },
  leftRow: {
    justifyContent: 'flex-end',
  },
  defaultCell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black', // Без фона для обычных ячеек
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
});

export default App;

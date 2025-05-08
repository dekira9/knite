import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet , ScrollView,TouchableOpacity,Text   } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Ionicons } from '@expo/vector-icons';
import i18n from '@/utils/translations';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import introState from '@/state/introState';
import onboardingState from '@/state/onboardingState';
import { calculateIncreaseRows1x2_1x4V, calculateIncreaseRows1x2_1x3V, calculateIncreaseRows1x2_1x1V, calculateIncreaseRows1x4_1x3V } from '@/app/(tabs)/input/resultV';
import { RaglanOutput } from '@/utils/calculateRaglan';


const { stitchDensity, rowDensity } = introState;
const stitches = parseFloat(stitchDensity.replace(',', '.'))/10;
const rows = parseFloat(rowDensity.replace(',', '.'))/10;
const LsV = 1 / stitches;   {/*см ширина петли*/}
const hsV = 1 / rows; {/*  см высота петли или ряда */}
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
{/* прибавки по линии реглана */}
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
        {/* Добавляем ячейки в конец для левого массива*/}
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

  {/* Создаем массив с количеством доп. ячеек для каждой пары рядов (индекс = Math.floor(row / 2))*/}
  const additionalCellsPerPair = Array.from({ length: Math.ceil(NHFrontV / 2) }, (_, pairIndex) => {
      const pairNum = pairIndex + 1; {/* Номер пары, начиная с 1*/}
      return (pairNum <= NHV / 2) ? (increaseRows[pairNum - 1] || 0) : 0;
  });
  console.log('Массив additionalCellsPerPair:', additionalCellsPerPair);


  const blackCells: [number, number, string][] = []; {/* Уточняем тип*/}
  const blackColumnsA = new Set<number>();
  const blackColumnsB = new Set<number>();

  {/* --- Первый проход — собираем blackCells ---*/}
  let currentBlackCheckRowLength = 0; {/* Используем отдельную переменную для длины при поиске черных*/}
  const totalPairs = Math.ceil(NHFrontV / 2); {/* Используем ceil для полного охвата рядов*/}

  for (let i = 1; i <= totalPairs; i++) {
    {/* Получаем доп. ячейки для *текущей* пары*/}
    const currentPairAdditionalCells = additionalCellsPerPair[i - 1] || 0;
    currentBlackCheckRowLength += currentPairAdditionalCells;

    for (let pairRow = 0; pairRow < 2; pairRow++) {
      const currentRow = (i - 1) * 2 + pairRow + 1;
      if (currentRow > NHFrontV) continue; {/* Не выходить за пределы общего числа рядов*/}

      {/* --- Расчеты для убавок (A и B) ---*/}
      const SdecV = SVfront - SFrontV / 2;
      const NHVwork = NHV - 2;
      if (NHVwork <= 0 || SdecV <= 0) continue; {/* Предотвращение деления на ноль или некорректных расчетов*/}

      const D = Math.floor(SdecV / (NHVwork / 2));
      const decCelA = (D + 1) * (SdecV - D * (NHVwork / 2));
      const decCelB = SdecV - decCelA;
      const pairRowA = decCelA > 0 && (D + 1) > 0 ? decCelA / (D + 1) : 0;
      const pairRowB = (NHVwork / 2) - pairRowA;
      const Kd = pairRowA > 0 ? (NHVwork / 2) / pairRowA : Infinity; {/* Коэффициент для A*/}

      const pozPairDecA = Array.from({ length: Math.max(0, Math.floor(pairRowA)) }, (_, idx) => Math.floor(idx * Kd) + 2);
      const pozPairAll = Array.from({ length: Math.max(0, Math.floor(NHVwork / 2)) }, (_, idx) => idx + 2);
      const pozPairDecB = pozPairAll.filter(p => !pozPairDecA.includes(p));

      const decRowsA = pozPairDecA.map(pos => pos * 2);
      const decRowsB = pozPairDecB.map(pos => pos * 2);
      {/* --- Конец расчетов для убавок ---*/}


      {/* dec A*/}
      if (decRowsA.includes(currentRow)) {
        for (let k = 1; k <= 1 + D && k <= currentBlackCheckRowLength; k++) { 
          blackCells.push([currentRow, k, 'A']);
          blackColumnsA.add(k);
        }
      }
      {/* dec B*/}
      if (D > 0 && decRowsB.includes(currentRow)) {
        for (let k = 1; k <= D && k <= currentBlackCheckRowLength; k++) {
          blackCells.push([currentRow, k, 'B']);
          blackColumnsB.add(k);
        }
      }
    }
  }
  console.log('blackCells', blackCells);
  console.log('blackColumnsA', blackColumnsA);
  console.log('blackColumnsB', blackColumnsB);

  {/* --- Вычисляем позиции серых ячеек ДЛЯ ЛЕВОЙ СТОРОНЫ ---*/}
  const getGreyCellsLeft = ( 
    blackCells: [number, number, string][],
    additionalCellsPerPair: number[],
    totalRows: number
  ): Set<string> => {
    const greyCellsSet = new Set<string>(); {/* Используем Set для быстрого поиска "row,col"*/}

    for (const [blackRow, blackCol, type] of blackCells) {
      let greyCol = blackCol; {/* Начинаем со столбца черной ячейки*/}
      for (let currentRow = blackRow + 1; currentRow <= totalRows; currentRow++) {
        if (currentRow % 2 !== 0) {  {/*Если номер ряда нечетный*/}
          const additionalCellsIndex = Math.floor(currentRow / 2);  {/*Индекс для массива доп. ячеек*/}
          {/* Проверяем границы массива*/}
          if (additionalCellsIndex >= 0 && additionalCellsIndex < additionalCellsPerPair.length) {
             greyCol += additionalCellsPerPair[additionalCellsIndex] || 0; {/* Добавляем доп. ячейки из массива (смещение вправо)*/}
          }
        }
        {/* Добавляем координаты серой ячейки в Set*/}
        greyCellsSet.add(`${currentRow},${greyCol}`);
      }
    }
    return greyCellsSet;
  };

  const calculatedGreyCells = getGreyCellsLeft(blackCells, additionalCellsPerPair, NHFrontV); 
  console.log('Рассчитанные серые ячейки (Left Set):', calculatedGreyCells);


  {/* --- Второй проход — отрисовка всех рядов (Левая сторона) ---*/}
  let currentRowLength = 0; {/* Сбрасываем длину для отрисовки*/}
  const totalPairsRender = Math.ceil(NHFrontV / 2); {/* Используем то же количество пар*/}
  
  {/* Сохраняем длину предыдущего ряда для определения новых ячеек*/}
  let previousRowLength = 0;
  const addedYellowCellsLeft: [number, number][] = []; {/* Массив для хранения координат желтых ячеек*/}
  
  for (let i = 1; i <= totalPairsRender; i++) {
    {/* Получаем доп. ячейки для *текущей* пары для расчета длины ряда*/}
    const currentPairAdditionalCells = additionalCellsPerPair[i - 1] || 0;
    previousRowLength = currentRowLength;
    currentRowLength += currentPairAdditionalCells;

    for (let pairRow = 0; pairRow < 2; pairRow++) {
      const row = [];
      const currentRow = (i - 1) * 2 + pairRow + 1;
      if (currentRow > NHFrontV) continue; {/* Пропускаем ряды сверх лимита*/}
      
      {/* Определяем, является ли этот ряд нечетным*/}
      const isOddRow = currentRow % 2 !== 0;

      for (let j = 0; j < currentRowLength; j++) {
        {/* Проверяем, является ли ячейка новой добавленной в нечетном ряду*/}
        let cellStyle = styles.vNeckIncreaseCell; {/* По умолчанию стандартный стиль*/}
        
        {/* Если это нечетный ряд И текущий индекс ячейки находится в диапазоне новых ячеек*/}
        {/* Для левого массива новые ячейки добавляются в начале (слева)*/}
        if (isOddRow && j < currentRowLength - previousRowLength) {
          cellStyle = styles.ribbingCell; {/* Желтый цвет для новых ячеек*/}
          addedYellowCellsLeft.push([currentRow, j]); {/* Добавляем координаты желтой ячейки*/}
        }
        
        let isBlackCell = false;
        const cellKey = `${currentRow},${j}`; {/* Ключ для поиска в Set*/}

        {/* Проверяем, является ли ячейка черной*/}
        for (const [blackRow, blackCol, blackType] of blackCells) {
            if (currentRow === blackRow && j === blackCol) {
                cellStyle = styles.decreaseCell; {/* Стиль черной ячейки*/}
                isBlackCell = true;
                break;
            }
        }

        {/* Если ячейка не черная, проверяем, является ли она серой*/}
        if (!isBlackCell && calculatedGreyCells.has(cellKey)) {
             cellStyle = styles.cellsBelow; {/* Стиль серой ячейки*/}
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

  console.log('Прибавленные желтые ячейки (Левая сторона):', addedYellowCellsLeft);
  return cells;
};


  const renderVNeckRightArray = () => {
    const cells = [];
    const results = introState.calculateRaglan();
    const increaseRows = isRaglanOutput(results) && results.resultStringV
      ? results.resultStringV.split(', ').map(Number)
      : [];

    {/* Массив доп. ячеек нужен для расчета длины ряда и позиций черных ячеек*/}
    const additionalCellsPerPair = Array.from({ length: Math.ceil(NHFrontV / 2) }, (_, pairIndex) => {
        const pairNum = pairIndex + 1;
        return (pairNum <= NHV / 2) ? (increaseRows[pairNum - 1] || 0) : 0;
    });

    const blackCellsRight: [number, number, string][] = [];
    let currentBlackCheckRowLength = 0;
    const totalPairs = Math.ceil(NHFrontV / 2);

    for (let i = 1; i <= totalPairs; i++) {
      const currentPairAdditionalCells = additionalCellsPerPair[i - 1] || 0;
      currentBlackCheckRowLength += currentPairAdditionalCells;

      for (let pairRow = 0; pairRow < 2; pairRow++) {
        const currentRow = (i - 1) * 2 + pairRow + 1;
        if (currentRow > NHFrontV) continue;

        const SdecV = SVfront - SFrontV / 2;
        console.log('SdecV', SdecV);
        const NHVwork = NHV - 2;
        if (NHVwork <= 0 || SdecV <= 0) continue;

        const D = Math.floor(SdecV / (NHVwork / 2));
        const decCelA = (D + 1) * (SdecV - D * (NHVwork / 2));
        const decCelB = SdecV - decCelA;
        const pairRowA = decCelA > 0 && (D + 1) > 0 ? decCelA / (D + 1) : 0;
        const pairRowB = (NHVwork / 2) - pairRowA;
        const Kd = pairRowA > 0 ? (NHVwork / 2) / pairRowA : Infinity;

        const pozPairDecA = Array.from({ length: Math.max(0, Math.floor(pairRowA)) }, (_, idx) => Math.floor(idx * Kd) + 2);
        const pozPairAll = Array.from({ length: Math.max(0, Math.floor(NHVwork / 2)) }, (_, idx) => idx + 2);
        const pozPairDecB = pozPairAll.filter(p => !pozPairDecA.includes(p));

        const decRowsA = pozPairDecA.map(pos => pos * 2);
        const decRowsB = pozPairDecB.map(pos => pos * 2);

        if (decRowsA.includes(currentRow)) {
          for (let k = 1; k <= 1 + D && k <= currentBlackCheckRowLength; k++) {
            const colIndex = currentBlackCheckRowLength - k-1; {/*  -k для правильного отсчета справа налево*/}
            if (colIndex >= 0) {
              blackCellsRight.push([currentRow, colIndex, 'A']);
            }
          }
        }
        if (D > 0 && decRowsB.includes(currentRow)) {
          for (let k = 1; k <= D && k <= currentBlackCheckRowLength; k++) {
            const colIndex = currentBlackCheckRowLength - k-1; {/*  -k для правильного отсчета справа налево*/}
             if (colIndex >= 0) {
               blackCellsRight.push([currentRow, colIndex, 'B']);
             }
          }
        }
      }
    }
     console.log('blackCellsRight', blackCellsRight);

    {/* --- Вычисляем позиции серых ячеек для ПРАВОЙ СТОРОНЫ (новая простая логика) ---*/}
    const calculatedGreyCellsRight = new Set<string>();
    for (const [blackRow, blackCol, type] of blackCellsRight) {
        for (let currentRow = blackRow + 1; currentRow <= NHFrontV; currentRow++) {
            {/* Серый столбец такой же, как у черной ячейки*/}
            const greyCol = blackCol;
            calculatedGreyCellsRight.add(`${currentRow},${greyCol}`);
        }
    }
    console.log('Рассчитанные серые ячейки (Right Set - Simple):', calculatedGreyCellsRight);


    {/* --- Второй проход — отрисовка всех рядов (Правая сторона) ---*/}
    let currentRowLength = 0; {/* Сбрасываем длину для отрисовки*/}
    const totalPairsRenderRight = Math.ceil(NHFrontV / 2); {/* Используем то же количество пар*/}
    
    {/* Сохраняем длину предыдущего ряда для определения новых ячеек*/}
    let previousRowLength = 0;
    
    for (let i = 1; i <= totalPairsRenderRight; i++) {
      const currentPairAdditionalCells = additionalCellsPerPair[i - 1] || 0;
      previousRowLength = currentRowLength;
      currentRowLength += currentPairAdditionalCells;

      for (let pairRow = 0; pairRow < 2; pairRow++) {
        const row = [];
        const currentRow = (i - 1) * 2 + pairRow + 1;
        if (currentRow > NHFrontV) continue;
        
        {/* Определяем, является ли этот ряд нечетным*/}
        const isOddRow = currentRow % 2 !== 0;

        for (let j = 0; j < currentRowLength; j++) {
          {/* Проверяем, является ли ячейка новой добавленной в нечетном ряду*/}
          let cellStyle = styles.vNeckIncreaseCell; {/* По умолчанию стандартный стиль*/}
          
          {/* Если это нечетный ряд И текущий индекс ячейки находится в диапазоне новых ячеек*/}
          if (isOddRow && j >= previousRowLength && j < currentRowLength) {
            cellStyle = styles.ribbingCell; {/* Желтый цвет для новых ячеек*/}
          }
          
          let isBlackCell = false;
          const cellKey = `${currentRow},${j}`;

          {/* Проверяем, является ли ячейка черной (справа)*/}
          for (const [blackRow, blackCol, blackType] of blackCellsRight) {
              if (currentRow === blackRow && j === blackCol) {
                  cellStyle = styles.decreaseCell;
                  isBlackCell = true;
                  break;
              }
          }

          {/* Если не черная, проверяем, является ли серой (справа, по новой логике)*/}
          if (!isBlackCell && calculatedGreyCellsRight.has(cellKey)) {
               cellStyle = styles.cellsBelow; {/* Стиль серой ячейки*/}
          }

          row.push(
              <View
                  key={`vneck-right-${currentRow}-${j}`} // Уникальный ключ для правой стороны 
                  style={[
                      cellStyle,
                      currentRow === highlightedRow + 1 && styles.highlightedCell
                  ]}
              />
          );
        }

        {/* Используем обычный стиль ряда (выравнивание слева)*/}
        cells.push(
          <View key={`vneck-right-${currentRow}`} style={styles.row}>
            {row}
          </View>
        );
      }
    }

    return cells;
  };
  {/* --- Вспомогательная функция для получения длины ряда ---*/}
  const getRowLength = (rowNum: number, additionalCellsData: number[]): number => {
    let length = 0;
    {/* Индекс последней *завершенной* пары перед началом этого ряда*/}
    const targetPairIndex = Math.floor((rowNum - 1) / 2);
    for (let i = 0; i <= targetPairIndex; i++) {
        {/* Суммируем доп. ячейки для всех пар до текущей (включительно)*/}
        length += additionalCellsData[i] || 0;
    }
    return length;
};

{/* --- Мемоизированные вычисления для V-образного выреза ---*/}
{/* Создаем один общий useMemo на уровне компонента*/}
const vNeckData = useMemo(() => {
  const results = introState.calculateRaglan();
  const increaseRows = isRaglanOutput(results) && results.resultStringV
    ? results.resultStringV.split(', ').map(Number)
    : [];

  {/* Создаем массив с количеством доп. ячеек для каждой пары рядов*/}
  const additionalCellsPerPair = Array.from({ length: Math.ceil(NHFrontV / 2) }, (_, pairIndex) => {
    const pairNum = pairIndex + 1; {/* Номер пары, начиная с 1*/}
    return (pairNum <= NHV / 2) ? (increaseRows[pairNum - 1] || 0) : 0;
  });

  {/* --- Вычисления для левой стороны ---*/}
  const blackCells: [number, number, string][] = [];
  let currentBlackCheckRowLength = 0;
  const totalPairs = Math.ceil(NHFrontV / 2);

  for (let i = 1; i <= totalPairs; i++) {
    const currentPairAdditionalCells = additionalCellsPerPair[i - 1] || 0;
    currentBlackCheckRowLength += currentPairAdditionalCells;

    for (let pairRow = 0; pairRow < 2; pairRow++) {
      const currentRow = (i - 1) * 2 + pairRow + 1;
      if (currentRow > NHFrontV) continue;

      const SdecV = SVfront - SFrontV / 2;
      const NHVwork = NHV - 2;
      if (NHVwork <= 0 || SdecV <= 0) continue;

      const D = Math.floor(SdecV / (NHVwork / 2));
      const decCelA = (D + 1) * (SdecV - D * (NHVwork / 2));
      const decCelB = SdecV - decCelA;
      const pairRowA = decCelA > 0 && (D + 1) > 0 ? decCelA / (D + 1) : 0;
      const pairRowB = (NHVwork / 2) - pairRowA;
      const Kd = pairRowA > 0 ? (NHVwork / 2) / pairRowA : Infinity;

      const pozPairDecA = Array.from({ length: Math.max(0, Math.floor(pairRowA)) }, (_, idx) => Math.floor(idx * Kd) + 2);
      const pozPairAll = Array.from({ length: Math.max(0, Math.floor(NHVwork / 2)) }, (_, idx) => idx + 2);
      const pozPairDecB = pozPairAll.filter(p => !pozPairDecA.includes(p));

      const decRowsA = pozPairDecA.map(pos => pos * 2);
      const decRowsB = pozPairDecB.map(pos => pos * 2);

      {/* dec A*/}
      if (decRowsA.includes(currentRow)) {
        for (let k = 1; k <= 1 + D && k <= currentBlackCheckRowLength; k++) {
          blackCells.push([currentRow, k, 'A']);
        }
      }
      {/* dec B*/}
      if (D > 0 && decRowsB.includes(currentRow)) {
        for (let k = 1; k <= D && k <= currentBlackCheckRowLength; k++) {
          blackCells.push([currentRow, k, 'B']);
        }
      }
    }
  }

  {/* Серые ячейки для левой стороны*/}
  const calculatedGreyCells = new Set<string>();
  for (const [blackRow, blackCol, type] of blackCells) {
    let greyCol = blackCol;
    for (let currentRow = blackRow + 1; currentRow <= NHFrontV; currentRow++) {
      if (currentRow % 2 !== 0) {
        const additionalCellsIndex = Math.floor(currentRow / 2);
        if (additionalCellsIndex >= 0 && additionalCellsIndex < additionalCellsPerPair.length) {
          greyCol += additionalCellsPerPair[additionalCellsIndex] || 0;
        }
      }
      calculatedGreyCells.add(`${currentRow},${greyCol}`);
    }
  }

  {/* --- Вычисления для правой стороны ---*/}
  const blackCellsRight: [number, number, string][] = [];
  let currentBlackCheckRowLengthRight = 0;

  for (let i = 1; i <= totalPairs; i++) {
    const currentPairAdditionalCells = additionalCellsPerPair[i - 1] || 0;
    currentBlackCheckRowLengthRight += currentPairAdditionalCells;

    for (let pairRow = 0; pairRow < 2; pairRow++) {
      const currentRow = (i - 1) * 2 + pairRow + 1;
      if (currentRow > NHFrontV) continue;

      const SdecV = SVfront - SFrontV / 2;
      const NHVwork = NHV - 2;
      if (NHVwork <= 0 || SdecV <= 0) continue;

      const D = Math.floor(SdecV / (NHVwork / 2));
      const decCelA = (D + 1) * (SdecV - D * (NHVwork / 2));
      const decCelB = SdecV - decCelA;
      const pairRowA = decCelA > 0 && (D + 1) > 0 ? decCelA / (D + 1) : 0;
      const pairRowB = (NHVwork / 2) - pairRowA;
      const Kd = pairRowA > 0 ? (NHVwork / 2) / pairRowA : Infinity;

      const pozPairDecA = Array.from({ length: Math.max(0, Math.floor(pairRowA)) }, (_, idx) => Math.floor(idx * Kd) + 2);
      const pozPairAll = Array.from({ length: Math.max(0, Math.floor(NHVwork / 2)) }, (_, idx) => idx + 2);
      const pozPairDecB = pozPairAll.filter(p => !pozPairDecA.includes(p));

      const decRowsA = pozPairDecA.map(pos => pos * 2);
      const decRowsB = pozPairDecB.map(pos => pos * 2);

      if (decRowsA.includes(currentRow)) {
        for (let k = 1; k <= 1 + D && k <= currentBlackCheckRowLengthRight; k++) {
          const colIndex = currentBlackCheckRowLengthRight - k - 1;
          if (colIndex >= 0) {
            blackCellsRight.push([currentRow, colIndex, 'A']);
          }
        }
      }
      if (D > 0 && decRowsB.includes(currentRow)) {
        for (let k = 1; k <= D && k <= currentBlackCheckRowLengthRight; k++) {
          const colIndex = currentBlackCheckRowLengthRight - k - 1;
          if (colIndex >= 0) {
            blackCellsRight.push([currentRow, colIndex, 'B']);
          }
        }
      }
    }
  }

  {/* Серые ячейки для правой стороны*/}
  const calculatedGreyCellsRight = new Set<string>();
  for (const [blackRow, blackCol, type] of blackCellsRight) {
    for (let currentRow = blackRow + 1; currentRow <= NHFrontV; currentRow++) {
      const greyCol = blackCol;
      calculatedGreyCellsRight.add(`${currentRow},${greyCol}`);
    }
  }

  return {
    additionalCellsPerPair,
    blackCells,
    calculatedGreyCells,  
    blackCellsRight,
    calculatedGreyCellsRight
  };
}, [NHFrontV, NHV, SVfront, SFrontV]);

{/* --- НОВЫЕ ФУНКЦИИ ПОДСЧЕТА ЯЧЕЕК ---*/}
{/* Теперь принимаем данные как параметр*/}
const getVNeckLeftStitchCount = (data: any): number => {
  const rowNum = highlightedRow + 1;
  if (rowNum < 1 || rowNum > NHFrontV) return 0;

  const { additionalCellsPerPair, blackCells, calculatedGreyCells } = data;
  const rowLength = getRowLength(rowNum, additionalCellsPerPair);
  let count = rowLength;

  for (let j = 0; j < rowLength; j++) {
    const isBlack = Array.isArray(blackCells) && blackCells.some(cell => cell[0] === rowNum && cell[1] === j);
    const isGrey = calculatedGreyCells instanceof Set && calculatedGreyCells.has(`${rowNum},${j}`);
    if (isBlack || isGrey) {
      count--;
    }
  }
  return Math.max(0, count);
};

{/* Теперь принимаем данные как параметр*/}
const getVNeckRightStitchCount = (data: any): number => {
  const rowNum = highlightedRow + 1;
  if (rowNum < 1 || rowNum > NHFrontV) return 0;

  const { additionalCellsPerPair, blackCellsRight, calculatedGreyCellsRight } = data;
  const rowLength = getRowLength(rowNum, additionalCellsPerPair);
  let count = rowLength;

  for (let j = 0; j < rowLength; j++) {
    const isBlack = Array.isArray(blackCellsRight) && blackCellsRight.some(cell => cell[0] === rowNum && cell[1] === j);
    const isGrey = calculatedGreyCellsRight instanceof Set && calculatedGreyCellsRight.has(`${rowNum},${j}`);
    if (isBlack || isGrey) {
      count--;
    }
  }
  return Math.max(0, count);
};

{/* Получаем текущие значения счетчиков для отображения*/}
{/* Теперь передаем vNeckData в функции*/}  
const leftVNeckCount = getVNeckLeftStitchCount(vNeckData);
const rightVNeckCount = getVNeckRightStitchCount(vNeckData);

  

 
     {/* рисует правый массив прибавок реглана*/}
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
        {/* Добавляем ячейки в конец для правого массива*/}
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
    if (highlightedRow < NHFrontV) {
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
      <View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 0}}>
       <View style={{width: 17, height: 17, backgroundColor: 'yellow', marginLeft: 10, borderWidth: 1}}></View>
       <Text style={styles.resultText}> {i18n.t('knitTheStitchesFromTheRibbing')} </Text>
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
       <View style={{width: 17, height: 17, backgroundColor: '#F4A39B', marginLeft: 10, borderWidth: 1}}></View>
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
        <Text style={styles.infoText}>Stitches: {leftCellCount + rightCellCount + leftVNeckCount + rightVNeckCount}</Text>
      </View>
      <View style={styles.navigationButtons}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.push('/(tabs)/input/resultV')}
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
    
   
  },
  optionButton: {
    marginBottom: 5,
    padding: 5,
    backgroundColor: '#C6C6C6',
    borderRadius: 5,
    width: '100%',
  },
  selectedOptionButton: {
    backgroundColor: '#007AFF',
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
    borderColor: 'black',
  },
  ribbingCell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'yellow',
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
});

export default App;


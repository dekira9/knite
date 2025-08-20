import React, { useEffect, useState } from 'react';
import { View, StyleSheet , ScrollView,TouchableOpacity,Text   } from 'react-native';
import introState from '@/state/introState';
import raglanState from '@/state/raglanState';
import { observer } from 'mobx-react-lite';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import i18n from '@/utils/translations';

import { 
  
  calculateVNeckIncreases01,
  calculateVNeckIncreases11,
  calculateVNeckIncreases12,
  calculateVNeckIncreases22
} from '@/app/(tabs)/index/input/resultV';
const { stitchDensity, rowDensity } = introState;
const stitches = parseFloat(stitchDensity.replace(',', '.'))/10;
const rows = parseFloat(rowDensity.replace(',', '.'))/10;
const LsV = 1 / stitches;   //см ширина петли
const hsV = 1 / rows; //см высота петли или ряда
const Hc=hsV*25;
const Lc=LsV*25

const App = observer(() => {
  const {SFrontV, SaV, KV, NRrezV, SpribVcorn, RowPribRV1, RowPribRV2, RowPribRVz, SV, SVfront, LHV, LVfront } = introState;
  const ribbingWidthV = introState.ribbingWidthV;
   
    const NHV = Math.round(LHV * rows/2)*2;


  const [highlightedRow, setHighlightedRow] = useState(-1);
  const router = useRouter();
  //rotate v
  const angleInRadians = Math.acos(((SFrontV)*LsV/2)/((SVfront+1)*LsV)); 
  console.log('NHV',NHV)
  console.log('SVfront',SVfront)
  console.log('LVfront',LVfront)
  console.log('SV',SV)
    const angleInDegrees = (angleInRadians * (180 / Math.PI)+3); // Преобразование радиан в градусы

  console.log('angleInDegrees',angleInDegrees)

  const calculateRowCellCounts = (highlightedRow: number) => {
    const totalRows = NRrezV + 1;
    
    if (!NRrezV || !SpribVcorn || !SV || totalRows <= 1) {
      return [];
    }
  
    let increases: Array<number> = [];
  
    // Выбор функции на основе условий (аналогично renderRows)
    if (Math.floor(SpribVcorn / NRrezV) === 1 && SpribVcorn > NRrezV) {
      const { increases12 } = calculateVNeckIncreases12(NRrezV, RowPribRV1, RowPribRV2);
      increases = increases12;
    } else if (Math.floor(SpribVcorn / NRrezV) === 0) {
      const { increases01 } = calculateVNeckIncreases01(NRrezV, SpribVcorn, RowPribRV1, RowPribRVz);
      increases = increases01?.map(val => val === null ? 0 : val) || [];
    } else if (SpribVcorn === NRrezV) {
      const { increases11 } = calculateVNeckIncreases11(NRrezV, RowPribRV1, SpribVcorn);
      increases = increases11;
    } else if (SpribVcorn === (2 * NRrezV)) {
      const { increases22 } = calculateVNeckIncreases22(NRrezV, RowPribRV2, SpribVcorn);
      increases = increases22;
    }
  
   
    // Расчет количества ячеек для каждого ряда
    const cellCounts: number[] = [];
    let currentSquares = SV;
  
    // Первый ряд (i=-1)
    cellCounts.push(currentSquares);
    
    // Последующие ряды
    for (let i = 0; i < increases.length; i++) {
      currentSquares += increases[i];
      cellCounts.push(currentSquares);
    }
  
    // Возвращаем общее количество ячеек для выделенного ряда
    return cellCounts[highlightedRow + 1];
  };
  const currentRowStitches = calculateRowCellCounts(highlightedRow);
  
  





  const LeftSleeveTransform = [
  { translateY:-(KV * Lc) * Math.sin(angleInRadians) },
   { translateX: (KV * Lc - KV * Lc* Math.cos(angleInRadians)) },
    { rotate: '90deg' },
  ];
  const RightSleeveTransform = [
    { translateY: -KV * Lc * Math.sin(angleInRadians) },
    { translateX: -(KV * Lc- KV * Lc * Math.cos(angleInRadians)) },
    { rotate: '-90deg' },
  ];
  const line3Transform = [
    { translateY:(NRrezV+1) * Hc },
    { translateX: KV * Lc },
    { rotate: `-${180+angleInDegrees}deg` },
    
  ];
  const line4Transform = [
    { translateY: (NRrezV+1) * Hc },
    { translateX: -KV * Lc },
    { rotate: `${180+angleInDegrees}deg` },
  ];
  
  

  const renderLine1 = () => {
    const numRows = NRrezV;
    const numCols = KV;
    const cells = [];
    const cellCounts = calculateRowCellCounts(highlightedRow);  //Get cell counts for all rows
    
    for (let i = -1; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(
          <View key={`${i}-${j}`} style={[
            i === 0 ? styles.firstCell : styles.cell,
            i === -1 && styles.zeroRowSquare,
            i === numRows - 1 && styles.lastRowSquare,
            i === highlightedRow && styles.highlightedCell
           
          ]} />
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
  const renderLine2 = () => {
    const numRows = NRrezV;
    const numCols = KV;
    const cells = [];
    const cellCounts = calculateRowCellCounts(highlightedRow);
    for (let i = -1; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(
          <View key={`${i}-${j}`} style={[i === 0 ? styles.firstCell : styles.cell,
            i === -1 && styles.zeroRowSquare,
            i === numRows - 1 && styles.lastRowSquare,
            i === highlightedRow && styles.highlightedCell
            
            ]} />
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
  const renderLine3 = () => {
    const numRows = NRrezV;
    const numCols = KV;
    const cells = [];
    const cellCounts = calculateRowCellCounts(highlightedRow);
    for (let i = -1; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(
          <View key={`${i}-${j}`} style={[i === 0 ? styles.firstCell : styles.cell,
            i === -1 && styles.zeroRowSquare,
            i === numRows - 1 && styles.lastRowSquare,
            i === highlightedRow && styles.highlightedCell
            
          ]} />
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
  const renderLine4 = () => {
    const numRows = NRrezV;
    const numCols = KV;
    const cells = [];
    const cellCounts = calculateRowCellCounts(highlightedRow);
    for (let i = -1; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(
          <View key={`${i}-${j}`} style={[i === 0 ? styles.firstCell : styles.cell,
            i === -1 && styles.zeroRowSquare,
            i === numRows - 1 && styles.lastRowSquare,
            i === highlightedRow && styles.highlightedCell
            
          ]} />
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
  

  const renderBack = () => {
    const numRows = NRrezV;
    const numCols = SFrontV;
    const cells = [];
    const cellCounts = calculateRowCellCounts(highlightedRow);
    for (let i = -1; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(
          <View key={`${i}-${j}`} style={[i === 0 ? styles.firstCell : styles.cell,
            i === -1 && styles.zeroRowSquare,
            i === numRows - 1 && styles.lastRowSquare,
            i === highlightedRow && styles.highlightedCell
            
          ]} />
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
  const renderLeftSleeve = () => {
    const numRows = NRrezV;
    const numCols = SaV;
    const cells = [];
    const cellCounts = calculateRowCellCounts(highlightedRow);
    for (let i = -1; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(
          <View key={`${i}-${j}`} style={[i === 0 ? styles.firstCell : styles.cell,
            i === -1 && styles.zeroRowSquare,
            i === numRows - 1 && styles.lastRowSquare,
            i === highlightedRow && styles.highlightedCell,
            
          ]} />
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
  const renderRightSleeve = () => {
    const numRows = NRrezV;
    const numCols = SaV;
    const cells = [];
    const cellCounts = calculateRowCellCounts(highlightedRow);
    for (let i = -1; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(
          <View key={`${i}-${j}`} style={[
            i === 0 ? styles.firstCell : styles.cell,
            i === -1 && styles.zeroRowSquare,
            i === numRows - 1 && styles.lastRowSquare,
            i === highlightedRow && styles.highlightedCell,
            
          ]} />
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
  
  const renderRows = () => {
    const rows = [];
    const totalRows = NRrezV + 1;
    const cellCounts = calculateRowCellCounts(highlightedRow);
  
    if (!NRrezV || !SpribVcorn || !SV || totalRows <= 1) {
      return <Text>Загрузка данных...</Text>;
    }
  
    let increases: Array<number> = [];
    let resultString = '';
  
    // Выбор функции на основе условий
    if (Math.floor(SpribVcorn / NRrezV) === 1 && SpribVcorn > NRrezV) {
      const { increases12, resultStringV12 } = calculateVNeckIncreases12(NRrezV, RowPribRV1, RowPribRV2);
      increases = increases12;
      resultString = resultStringV12 || '';
      
    } else if (Math.floor(SpribVcorn / NRrezV) === 0) {
      const { increases01, resultStringV01 } = calculateVNeckIncreases01(NRrezV, SpribVcorn, RowPribRV1, RowPribRVz);
      increases = increases01?.map(val => val === null ? 0 : val) || [];
      resultString = resultStringV01 || '';
     
    } else if (SpribVcorn === NRrezV) {
      const { increases11, resultStringV11 } = calculateVNeckIncreases11(NRrezV, RowPribRV1, SpribVcorn);
      increases = increases11;
      resultString = resultStringV11 || '';
      
    } else if (SpribVcorn === (2 * NRrezV)) {
      const { increases22, resultStringV22 } = calculateVNeckIncreases22(NRrezV, RowPribRV2, SpribVcorn);
      increases = increases22;
      resultString = resultStringV22 || '';
     
    }
  
    let currentSquares = SV;
  
    for (let i = -1; i < totalRows - 1; i++) {
      const row = [];
      for (let j = 0; j < currentSquares; j++) {
        row.push(
          <View 
            key={`${i}-${j}`} 
            style={[
              styles.square,
              i === -1 && styles.zeroRowSquare,
              i===0 && styles.firstRowSquare,
              i === totalRows - 2 && styles.lastRowSquare,
              i  === highlightedRow && styles.highlightedCell
            ]} 
          />
        );
      }
      rows.push(
        <View key={i} style={styles.row}>
          <Text style={[styles.squareCount, styles.leftSquareCount]}>{currentSquares}</Text>
          <View style={styles.squaresContainer}>
            {row}
          </View>
        </View>
      );
  
      if (i < totalRows - 2) {
        currentSquares += increases[i + 1];
      }
    }
    
  
    return (
      <>
        {rows}
        {resultString ? (
          <Text style={styles.resultText}>
            {resultString}
          </Text>
        ) : null}
      </>
    );
  };

  const renderRowsRight = () => {
    const rows = [];
    const totalRows = NRrezV + 1;
    const cellCounts = calculateRowCellCounts(highlightedRow);
  
    if (!NRrezV || !SpribVcorn || !SV || totalRows <= 1) {
      return <Text>Загрузка данных...</Text>;
    }
  
    let increases: Array<number> = [];
    let resultString = '';
  
    // Выбор функции на основе условий
    if (Math.floor(SpribVcorn / NRrezV) === 1 && SpribVcorn > NRrezV) {
      const { increases12, resultStringV12 } = calculateVNeckIncreases12(NRrezV, RowPribRV1, RowPribRV2);
      increases = increases12;
      resultString = resultStringV12 || '';
      
    } else if (Math.floor(SpribVcorn / NRrezV) === 0) {
      const { increases01, resultStringV01 } = calculateVNeckIncreases01(NRrezV, SpribVcorn, RowPribRV1, RowPribRVz);
      increases = increases01?.map(val => val === null ? 0 : val) || [];
      resultString = resultStringV01 || '';
     
    } else if (SpribVcorn === NRrezV) {
      const { increases11, resultStringV11 } = calculateVNeckIncreases11(NRrezV, RowPribRV1, SpribVcorn);
      increases = increases11;
      resultString = resultStringV11 || '';
      
    } else if (SpribVcorn === (2 * NRrezV)) {
      const { increases22, resultStringV22 } = calculateVNeckIncreases22(NRrezV, RowPribRV2, SpribVcorn);
      increases = increases22;
      resultString = resultStringV22 || '';
     
    }
  
    let currentSquares = SV;
  
    for (let i = -1; i < totalRows-1; i++) {
      const row = [];
      for  (let j = 0; j < currentSquares; j++)  {
        row.push(
          <View 
            key={`right-${i}-${j}`} 
            style={[
              styles.square,
              i === -1 && styles.zeroRowSquare,
              i===0 && styles.firstRowSquare,
              i === totalRows - 2 && styles.lastRowSquare,
              i === highlightedRow && styles.highlightedCell //Условие, чтобы нулевой ряд не выделялся
            ]} 
          />
        );
      }
      rows.push(
        <View key={`right-${i}`} style={styles.row}>
       {/*<Text style={styles.rowNumber}>{i + 1}</Text> //цифры рядов*/}
                 
         <View style={styles.squaresContainer}>
            {row}
          </View>
          <Text style={styles.squareCount}>{currentSquares}</Text>  {/*количество квадратов в ряду*/}
        </View>
      );
  
      if (i < totalRows - 2) {
        currentSquares += increases[i+1];
      }
    }
    return (
      <>
        {rows}
        {resultString ? (
          <Text style={styles.resultText}>
            {resultString}
          </Text>
        ) : null}
      </>
    );
  };
  const highlightNextRow = () => {
    setHighlightedRow((prev) => {
      const newRow = (prev + 1) % (NRrezV + 1); //Увеличиваем модуль на 1, чтобы включить -1
      return newRow === NRrezV ? -1 : newRow;  //Если достигли конца, возвращаемся к -1
    });
  };
  
  const highlightPreviousRow = () => {
    setHighlightedRow((prev) => {
      const newRow = (prev - 1 + (NRrezV + 1)) % (NRrezV + 1);  //Увеличиваем модуль на 1, чтобы включить -1
      return newRow === NRrezV ? -1 : newRow;  //Если достигли начала, возвращаемся к -1
    });
  };





{/*КОНЕЦ вычисление количества ячеек в рядах V резинки */}

if (!SpribVcorn) {
  return <Text>Ошибка: SpribVcorn не определен</Text>;
}

  return (
    <View style={styles.pageContainer}>
      
      <View style={styles.scrollContainer}>
        <ScrollView 
          style={{flex: 1, width: '100%'}}
          contentContainerStyle={{paddingBottom: 500}}
        >

       <View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 0}}>
       <View style={{width: 17, height: 17, backgroundColor: '#C6C6C6', marginLeft: 10, borderWidth: 1}}></View>
       <Text style={styles.resultText}> {i18n.t('castOnRow') || 'Cast On Row'} </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 0}}>
       <View style={{width: 17, height: 17, backgroundColor: 'yellow', marginLeft: 10, borderWidth: 1}}></View>
       <Text style={styles.resultText}> {i18n.t('collar') || 'collar'} </Text>
      </View>
      </View>
          <View style={{minHeight: 1000, paddingTop: 20}}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={{paddingRight: 250}}
            >
              <View style={styles.grid}>
                <View style={[styles.horContainerTop,{ marginLeft: SaV*Lc}]}>
                
                  <View style={[styles.rotatedLine3 , { transform: line3Transform }]}>
                    {renderLine3()}
                  </View>
                  <View style={[styles.Back, { marginTop: 0 }]}>
                    {renderBack()}
                  </View>
                  <View style={[styles.rotatedLine4, { transform: line4Transform }]}>
                    {renderLine4()}
                  </View>
                </View>
                
              
                <View style={[styles.horContainer, { marginTop: SaV * Lc + 2*KV * Lc * Math.sin(angleInRadians) },{width: (SaV+KV+SFrontV/2)*Lc}]}>
                   <View style={[styles.rotatedLeftSleeve, { transform: LeftSleeveTransform }]}>
                    {renderLeftSleeve()}
                   </View>
                   <View style={[styles.rotatedLine1, { transform: [{ rotate: `${angleInDegrees}deg` }] }]}>
                    {renderLine1()}
                   </View>
                                   
                    <View style={[styles.arrayContainer, { height: (NRrezV+1)*Hc, transform: [{ rotate: `${angleInDegrees}deg` }] }]}>
                      {renderRows()} 
                     
                    </View>
                 </View>

                 <View style={[styles.horContainerRight, { 
                  
                   marginLeft: (SaV + KV + SFrontV / 2) * Lc ,
                   marginTop: -(NRrezV+1)*Hc-2,
                   width: (SFrontV/2)*Lc
                 }]}>    
                   <View style={{ position: 'relative', width: '100%', height: '100%' }}>
                     <View style={[styles.arrayContainerRight, { 
                     
                       height: (NRrezV+1)*Hc,
                       transform: [{ rotate: `${360 - angleInDegrees}deg` }],
                        translateY: -10 
                     }]}>
                       {renderRowsRight()}
                      
                     </View>
                     </View>
                   <View style={[styles.rotatedLine2, { transform: [{ rotate: `-${angleInDegrees}deg` }] }]}>
                    {renderLine2()}
                   </View>

                   <View style={[styles.rotatedRightSleeve, { transform: RightSleeveTransform }]}>
                    {renderRightSleeve()}
                   </View>
                 </View>
                 
                 </View>
              
            </ScrollView>
          </View>
        </ScrollView>
      </View>
      
      <View style={styles.controlsInfoContainer}>
      <View style={styles.infoContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
      <View style={{width: 17, height: 17, backgroundColor: 'red', borderWidth: 1}}></View>
      <Text style={styles.infoText}>Current Row: {highlightedRow + 1}</Text>
      </View>
          <Text style={styles.infoText}>Stitches: {KV*4 + SFrontV + 2 * SaV + 2*(currentRowStitches as number)}</Text>
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
  pageContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  footerContainer: {
    width: '100%',
   padding: 5,
  },
  mainContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  
  
  scrollViewOuter: {
    flex: 1,
    width: '100%',
  },
  scrollViewContentOuter: {
    paddingBottom: 300,
  },
  contentContainer: {
    minHeight: 800,
  },
  scrollViewHorizontal: {
    width: '100%',
  },
  scrollViewContentHorizontal: {
    paddingRight: 50,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    top: 10,
  },
  horContainerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    
    
    
    },
  horContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    
    
       
  },
  horContainerRight: {
    flexDirection: 'row',
   
    alignItems: 'flex-start',
    
       
  },
  verticalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    
    
  },
  HorizontalContainer: {
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderColor: 'red',
   
  },
  LeftSleeve: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transformOrigin: 'top right',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'red',
  },
  RightSleeve: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transformOrigin: 'top left',
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: 'blue',
  },
  rotatedLine1: {
    transform: [{ rotate: '45deg' }],
    transformOrigin: 'top right',
  },
  rotatedLeftSleeve: {
    transformOrigin: 'top right',
  },
  rotatedRightSleeve: {
    transformOrigin: 'top left',
  },
  rotatedLine2: {
   
    transformOrigin: 'top left',
  },
  rotatedLine3: {
   transformOrigin: 'top left',
  },
  rotatedLine4: {
    transformOrigin: 'top right',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 0,
    alignItems: 'center',
    marginVertical: 0,
    position: 'relative',
  },
  cell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'yellow',
  },
  firstCell: {
    width: Lc,
    height: Hc,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'yellow',
  },
  Front: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  Back: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    transform: [{ rotate: '180deg' }],
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
    padding: 5,
   
    
  },
  highlightedCell: {
    backgroundColor: 'red',
  },
  controlsInfoContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'column',
    width: '100%',
    backgroundColor: '#fff',
  },
  infoContainer: {
   
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  arrayContainer: {
    alignItems: 'flex-start',
    
    transformOrigin: 'left bottom',
    
    
  },
  arrayContainerRight: {
    alignItems: 'flex-end',
    
    transformOrigin: 'right bottom',
  

    
  },
  rowNumber: {
    position: 'absolute',
    left: -15,
    width: 12,
    textAlign: 'right',
    fontSize: 8,
    color: '#666',
  },
  squaresContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  square: {
    width: Lc,
    height: Hc,
    backgroundColor: 'yellow',
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 0,
  },
  firstRowSquare: {
    backgroundColor: 'yellow',
  },
  lastRowSquare: {
    backgroundColor: 'yellow',
  },
  squareCount: {
    position: 'absolute',
    right: -20,
    fontSize: 10,
    color: '#666',
  },
  leftSquareCount: {
    left: -20,
    textAlign: 'left',
  },
  grid: {
    flexDirection: 'column',
    
    margin: 0,
  },
  resultText: {
    fontSize: 12,
    marginBottom: 1,

    textAlign: 'center' as const,
    color: 'black',
  },
  horVcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zeroRowSquare: {
    backgroundColor: '#C6C6C6',
  },
  highlightedZeroRow: {
    
    backgroundColor: 'red',
   
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
});

export default App;

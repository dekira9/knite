import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';
import { RaglanOutput } from '@/utils/calculateRaglan';
import { Colors } from '@/constants/Colors';

// Color constants
const COLORS = {
  PINK: '#FDCFE1',
  GRAY: '#E6E6E6',
  PRIMARY: Colors['light'].tint,
  WHITE: '#ffffff',
  BLACK: '#000',
  TEXT_PRIMARY: '#1A1A1A',
  TEXT_SECONDARY: '#6b7280',
  BACKGROUND: '#F8F9FA',
  DIVIDER: '#CCCCCC',
  BLUE: '#00ADF2',
};

interface FrontVProps {
  results: any;
  resultString24V: string;
  resultString23V: string;
  resultString21V: string;
  resultString43V: string;
  RowPrib1x4StringV: string;
  RowPrib1x3StringV: string;
  RowPrib1x2StringV: string;
  RowPrib1x1StringV: string;
  handleScrollToTop1: () => void;
}

const FrontV = observer(({ 
  results,
  resultString24V,
  resultString23V,
  resultString21V,
  resultString43V,
  RowPrib1x4StringV,
  RowPrib1x3StringV,
  RowPrib1x2StringV,
  RowPrib1x1StringV,
  handleScrollToTop1
}: FrontVProps) => {
  const navigation = useNavigation();

  const navigateToFrontV = () => {
    (navigation as any).navigate('Raglan', { screen: 'FrontV' });
  };

  // Определяем isRaglanOutput здесь
  const isRaglanOutput = (value: any): value is RaglanOutput => {
    return value !== null && typeof value === 'object' && 'PR_1x2_fV' in value;
  };

  return (
    <View style={styles.container}>
      <View style={styles.resultCard}>
      <View style={styles.stepHeader}>
        <Text style={styles.subtitle}>{i18n.t('front')}</Text>
          <View style={styles.indicatorsRow}>
            
            <View style={styles.pinkIndicator} />
            
          </View>
          
        </View>
        <View style={styles.divider}></View>

        
        
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
          <Text style={styles.subtitle}>{i18n.t('action')}1:</Text>
          
          
        </View>
        <View style={styles.infoRowmin}>
          <Text style={styles.leftLabel}>
            {i18n.t('knitting')}:
          </Text>
          <Image
            source={require('@/assets/images/znts8.svg')}
            style={styles.knitIconznts}
            contentFit="contain"
          />
           </View>

        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('rows')}:
          </Text>
          
          <Text style={styles.boldNumber}>{results.NHV}</Text>
        </View>
       
        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('start')}:
          </Text>
          <Image
            source={require('@/assets/images/znstartfront.svg')}
            style={styles.styleznsfImage}
            contentFit="contain"
          /> 
          
        </View>
        <View style={{marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8, alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
            <Text style={styles.resultText}>{i18n.t('drawingForUnderstanding')}</Text>  
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'flex-start'}}> 
              <Image
                source={require('../../../../../assets/images/frontVan.png')}
                style={styles.frontImage}
              />
            </View>
          </ScrollView>
        </View>
        {/*1*/} 
        <View style={styles.horizontalRow}>
          <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('calculationForYou')}: {i18n.t('rows')} 1, 2</Text>  
        </View>
          
        <View style={styles.horizontalRow}>
          <Text style={styles.resultText}> 1: {i18n.t('row1ForPart')} R </Text>
        </View>
          
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={styles.horizontalRow}>
            <View style={styles.stitchBox}>
              <View style={styles.blueIndicator}></View>
             
              <Text style={styles.resultText}>
                {i18n.t('create')}{'\n'}<Text >{i18n.t('stitches')}</Text>: {isRaglanOutput(results) ? (
                  (() => {
                    // Получаем выбранный тип прибавок
                    const selectedType = results.usedIncreaseTypeV?.[0] || '';
                    let increaseRows: number[] = [];
                    
                    // Определяем массив рядов с прибавками в зависимости от типа
                    switch (selectedType) {
                      case '1x2, 1x4':
                        increaseRows = resultString24V ? resultString24V.split(', ').map(Number) : [];
                        break;
                      case '1x2, 1x3':
                        increaseRows = resultString23V ? resultString23V.split(', ').map(Number) : [];
                        break;
                      case '1x2, 1x1':
                        increaseRows = resultString21V ? resultString21V.split(', ').map(Number) : [];
                        break;
                      case '1x3, 1x4':
                        increaseRows = resultString43V ? resultString43V.split(', ').map(Number) : [];
                        break;
                      case '1x3':
                        increaseRows = RowPrib1x3StringV ? RowPrib1x3StringV.split(', ').map(Number) : [];
                        break;
                      case '1x4':
                        increaseRows = RowPrib1x4StringV ? RowPrib1x4StringV.split(', ').map(Number) : [];
                        break;
                      case '1x2':
                        increaseRows = RowPrib1x2StringV ? RowPrib1x2StringV.split(', ').map(Number) : [];
                        break;
                      case '1x1':
                        increaseRows = RowPrib1x1StringV ? RowPrib1x1StringV.split(', ').map(Number) : [];
                        break;
                      default:
                        increaseRows = [];
                    }
                    
                    // Проверяем, есть ли прибавка в первом ряду (ряд номер 1)
                    const firstRowIncreaseCount = increaseRows.filter(rowNum => rowNum === 1).length;
                    
                    return firstRowIncreaseCount > 0 ? '1' : '0'; // Возвращаем '1' если есть прибавка, иначе '0'
                  })()
                ) : '0'}
              </Text>
            </View>
            {/* round*/}
            <View style={styles.horizontalRow}>
              <View style={styles.roundDot}></View>
            </View>
            <View style={styles.stitchBox}>
              <View style={styles.pinkIndicator}></View>
              
              <Text style={styles.resultText}>
                {i18n.t('stitches')}: {isRaglanOutput(results) ? (
                  (() => {
                    // Получаем массив прибавок ИМЕННО для V-выреза
                    const vNeckIncreaseRows = results.resultStringV ? results.resultStringV.split(', ').map(Number) : [];
                    
                    // Вычисляем количество доп. ячеек для ПЕРВОЙ пары (pairNum = 1, index = 0)
                    // Эта логика должна точно соответствовать расчету additionalCellsPerPair[0] в frontV.tsx
                    const firstPairAdditionalCells = (1 <= results.NHV / 2 && vNeckIncreaseRows.length > 0) 
                      ? (vNeckIncreaseRows[0] || 0) 
                      : 0;

                    return firstPairAdditionalCells; // Это количество желтых ячеек в 1-м ряду renderVNeckLeftArray
                  })()
                ) : '0'}{'\n'}
                {i18n.t('fromTheCollar')}
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.horizontalRow}>
          <Text style={styles.resultText}> {i18n.t('turn')} </Text>
        </View>
        {/*2*/}
          
        <View style={styles.horizontalRow}>
          <Text style={styles.resultText}> 2: {i18n.t('row2ForPart')} R </Text>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={styles.horizontalRow}>
            <View style={styles.stitchBox} >
              <View style={styles.pinkIndicator}></View>
              
              <Text style={styles.resultText}>
                {i18n.t('stitches')}: {isRaglanOutput(results) ? (
                  (() => {
                    // --- Расчет 1: Прибавка реглана в 1 ряду (1 или 0) ---
                    const selectedType = results.usedIncreaseTypeV?.[0] || '';
                    let raglanIncreaseRows: number[] = [];
                    switch (selectedType) {
                      case '1x2, 1x4': raglanIncreaseRows = resultString24V ? resultString24V.split(', ').map(Number) : []; break;
                      case '1x2, 1x3': raglanIncreaseRows = resultString23V ? resultString23V.split(', ').map(Number) : []; break;
                      case '1x2, 1x1': raglanIncreaseRows = resultString21V ? resultString21V.split(', ').map(Number) : []; break;
                      case '1x3, 1x4': raglanIncreaseRows = resultString43V ? resultString43V.split(', ').map(Number) : []; break;
                      case '1x3': raglanIncreaseRows = RowPrib1x3StringV ? RowPrib1x3StringV.split(', ').map(Number) : []; break;
                      case '1x4': raglanIncreaseRows = RowPrib1x4StringV ? RowPrib1x4StringV.split(', ').map(Number) : []; break;
                      case '1x2': raglanIncreaseRows = RowPrib1x2StringV ? RowPrib1x2StringV.split(', ').map(Number) : []; break;
                      case '1x1': raglanIncreaseRows = RowPrib1x1StringV ? RowPrib1x1StringV.split(', ').map(Number) : []; break;
                      default: raglanIncreaseRows = [];
                    }
                    const raglanFirstRowIncrease = raglanIncreaseRows.filter(rowNum => rowNum === 1).length > 0 ? 1 : 0;

                    // --- Расчет 2: Желтые ячейки V-выреза в 1 ряду ---
                    const vNeckIncreaseRows = results.resultStringV ? results.resultStringV.split(', ').map(Number) : [];
                    const vNeckFirstRowYellow = (1 <= results.NHV / 2 && vNeckIncreaseRows.length > 0)
                      ? (vNeckIncreaseRows[0] || 0)
                      : 0;

                    // --- Сумма ---
                    return raglanFirstRowIncrease + vNeckFirstRowYellow;
                  })()
                ) : '0'}
              </Text>
            </View>
          </View> 
        </ScrollView>
        {/*3*/} 

        <View style={styles.horizontalRow}>
          <Text style={styles.resultText}> 3: {i18n.t('row1ForPart')} L </Text>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={styles.horizontalRow}>
            <View style={styles.stitchBox} >
              <View style={styles.blueIndicator}></View>

              <Text style={styles.resultText}>
                {i18n.t('create')}{'\n'}<Text >{i18n.t('stitches')}</Text>: {isRaglanOutput(results) ? (
                  (() => {
                    // Получаем выбранный тип прибавок
                    const selectedType = results.usedIncreaseTypeV?.[0] || '';
                    let increaseRows: number[] = [];
                    
                    // Определяем массив рядов с прибавками в зависимости от типа
                    switch (selectedType) {
                      case '1x2, 1x4':
                        increaseRows = resultString24V ? resultString24V.split(', ').map(Number) : [];
                        break;
                      case '1x2, 1x3':
                        increaseRows = resultString23V ? resultString23V.split(', ').map(Number) : [];
                        break;
                      case '1x2, 1x1':
                        increaseRows = resultString21V ? resultString21V.split(', ').map(Number) : [];
                        break;
                      case '1x3, 1x4':
                        increaseRows = resultString43V ? resultString43V.split(', ').map(Number) : [];
                        break;
                      case '1x3':
                        increaseRows = RowPrib1x3StringV ? RowPrib1x3StringV.split(', ').map(Number) : [];
                        break;
                      case '1x4':
                        increaseRows = RowPrib1x4StringV ? RowPrib1x4StringV.split(', ').map(Number) : [];
                        break;
                      case '1x2':
                        increaseRows = RowPrib1x2StringV ? RowPrib1x2StringV.split(', ').map(Number) : [];
                        break;
                      case '1x1':
                        increaseRows = RowPrib1x1StringV ? RowPrib1x1StringV.split(', ').map(Number) : [];
                        break;
                      default:
                        increaseRows = [];
                    }
                    
                    // Проверяем, есть ли прибавка в первом ряду (ряд номер 1)
                    const firstRowIncreaseCount = increaseRows.filter(rowNum => rowNum === 1).length;
                    
                    return firstRowIncreaseCount > 0 ? '1' : '0'; // Возвращаем '1' если есть прибавка, иначе '0'
                  })()
                ) : '0'}
              </Text>
            </View>
            {/* round*/}
            <View style={styles.horizontalRow}>
              <View style={styles.roundDot}></View>
            </View>
            <View style={styles.stitchBox} >
              <View style={styles.pinkIndicator}></View>

              <Text style={styles.resultText}>
                {i18n.t('stitches')}: {isRaglanOutput(results) ? (
                  (() => {
                    // Получаем массив прибавок ИМЕННО для V-выреза
                    const vNeckIncreaseRows = results.resultStringV ? results.resultStringV.split(', ').map(Number) : [];
                    
                    // Вычисляем количество доп. ячеек для ПЕРВОЙ пары (pairNum = 1, index = 0)
                    // Эта логика должна точно соответствовать расчету additionalCellsPerPair[0] в frontV.tsx
                    const firstPairAdditionalCells = (1 <= results.NHV / 2 && vNeckIncreaseRows.length > 0) 
                      ? (vNeckIncreaseRows[0] || 0) 
                      : 0;

                    return firstPairAdditionalCells; // Это количество желтых ячеек в 1-м ряду renderVNeckLeftArray
                  })()
                ) : '0'}{'\n'}
                {i18n.t('fromTheCollar')}
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.horizontalRow}>
          <Text style={styles.resultText}> {i18n.t('turn')} </Text>
        </View>
        {/*4*/}

        <View style={styles.horizontalRow}>
          <Text style={styles.resultText}> 4: {i18n.t('row2ForPart')} L </Text>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={styles.horizontalRow}>
            <View style={styles.stitchBox} >
              <View style={styles.pinkIndicator}></View>
              
              <Text style={styles.resultText}>
                {i18n.t('stitches')}: {isRaglanOutput(results) ? (
                  (() => {
                    // --- Расчет 1: Прибавка реглана в 1 ряду (1 или 0) ---
                    const selectedType = results.usedIncreaseTypeV?.[0] || '';
                    let raglanIncreaseRows: number[] = [];
                    switch (selectedType) {
                      case '1x2, 1x4': raglanIncreaseRows = resultString24V ? resultString24V.split(', ').map(Number) : []; break;
                      case '1x2, 1x3': raglanIncreaseRows = resultString23V ? resultString23V.split(', ').map(Number) : []; break;
                      case '1x2, 1x1': raglanIncreaseRows = resultString21V ? resultString21V.split(', ').map(Number) : []; break;
                      case '1x3, 1x4': raglanIncreaseRows = resultString43V ? resultString43V.split(', ').map(Number) : []; break;
                      case '1x3': raglanIncreaseRows = RowPrib1x3StringV ? RowPrib1x3StringV.split(', ').map(Number) : []; break;
                      case '1x4': raglanIncreaseRows = RowPrib1x4StringV ? RowPrib1x4StringV.split(', ').map(Number) : []; break;
                      case '1x2': raglanIncreaseRows = RowPrib1x2StringV ? RowPrib1x2StringV.split(', ').map(Number) : []; break;
                      case '1x1': raglanIncreaseRows = RowPrib1x1StringV ? RowPrib1x1StringV.split(', ').map(Number) : []; break;
                      default: raglanIncreaseRows = [];
                    }
                    const raglanFirstRowIncrease = raglanIncreaseRows.filter(rowNum => rowNum === 1).length > 0 ? 1 : 0;

                    // --- Расчет 2: Желтые ячейки V-выреза в 1 ряду ---
                    const vNeckIncreaseRows = results.resultStringV ? results.resultStringV.split(', ').map(Number) : [];
                    const vNeckFirstRowYellow = (1 <= results.NHV / 2 && vNeckIncreaseRows.length > 0)
                      ? (vNeckIncreaseRows[0] || 0)
                      : 0;

                    // --- Сумма ---
                    return raglanFirstRowIncrease + vNeckFirstRowYellow;
                  })()
                ) : '0'}
              </Text>
            </View>
          </View> 
        </ScrollView>

        <View style={styles.horizontalRow}>
          <Text style={styles.subtitle}>{i18n.t('action')} 2:</Text>
          
        </View>

        <View style={styles.infoRowmin}>
          <Text style={styles.leftLabel}>
            {i18n.t('decreasesOnOneSide')}:
          </Text>
          <View style={styles.blackIndicator}></View>
           </View>
           <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('stitches')}:
          </Text>
          
          <Text style={styles.boldNumber}>{results.SVfront - results.SFrontV / 2}</Text>
        </View>

        
          <View style={styles.horizontalRow}>
            <Text style={styles.subtitle}>{i18n.t('action')} 3:</Text>

            
          </View>
        
        <View style={styles.infoRowmin}>
          <Text style={styles.leftLabel}>
            {i18n.t('knitting')}:
          </Text>
          
          <Image
              source={require('@/assets/images/knitcircle.svg')}
              style={styles.styleKnitCircleImage}
              contentFit="contain"
            /> 
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('rows')}:
          </Text>
          
          <Text style={styles.boldNumber}>{results.NHFrontV-results.NHV}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('start')} {i18n.t('row')} № {results.NHV +1}:
          </Text>
          <TouchableOpacity onPress={handleScrollToTop1}>
            <Image
              source={require('@/assets/images/znkr6.svg')}
              style={styles.styleZnkr}
              contentFit="contain"
            /> 
          </TouchableOpacity>
          
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  resultCard: {
    backgroundColor: COLORS.WHITE,
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  resultText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 5,
  },
  viewImage: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  styleZntsImage: {
    width: 40,
    height: 40,
    marginLeft: 10,
    marginRight: 10,
  },
  styleznsfImage: {
    width: 35,
    height: 35,
    marginLeft: 0,
    marginRight: 0,
  },
  styleKnitCircleImage: {
    width: 25,
    height: 25,
    marginLeft: 0,
    marginRight: 0,
  },
  styleZnkr: {
    width: 30,
    height: 30,
    marginLeft: 0,
    marginRight: 0,
  },
  frontImage: {
    width: '100%',
    aspectRatio: 2,
    height: undefined,
    resizeMode: 'contain',
    padding: 300,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  indicatorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 17,
    height: 17,
    marginLeft: 10,
    borderWidth: 1,
  },
  divider: {
    height: 0.5,
    backgroundColor: COLORS.DIVIDER,
    marginTop: 5,
    marginBottom: 20,
  },
  infoRowmin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  leftLabel: {
    fontSize: 16,
   // color: COLORS.TEXT_PRIMARY,
    marginBottom: 5,
    color: '#6b7280',
  },
  knitIconznts: {
    width: 30,
    height: 30,
    marginLeft: 0,
    marginRight: 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  boldNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  horizontalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stitchBox: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 10,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#00ADF2',
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  pinkIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#FDCFE1',
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  blackIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  roundDot: {
    width: 17,
    height: 17,
    borderRadius: 8,
    marginLeft: 0,
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },
});

export default FrontV;



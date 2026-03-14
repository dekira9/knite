import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import onboardingState from '@/state/onboardingState';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { screenWidth } from '@/utils/Layout';

import { number } from 'mobx-state-tree/dist/internal';

import {
  calculateVNeckIncreases01,
  calculateVNeckIncreases12,
  calculateVNeckIncreases11,
  calculateVNeckIncreases22,
  calculateIncreaseRows1x2_1x4V,
  calculateIncreaseRows1x2_1x3V,
  calculateIncreaseRows1x2_1x1V,
  calculateIncreaseRows1x4_1x3V,
  determineIncreaseType,
  calculateVNeckIncreases23
} from './helpers';
import Step1RibbingV from './Step1RibbingV';
import Step2AddingStitchesV from './Step2AddingStitchesV';
import FrontV from './FrontV';
import Step3BackLengtheningV from './Step3BackLengtheningV';
import Step4SeparatingSleevesV from './Step4SeparatingSleevesV';
import ResultStepV from './ResultStepV';
import { Colors } from '@/constants/Colors';

export default observer(() => {
  const navigation = useNavigation();
  const results = introState.calculateRaglan();
  const scrollViewRef = useRef<ScrollView>(null);
  const carouselRef = useRef<ScrollView>(null);
  const step3Y = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const insets = useSafeAreaInsets();
  const currentLanguage = onboardingState.language;
  const tabBarHeight = useBottomTabBarHeight();
  
  // Получаем значение ribbingWidthV из introState
  const ribbingWidthV = introState.ribbingWidthV;
  // Получаем плотность рядов
  const rows = parseFloat(introState.rowDensity.replace(',', '.')) / 10;
  // Рассчитываем NRrezV
  const NRrezV = introState.NRrezV;

  // Используем SpribVcorn из introState
  const SpribVcorn = introState.SpribVcorn;
  const RowPribRV1 = introState.RowPribRV1;
  const RowPribRVz = introState.RowPribRVz;
  const RowPribRV2 = introState.RowPribRV2;
  
  console.log('ribbingWidthV:', ribbingWidthV);
  console.log('rows:', rows);
  
  const handleStartKnitting = () => {
    (navigation as any).navigate('Raglan', { screen: 'RibbingV' });
  };

  const handleNewStyle = () => {
    introState.setStyleChosen(false);
    (navigation as any).navigate('Styles');
  };

  // Проверяем, что results это RaglanOutput, а не строка с ошибкой
  if (typeof results === 'string') {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{results}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>{i18n.t('goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Теперь results точно RaglanOutput
  const { resultStringV22 } = calculateVNeckIncreases22(NRrezV, RowPribRV2, SpribVcorn);
  const { resultStringV11 } = calculateVNeckIncreases11(NRrezV, RowPribRV1, SpribVcorn);
  const { resultStringV12 } = calculateVNeckIncreases12(NRrezV, RowPribRV1, RowPribRV2);
  const { resultStringV23 } = calculateVNeckIncreases23(NRrezV, RowPribRV2, SpribVcorn);
  // Исправляем вызов функции - убираем лишний параметр SVfront
  const { resultStringV01 } = calculateVNeckIncreases01(NRrezV, SpribVcorn, RowPribRV1, RowPribRVz);
  console.log('resultStringV11', resultStringV11);
  console.log('DEBUG: results object keys:', Object.keys(results));
  console.log('DEBUG: results.usedIncreaseTypeV:', results.usedIncreaseTypeV);
  console.log('DEBUG: results.usedIncreaseTypeStringV:', results.usedIncreaseTypeStringV);
 
  const { PozBv, RowBv, RowNv, RowAv, RowPrib1x2_1x4V, resultString24V } = calculateIncreaseRows1x2_1x4V(
    results.NHFrontV, results.SfxV, results.PR_1x4_fV, results.PR_1x2_fV
  );
  const { PozDv, RowDv, RowN23v, RowA23v, RowPrib1x2_1x3V, resultString23V } = calculateIncreaseRows1x2_1x3V(
    results.NHFrontV, results.SfxV, results.prib_1x3_fV, results.prib_1x2_fV
  );
  const { PozCv, RowCv, RowN21v, RowA21v, RowPrib1x2_1x1V, resultString21V } = calculateIncreaseRows1x2_1x1V(
    results.NHFrontV, results.SfxV, results.prib_1x1_fV, results.prib_1x2_fV
  );
  const { PozMv, RowMv, RowN43v, RowA43v, RowPRib1x4_1x3V, resultString43V } = calculateIncreaseRows1x4_1x3V(
    results.NHFrontV, results.SfxV, results.PRib_1x4_fV, results.PRib_1x3_fV
  );

  // Добавляем вычисление простых строк рядов прибавок
  const RowPrib1x4V = Array.from({ length: results.SfxV || 0 }, (_, index) => 1 + index * 4);
  const RowPrib1x4StringV = RowPrib1x4V.join(', ');
  const RowPrib1x3V = Array.from({ length: results.SfxV || 0 }, (_, index) => 1 + index * 3);
  const RowPrib1x3StringV = RowPrib1x3V.join(', ');
  const RowPrib1x2V = Array.from({ length: results.SfxV || 0 }, (_, index) => 1 + index * 2);
  const RowPrib1x2StringV = RowPrib1x2V.join(', ');
  const RowPrib1x1V = Array.from({ length: results.SfxV || 0 }, (_, index) => 1 + index * 1);
  const RowPrib1x1StringV = RowPrib1x1V.join(', ');

  // Определяем тип прибавок для отладки
  const increaseType = determineIncreaseType(results.NHFrontV, results.SfxV);
  console.log('Тип прибавок:', increaseType);
  console.log('NHFrontV:', results.NHFrontV);
  console.log('SfxV:', results.SfxV);
  console.log('usedIncreaseType:', results.usedIncreaseType);
  
  const handleScrollToTop = () => {
    {/*// Scroll to top*/ }
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    
   {/* Scroll carousel to planVaz44.png (index 1)*/}
    setTimeout(() => {
      const slideSize = Dimensions.get('window').width - 32;
      carouselRef.current?.scrollTo({ x: slideSize * 1, animated: true });
      setCurrentIndex(1);   {/* Update current index to match*/}
    }, 100); {/* Small delay to ensure vertical scroll completes first*/}
  };
  const handleScrollToTop1 = () => {
    {/*// Scroll to top*/ }
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    {/* Scroll carousel to planVaz111.png (index 0)*/}
    setTimeout(() => {
      const slideSize = Dimensions.get('window').width - 32;
      carouselRef.current?.scrollTo({ x: slideSize * 0, animated: true });
      setCurrentIndex(0);   {/* Update current index to match*/}
    }, 100); {/* Small delay to ensure vertical scroll completes first*/}
  };

  const handleScrollToStep3 = () => {
    scrollViewRef.current?.scrollTo({ y: step3Y.current, animated: true });
    setTimeout(() => {
      const slideSize = Dimensions.get('window').width - 32;
      carouselRef.current?.scrollTo({ x: slideSize * 1, animated: true });
      setCurrentIndex(1);
    }, 100);
  };

  const handleSelectNewStyle = () => {
    introState.setIntroFinished(false);
    (navigation as any).navigate('Styles');
  };
 
  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 100 }]}
      >
        <TouchableOpacity style={styles.newStyleButton} onPress={handleSelectNewStyle}>
          <Text style={styles.newStyleButtonText}>{i18n.t('newProject')}</Text>
        </TouchableOpacity>
        <ScrollView 
          ref={carouselRef} // Add ref to carousel
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
          onScroll={(event) => {
            const slideSize = Dimensions.get('window').width - 32;
            const x = event.nativeEvent.contentOffset.x;
            setCurrentIndex(Math.round(x / slideSize));
          }}
          scrollEventThrottle={16}
        >
          <View style={styles.slideContainer}>
          
          <Image
              source={require('../../../../../assets/images/planVaz111.png')}
              style={styles.slideImage}
              contentFit="contain"
             />
          </View>
          <TouchableOpacity 
            style={styles.slideContainer} 
            onPress={handleScrollToStep3}
            activeOpacity={1}
          >
          <Image
              source={require('../../../../../assets/images/planVaz44.png')}
              style={styles.slideImage}
              contentFit="contain"
             />
          </TouchableOpacity>
          <View style={styles.slideContainer}>
            <Image
              source={require('../../../../../assets/images/v-neck.png')}
              style={styles.slideImage}
              contentFit="contain"
            />
          </View>
         
         
        </ScrollView>

        <View style={styles.pagination}>
          {[0, 1, 2].map((index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive
              ]}
            />
          ))}
        </View>

        <Step1RibbingV 
          results={results}
          NRrezV={NRrezV}
          SpribVcorn={SpribVcorn}
          resultStringV01={resultStringV01}
          resultStringV11={resultStringV11}
          resultStringV12={resultStringV12}
          resultStringV22={resultStringV22}
          resultStringV23={resultStringV23}
        />
        
        <Step2AddingStitchesV 
          results={results}
          resultString24V={resultString24V}
          resultString23V={resultString23V}
          resultString21V={resultString21V}
          resultString43V={resultString43V}
          RowPrib1x4StringV={RowPrib1x4StringV}
          RowPrib1x3StringV={RowPrib1x3StringV}
          RowPrib1x2StringV={RowPrib1x2StringV}
          RowPrib1x1StringV={RowPrib1x1StringV}
        />

        <FrontV 
          results={results}
          resultString24V={resultString24V}
          resultString23V={resultString23V}
          resultString21V={resultString21V}
          resultString43V={resultString43V}
          RowPrib1x4StringV={RowPrib1x4StringV}
          RowPrib1x3StringV={RowPrib1x3StringV}
          RowPrib1x2StringV={RowPrib1x2StringV}
          RowPrib1x1StringV={RowPrib1x1StringV}
          handleScrollToTop1={handleScrollToTop1}
        />
        
        <View 
          onLayout={(e) => { step3Y.current = e.nativeEvent.layout.y; }}
          collapsable={false}
        >
        <Step3BackLengtheningV 
          results={results}
          handleScrollToTop1={handleScrollToTop1}
          handleScrollToTop={handleScrollToTop}
        />
        </View>

        <Step4SeparatingSleevesV 
          results={results}
          handleScrollToTop1={handleScrollToTop1}
        />

        <ResultStepV 
          results={results}
        />

      </ScrollView>
     
    </View>
  );
});
const styles = StyleSheet.create({
  // === CONTAINER STYLES ===
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: 0,
  },
  scrollContent: {
    padding: 16,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // === BUTTON STYLES ===
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  startButton: {
    flex: 1,
    backgroundColor: '#34C759',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  newStyleButton: {
    backgroundColor: Colors['light'].tint,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  newStyleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // === TEXT STYLES ===
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  resultText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  createText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
  textStep: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1A1A1A',
  },
  
  // === IMAGE STYLES ===
  slideImage: {
    width: '100%',
    height: '100%',
  },
  viewImage: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  startvImage: {
    width: 30,
    height: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  styleKnitCircleImage: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  frontImage: {
    width: '100%',
    aspectRatio: 2,
    height: undefined,
    resizeMode: 'contain',
    padding: 300,
  },
  resultImage: {
    width: '100%',
    aspectRatio: 2,
    height: undefined,
    resizeMode: 'contain',
    padding: 150,
  },
  styleZntsImage: {
    width: 40,
    height: 40,
    marginLeft: 10,
    marginRight: 10,
  },
  styleznsfImage: {
    width: 40,
    height: 40,
    marginLeft: 10,
    marginRight: 10,
  },
  
  // === CAROUSEL STYLES ===
  carousel: {
    marginBottom: 20,
    marginTop: 15,
  },
  slideContainer: {
    width: Dimensions.get('window').width - 32,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D1D6',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#007AFF',
  },
  
  // === CARD STYLES ===
  resultCard: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  textBox: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 3,
    borderRadius: 5,
    marginBottom: 3,
  },
  textBoxParts: {
    borderWidth: 0,
    borderColor: '#000',
    padding: 5,
    borderRadius: 5,
    marginBottom: 3,
    backgroundColor: '#E6E6E6',
  },
  textInsideBox: {
    fontSize: 12,
    color: '#000',
  },
  resultContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  scrollView1: {
    flexGrow: 0,
    width: '100%',
    backgroundColor: '#f0f0f0',
    padding: 2,
  },
  textContainer: {
    marginBottom: 10,
  },
  sequenceText: {
    marginTop: 5,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  sequenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numbersText: {
    marginLeft: 5,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  styleZnkr: {
    width: 40,
    height: 40,
    marginLeft: 10,
    marginRight: 10,
  },
});


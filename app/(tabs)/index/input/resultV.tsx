import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import onboardingState from '@/state/onboardingState';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { screenWidth } from '@/utils/Layout';

import { RaglanOutput } from '@/utils/calculateRaglan'; // Добавляем импорт RaglanOutput

import { number } from 'mobx-state-tree/dist/internal';


{/*прибавки в углу резинки V*/}
export const calculateVNeckIncreases01 = (NRrezV: number, SVfront: number, SpribVcorn: number,RowPribRV1: number,RowPribRVz: number) => {
 const MRz= Array.from({ length: RowPribRVz }, (_, rz) => rz + 1);
 const MR1= Array.from({ length: RowPribRV1 }, (_, ra) => ra + 1);
 const MRN= Array.from({ length: NRrezV }, (_, rn) => rn + 1);
const KVz = (NRrezV) / RowPribRV1;
const PozS1=MR1.map(ra => Math.floor(KVz * ra));
const PozZ= MRN.filter(rn => !PozS1.includes(rn));

const increases01=Array.from({ length: NRrezV }, (_, index) => {
{ /*if (index === 0) {
   return 0; // No increase on the first row
 } else */}
   if (PozZ.includes(index + 1)) {
    return 0;
  } else if (PozS1.includes(index + 1)) {
    return 1;
  } else {
    return null; // или любое другое значение по умолчанию
  }
});
   const resultStringV01 = increases01.join(', ');
  return { 
    PozS1, 
    RowPribRV1, 
    RowPribRVz, 
    increases01, 
    resultStringV01 
  };
};
export const calculateVNeckIncreases12 = (
  NRrezV: number,
  RowPribRV1: number,
  RowPribRV2: number
  
) => {
  if (RowPribRV1 <= 0) {
    throw new Error("RowPribRV1 должен быть больше нуля");
  }
  const MR2 = Array.from({ length: RowPribRV2 }, (_, rb) => rb + 1);
  const MR1 = Array.from({ length: RowPribRV1 }, (_, ra) => ra + 1);
  const MRN = Array.from({ length: NRrezV }, (_, rn) => rn + 1);
  
  const KVb = (NRrezV) / RowPribRV1;
  const PozS1 = MR1.map(ra => Math.floor(KVb * ra));
  const pozS1Set = new Set(PozS1);
  const PozS2 = MRN.filter(rb => !pozS1Set.has(rb));
  const pozS2Set = new Set(PozS2);
  
  const increases12 = Array.from({ length: NRrezV }, (_, index) => {
    const position = index + 1;
    {/*if (index === 0) {
     return 0; // No increase on the first row
    } else */}
    if (pozS2Set.has(position)) {
      return 2;
    } else if (pozS1Set.has(position)) {
      return 1;
    } else {
      return 0; // Значение по умолчанию, если индекс не принадлежит ни одному из множеств
    }
  });
  
  const resultStringV12 = increases12.join(', ');
  console.log('PozS1',PozS1)
  console.log('PozS2',PozS2)
  console.log('распред 12',increases12)

  
  return { 
    MR2,
    MR1,
    PozS1,
    RowPribRV1,
    RowPribRV2,
    increases12,
    resultStringV12
  };
};

export const calculateVNeckIncreases11 = (NRrezV: number, PribRV1: number, SpribVcorn: number) => {
  console.log('calculateVNeckIncreases11 params:', { NRrezV, PribRV1, SpribVcorn });
  
  if (SpribVcorn !== NRrezV) {
    console.warn('SpribVcorn should equal NRrezV');
  }
  
  {/* Создаем массив длиной NRrezV, где в каждом ряду по одной прибавке*/}
  const increases11 = new Array(NRrezV).fill(1);
  console.log('increases11 array:', increases11);
  
  const resultStringV11 = increases11.join(', ');
  console.log('resultStringV11:', resultStringV11);
  
  return {
    increases11,
    resultStringV11
  };
};

export const calculateVNeckIncreases22 = (NRrezV: number, PribRV2: number,SpribVcorn: number) => {
   
 
  const MR2 = Array.from({ length: PribRV2 }, (_, ra) => ra + 1);
  const MRN = Array.from({ length: NRrezV-1 }, (_, rn) => rn + 1);
  
  const KVb = (NRrezV-1) / PribRV2;
  const PozS1 = MR2.map(ra => Math.floor(KVb * ra));
  const pozS1Set = new Set(PozS1);
  const PozS2 = MRN.filter(rb => !pozS1Set.has(rb));
  const pozS2Set = new Set(PozS2);
  
  const increases22 = Array.from({ length: NRrezV-1 }, (_, index) => {
    const position = index + 1;
   
    if (pozS2Set.has(position)) {
      return 2;
    } else if (pozS1Set.has(position)) {
      return 2;
    } else {
      return 0; // Значение по умолчанию, если индекс не принадлежит ни одному из множеств
    }
  });
  
  const resultStringV22 = increases22.join(', ');
 
  
  
  return { 
    MR2,
    PozS1,
    PribRV2,
    increases22,
    resultStringV22 
  };
};


{/*расчет рядов с прибавками для 1x2, 1x4 по линиям реглана*/}
export const calculateIncreaseRows1x2_1x4V = (
  NHFrontV: number,
  SfxV: number,
  PR_1x4_fV: number,
  PR_1x2_fV: number
) => {
  const KBv = SfxV / PR_1x4_fV;
  const Bv = Array.from({ length: PR_1x4_fV }, (_, b) => b + 1);
  const PozBv = Bv.map(b => Math.floor(KBv * b));
  
  const Av = Array.from({ length: PR_1x2_fV }, (_, a) => a + 1);
   {/* Создаем массив RowB для рядов с прибавками из PozB*/}
   const RowBv = PozBv.map((b, bIndex) => {
    const adjustedIndex = bIndex + 1; // Индексы начинаются с 1
    const row = (b - 1) * 2 + 1 + (adjustedIndex - 1) * 2;
    
    return row;
  });
  const RowNv = Array.from({ length: NHFrontV }, (_, i) => i + 1);

  {/* Удаляем элементы RowB и три следующих за каждым из них из RowN*/}
  RowBv.forEach(b => {
    for (let i = 0; i < 4; i++) { // Удаляем b и три следующих за ним
      const index = RowNv.indexOf(b + i);
      if (index !== -1) {
        RowNv.splice(index, 1);
      }
    }
  });

  {/* Создаем массив RowA из нечетных чисел RowN*/}
  const RowAv = RowNv.filter(n => n % 2 !== 0);

  {/* Объединяем RowA и RowB в RowPrib1x2_1x4*/}
  const RowPrib1x2_1x4V = [...RowAv, ...RowBv].sort((a, b) => a - b);

  {/* Преобразуем RowPrib1x2_1x4 в строку*/}
  const resultString24V = RowPrib1x2_1x4V.join(', ');

  return { PozBv, RowBv, RowNv, RowAv, RowPrib1x2_1x4V, resultString24V };
};



{/*расчет рядов с прибавками для 1x2, 1x3*/}
export const calculateIncreaseRows1x2_1x3V = (NHFrontV: number, SfxV: number, prib_1x3_fV: number, prib_1x2_fV: number) => {
  const KDv = SfxV / prib_1x3_fV;
  const Dv = Array.from({ length: prib_1x3_fV }, (_, d) => d + 1);
  const PozDv = Dv.map(d => Math.floor(KDv * d));
  
  const A2v = Array.from({ length: prib_1x2_fV }, (_, a) => a + 1);
   {/* Создаем массив RowD для рядов с прибавками из PozD*/}
   const RowDv = PozDv.map((d, dIndex) => {
    const adjustedIndex = dIndex + 1; // Индексы начинаются с 1
    const row = (d - 1) * 2 + 1 + (adjustedIndex - 1);
    
    return row;
  });
  const RowN23v = Array.from({ length: NHFrontV }, (_, i) => i + 1);

  {/* Удаляем элементы RowD и два следующих за каждым из них из RowN23*/}
  RowDv.forEach(d => {
    for (let i = 0; i < 3; i++) { // Удаляем d и две следующих за ним
      const index = RowN23v.indexOf(d + i);
      if (index !== -1) {
        RowN23v.splice(index, 1);
      }
    }
  });
  {/* Разбиваем RowN23 на пары и берем первые элементы каждой пары*/}
  const RowA23v = RowN23v.filter((_, index) => (index + 1) % 2 !== 0);

  const RowPrib1x2_1x3V = [...RowA23v, ...RowDv].sort((a, b) => a - b);

  const resultString23V = RowPrib1x2_1x3V.join(', ');

  return { PozDv, RowDv, RowN23v, RowA23v, RowPrib1x2_1x3V, resultString23V };
};

{/* конец расчета рядов с прибавками для 1x2, 1x3*/}

{/*расчет рядов с прибавками для 1x2, 1x1*/}
export const calculateIncreaseRows1x2_1x1V = (
  NHFrontV: number,
  SfxV: number,
  prib_1x1_fV: number,
  prib_1x2_fV: number
) => {
  const KCv = SfxV / prib_1x1_fV;
  const Cv = Array.from({ length: prib_1x1_fV }, (_, c) => c + 1);
  const PozCv = Cv.map(c => Math.floor(KCv * c));
  
  const A21v = Array.from({ length: prib_1x2_fV }, (_, a) => a + 1);
   {/* Создаем массив RowC для рядов с прибавками из PozC*/}
   const RowCv = PozCv.map((c, cIndex) => {
    const adjustedIndex = cIndex + 1; // Индексы начинаются с 1
    const row = (c - 1) * 2 + 1 - (adjustedIndex - 1);
    
    return row;
  });
  const RowN21v = Array.from({ length: NHFrontV }, (_, i) => i + 1);

  {/* Удаляем элементы RowC  из RowN*/}
  RowCv.forEach(c => {
    const index = RowN21v.indexOf(c);
    if (index !== -1) {
      RowN21v.splice(index, 1);
    }
  });
  {/* Разбиваем RowN на пары и берем первые элементы каждой пары*/}
  const RowA21v = RowN21v.filter((_, index) => (index + 1) % 2 !== 0);
  {/* Объединяем RowA21 и RowC в RowPrib1x2_1x1 и сортируем */}
  const RowPrib1x2_1x1V = [...RowA21v, ...RowCv].sort((a, b) => a - b);
  {/* Отладочный вывод для проверки содержимого RowPrib1x2_1x1*/}

  {/* Преобразуем RowPrib1x2_1x1 в строку */}
  const resultString21V = RowPrib1x2_1x1V.join(', ');

  return { PozCv, RowCv, RowN21v, RowA21v, RowPrib1x2_1x1V, resultString21V };
};

{/* конец расчета рядов с прибавками для 1x2, 1x1*/}

{/*расчет рядов с прибавками для 1x4, 1x3*/}

export const calculateIncreaseRows1x4_1x3V = (
  NHFrontV: number,
  SfxV: number,
  PRib_1x4_fV: number,
  PRib_1x3_fV: number
) => {
  {/* Вычисляем количество прибавок для 1x4 и 1x3*/}

  {/* Создаем массивы для прибавок*/}

  const KMv = SfxV / PRib_1x3_fV;
  const Mv = Array.from({ length: PRib_1x3_fV }, (_, m) => m + 1);
  const PozMv = Mv.map(m => Math.floor(KMv * m));
  
  const A34v = Array.from({ length: PRib_1x4_fV }, (_, a) => a + 1);
   {/* Создаем массив RowM для рядов с прибавками из PozM*/}
   const RowMv = PozMv.map((m, mIndex) => {
    const adjustedIndex = mIndex + 1; // Индексы начинаются с 1
    const row = (m - 1) * 4 + 1 - (adjustedIndex - 1);
    
    return row;
  });

  const RowN43v = Array.from({ length: NHFrontV }, (_, i) => i + 1);

  {/* Удаляем элементы RowM и два следующих за каждым из них из RowN43*/}
  RowMv.forEach(m => {
    for (let i = 0; i < 3; i++) { // Удаляем m и два следующих за ним
      const index = RowN43v.indexOf(m + i);
      if (index !== -1) {
        RowN43v.splice(index, 1);
      }
    }
  });

  {/* Разбиваем RowN43 на четверки и берем первые элементы каждой четверки*/}
  const RowA43v = [];
  for (let i = 0; i < RowN43v.length; i += 4) {
    RowA43v.push(RowN43v[i]);
  }

  const RowPRib1x4_1x3V = [...RowA43v, ...RowMv].sort((a, b) => a - b);

  const resultString43V = RowPRib1x4_1x3V.join(', ');

  return { PozMv, RowMv, RowN43v, RowA43v, RowPRib1x4_1x3V, resultString43V };
};


{/* конец расчета рядов с прибавками для 1x4, 1x3*/}

// Добавить после функции calculateIncreaseRows1x4_1x3V
export const determineIncreaseType = (NHFrontV: number, SfxV: number): string => {
  if (SfxV === NHFrontV) {
    return '1x1'; // Прибавка 1 петля в каждом ряду
  } else if (SfxV === Math.floor(NHFrontV/2)) {
    return '1x2'; // Прибавка 1 петля каждые 2 ряда
  } else if (SfxV === Math.floor(NHFrontV/3)) {
    return '1x3'; // Прибавка 1 петля каждые 3 ряда
  } else if (SfxV === Math.floor(NHFrontV/4)) {
    return '1x4'; // Прибавка 1 петля каждые 4 ряда
  } else {
    return 'custom'; // Другой тип прибавок
  }
};

export default observer(() => {
  const router = useRouter();
  const results = introState.calculateRaglan();
  const scrollViewRef = useRef<ScrollView>(null);
  const carouselRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Определяем isRaglanOutput здесь
  const isRaglanOutput = (value: any): value is RaglanOutput => {
    return value !== null && typeof value === 'object' && 'PR_1x2_fV' in value;
  };
  
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
    router.navigate('/(tabs)/raglan/ribbingV' as any);
  };

  const handleNewStyle = () => {
    introState.setStyleChosen(false);
    router.navigate('/');
  };

  // Проверяем, что results это RaglanOutput, а не строка с ошибкой
  if (typeof results === 'string') {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{results}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
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
  // Исправляем вызов функции - добавляем недостающий параметр SVfront
  const { resultStringV01 } = calculateVNeckIncreases01(NRrezV, results.SVfront, SpribVcorn, RowPribRV1, RowPribRVz);
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

  // ссылка на sleeveV
  const navigateToSleeveV = () => {
    router.navigate('/(tabs)/raglan/sleeveV' as any);
  };
 
  // ссылка на ribbing copyV
  const navigateToRibbingCopyV = () => {
    router.navigate('/(tabs)/raglan/ribbingV' as any);
  };  

  // ссылка на backV
  const navigateToBackV = () => {
    router.navigate('/(tabs)/raglan/backV' as any);
  };
  
  // Добавляем функцию навигации для frontV
  const navigateToFrontV = () => {
    router.navigate('/(tabs)/raglan/frontV' as any);
  };
  
  const handleScrollToTop = () => {
    {/*// Scroll to top*/ }
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    
   {/* Scroll carousel to planVaz44.png (index 1)*/}
    setTimeout(() => {
      const slideSize = Dimensions.get('window').width - 40;
      carouselRef.current?.scrollTo({ x: slideSize * 1, animated: true });
      setCurrentIndex(1);   {/* Update current index to match*/}
    }, 100); {/* Small delay to ensure vertical scroll completes first*/}
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 100 }]}
      >
        <ScrollView 
          ref={carouselRef} // Add ref to carousel
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
          onScroll={(event) => {
            const slideSize = Dimensions.get('window').width - 40;
            const x = event.nativeEvent.contentOffset.x;
            setCurrentIndex(Math.round(x / slideSize));
          }}
          scrollEventThrottle={16}
        >
          <View style={styles.slideContainer}>
          
          <Image
              source={require('../../../../assets/images/planVaz11.png')}
              style={styles.slideImage}
              contentFit="contain"
             />
          </View>
          <View style={styles.slideContainer}>
          
          <Image
              source={require('../../../../assets/images/planVaz44.png')}
              style={styles.slideImage}
              contentFit="contain"
             />
          </View>
          <View style={styles.slideContainer}>
            <Image
              source={require('../../../../assets/images/v-neck.png')}
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

       

        <View style={styles.resultCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'center', width: '100%' }}>
            <Text style={[styles.textStep, { textAlign: 'center' }]}>{i18n.t('step')}1</Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
            <Text style={styles.subtitle}>{i18n.t('ribbing')}</Text>
            <View style={{width: 17, height: 17, backgroundColor: 'yellow', marginLeft: 10, borderWidth: 1}}></View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
           <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('knittingChart')}:</Text>
           
           <TouchableOpacity onPress={navigateToRibbingCopyV}>
           <Image
            source={require('@/assets/images/view.svg')}
            style={styles.viewImage}  
            contentFit="contain"
          />
          </TouchableOpacity>
          
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <Text style={styles.resultText}>
    {i18n.t('stitches')}:
  </Text>
  <View style={{marginLeft: 10}}>
    <Text style={styles.resultText}>
      {i18n.t('start')}: {results.SOcutV}
    </Text>
    <Text style={styles.resultText}>
      {i18n.t('end')}: {results.SOcutV + results.SpribVcorn * 2}
    </Text>
  </View>
          <Image
            source={require('@/assets/images/knitcircle.svg')}
            style={styles.styleKnitCircleImage}
            contentFit="contain"
          />
          <Text style={styles.resultText}>
          {i18n.t('rows')}: {results.NRrezV}
          </Text>
          </View> 
          
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <Text style={styles.resultText}>
          {i18n.t('start')}
          </Text>
          <View style={{width: 17, height: 17, borderRadius: 8.5 ,backgroundColor: 'red', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}> : </Text>
          </View> 

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <View style={{  marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}}>
          <View style={{width: 17, height: 17, backgroundColor: '#E76F51', marginLeft: 10, borderWidth: 1}}></View>
          <View style={{width: 17, height: 17, backgroundColor: 'yellow', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.KV}
          </Text>
         </View>
         {/* round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>

         <View style={{  marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#DAEDBD', marginLeft: 10, borderWidth: 1}}></View>
          <View style={{width: 17, height: 17, backgroundColor: 'yellow', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SaV}
          </Text>
          </View>
          {/* round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>
          <View style={{  marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#E76F51', marginLeft: 10, borderWidth: 1}}></View>
          <View style={{width: 17, height: 17, backgroundColor: 'yellow', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.KV}
          </Text>
          </View>
            {/* round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>
          <View style={{  marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#A29FCF', marginLeft: 10, borderWidth: 1}}></View>
          <View style={{width: 17, height: 17, backgroundColor: 'yellow', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SFrontV}
          </Text>
          </View>

          {/* round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>
          <View style={{  marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#E76F51', marginLeft: 10, borderWidth: 1}}></View>
          <View style={{width: 17, height: 17, backgroundColor: 'yellow', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.KV}
          </Text>
          </View>
          {/* round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>
          <View style={{  marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#DAEDBD', marginLeft: 10, borderWidth: 1}}></View>
          <View style={{width: 17, height: 17, backgroundColor: 'yellow', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SaV}
          </Text>
          </View>
            {/* round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>
          <View style={{  marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#E76F51', marginLeft: 10, borderWidth: 1}}></View>
          <View style={{width: 17, height: 17, backgroundColor: 'yellow', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.KV}
          </Text>
          </View>
          {/* round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>
          <View style={{  marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#FDCFE1', marginLeft: 10, borderWidth: 1}}></View>
          <View style={{width: 17, height: 17, backgroundColor: 'yellow', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SV}
          </Text>
          </View>
          {/* round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>
         <View style={{  marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
         <View style={{width: 34, height: 14, marginLeft: 0, borderTopWidth: 8.5, borderLeftWidth: 17, borderRightWidth: 17, borderBottomWidth: 8.5, borderTopColor: 'transparent', borderLeftColor: 'yellow', borderRightColor: 'transparent', borderBottomColor: 'yellow'}}></View>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}> 
          {i18n.t('adding')}: {'\n'}
          +{results.SpribVcorn}
          </Text>
          </View>
          {/* round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>
{/* adding ribbing*/}
          <View style={{  marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 34, height: 14, borderTopWidth: 8.5, borderLeftWidth: 17, borderRightWidth: 17, borderBottomWidth: 8.5, borderTopColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'yellow', borderBottomColor: 'yellow'}}></View>
          <Text style={[styles.resultText, {textAlign: 'center'}]}>
          {i18n.t('adding')}: {'\n'}
          +{results.SpribVcorn}
          </Text> 
          </View>
          {/* round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>
          <View style={{  marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#FDCFE1', marginLeft: 10, borderWidth: 1}}></View>
          <View style={{width: 17, height: 17, backgroundColor: 'yellow', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SV}
          </Text>
          </View>
          
          </View>
          </ScrollView>

          <Text style={styles.resultText}>
          {i18n.t('stitches') + ' ' + i18n.t('back')}: {results.SFrontV}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
            <Text style={styles.resultText}>
              {i18n.t('stitches') + ' ' + i18n.t('front')}:
            </Text>
            <View style={{marginLeft: 10}}>
              <Text style={styles.resultText}>
                {i18n.t('start')}: {results.SVO}
              </Text>
              <Text style={styles.resultText}>
                {i18n.t('end')}: {results.SVfront*2}
              </Text>
            </View>
          </View>
          <Text style={styles.resultText}>
          {i18n.t('stitches') + ' ' + i18n.t('sleeve')}: {results.SaV}
          </Text>
          <Text style={styles.resultText}>
          {i18n.t('stitches') + ' ' + i18n.t('raglan')}: {introState.raglanLineWidthV}
          </Text>
          <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 20}]}>
          {i18n.t('additionsOnOneSide')}: {results.SpribVcorn}
          </Text>
          
        {/* Insert the result of calculateVNeckIncreases here */}   
             <View style={styles.resultCard}>
          
          
          {
  Math.floor(SpribVcorn / NRrezV) ===1 && SpribVcorn > NRrezV && (
    <Text style={styles.resultText}>
      {i18n.t('sequenceOfAdditions')}: {resultStringV12}
    </Text>
  )}
  {
  Math.floor(SpribVcorn / NRrezV)===0 && (
    <Text style={styles.resultText}>
      {i18n.t('sequenceOfAdditions')}: {resultStringV01}
    </Text>
  ) 
}
{
  SpribVcorn === NRrezV && (
    <View style={styles.resultContainer}>
      <Text style={styles.resultText}>
        {i18n.t('sequenceOfAdditions')}:
      </Text>

      <View style={styles.sequenceContainer}>
      
        <Text style={[styles.resultText, styles.numbersText]}>
          {resultStringV11}
        </Text>
      </View>
    </View>
  )
}
{
  SpribVcorn === (2*NRrezV) && (
    <Text style={styles.resultText}>
      {i18n.t('sequenceOfAdditions')}: {resultStringV22}
    </Text>
  )
}
        </View>
          
        </View>
        
{/* ПРИБАВЛЕНИЯ */}
        <View style={styles.resultCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'center', width: '100%' }}>
            <Text style={[styles.textStep, { textAlign: 'center' }]}>
              {i18n.t('step')}2
              {'\n'}
              {i18n.t('knittingAfterRibbing')}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
            <Text style={styles.subtitle}>{i18n.t('addingStitchesAlongTheRaglanLine')}</Text>
           
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: +{results.SfxV}
          </Text>
          </View>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
        
          <Image
            source={require('@/assets/images/znts.svg')}
            style={styles.styleZntsImage}
            contentFit="contain"
          /> 
          <Text style={styles.resultText}>
          {i18n.t('rows')}:{results.NHV},
          </Text>
          
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
        
        <Image
          source={require('@/assets/images/knitcircle.svg')}
          style={styles.styleKnitCircleImage}
          contentFit="contain"
        /> 
        <Text style={styles.resultText}>
        {i18n.t('rows')}:{results.NHFrontV-results.NHV},
        </Text>
          </View> 
          
          <View style={{flexDirection: 'row', alignItems: 'center' ,justifyContent: 'center', marginBottom: 3 }} >
          <Text style={[styles.resultText, {marginLeft: 10}]}>{i18n.t('back')}</Text>
          <View style={{width: 34, height: 17, backgroundColor: '#A29FCF', marginLeft: 10, borderWidth: 1}}></View>
          <TouchableOpacity onPress={navigateToBackV}>
          <Image
            source={require('@/assets/images/view.svg')}
            style={styles.viewImage}  
            contentFit="contain"
          />
          </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'flex-start' ,justifyContent: 'center', marginBottom: 3 }} >
          
          <View style={{ marginBottom: 1, marginLeft: 0, padding: 1, borderRadius: 8, alignItems: 'center'}}>
          <View style={{width: 34, height: 14, borderTopWidth: 8.5, borderLeftWidth: 17, borderRightWidth: 17, borderBottomWidth: 8.5, borderTopColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: '#A29FCF', borderBottomColor: '#A29FCF'}}></View>
          <Text style={[styles.resultText, {textAlign: 'center'}]}>
          {i18n.t('adding')}: {'\n'}
          +{results.SfxV}
          </Text>
          </View>
          
          <View style={[styles.textBox, {backgroundColor: '#A29FCF',justifyContent: 'center'}]}>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}>
          {i18n.t('stitches')}: {'\n'}
          {results.SFrontV}
          </Text>
          </View>


          <View style={{ marginBottom: 1, marginLeft: 0,padding: 1, borderRadius: 8,alignItems: 'center'}}>
          <View style={{width: 34, height: 14, marginLeft: 0, borderTopWidth: 8.5, borderLeftWidth: 17, borderRightWidth: 17, borderBottomWidth: 8.5, borderTopColor: 'transparent', borderLeftColor: '#A29FCF', borderRightColor: 'transparent', borderBottomColor: '#A29FCF'}}></View>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}> 
          {i18n.t('adding')}: {'\n'}
          +{results.SfxV}
          </Text>
          </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20, justifyContent: 'center', marginBottom: 1 }}>
          
          <Text style={[styles.resultText, {marginLeft: 10}]}>{i18n.t('front')}</Text>
          <View style={{width: 34, height: 17, backgroundColor: '#FDCFE1', marginLeft: 10, borderWidth: 1}}></View>
          <TouchableOpacity onPress={navigateToFrontV}>
           <Image
            source={require('@/assets/images/view.svg')}
            style={styles.viewImage}
            contentFit="contain"
          />
          </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'flex-start' ,justifyContent: 'center', marginBottom: 3 }} >
          
          <View style={{ marginBottom: 1, marginLeft: 0, padding: 1, borderRadius: 8, alignItems: 'center'}}>
          <View style={{width: 34, height: 14, borderTopWidth: 8.5, borderLeftWidth: 17, borderRightWidth: 17, borderBottomWidth: 8.5, borderTopColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: '#FDCFE1', borderBottomColor: '#FDCFE1'}}></View>
          <Text style={[styles.resultText, {textAlign: 'center'}]}>
          {i18n.t('adding')}: {'\n'}
          +{results.SfxV}
          </Text>
          </View>
          
          <View style={[styles.textBox, {backgroundColor: '#FDCFE1',justifyContent: 'center'}]}>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}>
          {i18n.t('stitches')}: {'\n'}
          {results.SFrontV}
          </Text>
          </View>


          <View style={{ marginBottom: 1, marginLeft: 0,padding: 1, borderRadius: 8,alignItems: 'center'}}>
          <View style={{width: 34, height: 14, marginLeft: 0, borderTopWidth: 8.5, borderLeftWidth: 17, borderRightWidth: 17, borderBottomWidth: 8.5, borderTopColor: 'transparent', borderLeftColor: '#FDCFE1', borderRightColor: 'transparent', borderBottomColor: '#FDCFE1'}}></View>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}> 
          {i18n.t('adding')}: {'\n'}
          +{results.SfxV}
          </Text>
          </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20, justifyContent: 'center', marginBottom: 1 }}>
          <Text style={[styles.resultText, {marginLeft: 10}]}>{i18n.t('sleeve')}</Text>
          <View style={{width: 34, height: 17, backgroundColor: '#DAEDBD', marginLeft: 10, borderWidth: 1}}></View>
          <TouchableOpacity onPress={navigateToSleeveV}>
          <Image
            source={require('@/assets/images/view.svg')}
            style={styles.viewImage}  
            contentFit="contain"
          />
        </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'flex-start' ,justifyContent: 'center', marginBottom: 3 }} >
          
          <View style={{ marginBottom: 1, marginLeft: 0, padding: 1, borderRadius: 8, alignItems: 'center'}}>
          <View style={{width: 34, height: 14, borderTopWidth: 8.5, borderLeftWidth: 17, borderRightWidth: 17, borderBottomWidth: 8.5, borderTopColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: '#DAEDBD', borderBottomColor: '#DAEDBD'}}></View>
          <Text style={[styles.resultText, {textAlign: 'center'}]}>
          {i18n.t('adding')}: {'\n'}
          +{results.SfxV}
          </Text>
          </View>
          
          <View style={[styles.textBox, {backgroundColor: '#DAEDBD',justifyContent: 'center'}]}>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}>
          {i18n.t('stitches')}: {'\n'}
          {results.SaV}
          </Text>
          </View>


          <View style={{ marginBottom: 1, marginLeft: 10, padding: 1, borderRadius: 8, alignItems: 'center'}}>
          <View style={{width: 34, height: 14, marginLeft: 0, borderTopWidth: 8.5, borderLeftWidth: 17, borderRightWidth: 17, borderBottomWidth: 8.5, borderTopColor: 'transparent', borderLeftColor: '#DAEDBD', borderRightColor: 'transparent', borderBottomColor: '#DAEDBD'}}></View>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}> 
          {i18n.t('adding')}: {'\n'}
          +{results.SfxV}
          </Text>
          </View>
          </View>
          
         <View >
          <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 20}]}>
          {i18n.t('additionsOnOneSide')}: {results.SfxV}
          </Text>
         </View>
        
          {results.usedIncreaseTypeV?.includes('1x2, 1x4') && (
              <View style={[ {marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}]}>
              <Text style={[styles.resultText, {fontWeight: 'bold', marginTop: 14}]}>
          {i18n.t('option')}
          </Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.PR_1x2_fV}</Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PR_1x4_fV}</Text>
  {/* вывод рядов с прибавками*/}
  <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('RowsWithAdding')}:</Text>
<Text style={styles.resultText}>{resultString24V}</Text>

  {/* конец вывода рядов с прибавками*/}
  </View>
          )}
          {results.usedIncreaseTypeV?.includes('1x2, 1x3') && (
            <View style={[ {marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}]}>
             <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 14}]}>
          {i18n.t('option')}
          </Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.prib_1x2_fV}</Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.prib_1x3_fV}</Text>
              <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('RowsWithAdding')}:</Text>
              <Text style={styles.resultText}>{resultString23V}</Text>
            </View>
          )}
          {results.usedIncreaseTypeV?.includes('1x2, 1x1') && (
            <View style={[{marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}]}>
             <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 14}]}>
            {i18n.t('option')}
            </Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.PR_1x2_fV}</Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_fV}</Text>
              <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('RowsWithAdding')}:</Text>
              <Text style={styles.resultText}>{resultString21V}</Text>
            
            </View>
          )}
          {results.usedIncreaseTypeV?.includes('1x4, 1x3') && (
              <View style={[{marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}]}>
              <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 14}]}>
          {i18n.t('option')}
          </Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.PRib_1x3_fV}</Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PRib_1x4_fV}</Text>
  {/* вывод рядов с прибавками*/}
  
  <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('RowsWithAdding')}:</Text>
<Text style={styles.resultText}>{resultString43V}</Text>

  
       {/* конец вывода рядов с прибавками*/}
  </View>
            
          )}
          {results.usedIncreaseTypeV?.includes('1x4, 1x1') && (
              <View style={[ {marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}]}>
             <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 14}]}>
          {i18n.t('option')}
          </Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PR_1x4_fV}</Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_fV}</Text>
            </View>
          )}

             
          {results.usedIncreaseTypeV?.includes('1x3, 1x1') && (
            <View style={{marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8, alignItems: 'center'}}>
             <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 14}]}>
          {i18n.t('option')}
          </Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.prib_1x3_fV}</Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_fV}</Text>
            </View>
          )}
          {results.usedIncreaseTypeV?.includes('1x4') && (
            <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8, alignItems: 'center' }}>
         <Text style={[styles.resultText, { fontWeight: 'bold', marginTop: 14 }]}>
           {i18n.t('option')}
         </Text>
         <Text style={styles.resultText}>1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PR_1x4_fV}</Text>
         <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('RowsWithAdding')}:</Text>
         <Text style={styles.resultText}>{RowPrib1x4StringV}</Text>

         </View>
          )}

          {results.usedIncreaseTypeV?.includes('1x1') && (
            <View style={{marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8, alignItems: 'center'}}>
              <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 14}]}>
                {i18n.t('option')}
              </Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_fV}</Text>
              <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('RowsWithAdding')}:</Text>
         <Text style={styles.resultText}>{RowPrib1x1StringV}</Text>  
             
            </View>
            )}

            {results.usedIncreaseTypeV?.includes('1x2') && (
              <View 
              style={{
                marginBottom: 10, 
                marginLeft: 0,
                 padding: 5,
                 backgroundColor: '#E6E6E6',
                 borderRadius: 8,
                 alignItems: 'center'
                 }}>
                <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 14}]}>
                  {i18n.t('option')}
                </Text>
                <Text style={styles.resultText}>
                  1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.prib_1x2_fV}
                  </Text>
                <Text style={[styles.resultText, {fontWeight: 'bold'}]}>
                  {i18n.t('RowsWithAdding')}:</Text>
           <Text style={styles.resultText}>{RowPrib1x2StringV}</Text>  
               
              </View>
            )}
            
            {results.usedIncreaseTypeV?.includes('1x3') && (
              <View style={{marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8, alignItems: 'center'}}>
                <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 14}]}>
                  {i18n.t('option')}
                </Text>
                <Text style={styles.resultText}>1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.prib_1x3_fV}</Text>
                <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('RowsWithAdding')}:</Text>
           <Text style={styles.resultText}>{RowPrib1x3StringV}</Text>  
           
               
              </View>
            )}
          
        </View>

{/*  FRONT V */}
        <View style={styles.resultCard}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          
          <Text style={styles.subtitle}>{i18n.t('front')}</Text>
         
        
          <View style={{width: 17, height: 17, backgroundColor: '#FDCFE1', marginLeft: 10, borderWidth: 1}}></View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('knittingChart')}:</Text>
          <TouchableOpacity onPress={navigateToFrontV}>
          <Image
            source={require('@/assets/images/view.svg')}
            style={styles.viewImage}  
            contentFit="contain"
          />
          </TouchableOpacity>
        
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
        <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('action')}1:</Text>
          <Image
            source={require('@/assets/images/znts.svg')}
            style={styles.styleZntsImage}
            contentFit="contain"
          /> 
          <Text style={styles.resultText}>
          {i18n.t('rows')}:{results.NHV},
          </Text>
          
          </View>
       
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
            <Text style={styles.resultText}>
            {i18n.t('start')}
            </Text>
            <Image
              source={require('@/assets/images/znstartfront.svg')}
              style={styles.styleznsfImage}
              contentFit="contain"
            /> 
            
            <Text style={styles.resultText}> : </Text>
            
            
          </View>
          <View style={{marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8, alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <Text style={styles.resultText}>{i18n.t('drawingForUnderstanding')}</Text>  
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
         
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'flex-start'}}> 
          
    <Image
      source={require('../../../../assets/images/frontVa.png')}
      style={styles.frontImage}
     
    />
  </View>
  
  </ScrollView>
  </View>
  {/*1*/} 
<View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
<Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('calculationForYou')}: {i18n.t('rows')} 1, 2</Text>  
</View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>

          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <Text style={styles.resultText}> 1: </Text>
          
          <View style={{  marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#00ADF2', marginLeft: 10, borderWidth: 1}}></View>
         
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
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>
          <View style={{  marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#FDCFE1', marginLeft: 10, borderWidth: 1}}></View>
          
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
          ) : '0'}
          </Text>
          </View>
          
          
          </View>
          </ScrollView>
  {/*2*/}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <Text style={styles.resultText}> 2: </Text>
          <View style={{  marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#FDCFE1', marginLeft: 10, borderWidth: 1}}></View>
          
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
<ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>

<View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
<Text style={styles.resultText}> 3: </Text>

<View style={{  marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
<View style={{width: 17, height: 17, backgroundColor: '#00ADF2', marginLeft: 10, borderWidth: 1}}></View>

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
<View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
<View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
</View>
<View style={{  marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
<View style={{width: 17, height: 17, backgroundColor: '#FDCFE1', marginLeft: 10, borderWidth: 1}}></View>

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
) : '0'}
</Text>
</View>


</View>
</ScrollView>
{/*4*/}
<ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <Text style={styles.resultText}> 4: </Text>
          <View style={{  marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#FDCFE1', marginLeft: 10, borderWidth: 1}}></View>
          
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

          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('action')} 2:</Text>
          <View style={{width: 17, height: 17, backgroundColor: 'black', marginRight: 10,marginLeft: 10, borderWidth: 1}}></View>
          
          <Text style={[styles.resultText, {flexShrink: 1}]}>{i18n.t('decreasesOnOneSide')}: {i18n.t('stitches')} {results.SVfront - results.SFrontV / 2}</Text>
         
        
         
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
        <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('action')} 3:</Text>
        <Image
          source={require('@/assets/images/knitcircle.svg')}
          style={styles.styleKnitCircleImage}
          contentFit="contain"
        /> 
        <Text style={styles.resultText}>
        {i18n.t('rows')}:{results.NHFrontV-results.NHV},
        </Text>
        
        </View>

        </View>
        
        {/* УДЛИНЕНИЕ СПИНКИ */}
        
        <View style={styles.resultCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'center', width: '100%' }}>
            <Text style={[styles.textStep, { textAlign: 'center' }]}>
              {i18n.t('step')}3
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          
            <Text style={styles.subtitle}>{i18n.t('backLengthening')}</Text>
           
          
            <View style={{width: 17, height: 17, backgroundColor: '#009FE3', marginLeft: 10, borderWidth: 1}}></View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SRostok}
          </Text>
          <Image
            source={require('@/assets/images/knitflat.svg')}
            style={styles.styleKnitCircleImage}
            contentFit="contain"
          />
          <Text style={styles.resultText}>
            {i18n.t('rows')}: {results.NRostok}
          </Text>
          </View>

          


          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <Text style={styles.resultText}>
          {i18n.t('start')}
          </Text>
          <Image
            source={require('@/assets/images/startv.svg')}
            style={styles.startvImage}
            contentFit="contain"
          />
          <Text style={styles.resultText}> : </Text>
          </View> 
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}}>
          <View style={{width: 17, height: 17, backgroundColor: '#E76F51', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SKfrontV}
          </Text>
         </View>
         {/* round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>
         <View style={{ marginBottom: 10, marginLeft:0,padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#A29FCF', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SFrontV+2*results.SfxV}
          </Text>
          </View>
         {/* round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>
          <View style={{ marginBottom: 10, marginLeft:0,padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#E76F51', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SKfrontV}
          </Text>
          </View>
          </View>
          </ScrollView>

          
        </View>
        {/*разделение на части*/}
        <View style={styles.resultCard}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
            <Text style={styles.subtitle}>{i18n.t('parts')}</Text>
            <TouchableOpacity onPress={handleScrollToTop} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
              <Image
                source={require('../../../../assets/images/planVaz44.png')}
                style={{ width: 30, height: 30 }} // Smaller size for inline link
                contentFit="contain"
              />
              <Text style={[styles.resultText, { marginLeft: 5, color: 'blue', textDecorationLine: 'underline' }]}>
                {i18n.t('plan')} 
              </Text>
            </TouchableOpacity>
           
          </View>
          
          
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 1 }}>
          <Text style={[styles.resultText, {marginLeft: 10, fontWeight: 'bold'}]}>{i18n.t('back')}</Text>
          <View style={{width: 34, height: 17, backgroundColor: '#009FE3', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}> 
          {i18n.t('stitches')}:
          {results.SRostok}
          </Text>
          </View>

          {/*перед*/}

          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20, justifyContent: 'center', marginBottom: 1 }}>
          <Text style={[styles.resultText, {marginLeft: 10, fontWeight: 'bold'}]}>{i18n.t('front')}</Text>
          
          <View style={{width: 34, height: 17, backgroundColor: '#FDCFE1', marginLeft: 10, borderWidth: 1,borderLeftWidth: 7, borderRightWidth: 7, borderTopWidth: 1, borderLeftColor: '#E76F51', borderRightColor: '#E76F51'}}></View>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}> 
          {i18n.t('stitches')}:
          {results.SFrontV + 2* results.SfxV + 2* results.SKfrontV}
          </Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'flex-start' ,justifyContent: 'center', marginBottom: 3 }} >
          
          <View style={[styles.textBoxParts, {flexDirection: 'row'}]}>
          <View style={{ marginBottom: 1, marginRight: 1, padding: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{width: 17, height: 17, backgroundColor: '#E76F51', borderWidth: 1}}></View>
          <Text style={[styles.resultText, {textAlign: 'center'}]}>
          {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
          {results.SKfrontV}
          </Text>
          </View>
          
          <View style={[styles.textBox, {backgroundColor: '#FDCFE1',justifyContent: 'center'}]}>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 5}]}>
          {i18n.t('stitches')}: {'\n'}
          {results.SFrontV + 2* results.SfxV}
          </Text>
          </View>

          <View style={{ marginBottom: 1, marginLeft: 1, padding: 1, borderRadius: 8, alignItems: 'center'}}>
          <View style={{width: 17, height: 17, backgroundColor: '#E76F51', borderWidth: 1}}></View>
          <Text style={[styles.resultText, {textAlign: 'center'}]}>
          {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
          {results.SKfrontV}
          </Text>
          </View>
          </View>
          </View>

          {/*рукав*/}
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 1 }}>
          <Text style={[styles.resultText, {marginLeft: 10, fontWeight: 'bold'}]}>{i18n.t('sleeve')}</Text>
          <View style={{width: 34, height: 17, backgroundColor: '#DAEDBD', marginLeft: 10, borderWidth: 1, borderLeftWidth: 7, borderRightWidth: 7, borderTopWidth: 1, borderLeftColor: '#E76F51', borderRightColor: '#E76F51'}}></View>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}> 
          {i18n.t('stitches')}:
          {results.SaV + 2* results.SfxV + 2* results.SKaV}
          </Text>
          </View>
        
          <View style={{flexDirection: 'row', alignItems: 'flex-start' ,justifyContent: 'center', marginBottom: 3 }} >
          
          <View style={[styles.textBoxParts, {flexDirection: 'row'}]}>
          <View style={{ marginBottom: 1, marginLeft: 0, padding: 1, borderRadius: 8, alignItems: 'center'}}>
          <View style={{width: 17, height: 17, backgroundColor: '#E76F51', borderWidth: 1}}></View>
          <Text style={[styles.resultText, {textAlign: 'center'}]}>
          {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
          {results.SKaV}
          </Text>
          </View>
          
          <View style={[styles.textBox, {backgroundColor: '#DAEDBD',justifyContent: 'center'}]}>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 5}]}>
          {i18n.t('stitches')}: {'\n'}
          {results.SaV + 2* results.SfxV}
          </Text>
          </View>

          <View style={{ marginBottom: 1, marginLeft: 0, padding: 1, borderRadius: 8, alignItems: 'center'}}>
          <View style={{width: 17, height: 17, backgroundColor: '#E76F51', borderWidth: 1}}></View>
          <Text style={[styles.resultText, {textAlign: 'center'}]}>
          {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
          {results.SKaV}
          </Text>
          </View>
          </View>
          </View>
          
                
                     
        </View>


   {/* отделение рукавов*/}
        <View style={styles.resultCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'center', width: '100%' }}>
            <Text style={[styles.textStep, { textAlign: 'center' }]}>
              {i18n.t('step')}4
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
            <Text style={styles.subtitle}>{i18n.t('separatingBodyAndSleeves')}</Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <Text style={styles.resultText}>
          {i18n.t('start')}
          </Text>
          <Image
            source={require('@/assets/images/startend.svg')}
            style={styles.startvImage}
            contentFit="contain"
          />
          <Text style={styles.resultText}> : </Text>
          </View> 

          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <Text style={styles.resultText}>
          {i18n.t('rows')}: 1
          </Text>
          <Image
            source={require('@/assets/images/knitcircle.svg')}
            style={styles.styleKnitCircleImage}
            contentFit="contain"
          />
          </View> 
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}}>
          <Text style={styles.resultText}>
          {i18n.t('back')}
          </Text>
          <View style={{width: 17, height: 17, backgroundColor: '#CCCCCC', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SRostok}
          </Text>
          
         </View>
         {/* round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>

         <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
         <View style={styles.textBox}>
         <Text style={styles.textInsideBox}>
          {i18n.t('separateTheSleeve')}</Text>
          </View>

          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SaV+2*results.SfxV +2*results.SKaV}
          </Text>

          </View>
          
          {/* round*/}
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>

          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#FF00FF', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SPodr} {'\n'}<Text style={styles.createText}>{i18n.t('create')}</Text>
          </Text>
          </View>
          {/* round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>

          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <Text style={styles.resultText}>
          {i18n.t('front')}
          </Text>
          <View style={{width: 17, height: 17, backgroundColor: '#CCCCCC', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SRostok}
          </Text>
         </View>
         {/* round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>

         <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
         <View style={styles.textBox}>
         <Text style={styles.textInsideBox}>
          {i18n.t('separateTheSleeve')}</Text>
          </View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SaV+2*results.SfxV +2*results.SKaV}
          </Text>
          </View>
          {/* round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>
          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#FF00FF', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SPodr} {'\n'}<Text style={styles.createText}>{i18n.t('create')}</Text> 
          </Text>
          </View>
        

          </View>

          </ScrollView>
          
        </View>

    {/* ИТОГИ ИТОГИ ИТОГИ*/}

        <View style={styles.resultCard}>
          
        <Text style={[styles.subtitle, { marginBottom: 0 }]}>
         {i18n.t('Result')}
         </Text>
         <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
         <View style={styles.resultContainer}>
    <Image
      source={require('../../../../assets/images/sleevebodyV.png')}
      style={styles.resultImage}
     
    />
  </View>
  </ScrollView>
         {/* корпус итоги*/}
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>

          <Text style={[styles.resultText, {marginLeft: 10, fontWeight: 'bold'}]}>{i18n.t('corpus')}</Text>
          <View style={{width: 34, height: 17, backgroundColor: '#009FE3', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}> 
          {i18n.t('stitches')}:
          {results.SRostok *2 +results.SPodr *2}
          </Text>
          </View>
{/*скролл корпус*/}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
        

          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center',borderColor: '#009FE3',borderWidth: 1}}>
          <Text style={styles.resultText}>
          {i18n.t('back')}
          </Text>
          <View style={{width: 17, height: 8, backgroundColor: '#CCCCCC', marginLeft: 10, borderWidth: 1}}></View>
          <View style={{width: 17, height: 17, backgroundColor: '#009FE3', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SRostok}
          </Text>
          
         </View>
          
          {/*  round*/}
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>

          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8, alignItems: 'center',borderColor: '#009FE3',borderWidth: 1}} >
          <View style={{width: 17, height: 8, backgroundColor: '#FF00FF', marginLeft: 10, borderWidth: 1}}></View>
          <View style={{width: 17, height: 17, backgroundColor: '#009FE3', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SPodr} {'\n'}<Text style={styles.createText}>{i18n.t('created')}</Text>
          </Text>
          </View>
          {/*  round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>

          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center',borderColor: '#009FE3',borderWidth: 1}}>
          <Text style={styles.resultText}>
          {i18n.t('front')}
          </Text>
          <View style={{width: 17, height: 8, backgroundColor: '#CCCCCC', marginLeft: 10, borderWidth: 1}}></View>
          <View style={{width: 17, height: 17, backgroundColor: '#009FE3', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SRostok}
          </Text>
          
         </View>
          
          {/*  round*/}
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>

          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8, alignItems: 'center',borderColor: '#009FE3',borderWidth: 1}} >
          <View style={{width: 17, height: 8, backgroundColor: '#FF00FF', marginLeft: 10, borderWidth: 1}}></View>
          <View style={{width: 17, height: 17, backgroundColor: '#009FE3', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SPodr} {'\n'}<Text style={styles.createText}>{i18n.t('created')}</Text>
          </Text>
          </View>
         
         

          </View>

          </ScrollView>
         
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
{/* рукав итоги*/}
          <Text style={[styles.resultText, {marginLeft: 10, fontWeight: 'bold'}]}>{i18n.t('sleeve')}</Text>
          <View style={{width: 34, height: 17, backgroundColor: '#95C11F', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}> 
          {i18n.t('stitches')}:
          {results.SaV + 2* results.SfxV + 2* results.SKaV + results.SPodr + results.NRostok *0.5}
          </Text>
          </View>
{/*скролл рукав*/}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
        

         <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center',borderColor: '#95C11F',borderWidth: 1}} >
         <View style={styles.textBox}>
         <Text style={styles.textInsideBox}>
          {i18n.t('sleeve')}</Text>
          </View>

          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SaV+2*results.SfxV +2*results.SKaV}
          </Text>

          </View>
           {/*  round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>

          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center',borderColor: '#95C11F',borderWidth: 1}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: 8, height: 17, backgroundColor: '#CCCCCC', marginLeft: 0, borderWidth: 1}}></View>
          <View style={{width: 17, height: 17, backgroundColor: '#95C11F', marginLeft: 0, borderWidth: 1}}></View>
          </View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.NRostok *0.5} {'\n'}<Text style={styles.createText}>{i18n.t('create')}</Text>
          </Text>
         </View>
          
         {/*  round*/}
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>

          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8, alignItems: 'center',borderColor: '#95C11F',borderWidth: 1}} >
          <View style={{width: 17, height: 17, backgroundColor: '#95C11F', marginLeft: 10, borderWidth: 1}}></View>
          <View style={{width: 17, height: 8, backgroundColor: '#FF00FF', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SPodr} {'\n'}<Text style={styles.createText}>{i18n.t('create')}</Text>
          </Text>
          </View>
         
         
         

          </View>

          </ScrollView>










          
          </View>

      </ScrollView>
      
  {/*ПАНЕЛЬ*/}

      
     
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
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'grey'
  },
  newStyleButtonText: {
    color: 'grey',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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
    width: Dimensions.get('window').width - 40,
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
});


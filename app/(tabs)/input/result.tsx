import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import onboardingState from '@/state/onboardingState';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { screenWidth } from '@/utils/Layout';
import { calculateRaglan } from '@/utils/calculateRaglan';


{/*расчет рядов с прибавками для 1x2, 1x4*/}
export const calculateIncreaseRows1x2_1x4 = (NHFront: number, Sfx: number, PR_1x4_f: number, PR_1x2_f: number) => {
  const KB = Sfx / PR_1x4_f;
  const B = Array.from({ length: PR_1x4_f }, (_, b) => b + 1);
  const PozB = B.map(b => Math.floor(KB * b));
  
  const A = Array.from({ length: PR_1x2_f }, (_, a) => a + 1);
   {/* Создаем массив RowB для рядов с прибавками из PozB*/}
   const RowB = PozB.map((b, bIndex) => {
    const adjustedIndex = bIndex + 1; // Индексы начинаются с 1
    const row = (b - 1) * 2 + 1 + (adjustedIndex - 1) * 2;
    
    return row;
  });
  const RowN = Array.from({ length: NHFront }, (_, i) => i + 1);

  {/* Удаляем элементы RowB и три следующих за каждым из них из RowN*/}
  RowB.forEach(b => {
    for (let i = 0; i < 4; i++) { // Удаляем b и три следующих за ним
      const index = RowN.indexOf(b + i);
      if (index !== -1) {
        RowN.splice(index, 1);
      }
    }
  });

  {/* Создаем массив RowA из нечетных чисел RowN*/}
  const RowA = RowN.filter(n => n % 2 !== 0);

  {/* Объединяем RowA и RowB в RowPrib1x2_1x4*/}
  const RowPrib1x2_1x4 = [...RowA, ...RowB].sort((a, b) => a - b);

  {/* Преобразуем RowPrib1x2_1x4 в строку*/}
  const resultString24 = RowPrib1x2_1x4.join(', ');

  return { PozB, RowB, RowN, RowA, RowPrib1x2_1x4, resultString24 };
};

{/* конец расчета рядов с прибавками для 1x2, 1x4*/}

{/*расчет рядов с прибавками для 1x2, 1x3*/}
export const calculateIncreaseRows1x2_1x3 = (NHFront: number, Sfx: number, prib_1x3_f: number, prib_1x2_f: number) => {
  const KD = Sfx / prib_1x3_f;
  const D = Array.from({ length: prib_1x3_f }, (_, d) => d + 1);
  const PozD = D.map(d => Math.floor(KD * d));
  
  const A2 = Array.from({ length: prib_1x2_f }, (_, a) => a + 1);
   {/* Создаем массив RowD для рядов с прибавками из PozD*/}
   const RowD = PozD.map((d, dIndex) => {
    const adjustedIndex = dIndex + 1; // Индексы начинаются с 1
    const row = (d - 1) * 2 + 1 + (adjustedIndex - 1);
    
    return row;
  });
  const RowN23 = Array.from({ length: NHFront }, (_, i) => i + 1);

  {/* Удаляем элементы RowD и два следующих за каждым из них из RowN23*/}
  RowD.forEach(d => {
    for (let i = 0; i < 3; i++) { // Удаляем d и две следующих за ним
      const index = RowN23.indexOf(d + i);
      if (index !== -1) {
        RowN23.splice(index, 1);
      }
    }
  });
  {/* Разбиваем RowN23 на пары и берем первые элементы каждой пары*/}
  const RowA23 = RowN23.filter((_, index) => (index + 1) % 2 !== 0);

  const RowPrib1x2_1x3 = [...RowA23, ...RowD].sort((a, b) => a - b);

  const resultString23 = RowPrib1x2_1x3.join(', ');

  return { PozD, RowD, RowN23, RowA23, RowPrib1x2_1x3, resultString23 };
};

{/* конец расчета рядов с прибавками для 1x2, 1x3*/}

{/*расчет рядов с прибавками для 1x2, 1x1*/}
export const calculateIncreaseRows1x2_1x1 = (NHFront: number, Sfx: number, prib_1x1_f: number, prib_1x2_f: number) => {
  const KC = Sfx / prib_1x1_f;
  const C = Array.from({ length: prib_1x1_f }, (_, c) => c + 1);
  const PozC = C.map(c => Math.floor(KC * c));
  
  const A21 = Array.from({ length: prib_1x2_f }, (_, a) => a + 1);
   {/* Создаем массив RowC для рядов с прибавками из PozC*/}
   const RowC = PozC.map((c, cIndex) => {
    const adjustedIndex = cIndex + 1; // Индексы начинаются с 1
    const row = (c - 1) * 2 + 1 - (adjustedIndex - 1);
    
    return row;
  });
  const RowN21 = Array.from({ length: NHFront }, (_, i) => i + 1);

  {/* Удаляем элементы RowC  из RowN*/}
  RowC.forEach(c => {
    const index = RowN21.indexOf(c);
    if (index !== -1) {
      RowN21.splice(index, 1);
    }
  });
  {/* Разбиваем RowN на пары и берем первые элементы каждой пары*/}
  const RowA21 = RowN21.filter((_, index) => (index + 1) % 2 !== 0);
{/* Объединяем RowA21 и RowC в RowPrib1x2_1x1 и сортируем */}
  const RowPrib1x2_1x1 = [...RowA21, ...RowC].sort((a, b) => a - b);
{/* Отладочный вывод для проверки содержимого RowPrib1x2_1x1*/}




  {/* Преобразуем RowPrib1x2_1x1 в строку */}
  const resultString21 = RowPrib1x2_1x1.join(', ');

  return { PozC, RowC, RowN21, RowA21, RowPrib1x2_1x1, resultString21 };
};

{/* конец расчета рядов с прибавками для 1x2, 1x1*/}



{/*расчет рядов с прибавками для 1x4, 1x3*/}

export const calculateIncreaseRows1x4_1x3 = (NHFront: number, Sfx: number, PRib_1x4_f: number, PRib_1x3_f: number) => {
  {/* Вычисляем количество прибавок для 1x4 и 1x3*/}
  
 
 {/* Создаем массивы для прибавок*/}
  
  
const KM = Sfx / PRib_1x3_f;
  const M = Array.from({ length: PRib_1x3_f }, (_, m) => m + 1);
  const PozM = M.map(m => Math.floor(KM * m));
  
  const A34 = Array.from({ length: PRib_1x4_f }, (_, a) => a + 1);
  {/* Создаем массив RowM для рядов с прибавками из PozM*/}
  const RowM = PozM.map((m, mIndex) => {
    const adjustedIndex = mIndex + 1; // Индексы начинаются с 1
    const row = (m - 1) * 4 + 1 - (adjustedIndex - 1);
    
    
    return row;
  });

  const RowN43 = Array.from({ length: NHFront }, (_, i) => i + 1);

  {/* Удаляем элементы RowM и два следующих за каждым из них из RowN43*/}
  RowM.forEach(m => {
    for (let i = 0; i < 3; i++) { // Удаляем m и два следующих за ним
      const index = RowN43.indexOf(m + i);
      if (index !== -1) {
        RowN43.splice(index, 1);
      }
    }
  });

  {/* Разбиваем RowN43 на четверки и берем первые элементы каждой четверки*/}
  const RowA43 = [];
for (let i = 0; i < RowN43.length; i += 4) {
  RowA43.push(RowN43[i]);
}

  const RowPRib1x4_1x3 = [...RowA43, ...RowM].sort((a, b) => a - b);

  const resultString43 = RowPRib1x4_1x3.join(', ');

  return { PozM, RowM, RowN43, RowA43, RowPRib1x4_1x3, resultString43 };
};


{/* конец расчета рядов с прибавками для 1x4, 1x3*/}


export default observer(() => {
  const router = useRouter();
  const results = introState.calculateRaglan();
  const scrollViewRef = useRef<ScrollView>(null);
  const carouselRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const currentLanguage = onboardingState.language;
  const tabBarHeight = useBottomTabBarHeight();
  const ribbingWidth = introState.ribbingWidth;

  const handleStartKnitting = () => {
    router.navigate('/(tabs)/raglan/ribbingO');
  };

  const handleNewStyle = () => {
    introState.setStyleChosen(false);
    router.navigate('/');
  };

  

  const { PozB, RowB, RowN, RowA, RowPrib1x2_1x4, resultString24 } = calculateIncreaseRows1x2_1x4(results.NHFront, results.Sfx, results.PR_1x4_f, results.PR_1x2_f);
  const { PozD, RowD, RowA23, RowPrib1x2_1x3, resultString23 } = calculateIncreaseRows1x2_1x3(results.NHFront, results.Sfx, results.prib_1x3_f, results.prib_1x2_f);
  const { PozC, RowC, RowN21, RowA21, RowPrib1x2_1x1, resultString21 } = calculateIncreaseRows1x2_1x1(results.NHFront, results.Sfx, results.prib_1x1_f, results.prib_1x2_f);
  const { PozM, RowM, RowN43, RowA43, RowPRib1x4_1x3, resultString43 } = calculateIncreaseRows1x4_1x3(results.NHFront, results.Sfx, results.PRib_1x4_f, results.PRib_1x3_f);  
  
  
  
  {/* ссылка на sleeveO*/}
  const navigateToSleeveO = () => {
    router.navigate('/(tabs)/raglan/sleeveO');
  };
  {/* ссылка на frontO*/}
  const navigateToFrontO = () => {
    router.navigate('/(tabs)/raglan/frontO');
  };
  {/* ссылка на backO*/}
  const navigateToBackO = () => {
    router.navigate('/(tabs)/raglan/backO');
  };  
  {/* ссылка на ribbingO*/}
  const navigateToRibbingO = () => {
    router.navigate('/(tabs)/raglan/ribbingO');
  };  
  const handleScrollToTop = () => {
    {/* Scroll to top*/}
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    
    {/* Scroll carousel to planVaz3.png (index 1)*/}
    setTimeout(() => {
      const slideSize = Dimensions.get('window').width - 40;
      carouselRef.current?.scrollTo({ x: slideSize * 1, animated: true });
      setCurrentIndex(1); {/* Update current index to match*/}
    }, 100); {/* Small delay to ensure vertical scroll completes first*/}
  };

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

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
         <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 100 }]}
      >
        <ScrollView 
          ref={carouselRef} 
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
              source={require('../../../assets/images/planOaz.svg')}
              style={styles.slideImage}
              contentFit="contain"
            />
          </View>
         
          <View style={styles.slideContainer}>
            <Image
              source={require('../../../assets/images/planOaz2.png')}
              style={styles.slideImage}
              contentFit="contain"
            />
          </View>
         
          <View style={styles.slideContainer}>
            <Image
              source={require('../../../assets/images/regular-collar.png')}
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

        {/* <View style={styles.resultCard}>
          <Text style={styles.subtitle}>Основная информация</Text>
          <Text style={styles.resultText}>
            Вязать по кругу начиная с резинки
          </Text> 
        </View> */}

        <View style={styles.resultCard}>

                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
            <Text style={styles.subtitle}>{i18n.t('ribbing')}</Text>
            <View style={{width: 17, height: 17, backgroundColor: 'yellow', marginLeft: 10, borderWidth: 1}}></View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('knittingChart')}:</Text>
           
            <TouchableOpacity onPress={navigateToRibbingO}>
          <Image
            source={require('@/assets/images/view.svg')}
            style={styles.viewImage}  
            contentFit="contain"
          />
          </TouchableOpacity>
          </View>
          
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.Sgor}
          </Text>
          <Image
            source={require('@/assets/images/knitcircle.svg')}
            style={styles.styleKnitCircleImage}
            contentFit="contain"
          />
          <Text style={styles.resultText}>
          {i18n.t('rows')}: {results.NRrez}
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
          {i18n.t('stitches')}: {results.SKfront}
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
          {i18n.t('stitches')}: {results.SFrontO}
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
          {i18n.t('stitches')}: {results.K}
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
          {i18n.t('stitches')}: {results.Sa}
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
          {i18n.t('stitches')}: {results.K}
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
          {i18n.t('stitches')}: {results.SFrontO}
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
          {i18n.t('stitches')}: {results.K}
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
          {i18n.t('stitches')}: {results.Sa}
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
          {i18n.t('stitches')}: {results.SKa}
          </Text>
          </View>
          
          </View>
          </ScrollView>

          <Text style={styles.resultText}>
          {i18n.t('stitches') + ' ' + i18n.t('back')}: {results.SFrontO}
          </Text>
          <Text style={styles.resultText}>
          {i18n.t('stitches') + ' ' + i18n.t('front')}: {results.SFrontO}
          </Text>
          <Text style={styles.resultText}>
          {i18n.t('stitches') + ' ' + i18n.t('sleeve')}: {results.Sa}
          </Text>
          <Text style={styles.resultText}>
          {i18n.t('stitches') + ' ' + i18n.t('raglan')}: {introState.raglanLineWidth}
          </Text>
          
        </View>
{/* ПРИБАВЛЕНИЯ
        */}
        <View style={styles.resultCard}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
            <Text style={styles.subtitle}>{i18n.t('addingStitchesAlongTheRaglanLine')}</Text>
           
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: +{results.Sfx}
          </Text>
          <Image
            source={require('@/assets/images/knitcircle.svg')}
            style={styles.styleKnitCircleImage}
            contentFit="contain"
          />
          <Text style={styles.resultText}>
          {i18n.t('rows')}: {results.NHFront}
          </Text>
          </View> 
          
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 1 }}>
          <Text style={[styles.resultText, {marginLeft: 10}]}>{i18n.t('back')}</Text>
          <View style={{width: 34, height: 17, backgroundColor: '#A29FCF', marginLeft: 10, borderWidth: 1}}></View>
          <TouchableOpacity onPress={navigateToBackO}>
          <Image
            source={require('@/assets/images/view.svg')}
            style={styles.viewImage}  
            contentFit="contain"
          />
          </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'top' ,justifyContent: 'center', marginBottom: 3 }} >
          
          <View style={{ marginBottom: 1, marginLeft: 0, padding: 1, borderRadius: 8, alignItems: 'center'}}>
          <View style={{width: 34, height: 14, borderTopWidth: 8.5, borderLeftWidth: 17, borderRightWidth: 17, borderBottomWidth: 8.5, padding: -17, borderTopColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: '#A29FCF', borderBottomColor: '#A29FCF'}}></View>
          <Text style={[styles.resultText, {textAlign: 'center'}]}>
          {i18n.t('adding')}: {'\n'}
          +{results.Sfx}
          </Text>
          </View>
          
          <View style={[styles.textBox, {backgroundColor: '#A29FCF',justifyContent: 'center'}]}>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}>
          {i18n.t('stitches')}: {'\n'}
          {results.SFrontO}
          </Text>
          </View>


          <View style={{ marginBottom: 1, marginLeft: 0,padding: 1, borderRadius: 8,alignItems: 'center'}}>
          <View style={{width: 34, height: 14, marginLeft: 0, borderTopWidth: 8.5, borderLeftWidth: 17, borderRightWidth: 17, borderBottomWidth: 8.5, padding: -17, borderTopColor: 'transparent', borderLeftColor: '#A29FCF', borderRightColor: 'transparent', borderBottomColor: '#A29FCF'}}></View>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}> 
          {i18n.t('adding')}: {'\n'}
          +{results.Sfx}
          </Text>
          </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20, justifyContent: 'center', marginBottom: 1 }}>
          
          <Text style={[styles.resultText, {marginLeft: 10}]}>{i18n.t('front')}</Text>
          <View style={{width: 34, height: 17, backgroundColor: '#FDCFE1', marginLeft: 10, borderWidth: 1}}></View>
          <TouchableOpacity onPress={navigateToFrontO}>
           <Image
            source={require('@/assets/images/view.svg')}
            style={styles.viewImage}
            contentFit="contain"
          />
          </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'top' ,justifyContent: 'center', marginBottom: 3 }} >
          
          <View style={{ marginBottom: 1, marginLeft: 0, padding: 1, borderRadius: 8, alignItems: 'center'}}>
          <View style={{width: 34, height: 14, borderTopWidth: 8.5, borderLeftWidth: 17, borderRightWidth: 17, borderBottomWidth: 8.5, padding: -17, borderTopColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: '#FDCFE1', borderBottomColor: '#FDCFE1'}}></View>
          <Text style={[styles.resultText, {textAlign: 'center'}]}>
          {i18n.t('adding')}: {'\n'}
          +{results.Sfx}
          </Text>
          </View>
          
          <View style={[styles.textBox, {backgroundColor: '#FDCFE1',justifyContent: 'center'}]}>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}>
          {i18n.t('stitches')}: {'\n'}
          {results.SFrontO}
          </Text>
          </View>


          <View style={{ marginBottom: 1, marginLeft: 0,padding: 1, borderRadius: 8,alignItems: 'center'}}>
          <View style={{width: 34, height: 14, marginLeft: 0, borderTopWidth: 8.5, borderLeftWidth: 17, borderRightWidth: 17, borderBottomWidth: 8.5, padding: -17, borderTopColor: 'transparent', borderLeftColor: '#FDCFE1', borderRightColor: 'transparent', borderBottomColor: '#FDCFE1'}}></View>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}> 
          {i18n.t('adding')}: {'\n'}
          +{results.Sfx}
          </Text>
          </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 1 }}>
          <Text style={[styles.resultText, {marginLeft: 10}]}>{i18n.t('sleeve')}</Text>
          <View style={{width: 34, height: 17, backgroundColor: '#DAEDBD', marginLeft: 10, borderWidth: 1}}></View>
          <TouchableOpacity onPress={navigateToSleeveO}>
          <Image
            source={require('@/assets/images/view.svg')}
            style={styles.viewImage}  
            contentFit="contain"
          />
        </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'top' ,justifyContent: 'center', marginBottom: 3 }} >
          
          <View style={{ marginBottom: 1, marginLeft: 0, padding: 1, borderRadius: 8, alignItems: 'center'}}>
          <View style={{width: 34, height: 14, borderTopWidth: 8.5, borderLeftWidth: 17, borderRightWidth: 17, borderBottomWidth: 8.5, padding: -17, borderTopColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: '#DAEDBD', borderBottomColor: '#DAEDBD'}}></View>
          <Text style={[styles.resultText, {textAlign: 'center'}]}>
          {i18n.t('adding')}: {'\n'}
          +{results.Sfx}
          </Text>
          </View>
          
          <View style={[styles.textBox, {backgroundColor: '#DAEDBD',justifyContent: 'center'}]}>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}>
          {i18n.t('stitches')}: {'\n'}
          {results.Sa}
          </Text>
          </View>


          <View style={{ marginBottom: 1, marginLeft: 10, padding: 1, borderRadius: 8, alignItems: 'center'}}>
          <View style={{width: 34, height: 14, marginLeft: 0, borderTopWidth: 8.5, borderLeftWidth: 17, borderRightWidth: 17, borderBottomWidth: 8.5, padding: -17, borderTopColor: 'transparent', borderLeftColor: '#DAEDBD', borderRightColor: 'transparent', borderBottomColor: '#DAEDBD'}}></View>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}> 
          {i18n.t('adding')}: {'\n'}
          +{results.Sfx}
          </Text>
          </View>
          </View>
          
         
          <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 20}]}>
          {i18n.t('additionsOnOneSide')}: {results.Sfx}
          </Text>
        
          {results.usedIncreaseType.includes('1x2, 1x4') && (
              <View style={[styles.section, {marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}]}>
              <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 14}]}>
          {i18n.t('option')}
          </Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.PR_1x2_f}</Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PR_1x4_f}</Text>
  {/* вывод рядов с прибавками*/}
  
  <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('RowsWithAdding')}:</Text>
<Text style={styles.resultText}>{resultString24}</Text>

         {/* конец вывода рядов с прибавками*/}
  </View>
          )}
          
          {results.usedIncreaseType.includes('1x3, 1x4') && (
              <View style={[styles.section, {marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}]}>
              <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 14}]}>
          {i18n.t('option')}
          </Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.PRib_1x3_f}</Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PRib_1x4_f}</Text>
  {/* вывод рядов с прибавками*/}
  
  <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('RowsWithAdding')}:</Text>
<Text style={styles.resultText}>{resultString43}</Text>

  
       {/* конец вывода рядов с прибавками*/}
  </View>
            
          )}
          
              {results.usedIncreaseType.includes('1x2, 1x1') && (
            <View style={[styles.section, {marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}]}>
             <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 14}]}>
            {i18n.t('option')}
            </Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.PR_1x2_f}</Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_f}</Text>
              <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('RowsWithAdding')}:</Text>
              <Text style={styles.resultText}>{resultString21}</Text>
            
            </View>
          )}
          {results.usedIncreaseType.includes('1x4, 1x1') && (
              <View style={[styles.section, {marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}]}>
             <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 14}]}>
          {i18n.t('option')}
          </Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PR_1x4_f}</Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_f}</Text>
            </View>
          )}
          {results.usedIncreaseType.includes('1x2, 1x3') && (
            <View style={[styles.section, {marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}]}>
             <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 14}]}>
          {i18n.t('option')}
          </Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.prib_1x2_f}</Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.prib_1x3_f}</Text>
              <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('RowsWithAdding')}:</Text>
              <Text style={styles.resultText}>{resultString23}</Text>
            </View>
          )}

             
          {results.usedIncreaseType.includes('1x3, 1x1') && (
            <View style={{marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8, alignItems: 'center'}}>
             <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 14}]}>
          {i18n.t('option')}
          </Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.prib_1x3_f}</Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_f}</Text>
            </View>
          )}
          {results.usedIncreaseType.includes('1x4') && (
            <View style={[styles.section, { marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8, alignItems: 'center' }]}>
         <Text style={[styles.resultText, { fontWeight: 'bold', marginTop: 14 }]}>
           {i18n.t('option')}
         </Text>
         <Text style={styles.resultText}>1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PR_1x4_f}</Text>
         <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('RowsWithAdding')}:</Text>
         <Text style={styles.resultText}>{results.RowPrib1x4String}</Text>

         </View>
          )}

          {results.usedIncreaseType.includes('1x1') && (
            <View style={{marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8, alignItems: 'center'}}>
              <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 14}]}>
                {i18n.t('option')}
              </Text>
              <Text style={styles.resultText}>1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_f}</Text>
              <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('RowsWithAdding')}:</Text>
         <Text style={styles.resultText}>{results.RowPrib1x1String}</Text>  
             
            </View>
            )}

            {results.usedIncreaseType.includes('1x2') && (
              <View style={{marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8, alignItems: 'center'}}>
                <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 14}]}>
                  {i18n.t('option')}
                </Text>
                <Text style={styles.resultText}>1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.prib_1x2_f}</Text>
                <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('RowsWithAdding')}:</Text>
           <Text style={styles.resultText}>{results.RowPrib1x2String}</Text>  
               
              </View>
            )}
            {results.usedIncreaseType.includes('1x3') && (
              <View style={{marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8, alignItems: 'center'}}>
                <Text style={[styles.resultText, {fontWeight: 'bold',marginTop: 14}]}>
                  {i18n.t('option')}
                </Text>
                <Text style={styles.resultText}>1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.prib_1x3_f}</Text>
                <Text style={[styles.resultText, {fontWeight: 'bold'}]}>{i18n.t('RowsWithAdding')}:</Text>
           <Text style={styles.resultText}>{results.RowPrib1x3String}</Text>  
           
               
              </View>
            )}
          
        </View>
        
        {/* УДЛИНЕНИЕ СПИНКИ */}
        
        <View style={styles.resultCard}>
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
          {i18n.t('stitches')}: {results.SKfront}
          </Text>
         </View>
         {/* round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>
         <View style={{ marginBottom: 10, marginLeft:0,padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#A29FCF', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SFrontO+2*results.Sfx}
          </Text>
          </View>
         {/* round*/}
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>
          <View style={{ marginBottom: 10, marginLeft:0,padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#E76F51', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SKfront}
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
                source={require('../../../assets/images/planOaz2.png')}
                style={{ width: 30, height: 30 }} 
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
          {results.SFrontO + 2* results.Sfx + 2* results.SKfront}
          </Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'top' ,justifyContent: 'center', marginBottom: 3 }} >
          
          <View style={[styles.textBoxParts, {flexDirection: 'row'}]}>
          <View style={{ marginBottom: 1, marginRight: 1, padding: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{width: 17, height: 17, backgroundColor: '#E76F51', borderWidth: 1}}></View>
          <Text style={[styles.resultText, {textAlign: 'center'}]}>
          {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
          {results.SKfront}
          </Text>
          </View>
          
          <View style={[styles.textBox, {backgroundColor: '#FDCFE1',justifyContent: 'center'}]}>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 5}]}>
          {i18n.t('stitches')}: {'\n'}
          {results.SFrontO + 2* results.Sfx}
          </Text>
          </View>

          <View style={{ marginBottom: 1, marginLeft: 1, padding: 1, borderRadius: 8, alignItems: 'center'}}>
          <View style={{width: 17, height: 17, backgroundColor: '#E76F51', borderWidth: 1}}></View>
          <Text style={[styles.resultText, {textAlign: 'center'}]}>
          {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
          {results.SKfront}
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
          {results.Sa + 2* results.Sfx + 2* results.SKa}
          </Text>
          </View>
          {/*...*/}
          <View style={{flexDirection: 'row', alignItems: 'top' ,justifyContent: 'center', marginBottom: 3 }} >
          
          <View style={[styles.textBoxParts, {flexDirection: 'row'}]}>
          <View style={{ marginBottom: 1, marginLeft: 0, padding: 1, borderRadius: 8, alignItems: 'center'}}>
          <View style={{width: 17, height: 17, backgroundColor: '#E76F51', borderWidth: 1}}></View>
          <Text style={[styles.resultText, {textAlign: 'center'}]}>
          {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
          {results.SKa}
          </Text>
          </View>
          
          <View style={[styles.textBox, {backgroundColor: '#DAEDBD',justifyContent: 'center'}]}>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 5}]}>
          {i18n.t('stitches')}: {'\n'}
          {results.Sa + 2* results.Sfx}
          </Text>
          </View>

          <View style={{ marginBottom: 1, marginLeft: 0, padding: 1, borderRadius: 8, alignItems: 'center'}}>
          <View style={{width: 17, height: 17, backgroundColor: '#E76F51', borderWidth: 1}}></View>
          <Text style={[styles.resultText, {textAlign: 'center'}]}>
          {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
          {results.SKa}
          </Text>
          </View>
          </View>
          </View>
          
         
          
            
          
        </View>


   {/* отделение рукавов*/}
        <View style={styles.resultCard}>
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
          <View style={{flexDirection: 'row', alignItems: 'top', marginBottom: 10}}>
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
          {i18n.t('stitches')}: {results.Sa+2*results.Sfx +2*results.SKa}
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
          {i18n.t('stitches')}: {results.Sa+2*results.Sfx +2*results.SKa}
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
      source={require('../../../assets/images/sleevebodyO.png')}
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
          <View style={{flexDirection: 'row', alignItems: 'top', marginBottom: 10}}>
        

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
          {results.Sa + 2* results.Sfx + 2* results.SKa + results.SPodr + results.NRostok *0.5}
          </Text>
          </View>
{/*скролл рукав*/}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={{flexDirection: 'row', alignItems: 'top', marginBottom: 10}}>
        

         <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center',borderColor: '#95C11F',borderWidth: 1}} >
         <View style={styles.textBox}>
         <Text style={styles.textInsideBox}>
          {i18n.t('sleeve')}</Text>
          </View>

          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.Sa+2*results.Sfx +2*results.SKa}
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

      
     <View style={[styles.stickyButtonContainer, { bottom: tabBarHeight - 30 }]}>
        <TouchableOpacity
          style={styles.newStyleButton}
          onPress={handleNewStyle}
        >
          <Text style={styles.newStyleButtonText}>{i18n.t('newStyle')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleStartKnitting}
        >
          <Text style={styles.startButtonText}>{i18n.t('startKnitting')}</Text>
        </TouchableOpacity>
      </View>
    
    </View>
  );
});

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    
  },
  stickyButtonContainer: {
    position: 'absolute',
    
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center' as const,
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
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
  slideImage: {
    width: '100%',
    height: '100%',
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
  styleKnitCircleImage: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,  
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
  createText: {
    fontSize: 12,
    color: '#000', 
   textAlign: 'center',
  },
  resultContainer: {
    width: '100%', 
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  resultImage: {
    width: '100%',
    aspectRatio: 2, // Устанавливает соотношение сторон изображения
   height: undefined,
    resizeMode: 'contain', // Сохраняет пропорции изображения
    padding: 150,
  },
  scrollView1: {
    flexGrow: 0,
    width: '100%',
    backgroundColor: '#f0f0f0',
    padding: 2,
  },
  
  
}); 

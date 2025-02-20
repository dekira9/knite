import React, { useState } from 'react';
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

export default observer(() => {
  const router = useRouter();
  const results = introState.calculateRaglan();
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const currentLanguage = onboardingState.language;
  const tabBarHeight = useBottomTabBarHeight();
  const ribbingWidth = introState.ribbingWidth;

  const handleStartKnitting = () => {
    router.navigate('/raglan');
  };

  const handleNewStyle = () => {
    introState.setStyleChosen(false);
    router.navigate('/');
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
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 100 }]}>
        <ScrollView 
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
              source={require('../../../assets/images/regular-collar.png')}
              style={styles.slideImage}
              contentFit="contain"
            />
          </View>
         
         
        </ScrollView>

        <View style={styles.pagination}>
          {[0, 1].map((index) => (
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
         // round
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
          // round
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
          // round
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
          // round
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
          // round
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
          // round
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
          // round
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
          // round
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>
          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#E76F51', marginLeft: 10, borderWidth: 1}}></View>
          <View style={{width: 17, height: 17, backgroundColor: 'yellow', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SKa}
          </Text>
          </View>
          </View>
          </ScrollView>
          <Text style={styles.resultText}>
            Петли спереди и сзади: {results.SFrontO}
          </Text>
          <Text style={styles.resultText}>
            Петли рукавов: {results.Sa}
          </Text>
          <Text style={styles.resultText}>
            Петли на линиях реглана: {introState.raglanLineWidth}
          </Text>
          
        </View>
{/* ПРИБАВЛЕНИЯ
        */}
        <View style={styles.resultCard}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
            <Text style={styles.subtitle}>прибавления</Text>
           
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
          <Image
            source={require('@/assets/images/view.svg')}
            style={styles.viewImage}  
            contentFit="contain"
          />
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
           <Image
            source={require('@/assets/images/view.svg')}
            style={styles.viewImage}  
            contentFit="contain"
          />
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
          <Image
            source={require('@/assets/images/view.svg')}
            style={styles.viewImage}  
            contentFit="contain"
          />
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


          <View style={{ marginBottom: 1, marginLeft: 0,padding: 1, borderRadius: 8,alignItems: 'center'}}>
          <View style={{width: 34, height: 14, marginLeft: 0, borderTopWidth: 8.5, borderLeftWidth: 17, borderRightWidth: 17, borderBottomWidth: 8.5, padding: -17, borderTopColor: 'transparent', borderLeftColor: '#DAEDBD', borderRightColor: 'transparent', borderBottomColor: '#DAEDBD'}}></View>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}> 
          {i18n.t('adding')}: {'\n'}
          +{results.Sfx}
          </Text>
          </View>
          </View>
          
         
          <Text style={styles.resultText}>
            Прибавок с одной сторны: {results.Sfx}
          </Text>
          {results.usedIncreaseType.includes('1x2, 1x4') && (
            <>
              <Text style={styles.resultText}>1x2(одна петля на 2 ряда): {results.PR_1X2_f}</Text>
              <Text style={styles.resultText}>1x4(одна петля на 4 ряда): {results.prib_1x4_f}</Text>
            </>
          )}
          {results.usedIncreaseType.includes('1x2, 1x4, 1x1') && (
            <>
              <Text style={styles.resultText}>1x2(одна петля на 2 ряда): {results.PR_1X2_f}</Text>
              <Text style={styles.resultText}>1x4(одна петля на 4 ряда): {results.prib_1x4_f}</Text>
              <Text style={styles.resultText}>1x1(одна петля на 1 ряд): {results.prib_1x1_f}</Text>
            </>
          )}
          {results.usedIncreaseType.includes('1x2, 1x1') && (
            <>
              <Text style={styles.resultText}>1x2(одна петля на 2 ряда): {results.PR_1X2_f}</Text>
              <Text style={styles.resultText}>1x1(одна петля на 1 ряд): {results.prib_1x1_f}</Text>
            </>
          )}
          {results.usedIncreaseType.includes('1x4, 1x1') && (
            <>
              <Text style={styles.resultText}>1x4(одна петля на 4 ряда): {results.prib_1x4_f}</Text>
              <Text style={styles.resultText}>1x1(одна петля на 1 ряд): {results.prib_1x1_f}</Text>
            </>
          )}
          {results.usedIncreaseType.includes('1x2, 1x3') && (
            <>
              <Text style={styles.resultText}>1x2(одна петля на 2 ряда): {results.prib_1x2_f}</Text>
              <Text style={styles.resultText}>1x3(одна петля на 3 ряда): {results.prib_1x3_f}</Text>
            </>
          )}
          {results.usedIncreaseType.includes('1x3, 1x1') && (
            <>
              <Text style={styles.resultText}>1x3(одна петля на 3 ряда): {results.prib_1x3_f}</Text>
              <Text style={styles.resultText}>1x1(одна петля на 1 ряд): {results.prib_1x1_f}</Text>
            </>
          )}
          {results.usedIncreaseType.includes('1x1') && (
            <>
              <Text style={styles.resultText}>1x1(одна петля на 1 ряд): {results.prib_1x1_f}</Text>
            </>
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
         // round
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>
         <View style={{ marginBottom: 10, marginLeft:0,padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#A29FCF', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SFrontO+2*results.Sfx}
          </Text>
          </View>
          // round
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
//разделение на части
        <View style={styles.resultCard}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
            <Text style={styles.subtitle}>{i18n.t('parts')}</Text>
           
          </View>
          
          
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 1 }}>
          <Text style={[styles.resultText, {marginLeft: 10, fontWeight: 'bold'}]}>{i18n.t('back')}</Text>
          <View style={{width: 34, height: 17, backgroundColor: '#009FE3', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}> 
          {i18n.t('stitches')}:
          {results.SRostok}
          </Text>
          </View>

          //перед

          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20, justifyContent: 'center', marginBottom: 1 }}>
          
          <Text style={[styles.resultText, {marginLeft: 10, fontWeight: 'bold'}]}>{i18n.t('front')}</Text>
          <View style={{width: 34, height: 17, backgroundColor: '#FDCFE1', marginLeft: 10, borderWidth: 1,borderLeftWidth: 7, borderRightWidth: 7, borderTopWidth: 1, borderLeftColor: '#E76F51', borderRightColor: '#E76F51'}}></View>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}> 
          {i18n.t('stitches')}:
          {results.SFrontO + 2* results.Sfx + 2* results.SKfront}
          </Text>
          </View>
//.....
          <View style={{flexDirection: 'row', alignItems: 'top' ,justifyContent: 'center', marginBottom: 3 }} >
          
          <View style={[styles.textBox, {backgroundColor: '',flexDirection: 'row'}]}>
          <View style={{ marginBottom: 1, marginRight: 1, padding: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{width: 34, height: 17, backgroundColor: '#E76F51', borderWidth: 1}}></View>
          <Text style={[styles.resultText, {textAlign: 'center'}]}>
          {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
          {results.SKfront}
          </Text>
          </View>
          
          <View style={[styles.textBox, {backgroundColor: '#FDCFE1',justifyContent: 'center'}]}>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}>
          {i18n.t('stitches')}: {'\n'}
          {results.SFrontO + 2* results.Sfx}
          </Text>
          </View>

          <View style={{ marginBottom: 1, marginLeft: 1, padding: 1, borderRadius: 8, alignItems: 'center'}}>
          <View style={{width: 34, height: 17, backgroundColor: '#E76F51', borderWidth: 1}}></View>
          <Text style={[styles.resultText, {textAlign: 'center'}]}>
          {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
          {results.SKfront}
          </Text>
          </View>
          </View>
          </View>
//...
//рукав
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 1 }}>
          <Text style={[styles.resultText, {marginLeft: 10, fontWeight: 'bold'}]}>{i18n.t('sleeve')}</Text>
          <View style={{width: 34, height: 17, backgroundColor: '#DAEDBD', marginLeft: 10, borderWidth: 1, borderLeftWidth: 7, borderRightWidth: 7, borderTopWidth: 1, borderLeftColor: '#E76F51', borderRightColor: '#E76F51'}}></View>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}> 
          {i18n.t('stitches')}:
          {results.Sa + 2* results.Sfx + 2* results.SKa}
          </Text>
          </View>
          //...
          <View style={{flexDirection: 'row', alignItems: 'top' ,justifyContent: 'center', marginBottom: 3 }} >
          
          <View style={[styles.textBox, {backgroundColor: '',flexDirection: 'row'}]}>
          <View style={{ marginBottom: 1, marginLeft: 0, padding: 1, borderRadius: 8, alignItems: 'center'}}>
          <View style={{width: 34, height: 17, backgroundColor: '#E76F51', borderWidth: 1}}></View>
          <Text style={[styles.resultText, {textAlign: 'center'}]}>
          {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
          {results.SKa}
          </Text>
          </View>
          
          <View style={[styles.textBox, {backgroundColor: '#DAEDBD',justifyContent: 'center'}]}>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}>
          {i18n.t('stitches')}: {'\n'}
          {results.Sa + 2* results.Sfx}
          </Text>
          </View>

          <View style={{ marginBottom: 1, marginLeft: 10, padding: 1, borderRadius: 8, alignItems: 'center'}}>
          <View style={{width: 34, height: 17, backgroundColor: '#E76F51', borderWidth: 1}}></View>
          <Text style={[styles.resultText, {textAlign: 'center'}]}>
          {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
          {results.SKa}
          </Text>
          </View>
          </View>
          </View>
          
         
          
            
          
        </View>


//   отделение рукавов
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
         // round
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
          
          // round
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>

          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8, alignItems: 'center'}} >
          <View style={{width: 17, height: 17, backgroundColor: '#FF00FF', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SPodr} {'\n'}<Text style={styles.createText}>{i18n.t('create')}</Text>
          </Text>
          </View>
          // round
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>

          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center'}}>
          <Text style={styles.resultText}>
          {i18n.t('front')}
          </Text>
          <View style={{width: 17, height: 17, backgroundColor: '#CCCCCC', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SRostok}
          </Text>
         </View>
         // round
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
          // round
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

    // ИТОГИ ИТОГИ ИТОГИ

        <View style={styles.resultCard}>
          
        <Text style={[styles.subtitle, { marginBottom: 0 }]}>
         {i18n.t('Result')}
         </Text>
         <View style={styles.resultContainer}>
    <Image
      source={require('../../../assets/images/sleevbody2.png')}
      style={styles.resultImage}
     

    />
  </View>
         // корпус итоги
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>

          <Text style={[styles.resultText, {marginLeft: 10, fontWeight: 'bold'}]}>{i18n.t('corpus')}</Text>
          <View style={{width: 34, height: 17, backgroundColor: '#009FE3', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}> 
          {i18n.t('stitches')}:
          {results.SRostok *2 +results.SPodr *2}
          </Text>
          </View>
//скролл корпус
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={{flexDirection: 'row', alignItems: 'top', marginBottom: 10}}>
        

          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center',borderColor: '#009FE3',borderWidth: 1}}>
          <Text style={styles.resultText}>
          {i18n.t('back')}
          </Text>
          <View style={{width: 17, height: 17, backgroundColor: '#CCCCCC', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SRostok}
          </Text>
          
         </View>
          
          // round
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>

          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8, alignItems: 'center',borderColor: '#009FE3',borderWidth: 1}} >
          <View style={{width: 17, height: 17, backgroundColor: '#FF00FF', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SPodr} {'\n'}<Text style={styles.createText}>{i18n.t('created')}</Text>
          </Text>
          </View>
          // round
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>

          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center',borderColor: '#009FE3',borderWidth: 1}}>
          <Text style={styles.resultText}>
          {i18n.t('front')}
          </Text>
          <View style={{width: 17, height: 17, backgroundColor: '#CCCCCC', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SRostok}
          </Text>
          
         </View>
          
          // round
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>

          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8, alignItems: 'center',borderColor: '#009FE3',borderWidth: 1}} >
          <View style={{width: 17, height: 17, backgroundColor: '#FF00FF', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SPodr} {'\n'}<Text style={styles.createText}>{i18n.t('created')}</Text>
          </Text>
          </View>
         
         

          </View>

          </ScrollView>
         
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
// рукав итоги  
          <Text style={[styles.resultText, {marginLeft: 10, fontWeight: 'bold'}]}>{i18n.t('sleeve')}</Text>
          <View style={{width: 34, height: 17, backgroundColor: '#95C11F', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={[styles.resultText, {textAlign: 'center', marginLeft: 10}]}> 
          {i18n.t('stitches')}:
          {results.Sa + 2* results.Sfx + 2* results.SKa + results.SPodr + results.NRostok *0.5}
          </Text>
          </View>
//скролл рукав
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={{flexDirection: 'row', alignItems: 'top', marginBottom: 10}}>
        

         <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center',borderColor: '#95C11F',borderWidth: 1}} >
         <View style={styles.textBox}>
         <Text style={styles.textInsideBox}>
          {i18n.t('separateTheSleeve')}</Text>
          </View>

          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.Sa+2*results.Sfx +2*results.SKa}
          </Text>

          </View>
          
          // round
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>

          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8, alignItems: 'center',borderColor: '#95C11F',borderWidth: 1}} >
          <View style={{width: 17, height: 17, backgroundColor: '#FF00FF', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.SPodr} {'\n'}<Text style={styles.createText}>{i18n.t('create')}</Text>
          </Text>
          </View>
          // round
         <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
         <View style={{width: 17, height: 17, borderRadius: 8 , marginLeft: 0, borderWidth:2, borderColor: '#CCCCCC'}}></View>
          </View>

          <View style={{ marginBottom: 10, marginLeft: 0, padding: 5, backgroundColor: '#E6E6E6', borderRadius: 8,alignItems: 'center',borderColor: '#95C11F',borderWidth: 1}}>
          
          <View style={{width: 17, height: 17, backgroundColor: '#009FE3', marginLeft: 10, borderWidth: 1}}></View>
          <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.NRostok *0.5} {'\n'}<Text style={styles.createText}>{i18n.t('create')}</Text>
          </Text>
         </View>
         
         

          </View>

          </ScrollView>










          
          </View>

      </ScrollView>
      
  //ПАНЕЛЬ
  
      
     <View style={[styles.stickyButtonContainer, { bottom: tabBarHeight }]}>
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
    // paddingBottom: 100,
  },
  stickyButtonContainer: {
    position: 'absolute',
    // bottom: tabBarHeight,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 30,
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
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
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
    borderColor: '#000', // Цвет рамки
    padding: 3, // Внутренний отступ
    borderRadius: 5, // Скругление углов
    marginBottom: 3, // Отступ снизу
  },
  textInsideBox: {
    fontSize: 12,
    color: '#000', // Цвет текста
  },
  createText: {
    fontSize: 12,
    color: '#000', // Цвет текста
   textAlign: 'center',
  },
  resultContainer: {
    width: '100%', // Ширина контейнера равна ширине экрана
    justifyContent: 'center',
    alignItems: 'top',
  },
  resultImage: {
    width: '100%', // Масштабируется по ширине контейнера
   aspectRatio: 1, // Устанавливает соотношение сторон изображения
   height: undefined,
    resizeMode: 'contain', // Сохраняет пропорции изображения
  },
  
  
}); 
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

export default observer(() => {
  const router = useRouter();
  const results = introState.calculateRaglan();
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const currentLanguage = onboardingState.language;
  const tabBarHeight = useBottomTabBarHeight();

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
              source={require('../../../assets/images/raglan.svg')}
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
            <Text style={styles.subtitle}>Резинка</Text>
            <View style={{width: 17, height: 17, backgroundColor: 'yellow', marginLeft: 10, borderWidth: 1}}></View>
          </View>
          <Text style={styles.resultText}>
            Всего петель: {results.SO}
          </Text>
          <Text style={styles.resultText}>
            Петли спереди и сзади: {results.SFrontO}
          </Text>
          <Text style={styles.resultText}>
            Петли рукавов: {results.Sa}
          </Text>
          <Text style={styles.resultText}>
            Петли на линиях реглана: {results.K}
          </Text>
        </View>

        <View style={styles.resultCard}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
            <Text style={styles.subtitle}>Перед / спина / рукав</Text>
            <View style={{width: 17, height: 17, backgroundColor: 'pink', marginLeft: 10, borderWidth: 1}}></View>
            <View style={{width: 17, height: 17, backgroundColor: 'purple', marginLeft: 5, borderWidth: 1}}></View>
            <View style={{width: 17, height: 17, backgroundColor: 'green', marginLeft: 5, borderWidth: 1}}></View>

          </View>
          <Text style={styles.resultText}>
            Рядов: {results.NHFront}
          </Text>
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
        <View style={styles.resultCard}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
            <Text style={styles.subtitle}>Линия реглана</Text>
            <View style={{width: 17, height: 17, backgroundColor: 'orange', marginLeft: 10, borderWidth: 1}}></View>
          </View>
          <Text style={styles.resultText}>
            Длина линии реглана: {results.NHFront}
          </Text>
          <Text style={styles.resultText}>
            Длина дополнения к линии реглана: {results.NRostok}
          </Text>
          <Text style={styles.resultText}>
            Ширина дополнения к линии реглана: {results.NRostok}
          </Text>
        </View>
      </ScrollView>
      
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
}); 
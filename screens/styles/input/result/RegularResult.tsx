import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import introState from '@/state/introState';
import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { computeRegularIncreasePrecompute } from './useRegularIncreasePrecompute';
import { useRegularResultScroll } from './useRegularResultScroll';
import RegularResultCarousel from './RegularResultCarousel';
import RegularResultSummary from './RegularResultSummary';
import Step1Ribbing from './Step1Ribbing';
import Step2AddingStitches from './Step2AddingStitches';
import Step3BackLengthening from './Step3BackLengthening';
import Step4SeparatingSleeves from './Step4SeparatingSleeves';
import { Colors } from '@/constants/Colors';
import SampleMeasurementsBanner from '@/components/SampleMeasurementsBanner';

export default observer(() => {
  const navigation = useNavigation();
  const results = introState.calculateRaglan();
  const tabBarHeight = useBottomTabBarHeight();
  const {
    scrollViewRef,
    carouselRef,
    step3Y,
    currentIndex,
    handleScrollToTop,
    handleScrollToTop1,
    handleScrollToStep3,
    handleCarouselScroll,
  } = useRegularResultScroll();

  useEffect(() => {
    void introState.syncRaglanFromSupabase();
  }, [
    introState.headCircumference,
    introState.neckCircumference,
    introState.chestCircumference,
    introState.stitchDensity,
    introState.rowDensity,
    introState.fitType,
    introState.ribbingWidth,
    introState.ribbingWidthV,
    introState.raglanLineWidth,
    introState.raglanLineWidthV,
  ]);

  const handleBackToHome = () => {
    introState.setAwaitingStyleChoice(false);
    introState.setStyleChoiceMode(null);
    (navigation as any).navigate('StylesHome');
  };

  if (typeof results === 'string') {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{results}</Text>
        <TouchableOpacity style={styles.button} onPress={handleBackToHome}>
          <Text style={styles.buttonText}>{i18n.t('goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { resultString24, resultString23, resultString21, resultString43 } =
    computeRegularIncreasePrecompute(results);

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="dark" />
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 100 }]}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
          <Text style={styles.backButtonText}>← {i18n.t('back')}</Text>
        </TouchableOpacity>
        <SampleMeasurementsBanner collapsible />

        <RegularResultCarousel
          carouselRef={carouselRef}
          currentIndex={currentIndex}
          onCarouselScroll={handleCarouselScroll}
          onStep3Press={handleScrollToStep3}
        />

        <Step1Ribbing results={results} />
        <Step2AddingStitches
          results={results}
          resultString24={resultString24}
          resultString23={resultString23}
          resultString21={resultString21}
          resultString43={resultString43}
        />

        <View
          onLayout={(e) => {
            step3Y.current = e.nativeEvent.layout.y;
          }}
          collapsable={false}
        >
          <Step3BackLengthening
            results={results}
            handleScrollToTop1={handleScrollToTop1}
            handleScrollToTop={handleScrollToTop}
          />
        </View>

        <Step4SeparatingSleeves results={results} handleScrollToTop1={handleScrollToTop1} />

        <RegularResultSummary results={results} />
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  error: {
    fontSize: 18,
    color: '#FF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors['light'].tint,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.light.tint,
    fontWeight: '500',
  },
});

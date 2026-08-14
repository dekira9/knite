import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import introState from '@/state/introState';
import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { computeRegularIncreasePrecompute } from './useRegularIncreasePrecompute';
import { useRegularResultScroll } from './useRegularResultScroll';
import RegularResultCarousel from './RegularResultCarousel';
import RegularResultSummary from './RegularResultSummary';
import ResultParamsLegendPanel from './ResultParamsLegendPanel';
import Step1Ribbing from './Step1Ribbing';
import Step2AddingStitches from './Step2AddingStitches';
import Step3BackLengthening from './Step3BackLengthening';
import Step4SeparatingSleeves from './Step4SeparatingSleeves';
import ResultClosingBanner from './ResultClosingBanner';
import { Colors } from '@/constants/Colors';
export default observer(() => {
  const navigation = useNavigation();
  const results = introState.calculateRaglan();
  const {
    scrollViewRef,
    carouselRef,
    partsAnchorRef,
    currentIndex,
    onCarouselAnchorLayout,
    onMainScroll,
    handleScrollToTop,
    handleScrollToTop1,
    handleScrollToParts,
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
    introState.garmentFitFor,
    introState.ribbingWidth,
    introState.ribbingWidthV,
    introState.raglanLineWidth,
    introState.raglanLineWidthV,
  ]);

  const handleBackToProjects = () => {
    introState.setAwaitingStyleChoice(false);
    introState.setStyleChoiceMode(null);
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: 'StylesHome' }, { name: 'MyProjects' }],
      }),
    );
  };

  if (typeof results === 'string') {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{results}</Text>
        <TouchableOpacity style={styles.button} onPress={handleBackToProjects}>
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
        contentContainerStyle={styles.scrollContent}
        onScroll={onMainScroll}
        scrollEventThrottle={16}
      >
        <Text style={styles.planTitle}>{i18n.t('knittingPlan')}</Text>
        <ResultParamsLegendPanel variant="regular" />

        <View onLayout={onCarouselAnchorLayout}>
          <RegularResultCarousel
            carouselRef={carouselRef}
            currentIndex={currentIndex}
            onCarouselScroll={handleCarouselScroll}
            onPlanImagePress={handleScrollToParts}
          />
        </View>

        <Step1Ribbing results={results} />
        <Step2AddingStitches
          results={results}
          resultString24={resultString24}
          resultString23={resultString23}
          resultString21={resultString21}
          resultString43={resultString43}
        />

        <Step3BackLengthening
          results={results}
          handleScrollToTop1={handleScrollToTop1}
          handleScrollToTop={handleScrollToTop}
          partsAnchorRef={partsAnchorRef}
        />

        <Step4SeparatingSleeves results={results} handleScrollToTop1={handleScrollToTop1} />

        <RegularResultSummary results={results} />

        <ResultClosingBanner />
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
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 40,
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
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
    color: '#222',
  },
});

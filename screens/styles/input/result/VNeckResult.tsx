import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { computeVNeckIncreasePrecompute } from './useVNeckIncreasePrecompute';
import { useRegularResultScroll } from './useRegularResultScroll';
import VNeckResultCarousel from './VNeckResultCarousel';
import Step1RibbingV from './Step1RibbingV';
import Step2AddingStitchesV from './Step2AddingStitchesV';
import Step3BackLengtheningV from './Step3BackLengtheningV';
import Step4SeparatingSleevesV from './Step4SeparatingSleevesV';
import ResultStepV from './ResultStepV';
import ResultParamsLegendPanel from './ResultParamsLegendPanel';
import ResultClosingBanner from './ResultClosingBanner';
import { Colors } from '@/constants/Colors';
export default observer(function VNeckResult() {
  const navigation = useNavigation();
  const results = introState.calculateRaglan();
  const tabBarHeight = useBottomTabBarHeight();
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
    introState.depthNeckV,
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

  const precompute = computeVNeckIncreasePrecompute(results, {
    NRrezV: introState.NRrezV,
    SpribVcorn: introState.SpribVcorn,
    RowPribRV1: introState.RowPribRV1,
    RowPribRVz: introState.RowPribRVz,
    RowPribRV2: introState.RowPribRV2,
    RowPribRV3: introState.RowPribRV3,
  });

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 100 }]}
        onScroll={onMainScroll}
        scrollEventThrottle={16}
      >
        <Text style={styles.planTitle}>{i18n.t('knittingPlan')}</Text>
        <ResultParamsLegendPanel variant="v-neck" />

        <View onLayout={onCarouselAnchorLayout}>
          <VNeckResultCarousel
            carouselRef={carouselRef}
            currentIndex={currentIndex}
            onCarouselScroll={handleCarouselScroll}
            onPlanImagePress={handleScrollToParts}
          />
        </View>

        <Step1RibbingV
          results={results}
          NRrezV={introState.NRrezV}
          SpribVcorn={introState.SpribVcorn}
          resultStringV01={precompute.resultStringV01}
          resultStringV11={precompute.resultStringV11}
          resultStringV12={precompute.resultStringV12}
          resultStringV22={precompute.resultStringV22}
          resultStringV23={precompute.resultStringV23}
        />

        <Step2AddingStitchesV
          results={results}
          resultString24V={precompute.resultString24V}
          resultString23V={precompute.resultString23V}
          resultString21V={precompute.resultString21V}
          resultString43V={precompute.resultString43V}
          RowPrib1x4StringV={precompute.RowPrib1x4StringV}
          RowPrib1x3StringV={precompute.RowPrib1x3StringV}
          RowPrib1x2StringV={precompute.RowPrib1x2StringV}
          RowPrib1x1StringV={precompute.RowPrib1x1StringV}
          handleScrollToTop1={handleScrollToTop1}
        />

        <Step3BackLengtheningV
          results={results}
          handleScrollToTop1={handleScrollToTop1}
          handleScrollToTop={handleScrollToTop}
          partsAnchorRef={partsAnchorRef}
        />

        <Step4SeparatingSleevesV results={results} handleScrollToTop1={handleScrollToTop1} />

        <ResultStepV results={results} />

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
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
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
  error: {
    fontSize: 18,
    color: '#FF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
});

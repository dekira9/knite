import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { calculateIncreaseRows1x2_1x4, calculateIncreaseRows1x2_1x3, calculateIncreaseRows1x2_1x1, calculateIncreaseRows1x4_1x3 } from './helpers';
import Step1Ribbing from './Step1Ribbing';
import Step2AddingStitches from './Step2AddingStitches';
import Step3BackLengthening from './Step3BackLengthening';
import Step4SeparatingSleeves from './Step4SeparatingSleeves';
import { Colors } from '@/constants/Colors';

export default observer(() => {
  const navigation = useNavigation();
  const results = introState.calculateRaglan();
  const scrollViewRef = useRef<ScrollView>(null);
  const carouselRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const { PozB, RowB, RowN, RowA, RowPrib1x2_1x4, resultString24 } = calculateIncreaseRows1x2_1x4(
    results.NHFront,
    results.Sfx,
    results.PR_1x4_f,
    results.PR_1x2_f
  );
  const { PozD, RowD, RowA23, RowPrib1x2_1x3, resultString23 } = calculateIncreaseRows1x2_1x3(
    results.NHFront,
    results.Sfx,
    results.prib_1x3_f,
    results.prib_1x2_f
  );
  const { PozC, RowC, RowN21, RowA21, RowPrib1x2_1x1, resultString21 } =
    calculateIncreaseRows1x2_1x1(
      results.NHFront,
      results.Sfx,
      results.prib_1x1_f,
      results.prib_1x2_f
    );
  const { PozM, RowM, RowN43, RowA43, RowPRib1x4_1x3, resultString43 } =
    calculateIncreaseRows1x4_1x3(
      results.NHFront,
      results.Sfx,
      results.PRib_1x4_f,
      results.PRib_1x3_f
    );

  const handleScrollToTop = () => {
    {
      /* Scroll to top*/
    }
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });

    {
      /* Scroll carousel to planVaz3.png (index 1)*/
    }
    setTimeout(() => {
      const slideSize = Dimensions.get('window').width - 40;
      carouselRef.current?.scrollTo({ x: slideSize * 1, animated: true });
      setCurrentIndex(1);
      {
        /* Update current index to match*/
      }
    }, 100);
    {
      /* Small delay to ensure vertical scroll completes first*/
    }
  };

  if (typeof results === 'string') {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{results}</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>{i18n.t('goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const handleScrollToTop1 = () => {
    {/*// Scroll to top*/ }
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    {/* Scroll carousel to planOaz1.png (index 0)*/}
    setTimeout(() => {
      const slideSize = Dimensions.get('window').width - 40;
      carouselRef.current?.scrollTo({ x: slideSize * 0, animated: true });
      setCurrentIndex(0);   {/* Update current index to match*/}
    }, 100); {/* Small delay to ensure vertical scroll completes first*/}
  };

  const handleSelectNewStyle = () => {
    introState.setIntroFinished(false);
    navigation.navigate('Styles');
  };

  return (
    <View style={[styles.mainContainer]}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 100 }]}
      >
        <TouchableOpacity style={styles.newStyleButton} onPress={handleSelectNewStyle}>
          <Text style={styles.newStyleButtonText}>Новый проект</Text>
        </TouchableOpacity>
        <ScrollView
          ref={carouselRef}
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
              source={require('../../../../../assets/images/planOaz1.png')}
              style={styles.slideImage}
              contentFit="contain"
            />
          </View>

          <View style={styles.slideContainer}>
            <Image
              source={require('../../../../../assets/images/planOaz3.png')}
              style={styles.slideImage}
              contentFit="contain"
            />
          </View>

          <View style={styles.slideContainer}>
            <Image
              source={require('../../../../../assets/images/regular-collar.png')}
              style={styles.slideImage}
              contentFit="contain"
            />
          </View>
        </ScrollView>

        <View style={styles.pagination}>
          {[0, 1, 2].map((index) => (
            <View
              key={index}
              style={[styles.paginationDot, currentIndex === index && styles.paginationDotActive]}
            />
          ))}
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
        />

        <Step4SeparatingSleeves 
          results={results} 
          handleScrollToTop1={handleScrollToTop1}
        />

        {/* ИТОГИ ИТОГИ ИТОГИ*/}

        <View style={styles.resultCard}>
          <Text style={[styles.subtitle, { marginBottom: 0 }]}>{i18n.t('Result')}</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
            <View style={styles.resultContainer}>
              <Image
                source={require('../../../../../assets/images/sleevebodyO.png')}
                style={styles.resultImage}
              />
            </View>
          </ScrollView>
          {/* корпус итоги*/}
          <View style={styles.resultHeaderRow}>
            <Text style={[styles.resultText, styles.resultTextBold]}>
              {i18n.t('corpus')}
            </Text>
            <View style={styles.blueIndicatorLarge}></View>
            <Text style={[styles.resultText, styles.resultTextCentered]}>
              {i18n.t('stitches')}:{results.SRostok * 2 + results.SPodr * 2}
            </Text>
          </View>
          {/*скролл корпус*/}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
            <View style={styles.separatingLayout}>
              <View style={styles.resultScrollBox}>
                <Text style={styles.resultText}>{i18n.t('back')}</Text>
                <View style={styles.smallGrayIndicator}></View>
                <View style={styles.smallBlueIndicator}></View>
                <Text style={styles.resultText}>
                  {i18n.t('stitches')}: {results.SRostok}
                </Text>
              </View>

              {/*  round*/}
              <View style={styles.roundIndicator}>
                <View style={styles.roundDot}></View>
              </View>

              <View style={styles.resultScrollBox}>
                <View style={styles.smallPinkIndicator}></View>
                <View style={styles.smallBlueIndicator}></View>
                <Text style={styles.resultText}>
                  {i18n.t('stitches')}: {results.SPodr} {'\n'}
                  <Text style={styles.createText}>{i18n.t('underarmStitches')}</Text>
                </Text>
              </View>
              {/*  round*/}
              <View style={styles.roundIndicator}>
                <View style={styles.roundDot}></View>
              </View>

              <View style={styles.resultScrollBox}>
                <Text style={styles.resultText}>{i18n.t('front')}</Text>
                <View style={styles.smallGrayIndicator}></View>
                <View style={styles.smallBlueIndicator}></View>
                <Text style={styles.resultText}>
                  {i18n.t('stitches')}: {results.SRostok}
                </Text>
              </View>

              {/*  round*/}
              <View style={styles.roundIndicator}>
                <View style={styles.roundDot}></View>
              </View>

              <View style={styles.resultScrollBox}>
                <View style={styles.smallPinkIndicator}></View>
                <View style={styles.smallBlueIndicator}></View>
                <Text style={styles.resultText}>
                  {i18n.t('stitches')}: {results.SPodr} {'\n'}
                  <Text style={styles.createText}>{i18n.t('underarmStitches')}</Text>
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.resultHeaderRow}>
            {/* рукав итоги*/}
            <Text style={[styles.resultText, styles.resultTextBold]}>
              {i18n.t('sleeve')}
            </Text>
            <View style={styles.greenIndicatorLarge}></View>
            <Text style={[styles.resultText, styles.resultTextCentered]}>
              {i18n.t('stitches')}:
              {results.Sa +
                2 * results.Sfx +
                2 * results.SKa +
                results.SPodr +
                results.NRostok * 0.5}
            </Text>
          </View>
          {/*скролл рукав*/}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
            <View style={styles.separatingLayout}>
              <View style={styles.sleeveBox}>
                <View style={styles.textBox}>
                  <Text style={styles.textInsideBox}>{i18n.t('sleeve')}</Text>
                </View>

                <Text style={styles.resultText}>
                  {i18n.t('stitches')}: {results.Sa + 2 * results.Sfx + 2 * results.SKa}
                </Text>
              </View>
              {/*  round*/}
              <View style={styles.roundIndicator}>
                <View style={styles.roundDot}></View>
              </View>

              <View style={styles.sleeveBox}>
                <View style={styles.indicatorRow}>
                  <View style={styles.smallGrayIndicatorVertical}></View>
                  <View style={styles.smallGreenIndicator}></View>
                </View>
                <Text style={styles.resultText}>
                  {i18n.t('stitches')}: {results.NRostok * 0.5} </Text>
                  <Text style={styles.createText}>{i18n.t('create')}</Text>
                  <Text style={styles.createText}>{i18n.t('fromTheBack') || 'fromTheBack'}</Text>
                
              </View>

              {/*  round*/}
              <View style={styles.roundIndicator}>
                <View style={styles.roundDot}></View>
              </View>

              <View style={styles.sleeveBox}>
                <View style={styles.smallGreenIndicatorHorizontal}></View>
                <View style={styles.smallPinkIndicator}></View>
                <Text style={styles.resultText}>
                  {i18n.t('stitches')}: {results.SPodr} {'\n'}
                  <Text style={styles.createText}>{i18n.t('create')}</Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
});

// Color constants matching Step1 and Step2
const COLORS = {
  PURPLE: '#A29FCF',
  PINK: '#FDCFE1',
  GREEN: '#DAEDBD',
  GRAY: '#E6E6E6',
  PRIMARY: Colors['light'].tint,
  WHITE: '#ffffff',
  BLACK: '#000',
  TEXT_PRIMARY: '#1A1A1A',
  TEXT_SECONDARY: '#6b7280',
  BACKGROUND: '#F8F9FA',
  DIVIDER: '#CCCCCC',
  BLUE: '#009FE3',
  YELLOW: '#FFD700',
  RED: '#FF4444',
  ORANGE: '#E76F51',
};

const styles = StyleSheet.create({
  // Main layout styles
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    padding: 16,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.WHITE,
  },
  
  // Card and content styles - updated to match Step1/Step2
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
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center' as const,
    color: COLORS.TEXT_PRIMARY,
  },
  
  // Error and button styles - updated to match Step1/Step2
  error: {
    fontSize: 18,
    color: COLORS.RED,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Carousel styles
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
    backgroundColor: COLORS.DIVIDER,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  
  // Text box styles
  textBox: {
    borderWidth: 1,
    borderColor: COLORS.BLACK,
    padding: 3,
    borderRadius: 5,
    marginBottom: 3,
  },
  textInsideBox: {
    fontSize: 12,
    color: COLORS.TEXT_PRIMARY,
  },
  createText: {
    fontSize: 12,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  
  // Result section styles
  resultContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  resultImage: {
    width: '100%',
    aspectRatio: 2,
    height: undefined,
    resizeMode: 'contain',
    padding: 150,
  },
  separatingLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  resultScrollBox: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: COLORS.GRAY,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: COLORS.BLUE,
    borderWidth: 1,
  },
  
  // Indicator styles - updated to match Step1/Step2 design
  smallBlueIndicator: {
    width: 17,
    height: 17,
    backgroundColor: COLORS.BLUE,
    marginLeft: 10,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  roundIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  roundDot: {
    width: 17,
    height: 17,
    borderRadius: 8,
    marginLeft: 0,
    borderWidth: 2,
    borderColor: COLORS.DIVIDER,
  },
  
  // New style button
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
  
  // Inline styles converted to named styles
  resultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  resultTextBold: {
    marginLeft: 10,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  resultTextCentered: {
    textAlign: 'center',
    marginLeft: 10,
    color: COLORS.TEXT_PRIMARY,
  },
  blueIndicatorLarge: {
    width: 34,
    height: 17,
    backgroundColor: COLORS.BLUE,
    marginLeft: 10,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  greenIndicatorLarge: {
    width: 34,
    height: 17,
    backgroundColor: '#95C11F',
    marginLeft: 10,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  smallGrayIndicator: {
    width: 17,
    height: 8,
    backgroundColor: COLORS.DIVIDER,
    marginLeft: 10,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  smallPinkIndicator: {
    width: 17,
    height: 8,
    backgroundColor: '#FF00FF',
    marginLeft: 10,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  sleeveBox: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: COLORS.GRAY,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#95C11F',
    borderWidth: 1,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallGrayIndicatorVertical: {
    width: 8,
    height: 17,
    backgroundColor: COLORS.DIVIDER,
    marginLeft: 0,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  smallGreenIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#95C11F',
    marginLeft: 0,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  smallGreenIndicatorHorizontal: {
    width: 17,
    height: 17,
    backgroundColor: '#95C11F',
    marginLeft: 10,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  smallPinkIndicatorHorizontal: {
    width: 17,
    height: 8,
    backgroundColor: '#FF00FF',
    marginLeft: 10,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
});

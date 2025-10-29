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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 1,
            }}
          >
            <Text style={[styles.resultText, { marginLeft: 10, fontWeight: 'bold' }]}>
              {i18n.t('corpus')}
            </Text>
            <View
              style={{
                width: 34,
                height: 17,
                backgroundColor: '#009FE3',
                marginLeft: 10,
                borderWidth: 1,
              }}
            ></View>
            <Text style={[styles.resultText, { textAlign: 'center', marginLeft: 10 }]}>
              {i18n.t('stitches')}:{results.SRostok * 2 + results.SPodr * 2}
            </Text>
          </View>
          {/*скролл корпус*/}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
            <View style={styles.separatingLayout}>
              <View style={styles.resultScrollBox}>
                <Text style={styles.resultText}>{i18n.t('back')}</Text>
                <View
                  style={{
                    width: 17,
                    height: 8,
                    backgroundColor: '#CCCCCC',
                    marginLeft: 10,
                    borderWidth: 1,
                  }}
                ></View>
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
                <View
                  style={{
                    width: 17,
                    height: 8,
                    backgroundColor: '#FF00FF',
                    marginLeft: 10,
                    borderWidth: 1,
                  }}
                ></View>
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
                <View
                  style={{
                    width: 17,
                    height: 8,
                    backgroundColor: '#CCCCCC',
                    marginLeft: 10,
                    borderWidth: 1,
                  }}
                ></View>
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
                <View
                  style={{
                    width: 17,
                    height: 8,
                    backgroundColor: '#FF00FF',
                    marginLeft: 10,
                    borderWidth: 1,
                  }}
                ></View>
                <View style={styles.smallBlueIndicator}></View>
                <Text style={styles.resultText}>
                  {i18n.t('stitches')}: {results.SPodr} {'\n'}
                  <Text style={styles.createText}>{i18n.t('underarmStitches')}</Text>
                </Text>
              </View>
            </View>
          </ScrollView>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 1,
            }}
          >
            {/* рукав итоги*/}
            <Text style={[styles.resultText, { marginLeft: 10, fontWeight: 'bold' }]}>
              {i18n.t('sleeve')}
            </Text>
            <View
              style={{
                width: 34,
                height: 17,
                backgroundColor: '#95C11F',
                marginLeft: 10,
                borderWidth: 1,
              }}
            ></View>
            <Text style={[styles.resultText, { textAlign: 'center', marginLeft: 10 }]}>
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
              <View
                style={{
                  marginBottom: 10,
                  marginLeft: 0,
                  padding: 5,
                  backgroundColor: '#E6E6E6',
                  borderRadius: 8,
                  alignItems: 'center',
                  borderColor: '#95C11F',
                  borderWidth: 1,
                }}
              >
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

              <View
                style={{
                  marginBottom: 10,
                  marginLeft: 0,
                  padding: 5,
                  backgroundColor: '#E6E6E6',
                  borderRadius: 8,
                  alignItems: 'center',
                  borderColor: '#95C11F',
                  borderWidth: 1,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      width: 8,
                      height: 17,
                      backgroundColor: '#CCCCCC',
                      marginLeft: 0,
                      borderWidth: 1,
                    }}
                  ></View>
                  <View
                    style={{
                      width: 17,
                      height: 17,
                      backgroundColor: '#95C11F',
                      marginLeft: 0,
                      borderWidth: 1,
                    }}
                  ></View>
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

              <View
                style={{
                  marginBottom: 10,
                  marginLeft: 0,
                  padding: 5,
                  backgroundColor: '#E6E6E6',
                  borderRadius: 8,
                  alignItems: 'center',
                  borderColor: '#95C11F',
                  borderWidth: 1,
                }}
              >
                <View
                  style={{
                    width: 17,
                    height: 17,
                    backgroundColor: '#95C11F',
                    marginLeft: 10,
                    borderWidth: 1,
                  }}
                ></View>
                <View
                  style={{
                    width: 17,
                    height: 8,
                    backgroundColor: '#FF00FF',
                    marginLeft: 10,
                    borderWidth: 1,
                  }}
                ></View>
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
    backgroundColor: '#fff',
  },
  resultCard: {
    backgroundColor: '#f1f1f1',
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
  textStep: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1A1A1A',
  },
  // Common layout styles
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
    width: '100%',
  },
  textCenter: {
    textAlign: 'center',
  },
  ribbingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  knittingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  startRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  horizontalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  marginLeft10: {
    marginLeft: 10,
  },
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  purpleIndicatorLarge: {
    width: 34,
    height: 17,
    backgroundColor: '#A29FCF',
    marginLeft: 10,
    borderWidth: 1,
  },
  // Indicator styles
  yellowIndicator: {
    width: 17,
    height: 17,
    backgroundColor: 'yellow',
    marginLeft: 10,
    borderWidth: 1,
  },
  redIndicator: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: 'red',
    marginLeft: 10,
    borderWidth: 1,
  },
  orangeIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#E76F51',
    marginLeft: 10,
    borderWidth: 1,
  },
  purpleIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#A29FCF',
    marginLeft: 10,
    borderWidth: 1,
  },
  greenIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#DAEDBD',
    marginLeft: 10,
    borderWidth: 1,
  },
  pinkIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#FDCFE1',
    marginLeft: 10,
    borderWidth: 1,
  },
  // Box styles
  stitchBox: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    alignItems: 'center',
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
    borderColor: '#CCCCCC',
  },
  // Section styles
  section: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    alignItems: 'center',
  },
  // Arrow styles
  arrowContainer: {
    marginBottom: 1,
    marginLeft: 0,
    padding: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  arrowRight: {
    width: 34,
    height: 14,
    borderTopWidth: 8.5,
    borderLeftWidth: 17,
    borderRightWidth: 17,
    borderBottomWidth: 8.5,
    padding: -17,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: '#A29FCF',
    borderBottomColor: '#A29FCF',
  },
  arrowLeft: {
    width: 34,
    height: 14,
    marginLeft: 0,
    borderTopWidth: 8.5,
    borderLeftWidth: 17,
    borderRightWidth: 17,
    borderBottomWidth: 8.5,
    padding: -17,
    borderTopColor: 'transparent',
    borderLeftColor: '#A29FCF',
    borderRightColor: 'transparent',
    borderBottomColor: '#A29FCF',
  },
  arrowRightPink: {
    width: 34,
    height: 14,
    borderTopWidth: 8.5,
    borderLeftWidth: 17,
    borderRightWidth: 17,
    borderBottomWidth: 8.5,
    padding: -17,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: '#FDCFE1',
    borderBottomColor: '#FDCFE1',
  },
  arrowLeftPink: {
    width: 34,
    height: 14,
    marginLeft: 0,
    borderTopWidth: 8.5,
    borderLeftWidth: 17,
    borderRightWidth: 17,
    borderBottomWidth: 8.5,
    padding: -17,
    borderTopColor: 'transparent',
    borderLeftColor: '#FDCFE1',
    borderRightColor: 'transparent',
    borderBottomColor: '#FDCFE1',
  },
  arrowRightGreen: {
    width: 34,
    height: 14,
    borderTopWidth: 8.5,
    borderLeftWidth: 17,
    borderRightWidth: 17,
    borderBottomWidth: 8.5,
    padding: -17,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: '#DAEDBD',
    borderBottomColor: '#DAEDBD',
  },
  arrowLeftGreen: {
    width: 34,
    height: 14,
    marginLeft: 10,
    borderTopWidth: 8.5,
    borderLeftWidth: 17,
    borderRightWidth: 17,
    borderBottomWidth: 8.5,
    padding: -17,
    borderTopColor: 'transparent',
    borderLeftColor: '#DAEDBD',
    borderRightColor: 'transparent',
    borderBottomColor: '#DAEDBD',
  },
  // Color indicators
  blueIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#009FE3',
    marginLeft: 10,
    borderWidth: 1,
  },
  blueIndicatorLarge: {
    width: 34,
    height: 17,
    backgroundColor: '#009FE3',
    marginLeft: 10,
    borderWidth: 1,
  },
  pinkIndicatorLarge: {
    width: 34,
    height: 17,
    backgroundColor: '#FDCFE1',
    marginLeft: 10,
    borderWidth: 1,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 1,
    borderLeftColor: '#E76F51',
    borderRightColor: '#E76F51',
  },
  greenIndicatorLarge: {
    width: 34,
    height: 17,
    backgroundColor: '#DAEDBD',
    marginLeft: 10,
    borderWidth: 1,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 1,
    borderLeftColor: '#E76F51',
    borderRightColor: '#E76F51',
  },
  greenIndicatorFinal: {
    width: 34,
    height: 17,
    backgroundColor: '#95C11F',
    marginLeft: 10,
    borderWidth: 1,
  },
  // Separator styles
  separatorBox: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    alignItems: 'center',
  },
  separatorBoxWithBorder: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#009FE3',
    borderWidth: 1,
  },
  separatorBoxGreen: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#95C11F',
    borderWidth: 1,
  },
  // Small indicators
  smallGrayIndicator: {
    width: 17,
    height: 8,
    backgroundColor: '#CCCCCC',
    marginLeft: 10,
    borderWidth: 1,
  },
  smallPinkIndicator: {
    width: 17,
    height: 8,
    backgroundColor: '#FF00FF',
    marginLeft: 10,
    borderWidth: 1,
  },
  smallBlueIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#009FE3',
    marginLeft: 10,
    borderWidth: 1,
  },
  smallGreenIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#95C11F',
    marginLeft: 10,
    borderWidth: 1,
  },
  smallGreenIndicatorFinal: {
    width: 17,
    height: 8,
    backgroundColor: '#FF00FF',
    marginLeft: 10,
    borderWidth: 1,
  },
  // Mixed indicators
  mixedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallGrayIndicatorVertical: {
    width: 8,
    height: 17,
    backgroundColor: '#CCCCCC',
    marginLeft: 0,
    borderWidth: 1,
  },
  smallGreenIndicatorVertical: {
    width: 17,
    height: 17,
    backgroundColor: '#95C11F',
    marginLeft: 0,
    borderWidth: 1,
  },
  // Additional layout styles
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 3,
  },
  arrowContainerSmall: {
    marginBottom: 1,
    marginLeft: 0,
    padding: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  arrowContainerWithMargin: {
    marginBottom: 1,
    marginLeft: 10,
    padding: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  // Step 3 styles
  step3Header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
    width: '100%',
  },
  backLengtheningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backLengtheningInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backLengtheningKnitting: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backLengtheningStart: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  // Parts section styles
  partsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  planImage: {
    width: 30,
    height: 30,
  },
  planText: {
    marginLeft: 5,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  // Back section
  backSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  backSectionBold: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  backSectionText: {
    textAlign: 'center',
    marginLeft: 10,
  },
  // Front section
  frontSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
    marginBottom: 1,
  },
  frontSectionBold: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  frontSectionText: {
    textAlign: 'center',
    marginLeft: 10,
  },
  // Front parts layout
  frontPartsLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 3,
  },
  frontPartsContainer: {
    flexDirection: 'row',
  },
  frontPartsItem: {
    marginBottom: 1,
    marginRight: 1,
    padding: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frontPartsItemWithMargin: {
    marginBottom: 1,
    marginLeft: 1,
    padding: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  frontPartsText: {
    textAlign: 'center',
  },
  frontPartsTextWithMargin: {
    textAlign: 'center',
    marginLeft: 5,
  },
  // Sleeve section
  sleeveSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 1,
  },
  sleeveSectionBold: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  sleeveSectionText: {
    textAlign: 'center',
    marginLeft: 10,
  },
  // Sleeve parts layout
  sleevePartsLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 3,
  },
  sleevePartsContainer: {
    flexDirection: 'row',
  },
  sleevePartsItem: {
    marginBottom: 1,
    marginLeft: 0,
    padding: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  sleevePartsItemWithMargin: {
    marginBottom: 1,
    marginLeft: 0,
    padding: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  sleevePartsText: {
    textAlign: 'center',
  },
  sleevePartsTextWithMargin: {
    textAlign: 'center',
    marginLeft: 5,
  },
  // Step 4 styles
  step4Header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
    width: '100%',
  },
  separatingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  separatingStart: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  separatingRows: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  separatingLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  separatingBox: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    alignItems: 'center',
  },
  separatingBoxWithText: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    alignItems: 'center',
  },
  separatingText: {
    fontSize: 12,
    color: '#000',
  },
  separatingTextWithMargin: {
    fontSize: 12,
    color: '#000',
  },
  // Result section styles
  resultHeader: {
    marginBottom: 0,
  },
  resultCorpus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  resultCorpusBold: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  resultCorpusText: {
    textAlign: 'center',
    marginLeft: 10,
  },
  // Result scroll styles
  resultScrollLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  resultScrollBox: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#009FE3',
    borderWidth: 1,
  },
  resultScrollBoxGreen: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#95C11F',
    borderWidth: 1,
  },
  resultScrollText: {
    fontSize: 12,
    color: '#000',
  },
  // Sleeve result section
  sleeveResultSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  sleeveResultBold: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  sleeveResultText: {
    textAlign: 'center',
    marginLeft: 10,
  },
  // Sleeve result scroll
  sleeveResultScrollLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  sleeveResultScrollBox: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#95C11F',
    borderWidth: 1,
  },
  sleeveResultScrollText: {
    fontSize: 12,
    color: '#000',
  },
  // Mixed indicator styles
  mixedIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mixedIndicatorVertical: {
    width: 8,
    height: 17,
    backgroundColor: '#CCCCCC',
    marginLeft: 0,
    borderWidth: 1,
  },
  mixedIndicatorGreen: {
    width: 17,
    height: 17,
    backgroundColor: '#95C11F',
    marginLeft: 0,
    borderWidth: 1,
  },
  mixedIndicatorFinal: {
    width: 17,
    height: 17,
    backgroundColor: '#95C11F',
    marginLeft: 10,
    borderWidth: 1,
  },
  mixedIndicatorFinalSmall: {
    width: 17,
    height: 8,
    backgroundColor: '#FF00FF',
    marginLeft: 10,
    borderWidth: 1,
  },
  // Gray indicator
  grayIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#CCCCCC',
    marginLeft: 10,
    borderWidth: 1,
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
});

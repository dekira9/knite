import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import onboardingState from '@/state/onboardingState';
import i18n from '@/utils/translations';
import ZoomableImage from './ZoomableImage';

const SLIDES = [
  { key: 'frontV1', source: require('@/assets/images/frontV1.png') },
  { key: 'frontV2', source: require('@/assets/images/frontV2.png') },
  { key: 'frontV23', source: require('@/assets/images/frontV23.png') },
  { key: 'frontV3', source: require('@/assets/images/frontV3.png') },
  { key: 'frontV4', source: require('@/assets/images/frontV4.png') },
];

/** Near full width of the result card; taller so diagrams read larger. */
const SLIDE_WIDTH = Dimensions.get('window').width - 36;
const SLIDE_HEIGHT = Math.round(SLIDE_WIDTH * 1.05);

export default observer(function FrontVUnderstandingCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Re-render when language changes so caption updates.
  void onboardingState.language;

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / SLIDE_WIDTH);
    if (index !== currentIndex && index >= 0 && index < SLIDES.length) {
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        pagingEnabled
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.carousel}
        contentContainerStyle={styles.carouselContent}
      >
        {SLIDES.map((slide) => (
          <View key={slide.key} style={styles.slideContainer}>
            <ZoomableImage
              source={slide.source}
              style={styles.slideImage}
              contentFit="contain"
            />
          </View>
        ))}
      </ScrollView>

      {currentIndex === 0 ? (
        <Text style={styles.caption}>{i18n.t('drawingGuideSlide1')}</Text>
      ) : null}
      {currentIndex === 1 ? (
        <Text style={styles.caption}>{i18n.t('drawingGuideSlide2')}</Text>
      ) : null}
      {currentIndex === 2 ? (
        <Text style={styles.caption}>{i18n.t('drawingGuideSlide3')}</Text>
      ) : null}
      {currentIndex === 3 ? (
        <Text style={styles.caption}>{i18n.t('drawingGuideSlide4')}</Text>
      ) : null}
      {currentIndex === 4 ? (
        <Text style={styles.caption}>{i18n.t('drawingGuideSlide5')}</Text>
      ) : null}

      <View style={styles.pagination}>
        {SLIDES.map((slide, index) => (
          <View
            key={slide.key}
            style={[styles.dot, currentIndex === index && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
  },
  carousel: {
    width: SLIDE_WIDTH,
  },
  carouselContent: {
    alignItems: 'center',
  },
  slideContainer: {
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
    borderRadius: 8,
    overflow: 'hidden',
  },
  slideImage: {
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
  },
  caption: {
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 4,
    fontSize: 13,
    lineHeight: 20,
    color: '#E5E7EB',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#009FE3',
  },
});

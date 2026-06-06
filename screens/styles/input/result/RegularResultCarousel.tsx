import React, { RefObject } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import ZoomableImage from './ZoomableImage';

type Props = {
  carouselRef: RefObject<ScrollView>;
  currentIndex: number;
  onCarouselScroll: (offsetX: number) => void;
};

const SLIDE_WIDTH = Dimensions.get('window').width - 32;
const SLIDE_HEIGHT = 300;

const SLIDES = [
  { key: 'plan1', source: require('@/assets/images/planOaz1.png') },
  { key: 'plan3', source: require('@/assets/images/planOaz3.png') },
  { key: 'collar', source: require('@/assets/images/regular-collar.png') },
];

export default function RegularResultCarousel({
  carouselRef,
  currentIndex,
  onCarouselScroll,
}: Props) {
  return (
    <>
      <ScrollView
        ref={carouselRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
        onScroll={(event) => onCarouselScroll(event.nativeEvent.contentOffset.x)}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide) => (
          <View key={slide.key} style={styles.slideContainer}>
            <ZoomableImage source={slide.source} style={styles.slideImage} contentFit="contain" />
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[styles.paginationDot, currentIndex === index && styles.paginationDotActive]}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  carousel: {
    marginBottom: 20,
    marginTop: 15,
  },
  slideContainer: {
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
  },
  slideImage: {
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
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
    backgroundColor: '#CCCCCC',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#009FE3',
  },
});

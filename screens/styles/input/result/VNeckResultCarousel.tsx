import React, { RefObject } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import ZoomableImage from './ZoomableImage';

type Props = {
  carouselRef: RefObject<ScrollView | null>;
  currentIndex: number;
  onCarouselScroll: (offsetX: number) => void;
  /** Tap on the «plan» slide (index 1) returns to Step 3 Parts. */
  onPlanImagePress?: () => void;
};

const SLIDE_WIDTH = Dimensions.get('window').width - 32;
const SLIDE_HEIGHT = 300;
/** Index of planVaz44 — linked from Step 3 «Parts». */
const PLAN_SLIDE_INDEX = 1;

const SLIDES = [
  { key: 'plan111', source: require('@/assets/images/planVaz111.png') },
  { key: 'plan44', source: require('@/assets/images/planVaz44.png') },
  { key: 'v-neck', source: require('@/assets/images/v-neck.png') },
];

export default function VNeckResultCarousel({
  carouselRef,
  currentIndex,
  onCarouselScroll,
  onPlanImagePress,
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
        {SLIDES.map((slide, index) => (
          <View key={slide.key} style={styles.slideContainer}>
            {index === PLAN_SLIDE_INDEX && onPlanImagePress ? (
              <Pressable
                onPress={onPlanImagePress}
                style={styles.slideImage}
                accessibilityRole="button"
                accessibilityLabel="Plan"
              >
                <Image
                  source={slide.source}
                  style={styles.slideImage}
                  contentFit="contain"
                />
              </Pressable>
            ) : (
              <ZoomableImage
                source={slide.source}
                style={styles.slideImage}
                contentFit="contain"
              />
            )}
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
    backgroundColor: '#D1D1D6',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#007AFF',
  },
});

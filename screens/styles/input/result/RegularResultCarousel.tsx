import React, { RefObject } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';

type Props = {
  carouselRef: RefObject<ScrollView>;
  currentIndex: number;
  onCarouselScroll: (offsetX: number) => void;
  onStep3Press: () => void;
};

const SLIDES = [
  { key: 'plan1', source: require('@/assets/images/planOaz1.png'), onPress: undefined },
  { key: 'plan3', source: require('@/assets/images/planOaz3.png'), onPress: 'step3' as const },
  { key: 'collar', source: require('@/assets/images/regular-collar.png'), onPress: undefined },
];

export default function RegularResultCarousel({
  carouselRef,
  currentIndex,
  onCarouselScroll,
  onStep3Press,
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
        {SLIDES.map((slide) => {
          const content = (
            <Image source={slide.source} style={styles.slideImage} contentFit="contain" />
          );
          if (slide.onPress === 'step3') {
            return (
              <TouchableOpacity
                key={slide.key}
                style={styles.slideContainer}
                onPress={onStep3Press}
                activeOpacity={1}
              >
                {content}
              </TouchableOpacity>
            );
          }
          return (
            <View key={slide.key} style={styles.slideContainer}>
              {content}
            </View>
          );
        })}
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
    backgroundColor: '#CCCCCC',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#009FE3',
  },
});

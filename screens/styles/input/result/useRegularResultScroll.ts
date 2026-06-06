import { useRef, useState } from 'react';
import { Dimensions, ScrollView } from 'react-native';

const SLIDE_SIZE = () => Dimensions.get('window').width - 32;

export function useRegularResultScroll() {
  const scrollViewRef = useRef<ScrollView>(null);
  const carouselRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollCarouselTo = (index: number) => {
    carouselRef.current?.scrollTo({ x: SLIDE_SIZE() * index, animated: true });
    setCurrentIndex(index);
  };

  const handleScrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    setTimeout(() => scrollCarouselTo(1), 100);
  };

  const handleScrollToTop1 = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    setTimeout(() => scrollCarouselTo(0), 100);
  };

  const handleCarouselScroll = (x: number) => {
    setCurrentIndex(Math.round(x / SLIDE_SIZE()));
  };

  return {
    scrollViewRef,
    carouselRef,
    currentIndex,
    slideSize: SLIDE_SIZE(),
    handleScrollToTop,
    handleScrollToTop1,
    handleCarouselScroll,
  };
}

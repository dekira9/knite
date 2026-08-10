import { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';

const SLIDE_SIZE = () => Dimensions.get('window').width - 32;
/** Small top inset so the target isn't flush against the screen edge. */
const SCROLL_PADDING = 8;

export function useRegularResultScroll() {
  const scrollViewRef = useRef<ScrollView>(null);
  const carouselRef = useRef<ScrollView>(null);
  const partsAnchorRef = useRef<View>(null);
  const carouselOffsetY = useRef(0);
  const mainScrollY = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onCarouselAnchorLayout = useCallback((event: LayoutChangeEvent) => {
    carouselOffsetY.current = event.nativeEvent.layout.y;
  }, []);

  const onMainScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      mainScrollY.current = event.nativeEvent.contentOffset.y;
    },
    [],
  );

  const scrollMainToCarousel = () => {
    const y = Math.max(0, carouselOffsetY.current - SCROLL_PADDING);
    scrollViewRef.current?.scrollTo({ y, animated: true });
  };

  const scrollCarouselTo = (index: number) => {
    carouselRef.current?.scrollTo({ x: SLIDE_SIZE() * index, animated: true });
    setCurrentIndex(index);
  };

  const handleScrollToTop = () => {
    scrollMainToCarousel();
    setTimeout(() => scrollCarouselTo(1), 100);
  };

  const handleScrollToTop1 = () => {
    scrollMainToCarousel();
    setTimeout(() => scrollCarouselTo(0), 100);
  };

  /** Scroll back to Step 3 «Parts» (works even when the section is nested). */
  const handleScrollToParts = useCallback(() => {
    const parts = partsAnchorRef.current;
    const scroll = scrollViewRef.current;
    if (!parts || !scroll) return;

    parts.measureInWindow((_px, partsY) => {
      scroll.measureInWindow((_sx, scrollY) => {
        const targetY = Math.max(
          0,
          mainScrollY.current + (partsY - scrollY) - SCROLL_PADDING,
        );
        scroll.scrollTo({ y: targetY, animated: true });
      });
    });
  }, []);

  const handleCarouselScroll = (x: number) => {
    setCurrentIndex(Math.round(x / SLIDE_SIZE()));
  };

  return {
    scrollViewRef,
    carouselRef,
    partsAnchorRef,
    currentIndex,
    slideSize: SLIDE_SIZE(),
    onCarouselAnchorLayout,
    onMainScroll,
    handleScrollToTop,
    handleScrollToTop1,
    handleScrollToParts,
    handleCarouselScroll,
  };
}

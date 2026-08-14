import React, { useMemo, useState, type ReactNode } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Colors } from '@/constants/Colors';

type Props = {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/** Horizontal ScrollView with page dots when content overflows. */
export default function HorizontalScrollWithDots({
  children,
  contentContainerStyle,
}: Props) {
  const [viewportWidth, setViewportWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  const pageCount = useMemo(() => {
    if (viewportWidth <= 0 || contentWidth <= viewportWidth + 4) {
      return 0;
    }
    return Math.max(2, Math.ceil(contentWidth / viewportWidth));
  }, [contentWidth, viewportWidth]);

  const activePage = useMemo(() => {
    if (pageCount <= 1 || viewportWidth <= 0) {
      return 0;
    }
    const maxScroll = Math.max(contentWidth - viewportWidth, 1);
    const progress = Math.min(Math.max(scrollX / maxScroll, 0), 1);
    return Math.min(pageCount - 1, Math.round(progress * (pageCount - 1)));
  }, [contentWidth, pageCount, scrollX, viewportWidth]);

  const onViewportLayout = (event: LayoutChangeEvent) => {
    setViewportWidth(event.nativeEvent.layout.width);
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollX(event.nativeEvent.contentOffset.x);
  };

  return (
    <View onLayout={onViewportLayout}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onContentSizeChange={(width) => setContentWidth(width)}
        contentContainerStyle={contentContainerStyle}
      >
        {children}
      </ScrollView>

      {pageCount > 1 ? (
        <View style={styles.dotsRow}>
          {Array.from({ length: pageCount }, (_, index) => (
            <View
              key={`dot-${index}`}
              style={[
                styles.dot,
                index === activePage ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: Colors.light.tint,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotInactive: {
    backgroundColor: '#D1D5DB',
  },
});

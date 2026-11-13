// Carousel pagination dots for increase-type options on front v-neck chart.
import React from 'react';
import { View, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { styles } from './styles';

export type FrontVPaginationDotsProps = {
  usedIncreaseTypeV: string[] | null | undefined;
  currentIndex: number;
  colorScheme: ReturnType<typeof useColorScheme>;
};

export function FrontVPaginationDots({
  usedIncreaseTypeV,
  currentIndex,
  colorScheme,
}: FrontVPaginationDotsProps) {
  const colors = Colors[(colorScheme ?? 'light') as keyof typeof Colors];

  return (
    <View style={styles.paginationContainer}>
      {usedIncreaseTypeV &&
        Array.isArray(usedIncreaseTypeV) &&
        usedIncreaseTypeV.map((_, index) => (
          <View
            key={`dot-${index}`}
            style={[
              styles.paginationDot,
              currentIndex === index && { backgroundColor: colors.tint },
            ]}
          />
        ))}
    </View>
  );
}

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { resultTypography } from './resultSharedStyles';

type Props = {
  topColor: string;
  bottomColor?: string;
  value: number | string;
};

export default function StitchPartChip({ topColor, bottomColor, value }: Props) {
  return (
    <View style={styles.chip}>
      <View style={styles.indicators}>
        <View style={[styles.swatch, { backgroundColor: topColor }]} />
        {bottomColor ? (
          <View style={[styles.swatch, styles.swatchBottom, { backgroundColor: bottomColor }]} />
        ) : null}
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    minWidth: 52,
  },
  indicators: {
    alignItems: 'center',
    marginBottom: 4,
  },
  swatch: {
    width: 17,
    height: 9,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#000',
  },
  swatchBottom: {
    marginTop: -1,
  },
  value: {
    ...resultTypography.chipValue,
    textAlign: 'center',
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RESULT_COLORS, resultTypography } from './resultSharedStyles';

type Props = {
  topColor: string;
  bottomColor?: string;
  value: number | string;
  label?: string;
  isStart?: boolean;
};

export default function StitchPartChip({ topColor, bottomColor, value, label, isStart }: Props) {
  return (
    <View style={[styles.chip, isStart && styles.chipStart]}>
      {isStart ? <View style={styles.startDot} /> : null}
      <View style={styles.indicators}>
        <View style={[styles.swatch, { backgroundColor: topColor }]} />
        {bottomColor ? (
          <View style={[styles.swatch, styles.swatchBottom, { backgroundColor: bottomColor }]} />
        ) : null}
      </View>
      {label ? (
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      ) : null}
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    minWidth: 56,
  },
  chipStart: {
    borderWidth: 1,
    borderColor: RESULT_COLORS.start,
  },
  startDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: RESULT_COLORS.start,
    marginBottom: 4,
  },
  indicators: {
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    color: RESULT_COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 2,
    maxWidth: 72,
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

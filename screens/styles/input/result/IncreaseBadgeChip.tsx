import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RESULT_COLORS, resultTypography } from './resultSharedStyles';

type Props = {
  value: number | string;
  label?: string;
};

export default function IncreaseBadgeChip({ value, label }: Props) {
  return (
    <View style={styles.chip}>
      <View style={styles.yellowBar} />
      {label ? (
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      ) : null}
      <Text style={styles.value}>+{value}</Text>
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
  yellowBar: {
    width: 34,
    height: 8,
    backgroundColor: RESULT_COLORS.lastRowCollar,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#000',
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    color: RESULT_COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 2,
    maxWidth: 72,
  },
  value: {
    ...resultTypography.chipValue,
    textAlign: 'center',
  },
});

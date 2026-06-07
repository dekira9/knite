import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RESULT_COLORS, resultTypography } from './resultSharedStyles';

type Props = {
  color: string;
  label: string;
  value: number | string;
  detail?: string;
};

export default function BreakdownRow({ color, label, value, detail }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.labelWrap}>
        <View style={[styles.swatch, { backgroundColor: color }]} />
        <View>
          <Text style={resultTypography.body}>{label}</Text>
          {detail ? <Text style={styles.detail}>{detail}</Text> : null}
        </View>
      </View>
      <Text style={resultTypography.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
    paddingRight: 8,
  },
  swatch: {
    width: 14,
    height: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#000',
  },
  detail: {
    fontSize: 12,
    color: RESULT_COLORS.textSecondary,
    marginTop: 2,
  },
});

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
        <View style={styles.textWrap}>
          <Text style={[resultTypography.label, styles.label]}>{label}</Text>
          {detail ? <Text style={styles.detail}>{detail}</Text> : null}
        </View>
      </View>
      <Text style={[resultTypography.chipValue, styles.value]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    flexShrink: 1,
    flexGrow: 1,
    maxWidth: '66%',
    paddingRight: 8,
  },
  swatch: {
    width: 14,
    height: 14,
    marginTop: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#000',
    flexShrink: 0,
  },
  textWrap: {
    flexShrink: 1,
    flexGrow: 1,
  },
  label: {
    flexShrink: 1,
  },
  value: {
    flexShrink: 0,
    textAlign: 'right',
    minWidth: 28,
    marginTop: 1,
  },
  detail: {
    fontSize: 12,
    color: RESULT_COLORS.textSecondary,
    marginTop: 2,
  },
});

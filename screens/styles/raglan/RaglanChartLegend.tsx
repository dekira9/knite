import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import i18n from '@/utils/translations';

type LegendItem = {
  symbol: string;
  color: string;
  labelKey: string;
  borderColor?: string;
};

const RIBBING_ITEMS: LegendItem[] = [
  { symbol: '', color: 'yellow', labelKey: 'castOnRow', borderColor: 'black' },
  { symbol: '', color: 'red', labelKey: 'currentRow', borderColor: 'black' },
];

const REGULAR_ITEMS: LegendItem[] = [
  { symbol: '', color: 'yellow', labelKey: 'lastRowOfCollar', borderColor: 'black' },
  { symbol: '', color: '#FDCFE1', labelKey: 'knitting', borderColor: 'black' },
  { symbol: '+', color: '#00ADF2', labelKey: 'addingStitchesAlongTheRaglanLine', borderColor: 'black' },
  { symbol: '', color: 'red', labelKey: 'currentRow', borderColor: 'black' },
];

const V_NECK_EXTRA: LegendItem[] = [
  { symbol: '', color: '#fb93bc', labelKey: 'knitTheStitchesFromTheCollar', borderColor: '#715604' },
  { symbol: '', color: 'black', labelKey: 'decreaseTheStitches', borderColor: 'black' },
  { symbol: '', color: 'grey', labelKey: 'thereAreNoStitches', borderColor: 'black' },
];

type Props = {
  variant?: 'regular' | 'v-neck' | 'ribbing';
};

export function RaglanChartLegend({ variant = 'regular' }: Props) {
  const items =
    variant === 'ribbing'
      ? RIBBING_ITEMS
      : variant === 'v-neck'
        ? [...V_NECK_EXTRA, ...REGULAR_ITEMS.slice(2)]
        : REGULAR_ITEMS;

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item.labelKey} style={styles.row}>
          <View
            style={[
              styles.swatch,
              {
                backgroundColor: item.color,
                borderColor: item.borderColor ?? 'black',
              },
            ]}
          >
            {item.symbol ? <Text style={styles.symbol}>{item.symbol}</Text> : null}
          </View>
          <Text style={styles.label}>{i18n.t(item.labelKey)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  swatch: {
    width: 17,
    height: 17,
    borderWidth: 1,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 10,
    fontWeight: '700',
    color: '#003',
  },
  label: {
    fontSize: 12,
    flexShrink: 1,
  },
});

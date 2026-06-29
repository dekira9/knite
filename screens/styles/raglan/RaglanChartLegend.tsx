import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import i18n from '@/utils/translations';
import {
  CHART_HIGHLIGHT_FILL,
  CHART_PALETTE,
} from './chartModels/palette';

type LegendItem = {
  symbol: string;
  color: string;
  labelKey: string;
  borderColor?: string;
};

const RIBBING_ITEMS: LegendItem[] = [
  { symbol: '', color: CHART_PALETTE.ribbing, labelKey: 'collarKnitting', borderColor: CHART_PALETTE.ribbing },
  { symbol: '', color: CHART_HIGHLIGHT_FILL, labelKey: 'currentRow', borderColor: '#991B1B' },
];

const REGULAR_ITEMS: LegendItem[] = [
  { symbol: '', color: CHART_PALETTE.ribbing, labelKey: 'lastRowOfCollar', borderColor: '#000' },
  { symbol: '', color: CHART_PALETTE.knit, labelKey: 'knitting', borderColor: '#000' },
  { symbol: '+', color: CHART_PALETTE.increase, labelKey: 'addingStitchesAlongTheRaglanLine', borderColor: '#000' },
  { symbol: '', color: CHART_HIGHLIGHT_FILL, labelKey: 'currentRow', borderColor: '#991B1B' },
];

const V_NECK_EXTRA: LegendItem[] = [
  { symbol: '', color: '#fb93bc', labelKey: 'knitTheStitchesFromTheCollar', borderColor: '#715604' },
  { symbol: '', color: 'black', labelKey: 'decreaseTheStitches', borderColor: 'black' },
  { symbol: '', color: 'grey', labelKey: 'thereAreNoStitches', borderColor: 'black' },
];

type Props = {
  variant?: 'regular' | 'v-neck' | 'ribbing';
  /** `compact` — single horizontal row (ribbing). `card` — wrapped chips with title. */
  layout?: 'compact' | 'card';
};

function LegendChip({ item, compact }: { item: LegendItem; compact?: boolean }) {
  return (
    <View style={[styles.chip, compact && styles.chipCompact]}>
      <View
        style={[
          styles.swatch,
          {
            backgroundColor: item.color,
            borderColor: '#000',
          },
        ]}
      >
        {item.symbol ? <Text style={styles.symbol}>{item.symbol}</Text> : null}
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {i18n.t(item.labelKey)}
      </Text>
    </View>
  );
}

export function RaglanChartLegend({ variant = 'regular', layout }: Props) {
  const resolvedLayout = layout ?? (variant === 'ribbing' ? 'compact' : 'card');

  const items =
    variant === 'ribbing'
      ? RIBBING_ITEMS
      : variant === 'v-neck'
        ? [...V_NECK_EXTRA, ...REGULAR_ITEMS.slice(2)]
        : REGULAR_ITEMS;

  if (resolvedLayout === 'compact') {
    return (
      <View style={styles.compactWrapper}>
        <View style={styles.compactRow}>
          {items.map((item) => (
            <LegendChip key={item.labelKey} item={item} compact />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cardWrapper}>
      <Text style={styles.cardTitle}>{i18n.t('chartLegendTitle')}</Text>
      <View style={styles.legendGrid}>
        {items.map((item) => (
          <LegendChip key={item.labelKey} item={item} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  compactWrapper: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  compactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cardWrapper: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    maxWidth: '48%',
    flexGrow: 1,
    flexBasis: '45%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  chipCompact: {
    maxWidth: undefined,
    flexBasis: 'auto',
    flexGrow: 0,
  },
  swatch: {
    width: 14,
    height: 14,
    borderWidth: 1,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 10,
    fontWeight: '700',
    color: '#003366',
  },
  label: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 14,
    flexShrink: 1,
  },
});

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import i18n from '@/utils/translations';
import type { TranslationKey } from '@/utils/i18n/translationKeys';

type LegendItem = {
  color: string;
  labelKey: TranslationKey;
  borderColor?: string;
  borderRadius?: number;
};

const REGULAR_ITEMS: LegendItem[] = [
  { color: '#FAEE25', labelKey: 'lastRowOfCollar', borderColor: '#000' },
  { color: '#FF4444', labelKey: 'start', borderRadius: 8 },
  { color: '#A29FCF', labelKey: 'back' },
  { color: '#FDCFE1', labelKey: 'front' },
  { color: '#DAEDBD', labelKey: 'sleeve' },
  { color: '#E76F51', labelKey: 'raglan' },
  { color: '#009FE3', labelKey: 'corpus' },
  { color: '#FF00FF', labelKey: 'underarmStitches' },
];

const V_NECK_EXTRA: LegendItem[] = [
  { color: '#fb93bc', labelKey: 'knitTheStitchesFromTheCollar', borderColor: '#715604' },
  { color: '#000', labelKey: 'decreaseTheStitches' },
];

type Props = {
  variant: 'regular' | 'v-neck';
};

export default function ResultColorLegend({ variant }: Props) {
  const items = variant === 'v-neck' ? [...V_NECK_EXTRA, ...REGULAR_ITEMS] : REGULAR_ITEMS;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{i18n.t('resultLegendTitle')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((item) => (
          <View key={item.labelKey} style={styles.chip}>
            <View
              style={[
                styles.swatch,
                {
                  backgroundColor: item.color,
                  borderColor: item.borderColor ?? '#000',
                  borderRadius: item.borderRadius ?? 0,
                },
              ]}
            />
            <Text style={styles.label} numberOfLines={2}>
              {i18n.t(item.labelKey)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
    maxWidth: 140,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  swatch: {
    width: 14,
    height: 14,
    borderWidth: 1,
    marginRight: 6,
  },
  label: {
    flexShrink: 1,
    fontSize: 11,
    color: '#374151',
    lineHeight: 14,
  },
});

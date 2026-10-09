import React, { useEffect, useMemo, useRef } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import {
  buildNumericRange,
  formatWheelValue,
  parseMeasurementString,
} from '@/utils/measurementUnitHelpers';

const ROW_HEIGHT = 36;
const VISIBLE_ROWS = 3;
const WHEEL_HEIGHT = ROW_HEIGHT * VISIBLE_ROWS;
const PAD_ROWS = Math.floor(VISIBLE_ROWS / 2);

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
  /** Decimal places in stored string (0 for whole cm, 1 for inches). */
  decimals?: number;
};

export default function MeasurementWheelPicker({
  value,
  onValueChange,
  min,
  max,
  step = 1,
  unit,
  decimals = 0,
}: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const items = useMemo(() => buildNumericRange(min, max, step), [min, max, step]);
  const defaultIndex = Math.floor(items.length / 2);

  const scrollToValue = (raw: string, animated: boolean) => {
    const numeric = parseMeasurementString(raw, items[defaultIndex] ?? min);
    let bestIndex = 0;
    let bestDiff = Infinity;
    items.forEach((item, index) => {
      const diff = Math.abs(item - numeric);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestIndex = index;
      }
    });
    scrollRef.current?.scrollTo({ y: bestIndex * ROW_HEIGHT, animated });
  };

  useEffect(() => {
    const timer = setTimeout(() => scrollToValue(value, false), 0);
    return () => clearTimeout(timer);
  }, [items, value]);

  const commitIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    const next = formatWheelValue(items[clamped], decimals);
    if (next !== value) {
      onValueChange(next);
    }
  };

  const onScrollSettled = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    commitIndex(Math.round(y / ROW_HEIGHT));
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.wheelCard}>
        <View style={styles.selectionBand} pointerEvents="none" />
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          snapToInterval={ROW_HEIGHT}
          decelerationRate="fast"
          nestedScrollEnabled
          onMomentumScrollEnd={onScrollSettled}
          onScrollEndDrag={onScrollSettled}
        >
          {items.map((item, index) => {
            const label = formatWheelValue(item, decimals);
            return (
              <View key={`${index}-${label}`} style={styles.row}>
                <Text style={styles.rowText}>{label}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <Text style={styles.unit}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  wheelCard: {
    width: 160,
    height: WHEEL_HEIGHT,
    borderRadius: 16,
    backgroundColor: '#F4F4F5',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E4E4E7',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: ROW_HEIGHT * PAD_ROWS,
  },
  row: {
    height: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  selectionBand: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: ROW_HEIGHT * PAD_ROWS,
    height: ROW_HEIGHT,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 159, 227, 0.12)',
    borderWidth: 1,
    borderColor: Colors.light.tint,
    zIndex: 1,
  },
  unit: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});

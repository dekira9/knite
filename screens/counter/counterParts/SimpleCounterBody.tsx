import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import i18n from '@/utils/translations';
import { counterScreenStyles as styles } from './counterScreenStyles';

type SimpleCounterBodyProps = {
  count: number;
  target: number | null;
  tapHeight: number;
  onIncrement: () => void;
};

export function SimpleCounterBody({
  count,
  target,
  tapHeight,
  onIncrement,
}: SimpleCounterBodyProps) {
  const progress =
    target != null && target > 0 ? Math.min(count / target, 1) : 0;
  const targetReached = target != null && count >= target;

  return (
    <>
      <View style={styles.countSection}>
        <Text style={styles.rowLabel}>{i18n.t('rowCounterRow')}</Text>
        <Text style={styles.bigCount}>{count}</Text>
        {target != null ? (
          <Text style={styles.ofTarget}>
            {i18n.t('rowCounterOf', { target })}
          </Text>
        ) : null}
        {target != null ? (
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
        ) : null}
        {targetReached ? (
          <Text style={styles.doneText}>{i18n.t('rowCounterDone')}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={[styles.tapArea, { minHeight: tapHeight }]}
        onPress={onIncrement}
        activeOpacity={0.85}
      >
        <Text style={styles.tapPlus}>+</Text>
        <Text style={styles.tapHint}>{i18n.t('rowCounterTapHint')}</Text>
      </TouchableOpacity>
    </>
  );
}

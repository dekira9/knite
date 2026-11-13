// Stitches total and optional length row pair for ResultStepV sections.

import React from 'react';
import { View, Text } from 'react-native';
import i18n from '@/utils/translations';
import type { ResultStepVMetrics } from './calc';
import { styles } from './styles';

interface StitchesLengthRowsProps {
  total: number;
  length: ResultStepVMetrics['corpusLength'];
}

export function StitchesLengthRows({ total, length }: StitchesLengthRowsProps) {
  return (
    <>
      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>{i18n.t('stitches')}:</Text>
        <Text style={styles.boldNumber}>{total}</Text>
      </View>
      {length !== null && (
        <View style={[styles.infoRow, { marginTop: -12 }]}>
          <Text style={styles.leftLabel}>{length.unitLabel}:</Text>
          <Text style={styles.boldNumber}>{length.value}</Text>
        </View>
      )}
    </>
  );
}

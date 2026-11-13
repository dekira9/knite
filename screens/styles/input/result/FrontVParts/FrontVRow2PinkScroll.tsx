// Horizontal row-2 pink stitch box for FrontV.

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import i18n from '@/utils/translations';
import type { IncreaseRowStrings } from '@/screens/styles/raglan/increaseRowSelection';
import { isRaglanOutput, row2PinkStitchesSum } from './calc';
import { styles } from './styles';

interface FrontVRow2PinkScrollProps {
  results: unknown;
  increaseStrings: IncreaseRowStrings;
  rowLabel: string;
}

export function FrontVRow2PinkScroll({
  results,
  increaseStrings,
  rowLabel,
}: FrontVRow2PinkScrollProps) {
  return (
    <>
      <View style={styles.horizontalRow}>
        <Text style={styles.resultText}>{rowLabel}</Text>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
        <View style={styles.horizontalRow}>
          <View style={styles.stitchBox}>
            <View style={styles.pinkIndicator}></View>

            <Text style={styles.resultText}>
              {i18n.t('stitches')}:{' '}
              {isRaglanOutput(results)
                ? row2PinkStitchesSum(results, increaseStrings)
                : '0'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

// Horizontal row-1 stitch boxes (raglan create + collar) for FrontV.

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import i18n from '@/utils/translations';
import type { IncreaseRowStrings } from '@/screens/styles/raglan/increaseRowSelection';
import {
  firstPairCollarStitchesDisplay,
  firstRowRaglanCreateDisplay,
  isRaglanOutput,
} from './calc';
import { styles } from './styles';

interface FrontVRow1PairScrollProps {
  results: unknown;
  increaseStrings: IncreaseRowStrings;
  rowLabel: string;
}

export function FrontVRow1PairScroll({
  results,
  increaseStrings,
  rowLabel,
}: FrontVRow1PairScrollProps) {
  return (
    <>
      <View style={styles.horizontalRow}>
        <Text style={styles.resultText}>{rowLabel}</Text>
      </View>

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
        <View style={styles.horizontalRow}>
          <View style={styles.stitchBox}>
            <View style={styles.blueIndicator}></View>

            <Text style={styles.resultText}>
              {i18n.t('create')}
              {'\n'}
              <Text>{i18n.t('stitches')}</Text>:{' '}
              {isRaglanOutput(results)
                ? firstRowRaglanCreateDisplay(results, increaseStrings)
                : '0'}
            </Text>
          </View>
          <View style={styles.horizontalRow}>
            <View style={styles.roundDot}></View>
          </View>
          <View style={styles.stitchBox}>
            <View style={styles.pinkIndicator}></View>

            <Text style={styles.resultText}>
              {i18n.t('stitches')}:{' '}
              {isRaglanOutput(results)
                ? firstPairCollarStitchesDisplay(results)
                : '0'}
              {'\n'}
              {i18n.t('fromTheCollar')}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.horizontalRow}>
        <Text style={styles.resultText}> {i18n.t('turn')} </Text>
      </View>
    </>
  );
}

// Action 1 calculated rows 1–4 (R and L) for FrontV.

import React from 'react';
import { View, Text } from 'react-native';
import i18n from '@/utils/translations';
import type { IncreaseRowStrings } from '@/screens/styles/raglan/increaseRowSelection';
import { FrontVRow1PairScroll } from './FrontVRow1PairScroll';
import { FrontVRow2PinkScroll } from './FrontVRow2PinkScroll';
import { styles } from './styles';

interface FrontVAction1CalcSectionProps {
  results: unknown;
  increaseStrings: IncreaseRowStrings;
}

export function FrontVAction1CalcSection({
  results,
  increaseStrings,
}: FrontVAction1CalcSectionProps) {
  return (
    <>
      <View style={styles.horizontalRow}>
        <Text style={[styles.resultText, { fontWeight: 'bold' }]}>
          {i18n.t('calculationForYou')}: {i18n.t('rows')} 1, 2
        </Text>
      </View>

      <FrontVRow1PairScroll
        results={results}
        increaseStrings={increaseStrings}
        rowLabel={` 1: ${i18n.t('row1ForPart')} L `}
      />
      <FrontVRow2PinkScroll
        results={results}
        increaseStrings={increaseStrings}
        rowLabel={` 2: ${i18n.t('row2ForPart')} L `}
      />

      <FrontVRow1PairScroll
        results={results}
        increaseStrings={increaseStrings}
        rowLabel={` 3: ${i18n.t('row1ForPart')} R `}
      />
      <FrontVRow2PinkScroll
        results={results}
        increaseStrings={increaseStrings}
        rowLabel={` 4: ${i18n.t('row2ForPart')} R `}
      />
    </>
  );
}

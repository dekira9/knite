// White result card: corpus and sleeve breakdown sections for ResultStepV.

import React from 'react';
import { View, Text } from 'react-native';
import i18n from '@/utils/translations';
import type { ResultStepVMetrics } from './calc';
import { CorpusBreakdownScroll } from './CorpusBreakdownScroll';
import { ResultStepVHero } from './ResultStepVHero';
import { SleeveSideSection } from './SleeveSideSection';
import { StitchesLengthRows } from './StitchesLengthRows';
import { styles } from './styles';

interface ResultStepVCardProps {
  results: {
    SRostok: number;
    SPodr: number;
    SaV: number;
    SfxV: number;
    SKaV: number;
  };
  metrics: ResultStepVMetrics;
}

export function ResultStepVCard({ results, metrics }: ResultStepVCardProps) {
  return (
    <View style={styles.resultCard}>
      <ResultStepVHero />

      <View style={styles.chartRow}>
        <Text style={styles.corpusTitle}>{i18n.t('corpus')}</Text>
        <View style={styles.blueIndicatorLarge}></View>
      </View>

      <StitchesLengthRows
        total={metrics.corpusTotal}
        length={metrics.corpusLength}
      />

      <CorpusBreakdownScroll
        sRostok={results.SRostok}
        sPodr={results.SPodr}
      />

      <SleeveSideSection side="left" metrics={metrics} results={results} />
      <SleeveSideSection side="right" metrics={metrics} results={results} />
    </View>
  );
}

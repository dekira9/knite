// Sleeve summary header, totals, and breakdown scroll (left or right) for ResultStepV.

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import i18n from '@/utils/translations';
import type { ResultStepVMetrics } from './calc';
import { StitchesLengthRows } from './StitchesLengthRows';
import { styles } from './styles';

interface SleeveSideSectionProps {
  side: 'left' | 'right';
  metrics: Pick<
    ResultStepVMetrics,
    'sleeveTotal' | 'sleeveLength' | 'fromBackStitches'
  >;
  results: {
    SaV: number;
    SfxV: number;
    SKaV: number;
    SPodr: number;
  };
}

export function SleeveSideSection({
  side,
  metrics,
  results,
}: SleeveSideSectionProps) {
  const sleeveBodyStitches =
    results.SaV + 2 * results.SfxV + 2 * results.SKaV;
  const sideLabel = side === 'left' ? i18n.t('left') : i18n.t('right');

  return (
    <>
      <View style={styles.chartRow}>
        <View style={styles.resultHeaderRow}>
          <Text style={styles.sleeveTitle}>{i18n.t('sleeve')}</Text>
          <Text style={[styles.leftLabel]}>
            {'  '}
            {sideLabel}
          </Text>
        </View>
        <View style={styles.greenIndicatorLarge}></View>
      </View>
      <StitchesLengthRows
        total={metrics.sleeveTotal}
        length={metrics.sleeveLength}
      />

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
        <View style={styles.sleeveScrollRow}>
          {side === 'left' ? (
            <>
              <View style={styles.sleeveBox}>
                <Text style={styles.textinBox}>1</Text>
                <View style={styles.textBox}>
                  <Text style={styles.smallText}>{i18n.t('sleeve')}</Text>
                </View>
                <Text style={styles.textinBox}>
                  {i18n.t('stitches')}: {sleeveBodyStitches}
                </Text>
              </View>

              <View style={styles.roundIndicator}>
                <View style={styles.roundDot}></View>
              </View>

              <View style={styles.sleeveBox}>
                <Text style={styles.textinBox}>2</Text>
                <View style={styles.indicatorRow}>
                  <View style={styles.smallVerticalGrayIndicator}></View>
                  <View style={styles.greenIndicator}></View>
                </View>
                <Text style={styles.textinBox}>
                  {i18n.t('stitches')}: {metrics.fromBackStitches}
                </Text>
                <Text style={styles.smallText}>
                  {i18n.t('create') || 'create'}
                </Text>
                <Text style={styles.smallText}>
                  {i18n.t('fromTheBack') || 'fromTheBack'}
                </Text>
              </View>

              <View style={styles.roundIndicator}>
                <View style={styles.roundDot}></View>
              </View>

              <View style={styles.sleeveBox}>
                <Text style={styles.textinBox}>3</Text>
                <View style={styles.greenIndicator}></View>
                <View style={styles.smallMagentaIndicator}></View>
                <Text style={styles.textinBox}>
                  {i18n.t('stitches')}: {results.SPodr} {'\n'}
                  <Text style={styles.smallText}>{i18n.t('create')}</Text>
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.sleeveBox}>
                <View style={styles.indicatorRow}>
                  <View style={styles.smallVerticalGrayIndicator}></View>
                  <View style={styles.greenIndicator}></View>
                </View>
                <Text style={styles.textinBox}>
                  {i18n.t('stitches')}: {metrics.fromBackStitches}
                </Text>
                <Text style={styles.smallText}>
                  {i18n.t('create') || 'create'}
                </Text>
                <Text style={styles.smallText}>
                  {i18n.t('fromTheBack') || 'fromTheBack'}
                </Text>
              </View>

              <View style={styles.roundIndicator}>
                <View style={styles.roundDot}></View>
              </View>

              <View style={styles.sleeveBox}>
                <View style={styles.textBox}>
                  <Text style={styles.smallText}>{i18n.t('sleeve')}</Text>
                </View>
                <Text style={styles.textinBox}>
                  {i18n.t('stitches')}: {sleeveBodyStitches}
                </Text>
              </View>

              <View style={styles.roundIndicator}>
                <View style={styles.roundDot}></View>
              </View>

              <View style={styles.sleeveBox}>
                <View style={styles.greenIndicator}></View>
                <View style={styles.smallMagentaIndicator}></View>
                <Text style={styles.textinBox}>
                  {i18n.t('stitches')}: {results.SPodr} {'\n'}
                  <Text style={styles.smallText}>{i18n.t('create')}</Text>
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}

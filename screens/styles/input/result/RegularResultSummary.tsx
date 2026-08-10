import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import introState from '@/state/introState';
import type { RaglanOutput } from '@/utils/calculateRaglan';
import { resultTypography } from './resultSharedStyles';
import { stitchesFromBack } from './stitchesFromBack';
import { formatResultLength } from './formatResultLength';

type Props = {
  results: RaglanOutput;
};

export default observer(function RegularResultSummary({ results }: Props) {
  const corpusTotal = results.SRostok * 2 + results.SPodr * 2;
  const stitchesPerCm =
    parseFloat(String(introState.stitchDensity).replace(',', '.')) / 10;
  const corpusLength = formatResultLength(corpusTotal, stitchesPerCm);
  const fromBackStitches = stitchesFromBack(
    results.NRostok,
    introState.stitchDensity,
    introState.rowDensity,
  );
  const sleeveTotal =
    results.Sa + 2 * results.Sfx + 2 * results.SKa + results.SPodr + fromBackStitches;
  const sleeveBase = results.Sa + 2 * results.Sfx + 2 * results.SKa;
  const sleeveLength = formatResultLength(sleeveTotal, stitchesPerCm);

  return (
    <View style={styles.resultCard}>
      <Text style={[styles.subtitle, { marginBottom: 0 }]}>{i18n.t('Result')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={styles.resultContainer}>
          <Image
            source={require('@/assets/images/sleevebodyO2.png')}
            style={styles.resultImage}
          />
        </View>
      </ScrollView>

      <View style={styles.divider} />

      <View style={styles.chartRow}>
        <Text style={styles.chartTitle}>{i18n.t('corpus')}</Text>
        <View style={styles.blueIndicatorLarge} />
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>{i18n.t('stitches')}:</Text>
        <Text style={styles.boldNumber}>{corpusTotal}</Text>
      </View>
      {corpusLength !== null && (
        <View style={[styles.infoRow, { marginTop: -12 }]}>
          <Text style={styles.leftLabel}>{corpusLength.unitLabel}:</Text>
          <Text style={styles.boldNumber}>{corpusLength.value}</Text>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={styles.separatingLayout}>
          <View style={styles.resultScrollBox}>
            <Text style={styles.textinBox}>{i18n.t('back')}</Text>
            <View style={styles.smallGrayIndicator} />
            <View style={styles.smallBlueIndicator} />
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}: {results.SRostok}
            </Text>
          </View>
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot} />
          </View>
          <View style={styles.resultScrollBox}>
            <View style={styles.smallPinkIndicator} />
            <View style={styles.smallBlueIndicator} />
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}: {results.SPodr} {'\n'}
              <Text style={styles.smallText}>{i18n.t('underarmStitches')}</Text>
            </Text>
          </View>
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot} />
          </View>
          <View style={styles.resultScrollBox}>
            <Text style={styles.textinBox}>{i18n.t('front')}</Text>
            <View style={styles.smallGrayIndicator} />
            <View style={styles.smallBlueIndicator} />
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}: {results.SRostok}
            </Text>
          </View>
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot} />
          </View>
          <View style={styles.resultScrollBox}>
            <View style={styles.smallPinkIndicator} />
            <View style={styles.smallBlueIndicator} />
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}: {results.SPodr} {'\n'}
              <Text style={styles.smallText}>{i18n.t('underarmStitches')}</Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.divider} />

      <View style={styles.chartRow}>
        <View style={styles.resultHeaderRow}>
          <Text style={styles.chartTitle}>{i18n.t('sleeve')}</Text>
          <Text style={styles.resultText}>{'  '}{i18n.t('left')}</Text>
        </View>
        <View style={styles.greenIndicatorLarge} />
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>{i18n.t('stitches')}:</Text>
        <Text style={styles.boldNumber}>{sleeveTotal}</Text>
      </View>
      {sleeveLength !== null && (
        <View style={[styles.infoRow, { marginTop: -12 }]}>
          <Text style={styles.leftLabel}>{sleeveLength.unitLabel}:</Text>
          <Text style={styles.boldNumber}>{sleeveLength.value}</Text>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={styles.separatingLayout}>
          <View style={styles.sleeveBox}>
            <Text style={styles.textinBox}>1</Text>
            <View style={styles.textBox}>
              <Text style={styles.smallText}>{i18n.t('sleeve')}</Text>
            </View>
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}: {sleeveBase}
            </Text>
          </View>
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot} />
          </View>
          <View style={styles.sleeveBox}>
            <Text style={styles.textinBox}>2</Text>
            <View style={styles.indicatorRow}>
              <View style={styles.smallGrayIndicatorVertical} />
              <View style={styles.smallGreenIndicator} />
            </View>
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}: {fromBackStitches}{' '}
            </Text>
            <Text style={styles.smallText}>{i18n.t('create')}</Text>
            <Text style={styles.smallText}>{i18n.t('fromTheBack') || 'fromTheBack'}</Text>
          </View>
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot} />
          </View>
          <View style={styles.sleeveBox}>
            <Text style={styles.textinBox}>3</Text>
            <View style={styles.smallGreenIndicatorHorizontal} />
            <View style={styles.smallPinkIndicator} />
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}: {results.SPodr} {'\n'}
              <Text style={styles.smallText}>{i18n.t('create')}</Text>
              {'\n'}
              <Text style={styles.smallText}>{i18n.t('underarmStitches')}</Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.divider} />

      <View style={styles.chartRow}>
        <View style={styles.resultHeaderRow}>
          <Text style={styles.chartTitle}>{i18n.t('sleeve')}</Text>
          <Text style={styles.resultText}>{'  '}{i18n.t('right')}</Text>
        </View>
        <View style={styles.greenIndicatorLarge} />
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>{i18n.t('stitches')}:</Text>
        <Text style={styles.boldNumber}>{sleeveTotal}</Text>
      </View>
      {sleeveLength !== null && (
        <View style={[styles.infoRow, { marginTop: -12 }]}>
          <Text style={styles.leftLabel}>{sleeveLength.unitLabel}:</Text>
          <Text style={styles.boldNumber}>{sleeveLength.value}</Text>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={styles.separatingLayout}>
          <View style={styles.sleeveBox}>
            <Text style={styles.textinBox}>1</Text>
            <View style={styles.indicatorRow}>
              <View style={styles.smallGrayIndicatorVertical} />
              <View style={styles.smallGreenIndicator} />
            </View>
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}: {fromBackStitches}{' '}
            </Text>
            <Text style={styles.smallText}>{i18n.t('create')}</Text>
            <Text style={styles.smallText}>{i18n.t('fromTheBack') || 'fromTheBack'}</Text>
          </View>
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot} />
          </View>
          <View style={styles.sleeveBox}>
            <Text style={styles.textinBox}>2</Text>
            <View style={styles.textBox}>
              <Text style={styles.smallText}>{i18n.t('sleeve')}</Text>
            </View>
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}: {sleeveBase}
            </Text>
          </View>
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot} />
          </View>
          <View style={styles.sleeveBox}>
            <Text style={styles.textinBox}>3</Text>
            <View style={styles.smallGreenIndicatorHorizontal} />
            <View style={styles.smallPinkIndicator} />
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}: {results.SPodr} {'\n'}
              <Text style={styles.smallText}>{i18n.t('create')}</Text>
              {'\n'}
              <Text style={styles.smallText}>{i18n.t('underarmStitches')}</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

const COLORS = {
  TEXT_PRIMARY: '#1A1A1A',
  TEXT_SECONDARY: '#6b7280',
  WHITE: '#ffffff',
  BLACK: '#000',
  GRAY: '#E6E6E6',
  DIVIDER: '#CCCCCC',
  BLUE: '#009FE3',
};

const styles = StyleSheet.create({
  resultCard: {
    backgroundColor: COLORS.WHITE,
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 0,
    textAlign: 'center' as const,
    color: COLORS.TEXT_PRIMARY,
  },
  resultContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  resultImage: {
    width: '100%',
    aspectRatio: 2,
    height: undefined,
    resizeMode: 'contain',
    padding: 150,
  },
  divider: {
    height: 0.5,
    backgroundColor: COLORS.DIVIDER,
    marginTop: 5,
    marginBottom: 20,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  leftLabel: {
    ...resultTypography.label,
  },
  boldNumber: {
    ...resultTypography.value,
  },
  separatingLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultScrollBox: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: COLORS.GRAY,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: COLORS.BLUE,
    borderWidth: 1,
  },
  textBox: {
    borderWidth: 1,
    borderColor: COLORS.BLACK,
    padding: 3,
    borderRadius: 5,
    marginBottom: 3,
  },
  textinBox: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center' as const,
    color: COLORS.TEXT_PRIMARY,
  },
  smallText: {
    fontSize: 12,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  blueIndicatorLarge: {
    width: 34,
    height: 17,
    backgroundColor: COLORS.BLUE,
    marginLeft: 10,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  greenIndicatorLarge: {
    width: 34,
    height: 17,
    backgroundColor: '#95C11F',
    marginLeft: 10,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  smallBlueIndicator: {
    width: 17,
    height: 17,
    backgroundColor: COLORS.BLUE,
    marginLeft: 10,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  smallGrayIndicator: {
    width: 17,
    height: 8,
    backgroundColor: COLORS.DIVIDER,
    marginLeft: 10,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  smallPinkIndicator: {
    width: 17,
    height: 8,
    backgroundColor: '#FF00FF',
    marginLeft: 10,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  roundIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  roundDot: {
    width: 17,
    height: 17,
    borderRadius: 8,
    marginLeft: 0,
    borderWidth: 2,
    borderColor: COLORS.DIVIDER,
  },
  resultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  sleeveBox: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: COLORS.GRAY,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#95C11F',
    borderWidth: 1,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallGrayIndicatorVertical: {
    width: 8,
    height: 17,
    backgroundColor: COLORS.DIVIDER,
    marginLeft: 0,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  smallGreenIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#95C11F',
    marginLeft: 0,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  smallGreenIndicatorHorizontal: {
    width: 17,
    height: 17,
    backgroundColor: '#95C11F',
    marginLeft: 10,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
});

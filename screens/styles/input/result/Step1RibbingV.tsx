import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';
import ResultStepTitle from './ResultStepTitle';
import BreakdownRow from './BreakdownRow';
import CollarSequenceStrip, { type CollarSegment } from './CollarSequenceStrip';
import {
  RESULT_COLORS,
  resultCardStyles,
  resultTypography,
} from './resultSharedStyles';

interface Step1RibbingVProps {
  results: any;
  NRrezV: number;
  SpribVcorn: number;
  resultStringV01: string;
  resultStringV11: string;
  resultStringV12: string;
  resultStringV22: string;
  resultStringV23: string;
}

const Step1RibbingV = observer(({
  results,
  NRrezV,
  SpribVcorn,
  resultStringV01,
  resultStringV11,
  resultStringV12,
  resultStringV22,
  resultStringV23,
}: Step1RibbingVProps) => {
  const navigation = useNavigation();

  const navigateToRibbingCopyV = () => {
    (navigation as any).navigate('Raglan', { screen: 'Ribbing' });
  };

  const collarSegments: CollarSegment[] = [
    { kind: 'stitch', topColor: RESULT_COLORS.raglan, bottomColor: RESULT_COLORS.lastRowCollar, value: results.KV },
    { kind: 'stitch', topColor: RESULT_COLORS.sleeve, bottomColor: RESULT_COLORS.lastRowCollar, value: results.SaV },
    { kind: 'stitch', topColor: RESULT_COLORS.raglan, bottomColor: RESULT_COLORS.lastRowCollar, value: results.KV },
    { kind: 'stitch', topColor: RESULT_COLORS.back, bottomColor: RESULT_COLORS.lastRowCollar, value: results.SFrontV },
    { kind: 'stitch', topColor: RESULT_COLORS.raglan, bottomColor: RESULT_COLORS.lastRowCollar, value: results.KV },
    { kind: 'stitch', topColor: RESULT_COLORS.sleeve, bottomColor: RESULT_COLORS.lastRowCollar, value: results.SaV },
    { kind: 'stitch', topColor: RESULT_COLORS.raglan, bottomColor: RESULT_COLORS.lastRowCollar, value: results.KV },
    { kind: 'stitch', topColor: RESULT_COLORS.front, bottomColor: RESULT_COLORS.lastRowCollar, value: results.SV },
    { kind: 'increase', value: results.SpribVcorn },
    { kind: 'increase', value: results.SpribVcorn },
    { kind: 'stitch', topColor: RESULT_COLORS.front, bottomColor: RESULT_COLORS.lastRowCollar, value: results.SV },
  ];

  const spribRatio = Math.floor(SpribVcorn / NRrezV);

  return (
    <View style={styles.container}>
      <ResultStepTitle step={1} titleKey="collarKnitting" />

      <View style={resultCardStyles.card}>
        <View style={styles.ribbingHeader}>
          <Text style={resultTypography.sectionTitle}>{i18n.t('lastRowOfCollar')}</Text>
          <View style={styles.yellowIndicator} />
        </View>

        <View style={styles.chartRow}>
          <Text style={resultTypography.label}>{i18n.t('knittingChart')}:</Text>
          <TouchableOpacity style={styles.viewChartButton} onPress={navigateToRibbingCopyV}>
            <Image
              source={require('@/assets/images/view1.png')}
              style={styles.viewIcon}
              contentFit="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={resultCardStyles.divider} />

        <View style={resultCardStyles.infoRow}>
          <Text style={resultTypography.label}>{i18n.t('stitches')}:</Text>
          <View style={styles.stitchRange}>
            <Text style={resultTypography.value}>
              {i18n.t('start')}: {results.SOcutV}
            </Text>
            <Text style={resultTypography.value}>
              {i18n.t('end')}: {results.SOcutV + results.SpribVcorn * 2}
            </Text>
          </View>
        </View>

        <View style={resultCardStyles.infoRow}>
          <Text style={resultTypography.label}>{i18n.t('knitting')}:</Text>
          <Image
            source={require('@/assets/images/knitcircle.svg')}
            style={styles.knitIcon}
            contentFit="contain"
          />
        </View>

        <View style={resultCardStyles.infoRow}>
          <Text style={resultTypography.label}>{i18n.t('rows')}:</Text>
          <Text style={resultTypography.value}>{results.NRrezV}</Text>
        </View>

        <View style={resultCardStyles.infoRow}>
          <Text style={resultTypography.label}>{i18n.t('start')}:</Text>
          <View style={styles.redIndicator} />
        </View>

        <CollarSequenceStrip segments={collarSegments} />

        <View style={styles.stitchBreakdown}>
          <BreakdownRow color={RESULT_COLORS.back} label={i18n.t('back')} value={results.SFrontV} />
          <BreakdownRow
            color={RESULT_COLORS.front}
            label={i18n.t('front')}
            value={results.SVfront * 2}
            detail={`${i18n.t('start')}: ${results.SVO}`}
          />
          <BreakdownRow color={RESULT_COLORS.sleeve} label={i18n.t('sleeve')} value={results.SaV} />
          <BreakdownRow color={RESULT_COLORS.raglan} label={i18n.t('raglan')} value={results.KV} />
          <BreakdownRow
            color={RESULT_COLORS.lastRowCollar}
            label={i18n.t('additionsOnOneSide')}
            value={results.SpribVcorn}
          />
        </View>

        {(spribRatio === 0 ||
          (spribRatio === 1 && SpribVcorn > NRrezV) ||
          (spribRatio === 2 && SpribVcorn > 2 * NRrezV) ||
          SpribVcorn === NRrezV ||
          SpribVcorn === 2 * NRrezV) && (
          <View style={styles.sequenceCard}>
            <Text style={resultTypography.sectionTitle}>{i18n.t('sequenceOfAdditions')}</Text>
            {spribRatio === 0 ? (
              <Text style={resultTypography.body}>{resultStringV01}</Text>
            ) : null}
            {SpribVcorn === NRrezV ? (
              <Text style={resultTypography.body}>{resultStringV11}</Text>
            ) : null}
            {spribRatio === 1 && SpribVcorn > NRrezV ? (
              <Text style={resultTypography.body}>{resultStringV12}</Text>
            ) : null}
            {SpribVcorn === 2 * NRrezV ? (
              <Text style={resultTypography.body}>{resultStringV22}</Text>
            ) : null}
            {spribRatio === 2 && SpribVcorn > 2 * NRrezV ? (
              <Text style={resultTypography.body}>{resultStringV23}</Text>
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RESULT_COLORS.background,
  },
  ribbingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  viewChartButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewIcon: {
    width: 25,
    height: 25,
    tintColor: '#ffffff',
  },
  knitIcon: {
    width: 25,
    height: 25,
  },
  stitchRange: {
    alignItems: 'flex-end',
    gap: 4,
  },
  yellowIndicator: {
    width: 17,
    height: 17,
    backgroundColor: RESULT_COLORS.lastRowCollar,
    borderWidth: 1,
    borderColor: '#000',
  },
  redIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: RESULT_COLORS.start,
  },
  stitchBreakdown: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: RESULT_COLORS.divider,
  },
  sequenceCard: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    gap: 6,
  },
});

export default Step1RibbingV;

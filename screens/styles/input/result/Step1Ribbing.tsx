import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';
import ResultStepTitle from './ResultStepTitle';
import Step1CollarExpandable from './Step1CollarExpandable';
import BreakdownRow from './BreakdownRow';
import CollarSequenceStrip, { type CollarSegment } from './CollarSequenceStrip';
import {
  RESULT_COLORS,
  resultCardStyles,
  resultTypography,
} from './resultSharedStyles';

interface Step1RibbingProps {
  results: any;
}

const Step1Ribbing = observer(({ results }: Step1RibbingProps) => {
  const navigation = useNavigation();

  const navigateToRibbingO = () => {
    (navigation as any).navigate('Raglan', { screen: 'Ribbing' });
  };

  const collarSegments: CollarSegment[] = [
    { kind: 'stitch', labelKey: 'raglan', topColor: RESULT_COLORS.raglan, bottomColor: RESULT_COLORS.lastRowCollar, value: results.SKfront },
    { kind: 'stitch', labelKey: 'back', topColor: RESULT_COLORS.back, bottomColor: RESULT_COLORS.lastRowCollar, value: results.SFrontO },
    { kind: 'stitch', labelKey: 'raglan', topColor: RESULT_COLORS.raglan, bottomColor: RESULT_COLORS.lastRowCollar, value: results.K },
    { kind: 'stitch', labelKey: 'sleeve', topColor: RESULT_COLORS.sleeve, bottomColor: RESULT_COLORS.lastRowCollar, value: results.Sa },
    { kind: 'stitch', labelKey: 'raglan', topColor: RESULT_COLORS.raglan, bottomColor: RESULT_COLORS.lastRowCollar, value: results.K },
    { kind: 'stitch', labelKey: 'front', topColor: RESULT_COLORS.front, bottomColor: RESULT_COLORS.lastRowCollar, value: results.SFrontO },
    { kind: 'stitch', labelKey: 'raglan', topColor: RESULT_COLORS.raglan, bottomColor: RESULT_COLORS.lastRowCollar, value: results.K },
    { kind: 'stitch', labelKey: 'sleeve', topColor: RESULT_COLORS.sleeve, bottomColor: RESULT_COLORS.lastRowCollar, value: results.Sa },
    { kind: 'stitch', labelKey: 'raglan', topColor: RESULT_COLORS.raglan, bottomColor: RESULT_COLORS.lastRowCollar, value: results.SKa },
  ];

  return (
    <View style={styles.container}>
      <ResultStepTitle step={1} titleKey="collarKnitting" />

      <Step1CollarExpandable variant="regular">
        <View style={resultCardStyles.card}>
          <View style={styles.ribbingHeader}>
            <Text style={[resultTypography.sectionTitle, styles.castOnInstruction]}>
              {i18n.t('step1CastOnInstruction')}
            </Text>
            <View style={styles.yellowIndicator} />
          </View>

          <View style={styles.chartRow}>
            <Text style={resultTypography.label}>{i18n.t('knittingChart')}:</Text>
            <TouchableOpacity style={styles.viewChartButton} onPress={navigateToRibbingO}>
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
            <Text style={resultTypography.value}>{results.Sgor}</Text>
          </View>

          <View style={styles.stitchBreakdown}>
            <BreakdownRow color={RESULT_COLORS.back} label={i18n.t('back')} value={results.SFrontO} />
            <BreakdownRow color={RESULT_COLORS.front} label={i18n.t('front')} value={results.SFrontO} />
            <BreakdownRow
              color={RESULT_COLORS.sleeve}
              label={i18n.t('sleeve')}
              value={results.Sa}
              detail={i18n.t('step1PerSleeve')}
            />
            <BreakdownRow
              color={RESULT_COLORS.raglan}
              label={i18n.t('raglan')}
              value={results.K}
              detail={i18n.t('step1PerRaglanLine')}
            />
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
            <Text style={resultTypography.value}>{results.NRrez}</Text>
          </View>

          <View style={styles.roundOrderSection}>
            <Text style={resultTypography.sectionTitle}>{i18n.t('step1RoundOrder')}</Text>
            <Text style={styles.roundOrderHint}>{i18n.t('step1RoundOrderHint')}</Text>
            <CollarSequenceStrip segments={collarSegments} />
          </View>
        </View>
      </Step1CollarExpandable>
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
    alignItems: 'flex-start',
    marginBottom: 12,
    justifyContent: 'space-between',
    gap: 10,
  },
  castOnInstruction: {
    flex: 1,
    fontWeight: '600',
    lineHeight: 20,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  viewChartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors['light'].tint,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  viewIcon: {
    width: 25,
    height: 25,
    tintColor: '#ffffff',
  },
  yellowIndicator: {
    width: 17,
    height: 17,
    backgroundColor: RESULT_COLORS.lastRowCollar,
    borderWidth: 1,
    borderColor: '#000',
  },
  stitchBreakdown: {
    marginTop: -4,
    marginBottom: 12,
    paddingTop: 8,
    paddingHorizontal: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    gap: 2,
  },
  breakdownTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: RESULT_COLORS.textSecondary,
    marginBottom: 6,
  },
  roundOrderSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: RESULT_COLORS.divider,
    gap: 4,
  },
  roundOrderHint: {
    fontSize: 12,
    color: RESULT_COLORS.textSecondary,
    lineHeight: 16,
    marginBottom: 4,
  },
  knitIcon: {
    width: 25,
    height: 25,
  },
});

export default Step1Ribbing;

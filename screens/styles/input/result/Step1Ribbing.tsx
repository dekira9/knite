import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';
import ResultStepTitle from './ResultStepTitle';
import StitchPartChip from './StitchPartChip';
import {
  RESULT_COLORS,
  resultCardStyles,
  resultTypography,
} from './resultSharedStyles';

interface Step1RibbingProps {
  results: any;
}

function BreakdownRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number | string;
}) {
  return (
    <View style={styles.breakdownRow}>
      <View style={styles.breakdownLabel}>
        <View style={[styles.breakdownSwatch, { backgroundColor: color }]} />
        <Text style={resultTypography.body}>{label}</Text>
      </View>
      <Text style={resultTypography.value}>{value}</Text>
    </View>
  );
}

const Step1Ribbing = observer(({ results }: Step1RibbingProps) => {
  const navigation = useNavigation();

  const navigateToRibbingO = () => {
    (navigation as any).navigate('Raglan', { screen: 'Ribbing' });
  };

  const collarSegments = [
    { top: RESULT_COLORS.raglan, bottom: RESULT_COLORS.lastRowCollar, value: results.SKfront },
    { top: RESULT_COLORS.back, bottom: RESULT_COLORS.lastRowCollar, value: results.SFrontO },
    { top: RESULT_COLORS.raglan, bottom: RESULT_COLORS.lastRowCollar, value: results.K },
    { top: RESULT_COLORS.sleeve, bottom: RESULT_COLORS.lastRowCollar, value: results.Sa },
    { top: RESULT_COLORS.raglan, bottom: RESULT_COLORS.lastRowCollar, value: results.K },
    { top: RESULT_COLORS.front, bottom: RESULT_COLORS.lastRowCollar, value: results.SFrontO },
    { top: RESULT_COLORS.raglan, bottom: RESULT_COLORS.lastRowCollar, value: results.K },
    { top: RESULT_COLORS.sleeve, bottom: RESULT_COLORS.lastRowCollar, value: results.Sa },
    { top: RESULT_COLORS.raglan, bottom: RESULT_COLORS.lastRowCollar, value: results.SKa },
  ];

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

        <View style={resultCardStyles.infoRow}>
          <Text style={resultTypography.label}>{i18n.t('start')}:</Text>
          <View style={styles.redIndicator} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View style={styles.horizontalRow}>
            {collarSegments.map((segment, index) => (
              <React.Fragment key={`${segment.top}-${segment.value}-${index}`}>
                {index > 0 ? (
                  <View style={styles.roundIndicator}>
                    <View style={styles.roundDot} />
                  </View>
                ) : null}
                <StitchPartChip
                  topColor={segment.top}
                  bottomColor={segment.bottom}
                  value={segment.value}
                />
              </React.Fragment>
            ))}
          </View>
        </ScrollView>

        <View style={styles.stitchBreakdown}>
          <BreakdownRow
            color={RESULT_COLORS.back}
            label={i18n.t('back')}
            value={results.SFrontO}
          />
          <BreakdownRow
            color={RESULT_COLORS.front}
            label={i18n.t('front')}
            value={results.SFrontO}
          />
          <BreakdownRow
            color={RESULT_COLORS.sleeve}
            label={i18n.t('sleeve')}
            value={results.Sa}
          />
          <BreakdownRow
            color={RESULT_COLORS.raglan}
            label={i18n.t('raglan')}
            value={results.K}
          />
        </View>
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
  knitIcon: {
    width: 25,
    height: 25,
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
  roundIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  roundDot: {
    width: 17,
    height: 17,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },
  horizontalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  stitchBreakdown: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: RESULT_COLORS.divider,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakdownSwatch: {
    width: 14,
    height: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#000',
  },
});

export default Step1Ribbing;

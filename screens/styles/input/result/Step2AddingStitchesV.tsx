import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';
import ResultStepTitle from './ResultStepTitle';
import IncreaseOptionSection from './IncreaseOptionSection';
import RaglanPartRow from './RaglanPartRow';
import ResultChartRow from './ResultChartRow';
import { RESULT_COLORS, resultCardStyles, resultTypography } from './resultSharedStyles';

interface Step2AddingStitchesVProps {
  results: any;
  resultString24V: string;
  resultString23V: string;
  resultString21V: string;
  resultString43V: string;
  RowPrib1x4StringV: string;
  RowPrib1x3StringV: string;
  RowPrib1x2StringV: string;
  RowPrib1x1StringV: string;
}

const Step2AddingStitchesV = observer(({
  results,
  resultString24V,
  resultString23V,
  resultString21V,
  resultString43V,
  RowPrib1x4StringV,
  RowPrib1x3StringV,
  RowPrib1x2StringV,
  RowPrib1x1StringV,
}: Step2AddingStitchesVProps) => {
  const navigation = useNavigation();

  const navigateToBackV = () => {
    (navigation as any).navigate('Raglan', { screen: 'Back' });
  };

  const navigateToFrontV = () => {
    (navigation as any).navigate('Raglan', { screen: 'Front' });
  };

  const navigateToSleeveV = () => {
    (navigation as any).navigate('Raglan', { screen: 'Sleeve' });
  };

  return (
    <View style={styles.container}>
      <ResultStepTitle step={2} titleKey="increases" />

      <View style={resultCardStyles.card}>
        <View style={styles.stepHeader}>
          <Text style={resultTypography.sectionTitle}>
            {i18n.t('back')}, {i18n.t('front')}, {i18n.t('sleeve')}
          </Text>
          <View style={styles.indicatorsRow}>
            <View style={[styles.indicator, { backgroundColor: RESULT_COLORS.back }]} />
            <View style={[styles.indicator, { backgroundColor: RESULT_COLORS.front }]} />
            <View style={[styles.indicator, { backgroundColor: RESULT_COLORS.sleeve }]} />
          </View>
        </View>

        <View style={resultCardStyles.divider} />

        <Text style={[resultTypography.label, styles.sectionHint]}>
          {i18n.t('addingStitchesAlongTheRaglanLine')}
        </Text>

        <View style={resultCardStyles.infoRow}>
          <Text style={resultTypography.label}>{i18n.t('additionsOnOneSide')}</Text>
          <Text style={resultTypography.value}>+{results.SfxV}</Text>
        </View>

        <View style={resultCardStyles.infoRow}>
          <Text style={resultTypography.label}>{i18n.t('knitting')}:</Text>
          <Image
            source={require('@/assets/images/znts8.svg')}
            style={styles.knitIconZnts}
            contentFit="contain"
          />
        </View>

        <View style={resultCardStyles.infoRow}>
          <Text style={resultTypography.label}>{i18n.t('rows')}:</Text>
          <Text style={resultTypography.value}>{results.NHV}</Text>
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
          <Text style={resultTypography.value}>{results.NHFrontV - results.NHV}</Text>
        </View>

        <View style={resultCardStyles.divider} />

        <ResultChartRow title={i18n.t('back')} color={RESULT_COLORS.back} onPress={navigateToBackV} />
        <RaglanPartRow color={RESULT_COLORS.back} stitches={results.SFrontV} increasePerSide={results.SfxV} />

        <View style={resultCardStyles.divider} />

        <ResultChartRow title={i18n.t('front')} color={RESULT_COLORS.front} onPress={navigateToFrontV} />
        <RaglanPartRow color={RESULT_COLORS.front} stitches={results.SFrontV} increasePerSide={results.SfxV} />

        <View style={resultCardStyles.divider} />

        <ResultChartRow title={i18n.t('sleeve')} color={RESULT_COLORS.sleeve} onPress={navigateToSleeveV} />
        <RaglanPartRow color={RESULT_COLORS.sleeve} stitches={results.SaV} increasePerSide={results.SfxV} />

        <View style={resultCardStyles.divider} />

        {results.usedIncreaseTypeV?.includes('1x2, 1x4') && (
          <IncreaseOptionSection
            rhythms={[
              { rowsPerStitch: 2, count: results.PR_1x2_fV },
              { rowsPerStitch: 4, count: results.PR_1x4_fV },
            ]}
            rowsString={resultString24V}
          />
        )}

        {results.usedIncreaseTypeV?.includes('1x4, 1x3') && (
          <IncreaseOptionSection
            rhythms={[
              { rowsPerStitch: 3, count: results.PRib_1x3_fV },
              { rowsPerStitch: 4, count: results.PRib_1x4_fV },
            ]}
            rowsString={resultString43V}
          />
        )}

        {results.usedIncreaseTypeV?.includes('1x2, 1x1') && (
          <IncreaseOptionSection
            rhythms={[
              { rowsPerStitch: 2, count: results.PR_1x2_fV },
              { rowsPerStitch: 1, count: results.prib_1x1_fV },
            ]}
            rowsString={resultString21V}
          />
        )}
        {results.usedIncreaseTypeV?.includes('1x4, 1x1') && (
          <IncreaseOptionSection
            rhythms={[
              { rowsPerStitch: 4, count: results.PR_1x4_fV },
              { rowsPerStitch: 1, count: results.prib_1x1_fV },
            ]}
          />
        )}
        {results.usedIncreaseTypeV?.includes('1x2, 1x3') && (
          <IncreaseOptionSection
            rhythms={[
              { rowsPerStitch: 2, count: results.prib_1x2_fV },
              { rowsPerStitch: 3, count: results.prib_1x3_fV },
            ]}
            rowsString={resultString23V}
          />
        )}

        {results.usedIncreaseTypeV?.includes('1x3, 1x1') && (
          <IncreaseOptionSection
            rhythms={[
              { rowsPerStitch: 3, count: results.prib_1x3_fV },
              { rowsPerStitch: 1, count: results.prib_1x1_fV },
            ]}
          />
        )}
        {results.usedIncreaseTypeV?.includes('1x4') && (
          <IncreaseOptionSection
            rhythms={[{ rowsPerStitch: 4, count: results.PR_1x4_fV }]}
            rowsString={RowPrib1x4StringV}
          />
        )}

        {results.usedIncreaseTypeV?.includes('1x1') && (
          <IncreaseOptionSection
            rhythms={[{ rowsPerStitch: 1, count: results.prib_1x1_fV }]}
            rowsString={RowPrib1x1StringV}
          />
        )}

        {results.usedIncreaseTypeV?.includes('1x2') && (
          <IncreaseOptionSection
            rhythms={[{ rowsPerStitch: 2, count: results.prib_1x2_fV }]}
            rowsString={RowPrib1x2StringV}
          />
        )}
        {results.usedIncreaseTypeV?.includes('1x3') && (
          <IncreaseOptionSection
            rhythms={[{ rowsPerStitch: 3, count: results.prib_1x3_fV }]}
            rowsString={RowPrib1x3StringV}
          />
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
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  indicatorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  indicator: {
    width: 17,
    height: 17,
    borderWidth: 1,
    borderColor: '#000',
  },
  sectionHint: {
    marginBottom: 12,
  },
  knitIcon: {
    width: 25,
    height: 25,
  },
  knitIconZnts: {
    width: 30,
    height: 30,
  },
});

export default Step2AddingStitchesV;

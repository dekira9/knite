import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';
import ResultStepTitle from './ResultStepTitle';
import ResultStepExpandable from './ResultStepExpandable';
import IncreaseOptionSection from './IncreaseOptionSection';
import RaglanPartRow from './RaglanPartRow';
import ResultChartRow from './ResultChartRow';
import { RESULT_COLORS, resultCardStyles, resultTypography } from './resultSharedStyles';

interface Step2AddingStitchesProps {
  results: any;
  resultString24: string;
  resultString23: string;
  resultString21: string;
  resultString43: string;
}

const Step2AddingStitches = observer(({
  results,
  resultString24,
  resultString23,
  resultString21,
  resultString43,
}: Step2AddingStitchesProps) => {
  const navigation = useNavigation();

  const navigateToBackO = () => {
    (navigation as any).navigate('Raglan', { screen: 'Back' });
  };

  const navigateToFrontO = () => {
    (navigation as any).navigate('Raglan', { screen: 'Front' });
  };

  const navigateToSleeveO = () => {
    (navigation as any).navigate('Raglan', { screen: 'Sleeve' });
  };

  return (
    <View style={styles.container}>
      <ResultStepTitle step={2} titleKey="increases" />

      <ResultStepExpandable
        previewSource={require('@/assets/images/increasesO.png')}
        accessibilityLabel={i18n.t('increases')}
      >
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
          <Text style={resultTypography.value}>+{results.Sfx}</Text>
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
          <Text style={resultTypography.value}>{results.NHFront}</Text>
        </View>

        <View style={resultCardStyles.divider} />

        <ResultChartRow title={i18n.t('back')} color={RESULT_COLORS.back} onPress={navigateToBackO} />
        <RaglanPartRow color={RESULT_COLORS.back} stitches={results.SFrontO} increasePerSide={results.Sfx} />

        <View style={resultCardStyles.divider} />

        <ResultChartRow title={i18n.t('front')} color={RESULT_COLORS.front} onPress={navigateToFrontO} />
        <RaglanPartRow color={RESULT_COLORS.front} stitches={results.SFrontO} increasePerSide={results.Sfx} />

        <View style={resultCardStyles.divider} />

        <ResultChartRow title={i18n.t('sleeve')} color={RESULT_COLORS.sleeve} onPress={navigateToSleeveO} />
        <RaglanPartRow color={RESULT_COLORS.sleeve} stitches={results.Sa} increasePerSide={results.Sfx} />

        <View style={resultCardStyles.divider} />

        {results.usedIncreaseType.includes('1x2, 1x4') && (
          <IncreaseOptionSection
            rhythms={[
              { rowsPerStitch: 2, count: results.PR_1x2_f },
              { rowsPerStitch: 4, count: results.PR_1x4_f },
            ]}
            rowsString={resultString24}
          />
        )}

        {results.usedIncreaseType.includes('1x3, 1x4') && (
          <IncreaseOptionSection
            rhythms={[
              { rowsPerStitch: 3, count: results.PRib_1x3_f },
              { rowsPerStitch: 4, count: results.PRib_1x4_f },
            ]}
            rowsString={resultString43}
          />
        )}

        {results.usedIncreaseType.includes('1x2, 1x1') && (
          <IncreaseOptionSection
            rhythms={[
              { rowsPerStitch: 2, count: results.PR_1x2_f },
              { rowsPerStitch: 1, count: results.prib_1x1_f },
            ]}
            rowsString={resultString21}
          />
        )}
        {results.usedIncreaseType.includes('1x4, 1x1') && (
          <IncreaseOptionSection
            rhythms={[
              { rowsPerStitch: 4, count: results.PR_1x4_f },
              { rowsPerStitch: 1, count: results.prib_1x1_f },
            ]}
          />
        )}
        {results.usedIncreaseType.includes('1x2, 1x3') && (
          <IncreaseOptionSection
            rhythms={[
              { rowsPerStitch: 2, count: results.prib_1x2_f },
              { rowsPerStitch: 3, count: results.prib_1x3_f },
            ]}
            rowsString={resultString23}
          />
        )}

        {results.usedIncreaseType.includes('1x3, 1x1') && (
          <IncreaseOptionSection
            rhythms={[
              { rowsPerStitch: 3, count: results.prib_1x3_f },
              { rowsPerStitch: 1, count: results.prib_1x1_f },
            ]}
          />
        )}
        {results.usedIncreaseType.includes('1x4') && (
          <IncreaseOptionSection
            rhythms={[{ rowsPerStitch: 4, count: results.PR_1x4_f }]}
            rowsString={results.RowPrib1x4String}
          />
        )}

        {results.usedIncreaseType.includes('1x1') && (
          <IncreaseOptionSection
            rhythms={[{ rowsPerStitch: 1, count: results.prib_1x1_f }]}
            rowsString={results.RowPrib1x1String}
          />
        )}

        {results.usedIncreaseType.includes('1x2') && (
          <IncreaseOptionSection
            rhythms={[{ rowsPerStitch: 2, count: results.prib_1x2_f }]}
            rowsString={results.RowPrib1x2String}
          />
        )}
        {results.usedIncreaseType.includes('1x3') && (
          <IncreaseOptionSection
            rhythms={[{ rowsPerStitch: 3, count: results.prib_1x3_f }]}
            rowsString={results.RowPrib1x3String}
          />
        )}
        </View>
      </ResultStepExpandable>
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
});

export default Step2AddingStitches;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';
import ResultStepTitle from './ResultStepTitle';
import IncreaseOptionSection from './IncreaseOptionSection';

// Color constants
const COLORS = {
  PURPLE: '#A29FCF',
  PINK: '#FDCFE1',
  GREEN: '#DAEDBD',
  GRAY: '#E6E6E6',
  PRIMARY: Colors['light'].tint,
  WHITE: '#ffffff',
  BLACK: '#000',
  TEXT_PRIMARY: '#1A1A1A',
  TEXT_SECONDARY: '#6b7280',
  BACKGROUND: '#F8F9FA',
  DIVIDER: '#CCCCCC',
};

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

// Reusable Arrow Component
interface ArrowProps {
  color: string;
  direction: 'left' | 'right';
  text: string;
  marginSide: 'left' | 'right';
}

const Arrow: React.FC<ArrowProps> = ({ color, direction, text, marginSide }) => (
  <View style={styles.arrowContainerSmall}>
    <View
      style={[
        styles.arrowShape,
        direction === 'left' 
          ? { borderLeftColor: color, borderRightColor: 'transparent' }
          : { borderLeftColor: 'transparent', borderRightColor: color },
        { borderBottomColor: color }
      ]}
    />
    <Text style={[styles.resultText, styles.arrowText, { [marginSide]: 10 }]}>
      {text}
    </Text>
  </View>
);

// Reusable Chart Row Component
interface ChartRowProps {
  title: string;
  color: string;
  onPress: () => void;
}

const ChartRow: React.FC<ChartRowProps> = ({ title, color, onPress }) => (
  <>
    <View style={styles.chartRow}>
      <Text style={styles.chartTitle}>
        {title}
      </Text>
      <View style={[styles.indicator, { backgroundColor: color }]} />
      </View>
      <View style={styles.chartRowWithMargin}>
      <Text style={styles.leftLabel}>{i18n.t('knittingChart')}:</Text>
      <TouchableOpacity style={styles.viewChartButton} onPress={onPress}>
        <Image
          source={require('@/assets/images/view1.png')}
          style={styles.viewIcon}
          contentFit="contain"
        />
        {/* <Text style={styles.viewChartText}>View Chart</Text> */}
        
      </TouchableOpacity>
    </View>
  </>
);

const Step2AddingStitchesV = observer(({ 
  results, 
  resultString24V, 
  resultString23V, 
  resultString21V, 
  resultString43V,
  RowPrib1x4StringV,
  RowPrib1x3StringV,
  RowPrib1x2StringV,
  RowPrib1x1StringV
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
      
      <View style={styles.resultCard}>
        <View style={styles.stepHeader}>
        <Text style={styles.subtitle}>{i18n.t('back')}, {i18n.t('front')}, {i18n.t('sleeve')}</Text>
          <View style={styles.indicatorsRow}>
            <View style={[styles.indicator, { backgroundColor: COLORS.PURPLE }]} />
            <View style={[styles.indicator, { backgroundColor: COLORS.PINK }]} />
            <View style={[styles.indicator, { backgroundColor: COLORS.GREEN }]} />
          </View>
        </View>
        
        <View style={styles.divider}></View>

        <View style={styles.subtitleRow}>
          <Text style={styles.leftLabel}>{i18n.t('addingStitchesAlongTheRaglanLine')}</Text>
        </View>

        <View style={styles.infoRowmin}>
        <Text style={styles.leftLabel}>
          {i18n.t('additionsOnOneSide')}
        </Text>
        
      </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
          {i18n.t('stitches')}:
          </Text>
          <Text style={styles.boldNumber}>+{results.SfxV}</Text>
        </View>

        <View style={styles.infoRowmin}>
          <Text style={styles.leftLabel}>
            {i18n.t('knitting')}:
          </Text>
          <Image
            source={require('@/assets/images/znts8.svg')}
            style={styles.knitIconznts}
            contentFit="contain"
          />
          
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('rows')}:
          </Text>
          
          <Text style={styles.boldNumber}>{results.NHV}</Text>
        </View>



        <View style={styles.infoRowmin}>
          <Text style={styles.leftLabel}>
            {i18n.t('knitting')}:
          </Text>
          <Image
            source={require('@/assets/images/knitcircle.svg')}
            style={styles.knitIcon}
            contentFit="contain"
          />
          
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('rows')}:
          </Text>
          
          <Text style={styles.boldNumber}>{results.NHFrontV - results.NHV}</Text>
        </View>

        <View style={styles.divider}></View>

        <ChartRow 
          title={i18n.t('back')} 
          color={COLORS.PURPLE} 
          onPress={navigateToBackV} 
        />

      <View style={styles.arrowRow}>
        <Arrow 
          color={COLORS.PURPLE} 
          direction="right" 
          text={`${i18n.t('adding')}:\n+${results.SfxV}`} 
          marginSide="right" 
        />

        <View style={[styles.textBox, { backgroundColor: COLORS.PURPLE }]}>
          <Text style={styles.resultTextCentered}>
            {i18n.t('stitches')}: {'\n'}
            {results.SFrontV}
          </Text>
        </View>

        <Arrow 
          color={COLORS.PURPLE} 
          direction="left" 
          text={`${i18n.t('adding')}:\n+${results.SfxV}`} 
          marginSide="left" 
        />
      </View>

      <View style={styles.divider}></View>

      <ChartRow 
        title={i18n.t('front')} 
        color={COLORS.PINK} 
        onPress={navigateToFrontV} 
      />

      <View style={styles.arrowRow}>
        <Arrow 
          color={COLORS.PINK} 
          direction="right" 
          text={`${i18n.t('adding')}:\n+${results.SfxV}`} 
          marginSide="right" 
        />

        <View style={[styles.textBox, { backgroundColor: COLORS.PINK }]}>
          <Text style={styles.resultTextCentered}>
            {i18n.t('stitches')}: {'\n'}
            {results.SFrontV}
          </Text>
        </View>

        <Arrow 
          color={COLORS.PINK} 
          direction="left" 
          text={`${i18n.t('adding')}:\n+${results.SfxV}`} 
          marginSide="left" 
        />
      </View>

      <View style={styles.divider}></View>

      <ChartRow 
        title={i18n.t('sleeve')} 
        color={COLORS.GREEN} 
        onPress={navigateToSleeveV} 
      />  

      <View style={styles.arrowRow}>
        <Arrow 
          color={COLORS.GREEN} 
          direction="right" 
          text={`${i18n.t('adding')}:\n+${results.SfxV}`} 
          marginSide="right" 
        />

        <View style={[styles.textBox, { backgroundColor: COLORS.GREEN }]}>
          <Text style={styles.resultTextCentered}>
            {i18n.t('stitches')}: {'\n'}
            {results.SaV}
          </Text>
        </View>

        <Arrow 
          color={COLORS.GREEN} 
          direction="left" 
          text={`${i18n.t('adding')}:\n+${results.SfxV}`} 
          marginSide="left" 
        />
      </View>

      <View style={styles.divider}></View>

      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>
          {i18n.t('additionsOnOneSide')}:
        </Text>
        <Text style={styles.boldNumber}>{results.SfxV}</Text>
      </View>

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
    backgroundColor: COLORS.BACKGROUND,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
    color: COLORS.TEXT_PRIMARY,
  },
  resultCard: {
    backgroundColor: COLORS.WHITE,
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  leftLabel: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  boldNumber: {
    fontWeight: 'bold',
    fontSize: 20,
    color: COLORS.TEXT_PRIMARY,
  },
  viewIcon: {
    width: 25,
    height: 25,
    marginRight: 6,
    tintColor: COLORS.WHITE,
  },
  knitIcon: {
    width: 25,
    height: 25,
    marginLeft: 0,
    marginRight: 0,
  },
  knitIconznts: {
    width: 30,
    height: 30,
    marginLeft: 0,
    marginRight: 0,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center' as const,
  },
  resultTextCentered: {
    fontSize: 14,
    textAlign: 'center' as const,
  },
  boldText: {
    fontWeight: 'bold',
  },
  textBox: {
    borderWidth: 1,
    borderColor: COLORS.BLACK,
    padding: 3,
    borderRadius: 5,
    marginBottom: 3,
    justifyContent: 'center',
  },
  // Common layout styles
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
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
    marginRight: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoRowmin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  divider: {
    height: 0.5,
    backgroundColor: COLORS.DIVIDER,
    marginTop: 5,
    marginBottom: 20,
  },
  // Indicator styles
  indicator: {
    width: 17,
    height: 17,
    marginLeft: 10,
    borderWidth: 1,
  },
  // Arrow styles
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginVertical: 15,
  },
  arrowContainerSmall: {
    marginBottom: 1,
    marginLeft: 0,
    padding: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  arrowShape: {
    width: 34,
    height: 14,
    borderTopWidth: 8.5,
    borderLeftWidth: 17,
    borderRightWidth: 17,
    borderBottomWidth: 8.5,
    padding: -17,
    borderTopColor: 'transparent',
  },
  arrowText: {
    textAlign: 'center',
  },
  // Section styles
  section: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: COLORS.GRAY,
    borderRadius: 8,
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 14,
  },
  indicatorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartRowWithMargin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  viewChartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  viewChartText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Step2AddingStitchesV;


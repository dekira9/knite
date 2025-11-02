import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';

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

// Reusable Section Component
interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={[styles.resultText, styles.sectionTitle]}>
      {title}
    </Text>
    {children}
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
      <TouchableOpacity onPress={onPress}>
        <Image
          source={require('@/assets/images/view.svg')}
          style={styles.viewIcon}
          contentFit="contain"
        />
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
    (navigation as any).navigate('Raglan', { screen: 'BackV' });
  };

  const navigateToFrontV = () => {
    (navigation as any).navigate('Raglan', { screen: 'FrontV' });
  };

  const navigateToSleeveV = () => {
    (navigation as any).navigate('Raglan', { screen: 'SleeveV' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>
        {i18n.t('step')} 2{'\n'}{i18n.t('knittingAfterCollar')}
      </Text>
      
      <View style={styles.resultCard}>
        <View style={styles.stepHeader}>
          <Text style={styles.subtitle}>{i18n.t('addingStitchesAlongTheRaglanLine')}</Text>
        </View>
        
        <View style={styles.divider}></View>
        
        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('stitches')}:
          </Text>
          <Text style={styles.boldNumber}>+{results.SfxV}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('knitting')}:
          </Text>
          <Image
            source={require('@/assets/images/znts2.svg')}
            style={styles.knitIcon}
            contentFit="contain"
          />
          <Text style={styles.boldNumber}>{i18n.t('rows')}:{results.NHV},</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('knitting')}:
          </Text>
          <Image
            source={require('@/assets/images/knitcircle.svg')}
            style={styles.knitIcon}
            contentFit="contain"
          />
          <Text style={styles.boldNumber}>{i18n.t('rows')}:{results.NHFrontV - results.NHV},</Text>
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
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.PR_1x2_fV}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PR_1x4_fV}
          </Text>
          <Text style={[styles.resultText, styles.boldText]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{resultString24V}</Text>
        </Section>
      )}

      {results.usedIncreaseTypeV?.includes('1x4, 1x3') && (
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.PRib_1x3_fV}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PRib_1x4_fV}
          </Text>
          <Text style={[styles.resultText, styles.boldText]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{resultString43V}</Text>
        </Section>
      )}

      {results.usedIncreaseTypeV?.includes('1x2, 1x1') && (
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.PR_1x2_fV}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_fV}
          </Text>
          <Text style={[styles.resultText, styles.boldText]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{resultString21V}</Text>
        </Section>
      )}
      {results.usedIncreaseTypeV?.includes('1x4, 1x1') && (
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PR_1x4_fV}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_fV}
          </Text>
        </Section>
      )}
      {results.usedIncreaseTypeV?.includes('1x2, 1x3') && (
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.prib_1x2_fV}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.prib_1x3_fV}
          </Text>
          <Text style={[styles.resultText, styles.boldText]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{resultString23V}</Text>
        </Section>
      )}

      {results.usedIncreaseTypeV?.includes('1x3, 1x1') && (
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.prib_1x3_fV}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_fV}
          </Text>
        </Section>
      )}
      {results.usedIncreaseTypeV?.includes('1x4') && (
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PR_1x4_fV}
          </Text>
          <Text style={[styles.resultText, styles.boldText]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{RowPrib1x4StringV}</Text>
        </Section>
      )}

      {results.usedIncreaseTypeV?.includes('1x1') && (
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_fV}
          </Text>
          <Text style={[styles.resultText, styles.boldText]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{RowPrib1x1StringV}</Text>
        </Section>
      )}

      {results.usedIncreaseTypeV?.includes('1x2') && (
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.prib_1x2_fV}
          </Text>
          <Text style={[styles.resultText, styles.boldText]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{RowPrib1x2StringV}</Text>
        </Section>
      )}
      {results.usedIncreaseTypeV?.includes('1x3') && (
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.prib_1x3_fV}
          </Text>
          <Text style={[styles.resultText, styles.boldText]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{RowPrib1x3StringV}</Text>
        </Section>
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
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  viewIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  knitIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center' as const,
  },
  resultTextCentered: {
    fontSize: 16,
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
    justifyContent: 'center',
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
  divider: {
    height: 0.5,
    backgroundColor: COLORS.DIVIDER,
    marginTop: 5,
    marginBottom: 20,
  },
  // Indicator styles
  indicator: {
    width: 34,
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
});

export default Step2AddingStitchesV;


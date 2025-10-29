import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';

// Color constants
const COLORS = {
  PURPLE: '#A29FCF',
  PINK: '#FDCFE1',
  GREEN: '#DAEDBD',
  GRAY: '#E6E6E6',
  PRIMARY: '#007AFF',
  WHITE: '#ffffff',
  BLACK: '#000',
  TEXT_PRIMARY: '#1A1A1A',
  TEXT_SECONDARY: '#6b7280',
  BACKGROUND: '#F8F9FA',
  DIVIDER: '#CCCCCC',
};

interface Step2AddingStitchesProps {
  results: any;
  resultString24: string;
  resultString23: string;
  resultString21: string;
  resultString43: string;
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
    </View>
    <View style={styles.chartRowWithMargin}>
      <Text style={styles.leftLabel}>Knitting Chart:</Text>
      <TouchableOpacity style={styles.viewChartButton} onPress={onPress}>
        <Image
          source={require('@/assets/images/view.svg')}
          style={styles.viewIcon}
          contentFit="contain"
        />
        <Text style={styles.viewChartText}>View Chart</Text>
      </TouchableOpacity>
    </View>
  </>
);

const Step2AddingStitches = observer(({ 
  results, 
  resultString24, 
  resultString23, 
  resultString21, 
  resultString43 
}: Step2AddingStitchesProps) => {
  const navigation = useNavigation();

  const navigateToBackO = () => {
    (navigation as any).navigate('Raglan', { screen: 'BackO' });
  };

  const navigateToFrontO = () => {
    (navigation as any).navigate('Raglan', { screen: 'FrontO' });
  };

  const navigateToSleeveO = () => {
    (navigation as any).navigate('Raglan', { screen: 'SleeveO' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>{i18n.t('step')} 2</Text>
      
      <View style={styles.resultCard}>
        <View style={styles.stepHeader}>
          <Text style={styles.subtitle}>Back, Front, Sleeve</Text>
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
        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('stitches')}:
          </Text>
          <Text style={styles.boldNumber}>+{results.Sfx}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('rows')}:
          </Text>
          <Text style={styles.boldNumber}>{results.NHFront}</Text>
        </View>

      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>
          {i18n.t('additionsOnOneSide')}:
        </Text>
        <Text style={styles.boldNumber}>{results.Sfx}</Text>
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
        </View>

        <View style={styles.divider}></View>

        <ChartRow 
          title={i18n.t('back')} 
          color={COLORS.PURPLE} 
          onPress={navigateToBackO} 
        />

      <View style={styles.arrowRow}>
        <Arrow 
          color={COLORS.PURPLE} 
          direction="right" 
          text={`${i18n.t('adding')}:\n+${results.Sfx}`} 
          marginSide="right" 
        />

        <View style={[styles.textBox, { backgroundColor: COLORS.PURPLE }]}>
          <Text style={styles.resultTextCentered}>
            {i18n.t('stitches')}: {'\n'}
            {results.SFrontO}
          </Text>
        </View>

        <Arrow 
          color={COLORS.PURPLE} 
          direction="left" 
          text={`${i18n.t('adding')}:\n+${results.Sfx}`} 
          marginSide="left" 
        />
      </View>

      <View style={styles.divider}></View>

      <ChartRow 
        title={i18n.t('front')} 
        color={COLORS.PINK} 
        onPress={navigateToFrontO} 
      />

      <View style={styles.arrowRow}>
        <Arrow 
          color={COLORS.PINK} 
          direction="right" 
          text={`${i18n.t('adding')}:\n+${results.Sfx}`} 
          marginSide="right" 
        />

        <View style={[styles.textBox, { backgroundColor: COLORS.PINK }]}>
          <Text style={styles.resultTextCentered}>
            {i18n.t('stitches')}: {'\n'}
            {results.SFrontO}
          </Text>
        </View>

        <Arrow 
          color={COLORS.PINK} 
          direction="left" 
          text={`${i18n.t('adding')}:\n+${results.Sfx}`} 
          marginSide="left" 
        />
      </View>

      <View style={styles.divider}></View>

      <ChartRow 
        title={i18n.t('sleeve')} 
        color={COLORS.GREEN} 
        onPress={navigateToSleeveO} 
      />  

      <View style={styles.arrowRow}>
        <Arrow 
          color={COLORS.GREEN} 
          direction="right" 
          text={`${i18n.t('adding')}:\n+${results.Sfx}`} 
          marginSide="right" 
        />

        <View style={[styles.textBox, { backgroundColor: COLORS.GREEN }]}>
          <Text style={styles.resultTextCentered}>
            {i18n.t('stitches')}: {'\n'}
            {results.Sa}
          </Text>
        </View>

        <Arrow 
          color={COLORS.GREEN} 
          direction="left" 
          text={`${i18n.t('adding')}:\n+${results.Sfx}`} 
          marginSide="left" 
        />
      </View>

      <View style={styles.divider}></View>

      {results.usedIncreaseType.includes('1x2, 1x4') && (
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.PR_1x2_f}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PR_1x4_f}
          </Text>
          <Text style={[styles.resultText, styles.boldText]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{resultString24}</Text>
        </Section>
      )}

      {results.usedIncreaseType.includes('1x3, 1x4') && (
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.PRib_1x3_f}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PRib_1x4_f}
          </Text>
          <Text style={[styles.resultText, styles.boldText]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{resultString43}</Text>
        </Section>
      )}

      {results.usedIncreaseType.includes('1x2, 1x1') && (
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.PR_1x2_f}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_f}
          </Text>
          <Text style={[styles.resultText, styles.boldText]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{resultString21}</Text>
        </Section>
      )}
      {results.usedIncreaseType.includes('1x4, 1x1') && (
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PR_1x4_f}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_f}
          </Text>
        </Section>
      )}
      {results.usedIncreaseType.includes('1x2, 1x3') && (
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.prib_1x2_f}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.prib_1x3_f}
          </Text>
          <Text style={[styles.resultText, styles.boldText]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{resultString23}</Text>
        </Section>
      )}

      {results.usedIncreaseType.includes('1x3, 1x1') && (
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.prib_1x3_f}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_f}
          </Text>
        </Section>
      )}
      {results.usedIncreaseType.includes('1x4') && (
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PR_1x4_f}
          </Text>
          <Text style={[styles.resultText, styles.boldText]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{results.RowPrib1x4String}</Text>
        </Section>
      )}

      {results.usedIncreaseType.includes('1x1') && (
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_f}
          </Text>
          <Text style={[styles.resultText, styles.boldText]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{results.RowPrib1x1String}</Text>
        </Section>
      )}

      {results.usedIncreaseType.includes('1x2') && (
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.prib_1x2_f}
          </Text>
          <Text style={[styles.resultText, styles.boldText]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{results.RowPrib1x2String}</Text>
        </Section>
      )}
      {results.usedIncreaseType.includes('1x3') && (
        <Section title={i18n.t('option')}>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.prib_1x3_f}
          </Text>
          <Text style={[styles.resultText, styles.boldText]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{results.RowPrib1x3String}</Text>
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
  viewChartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  viewIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: COLORS.WHITE,
  },
  viewChartText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  knitIcon: {
    width: 20,
    height: 20,
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
  indicatorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  chartRowWithMargin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
});

export default Step2AddingStitches;

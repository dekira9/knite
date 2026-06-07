import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';
import ResultStepTitle from './ResultStepTitle';
import { resultTypography } from './resultSharedStyles';
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
  BLUE: '#009FE3',
  ORANGE: '#E76F51',
};

interface Step3BackLengtheningVProps {
  results: any;
  handleScrollToTop1: () => void;
  handleScrollToTop: () => void;
}

const Step3BackLengtheningV = observer(({ 
  results,
  handleScrollToTop1,
  handleScrollToTop
}: Step3BackLengtheningVProps) => {
  return (
    <View style={styles.container}>
      <ResultStepTitle step={3} titleKey="backLengthening" />
      
      {/* УДЛИНЕНИЕ СПИНКИ */}
      <View style={styles.resultCard}>
        <View style={styles.stepHeader}>
          <Text style={styles.subtitle}>{i18n.t('backLengthening')}</Text>
          <View style={styles.indicatorsRow}>
            <View style={[styles.indicator, { backgroundColor: COLORS.BLUE }]} />
          </View>
        </View>
        
        <View style={styles.divider}></View>
        
        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('stitches')}:
          </Text>
          <Text style={styles.boldNumber}>{results.SRostok}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('knitting')}:
          </Text>
          <Image
            source={require('@/assets/images/knitflat.svg')}
            style={styles.knitIcon}
            contentFit="contain"
          />
          
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('rows')}:
          </Text>
          <Text style={styles.boldNumber}>{results.NRostok}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>{i18n.t('start')}:</Text>
          <TouchableOpacity onPress={handleScrollToTop1}>
            <Image
              source={require('@/assets/images/startv.svg')}
              style={styles.startIcon}
              contentFit="contain"
            />
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={styles.horizontalRow}>
            <View style={styles.stitchBox}>
              <View style={styles.orangeIndicator}></View>
              <Text style={styles.resultText}>
                {i18n.t('stitches')}:{'\n'} {results.SKfrontV}
              </Text>
            </View>
            {/* round*/}
            <View style={styles.roundIndicator}>
              <View style={styles.roundDot}></View>
            </View>
            <View style={styles.stitchBox}>
              <View style={styles.purpleIndicator}></View>
              <Text style={styles.resultText}>
                {i18n.t('stitches')}:{'\n'} {results.SFrontV+2*results.SfxV}
              </Text>
            </View>
            {/* round*/}
            <View style={styles.roundIndicator}>
              <View style={styles.roundDot}></View>
            </View>
            <View style={styles.stitchBox}>
              <View style={styles.orangeIndicator}></View>
              <Text style={styles.resultText}>
                {i18n.t('stitches')}:{'\n'} {results.SKfrontV}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
      
      {/*разделение на части*/}
      <View style={styles.resultCard}>
        <View style={styles.stepHeader}>
          <Text style={styles.subtitle}>{i18n.t('parts')}</Text>
          <TouchableOpacity
            onPress={handleScrollToTop}
            style={styles.planButton}
          >
            <Image
              source={require('@/assets/images/planVaz44.png')}
              style={styles.planImage}
              contentFit="contain"
            />
            <Text style={styles.planText}>
              {i18n.t('plan')}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.divider}></View>

        <View style={styles.chartRow}>
          <Text style={styles.chartTitle}>
            {i18n.t('back')}
          </Text>
          <View style={[styles.indicator, { backgroundColor: COLORS.BLUE, width: 34, height: 17 }]} />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('stitches')}:
          </Text>
          <Text style={styles.boldNumber}>{results.SRostok}</Text>
        </View>

        <View style={styles.divider}></View>

        <View style={styles.chartRow}>
          <Text style={styles.chartTitle}>
            {i18n.t('front')}
          </Text>
          <View style={[styles.indicatorLarge, { backgroundColor: COLORS.PINK, borderLeftWidth: 7, borderRightWidth: 7, borderLeftColor: COLORS.ORANGE, borderRightColor: COLORS.ORANGE }]} />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('stitches')}:
          </Text>
          <Text style={styles.boldNumber}>{results.SFrontV + 2 * results.SfxV + 2 * results.SKfrontV}</Text>
        </View>

        <View style={styles.frontPartsLayout}>
          <View style={styles.frontPartsContainer}>
            <View style={styles.frontPartsItem}>
              <View style={styles.orangeIndicator}></View>
              <Text style={[styles.resultText, styles.frontPartsText]}>
                {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
                {results.SKfrontV}
              </Text>
            </View>

            <View style={[styles.textBox, { backgroundColor: COLORS.PINK, justifyContent: 'center' }]}>
              <Text style={[styles.resultText, styles.frontPartsTextWithMargin]}>
                {i18n.t('stitches')}: {'\n'}
                {results.SFrontV + 2 * results.SfxV}
              </Text>
            </View>

            <View style={styles.frontPartsItemWithMargin}>
              <View style={styles.orangeIndicator}></View>
              <Text style={[styles.resultText, styles.frontPartsText]}>
                {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
                {results.SKfrontV}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider}></View>

        <View style={styles.chartRow}>
          <Text style={styles.chartTitle}>
            {i18n.t('sleeve')}
          </Text>
          <View style={[styles.indicatorLarge, { backgroundColor: COLORS.GREEN, borderLeftWidth: 7, borderRightWidth: 7, borderLeftColor: COLORS.ORANGE, borderRightColor: COLORS.ORANGE }]} />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('stitches')}:
          </Text>
          <Text style={styles.boldNumber}>{results.SaV + 2 * results.SfxV + 2 * results.SKaV}</Text>
        </View>
        
        <View style={styles.sleevePartsLayout}>
          <View style={styles.sleevePartsContainer}>
            <View style={styles.sleevePartsItem}>
              <View style={styles.orangeIndicator}></View>
              <Text style={[styles.resultText, styles.sleevePartsText]}>
                {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
                {results.SKaV}
              </Text>
            </View>

            <View style={[styles.textBox, { backgroundColor: COLORS.GREEN, justifyContent: 'center' }]}>
              <Text style={[styles.resultText, styles.sleevePartsTextWithMargin]}>
                {i18n.t('stitches')}: {'\n'}
                {results.SaV + 2 * results.SfxV}
              </Text>
            </View>

            <View style={styles.sleevePartsItemWithMargin}>
              <View style={styles.orangeIndicator}></View>
              <Text style={[styles.resultText, styles.sleevePartsText]}>
                {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
                {results.SKaV}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  resultCard: {
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subtitle: {
    ...resultTypography.sectionTitle,
  },
  leftLabel: {
    ...resultTypography.label,
  },
  boldNumber: {
    ...resultTypography.value,
  },
  knitIcon: {
    width: 25,
    height: 25,
    marginLeft: 0,
    marginRight: 0,
  },
  startIcon: {
    width: 20,
    height: 20,
    marginLeft: 0,
    marginRight: 0,
  },
  resultText: {
    fontSize: 12,
    marginBottom: 0,
    textAlign: 'center' as const,
    color: COLORS.TEXT_PRIMARY,
  },
  textBox: {
    borderWidth: 1,
    borderColor: COLORS.BLACK,
    padding: 3,
    borderRadius: 5,
    marginBottom: 3,
    marginLeft:3,
    marginRight:3,
    justifyContent: 'center',
  },
  // Common layout styles
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginLeft: 0,
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
  indicatorLarge: {
    width: 34,
    height: 17,
    marginLeft: 10,
    borderWidth: 1,
  },
  orangeIndicator: {
    width: 17,
    height: 17,
    backgroundColor: COLORS.ORANGE,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  purpleIndicator: {
    width: 17,
    height: 17,
    backgroundColor: COLORS.PURPLE,
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  // Box styles
  stitchBox: {
    marginBottom: 0,
    marginLeft: 0,
    padding: 10,
    backgroundColor: COLORS.GRAY,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  roundDot: {
    width: 17,
    height: 17,
    borderRadius: 8,
    marginLeft: 0,
    borderWidth: 2,
    borderColor: COLORS.DIVIDER,
  },
  horizontalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  // Parts section styles
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  planImage: {
    width: 30,
    height: 30,
  },
  planText: {
    marginLeft: 5,
    color: COLORS.PRIMARY,
    textDecorationLine: 'underline',
  },
  // Front parts layout
  frontPartsLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 3,
  },
  frontPartsContainer: {
    flexDirection: 'row',
  },
  frontPartsItem: {
    marginBottom: 1,
    marginRight: 1,
    padding: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frontPartsItemWithMargin: {
    marginBottom: 1,
    marginLeft: 1,
    padding: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  frontPartsText: {
    textAlign: 'center',
    fontSize: 12,
  },
  frontPartsTextWithMargin: {
    textAlign: 'center',
    marginLeft: 5,
    fontSize: 12,
  },
  // Sleeve parts layout
  sleevePartsLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 3,
  },
  sleevePartsContainer: {
    flexDirection: 'row',
  },
  sleevePartsItem: {
    marginBottom: 1,
    marginLeft: 0,
    padding: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  sleevePartsItemWithMargin: {
    marginBottom: 1,
    marginLeft: 0,
    padding: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  sleevePartsText: {
    textAlign: 'center',
    fontSize: 12,
  },
  sleevePartsTextWithMargin: {
    textAlign: 'center',
    marginLeft: 5,
    fontSize: 12,
  },
});

export default Step3BackLengtheningV;


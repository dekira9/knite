import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';
import ResultStepTitle from './ResultStepTitle';
import { resultTypography } from './resultSharedStyles';

// Color constants (aligned with other steps)
const COLORS = {
  BACKGROUND: '#F8F9FA',
  CARD: '#ffffff',
  TEXT_PRIMARY: '#1A1A1A',
  TEXT_SECONDARY: '#6b7280',
  BLACK: '#000',
  DIVIDER: '#CCCCCC',
  GRAY: '#E6E6E6',
  UNDERARM: '#FF00FF',
};

interface Step4SeparatingSleevesVProps {
  results: any;
  handleScrollToTop1: () => void;
}

const Step4SeparatingSleevesV = observer(({ 
  results, 
  handleScrollToTop1 
}: Step4SeparatingSleevesVProps) => {
  return (
    <View style={styles.container}>
      <ResultStepTitle step={4} titleKey="separatingBodyAndSleeves" />
      
      <View style={styles.resultCard}>
        <View style={styles.separatingHeader}>
          <Text style={styles.subtitle}>{i18n.t('separatingBodyAndSleeves')}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>{i18n.t('start')}:</Text>
          <View style={styles.startRow}>
            <TouchableOpacity onPress={handleScrollToTop1}>
              <Image
                source={require('@/assets/images/startend.svg')}
                style={styles.startendImage}
                contentFit="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>{i18n.t('knitting')}:</Text>
              <Image
              source={require('@/assets/images/knitcircle.svg')}
              style={styles.KnitCircleImage}
              contentFit="contain"
            />
         </View>

        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>{i18n.t('rows')}:</Text>
          
            <Text style={styles.boldNumber}>1</Text>
           
        </View>


        <View style={styles.divider}></View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={styles.separatingLayout}>
            <View style={styles.stitchBox}>
              <Text style={styles.resultText}>{i18n.t('back')}</Text>
              <View style={styles.grayIndicator}></View>
              <Text style={styles.resultText}>
                {i18n.t('stitches')}: {results.SRostok}
              </Text>
            </View>
            {/* round*/}
            <View style={styles.roundIndicator}>
              <View style={styles.roundDot}></View>
            </View>

            <View style={styles.stitchBox}>
              <View style={styles.textBox}>
                <Text style={styles.textInsideBox}>{i18n.t('separateTheSleeve')}</Text>
              </View>
              <Text style={styles.resultText}>
                {i18n.t('stitches')}: {results.SaV + 2 * results.SfxV + 2 * results.SKaV}
              </Text>
            </View>

            {/* round*/}
            <View style={styles.roundIndicator}>
              <View style={styles.roundDot}></View>
            </View>

            <View style={styles.stitchBox}>
              <View style={styles.magentaIndicator}></View>
              <Text style={styles.resultText}>
                {(i18n.t('stitches') || 'stitches')}: {results.SPodr || ''}
              </Text>
              <Text style={styles.createText}>{i18n.t('create') || 'create'}</Text>
              <Text style={styles.createText}>{i18n.t('underarmStitches') || 'underarmStitches'}</Text>
            </View>
            {/* round*/}
            <View style={styles.roundIndicator}>
              <View style={styles.roundDot}></View>
            </View>

            <View style={styles.stitchBox}>
              <Text style={styles.resultText}>{i18n.t('front')}</Text>
              <View style={styles.grayIndicator}></View>
              <Text style={styles.resultText}>
                {i18n.t('stitches')}: {results.SRostok}
              </Text>
            </View>
            {/* round*/}
            <View style={styles.roundIndicator}>
              <View style={styles.roundDot}></View>
            </View>

            <View style={styles.stitchBox}>
              <View style={styles.textBox}>
                <Text style={styles.textInsideBox}>{i18n.t('separateTheSleeve')}</Text>
              </View>
              <Text style={styles.resultText}>
                {i18n.t('stitches')}: {results.SaV + 2 * results.SfxV + 2 * results.SKaV}
              </Text>
            </View>
            {/* round*/}
            <View style={styles.roundIndicator}>
              <View style={styles.roundDot}></View>
            </View>
            <View style={styles.stitchBox}>
              <View style={styles.magentaIndicator}></View>
              <Text style={styles.resultText}>
                {(i18n.t('stitches') || 'stitches')}: {results.SPodr || ''}
              </Text>
              <Text style={styles.createText}>{i18n.t('create') || 'create'}</Text>
              <Text style={styles.createText}>{i18n.t('underarmStitches') || 'underarmStitches'}</Text>
            </View>
          </View>
        </ScrollView>
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
    backgroundColor: COLORS.CARD,
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
  resultText: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center' as const,
    color: COLORS.TEXT_PRIMARY,
  },

  KnitCircleImage: {
    width: 25,
    height: 25,
    marginLeft: 0,
    marginRight: 0,
  },
  startendImage: {
    width: 30,
    height: 20,
  },
  textBox: {
    borderWidth: 1,
    borderColor: COLORS.BLACK,
    padding: 3,
    borderRadius: 5,
    marginBottom: 3,
    justifyContent: 'center',
  },
  textInsideBox: {
    fontSize: 12,
    color: COLORS.BLACK,
  },
  createText: {
    fontSize: 12,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  // Common layout styles
  separatingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  startRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  knittingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  divider: {
    height: 0.5,
    backgroundColor: COLORS.DIVIDER,
    marginTop: 5,
    marginBottom: 20,
  },
  separatingLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  // Gray indicator
  grayIndicator: {
    width: 17,
    height: 17,
    backgroundColor: COLORS.DIVIDER,
    marginLeft: 10,
    borderWidth: 1,
  },
  // Underarm indicator
  magentaIndicator: {
    width: 17,
    height: 17,
    backgroundColor: COLORS.UNDERARM,
    marginLeft: 10,
    borderWidth: 1,
  },
});

export default Step4SeparatingSleevesV;


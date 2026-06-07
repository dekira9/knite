import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';
import ResultStepTitle from './ResultStepTitle';

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

interface Step4SeparatingSleevesProps {
  results: any;
  handleScrollToTop1: () => void;
}

const Step4SeparatingSleeves = observer(({ 
  results, 
  handleScrollToTop1 
}: Step4SeparatingSleevesProps) => {
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
                style={styles.startvImage}
                contentFit="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>{i18n.t('knitting')}:</Text>
            <Image
              source={require('@/assets/images/knitcircle.svg')}
              style={styles.knitIcon}
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
            <Text style={styles.textinBox}>{i18n.t('back')}</Text>
            <View style={styles.grayIndicator}></View>
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}: {results.SRostok}
            </Text>
          </View>
          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>

          <View style={styles.stitchBox}>
            <View style={styles.textBox}>
              <Text style={styles.smallText}>{i18n.t('separateTheSleeve')}</Text>
            </View>

            <Text style={styles.textinBox}>
              {i18n.t('stitches')}: {results.Sa + 2 * results.Sfx + 2 * results.SKa}
            </Text>
          </View>

          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>

          <View style={styles.stitchBox}>
            <View style={styles.magentaIndicator}></View>
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}: {results.SPodr} </Text>
              <Text style={styles.smallText}>{i18n.t('create')}</Text>
              <Text style={styles.smallText}>{i18n.t('underarmStitches')}</Text>
            
          </View>
          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>

          <View style={styles.stitchBox}>
            <Text style={styles.textinBox}>{i18n.t('front')}</Text>
            <View style={styles.grayIndicator}></View>
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}: {results.SRostok}
            </Text>
          </View>
          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>

          <View style={styles.stitchBox}>
            <View style={styles.textBox}>
              <Text style={styles.smallText}>{i18n.t('separateTheSleeve')}</Text>
            </View>
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}: {results.Sa + 2 * results.Sfx + 2 * results.SKa}
            </Text>
          </View>
          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>
          <View style={styles.stitchBox}>
            <View style={styles.magentaIndicator}></View>
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}: {results.SPodr}</Text>
              <Text style={styles.smallText}>{i18n.t('create')}</Text>
              <Text style={styles.smallText}>{i18n.t('underarmStitches')}</Text>
            
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
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
    color: COLORS.TEXT_PRIMARY,
  },
  resultCard: {
    backgroundColor: COLORS.CARD,
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
textinBox: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center' as const,
    color: COLORS.TEXT_PRIMARY,
  },
   smallText: {
    fontSize: 12,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  knitIcon: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },
  startvImage: {
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
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: COLORS.GRAY,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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

export default Step4SeparatingSleeves;

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';
import { resultTypography } from './resultSharedStyles';

// Color constants
const COLORS = {
  PURPLE: '#A29FCF',
  PINK: '#FDCFE1',
  GREEN: '#DAEDBD',
  GRAY: '#E6E6E6',
  PRIMARY: '#009FE3',
  WHITE: '#ffffff',
  BLACK: '#000',
  TEXT_PRIMARY: '#1A1A1A',
  TEXT_SECONDARY: '#6b7280',
  BACKGROUND: '#F8F9FA',
  DIVIDER: '#CCCCCC',
  BLUE: '#009FE3',
  ORANGE: '#E76F51',
  UNDERARM: '#FF00FF',
  SLEEVE_GREEN: '#95C11F',
};

interface ResultStepVProps {
  results: any;
}

const ResultStepV = observer(({ 
  results
}: ResultStepVProps) => {
  return (
    <View style={styles.container}>
      {/* ИТОГИ ИТОГИ ИТОГИ*/}
      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>
          {i18n.t('Result')}
        </Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={styles.resultContainer}>
            <Image
              source={require('@/assets/images/sleevebodyV2.png')}
              style={styles.resultImage}
            />
          </View>
        </ScrollView>
        
        {/* корпус итоги*/}
        <View style={styles.chartRow}>
          <Text style={styles.corpusTitle}>{i18n.t('corpus')}</Text>
          <View style={styles.blueIndicatorLarge}></View>
          
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('stitches')}:
          </Text>
          <Text style={styles.boldNumber}>
            {results.SRostok * 2 + results.SPodr * 2}
          </Text>
        </View>
        
        {/*скролл корпус*/}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={styles.corpusScrollRow}>
            <View style={styles.corpusBox}>
              <Text style={styles.textinBox}>
                {i18n.t('back')}
              </Text>
              <View style={styles.smallGrayIndicator}></View>
              <View style={styles.blueIndicator}></View>
              <Text style={styles.textinBox}>
                {i18n.t('stitches')}: {results.SRostok}
              </Text>
            </View>
            
            {/*  round*/}
            <View style={styles.roundIndicator}>
              <View style={styles.roundDot}></View>
            </View>

            <View style={styles.corpusBox}>
              <View style={styles.smallMagentaIndicator}></View>
              <View style={styles.blueIndicator}></View>
              <Text style={styles.textinBox}>
                {i18n.t('stitches')}: {results.SPodr} {'\n'}
                <Text style={styles.smallText}>{i18n.t('underarmStitches')}</Text>
              </Text>
            </View>
            
            {/*  round*/}
            <View style={styles.roundIndicator}>
              <View style={styles.roundDot}></View>
            </View>

            <View style={styles.corpusBox}>
              <Text style={styles.textinBox}>
                {i18n.t('front')}
              </Text>
              <View style={styles.smallGrayIndicator}></View>
              <View style={styles.blueIndicator}></View>
              <Text style={styles.textinBox}>
                {i18n.t('stitches')}: {results.SRostok}
              </Text>
            </View>
            
            {/*  round*/}
            <View style={styles.roundIndicator}>
              <View style={styles.roundDot}></View>
            </View>

            <View style={styles.corpusBox}>
              <View style={styles.smallMagentaIndicator}></View>
              <View style={styles.blueIndicator}></View>
              <Text style={styles.textinBox}>
                {i18n.t('stitches')}: {results.SPodr} {'\n'}
                <Text style={styles.smallText}>{i18n.t('underarmStitches')}</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
        
        {/* рукав итоги*/}
        <View style={styles.chartRow}>
          <View style={styles.resultHeaderRow}>
          <Text style={styles.sleeveTitle}>{i18n.t('sleeve')}</Text>
          <Text style={[styles.leftLabel]}>{'  '}
              {i18n.t('left')}
            </Text>
            </View>
          <View style={styles.greenIndicatorLarge}></View>
        </View>
        <View style={styles.infoRow}>
          
          <Text style={styles.leftLabel}>
            {i18n.t('stitches')}:
          </Text>
          <Text style={styles.boldNumber}>
           {results.SaV + 2 * results.SfxV + 2 * results.SKaV + results.SPodr + results.NRostok * 0.5}
          </Text>
        </View>
        
        {/*скролл рукав*/}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={styles.sleeveScrollRow}>
            <View style={styles.sleeveBox}>
            <Text style={styles.textinBox}>1</Text>
              <View style={styles.textBox}>
                <Text style={styles.smallText}>
                  {i18n.t('sleeve')}
                </Text>
              </View>
              <Text style={styles.textinBox}>
                {i18n.t('stitches')}: {results.SaV + 2 * results.SfxV + 2 * results.SKaV}
              </Text>
            </View>
            
            {/*  round*/}
            <View style={styles.roundIndicator}>
              <View style={styles.roundDot}></View>
            </View>

            <View style={styles.sleeveBox}>
            <Text style={styles.textinBox}>2</Text>
              <View style={styles.indicatorRow}>
                <View style={styles.smallVerticalGrayIndicator}></View>
                <View style={styles.greenIndicator}></View>
              </View>
              <Text style={styles.textinBox}>
                {i18n.t('stitches')}: {results.NRostok * 0.5}
              </Text>
              <Text style={styles.smallText}>{i18n.t('create') || 'create'}</Text>
              <Text style={styles.smallText}>{i18n.t('fromTheBack') || 'fromTheBack'}</Text>
            </View>
            
            {/*  round*/}
            <View style={styles.roundIndicator}>
              <View style={styles.roundDot}></View>
            </View>

            <View style={styles.sleeveBox}>
            <Text style={styles.textinBox}>3</Text>
              <View style={styles.greenIndicator}></View>
              <View style={styles.smallMagentaIndicator}></View>
              <Text style={styles.textinBox}>
                {i18n.t('stitches')}: {results.SPodr} {'\n'}
                <Text style={styles.smallText}>{i18n.t('create')}</Text>
              </Text>
            </View>
          </View>
        </ScrollView>

         {/* рукав итоги*/}
         <View style={styles.chartRow}>
          <View style={styles.resultHeaderRow}>
          <Text style={styles.sleeveTitle}>{i18n.t('sleeve')}</Text>
          <Text style={[styles.leftLabel]}>{'  '}
              {i18n.t('right')}
            </Text>
            </View>
          <View style={styles.greenIndicatorLarge}></View>
        </View>
        <View style={styles.infoRow}>
          
          <Text style={styles.leftLabel}>
            {i18n.t('stitches')}:
          </Text>
          <Text style={styles.boldNumber}>
           {results.SaV + 2 * results.SfxV + 2 * results.SKaV + results.SPodr + results.NRostok * 0.5}
          </Text>
        </View>
        
        {/*скролл рукав*/}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={styles.sleeveScrollRow}>

          <View style={styles.sleeveBox}>
              <View style={styles.indicatorRow}>
                <View style={styles.smallVerticalGrayIndicator}></View>
                <View style={styles.greenIndicator}></View>
              </View>
              <Text style={styles.textinBox}>
                {i18n.t('stitches')}: {results.NRostok * 0.5}
              </Text>
              <Text style={styles.smallText}>{i18n.t('create') || 'create'}</Text>
              <Text style={styles.smallText}>{i18n.t('fromTheBack') || 'fromTheBack'}</Text>
            </View>

            {/*  round*/}
            <View style={styles.roundIndicator}>
              <View style={styles.roundDot}></View>
            </View>

            <View style={styles.sleeveBox}>
              <View style={styles.textBox}>
                <Text style={styles.smallText}>
                  {i18n.t('sleeve')}
                </Text>
              </View>
              <Text style={styles.textinBox}>
                {i18n.t('stitches')}: {results.SaV + 2 * results.SfxV + 2 * results.SKaV}
              </Text>
            </View>
            
            {/*  round*/}
            <View style={styles.roundIndicator}>
              <View style={styles.roundDot}></View>
            </View>

            <View style={styles.sleeveBox}>
              <View style={styles.greenIndicator}></View>
              <View style={styles.smallMagentaIndicator}></View>
              <Text style={styles.textinBox}>
                {i18n.t('stitches')}: {results.SPodr} {'\n'}
                <Text style={styles.smallText}>{i18n.t('create')}</Text>
              </Text>
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
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 0,
  },
  resultContainer: {
    
   width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  resultImage: {
    
    width: '100%',
    aspectRatio: 2,
    height: undefined,
    resizeMode: 'contain',
    padding: 150,
  },
  resultText: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center' as const,
    color: COLORS.TEXT_PRIMARY,
  },
  createText: {
    fontSize: 12,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
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
    textAlign: 'center',
  },
  // Corpus section styles
  corpusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 0,
    marginBottom: 10,
  },
  corpusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 0,
    color: COLORS.TEXT_PRIMARY,
  },
  corpusStitchesText: {
    fontSize: 14,
    textAlign: 'center',
    marginLeft: 10,
    color: COLORS.TEXT_PRIMARY,
  },
  blueIndicatorLarge: {
    width: 34,
    height: 17,
    backgroundColor: COLORS.BLUE,
    marginLeft: 0,
    borderWidth: 1,
  },
  corpusScrollRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  corpusBox: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: COLORS.GRAY,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: COLORS.BLUE,
    borderWidth: 1,
    justifyContent: 'center',
  },
  blueIndicator: {
    width: 17,
    height: 17,
    backgroundColor: COLORS.BLUE,
    marginLeft: 0,
    borderWidth: 1,
  },
  smallGrayIndicator: {
    width: 17,
    height: 8,
    backgroundColor: COLORS.DIVIDER,
    marginLeft: 0,
    borderWidth: 1,
  },
  smallMagentaIndicator: {
    width: 17,
    height: 8,
    backgroundColor: COLORS.UNDERARM,
    marginLeft: 0,
    borderWidth: 1,
  },
  // Sleeve section styles
  sleeveHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  sleeveTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 0,
    color: COLORS.TEXT_PRIMARY,
  },
  sleeveStitchesText: {
    fontSize: 14,
    textAlign: 'center',
    marginLeft: 10,
    color: COLORS.TEXT_PRIMARY,
  },
  greenIndicatorLarge: {
    width: 34,
    height: 17,
    backgroundColor: COLORS.SLEEVE_GREEN,
    marginLeft: 10,
    borderWidth: 1,
  },
  sleeveScrollRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sleeveBox: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: COLORS.GRAY,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: COLORS.SLEEVE_GREEN,
    borderWidth: 1,
    justifyContent: 'center',
  },
  greenIndicator: {
    width: 17,
    height: 17,
    backgroundColor: COLORS.SLEEVE_GREEN,
    marginLeft: 0,
    borderWidth: 1,
  },
  smallVerticalGrayIndicator: {
    width: 8,
    height: 17,
    backgroundColor: COLORS.DIVIDER,
    marginLeft: 0,
    borderWidth: 1,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  leftLabel: {
    ...resultTypography.label,
  },
  boldNumber: {
    ...resultTypography.value,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  resultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
});

export default ResultStepV;



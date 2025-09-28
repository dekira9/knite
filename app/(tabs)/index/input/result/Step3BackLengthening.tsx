import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';

interface Step3BackLengtheningProps {
  results: any;
  handleScrollToTop1: () => void;
  handleScrollToTop: () => void;
}

const Step3BackLengthening = observer(({ 
  results, 
  handleScrollToTop1, 
  handleScrollToTop 
}: Step3BackLengtheningProps) => {
  return (
    <>
      {/* УДЛИНЕНИЕ СПИНКИ */}
      <View style={styles.resultCard}>
        <View style={styles.step3Header}>
          <Text style={[styles.textStep, styles.textCenter]}>
            {i18n.t('step')}3
          </Text>
        </View>
        <View style={styles.backLengtheningHeader}>
          <Text style={styles.subtitle}>{i18n.t('backLengthening')}</Text>
          <View style={styles.blueIndicator}></View>
        </View>

        <View style={styles.backLengtheningInfo}>
          <Text style={styles.resultText}>
            {i18n.t('stitches')}: {results.SRostok}
          </Text>
          </View>
          <View style={styles.backLengtheningKnitting}>
          <Text style={styles.resultText}>
        {i18n.t('knitting')}
        </Text>
          <Image
            source={require('@/assets/images/knitflat.svg')}
            style={styles.styleKnitCircleImage}
            contentFit="contain"
          />
          <Text style={styles.resultText}>
            {i18n.t('rows')}: {results.NRostok}
          </Text>
        </View>

        <View style={styles.backLengtheningStart}>
          <Text style={styles.resultText}>{i18n.t('start')}</Text>
          <TouchableOpacity onPress={handleScrollToTop1}>
          <Image
            source={require('@/assets/images/startv.svg')}
            style={styles.startvImage}
            contentFit="contain"
          />
          </TouchableOpacity>
          <Text style={styles.resultText}> : </Text>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <View style={styles.stitchBox}>
              <View style={styles.orangeIndicator}></View>
              <Text style={styles.resultText}>
                {i18n.t('stitches')}: {results.SKfront}
              </Text>
            </View>
            {/* round*/}
            <View style={styles.roundIndicator}>
              <View style={styles.roundDot}></View>
            </View>
            <View style={styles.stitchBox}>
              <View style={styles.purpleIndicator}></View>
              <Text style={styles.resultText}>
                {i18n.t('stitches')}: {results.SFrontO + 2 * results.Sfx}
              </Text>
            </View>
            {/* round*/}
            <View style={styles.roundIndicator}>
              <View style={styles.roundDot}></View>
            </View>
            <View style={styles.stitchBox}>
              <View style={styles.orangeIndicator}></View>
              <Text style={styles.resultText}>
                {i18n.t('stitches')}: {results.SKfront}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
      
      {/*разделение на части*/}
      <View style={styles.resultCard}>
        <View style={styles.partsHeader}>
          <Text style={styles.subtitle}>{i18n.t('parts')}</Text>
          <TouchableOpacity
            onPress={handleScrollToTop}
            style={styles.planButton}
          >
            <Image
              source={require('../../../../../assets/images/planOaz3.png')}
              style={styles.planImage}
              contentFit="contain"
            />
            <Text style={[styles.resultText, styles.planText]}>
              {i18n.t('plan')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.backSection}>
          <Text style={[styles.resultText, styles.backSectionBold]}>
            {i18n.t('back')}
          </Text>
          <View style={styles.blueIndicatorLarge}></View>
          <Text style={[styles.resultText, styles.backSectionText]}>
            {i18n.t('stitches')}:{results.SRostok}
          </Text>
        </View>

        {/*перед*/}

        <View style={styles.frontSection}>
          <Text style={[styles.resultText, styles.frontSectionBold]}>
            {i18n.t('front')}
          </Text>
          <View style={styles.pinkIndicatorLarge}></View>
          <Text style={[styles.resultText, styles.frontSectionText]}>
            {i18n.t('stitches')}:{results.SFrontO + 2 * results.Sfx + 2 * results.SKfront}
          </Text>
        </View>

        <View style={styles.frontPartsLayout}>
          <View style={styles.frontPartsContainer}>
            <View style={styles.frontPartsItem}>
              <View style={styles.orangeIndicator}></View>
              <Text style={[styles.resultText, styles.frontPartsText]}>
                {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
                {results.SKfront}
              </Text>
            </View>

            <View style={[styles.textBox, { backgroundColor: '#FDCFE1', justifyContent: 'center' }]}>
              <Text style={[styles.resultText, styles.frontPartsTextWithMargin]}>
                {i18n.t('stitches')}: {'\n'}
                {results.SFrontO + 2 * results.Sfx}
              </Text>
            </View>

            <View style={styles.frontPartsItemWithMargin}>
              <View style={styles.orangeIndicator}></View>
              <Text style={[styles.resultText, styles.frontPartsText]}>
                {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
                {results.SKfront}
              </Text>
            </View>
          </View>
        </View>

        {/*рукав*/}
        <View style={styles.sleeveSection}>
          <Text style={[styles.resultText, styles.sleeveSectionBold]}>
            {i18n.t('sleeve')}
          </Text>
          <View style={styles.greenIndicatorLarge}></View>
          <Text style={[styles.resultText, styles.sleeveSectionText]}>
            {i18n.t('stitches')}:{results.Sa + 2 * results.Sfx + 2 * results.SKa}
          </Text>
        </View>
        {/*...*/}
        <View style={styles.sleevePartsLayout}>
          <View style={styles.sleevePartsContainer}>
            <View style={styles.sleevePartsItem}>
              <View style={styles.orangeIndicator}></View>
              <Text style={[styles.resultText, styles.sleevePartsText]}>
                {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
                {results.SKa}
              </Text>
            </View>

            <View style={[styles.textBox, { backgroundColor: '#DAEDBD', justifyContent: 'center' }]}>
              <Text style={[styles.resultText, styles.sleevePartsTextWithMargin]}>
                {i18n.t('stitches')}: {'\n'}
                {results.Sa + 2 * results.Sfx}
              </Text>
            </View>

            <View style={styles.sleevePartsItemWithMargin}>
              <View style={styles.orangeIndicator}></View>
              <Text style={[styles.resultText, styles.sleevePartsText]}>
                {i18n.t('raglanline').replace(' ', '\n')}: {'\n'}
                {results.SKa}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  resultCard: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center' as const,
  },
  styleKnitCircleImage: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  startvImage: {
    width: 30,
    height: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  textBox: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 3,
    borderRadius: 5,
    marginBottom: 3,
  },
  textStep: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1A1A1A',
  },
  // Common layout styles
  step3Header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
    width: '100%',
  },
  textCenter: {
    textAlign: 'center',
  },
  backLengtheningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backLengtheningInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backLengtheningKnitting: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backLengtheningStart: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  // Indicator styles
  blueIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#009FE3',
    marginLeft: 10,
    borderWidth: 1,
  },
  orangeIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#E76F51',
    marginLeft: 10,
    borderWidth: 1,
  },
  purpleIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#A29FCF',
    marginLeft: 10,
    borderWidth: 1,
  },
  // Box styles
  stitchBox: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
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
    borderColor: '#CCCCCC',
  },
  // Parts section styles
  partsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
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
    color: 'blue',
    textDecorationLine: 'underline',
  },
  // Back section
  backSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  backSectionBold: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  backSectionText: {
    textAlign: 'center',
    marginLeft: 10,
  },
  blueIndicatorLarge: {
    width: 34,
    height: 17,
    backgroundColor: '#009FE3',
    marginLeft: 10,
    borderWidth: 1,
  },
  // Front section
  frontSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
    marginBottom: 1,
  },
  frontSectionBold: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  frontSectionText: {
    textAlign: 'center',
    marginLeft: 10,
  },
  pinkIndicatorLarge: {
    width: 34,
    height: 17,
    backgroundColor: '#FDCFE1',
    marginLeft: 10,
    borderWidth: 1,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 1,
    borderLeftColor: '#E76F51',
    borderRightColor: '#E76F51',
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
  },
  frontPartsTextWithMargin: {
    textAlign: 'center',
    marginLeft: 5,
  },
  // Sleeve section
  sleeveSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 1,
  },
  sleeveSectionBold: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  sleeveSectionText: {
    textAlign: 'center',
    marginLeft: 10,
  },
  greenIndicatorLarge: {
    width: 34,
    height: 17,
    backgroundColor: '#DAEDBD',
    marginLeft: 10,
    borderWidth: 1,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 1,
    borderLeftColor: '#E76F51',
    borderRightColor: '#E76F51',
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
  },
  sleevePartsTextWithMargin: {
    textAlign: 'center',
    marginLeft: 5,
  },
});

export default Step3BackLengthening;

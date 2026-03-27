import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';

interface Step1RibbingVProps {
  results: any;
  NRrezV: number;
  SpribVcorn: number;
  resultStringV01: string;
  resultStringV11: string;
  resultStringV12: string;
  resultStringV22: string;
  resultStringV23: string;
}

const Step1RibbingV = observer(({ 
  results, 
  NRrezV, 
  SpribVcorn, 
  resultStringV01, 
  resultStringV11, 
  resultStringV12, 
  resultStringV22,
  resultStringV23,
}: Step1RibbingVProps) => {
  const navigation = useNavigation();

  const navigateToRibbingCopyV = () => {
    (navigation as any).navigate('Raglan', { screen: 'RibbingV' });
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.stepTitle}>{i18n.t('step')} 1</Text>
      
      <View style={styles.resultCard}>
        <View style={styles.ribbingHeader}>
          <Text style={styles.subtitle}>{i18n.t('collarKnitting')}</Text>
          <View style={[styles.yellowIndicator, {borderTopWidth: 1}]}></View>
        </View>
        
        <View style={styles.chartRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('knittingChart')}:
          </Text>
          <TouchableOpacity style={styles.viewChartButton} onPress={navigateToRibbingCopyV}>
            <Image
              source={require('@/assets/images/view1.png')}
              style={styles.viewIcon}
              contentFit="contain"
            />
            {/* <Text style={styles.viewChartText}>{i18n.t('viewChart')}</Text> */}
          </TouchableOpacity>
        </View>

        <View style={styles.divider}></View>

        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('stitches')}:
          </Text>
          <View style={{marginLeft: 10}}>
            <Text style={styles.boldNumber}>
              {i18n.t('start')}: {results.SOcutV}
            </Text>
            <Text style={styles.boldNumber}>
              {i18n.t('end')}: {results.SOcutV + results.SpribVcorn * 2}
            </Text>
          </View>
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

        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>
            {i18n.t('rows')}:
          </Text>
          <Text style={styles.boldNumber}> {results.NRrezV}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.leftLabel}>{i18n.t('start')}:</Text>
          <View style={styles.redIndicator}></View>
        </View>

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
        <View style={styles.horizontalRow}>
          <View style={styles.stitchBox}>
            <View style={{alignSelf: 'center', }}>
              <View style={styles.orangeIndicator}></View>
              <View style={styles.yellowIndicator}></View>
            </View>
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}:{'\n'} {results.KV}
            </Text>
          </View>
          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>

          <View style={styles.stitchBox}>
            <View style={styles.greenIndicator}></View>
            <View style={styles.yellowIndicator}></View>
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}:{'\n'} {results.SaV}
            </Text>
          </View>
          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>
          <View style={styles.stitchBox}>
            <View style={styles.orangeIndicator}></View>
            <View style={styles.yellowIndicator}></View>
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}:{'\n'} {results.KV}
            </Text>
          </View>
          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>
          <View style={styles.stitchBox}>
            <View style={styles.purpleIndicator}></View>
            <View style={styles.yellowIndicator}></View>
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}:{'\n'} {results.SFrontV}
            </Text>
          </View>

          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>
          <View style={styles.stitchBox}>
            <View style={styles.orangeIndicator}></View>
            <View style={styles.yellowIndicator}></View>
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}:{'\n'} {results.KV}
            </Text>
          </View>
          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>
          <View style={styles.stitchBox}>
            <View style={styles.greenIndicator}></View>
            <View style={styles.yellowIndicator}></View>
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}:{'\n'} {results.SaV}
            </Text>
          </View>
          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>
          <View style={styles.stitchBox}>
            <View style={styles.orangeIndicator}></View>
            <View style={styles.yellowIndicator}></View>
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}:{'\n'} {results.KV}
            </Text>
          </View>
          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>
          <View style={styles.stitchBox}>
            <View style={styles.pinkIndicator}></View>
            <View style={styles.yellowIndicator}></View>
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}:{'\n'} {results.SV}
            </Text>
          </View>
          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>

          <View style={styles.stitchBox}>
            <View style={{width: 34, height: 14, marginLeft: 0, borderTopWidth: 8.5, borderLeftWidth: 17, borderRightWidth: 17, borderBottomWidth: 8.5, borderTopColor: 'transparent', borderLeftColor: 'yellow', borderRightColor: 'transparent', borderBottomColor: 'yellow'}}></View>
            <Text style={[styles.textinBox, {textAlign: 'center', marginLeft: 10}]}> 
              {i18n.t('adding')}: {'\n'}
              +{results.SpribVcorn}
            </Text>
          </View>
          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>
{/* adding ribbing*/}
          <View style={styles.stitchBox}>
            <View style={{width: 34, height: 14, borderTopWidth: 8.5, borderLeftWidth: 17, borderRightWidth: 17, borderBottomWidth: 8.5, borderTopColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'yellow', borderBottomColor: 'yellow'}}></View>
            <Text style={[styles.textinBox, {textAlign: 'center'}]}>
              {i18n.t('adding')}: {'\n'}
              +{results.SpribVcorn}
            </Text> 
          </View>
          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>
          <View style={styles.stitchBox}>
            <View style={styles.pinkIndicator}></View>
            <View style={styles.yellowIndicator}></View>
            <Text style={styles.textinBox}>
              {i18n.t('stitches')}: {'\n'}{results.SV}
            </Text>
          </View>
          
        </View>
      </ScrollView>

        <View style={styles.stitchBreakdown}>
          <Text style={styles.breakdownText}>
            {i18n.t('stitches')} {i18n.t('back')}: <Text style={styles.boldNumber}>{results.SFrontV}</Text>
          </Text>
          <View style={styles.infoRowStart}>
            <Text style={styles.breakdownText}>
              {i18n.t('stitches')} {i18n.t('front')}:{'  '}
            </Text>
            <View >
              <Text style={styles.boldNumber}>
                {i18n.t('start')}: {results.SVO}
              </Text>
              <Text style={styles.boldNumber}>
                {i18n.t('end')}: {results.SVfront*2}
              </Text>
            </View>
          </View>
          <Text style={styles.breakdownText}>
            {i18n.t('stitches')} {i18n.t('sleeve')}: <Text style={styles.boldNumber}>{results.SaV}</Text>
          </Text>
          <Text style={styles.breakdownText}>
            {i18n.t('stitches')} {i18n.t('raglan')}: <Text style={styles.boldNumber}>{introState.raglanLineWidthV}</Text>
          </Text>
          <Text style={[styles.breakdownText, styles.boldNumber]}>
            {i18n.t('additionsOnOneSide')}: {results.SpribVcorn}
          </Text>
        </View>
        
        {/* Insert the result of calculateVNeckIncreases here */}   
        <View style={styles.resultCard}>
          {
            Math.floor(SpribVcorn / NRrezV) === 1 && SpribVcorn > NRrezV && (
              <Text style={styles.textinBox}>
                {i18n.t('sequenceOfAdditions')}: {resultStringV12}
              </Text>
            )
          }
          {
            Math.floor(SpribVcorn / NRrezV) === 2 && SpribVcorn > 2* NRrezV && (
              <Text style={styles.textinBox}>
                {i18n.t('sequenceOfAdditions')}: {resultStringV23}
              </Text>
            )
          }
          {
            Math.floor(SpribVcorn / NRrezV) === 0 && (
              <Text style={styles.textinBox}>
                {i18n.t('sequenceOfAdditions')}: {resultStringV01}
              </Text>
            ) 
          }
          {
            SpribVcorn === NRrezV && (
              <View style={styles.resultContainer}>
                <Text style={styles.textinBox}>
                  {i18n.t('sequenceOfAdditions')}:
                </Text>

                <View style={styles.sequenceContainer}>
                  <Text style={[styles.textinBox, styles.numbersText]}>
                    {resultStringV11}
                  </Text>
                </View>
              </View>
            )
          }
          {
            SpribVcorn === (2*NRrezV) && (
              <Text style={styles.textinBox}>
                {i18n.t('sequenceOfAdditions')}: {resultStringV22}
              </Text>
            )
          }
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1A1A1A',
  },
  resultCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
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
    color: '#1A1A1A',
  },
  viewChartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors['light'].tint,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  viewIcon: {
    width: 25,
    height: 25,
    marginRight: 6,
    tintColor: '#ffffff',
  },
  viewChartText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  knitIcon: {
    width: 25,
    height: 25,
  },
  leftLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  boldNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1A1A1A',
  },
  stitchBreakdown: {
    marginTop: 20,
  },
  breakdownText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#1A1A1A',
  },
  // Common layout styles
  ribbingHeader: {
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
   
  },
  infoRowStart: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'flex-start',
  },
  // Indicator styles
  yellowIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#FAEE25',
    borderWidth: 1,
    borderTopWidth: 0.5,
  },
  redIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF4444',
    marginLeft: 10,
  },
  orangeIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#E76F51',
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  purpleIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#A29FCF',
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  greenIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#DAEDBD',
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  pinkIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#FDCFE1',
    borderWidth: 1,
    borderBottomWidth: 0.5,
  },
  // Box styles
  stitchBox: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 10,
    backgroundColor: '#E6E6E6',
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
    borderColor: '#CCCCCC',
  },
  horizontalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  textinBox: {
    fontSize: 12,
    marginBottom: 0,
    textAlign: 'center' as const,
    color: '#1A1A1A',
  },
  divider: {
    height: 0.5,
    backgroundColor: '#CCCCCC',
    marginTop: 5,
    marginBottom: 20,
  },
  resultContainer: {
    marginBottom: 10,
  },
  sequenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numbersText: {
    marginLeft: 5,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
 
});

export default Step1RibbingV;


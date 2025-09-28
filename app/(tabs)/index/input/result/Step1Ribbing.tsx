import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';

interface Step1RibbingProps {
  results: any;
}

const Step1Ribbing = observer(({ results }: Step1RibbingProps) => {
  const navigation = useNavigation();

  const navigateToRibbingO = () => {
    navigation.navigate('Raglan', { screen: 'RibbingO' });
  };

  return (
    <View style={styles.resultCard}>
      <View style={styles.stepHeader}>
        <Text style={[styles.textStep, styles.textCenter]}>{i18n.t('step')}1</Text>
      </View>
      <View style={styles.ribbingHeader}>
        <Text style={styles.subtitle}>{i18n.t('ribbing')}</Text>
        <View style={styles.yellowIndicator}></View>
      </View>
      <View style={styles.chartRow}>
        <Text style={[styles.resultText, styles.boldText]}>
          {i18n.t('knittingChart')}:
        </Text>

        <TouchableOpacity onPress={navigateToRibbingO}>
          <Image
            source={require('@/assets/images/view.svg')}
            style={styles.viewImage}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.resultText}>
          {i18n.t('stitches')}: {results.Sgor}
        </Text>
        </View>
        <View style={styles.knittingRow}>
        <Text style={styles.resultText}>
          {i18n.t('knitting')}
        </Text>
        <Image
          source={require('@/assets/images/knitcircle.svg')}
          style={styles.styleKnitCircleImage}
          contentFit="contain"
        />
        <Text style={styles.resultText}>
          {i18n.t('rows')}: {results.NRrez}
        </Text>
      </View>

      <View style={styles.startRow}>
        <Text style={styles.resultText}>{i18n.t('start')}</Text>
        <View style={styles.redIndicator}></View>
        <Text style={styles.resultText}> : </Text>
      </View>

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
        <View style={styles.horizontalRow}>
          <View style={styles.stitchBox}>
            <View style={styles.orangeIndicator}></View>
            <View style={styles.yellowIndicator}></View>
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
            <View style={styles.yellowIndicator}></View>
            <Text style={styles.resultText}>
              {i18n.t('stitches')}: {results.SFrontO}
            </Text>
          </View>
          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>
          <View style={styles.stitchBox}>
            <View style={styles.orangeIndicator}></View>
            <View style={styles.yellowIndicator}></View>
            <Text style={styles.resultText}>
              {i18n.t('stitches')}: {results.K}
            </Text>
          </View>
          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>
          <View style={styles.stitchBox}>
            <View style={styles.greenIndicator}></View>
            <View style={styles.yellowIndicator}></View>
            <Text style={styles.resultText}>
              {i18n.t('stitches')}: {results.Sa}
            </Text>
          </View>

          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>
          <View style={styles.stitchBox}>
            <View style={styles.orangeIndicator}></View>
            <View style={styles.yellowIndicator}></View>
            <Text style={styles.resultText}>
              {i18n.t('stitches')}: {results.K}
            </Text>
          </View>
          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>
          <View style={styles.stitchBox}>
            <View style={styles.pinkIndicator}></View>
            <View style={styles.yellowIndicator}></View>
            <Text style={styles.resultText}>
              {i18n.t('stitches')}: {results.SFrontO}
            </Text>
          </View>
          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>
          <View style={styles.stitchBox}>
            <View style={styles.greenIndicator}></View>
            <View style={styles.yellowIndicator}></View>
            <Text style={styles.resultText}>
              {i18n.t('stitches')}: {results.Sa}
            </Text>
          </View>
          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>

          <View style={styles.stitchBox}>
            <View style={styles.orangeIndicator}></View>
            <View style={styles.yellowIndicator}></View>
            <Text style={styles.resultText}>
              {i18n.t('stitches')}: {results.SKa}
            </Text>
          </View>
        </View>
      </ScrollView>

      <Text style={styles.resultText}>
        {i18n.t('stitches') + ' ' + i18n.t('back')}: {results.SFrontO}
      </Text>
      <Text style={styles.resultText}>
        {i18n.t('stitches') + ' ' + i18n.t('front')}: {results.SFrontO}
      </Text>
      <Text style={styles.resultText}>
        {i18n.t('stitches') + ' ' + i18n.t('sleeve')}: {results.Sa}
      </Text>
      <Text style={styles.resultText}>
        {i18n.t('stitches') + ' ' + i18n.t('raglan')}: {introState.raglanLineWidth}
      </Text>
    </View>
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
  viewImage: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  textStep: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1A1A1A',
  },
  // Common layout styles
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
    width: '100%',
  },
  textCenter: {
    textAlign: 'center',
  },
  ribbingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  knittingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  startRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  horizontalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  // Indicator styles
  yellowIndicator: {
    width: 17,
    height: 17,
    backgroundColor: 'yellow',
    marginLeft: 10,
    borderWidth: 1,
  },
  redIndicator: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: 'red',
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
  greenIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#DAEDBD',
    marginLeft: 10,
    borderWidth: 1,
  },
  pinkIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#FDCFE1',
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
});

export default Step1Ribbing;

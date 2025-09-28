import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';

interface Step4SeparatingSleevesProps {
  results: any;
  handleScrollToTop1: () => void;
}

const Step4SeparatingSleeves = observer(({ 
  results, 
  handleScrollToTop1 
}: Step4SeparatingSleevesProps) => {
  return (
    <View style={styles.resultCard}>
      <View style={styles.step4Header}>
        <Text style={[styles.textStep, styles.textCenter]}>
          {i18n.t('step')}4
        </Text>
      </View>
      <View style={styles.separatingHeader}>
        <Text style={styles.subtitle}>{i18n.t('separatingBodyAndSleeves')}</Text>
      </View>

      <View style={styles.separatingStart}>
        <Text style={styles.resultText}>{i18n.t('start')}</Text>
        <TouchableOpacity onPress={handleScrollToTop1}>
        <Image
          source={require('@/assets/images/startend.svg')}
          style={styles.startvImage}
          contentFit="contain"
        />
        </TouchableOpacity>
        <Text style={styles.resultText}> : </Text>
      </View>

      <View style={styles.separatingRows}>
        <Text style={styles.resultText}>{i18n.t('rows')}: 1</Text>
        <Image
          source={require('@/assets/images/knitcircle.svg')}
          style={styles.styleKnitCircleImage}
          contentFit="contain"
        />
      </View>
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
              {i18n.t('stitches')}: {results.Sa + 2 * results.Sfx + 2 * results.SKa}
            </Text>
          </View>

          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>

          <View style={styles.stitchBox}>
            <View
              style={{
                width: 17,
                height: 17,
                backgroundColor: '#FF00FF',
                marginLeft: 10,
                borderWidth: 1,
              }}
            ></View>
            <Text style={styles.resultText}>
              {i18n.t('stitches')}: {results.SPodr} </Text>
              <Text style={styles.createText}>{i18n.t('create')}</Text>
              <Text style={styles.createText}>{i18n.t('underarmStitches')}</Text>
            
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
              {i18n.t('stitches')}: {results.Sa + 2 * results.Sfx + 2 * results.SKa}
            </Text>
          </View>
          {/* round*/}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot}></View>
          </View>
          <View style={styles.stitchBox}>
            <View
              style={{
                width: 17,
                height: 17,
                backgroundColor: '#FF00FF',
                marginLeft: 10,
                borderWidth: 1,
              }}
            ></View>
            <Text style={styles.resultText}>
              {i18n.t('stitches')}: {results.SPodr}</Text>
              <Text style={styles.createText}>{i18n.t('create')}</Text>
              <Text style={styles.createText}>{i18n.t('underarmStitches')}</Text>
            
          </View>
        </View>
      </ScrollView>
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
  textInsideBox: {
    fontSize: 12,
    color: '#000',
  },
  createText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
  textStep: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1A1A1A',
  },
  // Common layout styles
  step4Header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
    width: '100%',
  },
  textCenter: {
    textAlign: 'center',
  },
  separatingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  separatingStart: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  separatingRows: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  separatingLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
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
  // Gray indicator
  grayIndicator: {
    width: 17,
    height: 17,
    backgroundColor: '#CCCCCC',
    marginLeft: 10,
    borderWidth: 1,
  },
});

export default Step4SeparatingSleeves;

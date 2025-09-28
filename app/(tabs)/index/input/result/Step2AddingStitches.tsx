import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';

interface Step2AddingStitchesProps {
  results: any;
  resultString24: string;
  resultString23: string;
  resultString21: string;
  resultString43: string;
}

const Step2AddingStitches = observer(({ 
  results, 
  resultString24, 
  resultString23, 
  resultString21, 
  resultString43 
}: Step2AddingStitchesProps) => {
  const navigation = useNavigation();

  const navigateToBackO = () => {
    navigation.navigate('Raglan', { screen: 'BackO' });
  };

  const navigateToFrontO = () => {
    navigation.navigate('Raglan', { screen: 'FrontO' });
  };

  const navigateToSleeveO = () => {
    navigation.navigate('Raglan', { screen: 'SleeveO' });
  };

  return (
    <View style={styles.resultCard}>
      <View style={styles.stepHeader}>
        <Text style={[styles.textStep, styles.textCenter]}>
          {i18n.t('step')}2
          {'\n'}
          {i18n.t('knittingAfterCollar')}
        </Text>
      </View>
      <View style={styles.subtitleRow}>
        <Text style={styles.subtitle}>{i18n.t('addingStitchesAlongTheRaglanLine')}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.resultText}>
          {i18n.t('stitches')}: +{results.Sfx}
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
          {i18n.t('rows')}: {results.NHFront}
        </Text>
      </View>

      <View style={styles.backHeader}>
        <Text style={[styles.resultText, styles.marginLeft10]}>{i18n.t('back')}</Text>
        <View style={styles.purpleIndicatorLarge}></View>
        <TouchableOpacity onPress={navigateToBackO}>
          <Image
            source={require('@/assets/images/view.svg')}
            style={styles.viewImage}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.arrowRow}>
        <View style={styles.arrowContainerSmall}>
          <View
            style={{
              width: 34,
              height: 14,
              borderTopWidth: 8.5,
              borderLeftWidth: 17,
              borderRightWidth: 17,
              borderBottomWidth: 8.5,
              padding: -17,
              borderTopColor: 'transparent',
              borderLeftColor: 'transparent',
              borderRightColor: '#A29FCF',
              borderBottomColor: '#A29FCF',
            }}
          ></View>
          <Text style={[styles.resultText, { textAlign: 'center' }]}>
            {i18n.t('adding')}: {'\n'}+{results.Sfx}
          </Text>
        </View>

        <View
          style={[styles.textBox, { backgroundColor: '#A29FCF', justifyContent: 'center' }]}
        >
          <Text style={[styles.resultText, { textAlign: 'center', marginLeft: 10 }]}>
            {i18n.t('stitches')}: {'\n'}
            {results.SFrontO}
          </Text>
        </View>

        <View style={styles.arrowContainerSmall}>
          <View
            style={{
              width: 34,
              height: 14,
              marginLeft: 0,
              borderTopWidth: 8.5,
              borderLeftWidth: 17,
              borderRightWidth: 17,
              borderBottomWidth: 8.5,
              padding: -17,
              borderTopColor: 'transparent',
              borderLeftColor: '#A29FCF',
              borderRightColor: 'transparent',
              borderBottomColor: '#A29FCF',
            }}
          ></View>
          <Text style={[styles.resultText, { textAlign: 'center', marginLeft: 10 }]}>
            {i18n.t('adding')}: {'\n'}+{results.Sfx}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20,
          justifyContent: 'center',
          marginBottom: 1,
        }}
      >
        <Text style={[styles.resultText, { marginLeft: 10 }]}>{i18n.t('front')}</Text>
        <View
          style={{
            width: 34,
            height: 17,
            backgroundColor: '#FDCFE1',
            marginLeft: 10,
            borderWidth: 1,
          }}
        ></View>
        <TouchableOpacity onPress={navigateToFrontO}>
          <Image
            source={require('@/assets/images/view.svg')}
            style={styles.viewImage}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.arrowRow}>
        <View style={styles.arrowContainerSmall}>
          <View
            style={{
              width: 34,
              height: 14,
              borderTopWidth: 8.5,
              borderLeftWidth: 17,
              borderRightWidth: 17,
              borderBottomWidth: 8.5,
              padding: -17,
              borderTopColor: 'transparent',
              borderLeftColor: 'transparent',
              borderRightColor: '#FDCFE1',
              borderBottomColor: '#FDCFE1',
            }}
          ></View>
          <Text style={[styles.resultText, { textAlign: 'center' }]}>
            {i18n.t('adding')}: {'\n'}+{results.Sfx}
          </Text>
        </View>

        <View
          style={[styles.textBox, { backgroundColor: '#FDCFE1', justifyContent: 'center' }]}
        >
          <Text style={[styles.resultText, { textAlign: 'center', marginLeft: 10 }]}>
            {i18n.t('stitches')}: {'\n'}
            {results.SFrontO}
          </Text>
        </View>

        <View style={styles.arrowContainerSmall}>
          <View
            style={{
              width: 34,
              height: 14,
              marginLeft: 0,
              borderTopWidth: 8.5,
              borderLeftWidth: 17,
              borderRightWidth: 17,
              borderBottomWidth: 8.5,
              padding: -17,
              borderTopColor: 'transparent',
              borderLeftColor: '#FDCFE1',
              borderRightColor: 'transparent',
              borderBottomColor: '#FDCFE1',
            }}
          ></View>
          <Text style={[styles.resultText, { textAlign: 'center', marginLeft: 10 }]}>
            {i18n.t('adding')}: {'\n'}+{results.Sfx}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 20,
          marginBottom: 1,
        }}
      >
        <Text style={[styles.resultText, { marginLeft: 10 }]}>{i18n.t('sleeve')}</Text>
        <View
          style={{
            width: 34,
            height: 17,
            backgroundColor: '#DAEDBD',
            marginLeft: 10,
            borderWidth: 1,
          }}
        ></View>
        <TouchableOpacity onPress={navigateToSleeveO}>
          <Image
            source={require('@/assets/images/view.svg')}
            style={styles.viewImage}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.arrowRow}>
        <View style={styles.arrowContainerSmall}>
          <View
            style={{
              width: 34,
              height: 14,
              borderTopWidth: 8.5,
              borderLeftWidth: 17,
              borderRightWidth: 17,
              borderBottomWidth: 8.5,
              padding: -17,
              borderTopColor: 'transparent',
              borderLeftColor: 'transparent',
              borderRightColor: '#DAEDBD',
              borderBottomColor: '#DAEDBD',
            }}
          ></View>
          <Text style={[styles.resultText, { textAlign: 'center' }]}>
            {i18n.t('adding')}: {'\n'}+{results.Sfx}
          </Text>
        </View>

        <View
          style={[styles.textBox, { backgroundColor: '#DAEDBD', justifyContent: 'center' }]}
        >
          <Text style={[styles.resultText, { textAlign: 'center', marginLeft: 10 }]}>
            {i18n.t('stitches')}: {'\n'}
            {results.Sa}
          </Text>
        </View>

        <View
          style={{
            marginBottom: 1,
            marginLeft: 10,
            padding: 1,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 34,
              height: 14,
              marginLeft: 0,
              borderTopWidth: 8.5,
              borderLeftWidth: 17,
              borderRightWidth: 17,
              borderBottomWidth: 8.5,
              padding: -17,
              borderTopColor: 'transparent',
              borderLeftColor: '#DAEDBD',
              borderRightColor: 'transparent',
              borderBottomColor: '#DAEDBD',
            }}
          ></View>
          <Text style={[styles.resultText, { textAlign: 'center', marginLeft: 10 }]}>
            {i18n.t('adding')}: {'\n'}+{results.Sfx}
          </Text>
        </View>
      </View>

      <Text style={[styles.resultText, { fontWeight: 'bold', marginTop: 20 }]}>
        {i18n.t('additionsOnOneSide')}: {results.Sfx}
      </Text>

      {results.usedIncreaseType.includes('1x2, 1x4') && (
        <View
          style={[
            styles.section,
            {
              marginBottom: 10,
              marginLeft: 0,
              padding: 5,
              backgroundColor: '#E6E6E6',
              borderRadius: 8,
              alignItems: 'center',
            },
          ]}
        >
          <Text style={[styles.resultText, { fontWeight: 'bold', marginTop: 14 }]}>
            {i18n.t('option')}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.PR_1x2_f}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PR_1x4_f}
          </Text>
          {/* вывод рядов с прибавками*/}

          <Text style={[styles.resultText, { fontWeight: 'bold' }]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{resultString24}</Text>

          {/* конец вывода рядов с прибавками*/}
        </View>
      )}

      {results.usedIncreaseType.includes('1x3, 1x4') && (
        <View
          style={[
            styles.section,
            {
              marginBottom: 10,
              marginLeft: 0,
              padding: 5,
              backgroundColor: '#E6E6E6',
              borderRadius: 8,
              alignItems: 'center',
            },
          ]}
        >
          <Text style={[styles.resultText, { fontWeight: 'bold', marginTop: 14 }]}>
            {i18n.t('option')}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.PRib_1x3_f}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PRib_1x4_f}
          </Text>
          {/* вывод рядов с прибавками*/}

          <Text style={[styles.resultText, { fontWeight: 'bold' }]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{resultString43}</Text>

          {/* конец вывода рядов с прибавками*/}
        </View>
      )}

      {results.usedIncreaseType.includes('1x2, 1x1') && (
        <View
          style={[
            styles.section,
            {
              marginBottom: 10,
              marginLeft: 0,
              padding: 5,
              backgroundColor: '#E6E6E6',
              borderRadius: 8,
              alignItems: 'center',
            },
          ]}
        >
          <Text style={[styles.resultText, { fontWeight: 'bold', marginTop: 14 }]}>
            {i18n.t('option')}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.PR_1x2_f}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_f}
          </Text>
          <Text style={[styles.resultText, { fontWeight: 'bold' }]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{resultString21}</Text>
        </View>
      )}
      {results.usedIncreaseType.includes('1x4, 1x1') && (
        <View
          style={[
            styles.section,
            {
              marginBottom: 10,
              marginLeft: 0,
              padding: 5,
              backgroundColor: '#E6E6E6',
              borderRadius: 8,
              alignItems: 'center',
            },
          ]}
        >
          <Text style={[styles.resultText, { fontWeight: 'bold', marginTop: 14 }]}>
            {i18n.t('option')}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PR_1x4_f}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_f}
          </Text>
        </View>
      )}
      {results.usedIncreaseType.includes('1x2, 1x3') && (
        <View
          style={[
            styles.section,
            {
              marginBottom: 10,
              marginLeft: 0,
              padding: 5,
              backgroundColor: '#E6E6E6',
              borderRadius: 8,
              alignItems: 'center',
            },
          ]}
        >
          <Text style={[styles.resultText, { fontWeight: 'bold', marginTop: 14 }]}>
            {i18n.t('option')}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.prib_1x2_f}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.prib_1x3_f}
          </Text>
          <Text style={[styles.resultText, { fontWeight: 'bold' }]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{resultString23}</Text>
        </View>
      )}

      {results.usedIncreaseType.includes('1x3, 1x1') && (
        <View
          style={{
            marginBottom: 10,
            marginLeft: 0,
            padding: 5,
            backgroundColor: '#E6E6E6',
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={[styles.resultText, { fontWeight: 'bold', marginTop: 14 }]}>
            {i18n.t('option')}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.prib_1x3_f}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_f}
          </Text>
        </View>
      )}
      {results.usedIncreaseType.includes('1x4') && (
        <View
          style={[
            styles.section,
            {
              marginBottom: 10,
              marginLeft: 0,
              padding: 5,
              backgroundColor: '#E6E6E6',
              borderRadius: 8,
              alignItems: 'center',
            },
          ]}
        >
          <Text style={[styles.resultText, { fontWeight: 'bold', marginTop: 14 }]}>
            {i18n.t('option')}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x4({i18n.t('rows')}): {results.PR_1x4_f}
          </Text>
          <Text style={[styles.resultText, { fontWeight: 'bold' }]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{results.RowPrib1x4String}</Text>
        </View>
      )}

      {results.usedIncreaseType.includes('1x1') && (
        <View
          style={{
            marginBottom: 10,
            marginLeft: 0,
            padding: 5,
            backgroundColor: '#E6E6E6',
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={[styles.resultText, { fontWeight: 'bold', marginTop: 14 }]}>
            {i18n.t('option')}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x1({i18n.t('rows')}): {results.prib_1x1_f}
          </Text>
          <Text style={[styles.resultText, { fontWeight: 'bold' }]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{results.RowPrib1x1String}</Text>
        </View>
      )}

      {results.usedIncreaseType.includes('1x2') && (
        <View
          style={{
            marginBottom: 10,
            marginLeft: 0,
            padding: 5,
            backgroundColor: '#E6E6E6',
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={[styles.resultText, { fontWeight: 'bold', marginTop: 14 }]}>
            {i18n.t('option')}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x2({i18n.t('rows')}): {results.prib_1x2_f}
          </Text>
          <Text style={[styles.resultText, { fontWeight: 'bold' }]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{results.RowPrib1x2String}</Text>
        </View>
      )}
      {results.usedIncreaseType.includes('1x3') && (
        <View
          style={{
            marginBottom: 10,
            marginLeft: 0,
            padding: 5,
            backgroundColor: '#E6E6E6',
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={[styles.resultText, { fontWeight: 'bold', marginTop: 14 }]}>
            {i18n.t('option')}
          </Text>
          <Text style={styles.resultText}>
            1({i18n.t('stitches')})x3({i18n.t('rows')}): {results.prib_1x3_f}
          </Text>
          <Text style={[styles.resultText, { fontWeight: 'bold' }]}>
            {i18n.t('RowsWithAdding')}:
          </Text>
          <Text style={styles.resultText}>{results.RowPrib1x3String}</Text>
        </View>
      )}
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
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  marginLeft10: {
    marginLeft: 10,
  },
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  purpleIndicatorLarge: {
    width: 34,
    height: 17,
    backgroundColor: '#A29FCF',
    marginLeft: 10,
    borderWidth: 1,
  },
  // Arrow styles
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 3,
  },
  arrowContainerSmall: {
    marginBottom: 1,
    marginLeft: 0,
    padding: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  // Section styles
  section: {
    marginBottom: 10,
    marginLeft: 0,
    padding: 5,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default Step2AddingStitches;

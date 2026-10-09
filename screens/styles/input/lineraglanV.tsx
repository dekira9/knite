import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Image } from 'expo-image';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { useNavigation } from '@react-navigation/native';
import { screenWidth } from '@/utils/Layout';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { computeVNeckRaglanLineMaxFromMeasurements } from '@/utils/calculateRaglan';
import { trackMeasurementStep } from '@/utils/analytics';
import KeyboardAvoidingScreen from '@/components/KeyboardAvoidingScreen';

const LineraglanV = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const navigation = useNavigation();
  const Kmin = 0;
  const KmaxV = computeVNeckRaglanLineMaxFromMeasurements({
    headCircumference: introState.headCircumference,
    neckCircumference: introState.neckCircumference,
    chestCircumference: introState.chestCircumference,
    stitchDensity: introState.stitchDensity,
    rowDensity: introState.rowDensity,
    fitType: introState.fitType,
    garmentFitFor: introState.garmentFitFor,
    ribbingWidth: introState.ribbingWidth,
    ribbingWidthV: introState.ribbingWidthV,
    raglanLineWidth: introState.raglanLineWidth,
    raglanLineWidthV: introState.raglanLineWidthV,
    depthNeckV: introState.depthNeckV,
  });
  const [sliderValue, setSliderValue] = useState(introState.raglanLineWidthV.toString());

  const parsedValue = parseInt(sliderValue, 10);
  const clampedValue = Math.min(
    KmaxV,
    Math.max(Kmin, Number.isFinite(parsedValue) ? parsedValue : Kmin),
  );
  const canContinue = sliderValue !== '' && /^\d+$/.test(sliderValue);

  const handleSliderChange = (value: number) => {
    setSliderValue(Math.round(value).toString());
  };

  // Only whole numbers 0…KmaxV (no decimals, signs, or other chars).
  const handleTextInputChange = (value: string) => {
    if (value === '') {
      setSliderValue('');
      return;
    }
    if (!/^\d+$/.test(value)) {
      return;
    }
    const numericValue = parseInt(value, 10);
    if (numericValue > KmaxV) {
      setSliderValue(KmaxV.toString());
    } else {
      setSliderValue(String(numericValue));
    }
  };

  const handleNext = () => {
    if (!canContinue) return;
    const nextValue = Math.min(KmaxV, Math.max(Kmin, parseInt(sliderValue, 10)));
    introState.setRaglanLineWidthV(nextValue);
    trackMeasurementStep('raglan_line', { style: 'v-neck' });
    (navigation as any).navigate('DepthNeckV');
  };

  return (
    <KeyboardAvoidingScreen
      contentContainerStyle={styles.container}
      footerStyle={styles.footer}
      footer={
        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: canContinue ? Colors[theme].tint : '#C6C6C6' },
          ]}
          onPress={handleNext}
          disabled={!canContinue}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canContinue }}
        >
          <Text style={styles.buttonText}>{i18n.t('next')}</Text>
        </TouchableOpacity>
      }
    >
      <Image
        source={require('@/assets/images/LineRaglanV.png')}
        style={styles.image}
        contentFit="contain"
      />
      <Text style={styles.title}>{i18n.t('raglanLineStitchCount')}</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={() => {
            const currentValue = parseInt(sliderValue, 10) || 0;
            handleTextInputChange(Math.max(Kmin, currentValue - 1).toString());
          }}
        >
          <Text style={styles.arrow}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={sliderValue}
          keyboardType="number-pad"
          returnKeyType="done"
          blurOnSubmit
          placeholder=""
          onChangeText={handleTextInputChange}
        />
        <TouchableOpacity
          onPress={() => {
            const currentValue = parseInt(sliderValue, 10) || 0;
            handleTextInputChange(Math.min(KmaxV, currentValue + 1).toString());
          }}
        >
          <Text style={styles.arrow}>+</Text>
        </TouchableOpacity>
        <Text style={styles.inputLabel}>{i18n.t('stitches')}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={Kmin}
        maximumValue={KmaxV}
        step={1}
        value={clampedValue}
        onValueChange={handleSliderChange}
        minimumTrackTintColor="#000000"
        maximumTrackTintColor="#CCCCCC"
        thumbTintColor="#000000"
      />
      <View style={styles.sliderLabels}>
        <Text style={styles.labelText}>
          {Kmin} {i18n.t('stitches')}
        </Text>
        <Text style={styles.labelText}>
          {KmaxV} {i18n.t('stitches')}
        </Text>
      </View>
    </KeyboardAvoidingScreen>
  );
};

export default observer(LineraglanV);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  image: {
    width: screenWidth * 0.8,
    height: 200,
    marginBottom: 1,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 1,
  },
  sliderLabels: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  labelText: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    width: '30%',
    paddingHorizontal: 10,
  },
  inputLabel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  nextButton: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 30,
    paddingHorizontal: 10,
    color: '#808080',
  },
});

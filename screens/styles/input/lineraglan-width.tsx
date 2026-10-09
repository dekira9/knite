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
import { computeRegularRaglanLineMaxFromMeasurements } from '@/utils/calculateRaglan';
import { track, trackMeasurementStep } from '@/utils/analytics';
import KeyboardAvoidingScreen from '@/components/KeyboardAvoidingScreen';

const LineraglanWidth = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const navigation = useNavigation();
  const Kmin = 0;
  const Kmax = computeRegularRaglanLineMaxFromMeasurements({
    headCircumference: introState.headCircumference,
    neckCircumference: introState.neckCircumference,
    stitchDensity: introState.stitchDensity,
    ribbingWidth: introState.ribbingWidth,
  });
  const [sliderValue, setSliderValue] = useState(introState.raglanLineWidth.toString());

  const parsedValue = parseInt(sliderValue, 10);
  const clampedValue = Math.min(
    Kmax,
    Math.max(Kmin, Number.isFinite(parsedValue) ? parsedValue : Kmin),
  );
  const canContinue = sliderValue !== '' && /^\d+$/.test(sliderValue);

  const handleSliderChange = (value: number) => {
    setSliderValue(Math.round(value).toString());
  };

  // Only whole numbers 0…Kmax (no decimals, signs, or other chars).
  const handleTextInputChange = (value: string) => {
    if (value === '') {
      setSliderValue('');
      return;
    }
    if (!/^\d+$/.test(value)) {
      return;
    }
    const numericValue = parseInt(value, 10);
    if (numericValue > Kmax) {
      setSliderValue(Kmax.toString());
    } else {
      setSliderValue(String(numericValue));
    }
  };

  const handleNext = () => {
    if (!canContinue) return;
    const nextValue = Math.min(Kmax, Math.max(Kmin, parseInt(sliderValue, 10)));
    introState.setRaglanLineWidth(nextValue);
    introState.markMeasurementsCustom();
    introState.setIntroFinished(true);
    trackMeasurementStep('raglan_line', { style: 'regular' });
    track('measurements_completed', { style: 'regular' });
    (navigation as any).navigate('Result');
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
        source={require('@/assets/images/LineRaglOWidth.png')}
        style={styles.image}
        contentFit="contain"
      />
      <Text style={styles.title}>{i18n.t('raglanLineStitchCount')}</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={() =>
            handleTextInputChange(
              (Math.max(Kmin, (parseInt(sliderValue, 10) || Kmin) - 1)).toString(),
            )
          }
        >
          <Text style={styles.arrow}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={sliderValue}
          keyboardType="number-pad"
          returnKeyType="done"
          blurOnSubmit
          onChangeText={handleTextInputChange}
        />
        <TouchableOpacity
          onPress={() =>
            handleTextInputChange(
              (Math.min(Kmax, (parseInt(sliderValue, 10) || Kmin) + 1)).toString(),
            )
          }
        >
          <Text style={styles.arrow}>+</Text>
        </TouchableOpacity>
        <Text style={styles.inputLabel}>{i18n.t('stitches')}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={Kmin}
        maximumValue={Kmax}
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
          {Kmax} {i18n.t('stitches')}
        </Text>
      </View>
    </KeyboardAvoidingScreen>
  );
};

export default observer(LineraglanWidth);

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

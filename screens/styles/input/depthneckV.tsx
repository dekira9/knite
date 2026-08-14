import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Image } from 'expo-image';
import introState from '@/state/introState';
import onboardingState from '@/state/onboardingState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { useNavigation } from '@react-navigation/native';
import { screenWidth } from '@/utils/Layout';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { computeVNeckDepthBoundsFromMeasurements } from '@/utils/calculateRaglan';

const CM_PER_INCH = 2.54;
const cmToIn = (cm: number): string => (cm / CM_PER_INCH).toFixed(1);
const CM_STEP = 0.1;
const IN_STEP = 0.1;

const DepthNeckV = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const navigation = useNavigation();
  const isMetric = onboardingState.measurementSystem === 'metric';
  const HrezV = introState.ribbingWidthV;
  const { min: LHVmin, max: LHVmax } = computeVNeckDepthBoundsFromMeasurements({
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
  const minDisplay = LHVmin + HrezV;
  const maxDisplay = LHVmax + HrezV;

  const [sliderValue, setSliderValue] = useState(
    introState.depthNeckV !== undefined ? 
      (introState.depthNeckV + HrezV).toFixed(1) : 
      minDisplay.toFixed(1)
  );
  const [inchInput, setInchInput] = useState(() => cmToIn(parseFloat(sliderValue)));

  const updateBoth = (cmStr: string) => {
    setSliderValue(cmStr);
    const v = parseFloat(cmStr);
    if (!isNaN(v)) setInchInput(cmToIn(v));
    else setInchInput('');
  };

  const handleSliderChange = (value: number) => {
    const roundedValue = parseFloat(value.toFixed(1));
    const actualValue = roundedValue - HrezV;
    if (actualValue >= LHVmin && actualValue <= LHVmax) {
      updateBoth(roundedValue.toFixed(1));
    }
  };

  const handleTextInputChange = (value: string) => {
    if (value === '') {
      setSliderValue('');
      setInchInput('');
    } else {
      const cleanValue = value.replace(',', '.');
      const numericValue = parseFloat(cleanValue);
      if (!isNaN(numericValue) && 
          numericValue >= minDisplay && 
          numericValue <= maxDisplay) {
        const roundedValue = parseFloat(numericValue.toFixed(1));
        updateBoth(roundedValue.toFixed(1));
      } else {
        setSliderValue('');
        setInchInput('');
      }
    }
  };

  const handleInchChange = (value: string) => {
    setInchInput(value);
    if (value === '') { setSliderValue(''); return; }
    const inVal = parseFloat(value.replace(',', '.'));
    if (isNaN(inVal)) return;
    const cmVal = parseFloat((inVal * CM_PER_INCH).toFixed(1));
    if (cmVal >= minDisplay && cmVal <= maxDisplay) {
      setSliderValue(cmVal.toFixed(1));
    }
  };

  const handleNext = () => {
    const displayValue = parseFloat(sliderValue);
    const safeDisplayValue = Number.isNaN(displayValue)
      ? minDisplay
      : Math.min(maxDisplay, Math.max(minDisplay, displayValue));
    const actualValue = parseFloat((safeDisplayValue - HrezV).toFixed(1));
    introState.setDepthNeckV(actualValue);
    introState.markMeasurementsCustom();
    introState.setIntroFinished(true);
    (navigation as any).navigate('Result');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/neckdepthV.png')}
        style={styles.image}
        contentFit="contain"
      />
      <Text style={styles.title}>{i18n.t('depthNeck')}</Text>

      {isMetric ? (
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => {
            const currentValue = parseFloat(sliderValue) || minDisplay;
            const newValue = Math.max(minDisplay, parseFloat((currentValue - 0.1).toFixed(1)));
            updateBoth(newValue.toFixed(1));
          }}>
            <Text style={styles.arrow}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={sliderValue}
            keyboardType="numeric"
            placeholder=""
            onChangeText={handleTextInputChange}  
          />
          <TouchableOpacity onPress={() => {
            const currentValue = parseFloat(sliderValue) || minDisplay;
            const newValue = Math.min(maxDisplay, parseFloat((currentValue + 0.1).toFixed(1)));
            updateBoth(newValue.toFixed(1));
          }}>
            <Text style={styles.arrow}>+</Text>
          </TouchableOpacity>
          <Text style={styles.inputLabel}>cm</Text>
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inchInput}
            keyboardType="numeric"
            placeholder=""
            onChangeText={handleInchChange}
          />
          <Text style={styles.inputLabel}>in</Text>
        </View>
      )}

      <Slider
        style={styles.slider}
        minimumValue={minDisplay}
        maximumValue={maxDisplay}
        value={parseFloat(sliderValue) || minDisplay}
        onValueChange={handleSliderChange}
        step={isMetric ? CM_STEP : IN_STEP * CM_PER_INCH}
        minimumTrackTintColor="#000000"
        maximumTrackTintColor="#CCCCCC"
        thumbTintColor="#000000"
      />
      <View style={styles.sliderLabels}>
        <Text style={styles.labelText}>
          {isMetric ? `${minDisplay.toFixed(1)} cm` : `${cmToIn(minDisplay)} in`}
        </Text>
        <Text style={styles.labelText}>
          {isMetric ? `${maxDisplay.toFixed(1)} cm` : `${cmToIn(maxDisplay)} in`}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          { backgroundColor: Colors[theme].tint },
        ]}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>{i18n.t('next')}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default observer(DepthNeckV);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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
    marginLeft: 10,
  },
  nextButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 30,
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

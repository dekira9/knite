import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import introState from '@/state/introState';
import onboardingState from '@/state/onboardingState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { screenWidth } from '@/utils/Layout';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const CM_PER_INCH = 2.54;
const cmToIn = (cm: number): string => (cm / CM_PER_INCH).toFixed(1);

export default observer(() => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const navigation = useNavigation();
  const isMetric = onboardingState.measurementSystem === 'metric';

  const stitches = parseFloat(introState.stitchDensity.replace(',', '.')) / 10;
  const rows = parseFloat(introState.rowDensity.replace(',', '.')) / 10;
  const K = introState.K;
  const LK = K / stitches;
  const LRezMin = Math.round((2 / rows) * 10) / 10;
  const LRezMax = Math.round((Number(introState.neckCircumference) / Math.PI) * 10) / 10;

  const [localRibbingWidth, setLocalRibbingWidth] = useState(
    Math.min(LRezMax, Math.max(LRezMin, Number(introState.ribbingWidth) || LRezMin)),
  );
  const [inchInput, setInchInput] = useState(cmToIn(localRibbingWidth));

  const updateFromCm = (cmValue: number) => {
    setLocalRibbingWidth(cmValue);
    setInchInput(cmToIn(cmValue));
  };

  const handleCmChange = (value: string) => {
    if (value === '') {
      updateFromCm(LRezMin);
    } else {
      const numericValue = parseFloat(value.replace(',', '.'));
      if (!isNaN(numericValue) && numericValue >= LRezMin && numericValue <= LRezMax) {
        updateFromCm(parseFloat(numericValue.toFixed(1)));
      }
    }
  };

  const handleInchChange = (value: string) => {
    setInchInput(value);
    if (value === '') return;
    const inVal = parseFloat(value.replace(',', '.'));
    if (isNaN(inVal)) return;
    const cmVal = parseFloat((inVal * CM_PER_INCH).toFixed(1));
    if (cmVal >= LRezMin && cmVal <= LRezMax) {
      setLocalRibbingWidth(cmVal);
    }
  };

  const handleNext = () => {
    introState.setRibbingWidth(localRibbingWidth.toString());
    (navigation as any).navigate('LineraglanWidth');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/ribbing.svg')}
        style={styles.image}
        contentFit="contain"
      />
      <Text style={styles.title}>{i18n.t('collarWidth')}</Text>

      {isMetric ? (
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={() => {
              const newValue = Math.max(LRezMin, parseFloat((localRibbingWidth - 0.1).toFixed(1)));
              updateFromCm(newValue);
            }}
          >
            <Text style={styles.arrow}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.valueInput}
            value={localRibbingWidth.toFixed(1)}
            onChangeText={handleCmChange}
            keyboardType="numeric"
            placeholder=""
          />
          <TouchableOpacity
            onPress={() => {
              const newValue = Math.min(LRezMax, parseFloat((localRibbingWidth + 0.1).toFixed(1)));
              updateFromCm(newValue);
            }}
          >
            <Text style={styles.arrow}>+</Text>
          </TouchableOpacity>
          <Text style={styles.inputLabel}>cm</Text>
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.valueInput}
            value={inchInput}
            onChangeText={handleInchChange}
            keyboardType="numeric"
            placeholder=""
          />
          <Text style={styles.inputLabel}>in</Text>
        </View>
      )}

      <Slider
        style={styles.slider}
        minimumValue={LRezMin}
        maximumValue={LRezMax}
        value={Math.min(Math.max(localRibbingWidth, LRezMin), LRezMax)}
        onValueChange={(value) => updateFromCm(parseFloat(value.toFixed(1)))}
        step={0.1}
        minimumTrackTintColor="#000000"
        maximumTrackTintColor="#CCCCCC"
        thumbTintColor="#000000"
      />
      <View style={styles.rangeLabels}>
        <Text style={styles.rangeText}>
          {isMetric ? `${LRezMin.toFixed(1)} cm` : `${cmToIn(LRezMin)} in`}
        </Text>
        <Text style={styles.rangeText}>
          {isMetric ? `${LRezMax.toFixed(1)} cm` : `${cmToIn(LRezMax)} in`}
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
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: screenWidth * 0.8,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 5,
    width: '100%',
  },
  rangeText: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  arrow: {
    fontSize: 30,
    paddingHorizontal: 10,
    color: '#808080',
  },
  valueInput: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    width: '30%',
    paddingHorizontal: 10,
  },
  inputLabel: {
    marginLeft: 1,
    fontWeight: 'bold',
    fontSize: 24,
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
});

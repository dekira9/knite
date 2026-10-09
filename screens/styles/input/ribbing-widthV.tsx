import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import introState from '@/state/introState';
import onboardingState from '@/state/onboardingState';
import i18n from '@/utils/translations';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { screenWidth } from '@/utils/Layout';
import { observer } from 'mobx-react-lite';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { trackMeasurementStep } from '@/utils/analytics';
import KeyboardAvoidingScreen from '@/components/KeyboardAvoidingScreen';

const CM_PER_INCH = 2.54;
const cmToIn = (cm: number): string => (cm / CM_PER_INCH).toFixed(1);

const RibbingWidthV: React.FC = observer(() => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const navigation = useNavigation();
  const isMetric = onboardingState.measurementSystem === 'metric';

  const rows = parseFloat(introState.rowDensity.replace(',', '.')) / 10;
  const LRezMinV = Math.round((2 / rows) * 10) / 10;
  const neck = Number(introState.neckCircumference);
  const head = Number(introState.headCircumference);
  const LRezMaxV = Math.round(((neck + head) / 6 / Math.PI) * 10) / 10;

  const [localRibbingWidthV, setLocalRibbingWidthV] = useState(
    Math.min(LRezMaxV, Math.max(LRezMinV, Number(introState.ribbingWidthV) || LRezMinV)),
  );
  const [inchInput, setInchInput] = useState(cmToIn(localRibbingWidthV));

  const canContinue = Number.isFinite(localRibbingWidthV) && localRibbingWidthV > 0;

  const updateFromCm = (cmValue: number) => {
    setLocalRibbingWidthV(cmValue);
    setInchInput(cmToIn(cmValue));
  };

  const handleCmChange = (value: string) => {
    if (value === '') {
      updateFromCm(LRezMinV);
    } else {
      const numericValue = parseFloat(value.replace(',', '.'));
      if (!isNaN(numericValue) && numericValue >= LRezMinV && numericValue <= LRezMaxV) {
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
    if (cmVal >= LRezMinV && cmVal <= LRezMaxV) {
      setLocalRibbingWidthV(cmVal);
    }
  };

  const handleNext = () => {
    if (!canContinue) return;
    introState.setRibbingWidthV(localRibbingWidthV.toString());
    trackMeasurementStep('ribbing_width', { style: 'v-neck' });
    (navigation as any).navigate('LineraglanV');
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
        source={require('@/assets/images/ribwidthV.svg')}
        style={styles.image}
        contentFit="contain"
      />
      <Text style={styles.title}>{i18n.t('neckbandWidth')}</Text>

      {isMetric ? (
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={() => {
              const newValue = Math.max(
                LRezMinV,
                parseFloat((localRibbingWidthV - 0.1).toFixed(1)),
              );
              updateFromCm(newValue);
            }}
          >
            <Text style={styles.arrow}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.valueInput}
            value={localRibbingWidthV.toFixed(1)}
            onChangeText={handleCmChange}
            keyboardType="numeric"
            returnKeyType="done"
            blurOnSubmit
            placeholder=""
          />
          <TouchableOpacity
            onPress={() => {
              const newValue = Math.min(
                LRezMaxV,
                parseFloat((localRibbingWidthV + 0.1).toFixed(1)),
              );
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
            returnKeyType="done"
            blurOnSubmit
            placeholder=""
          />
          <Text style={styles.inputLabel}>in</Text>
        </View>
      )}

      <Slider
        style={styles.slider}
        minimumValue={LRezMinV}
        maximumValue={LRezMaxV}
        value={Math.min(Math.max(localRibbingWidthV, LRezMinV), LRezMaxV)}
        onValueChange={(value) => updateFromCm(parseFloat(value.toFixed(1)))}
        step={0.03937}
        minimumTrackTintColor="#000000"
        maximumTrackTintColor="#CCCCCC"
        thumbTintColor="#000000"
      />
      <View style={styles.rangeLabels}>
        <Text style={styles.rangeText}>
          {isMetric ? `${LRezMinV.toFixed(1)} cm` : `${cmToIn(LRezMinV)} in`}
        </Text>
        <Text style={styles.rangeText}>
          {isMetric ? `${LRezMaxV.toFixed(1)} cm` : `${cmToIn(LRezMaxV)} in`}
        </Text>
      </View>
    </KeyboardAvoidingScreen>
  );
});

export default RibbingWidthV;

const styles = StyleSheet.create({
  container: {
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
    fontSize: 24,
    marginLeft: 1,
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
});

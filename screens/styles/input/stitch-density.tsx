import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { observer } from 'mobx-react-lite';
import introState from '@/state/introState';
import onboardingState from '@/state/onboardingState';
import i18n from '@/utils/translations';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { trackMeasurementStep } from '@/utils/analytics';
import KeyboardAvoidingScreen from '@/components/KeyboardAvoidingScreen';
import {
  isPositiveMeasurement,
  sanitizeOneDecimalInput,
} from '@/utils/measurementUnitHelpers';

const INCH_PER_CM = 2.54;

const per10cmToPer4in = (val: string): string => {
  const v = parseFloat(val.replace(',', '.'));
  if (isNaN(v)) return '';
  return ((v * 4 * INCH_PER_CM) / 10).toFixed(1);
};

const per4inToPer10cm = (val: string): string => {
  const v = parseFloat(val.replace(',', '.'));
  if (isNaN(v)) return '';
  return ((v * 10) / (4 * INCH_PER_CM)).toFixed(1);
};

export default observer(() => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const isMetric = onboardingState.measurementSystem === 'metric';
  const inputRef = useRef<TextInput>(null);
  const [localValue, setLocalValue] = useState(introState.stitchDensity);
  const [inchValue, setInchValue] = useState(() => per10cmToPer4in(introState.stitchDensity));

  useEffect(() => {
    setLocalValue(introState.stitchDensity);
    setInchValue(per10cmToPer4in(introState.stitchDensity));
  }, [introState.stitchDensity]);

  const canContinue = isMetric
    ? isPositiveMeasurement(localValue)
    : isPositiveMeasurement(inchValue);

  const handleCmChange = (value: string) => {
    const sanitized = sanitizeOneDecimalInput(value);
    setLocalValue(sanitized);
    setInchValue(per10cmToPer4in(sanitized));
  };

  const handleInchChange = (value: string) => {
    const sanitized = sanitizeOneDecimalInput(value);
    setInchValue(sanitized);
    const cm = per4inToPer10cm(sanitized);
    if (cm) setLocalValue(cm);
  };

  const handleNext = () => {
    if (!canContinue) return;
    if (localValue.trim() !== '') {
      introState.setStitchDensity(localValue);
    }
    trackMeasurementStep('stitch_density', { style: introState.style || 'unknown' });
    (navigation as any).navigate('RowDensity');
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
        source={
          isMetric
            ? require('@/assets/images/density.svg')
            : require('@/assets/images/density2Inch.svg')
        }
        style={styles.image}
        contentFit="contain"
      />

      <Text style={styles.title}>
        {isMetric ? i18n.t('stitchDensityCM') : i18n.t('stitchDensityIN')}
      </Text>

      <View style={styles.rowContainer}>
        {isMetric ? (
          <View style={styles.fieldContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={localValue}
                onChangeText={handleCmChange}
                keyboardType="numeric"
                returnKeyType="done"
                blurOnSubmit
                placeholder=""
              />
              <Text style={styles.unit}>/ 10 cm</Text>
            </View>
          </View>
        ) : (
          <View style={styles.fieldContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={inchValue}
                onChangeText={handleInchChange}
                keyboardType="numeric"
                returnKeyType="done"
                blurOnSubmit
                placeholder=""
              />
              <Text style={styles.unit}>/ 4 in</Text>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingScreen>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 15,
    marginBottom: 16,
  },
  fieldContainer: {
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 120,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 18,
    marginRight: 10,
  },
  unit: {
    fontSize: 18,
    color: '#666',
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

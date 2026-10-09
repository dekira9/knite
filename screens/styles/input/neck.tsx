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
import { cmToIn, inToCm } from '@/utils/measurementUnitHelpers';

export default observer(() => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const isMetric = onboardingState.measurementSystem === 'metric';
  const inputRef = useRef<TextInput>(null);
  const [inchValue, setInchValue] = useState(() => cmToIn(introState.neckCircumference));

  useEffect(() => {
    const timeoutId = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleCmChange = (value: string) => {
    introState.setNeckCircumference(value);
    setInchValue(cmToIn(value));
  };

  const handleInchChange = (value: string) => {
    setInchValue(value);
    const cm = inToCm(value);
    if (cm) introState.setNeckCircumference(cm);
  };

  return (
    <KeyboardAvoidingScreen contentContainerStyle={styles.container}>
      <Image
        source={require('@/assets/images/neck.svg')}
        style={styles.image}
        contentFit="contain"
      />

      <Text style={styles.title}>{i18n.t('neckCircumference')}</Text>

      <View style={styles.rowContainer}>
        {isMetric ? (
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={introState.neckCircumference}
              onChangeText={handleCmChange}
              keyboardType="numeric"
              placeholder=""
            />
            <Text style={styles.unit}>cm</Text>
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={inchValue}
              onChangeText={handleInchChange}
              keyboardType="numeric"
              placeholder=""
            />
            <Text style={styles.unit}>in</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: Colors[theme].tint }]}
        onPress={() => {
          trackMeasurementStep('neck', { style: introState.style || 'unknown' });
          (navigation as any).navigate('Chest');
        }}
      >
        <Text style={styles.buttonText}>{i18n.t('next')}</Text>
      </TouchableOpacity>
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
    marginBottom: 30,
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
  nextButton: {
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

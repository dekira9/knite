import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Image } from 'expo-image';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { useRouter } from 'expo-router';
import { screenWidth } from '@/utils/Layout';

const LineraglanWidth = () => {
  const router = useRouter();
  const Kmin = 1;
  const Kmax = Math.floor((introState.Sgor - 16) / 4);
  const [sliderValue, setSliderValue] = useState(Kmin.toString());

  // Функция для обработки изменений в Slider
  const handleSliderChange = (value) => {
    setSliderValue(value.toString());
    introState.setRaglanLineWidth(value); // Обновляем ширину регланной линии в introState
  };

  // Функция для обработки изменений в TextInput
  const handleTextInputChange = (value) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= Kmin && numericValue <= Kmax) {
      setSliderValue(value);
      introState.setRaglanLineWidth(numericValue); // Обновляем ширину регланной линии в introState
    }
  };

  const handleNext = () => {
    console.log('Next button pressed with value:', introState.raglanLineWidth);
    router.push('/input/result');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/LineRaglOWidth.png')}
        style={styles.image}
        contentFit="contain"
      />
      <Text style={styles.title}>{i18n.t('RaglanLineWidth')}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={sliderValue}
          keyboardType="numeric"
          onChangeText={handleTextInputChange}
        />
        <Text style={styles.inputLabel}>{i18n.t('stitches')}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={Kmin}
        maximumValue={Kmax}
        step={1}
        value={parseInt(sliderValue, 10)}
        onValueChange={handleSliderChange}
      />
      <View style={styles.sliderLabels}>
        <Text style={styles.labelText}>{Kmin} {i18n.t('stitches')}</Text>
        <Text style={styles.labelText}>{Kmax} {i18n.t('stitches')}</Text>
      </View>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.buttonText}>{i18n.t('next')}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default observer(LineraglanWidth);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: '666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    //width: 80,
    //height: 60,
    borderColor: '#ccc',
    borderWidth: 0,
    borderRadius: 5,
    textAlign: 'right',
    marginRight: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#007AFF',
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
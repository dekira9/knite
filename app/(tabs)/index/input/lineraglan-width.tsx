import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Image } from 'expo-image';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { useNavigation } from '@react-navigation/native';
import { screenWidth } from '@/utils/Layout';

const LineraglanWidth = () => {
  const navigation = useNavigation();
  const Kmin = 0;
  const Kmax = Math.floor((introState.Sgor - 16) / 4);
  const [sliderValue, setSliderValue] = useState(introState.raglanLineWidth.toString());

  useEffect(() => {
    // Синхронизируем значение слайдера с TextInput
    setSliderValue(introState.raglanLineWidth.toString());
  }, [introState.raglanLineWidth]);

  // Функция для обработки изменений в Slider (откладываем обновление, чтобы избежать setState во время рендера)
  const handleSliderChange = (value: number) => {
    setSliderValue(Math.round(value).toString());
    setTimeout(() => introState.setRaglanLineWidth(Math.round(value)), 0);
  };

  // Функция для обработки изменений в TextInput
  const handleTextInputChange = (value: string) => {
    if (value === '') {
      setSliderValue(''); // Позволяем очистить поле ввода
      introState.setRaglanLineWidth(Kmin); // Устанавливаем минимальное значение по умолчанию
    } else {
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue) && numericValue >= Kmin && numericValue <= Kmax) {
        setSliderValue(value);
        introState.setRaglanLineWidth(numericValue);
      } else {
        setSliderValue(''); // Очищаем поле ввода, если значение некорректно
      }
    }
  };

  const handleNext = () => {
    console.log('Next button pressed with value:', introState.raglanLineWidth);
    introState.setIntroFinished(true);
    // router.push('/input/result');
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
      <TouchableOpacity onPress={() => handleTextInputChange((parseInt(sliderValue) - 1).toString())}>
        <Text style={styles.arrow}>-</Text>
      </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={sliderValue}
          keyboardType="numeric"
          placeholder="Введите значение"
          onChangeText={handleTextInputChange}  
        />
        <TouchableOpacity onPress={() => handleTextInputChange((parseInt(sliderValue) + 1).toString())}>
          <Text style={styles.arrow}>+</Text>
        </TouchableOpacity>
        <Text style={styles.inputLabel}>{i18n.t('stitches')}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={Kmin}
        maximumValue={Kmax}
        step={1}
        value={Math.min(Kmax, Math.max(Kmin, parseInt(sliderValue, 10) || Kmin))}
        onValueChange={handleSliderChange}
        minimumTrackTintColor="#000000"
  maximumTrackTintColor="#CCCCCC"
  thumbTintColor="#000000" // Эта строка определяет цвет бегунка
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
  arrow: {
    fontSize: 30,
    paddingHorizontal: 10,
    color: '#808080',
  },
});
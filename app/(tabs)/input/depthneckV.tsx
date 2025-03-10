import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Image } from 'expo-image';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { useRouter } from 'expo-router';
import { screenWidth } from '@/utils/Layout';

const DepthNeckV = () => {
  const router = useRouter();
  
  const results = introState.calculateRaglan();
  const HrezV = introState.ribbingWidthV;
  console.log(HrezV);
  
  // Округляем значения до 1 десятичного знака
  const LHVmin = typeof results === 'string' ? 1 : 
    parseFloat((results.LHVmin || 1).toFixed(1)); 
  const LHVmax = typeof results === 'string' ? 5 : 
    parseFloat((results.LHVmax || 5).toFixed(1)); 
  console.log('LHVmin', LHVmin);
  console.log('LHVmax', LHVmax);
  
  // Инициализируем значение depthNeckV, если оно не определено
  useEffect(() => {
    if (introState.depthNeckV === undefined) {
      introState.setDepthNeckV(LHVmin);
    }
  }, [LHVmin]);
  
  // Используем безопасную инициализацию состояния для отображения с учетом HrezV
  const [sliderValue, setSliderValue] = useState(
    introState.depthNeckV !== undefined ? 
      (introState.depthNeckV + HrezV).toFixed(1) : 
      (LHVmin + HrezV).toFixed(1)
  );

  useEffect(() => {
    // Синхронизируем значение слайдера с TextInput, только если depthNeckV определено
    if (introState.depthNeckV !== undefined) {
      setSliderValue((introState.depthNeckV + HrezV).toFixed(1));
    }
  }, [introState.depthNeckV, HrezV]);

  // Функция для обработки изменений в Slider
  const handleSliderChange = (value) => {
    // Вычитаем HrezV, чтобы получить чистое значение depthNeckV
    const actualValue = value - HrezV;
    // Округляем значение до 1 десятичного знака
    const roundedValue = parseFloat(actualValue.toFixed(1));
    introState.setDepthNeckV(roundedValue);
  };

  // Функция для обработки изменений в TextInput
  const handleTextInputChange = (value) => {
    if (value === '') {
      setSliderValue(''); // Позволяем очистить поле ввода
      introState.setDepthNeckV(LHVmin); // Устанавливаем минимальное значение по умолчанию
    } else {
      // Заменяем запятую на точку для корректного парсинга
      const cleanValue = value.replace(',', '.');
      const numericValue = parseFloat(cleanValue);
      
      // Проверяем с учетом HrezV
      if (!isNaN(numericValue) && 
          numericValue >= (LHVmin + HrezV) && 
          numericValue <= (LHVmax + HrezV)) {
        // Округляем до 1 десятичного знака
        const roundedValue = parseFloat(numericValue.toFixed(1));
        setSliderValue(roundedValue.toFixed(1));
        // Сохраняем в introState без учета HrezV
        introState.setDepthNeckV(roundedValue - HrezV);
      } else {
        setSliderValue(''); // Очищаем поле ввода, если значение некорректно
      }
    }
  };

  const handleNext = () => {
    console.log('Next button pressed with value:', introState.depthNeckV);
    router.push('app/(tabs)/input/resultV');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/neckdepthV.png')}
        style={styles.image}
        contentFit="contain"
      />
      <Text style={styles.title}>{i18n.t('NeckDepth')}</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => {
          const currentValue = parseFloat(sliderValue) || (LHVmin + HrezV);
          // Уменьшаем на 0.1 и округляем
          const newValue = Math.max((LHVmin + HrezV), parseFloat((currentValue - 0.1).toFixed(1)));
          handleTextInputChange(newValue.toFixed(1));
        }}>
          <Text style={styles.arrow}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={sliderValue}
          keyboardType="numeric"
          placeholder="Введите значение"
          onChangeText={handleTextInputChange}  
        />
        <TouchableOpacity onPress={() => {
          const currentValue = parseFloat(sliderValue) || (LHVmin + HrezV);
          // Увеличиваем на 0.1 и округляем
          const newValue = Math.min((LHVmax + HrezV), parseFloat((currentValue + 0.1).toFixed(1)));
          handleTextInputChange(newValue.toFixed(1));
        }}>
          <Text style={styles.arrow}>+</Text>
        </TouchableOpacity>
        <Text style={styles.inputLabel}>{i18n.t('sm')}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={LHVmin + HrezV}
        maximumValue={LHVmax + HrezV}
        step={0.1} // Шаг 0.1 для десятичных значений
        value={parseFloat(sliderValue) || (LHVmin + HrezV)}
        onValueChange={handleSliderChange}
        minimumTrackTintColor="#000000"
        maximumTrackTintColor="#CCCCCC"
        thumbTintColor="#000000"
      />
      <View style={styles.sliderLabels}>
        <Text style={styles.labelText}>{(LHVmin + HrezV).toFixed(1)} {i18n.t('sm')}</Text>
        <Text style={styles.labelText}>{(LHVmax + HrezV).toFixed(1)} {i18n.t('sm')}</Text>
        console.log(LHVmin);
        console.log(LHVmax);
        console.log(HrezV);
      </View>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
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
    marginLeft: 10,
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
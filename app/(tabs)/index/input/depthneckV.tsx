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

const DepthNeckV = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const navigation = useNavigation();
  const unit = onboardingState.measurementSystem === 'imperial' ? 'in' : 'cm';
  const HrezV = introState.ribbingWidthV;
  const [limits] = useState(() => {
    const results = introState.calculateRaglan();
    const min = typeof results === 'string' ? 1 : parseFloat((results.LHVmin || 1).toFixed(1));
    const max = typeof results === 'string' ? 5 : parseFloat((results.LHVmax || 5).toFixed(1));
    return { min, max };
  });
  const LHVmin = limits.min;
  const LHVmax = limits.max;
  
  // Используем безопасную инициализацию состояния для отображения с учетом HrezV
  const [sliderValue, setSliderValue] = useState(
    introState.depthNeckV !== undefined ? 
      (introState.depthNeckV + HrezV).toFixed(1) : 
      (LHVmin + HrezV).toFixed(1)
  );

  // Функция для обработки изменений в Slider
  const handleSliderChange = (value: number) => {
    // Округляем значение до одного десятичного знака
    const roundedValue = parseFloat(value.toFixed(1));
    // Вычитаем HrezV, чтобы получить чистое значение depthNeckV
    const actualValue = roundedValue - HrezV;
    
    // Проверяем, что значение находится в допустимых пределах
    if (actualValue >= LHVmin && actualValue <= LHVmax) {
      setSliderValue(roundedValue.toFixed(1));
    }
  };

  // Функция для обработки изменений в TextInput
  const handleTextInputChange = (value: string) => {
    if (value === '') {
      setSliderValue(''); // Позволяем очистить поле ввода
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
      } else {
        setSliderValue(''); // Очищаем поле ввода, если значение некорректно
      }
    }
  };

  const handleNext = () => {
    const displayValue = parseFloat(sliderValue);
    const safeDisplayValue = Number.isNaN(displayValue)
      ? (LHVmin + HrezV)
      : Math.min(LHVmax + HrezV, Math.max(LHVmin + HrezV, displayValue));
    const actualValue = parseFloat((safeDisplayValue - HrezV).toFixed(1));
    introState.setDepthNeckV(actualValue);
    introState.setIntroFinished(true);
    // router.push('/input/resultV');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/neckdepthV.png')}
        style={styles.image}
        contentFit="contain"
      />
      <Text style={styles.title}>{i18n.t('depthNeck')}</Text>
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
          placeholder="0"
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
        <Text style={styles.inputLabel}>{unit}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={LHVmin + HrezV}
        maximumValue={LHVmax + HrezV}
        value={parseFloat(sliderValue)}
        onValueChange={handleSliderChange}
        step={0.1}
        minimumTrackTintColor="#000000"
        maximumTrackTintColor="#CCCCCC"
        thumbTintColor="#000000"
      />
      <View style={styles.sliderLabels}>
        <Text style={styles.labelText}>{(LHVmin + HrezV).toFixed(1)} {unit}</Text>
        <Text style={styles.labelText}>{(LHVmax + HrezV).toFixed(1)} {unit}</Text>
       
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
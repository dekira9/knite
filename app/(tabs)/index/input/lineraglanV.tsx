import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Image } from 'expo-image';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { useRouter } from 'expo-router';
import { screenWidth } from '@/utils/Layout';

const LineraglanV = () => {
  const router = useRouter();
  const Kmin = 0;
  const results = introState.calculateRaglan();
  const KmaxV = typeof results === 'string' ? 5 : results.KmaxV || 5;
  const [sliderValue, setSliderValue] = useState(introState.raglanLineWidthV.toString());

  useEffect(() => {
    // Синхронизируем значение слайдера с TextInput
    setSliderValue(introState.raglanLineWidthV.toString());
  }, [introState.raglanLineWidthV]);

  // Функция для обработки изменений в Slider
  const handleSliderChange = (value: number) => {
    const newValue = Math.round(value);
    if (introState.raglanLineWidthV !== newValue) {
      introState.setRaglanLineWidthV(newValue); // Обновляем ширину регланной линии в introState
    }
  };

  // Функция для обработки изменений в TextInput
  const handleTextInputChange = (value: string) => {
    if (value === '') {
      setSliderValue('');
      introState.setRaglanLineWidthV(Kmin);
    } else {
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue) && numericValue >= Kmin && numericValue <= KmaxV) {
        // Обновляем состояние только если значение действительно изменилось
        if (sliderValue !== value) {
          setSliderValue(value);
        }
        if (introState.raglanLineWidthV !== numericValue) {
          introState.setRaglanLineWidthV(numericValue);
        }
      } else if (numericValue > KmaxV) {
        // Если значение больше максимума, устанавливаем максимум
        setSliderValue(KmaxV.toString());
        introState.setRaglanLineWidthV(KmaxV);
      } else if (numericValue < Kmin) {
        // Если значение меньше минимума, устанавливаем минимум
        setSliderValue(Kmin.toString());
        introState.setRaglanLineWidthV(Kmin);
      }
    }
  };

  const handleNext = () => {
    console.log('Next button pressed with value:', introState.raglanLineWidthV);
    router.push('/(tabs)/input/depthneckV');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/LineRaglanV.png')}
        style={styles.image}
        contentFit="contain"
      />
      <Text style={styles.title}>{i18n.t('RaglanLineWidth')}</Text>
      <View style={styles.inputContainer}>
      <TouchableOpacity onPress={() => {
        const currentValue = parseInt(sliderValue) || 0;
        const newValue = Math.max(Kmin, currentValue - 1);
        handleTextInputChange(newValue.toString());
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
          const currentValue = parseInt(sliderValue) || 0;
          const newValue = Math.min(KmaxV, currentValue + 1);
          handleTextInputChange(newValue.toString());
        }}>
          <Text style={styles.arrow}>+</Text>
        </TouchableOpacity>
        <Text style={styles.inputLabel}>{i18n.t('stitches')}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={Kmin}
        maximumValue={KmaxV}
        step={1}
        value={parseInt(sliderValue, 10)}
        onValueChange={handleSliderChange}
        minimumTrackTintColor="#000000"
        maximumTrackTintColor="#CCCCCC"
        thumbTintColor="#000000" // Эта строка определяет цвет бегунка
      />
      <View style={styles.sliderLabels}>
        <Text style={styles.labelText}>{Kmin} {i18n.t('stitches')}</Text>
        <Text style={styles.labelText}>{KmaxV} {i18n.t('stitches')}</Text>
      </View>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.buttonText}>{i18n.t('next')}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default observer(LineraglanV);

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
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Image } from 'expo-image';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { useNavigation } from '@react-navigation/native';
import { screenWidth } from '@/utils/Layout';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { computeRegularRaglanLineMaxFromMeasurements } from '@/utils/calculateRaglan';

const LineraglanWidth = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const navigation = useNavigation();
  const Kmin = 0;
  const Kmax = computeRegularRaglanLineMaxFromMeasurements({
    headCircumference: introState.headCircumference,
    neckCircumference: introState.neckCircumference,
    stitchDensity: introState.stitchDensity,
    ribbingWidth: introState.ribbingWidth,
  });
  const [sliderValue, setSliderValue] = useState(introState.raglanLineWidth.toString());

  // Функция для обработки изменений в Slider
  const handleSliderChange = (value: number) => {
    setSliderValue(Math.round(value).toString());
  };

  // Функция для обработки изменений в TextInput
  const handleTextInputChange = (value: string) => {
    if (value === '') {
      setSliderValue(''); // Позволяем очистить поле ввода
    } else {
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue) && numericValue >= Kmin && numericValue <= Kmax) {
        setSliderValue(value);
      } else {
        setSliderValue(''); // Очищаем поле ввода, если значение некорректно
      }
    }
  };

  const handleNext = () => {
    const nextValue = Math.min(Kmax, Math.max(Kmin, parseInt(sliderValue, 10) || Kmin));
    introState.setRaglanLineWidth(nextValue);
    introState.markMeasurementsCustom();
    introState.setIntroFinished(true);
    (navigation as any).navigate('Result');
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
      <TouchableOpacity onPress={() => handleTextInputChange(((parseInt(sliderValue, 10) || Kmin) - 1).toString())}>
        <Text style={styles.arrow}>-</Text>
      </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={sliderValue}
          keyboardType="numeric"
          //placeholder="Введите значение"
          onChangeText={handleTextInputChange}  
        />
        <TouchableOpacity onPress={() => handleTextInputChange(((parseInt(sliderValue, 10) || Kmin) + 1).toString())}>
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
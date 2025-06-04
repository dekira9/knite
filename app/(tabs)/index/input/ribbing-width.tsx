import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { screenWidth } from '@/utils/Layout';

export default observer(() => {
  const router = useRouter();
  {
    /* Calculate min and max values*/
  }
  const stitches = parseFloat(introState.stitchDensity.replace(',', '.')) / 10;
  const rows = parseFloat(introState.rowDensity.replace(',', '.')) / 10;
  const K = 2; // Петли в регланной линии
  const LK = K / stitches;
  const LRezMin = Math.round((2 / rows) * 10) / 10;

  const LRezMax = Math.round((introState.neckCircumference / Math.PI) * 10) / 10;

  const [localRibbingWidth, setLocalRibbingWidth] = useState(2);
  console.log('localRibbingWidth', localRibbingWidth);

  {
    /* //ширина резинки*/
  }
  const handleValueChange = (value) => {
    if (value === '') {
      setLocalRibbingWidth(''); // Позволяем очистить поле ввода
      introState.setRibbingWidth(LRezMin); // Устанавливаем минимальное значение по умолчанию
    } else {
      const numericValue = parseFloat(value.replace(',', '.')); // Заменяем запятую на точку
      if (!isNaN(numericValue) && numericValue >= LRezMin && numericValue <= LRezMax) {
        const fixedValue = parseFloat(numericValue.toFixed(1)); // Ограничиваем до 1 знака после запятой
        setLocalRibbingWidth(fixedValue);
        introState.setRibbingWidth(fixedValue);
      } else {
        setLocalRibbingWidth(''); // Очищаем поле ввода, если значение некорректно
      }
    }
  };

  const handleNext = () => {
    introState.setRibbingWidth(localRibbingWidth);
    router.push('(tabs)/input/lineraglan-width');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/ribbing.svg')}
        style={styles.image}
        contentFit="contain"
      />
      <Text style={styles.title}>{i18n.t('ribbingWidth')}</Text>

      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={() =>
            setLocalRibbingWidth((prev) =>
             Math.max(LRezMin, parseFloat((prev - 0.1).toFixed(1))))
          }
        >
          <Text style={styles.arrow}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.valueInput}
          value={localRibbingWidth.toString()}
          onChangeText={handleValueChange}
          keyboardType="numeric"
          placeholder="Введите значение"
        />
        <TouchableOpacity
          onPress={() =>
            setLocalRibbingWidth((prev) => Math.min(LRezMax, parseFloat((prev + 0.1).toFixed(1))))
          }
        >
          <Text style={styles.arrow}>+</Text>
        </TouchableOpacity>
        <Text style={styles.inputLabel}>{i18n.t('sm')}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={LRezMin}
        maximumValue={LRezMax}
        value={localRibbingWidth}
        onValueChange={(value) => setLocalRibbingWidth(parseFloat(value.toFixed(1)))}
        step={0.1}
        minimumTrackTintColor="#000000"
        maximumTrackTintColor="#CCCCCC"
        thumbTintColor="#000000"
      />
      <View style={styles.rangeLabels}>
        <Text style={styles.rangeText}>{LRezMin.toFixed(1)} см</Text>
        <Text style={styles.rangeText}>{LRezMax.toFixed(1)} см</Text>
      </View>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
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

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import introState from '@/state/introState';
import i18n from '@/utils/translations';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { screenWidth } from '@/utils/Layout';
import { observer } from 'mobx-react-lite';

export default observer(() => {
  const router = useRouter();

  // Calculate min and max values
  const stitches = parseFloat(introState.stitchDensity.replace(',', '.')) / 10;
  const rows = parseFloat(introState.rowDensity.replace(',', '.')) / 10;
  const K = 2; // Петли в регланной линии
  const LK = K / stitches;
  const LRezMinV = 2 / rows;
  const neck = Number(introState.neckCircumference); // OS
  const head = Number(introState.headCircumference); // OG

  const LRezMaxV = (neck + head) / 6 / Math.PI;

  console.log('шея', introState.neckCircumference);
  console.log('голова', introState.headCircumference); 
  console.log('LRezMaxV', LRezMaxV);
  console.log('LRezMinV:', LRezMinV);

  // Инициализируем значение raglanLineWidthV, если оно не определено
  useEffect(() => {
    if (introState.raglanLineWidthV === undefined) {
      introState.setRaglanLineWidthV(1); // Устанавливаем значение по умолчанию
    }
  }, []);

  const [localRibbingWidthV, setLocalRibbingWidthV] = useState(2);
console.log("localRibbingWidthV", localRibbingWidthV);
  
  
  {/*// Ширина резинки*/}
  const handleValueChange = (value: string) => {
    if (value === '') {
      setLocalRibbingWidthV('');
      introState.setRibbingWidthV(LRezMinV.toString());
    } else {
      const numericValue = parseFloat(value.replace(',', '.'));
      if (!isNaN(numericValue) && numericValue >= LRezMinV && numericValue <= LRezMaxV) {
        const fixedValue = parseFloat(numericValue.toFixed(1));
        setLocalRibbingWidthV(fixedValue);
        introState.setRibbingWidthV(fixedValue.toString());
      } else {
        setLocalRibbingWidthV('');
      }
    }
  };
{/*// переход кнопка*/}
  const handleNext = () => {
    introState.setRibbingWidthV(localRibbingWidthV.toString());
    
    // Убедимся, что raglanLineWidthV инициализирован перед переходом
    if (introState.raglanLineWidthV === undefined) {
      introState.setRaglanLineWidthV(1);
    }
    
    router.push('/(tabs)/input/lineraglanV');
  };

    return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/images/ribwidthV.svg')}
        style={styles.image}
        contentFit="contain"
      />
      <Text style={styles.title}>{i18n.t('ribbingWidth')}</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => setLocalRibbingWidthV(prev => Math.max(LRezMinV, parseFloat((prev - 0.1).toFixed(1))))}>
          <Text style={styles.arrow}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.valueInput}
          value={localRibbingWidthV.toString()}
          onChangeText={handleValueChange}
          keyboardType="numeric"
          placeholder="Введите значение"
        />
        <TouchableOpacity onPress={() => setLocalRibbingWidthV(prev => Math.min(LRezMaxV, parseFloat((prev + 0.1).toFixed(1))))}>
          <Text style={styles.arrow}>+</Text>
        </TouchableOpacity>
        <Text style={styles.inputLabel}>{i18n.t('sm')}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={LRezMinV}
        maximumValue={LRezMaxV}
        value={localRibbingWidthV}
        onValueChange={(value) => setLocalRibbingWidthV(parseFloat(value.toFixed(1)))}
        step={0.1}
        minimumTrackTintColor="#000000"
        maximumTrackTintColor="#CCCCCC"
        thumbTintColor="#000000"
      />
      <View style={styles.rangeLabels}>
        <Text style={styles.rangeText}>{LRezMinV.toFixed(1)} см</Text>
        <Text style={styles.rangeText}>{LRezMaxV.toFixed(1)} см</Text>
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
    fontSize: 24,
    marginLeft: 1,
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
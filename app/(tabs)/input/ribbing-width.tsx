import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {screenWidth} from '@/utils/Layout';
export default observer(() => {
  const router = useRouter();
  // Calculate min and max values
  const stitches = parseFloat(introState.stitchDensity.replace(',', '.')) / 10;
  const rows = parseFloat(introState.rowDensity.replace(',', '.')) / 10;
  const K = 2; // Петли в регланной линии
  const LK = K / stitches;
  const LRezMin = 2 / rows;

  const LRezMax = (Math.round(((40 - introState.LFrontO - 2 * LK) / 3) * rows / 2) * 2) / rows;

  const [localRibbingWidth, setLocalRibbingWidth] = useState(
    2
  );

  const handleValueChange = (value: number) => {
    setLocalRibbingWidth(value);
  };

  const handleNext = () => {
    introState.setRibbingWidth(localRibbingWidth);
    router.push('/input/fit');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('ribbingWidth')}</Text>
        <Image 
          source={require('@/assets/images/ribbing.svg')}
          style={styles.image}
          contentFit="contain"
        />
      <Text style={styles.value}>{localRibbingWidth.toFixed(1)} см</Text>
      <Slider
        style={styles.slider}
        minimumValue={LRezMin}
        maximumValue={LRezMax}
        value={localRibbingWidth}
        onValueChange={handleValueChange}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
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
  image: {
    width: screenWidth * 0.8,
    height: 200,
    marginBottom: 20,
  },
}); 
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Keyboard, TouchableWithoutFeedback, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import raglanState from '@/state/raglanState';

export default function IntroScreen() {
  const insets = useSafeAreaInsets();
  const [headCircumference, setHeadCircumference] = useState('58'); // Og
  const [neckCircumference, setNeckCircumference] = useState('36'); // Os
  const [chestCircumference, setChestCircumference] = useState('92'); // Ogr
  const [stitchDensity, setStitchDensity] = useState('2.4'); //p-
  const [rowDensity, setRowDensity] = useState('3.2'); // p'
  const [fitType, setFitType] = useState('fitted');
  const [result, setResult] = useState('');
  const [gridData, setGridData] = useState<{ width: number; height: number }[]>([]);

  const calculateRaglan = () => {
    const head = parseFloat(headCircumference.replace(',', '.'));
    const neck = parseFloat(neckCircumference.replace(',', '.'));
    const chest = parseFloat(chestCircumference.replace(',', '.'));
    const stitches = parseFloat(stitchDensity.replace(',', '.'));
    const rows = parseFloat(rowDensity.replace(',', '.'));

    if (isNaN(head) || isNaN(neck) || isNaN(chest) || isNaN(stitches) || isNaN(rows)) {
      setResult('Пожалуйста, введите все значения корректно.');
      return;
    }

    const K = 2; // Петли в регланной линии
    const Hrez = 2; // Высота резинки в см
    const pi = Math.PI;

    const dr = (head - neck) / (2 * pi);
    const LOsm = Hrez <= dr ? (head - pi * Hrez) : ((neck + 2 * pi * Hrez) * 0.9);
    const LFrontO = (LOsm - 4 * K / stitches) / 8 * 3;
    const LO_p = Math.round(LOsm * stitches) / stitches;
    const LFrontO_p = Math.round(LFrontO * stitches) / stitches;

    const NRrez = Math.round(Hrez * rows);
    const SO = Math.round((LOsm * stitches) / 2) * 2;
    const SFrontO = Math.round((((SO - 4 * K) / 8 * 3) / 2) * 2);

    let fit = 0; // Default to "Slim-fit"
    switch (fitType) {
      case 'semi-fitted':
        fit = Math.round(2 * stitches) / stitches; // NORM
        break;
      case 'loose':
        fit = Math.round(6 * stitches) / stitches; // FREE
        break;
      case 'oversized':
        fit = Math.round(10 * stitches) / stitches; // SUPER FREE
        break;
      default:
        fit = 0; // Slim-fit
    }

    const SFit = Math.round(fit * stitches);
    const SOgr = Math.round(chest * stitches / 2) * 2;

    // const LPodr = Math.round(((chest + fit) * 0.08) * stitches) / stitches;
    // const SPodr = LPodr * stitches;
    const SPodr = Math.round((SOgr + SFit) * 0.08);

    // const LFrontOGr = (chest - 4 * K / stitches  - LPodr * 2+ fit) / 2;
    // const SFrontOGr = Math.round(LFrontOGr * stitches / 2) * 2;
    const SFrontOGr = Math.round((SOgr - 4 * K - 2 * SPodr + SFit) / 2);

    const Sfx = Math.round(((SFrontOGr - SFrontO) / 2) / 2) * 2;
    const NRfx = Sfx * 2;
    const Lfx = Sfx / stitches;
    const LRfx = NRfx / rows;

    const Kfront_cm = (K / 2 - Math.floor(K / 2)) === 0 ? K / (2 * stitches) : ((K / 2) + 1 / 2) / stitches;
    const SKfront = Math.round(Kfront_cm * stitches);
    const SKa = K - SKfront;
    
    const Rostok = neck / 6 - 1;
    const NRostok = Math.round((Rostok * rows) / 2) * 2;

    const Sa = (SO - 2 * SFrontO - 4 * K) / 2;
    const Ka_cm = K / stitches - Kfront_cm;
    const La = Sa / stitches;
    const LK = K / stitches;
    const Ls = 1 / stitches;
    const hs = 1 / rows;

    const Projma = (chest + fit) / 6 + 5;
    const HFront_sm = Projma - Hrez;
    const NHFront = Math.round((HFront_sm * rows) / 2) * 2;

    const prib_1x1 = (NHFront - 2 * Sfx) < 0 ? (2 * Sfx - NHFront) : 0;
    const prib_1x3 = NHFront > 2 * Sfx ? 3 * (NHFront - 2 * Sfx) : 0;
    const prib_1x2 = NHFront - prib_1x1 - prib_1x3;
    const prib_1x4 = NHFront > 2 * Sfx ? 4 * (NHFront / 2 - Sfx) : 0;
    const PR_1X2 = NHFront - prib_1x1 - prib_1x4;

    const prib_1x1_f = (NHFront - 2 * Sfx) < 0 ? (2 * Sfx - NHFront) : 0;
    const prib_1x3_f = NHFront > 2 * Sfx ? (NHFront - 2 * Sfx) : 0;
    const prib_1x2_f = prib_1x2 !== 0 ? (NHFront - prib_1x1 - prib_1x3)/2 : 0;
    const prib_1x4_f = NHFront > 2 * Sfx ? (NHFront / 2 - Sfx) : 0;
    const PR_1X2_f = prib_1x2 !== 0 ? (NHFront - prib_1x1 - prib_1x4)/2 : 0;

    // Логика выбора типа прибавок
    let usedIncreaseType: string[] = [];

    if (PR_1X2_f > 0 && prib_1x4_f > 0 && PR_1X2_f + prib_1x4_f === Sfx) {
      usedIncreaseType.push('1x2, 1x4');
    }
    if (PR_1X2_f > 0 && prib_1x4_f > 0 && prib_1x1_f > 0 && PR_1X2_f + prib_1x4_f + prib_1x1_f === Sfx) {
      usedIncreaseType.push('1x2, 1x4, 1x1');
    }
    if (PR_1X2_f > 0 && prib_1x1_f > 0 && PR_1X2_f + prib_1x1_f === Sfx) {
      usedIncreaseType.push('1x2, 1x1');
    }
    if (prib_1x4_f > 0 && prib_1x1_f > 0 && prib_1x4_f + prib_1x1_f === Sfx) {
      usedIncreaseType.push('1x4, 1x1');
    }
    if (prib_1x2_f > 0 && prib_1x3_f > 0 && prib_1x2_f + prib_1x3_f === Sfx) {
      usedIncreaseType.push('1x2, 1x3');
    }
    if (prib_1x3_f > 0 && prib_1x1_f > 0 && prib_1x3_f + prib_1x1_f === Sfx) {
      usedIncreaseType.push('1x3, 1x1');
    }
    if (prib_1x2_f > 0 && prib_1x3_f > 0 && prib_1x1_f > 0 && prib_1x2_f + prib_1x3_f + prib_1x1_f === Sfx) {
      usedIncreaseType.push('1x2, 1x3, 1x1');
    }
    if (prib_1x2_f > 0 && prib_1x2_f === Sfx) {
      usedIncreaseType.push('1x2');
    }
    if (prib_1x4_f > 0 && prib_1x4_f === Sfx) {
      usedIncreaseType.push('1x4');
    }
    if (prib_1x3_f > 0 && prib_1x3_f === Sfx) {
      usedIncreaseType.push('1x3');
    }
    if (prib_1x1_f > 0 && prib_1x1_f === Sfx) {
      usedIncreaseType.push('1x1');
    }

    // Convert the list to a string for display
    const usedIncreaseTypeString = usedIncreaseType.length > 0 ? usedIncreaseType.join(' | ') : 'Нет подходящего типа прибавок';

    setResult(`
      Как сидит в петлях: ${SFit}
      Количество петель набора горловины: ${SO}
      Высота резинки в рядах: ${NRrez}
      Количество петель переда: ${SFrontO}
      Набор петель на рукова: ${Sa}
      Петли в регланной линии: ${K}
      Петли в регланной линии на корпус: ${SKfront}
      Петли в регланной линии на рукава: ${SKa}
      Рядов высота переда без резинки: ${NHFront}
      Высота ростка в рядах: ${NRostok}
      Количество петель переда по груди: ${SFrontOGr}
      Петли подрез под каждым рукавом: ${SPodr}
      Петли прибавка: ${Sfx}

      Используемый тип прибавок: ${usedIncreaseTypeString}
    `);
    // Петли prib_1x1: ${prib_1x1}
    // Петли prib_1x2: ${prib_1x2}
    // Петли prib_1x3: ${prib_1x3}
    // Петли prib_1x4: ${prib_1x4}
    // Петли PR_1X2: ${PR_1X2}

    // Петли prib_1x1_f: ${prib_1x1_f}
    // Петли prib_1x2_f: ${prib_1x2_f}
    // Петли prib_1x3_f: ${prib_1x3_f}
    // Петли prib_1x4_f: ${prib_1x4_f}
    // Петли PR_1X2_f: ${PR_1X2_f}

    raglanState.setRaglanData({
      SO,
      NRrez,
      SFrontO,
      Sa,
      K,
      SKfront,
      SKa,
      NHFront,
      NRostok,
      SFrontOGr,
      SPodr,
      Sfx,
      prib_1x1,
      prib_1x2,
      prib_1x3,
      prib_1x4,
      PR_1X2,
      prib_1x1_f,
      prib_1x2_f,
      prib_1x3_f,
      prib_1x4_f,
      PR_1X2_f,
      usedIncreaseType,
      usedIncreaseTypeString,
      fit,
    });
  };

  const fitOptions = [
    { label: 'Slim-fit', value: 'fitted' },
    { label: 'Norm', value: 'semi-fitted' },
    { label: 'Free', value: 'loose' },
    { label: 'Super Free', value: 'oversized' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingTop: insets.top, paddingBottom: insets.bottom + 100 }]}>
          <View style={styles.container}>
            <Text style={styles.title}>Lets knit!</Text>
            <Image source={require('@/assets/images/main.png')} style={styles.mainImage} />
            
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
              <Image 
                contentFit="contain" 
                source={require('@/assets/images/head.svg')} 
                style={{ width: 70, height: 70 }} 
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.label}>Обхват головы (см)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Обхват головы (см)"
                  keyboardType="numeric"
                  value={headCircumference}
                  onChangeText={setHeadCircumference}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
              <Image 
                contentFit="contain" 
                source={require('@/assets/images/neck.svg')} 
                style={{ width: 70, height: 70 }} 
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.label}>Обхват шеи (см)</Text>
                <TextInput
              style={styles.input}
              placeholder="Обхват шеи (см)"
              keyboardType="numeric"
              value={neckCircumference}
                  onChangeText={setNeckCircumference}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
              <Image 
                contentFit="contain" 
                source={require('@/assets/images/chest.svg')} 
                style={{ width: 70, height: 70 }} 
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.label}>Обхват груди (см)</Text>
                <TextInput
              style={styles.input}
              placeholder="Обхват груди (см)"
              keyboardType="numeric"
              value={chestCircumference}
                  onChangeText={setChestCircumference}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
              <Image 
                contentFit="contain" 
                source={require('@/assets/images/density.svg')} 
                style={{ width: 100, height: 100 }} 
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.label}>Плотность вязания (петли в 10 см)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Плотность вязания (петли в 10 см)"
                  keyboardType="numeric"
                  value={stitchDensity}
                  onChangeText={setStitchDensity}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
              <Image 
                contentFit="contain" 
                source={require('@/assets/images/density3.svg')} 
                style={{ width: 105, height: 105 }} 
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.label}>Плотность вязания (ряды в 10 см)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Плотность вязания (ряды в 10 см)"
                  keyboardType="numeric"
                  value={rowDensity}
                  onChangeText={setRowDensity}
                />
              </View>
            </View>
            <View style={styles.buttonGroup}>
              {fitOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.fitButton,
                    fitType === option.value && styles.selectedFitButton,
                  ]}
                  onPress={() => setFitType(option.value)}
                >
                  <Text style={styles.fitButtonText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Рассчитать реглан" onPress={calculateRaglan} />
            </View>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  mainImage: {
    width: '100%',
    height: 180,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%',
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  picker: {
    height: 200,
    width: '100%',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    alignSelf: 'flex-start',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  fitButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  selectedFitButton: {
    backgroundColor: '#ddd',
  },
  fitButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

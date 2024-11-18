import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Keyboard, TouchableWithoutFeedback, ScrollView, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
export default function IntroScreen() {
  const [headCircumference, setHeadCircumference] = useState('58');
  const [neckCircumference, setNeckCircumference] = useState('36');
  const [chestCircumference, setChestCircumference] = useState('92');
  const [stitchDensity, setStitchDensity] = useState('2.4');
  const [rowDensity, setRowDensity] = useState('3.2');
  const [fitType, setFitType] = useState('fitted');
  const [result, setResult] = useState('');

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
    console.log('LOsm', LOsm)

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

    const LFrontOGr = (chest + fit) / 2;
    const SFrontOGr = Math.round(LFrontOGr * stitches / 2) * 2;

    const LPodr = Math.round(((chest + fit) * 0.08) * stitches) / stitches;
    const SPodr = LPodr * stitches;

    const Sfx = Math.round(((SFrontOGr - SFrontO - K - SPodr) / 2) / 2) * 2;
    const NRfx = Sfx * 2;
    const Lfx = Sfx / stitches;
    const LRfx = NRfx / rows;

    const Kfront_cm = (K / 2 - Math.floor(K / 2)) === 0 ? K / (2 * stitches) : ((K / 2) + 1 / 2) / stitches;

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

    const increaseTypes = [
      { type: '1x2', value: prib_1x2_f },
      { type: '1x3', value: prib_1x3_f },
      { type: '1x4', value: prib_1x4_f },
      { type: '1x1', value: prib_1x1_f }
    ];

    // Filter out increase types with non-positive values
    const validIncreaseTypes = increaseTypes.filter(inc => inc.value > 0);

    // Define priority order for combinations
    const priorityCombinations = [
      ['1x2', '1x4'],
      ['1x2', '1x4', '1x1'],
      ['1x2', '1x1'],
      ['1x4', '1x1'],
      ['1x2', '1x3'],
      ['1x3', '1x1'],
      ['1x2', '1x3', '1x1'],
      ['1x2'],
      ['1x4'],
      ['1x3'],
      ['1x1']
    ];

    let foundCombinations = [];

    for (const combination of priorityCombinations) {
      const total = combination.reduce((sum, type) => {
        const increase = validIncreaseTypes.find(inc => inc.type === type);
        return sum + (increase ? increase.value : 0);
      }, 0);

      if (total === Sfx) {
        foundCombinations.push(combination.join(', '));
      }
    }

    const usedIncreaseType = foundCombinations.length > 0 ? foundCombinations.join(' | ') : 'Нет подходящего типа прибавок';

    setResult(`
      Количество петель набора горловины: ${SO}
      Высота резинки в рядах: ${NRrez}
      Количество петель переда: ${SFrontO}
      Набор петель на рукова: ${Sa}
      Петли в регланной линии: ${K}
      Рядов высота переда без резинки: ${NHFront}
      Высота ростка в рядах: ${NRostok}
      Количество петель переда по груди: ${SFrontOGr}
      Петли подрез под каждым рукавом: ${SPodr}
      Петли прибавка: ${Sfx}
      Петли prib_1x1: ${prib_1x1}
      Петли prib_1x2: ${prib_1x2}
      Петли prib_1x3: ${prib_1x3}
      Петли prib_1x4: ${prib_1x4}
      Петли PR_1X2: ${PR_1X2}

      Петли prib_1x1_f: ${prib_1x1_f}
      Петли prib_1x2_f: ${prib_1x2_f}
      Петли prib_1x3_f: ${prib_1x3_f}
      Петли prib_1x4_f: ${prib_1x4_f}
      Петли PR_1X2_f: ${PR_1X2_f}

      Используемые типы прибавок: ${usedIncreaseType}
    `);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to KnitApp!</Text>
          <TextInput
            style={styles.input}
            placeholder="Обхват головы (см)"
            keyboardType="numeric"
            value={headCircumference}
            onChangeText={setHeadCircumference}
          />
          <TextInput
            style={styles.input}
            placeholder="Обхват шеи (см)"
            keyboardType="numeric"
            value={neckCircumference}
            onChangeText={setNeckCircumference}
          />
          <TextInput
            style={styles.input}
            placeholder="Обхват груди (см)"
            keyboardType="numeric"
            value={chestCircumference}
            onChangeText={setChestCircumference}
          />
          <TextInput
            style={styles.input}
            placeholder="Плотность вязания (петли в 10 см)"
            keyboardType="numeric"
            value={stitchDensity}
            onChangeText={setStitchDensity}
          />
          <TextInput
            style={styles.input}
            placeholder="Плотность вязания (ряды в 10 см)"
            keyboardType="numeric"
            value={rowDensity}
            onChangeText={setRowDensity}
          />
          <Picker
            selectedValue={fitType}
            style={styles.picker}
            onValueChange={(itemValue) => setFitType(itemValue)}
          >
            <Picker.Item label="В облипку" value="fitted" />
            <Picker.Item label="Полуприлегающий" value="semi-fitted" />
            <Picker.Item label="Свободный" value="loose" />
            <Picker.Item label="Оверсайз" value="oversized" />
          </Picker>
          <View style={styles.buttonContainer}>
            <Button title="Рассчитать реглан" onPress={calculateRaglan} />
          </View>
          {result ? <Text style={styles.result}>{result}</Text> : null}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    height: Dimensions.get('window').height+ 400,
  },
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
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
    width: '100%',
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
});

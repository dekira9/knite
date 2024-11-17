import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
export default function IntroScreen() {
  const [headCircumference, setHeadCircumference] = useState('');
  const [neckCircumference, setNeckCircumference] = useState('');
  const [chestCircumference, setChestCircumference] = useState('');
  const [stitchDensity, setStitchDensity] = useState('');
  const [rowDensity, setRowDensity] = useState('');
  const [fitType, setFitType] = useState('fitted');
  const [result, setResult] = useState('');

  const calculateRaglan = () => {
    const head = parseFloat(headCircumference);
    const neck = parseFloat(neckCircumference);
    const chest = parseFloat(chestCircumference);
    const stitches = parseFloat(stitchDensity);
    const rows = parseFloat(rowDensity);

    if (isNaN(head) || isNaN(neck) || isNaN(chest) || isNaN(stitches) || isNaN(rows)) {
      setResult('Пожалуйста, введите все значения корректно.');
      return;
    }

    // Adjust chest circumference based on fit type
    let adjustedChest = chest;
    switch (fitType) {
      case 'fitted':
        adjustedChest = chest;
        break;
      case 'semi-fitted':
        adjustedChest = chest * 1.05; // 5% increase
        break;
      case 'loose':
        adjustedChest = chest * 1.1; // 10% increase
        break;
      case 'oversized':
        adjustedChest = chest * 1.2; // 20% increase
        break;
    }

    const raglanStitches = (adjustedChest - neck) * stitches / 10;
    const raglanRows = (adjustedChest - head) * rows / 10;

    setResult(`Петли для реглана: ${raglanStitches.toFixed(2)}, Ряды для реглана: ${raglanRows.toFixed(2)}`);
  };

  return (
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
      <Button title="Рассчитать реглан" onPress={calculateRaglan} />
      {result ? <Text style={styles.result}>{result}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
});

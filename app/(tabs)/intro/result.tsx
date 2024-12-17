import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';

export default observer(() => {
  const router = useRouter();
  const results = introState.calculateRaglan();

  const handleStartKnitting = () => {
    router.push('/raglan');
  };

  if (typeof results === 'string') {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{results}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>{i18n.t('goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{i18n.t('calculationResults')}</Text>

      <View style={styles.resultCard}>
        <Text style={styles.subtitle}>{i18n.t('mainMeasurements')}</Text>
        <Text style={styles.resultText}>
          {i18n.t('totalStitches')}: {results.SO}
        </Text>
        <Text style={styles.resultText}>
          {i18n.t('frontStitches')}: {results.SFrontO}
        </Text>
        <Text style={styles.resultText}>
          {i18n.t('frontStitchesAtChest')}: {results.SFrontOGr}
        </Text>
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.subtitle}>{i18n.t('increases')}</Text>
        <Text style={styles.resultText}>
          {i18n.t('rowsToKnit')}: {results.NHFront}
        </Text>
        {results.prib_1x2_f > 0 && (
          <Text style={styles.resultText}>1x2: {results.prib_1x2_f}</Text>
        )}
        {results.prib_1x4_f > 0 && (
          <Text style={styles.resultText}>1x4: {results.prib_1x4_f}</Text>
        )}
        {results.prib_1x1_f > 0 && (
          <Text style={styles.resultText}>1x1: {results.prib_1x1_f}</Text>
        )}
        {results.prib_1x3_f > 0 && (
          <Text style={styles.resultText}>1x3: {results.prib_1x3_f}</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>

        <TouchableOpacity
          style={styles.newStyleButton}
          onPress={() => router.push('/intro')}
        >
          <Text style={styles.newStyleButtonText}>{i18n.t('newStyle')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartKnitting}
        >
          <Text style={styles.startButtonText}>{i18n.t('startKnitting')}</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
    gap: 10,
  },
  startButton: {
    flex: 1,
    backgroundColor: '#34C759',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  newStyleButton: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'grey'
  },
  newStyleButtonText: {
    color: 'grey',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 
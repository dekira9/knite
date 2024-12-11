import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import onboardingState from '@/state/onboardingState';

const MeasurementScreen = observer(() => {
  const router = useRouter();
  const isRussian = onboardingState.language === 'ru';

  const selectSystem = (system: string) => {
    onboardingState.setMeasurementSystem(system);
    router.push('/onboarding/subscription');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isRussian ? 'Выберите систему измерения' : 'Choose Measurement System'}
      </Text>
      
      <TouchableOpacity
        style={styles.systemButton}
        onPress={() => selectSystem('metric')}
      >
        <Text style={styles.buttonTitle}>
          {isRussian ? 'Метрическая' : 'Metric'}
        </Text>
        <Text style={styles.buttonSubtitle}>
          {isRussian ? 'сантиметры (см)' : 'centimeters (cm)'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.systemButton}
        onPress={() => selectSystem('imperial')}
      >
        <Text style={styles.buttonTitle}>
          {isRussian ? 'Имперская' : 'Imperial'}
        </Text>
        <Text style={styles.buttonSubtitle}>
          {isRussian ? 'дюймы (in)' : 'inches (in)'}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  systemButton: {
    backgroundColor: '#f0f0f0',
    width: '80%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default MeasurementScreen; 
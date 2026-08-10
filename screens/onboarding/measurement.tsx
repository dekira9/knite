import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import onboardingState from '@/state/onboardingState';
import i18n from '@/utils/translations';

const MeasurementScreen = observer(() => {
  const navigation = useNavigation();

  const selectSystem = (system: string) => {
    onboardingState.setMeasurementSystem(system);
    onboardingState.completeOnboarding();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('chooseMeasurementSystem')}</Text>

      <TouchableOpacity
        style={styles.systemButton}
        onPress={() => selectSystem('metric')}
      >
        <Text style={styles.buttonTitle}>{i18n.t('metric')}</Text>
        <Text style={styles.buttonSubtitle}>{i18n.t('metricUnitsHint')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.systemButton}
        onPress={() => selectSystem('imperial')}
      >
        <Text style={styles.buttonTitle}>{i18n.t('imperial')}</Text>
        <Text style={styles.buttonSubtitle}>{i18n.t('imperialUnitsHint')}</Text>
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

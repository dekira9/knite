import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import onboardingState from '@/state/onboardingState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Settings = observer(() => {
  const router = useRouter();
  const isRussian = onboardingState.language === 'ru';
  const insets = useSafeAreaInsets();

  const toggleLanguage = () => {
    onboardingState.setLanguage(isRussian ? 'en' : 'ru');
  };

  const toggleMeasurementSystem = () => {
    const currentSystem = onboardingState.measurementSystem;
    onboardingState.setMeasurementSystem(currentSystem === 'metric' ? 'imperial' : 'metric');
  };

  const handleDeveloperPress = () => {
    Alert.alert(
      isRussian ? 'Режим разработчика' : 'Developer Mode',
      isRussian ? 'Перейти к экрану онбординга?' : 'Go to onboarding screen?',
      [
        {
          text: isRussian ? 'Отмена' : 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            onboardingState.setOnboardingComplete(false);
            router.replace('/onboarding/welcome');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>{isRussian ? 'Настройки' : 'Settings'}</Text>

      <TouchableOpacity style={styles.settingButton} onPress={toggleLanguage}>
        <Text style={styles.settingTitle}>
          {isRussian ? 'Язык' : 'Language'}
        </Text>
        <Text style={styles.settingValue}>
          {isRussian ? 'Русский' : 'English'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingButton} onPress={toggleMeasurementSystem}>
        <Text style={styles.settingTitle}>
          {isRussian ? 'Система измерения' : 'Measurement System'}
        </Text>
        <Text style={styles.settingValue}>
          {onboardingState.measurementSystem === 'metric' 
            ? (isRussian ? 'Метрическая' : 'Metric')
            : (isRussian ? 'Имперская' : 'Imperial')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.settingButton, styles.developerButton]} 
        onPress={handleDeveloperPress}
      >
        <Text style={styles.settingTitle}>
          {isRussian ? 'Режим разработчика' : 'Developer Mode'}
        </Text>
        <Text style={styles.settingValue}>
          {isRussian ? 'Открыть онбординг' : 'Open Onboarding'}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  settingButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
  },
  developerButton: {
    marginTop: 30,
    backgroundColor: '#f0f0f0',
  },
});

export default Settings;

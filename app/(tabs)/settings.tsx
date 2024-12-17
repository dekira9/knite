import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import onboardingState from '@/state/onboardingState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import i18n from '@/utils/translations';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' },
];

const Settings = observer(() => {
  const router = useRouter();
  const currentLanguage = onboardingState.language;
  const insets = useSafeAreaInsets();

  const currentLanguageInfo = languages.find(lang => lang.code === currentLanguage);

  const handleLanguagePress = () => {
    router.push('/onboarding/language?from=settings');
  };

  const toggleMeasurementSystem = () => {
    const currentSystem = onboardingState.measurementSystem;
    onboardingState.setMeasurementSystem(currentSystem === 'metric' ? 'imperial' : 'metric');
  };

  const handleDeveloperPress = () => {
    Alert.alert(
      i18n.t('developerMode'),
      i18n.t('goToOnboarding'),
      [
        {
          text: i18n.t('cancel'),
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
      <Text style={styles.title}>{i18n.t('settings')}</Text>

      <TouchableOpacity style={styles.settingButton} onPress={handleLanguagePress}>
        <Text style={styles.settingTitle}>
          {i18n.t('language')}
        </Text>
        <Text style={styles.settingValue}>
          {currentLanguageInfo?.nativeName}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingButton} onPress={toggleMeasurementSystem}>
        <Text style={styles.settingTitle}>
          {i18n.t('measurementSystem')}
        </Text>
        <Text style={styles.settingValue}>
          {onboardingState.measurementSystem === 'metric' 
            ? i18n.t('metric') + ' (cm)'
            : i18n.t('imperial') + ' (in)'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.settingButton, styles.developerButton]} 
        onPress={handleDeveloperPress}
      >
        <Text style={styles.settingTitle}>
          Developer Mode
        </Text>
        <Text style={styles.settingValue}>
          Open Onboarding
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

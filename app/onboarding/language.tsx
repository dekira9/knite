import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import * as Localization from 'expo-localization';
import onboardingState from '@/state/onboardingState';

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

const LanguageScreen = observer(() => {
  const router = useRouter();

  const selectLanguage = (langCode: string) => {
    onboardingState.setLanguage(langCode);
    router.push('/onboarding/measurement');
  };

  const deviceLanguage = Localization.getLocales()[0].languageCode;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Choose Your Language</Text>
        
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={styles.languageButton}
            onPress={() => selectLanguage(lang.code)}
          >
            <Text style={styles.languageName}>{lang.nativeName}</Text>
            {lang.name !== lang.nativeName && (
              <Text style={styles.languageNameTranslation}>{lang.name}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  languageButton: {
    backgroundColor: '#f0f0f0',
    width: '80%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
  },
  languageNameTranslation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default LanguageScreen; 
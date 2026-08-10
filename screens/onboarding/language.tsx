import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import onboardingState from '@/state/onboardingState';
import i18n, { updateLocale } from '@/utils/translations';
import { Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { SUPPORTED_LANGUAGES } from '@/utils/i18n/supportedLanguages';

const windowWidth = Dimensions.get('window').width;

const LanguageScreen = observer(() => {
  const navigation = useNavigation();
  const route = useRoute();
  const from = (route.params as { from?: string } | undefined)?.from;
  const currentLanguage = onboardingState.language;

  const selectLanguage = (langCode: string) => {
    onboardingState.setLanguage(langCode);
    updateLocale(langCode);

    if (from === 'settings') {
      navigation.goBack();
    } else {
      (navigation as any).navigate('Measurement');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={{ backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <Text style={styles.title}>{i18n.t('onboardingLanguage')}</Text>

        {SUPPORTED_LANGUAGES.map((lang) => {
          const selected = currentLanguage === lang.code;
          return (
            <TouchableOpacity
              key={lang.code}
              style={[styles.languageButton, selected && styles.languageButtonSelected]}
              onPress={() => selectLanguage(lang.code)}
            >
              <Text style={[styles.languageName, selected && styles.languageNameSelected]}>
                {lang.nativeName}
              </Text>
              <Text style={styles.languageNameTranslation}>{lang.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    marginBottom: 15,
  },
  languageButton: {
    backgroundColor: '#f0f0f0',
    width: windowWidth * 0.7,
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageButtonSelected: {
    borderColor: Colors.light.tint,
    backgroundColor: '#e8f4f8',
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
  },
  languageNameSelected: {
    color: Colors.light.tint,
  },
  languageNameTranslation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default LanguageScreen;

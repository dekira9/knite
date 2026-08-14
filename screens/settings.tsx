import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { Ionicons } from '@expo/vector-icons';
import onboardingState from '@/state/onboardingState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import i18n from '@/utils/translations';
import { resetAllState } from '@/state/reset';
import { CommonActions } from '@react-navigation/native';
import { findLanguage } from '@/utils/i18n/supportedLanguages';
import { Colors } from '@/constants/Colors';

const Settings = observer(() => {
  const navigation = useNavigation();
  const currentLanguage = onboardingState.language;
  const insets = useSafeAreaInsets();

  const currentLanguageInfo = findLanguage(currentLanguage);

  const handleClose = () => {
    navigation.navigate('Styles' as never);
  };

  const handleLanguagePress = () => {
    const rootNavigation = navigation.getParent()?.getParent() || navigation.getParent() || navigation;
    rootNavigation.dispatch(
      CommonActions.navigate({
        name: 'Onboarding',
        params: {
          screen: 'Language',
          params: {
            from: 'settings',
          },
        },
      })
    );
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
            const rootNavigation = navigation.getParent()?.getParent() || navigation.getParent() || navigation;
            rootNavigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Onboarding' }],
              })
            );
          },
        },
      ]
    );
  };

  const handleResetStore = () => {
    Alert.alert(
      'Reset store',
      'This will clear all local state and simulate a fresh user. Continue?',
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await resetAllState();
              const rootNavigation = navigation.getParent()?.getParent() || navigation.getParent() || navigation;
              rootNavigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Onboarding' }],
                })
              );
            } catch (e) {
              Alert.alert('Error', 'Failed to reset the app state.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{i18n.t('settings')}</Text>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeButton}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={i18n.t('cancel')}
        >
          <Ionicons name="close" size={28} color={Colors.light.tint} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.settingButton} onPress={handleLanguagePress}>
        <Text style={styles.settingTitle}>
          {i18n.t('language')}
        </Text>
        <Text style={styles.settingValue}>
          {currentLanguageInfo?.nativeName ?? currentLanguage}
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

      {__DEV__ && (
        <>
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

          <TouchableOpacity 
            style={[styles.settingButton, styles.developerButton]} 
            onPress={handleResetStore}
          >
            <Text style={styles.settingTitle}>
              Reset store (dev)
            </Text>
            <Text style={styles.settingValue}>
              Clear local state and restart onboarding
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 30,
    minHeight: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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

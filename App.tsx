import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import onboardingState from './state/onboardingState';
import introState from './state/introState';
import OnboardingNavigator from './navigation/OnboardingNavigator';
import MainNavigator from './navigation/MainNavigator';
import { updateLocale } from './utils/translations';
import { isSupportedLanguage } from './utils/i18n/supportedLanguages';
import { initAnalytics, setAnalyticsUserProperties, track } from './utils/analytics';
import { maybePromptSoftUpdate } from './utils/appUpdateCheck';

const Stack = createStackNavigator();

const App = observer(() => {
  const [isLoading, setIsLoading] = useState(true);
  // Keep tree subscribed so locale changes refresh after persistence load.
  void onboardingState.language;

  useEffect(() => {
    const loadState = async () => {
      await Promise.all([
        onboardingState.loadPersistedState(),
        introState.loadPersistedState()
      ]);
      const lang = isSupportedLanguage(onboardingState.language)
        ? onboardingState.language
        : 'en';
      if (lang !== onboardingState.language) {
        onboardingState.setLanguage(lang);
      }
      updateLocale(lang);
      initAnalytics();
      setAnalyticsUserProperties({
        language: lang,
        measurement_system: onboardingState.measurementSystem,
        onboarding_completed: onboardingState.hasCompletedOnboarding,
      });
      track('app_opened', {
        onboarding_completed: onboardingState.hasCompletedOnboarding,
      });
      setIsLoading(false);
    };
    loadState();
  }, []);

  useEffect(() => {
    if (isLoading || !onboardingState.hasCompletedOnboarding) {
      return;
    }
    const timeoutId = setTimeout(() => {
      void maybePromptSoftUpdate();
    }, 1200);
    return () => clearTimeout(timeoutId);
  }, [isLoading, onboardingState.hasCompletedOnboarding]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={onboardingState.hasCompletedOnboarding ? 'Main' : 'Onboarding'}
          >
            <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
            <Stack.Screen name="Main" component={MainNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;

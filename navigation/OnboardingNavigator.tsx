import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { observer } from 'mobx-react-lite';
import OnboardingProgress from '@/components/OnboardingProgress';
import LanguageScreen from '@/screens/onboarding/language';
import MeasurementScreen from '@/screens/onboarding/measurement';
import i18n from '@/utils/translations';
// Subscription screen kept in screens/onboarding/subscription.tsx — re-add Stack.Screen when IAP is ready.

const Stack = createStackNavigator();

export default observer(function OnboardingNavigator() {
  void i18n.t('onboardingLanguage');

  return (
    <View style={{ flex: 1 }}>
      <OnboardingProgress />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          cardStyle: {
            backgroundColor: '#fff',
          },
        }}
      >
        <Stack.Screen
          name="Language"
          component={LanguageScreen}
          options={{
            title: i18n.t('onboardingLanguage'),
          }}
        />
        <Stack.Screen
          name="Measurement"
          component={MeasurementScreen}
          options={{
            title: i18n.t('measurementSystem'),
          }}
        />
      </Stack.Navigator>
    </View>
  );
});

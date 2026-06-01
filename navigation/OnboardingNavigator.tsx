import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import OnboardingProgress from '@/components/OnboardingProgress';
import WelcomeScreen from '@/screens/onboarding/welcome';
import LanguageScreen from '@/screens/onboarding/language';
import MeasurementScreen from '@/screens/onboarding/measurement';
// Subscription screen kept in screens/onboarding/subscription.tsx — re-add Stack.Screen when IAP is ready.

const Stack = createStackNavigator();

export default function OnboardingNavigator() {
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
        {/* <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            title: 'Welcome',
          }}
        /> */}
        <Stack.Screen
          name="Language"
          component={LanguageScreen}
          options={{
            title: 'Language',
          }}
        />
        <Stack.Screen
          name="Measurement"
          component={MeasurementScreen}
          options={{
            title: 'Measurement',
          }}
        />
      </Stack.Navigator>
    </View>
  );
}


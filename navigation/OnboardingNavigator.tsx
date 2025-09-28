import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import OnboardingProgress from '../app/components/OnboardingProgress';
import WelcomeScreen from '../app/onboarding/welcome';
import LanguageScreen from '../app/onboarding/language';
import MeasurementScreen from '../app/onboarding/measurement';
import SubscriptionScreen from '../app/onboarding/subscription';

const Stack = createStackNavigator();

export default function OnboardingNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <OnboardingProgress />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          contentStyle: {
            backgroundColor: '#fff',
          },
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            title: 'Welcome',
          }}
        />
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
        <Stack.Screen
          name="Subscription"
          component={SubscriptionScreen}
          options={{
            title: 'Subscription',
          }}
        />
      </Stack.Navigator>
    </View>
  );
}


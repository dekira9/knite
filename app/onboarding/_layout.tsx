import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import OnboardingProgress from '@/app/components/OnboardingProgress';

export default function OnboardingLayout() {
  return (
    <View style={{ flex: 1 }}>
      <OnboardingProgress />
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          contentStyle: {
            backgroundColor: '#fff',
          },
        }}
      >
        <Stack.Screen
          name="welcome"
          options={{
            title: 'Welcome',
          }}
        />
        <Stack.Screen
          name="language"
          options={{
            title: 'Language',
          }}
        />
        <Stack.Screen
          name="measurement"
          options={{
            title: 'Measurement',
          }}
        />
        <Stack.Screen
          name="subscription"
          options={{
            title: 'Subscription',
          }}
        />
      </Stack>
    </View>
  );
} 
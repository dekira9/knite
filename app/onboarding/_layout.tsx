import { Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        gestureEnabled: false,
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
  );
} 
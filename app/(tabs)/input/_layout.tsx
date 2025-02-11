import IntroProgress from '@/app/components/IntroProgress';
import onboardingState from '@/state/onboardingState';
import { Stack, usePathname } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function IntroLayout() {
  const pathname = usePathname();
  const shouldShowProgress = !['/input', '/input/result'].includes(pathname);

  return (
    <View style={{ flex: 1 }}>
      {shouldShowProgress && <IntroProgress />}
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
        }}>
        <Stack.Screen
          name="index"
          options={{
            title: 'Choose Style',
          }}
        />
        <Stack.Screen
          name="head"
          options={{
            title: 'Head Circumference',
          }}
        />
        <Stack.Screen
          name="neck"
          options={{
            title: 'Neck Circumference',
          }}
        />
        <Stack.Screen
          name="chest"
          options={{
            title: 'Chest Circumference',
          }}
        />
        <Stack.Screen
          name="stitch-density"
          options={{
            title: 'Stitch Density',
          }}
        />
        <Stack.Screen
          name="row-density"
          options={{
            title: 'Row Density',
          }}
        />
        <Stack.Screen
          name="ribbing-width"
          options={{
            title: 'Ribbing Width',
          }}
        />
        <Stack.Screen
          name="fit"
          options={{
            title: 'Fit Type',
          }}
        />
        <Stack.Screen
          name="result"
          options={{
            title: 'Result',
          }}
        />
      </Stack>
    </View>
  );
} 
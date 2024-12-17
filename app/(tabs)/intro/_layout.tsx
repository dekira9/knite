import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import IntroProgress from '@/app/components/IntroProgress';

export default function IntroLayout() {
  return (
    <View style={{ flex: 1 }}>
      <IntroProgress />
      <Stack
        screenOptions={{
          headerShown: true,
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
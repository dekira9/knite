import { Stack } from 'expo-router';
import React from 'react';

export default function RaglanLayout() {
  return (
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
          title: 'Реглан',
        }}
      />
      <Stack.Screen
        name="front"
        options={{
          title: 'Перед',
        }}
      />
      <Stack.Screen
        name="back"
        options={{
          title: 'Спина',
        }}
      />
      <Stack.Screen
        name="sleeve"
        options={{
          title: 'Рукав',
        }}
      />
      <Stack.Screen
        name="ribbing"
        options={{
          title: 'Резинка',
        }}
      />
      <Stack.Screen
        name="raglan-line"
        options={{
          title: 'Линия реглана',
        }}
      />
    </Stack>
  );
} 
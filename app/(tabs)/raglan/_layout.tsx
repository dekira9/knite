import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RaglanLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarPosition: 'top',
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarIndicatorStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].tint,
          },
        }}>
        <Tabs.Screen
          name="ribbing"
          options={{
            title: 'Резинка',
          }}
        />
        <Tabs.Screen
          name="front"
          options={{
            title: 'Перед',
          }}
        />
        <Tabs.Screen
          name="sleeve"
          options={{
            title: 'Рукав',
          }}
        />
        <Tabs.Screen
          name="back"
          options={{
            title: 'Спина',
          }}
        />
        <Tabs.Screen
          name="raglan-line"
          options={{
            title: 'Линия реглана',
          }}
        />

      </Tabs>
    </View>
  );
} 
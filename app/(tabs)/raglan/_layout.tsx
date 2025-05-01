import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme, View, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RaglanLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarPosition: 'top',
            tabBarStyle: {
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              width: 'auto',
              
            },
            tabBarLabelStyle: {
              fontSize: 10,
              
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
            name="ribbing copyV"
            options={{
              title: 'RVРезинкаV',
            }}
          />
          <Tabs.Screen
            name="backV"
            options={{
              title: 'BVСпинаV',
            }}
          />
          <Tabs.Screen
            name="frontV"
            options={{
              title: 'FVПередV',
            }}
          />
          <Tabs.Screen
            name="back copy"
            options={{
              title: 'Bcпина2',
            }}
          />
          <Tabs.Screen
            name="front copy"
            options={{
              title: 'Fперед2',
            }}
          />
          <Tabs.Screen
            name="sleeve copy"
            options={{
              title: 'Sрукав2',
            }}
          />
          <Tabs.Screen
            name="ribbing copy"
            options={{
              title: 'RРезинка2',
            }}
          />
        </Tabs>
      
    </View>
  );
} 
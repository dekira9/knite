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
              fontSize: 7,
              
            },
            
          }}>
         {/* Закомментированные вкладки не будут отображаться */}
          
          {/* Явно скрываем маршруты, которые существуют как файлы, но не должны отображаться в навигации */}
          <Tabs.Screen
            name="ribbing"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="front"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="sleeve"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="back"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="frontV copy"
            options={{
              href: null,
            }}
          />
         
          <Tabs.Screen
            name="raglan-line"
            options={{
              href: null,
            }}
          />
          
          {/* Активные вкладки, которые должны отображаться */}
          <Tabs.Screen
            name="ribbingV"
            options={{
              title: 'RV',
            }}
          />
          <Tabs.Screen
            name="backV"
            options={{
              title: 'BV',
            }}
          />
          <Tabs.Screen
            name="frontV"
            options={{
              title: 'FV',
            }}
          />
           <Tabs.Screen
            name="sleeveV"
            options={{
              title: 'SV',
            }}
          />
          <Tabs.Screen
            name="ribbingO"
            options={{
              title: 'RO',
            }}
          />
          <Tabs.Screen
            name="backO"
            options={{
              title: 'BO',
            }}
          />
          <Tabs.Screen
            name="frontO"
            options={{
              title: 'FO',
            }}
          />
          <Tabs.Screen
            name="sleeveO"
            options={{
              title: 'SO',
            }}
          />
          
        </Tabs>
      
    </View>
  );
} 
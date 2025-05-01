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
            name="ribbing copyVV"
            options={{
              title: 'RVРезинкаV',
            }}
          />
          <Tabs.Screen
            name="back copy"
            options={{
              title: 'Спина2',
            }}
          />
          <Tabs.Screen
            name="front copy"
            options={{
              title: 'Перед2',
            }}
          />
          <Tabs.Screen
            name="sleeve copy"
            options={{
              title: 'Рукав2',
            }}
          />
          <Tabs.Screen
            name="ribbing copy"
            options={{
              title: 'Резинка2',
            }}
          />
        </Tabs>
      
    </View>
  );
} 
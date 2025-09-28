import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IntroProgress from '../app/components/IntroProgress';

// Import result screens
import ResultScreen from '../app/(tabs)/index/input/result/result';
import ResultVScreen from '../app/(tabs)/index/input/resultV/resultV';

const Stack = createStackNavigator();

export default function ResultNavigator() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#F8F9FA' }}>
      <Stack.Navigator>
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ResultV"
          component={ResultVScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </View>
  );
}

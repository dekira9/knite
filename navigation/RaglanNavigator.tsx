import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import i18n from '../utils/translations';

import RaglanIndexScreen from '@/screens/styles/raglan/index';
import RibbingScreen from '@/screens/styles/raglan/ribbing';
import BackScreen from '@/screens/styles/raglan/back';
import FrontScreen from '@/screens/styles/raglan/front';
import SleeveScreen from '@/screens/styles/raglan/sleeve';

const Stack = createStackNavigator();

export default function RaglanNavigator() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <View style={{ flex: 1, paddingTop: 0 }}>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerTitleStyle: {
            fontSize: 16,
            textAlign: 'center',
          },
          headerTintColor: Colors[theme].text,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginLeft: 10,
                width: 40,
                height: 40,
                justifyContent: 'center',
              }}
            >
              <Ionicons name="arrow-back" size={20} color={Colors[theme].tint} />
            </TouchableOpacity>
          ),
        })}
      >
        <Stack.Screen
          name="Index"
          component={RaglanIndexScreen}
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="Ribbing"
          component={RibbingScreen}
          options={{ title: i18n.t('collarKnittingChart'), presentation: 'card' }}
        />
        <Stack.Screen
          name="Back"
          component={BackScreen}
          options={{ title: i18n.t('backKnittingChart'), presentation: 'card' }}
        />
        <Stack.Screen
          name="Front"
          component={FrontScreen}
          options={{ title: i18n.t('frontKnittingChart'), presentation: 'card' }}
        />
        <Stack.Screen
          name="Sleeve"
          component={SleeveScreen}
          options={{ title: i18n.t('sleeveKnittingChart'), presentation: 'card' }}
        />
      </Stack.Navigator>
    </View>
  );
}

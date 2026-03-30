import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { HapticTab } from '../components/HapticTab';
import { IconSymbol } from '../components/ui/IconSymbol';
import TabBarBackground from '../components/ui/TabBarBackground';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import StylesNavigator from './StylesNavigator';
import SettingsScreen from '../app/(tabs)/settings';
import i18n from '@/utils/translations';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <Tab.Navigator
      initialRouteName="Styles"
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tab.Screen
        name="Styles"
        component={StylesNavigator}
        options={{
          title: i18n.t('styles'),
          tabBarIcon: ({ color }) => <FontAwesome6 name="shirt" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: i18n.t('settings'),
          tabBarIcon: ({ color }) => <FontAwesome6 name="gear" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}


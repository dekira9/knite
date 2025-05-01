import { Tabs, usePathname } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import introState from '@/state/introState';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    // Если мы в разделе raglan, не делаем ничего
    if (pathname.includes('/raglan/')) {
      return;
    }

    // Если мы на странице styles или в корне, ничего не делаем
    if (pathname === '/' || pathname === '/index') {
      return;
    }

    // Если мы возвращаемся на страницу styles, очищаем выбранный стиль
    if (pathname.includes('/input/') && pathname !== '/input/head') {
      router.back();
    } else {
      // Для других страниц возвращаемся на styles и очищаем выбранный стиль
      introState.setStyle(''); // Очищаем выбранный стиль
      router.replace('/');
    }
  };

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
        
      <Tabs.Screen
        name="index"
        options={{
          title: 'Styles',
          tabBarIcon: ({ color }) => <FontAwesome6 name="shirt" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="back"
        options={{
          title: 'Back',
          tabBarIcon: ({ color }) => <FontAwesome6 name="chevron-left" size={24} color={color} />,
          tabBarButton: (props) => (
            <HapticTab
              {...props}
              onPress={handleBack}
            />
          ),
          href: undefined,
        }}
      />
    
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="gearshape.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="input"
        options={{
          href: null,
          title: 'Input',
        }}
      />

      <Tabs.Screen
        name="raglan"
        options={{
          href: null,
          title: 'Raglan',
        }}
      />
    </Tabs>
  );
}

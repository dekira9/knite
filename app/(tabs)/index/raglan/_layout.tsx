import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { useColorScheme, View, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import i18n from '@/utils/translations';

export default function RaglanLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1, paddingTop: 0 }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            height: 40,
          },
          headerTitleStyle: {
            fontSize: 16,
            textAlign: 'center',
          },
          headerTitleAlign: 'center',
          headerLeftContainerStyle: {
            paddingBottom: 0,
          },
          headerTitleContainerStyle: {
            paddingBottom: 0,
            flex: 1,
            justifyContent: 'center',
          },
          headerStatusBarHeight: 0,
          headerTintColor: Colors[colorScheme ?? 'light'].text,
          presentation: 'card',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={handleBack} 
              style={{ 
                marginLeft: 10,
                width: 40,
                height: 40,
                justifyContent: 'center',
              }}
            >
              <Ionicons 
                name="arrow-back" 
                size={20}
                color={Colors[colorScheme ?? 'light'].tint} 
              />
            </TouchableOpacity>
          ),
        }}>
        {/* Основные экраны */}
        <Stack.Screen
          name="index"
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="ribbingO"
          options={{
            title: i18n.t('collarKnittingChart'),
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="backO"
          options={{
            title: i18n.t('backKnittingChart'),
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="frontO"
          options={{
            title:  i18n.t('frontKnittingChart'),
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="sleeveO"
          options={{
            title: i18n.t('sleeveKnittingChart'),
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="ribbingV"
          options={{
            title:  i18n.t('collarKnittingChart'),
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="backV"
          options={{
            title:  i18n.t('backKnittingChart'),
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="frontV"
          options={{
            title: i18n.t('frontKnittingChart'),
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="sleeveV"
          options={{
            title: i18n.t('sleeveKnittingChart'),
            presentation: 'card',
          }}
        />
        
        {/* Скрытые экраны */}
        <Stack.Screen
          name="ribbing"
          options={{
            presentation: 'none',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="front"
          options={{
            presentation: 'none',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sleeve"
          options={{
            presentation: 'none',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="back"
          options={{
            presentation: 'none',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="frontV copy"
          options={{
            presentation: 'none',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="raglan-line"
          options={{
            presentation: 'none',
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
} 
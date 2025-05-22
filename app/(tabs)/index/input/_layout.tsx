import IntroProgress from '@/app/components/IntroProgress';
import onboardingState from '@/state/onboardingState';
import { router, Stack, usePathname } from 'expo-router';
import React from 'react';
import { TouchableOpacity, useColorScheme, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function IntroLayout() {
  const pathname = usePathname();
  const shouldShowProgress = !['/input', '/input/result'].includes(pathname);
  const colorScheme = useColorScheme();

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
      {shouldShowProgress && <IntroProgress />}
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerTintColor: '#007AFF', // iOS blue color for back button
        }}>
        <Stack.Screen
          name="index"
          options={{
            title: 'Choose Style',
          }}
        />
        <Stack.Screen
          name="head"
          options={{
            title: 'Head Circumference',
            headerLeft: () => (
              <TouchableOpacity onPress={handleBack} style={{ marginLeft: 10 }}>
                <Ionicons 
                  name="arrow-back" 
                  size={24} 
                  color={Colors[colorScheme ?? 'light'].text} 
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="neck"
          options={{
            title: 'Neck Circumference',
          }}
        />
        <Stack.Screen
          name="chest"
          options={{
            title: 'Chest Circumference',
          }}
        />
        <Stack.Screen
          name="stitch-density"
          options={{
            title: 'Stitch Density',
          }}
        />
        <Stack.Screen
          name="row-density"
          options={{
            title: 'Row Density',
          }}
        />
        <Stack.Screen
          name="ribbing-width"
          options={{
            title: 'Ribbing Width',
          }}
        />
        <Stack.Screen
          name="ribbing-widthV"
          options={{
            title: 'Ribbing Width',
          }}
        />  
        <Stack.Screen
          name="fit"
          options={{
            title: 'Fit Type',
          }}
        />
        <Stack.Screen
          name="result"
          options={{
            title: 'Result',
          }}
        />
        <Stack.Screen
          name="resultV"
          options={{
            title: 'Result',
          }}
        />
        <Stack.Screen
          name="depthneckV"
          options={{
            title: 'Depth Neck',
          }}
        />
        <Stack.Screen
          name="lineraglan-width"
          options={{
            title: 'Lineraglan Width',
          }}
        />
        <Stack.Screen
          name="lineraglanV"
          options={{
            title: 'Lineraglan Width',
          }}
        />
      </Stack>
    </View>
  );
} 
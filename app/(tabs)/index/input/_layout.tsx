import IntroProgress from '@/app/components/IntroProgress';
import onboardingState from '@/state/onboardingState';
import { router, Stack, usePathname } from 'expo-router';
import React from 'react';
import { TouchableOpacity, useColorScheme, View, Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import i18n from '@/utils/translations';

export default function IntroLayout() {
  const pathname = usePathname();
  const shouldShowProgress = !['/input', '/input/result'].includes(pathname);
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    router.back();
  };

  const CustomHeader = ({ navigation, route, options }: NativeStackHeaderProps) => {
    return (
      <View 
        style={{
          backgroundColor: '#f5f5f5',
          paddingTop:0,
          height: 40, // 56dp - стандартная высота Material Design
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        {navigation.canGoBack() && (
          <TouchableOpacity 
            onPress={navigation.goBack}
            style={{
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#007AFF" />
          </TouchableOpacity>
        )}
        <Text
          style={{
            flex: 1,
            fontSize: 16,
            fontWeight: '600',
            textAlign: 'center',
            marginRight: navigation.canGoBack() ? 40 : 0, // Компенсируем ширину кнопки назад
          }}
        >
          {options.title || route.name}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {shouldShowProgress && (
        <View style={{ 
          paddingTop: 0,
          borderBottomWidth: 0,
          backgroundColor: '#ffffff'
        }}>
          <IntroProgress />
        </View>
      )}
      <Stack
        screenOptions={{
          header: (props) => <CustomHeader {...props} />,
          headerShown: true,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Choose Style',
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="head"
          options={{
            title: i18n.t('headCircumference'),
            headerLeft: () => (
              <TouchableOpacity 
                onPress={handleBack} 
                style={{ 
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                  marginLeft: -4,
                }}
              >
                <Ionicons 
                  name="arrow-back" 
                  size={22}
                  color={Colors[colorScheme ?? 'light'].tint} 
                />
                {Platform.OS === 'ios' && (
                  <Text style={{ 
                    marginLeft: 2,
                    fontSize: 16,
                    color: Colors[colorScheme ?? 'light'].tint,
                  }}>
                    Back
                  </Text>
                )}
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="neck"
          options={{
            title: i18n.t('neckCircumference'),
          }}
        />
        <Stack.Screen
          name="chest"
          options={{
            title: i18n.t('chestCircumference'),
          }}
        />
        <Stack.Screen
          name="stitch-density"
          options={{
            title: i18n.t('stitchDensity'),
          }}
        />
        <Stack.Screen
          name="row-density"
          options={{
            title: i18n.t('rowDensity'),
          }}
        />
        <Stack.Screen
          name="ribbing-width"
          options={{
            title: i18n.t('collarWidth'),
          }}
        />
        <Stack.Screen
          name="ribbing-widthV"
          options={{
            title: i18n.t('collarWidth'),
          }}
        />  
        <Stack.Screen
          name="fit"
          options={{
            title: i18n.t('fitType'),
          }}
        />
        <Stack.Screen
          name="result"
          options={{
            title: i18n.t('Result'),
          }}
        />
        <Stack.Screen
          name="resultV"
          options={{
            title: i18n.t('Result'),
          }}
        />
        <Stack.Screen
          name="depthneckV"
          options={{
            title: i18n.t('depthNeck'),
          }}
        />
        <Stack.Screen
          name="lineraglan-width"
          options={{
            title: i18n.t('RaglanLineWidth'),
          }}
        />
        <Stack.Screen
          name="lineraglanV"
          options={{
            title: i18n.t('RaglanLineWidth'),
          }}
        />
      </Stack>
    </View>
  );
} 
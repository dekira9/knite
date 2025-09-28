import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import i18n from '../utils/translations';

// Import all raglan screens
import RaglanIndexScreen from '../app/(tabs)/index/raglan/index';
import RibbingOScreen from '../app/(tabs)/index/raglan/ribbingO';
import BackOScreen from '../app/(tabs)/index/raglan/backO';
import FrontOScreen from '../app/(tabs)/index/raglan/frontO';
import SleeveOScreen from '../app/(tabs)/index/raglan/sleeveO';
import RibbingVScreen from '../app/(tabs)/index/raglan/ribbingV';
import BackVScreen from '../app/(tabs)/index/raglan/backV';
import FrontVScreen from '../app/(tabs)/index/raglan/frontV';
import SleeveVScreen from '../app/(tabs)/index/raglan/sleeveV';
import RibbingScreen from '../app/(tabs)/index/raglan/ribbing';
import FrontScreen from '../app/(tabs)/index/raglan/front';
import SleeveScreen from '../app/(tabs)/index/raglan/sleeve';
import BackScreen from '../app/(tabs)/index/raglan/back';
import FrontVCopyScreen from '../app/(tabs)/index/raglan/frontV copy';
import RaglanLineScreen from '../app/(tabs)/index/raglan/raglan-line';

const Stack = createStackNavigator();

export default function RaglanNavigator() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1, paddingTop: 0 }}>
      <Stack.Navigator
        screenOptions={{
          // headerStyle: {
          //   backgroundColor: Colors[colorScheme ?? 'light'].background,
          //   height: 40,
          // },
          headerTitleStyle: {
            fontSize: 16,
            textAlign: 'center',
          },
          // headerTitleAlign: 'center',
          // headerLeftContainerStyle: {
          //   paddingBottom: 0,
          // },
          // headerTitleContainerStyle: {
          //   paddingBottom: 0,
          //   flex: 1,
          //   justifyContent: 'center',
          // },
          // headerStatusBarHeight: 0,
          headerTintColor: Colors[colorScheme ?? 'light'].text,
          // presentation: 'card',
          // headerLeft: ({ navigation }) => (
          //   <TouchableOpacity 
          //     onPress={() => navigation.goBack()} 
          //     style={{ 
          //       marginLeft: 10,
          //       width: 40,
          //       height: 40,
          //       justifyContent: 'center',
          //     }}
          //   >
          //     <Ionicons 
          //       name="arrow-back" 
          //       size={20}
          //       color={Colors[colorScheme ?? 'light'].tint} 
          //     />
          //   </TouchableOpacity>
          // ),
        }}
      >
        {/* Основные экраны */}
        <Stack.Screen
          name="Index"
          component={RaglanIndexScreen}
          options={{
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="RibbingO"
          component={RibbingOScreen}
          options={{
            title: i18n.t('knittingChartRibbing'),
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="BackO"
          component={BackOScreen}
          options={{
            title: i18n.t('knittingChartBack'),
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="FrontO"
          component={FrontOScreen}
          options={{
            title: i18n.t('knittingChartFront'),
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="SleeveO"
          component={SleeveOScreen}
          options={{
            title: i18n.t('knittingChartSleeve'),
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="RibbingV"
          component={RibbingVScreen}
          options={{
            title: i18n.t('knittingChartRibbing'),
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="BackV"
          component={BackVScreen}
          options={{
            title: i18n.t('knittingChartBack'),
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="FrontV"
          component={FrontVScreen}
          options={{
            title: i18n.t('knittingChartFront'),
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="SleeveV"
          component={SleeveVScreen}
          options={{
            title: i18n.t('knittingChartSleeve'),
            presentation: 'card',
          }}
        />
        
        {/* Скрытые экраны */}
        <Stack.Screen
          name="Ribbing"
          component={RibbingScreen}
          options={{
            presentation: 'none',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Front"
          component={FrontScreen}
          options={{
            presentation: 'none',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Sleeve"
          component={SleeveScreen}
          options={{
            presentation: 'none',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Back"
          component={BackScreen}
          options={{
            presentation: 'none',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="FrontVCopy"
          component={FrontVCopyScreen}
          options={{
            presentation: 'none',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="RaglanLine"
          component={RaglanLineScreen}
          options={{
            presentation: 'none',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </View>
  );
}


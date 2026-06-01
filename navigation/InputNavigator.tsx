import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import IntroProgress from '@/components/IntroProgress';

// Import all input screens
import InputIndexScreen from '@/screens/styles/input/index';
import HeadScreen from '@/screens/styles/input/head';
import NeckScreen from '@/screens/styles/input/neck';
import ChestScreen from '@/screens/styles/input/chest';
import StitchDensityScreen from '@/screens/styles/input/stitch-density';
import RowDensityScreen from '@/screens/styles/input/row-density';
import RibbingWidthScreen from '@/screens/styles/input/ribbing-width';
import RibbingWidthVScreen from '@/screens/styles/input/ribbing-widthV';
import FitScreen from '@/screens/styles/input/fit';
import DepthNeckVScreen from '@/screens/styles/input/depthneckV';
import LineraglanWidthScreen from '@/screens/styles/input/lineraglan-width';
import LineraglanVScreen from '@/screens/styles/input/lineraglanV';
import i18n from '@/utils/translations';
// Result screens moved to ResultNavigator

const Stack = createStackNavigator();
const HEADER_BG = '#f5f5f5';

const CustomHeader = ({ navigation, route, options }: any) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <View 
      style={{
        backgroundColor: HEADER_BG,
        paddingTop: 0,
        height: 40,
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
          <Ionicons
            name="arrow-back"
            size={20}
            color={Colors[theme].tint}
          />
        </TouchableOpacity>
      )}
      <Text
        style={{
          flex: 1,
          fontSize: 16,
          fontWeight: '600',
          textAlign: 'center',
          marginRight: navigation.canGoBack() ? 40 : 0,
        }}
      >
        {options.title || route.name}
      </Text>
    </View>
  );
};

export default function InputNavigator() {
  const [activeRouteName, setActiveRouteName] = useState<string>('Index');

  return (
    <View style={{ flex: 1, backgroundColor: HEADER_BG }}>
      <View style={{ 
        paddingTop: 0,
        borderBottomWidth: 0,
        backgroundColor: HEADER_BG,
      }}>
        <IntroProgress currentRouteName={activeRouteName} />
      </View>
      <Stack.Navigator
        screenOptions={{
          header: (props) => <CustomHeader {...props} />,
          headerShown: true,
        }}
        screenListeners={{
          state: (e: any) => {
            const state = e.data?.state;
            const route = state?.routes?.[state.index];
            if (route?.name) {
              setActiveRouteName(route.name);
            }
          },
        }}
      >
        <Stack.Screen
          name="Index"
          component={InputIndexScreen}
          options={{
            title: i18n.t('chooseStyle'),
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="Head"
          component={HeadScreen}
          options={{
            title: i18n.t('headCircumference'),
          }}
        />
        <Stack.Screen
          name="Neck"
          component={NeckScreen}
          options={{
            title: i18n.t('neckCircumference'),
          }}
        />
        <Stack.Screen
          name="Chest"
          component={ChestScreen}
          options={{
            title: i18n.t('chestCircumference'),
          }}
        />
        <Stack.Screen
          name="StitchDensity"
          component={StitchDensityScreen}
          options={{
            title: i18n.t('stitchDensity'),
          }}
        />
        <Stack.Screen
          name="RowDensity"
          component={RowDensityScreen}
          options={{
            title: i18n.t('rowDensity'),
          }}
        />
        <Stack.Screen
          name="RibbingWidth"
          component={RibbingWidthScreen}
          options={{
            title: i18n.t('ribbingWidth'),
          }}
        />
        <Stack.Screen
          name="RibbingWidthV"
          component={RibbingWidthVScreen}
          options={{
            title: i18n.t('ribbingWidth'),
          }}
        />
        <Stack.Screen
          name="Fit"
          component={FitScreen}
          options={{
            title: i18n.t('fitType'),
          }}
        />
        <Stack.Screen
          name="DepthNeckV"
          component={DepthNeckVScreen}
          options={{
            title: i18n.t('depthNeck'),
          }}
        />
        <Stack.Screen
          name="LineraglanWidth"
          component={LineraglanWidthScreen}
          options={{
            title: i18n.t('RaglanLineWidth'),
          }}
        />
        <Stack.Screen
          name="LineraglanV"
          component={LineraglanVScreen}
          options={{
            title: i18n.t('RaglanLineWidth'),
          }}
        />
        {/* Result screens moved to ResultNavigator */}
      </Stack.Navigator>
    </View>
  );
}


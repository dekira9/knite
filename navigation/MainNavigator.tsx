import React, { useRef, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { observer } from 'mobx-react-lite';
import { HapticTab } from '../components/HapticTab';
import KnittingChartsPickerModal, {
  type KnittingChartScreen,
} from '../components/KnittingChartsPickerModal';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';
import StylesNavigator from './StylesNavigator';
import SettingsScreen from '@/screens/settings';
import introState from '@/state/introState';
import {
  useTabBarExtrasMode,
  type TabBarExtrasMode,
} from './editParametersTabVisibility';
import { useMyProjectsTabActive } from './myProjectsTabActive';
import i18n from '@/utils/translations';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

/** Shared display size so all custom tab icons align visually. */
function tabIconDim(size?: number) {
  return (size ?? 24) + 20;
}

const tabLabelTextStyle = {
  fontSize: 10,
  textAlign: 'center' as const,
  includeFontPadding: false,
};

function PlaceholderScreen() {
  return <View />;
}

function ModeTabButton({
  props,
  modes,
}: {
  props: BottomTabBarButtonProps;
  modes: TabBarExtrasMode[];
}) {
  const mode = useTabBarExtrasMode();
  if (!modes.includes(mode)) return null;
  return <HapticTab {...props} />;
}

function StylesTabIcon({ color, size }: { color: string; size?: number }) {
  const projectsActive = useMyProjectsTabActive();
  const extrasMode = useTabBarExtrasMode();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const forceInactive = projectsActive || extrasMode === 'charts';
  const iconColor = forceInactive ? Colors[theme].tabIconDefault : color;
  const dim = tabIconDim(size);
  return (
    <Image
      source={require('@/assets/images/icsweater.png')}
      style={{ width: dim, height: dim, tintColor: iconColor }}
      contentFit="contain"
      tintColor={iconColor}
    />
  );
}

function StylesTabLabel({ color }: { color: string }) {
  const projectsActive = useMyProjectsTabActive();
  const extrasMode = useTabBarExtrasMode();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const forceInactive = projectsActive || extrasMode === 'charts';
  const labelColor = forceInactive ? Colors[theme].tabIconDefault : color;
  return (
    <Text
      style={{
        color: labelColor,
        ...tabLabelTextStyle,
      }}
      numberOfLines={1}
    >
      {i18n.t('styles')}
    </Text>
  );
}

function ChartsTabIcon({ size }: { size?: number }) {
  const chartsActive = useTabBarExtrasMode() === 'charts';
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const color = chartsActive
    ? Colors[theme].tabIconSelected
    : Colors[theme].tabIconDefault;
  const dim = tabIconDim(size);
  // SVG is square; size by height so a wider box still scales the icon up.
  const width = Math.round(dim * 1.0);
  const height = Math.round(dim * 0.9);
  return (
    <Image
      source={require('@/assets/images/iccharts.svg')}
      style={{ width, height, tintColor: color }}
      contentFit="contain"
      tintColor={color}
    />
  );
}

function ChartsTabLabel() {
  const chartsActive = useTabBarExtrasMode() === 'charts';
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const color = chartsActive
    ? Colors[theme].tabIconSelected
    : Colors[theme].tabIconDefault;
  return (
    <Text
      style={{
        color,
        ...tabLabelTextStyle,
      }}
      numberOfLines={1}
    >
      {i18n.t('tabCharts')}
    </Text>
  );
}

function MyProjectsTabIcon({ size }: { size?: number }) {
  const projectsActive = useMyProjectsTabActive();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const color = projectsActive
    ? Colors[theme].tabIconSelected
    : Colors[theme].tabIconDefault;
  const dim = tabIconDim(size);
  return (
    <Image
      source={require('@/assets/images/icknit-tab.png')}
      style={{ width: dim, height: dim, tintColor: color }}
      contentFit="contain"
      tintColor={color}
    />
  );
}

function MyProjectsTabLabel() {
  const projectsActive = useMyProjectsTabActive();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const color = projectsActive
    ? Colors[theme].tabIconSelected
    : Colors[theme].tabIconDefault;
  return (
    <Text
      style={{
        color,
        ...tabLabelTextStyle,
      }}
      numberOfLines={1}
    >
      {i18n.t('tabProjects')}
    </Text>
  );
}

function RegionTabIcon({ color, size }: { color: string; size?: number }) {
  const dim = tabIconDim(size);
  return (
    <Image
      source={require('@/assets/images/icregion.png')}
      style={{ width: dim, height: dim, tintColor: color }}
      contentFit="contain"
      tintColor={color}
    />
  );
}

function ParametersTabIcon({ color, size }: { color: string; size?: number }) {
  const dim = tabIconDim(size);
  return (
    <Image
      source={require('@/assets/images/param.png')}
      style={{ width: dim, height: dim, tintColor: color }}
      contentFit="contain"
      tintColor={color}
    />
  );
}

export default observer(function MainNavigator() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const insets = useSafeAreaInsets();
  const [chartsPickerVisible, setChartsPickerVisible] = useState(false);
  const tabNavigationRef = useRef<NavigationProp<ParamListBase> | null>(null);
  // Subscribe to locale so tab titles refresh after language change.
  void i18n.t('tabRegion');

  const openChart = (screen: KnittingChartScreen) => {
    setChartsPickerVisible(false);
    tabNavigationRef.current?.navigate('Styles', {
      screen: 'Raglan',
      params: { screen },
    });
  };

  const tabBarBottomPad = Math.max(insets.bottom, 8);

  return (
    <>
      <Tab.Navigator
        initialRouteName="Styles"
        screenOptions={{
          tabBarActiveTintColor: Colors[theme].tint,
          tabBarInactiveTintColor: Colors[theme].tabIconDefault,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarIconStyle: {
            marginTop: 4,
            marginBottom: 4,
          },
          tabBarLabelStyle: {
            ...tabLabelTextStyle,
          },
          tabBarStyle: {
            backgroundColor: Colors[theme].background,
            borderTopColor: '#E5E7EB',
            borderTopWidth: 1,
            height: 56 + tabBarBottomPad + 10,
            paddingTop: 6,
            paddingBottom: tabBarBottomPad,
          },
        }}
      >
        <Tab.Screen
          name="Styles"
          component={StylesNavigator}
          options={{
            title: i18n.t('styles'),
            tabBarIcon: ({ color, size }) => (
              <StylesTabIcon color={color} size={size} />
            ),
            tabBarLabel: ({ color }) => <StylesTabLabel color={color} />,
          }}
        />
        <Tab.Screen
          name="MyProjects"
          component={PlaceholderScreen}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              introState.setAwaitingStyleChoice(false);
              introState.setStyleChoiceMode(null);
              navigation.navigate('Styles', {
                state: {
                  routes: [{ name: 'StylesHome' }, { name: 'MyProjects' }],
                  index: 1,
                },
              });
            },
          })}
          options={{
            title: i18n.t('tabProjects'),
            tabBarIcon: ({ size }) => <MyProjectsTabIcon size={size} />,
            tabBarLabel: () => <MyProjectsTabLabel />,
          }}
        />
        <Tab.Screen
          name="EditParameters"
          component={PlaceholderScreen}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate('Styles', {
                screen: 'Input',
                params: {
                  screen: 'Head',
                  params: { returnTo: 'Result' },
                },
              });
            },
          })}
          options={{
            title: i18n.t('tabParameters'),
            tabBarLabel: ({ color }) => (
              <Text
                style={{
                  color,
                  ...tabLabelTextStyle,
                }}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.65}
              >
                {i18n.t('tabParameters')}
              </Text>
            ),
            tabBarIcon: ({ color, size }) => (
              <ParametersTabIcon color={color} size={size} />
            ),
            tabBarButton: (props) => (
              <ModeTabButton props={props} modes={['result']} />
            ),
          }}
        />
        <Tab.Screen
          name="KnittingCharts"
          component={PlaceholderScreen}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              tabNavigationRef.current = navigation;
              setChartsPickerVisible(true);
            },
          })}
          options={{
            title: i18n.t('tabCharts'),
            tabBarIcon: ({ size }) => <ChartsTabIcon size={size} />,
            tabBarLabel: () => <ChartsTabLabel />,
            tabBarButton: (props) => (
              <ModeTabButton props={props} modes={['result', 'charts']} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: i18n.t('tabRegion'),
            tabBarIcon: ({ color, size }) => (
              <RegionTabIcon color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>

      <KnittingChartsPickerModal
        visible={chartsPickerVisible}
        onClose={() => setChartsPickerVisible(false)}
        onSelect={openChart}
      />
    </>
  );
});

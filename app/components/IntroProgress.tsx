import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import introState from '@/state/introState';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const INTRO_STEPS_REGULAR = [
  'Head',
  'Neck',
  'Chest',
  'StitchDensity',
  'RowDensity',
  'Fit',
  'RibbingWidth',
  'LineraglanWidth',
];

const INTRO_STEPS_V_NECK = [
  'Head',
  'Neck',
  'Chest',
  'StitchDensity',
  'RowDensity',
  'Fit',
  'RibbingWidthV',
  'LineraglanV',
  'DepthNeckV',
];

function getActiveRouteName(route: any): string | null {
  if (!route) return null;
  if (!route.state || route.state.index == null) return route.name ?? null;
  return getActiveRouteName(route.state.routes[route.state.index]);
}

function IntroProgress() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const steps =
    introState.style === 'v-neck' ? INTRO_STEPS_V_NECK : INTRO_STEPS_REGULAR;

  const activeRouteName = useNavigationState((state) => {
    const activeRoute = state.routes[state.index];
    return getActiveRouteName(activeRoute);
  });

  const insets = useSafeAreaInsets();
  const currentStep = steps.indexOf(activeRouteName ?? '');
  const progress = currentStep >= 0 ? (currentStep + 1) / steps.length : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.track}>
        <View
          style={[
            styles.progress,
            {
              width: `${progress * 100}%`,
              backgroundColor: Colors[theme].tint,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  track: {
    width: '100%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 2,
  },
}); 

export default observer(IntroProgress);
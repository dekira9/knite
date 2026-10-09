import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ONBOARDING_STEP_ROUTES = ['Language', 'Measurement'];

export default function OnboardingProgress() {
  const insets = useSafeAreaInsets();
  const routeName = useNavigationState((state) => {
    const route = state?.routes[state?.index ?? 0];
    return route?.name ?? '';
  });
  const currentStep = ONBOARDING_STEP_ROUTES.indexOf(routeName);
  const progress =
    currentStep >= 0 ? (currentStep + 1) / ONBOARDING_STEP_ROUTES.length : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* <View style={styles.track}>
        <View style={[styles.progress, { width: `${progress * 100}%` }]} />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  track: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
});

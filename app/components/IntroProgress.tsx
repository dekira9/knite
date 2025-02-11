import React from 'react';
import { View, StyleSheet } from 'react-native';
import { usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const INTRO_STEPS = [
  '/input/head',
  '/input/neck',
  '/input/chest',
  '/input/stitch-density',
  '/input/row-density',
  '/input/ribbing-width',
  '/input/fit',
];

export default function IntroProgress() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const currentStep = INTRO_STEPS.indexOf(pathname);
  const progress = (currentStep + 1) / INTRO_STEPS.length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.track}>
        <View style={[styles.progress, { width: `${progress * 100}%` }]} />
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
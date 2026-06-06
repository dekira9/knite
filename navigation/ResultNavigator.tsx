import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ResultScreen from '@/screens/styles/input/result/result';

/** Single-screen layout wrapper (no nested stack — avoids Result > Result route clash). */
export default function ResultScreenLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#F8F9FA' }}>
      <ResultScreen />
    </View>
  );
}

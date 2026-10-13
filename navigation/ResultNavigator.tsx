import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ResultScreen from '@/screens/styles/input/result/result';
import { setTabBarExtrasMode, clearTabBarExtrasModeIf } from './editParametersTabVisibility';

/** Single-screen layout wrapper (no nested stack — avoids Result > Result route clash). */
export default function ResultScreenLayout() {
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      setTabBarExtrasMode('result');
      return () => clearTabBarExtrasModeIf('result');
    }, []),
  );

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#F8F9FA' }}>
      <ResultScreen />
    </View>
  );
}

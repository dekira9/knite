import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import introState from '@/state/introState';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import i18n from '@/utils/translations';

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

type IntroProgressProps = {
  currentRouteName?: string;
};

function IntroProgress({ currentRouteName }: IntroProgressProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const isDark = theme === 'dark';
  const steps =
    introState.style === 'v-neck' ? INTRO_STEPS_V_NECK : INTRO_STEPS_REGULAR;

  const insets = useSafeAreaInsets();
  const currentStep = steps.indexOf(currentRouteName ?? '');
  const stepNumber = currentStep + 1;
  const showStepLabel = currentStep >= 0;
  const progress = showStepLabel ? stepNumber / steps.length : 0;
  const progressValue = useSharedValue(progress);
  const trackBackgroundColor = isDark
    ? 'rgba(255,255,255,0.14)'
    : 'rgba(120,120,128,0.16)';
  const trackBorderColor = isDark
    ? 'rgba(255,255,255,0.2)'
    : 'rgba(255,255,255,0.6)';
  const labelColor = isDark ? 'rgba(255,255,255,0.55)' : '#888';

  useEffect(() => {
    progressValue.value = withTiming(progress, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, progressValue]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${Math.max(0, Math.min(1, progressValue.value)) * 100}%`,
  }));

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
      ]}
    >
      {showStepLabel && (
        <Text style={[styles.stepLabel, { color: labelColor }]}>
          {i18n.t('wizardStepOf', {
            current: stepNumber,
            total: steps.length,
          })}
        </Text>
      )}
      <View
        style={[
          styles.track,
          {
            backgroundColor: trackBackgroundColor,
            borderColor: trackBorderColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.progress,
            {
              backgroundColor: Colors[theme].tint,
            },
            animatedProgressStyle,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 6,
  },
  track: {
    width: '100%',
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
  },
  progress: {
    height: '100%',
    borderRadius: 999,
  },
});

export default observer(IntroProgress);

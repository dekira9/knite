import { useEffect, useState } from 'react';
import { Redirect, Stack } from 'expo-router';
import { observer } from 'mobx-react-lite';
import onboardingState from '@/state/onboardingState';
import { View, ActivityIndicator } from 'react-native';

export const unstable_settings = {
  initialRouteName: "onboarding",
};

const RootLayout = observer(() => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadState = async () => {
      await onboardingState.loadPersistedState();
      setIsLoading(false);
    };
    loadState();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!onboardingState.hasCompletedOnboarding && (
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack>
  );
});

export default RootLayout;

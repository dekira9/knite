import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react-lite';
import onboardingState from './state/onboardingState';
import introState from './state/introState';
import OnboardingNavigator from './navigation/OnboardingNavigator';
import MainNavigator from './navigation/MainNavigator';

const Stack = createStackNavigator();

const App = observer(() => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadState = async () => {
      await Promise.all([
        onboardingState.loadPersistedState(),
        introState.loadPersistedState()
      ]);
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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!onboardingState.hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
});

export default App;


import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StylesScreen from '@/screens/styles/styles';
import InputNavigator from './InputNavigator';
import ResultNavigator from './ResultNavigator';
import RaglanNavigator from './RaglanNavigator';

const Stack = createStackNavigator();

export default function StylesNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="StylesHome" component={StylesScreen} />
      <Stack.Screen name="Input" component={InputNavigator} />
      <Stack.Screen name="Result" component={ResultNavigator} />
      <Stack.Screen name="Raglan" component={RaglanNavigator} />
    </Stack.Navigator>
  );
}


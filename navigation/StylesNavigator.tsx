import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StylesScreen from '@/screens/styles/styles';
import MyProjectsScreen from '@/screens/styles/MyProjects';
import ChooseStyleScreen from '@/screens/styles/ChooseStyle';
import InputNavigator from './InputNavigator';
import ResultScreenLayout from './ResultNavigator';
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
      <Stack.Screen name="MyProjects" component={MyProjectsScreen} />
      <Stack.Screen name="ChooseStyle" component={ChooseStyleScreen} />
      <Stack.Screen name="Input" component={InputNavigator} />
      <Stack.Screen name="Result" component={ResultScreenLayout} />
      <Stack.Screen name="Raglan" component={RaglanNavigator} />
    </Stack.Navigator>
  );
}


import { Stack } from 'expo-router';

export default function StylesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="styles" />
      <Stack.Screen name="input" />
      <Stack.Screen name="raglan" />
    </Stack>
  );
} 
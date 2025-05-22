import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the head route which is the starting point
  return <Redirect href="/input/head" />;
} 
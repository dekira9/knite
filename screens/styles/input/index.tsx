import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function Index() {
  const navigation = useNavigation();
  
  useEffect(() => {
    // Redirect to the head route which is the starting point
    navigation.replace('Head');
  }, []);

  return null;
} 
import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Keyboard 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import onboardingState from '@/state/onboardingState';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface MeasurementInputProps {
  title: string;
  value: string;
  onValueChange: (value: string) => void;
  nextScreen: string;
  imageSource: any;
  isLast?: boolean;
  doNotShowCM?: boolean;
  onNext?: () => boolean;
}

export default observer(function MeasurementInput({
  title,
  value,
  onValueChange,
  nextScreen,
  imageSource,
  isLast = false,
  doNotShowCM=false,
  onNext,
}: MeasurementInputProps) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const measurementSystem = onboardingState.measurementSystem;
  const unit = measurementSystem === 'metric' ? 'cm' : 'in';
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Focus the input when component mounts
    const timeoutId = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleNext = () => {
    if (onNext) {
      const shouldProceed = onNext();
      if (!shouldProceed) return;
    }
    
    // Navigate to the next screen
    (navigation as any).navigate(nextScreen);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image 
          source={imageSource}
          style={styles.image}
          contentFit="contain"
        />
        
        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={onValueChange}
            keyboardType="numeric"
            placeholder=""
          />
          {!doNotShowCM && <Text style={styles.unit}>{unit}</Text>}
        </View>
        

        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: Colors[theme].tint },
          ]}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {isLast ? i18n.t('calculate') : i18n.t('next')}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  input: {
    width: 150,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 18,
    marginRight: 10,
  },
  unit: {
    fontSize: 18,
    color: '#666',
  },
  nextButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
}); 
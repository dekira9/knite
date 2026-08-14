/**
 * Not registered in OnboardingNavigator until StoreKit/IAP is implemented.
 * See navigation/OnboardingNavigator.tsx to wire it back in.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import onboardingState from '@/state/onboardingState';
import i18n from '@/utils/translations';

const PREMIUM_FEATURE_KEYS = [
  'premiumFeatureCalculations',
  'premiumFeaturePatterns',
  'premiumFeatureAdFree',
  'premiumFeatureSupport',
] as const;

const SubscriptionScreen = observer(() => {
  const navigation = useNavigation();

  const handleSubscribe = () => {
    onboardingState.setSubscription(true);
    onboardingState.completeOnboarding();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const handleSkip = () => {
    onboardingState.completeOnboarding();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{i18n.t('premiumAccess')}</Text>

      <View style={styles.featuresContainer}>
        {PREMIUM_FEATURE_KEYS.map((key) => (
          <Text key={key} style={styles.featureText}>
            ✓ {i18n.t(key)}
          </Text>
        ))}
      </View>

      <Text style={styles.priceText}>{i18n.t('premiumPrice')}</Text>

      <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
        <Text style={styles.subscribeButtonText}>{i18n.t('subscribe')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>{i18n.t('continueFree')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  featureText: {
    fontSize: 18,
    marginBottom: 15,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  subscribeButton: {
    backgroundColor: '#007AFF',
    width: '80%',
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  skipButton: {
    padding: 15,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default SubscriptionScreen;

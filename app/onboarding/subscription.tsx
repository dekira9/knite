import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import onboardingState from '@/state/onboardingState';

const SubscriptionScreen = observer(() => {
  const router = useRouter();
  const isRussian = onboardingState.language === 'ru';

  const handleSubscribe = () => {
    onboardingState.setSubscription(true);
    onboardingState.completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    onboardingState.completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {isRussian ? 'Премиум доступ' : 'Premium Access'}
      </Text>

      <View style={styles.featuresContainer}>
        {(isRussian ? [
          '✓ Расширенные расчеты',
          '✓ Сохранение схем',
          '✓ Без рекламы',
          '✓ Приоритетная поддержка',
        ] : [
          '✓ Advanced calculations',
          '✓ Pattern storage',
          '✓ Ad-free experience',
          '✓ Priority support',
        ]).map((feature, index) => (
          <Text key={index} style={styles.featureText}>{feature}</Text>
        ))}
      </View>

      <Text style={styles.priceText}>
        {isRussian ? '499₽/месяц' : '$4.99/month'}
      </Text>

      <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
        <Text style={styles.subscribeButtonText}>
          {isRussian ? 'Подписаться' : 'Subscribe'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>
          {isRussian ? 'Продолжить бесплатно' : 'Continue with Free Version'}
        </Text>
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
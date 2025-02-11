import { types } from "mobx-state-tree";
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingState = types
  .model({
    language: types.optional(types.string, 'en'),
    measurementSystem: types.optional(types.string, 'metric'),
    hasCompletedOnboarding: types.optional(types.boolean, false),
    hasSubscription: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    setLanguage(lang: string) {
      self.language = lang;
      this.persistState();
    },
    setMeasurementSystem(system: string) {
      self.measurementSystem = system;
      this.persistState();
    },
    completeOnboarding() {
      self.hasCompletedOnboarding = true;
      this.persistState();
    },
    setSubscription(hasSubscription: boolean) {
      self.hasSubscription = hasSubscription;
      this.persistState();
    },
    setOnboardingComplete(isComplete: boolean) {
      self.hasCompletedOnboarding = isComplete;
      this.persistState();
    },
    async persistState() {
      try {
        await AsyncStorage.setItem('onboardingState', JSON.stringify({
          language: self.language,
          measurementSystem: self.measurementSystem,
          hasCompletedOnboarding: self.hasCompletedOnboarding,
          hasSubscription: self.hasSubscription,
        }));
      } catch (error) {
        console.error('Failed to save onboarding state:', error);
      }
    },
    setPersistedState(state: {
      language: string;
      measurementSystem: string;
      hasCompletedOnboarding: boolean;
      hasSubscription: boolean;
    }) {
      self.language = state.language;
      self.measurementSystem = state.measurementSystem;
      self.hasCompletedOnboarding = state.hasCompletedOnboarding;
      self.hasSubscription = state.hasSubscription;
    },
    async loadPersistedState() {
      try {
        const state = await AsyncStorage.getItem('onboardingState');
        if (state) {
          const parsedState = JSON.parse(state);
          this.setPersistedState(parsedState);
        }
      } catch (error) {
        console.error('Failed to load onboarding state:', error);
      }
    }
  }));

const onboardingState = OnboardingState.create();
export default onboardingState; 
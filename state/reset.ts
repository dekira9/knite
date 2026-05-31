import { applySnapshot } from 'mobx-state-tree';
import AsyncStorage from '@react-native-async-storage/async-storage';

import onboardingState from '@/state/onboardingState';
import introState from '@/state/introState';

export async function resetAllState(): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.removeItem('onboardingState'),
      AsyncStorage.removeItem('introState'),
    ]);

    applySnapshot(onboardingState, {} as any);
    applySnapshot(introState, {} as any);
  } catch (err) {
    console.error('Failed to reset app state', err);
    throw err;
  }
}

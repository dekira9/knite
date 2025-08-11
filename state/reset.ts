import { applySnapshot } from 'mobx-state-tree';
import AsyncStorage from '@react-native-async-storage/async-storage';

import onboardingState from '@/state/onboardingState';
import introState from '@/state/introState';
import raglanVisualizationState from '@/state/raglanVisualizationState';
import raglanState from '@/state/raglanState';
import user from '@/state/user';

export async function resetAllState(): Promise<void> {
  try {
    // Clear persisted storage keys used by the app
    await Promise.all([
      AsyncStorage.removeItem('onboardingState'),
      AsyncStorage.removeItem('introState'),
      AsyncStorage.removeItem('raglanVisualizationState'),
      AsyncStorage.removeItem('user'),
    ]);

    // Reset in-memory MST stores to their default snapshots
    applySnapshot(onboardingState, {} as any);
    applySnapshot(introState, {} as any);
    applySnapshot(raglanVisualizationState, {} as any);
    applySnapshot(raglanState, {} as any);
    applySnapshot(user as any, {} as any);
  } catch (err) {
    console.error('Failed to reset app state', err);
    throw err;
  }
}



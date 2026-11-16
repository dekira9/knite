import { applySnapshot } from 'mobx-state-tree';
import AsyncStorage from '@react-native-async-storage/async-storage';

import onboardingState from '@/state/onboardingState';
import introState from '@/state/introState';
import rowCounterState from '@/state/rowCounterState';

export async function resetAllState(): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.removeItem('onboardingState'),
      AsyncStorage.removeItem('introState'),
      AsyncStorage.removeItem('introSavedProjects'),
      AsyncStorage.removeItem('rowCounters'),
    ]);

    applySnapshot(onboardingState, {} as any);
    applySnapshot(introState, {} as any);
    applySnapshot(rowCounterState, { counters: [] });
  } catch (err) {
    console.error('Failed to reset app state', err);
    throw err;
  }
}

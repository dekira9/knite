import { useSyncExternalStore } from 'react';

export type TabBarExtrasMode = 'none' | 'result' | 'charts';

let mode: TabBarExtrasMode = 'none';
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Tab extras: result plan vs knitting charts context. */
export function setTabBarExtrasMode(next: TabBarExtrasMode) {
  if (mode === next) return;
  mode = next;
  emit();
}

/**
 * Clear extras only if still on `expected` mode.
 * Avoids blur cleanup racing past a newly focused screen's mode.
 */
export function clearTabBarExtrasModeIf(expected: TabBarExtrasMode) {
  if (mode === expected) {
    setTabBarExtrasMode('none');
  }
}

/** Show/hide Result-plan tab extras (edit parameters + knitting charts). */
export function setResultPlanTabsVisible(next: boolean) {
  setTabBarExtrasMode(next ? 'result' : 'none');
}

/** @deprecated Use setResultPlanTabsVisible / setTabBarExtrasMode */
export const setEditParametersTabVisible = setResultPlanTabsVisible;

export function useTabBarExtrasMode() {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => listeners.delete(onStoreChange);
    },
    () => mode,
    () => mode,
  );
}

export function useResultPlanTabsVisible() {
  return useTabBarExtrasMode() === 'result';
}

/** @deprecated Use useResultPlanTabsVisible / useTabBarExtrasMode */
export const useEditParametersTabVisible = useResultPlanTabsVisible;

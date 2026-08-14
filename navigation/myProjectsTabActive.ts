import { useSyncExternalStore } from 'react';

let myProjectsTabActive = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** True while the My Projects screen (inside Styles stack) is focused. */
export function setMyProjectsTabActive(next: boolean) {
  if (myProjectsTabActive === next) return;
  myProjectsTabActive = next;
  emit();
}

export function useMyProjectsTabActive() {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => listeners.delete(onStoreChange);
    },
    () => myProjectsTabActive,
    () => myProjectsTabActive,
  );
}

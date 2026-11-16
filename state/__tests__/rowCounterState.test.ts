/// <reference types="jest" />

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import AsyncStorage from '@react-native-async-storage/async-storage';
import { applySnapshot } from 'mobx-state-tree';
import rowCounterState from '@/state/rowCounterState';
import golden from '@/utils/raglan/__tests__/goldenSample.json';
import { buildKnitPlanSource } from '@/utils/knitPlan';

describe('rowCounterState', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    applySnapshot(rowCounterState, { counters: [] });
  });

  it('add → increment ×3 → decrement → count 2', () => {
    const id = rowCounterState.addCounter('Test');
    rowCounterState.increment(id);
    rowCounterState.increment(id);
    rowCounterState.increment(id);
    rowCounterState.decrement(id);
    expect(rowCounterState.getCounter(id)?.count).toBe(2);
  });

  it('decrement at 0 stays 0', () => {
    const id = rowCounterState.addCounter('Zero');
    rowCounterState.decrement(id);
    expect(rowCounterState.getCounter(id)?.count).toBe(0);
  });

  it('setTarget rejects 0/negative/non-integer', () => {
    const id = rowCounterState.addCounter('Target test');
    rowCounterState.setTarget(id, 10);
    expect(rowCounterState.getCounter(id)?.target).toBe(10);

    rowCounterState.setTarget(id, 0);
    expect(rowCounterState.getCounter(id)?.target).toBe(10);

    rowCounterState.setTarget(id, -1);
    expect(rowCounterState.getCounter(id)?.target).toBe(10);

    rowCounterState.setTarget(id, 3.5);
    expect(rowCounterState.getCounter(id)?.target).toBe(10);

    rowCounterState.setTarget(id, null);
    expect(rowCounterState.getCounter(id)?.target).toBeNull();
  });

  it('persist → fresh load round-trip', async () => {
    const id = rowCounterState.addCounter('Saved', 5);
    rowCounterState.increment(id);
    rowCounterState.setNote(id, 'wool');
    await rowCounterState.persistState();

    applySnapshot(rowCounterState, { counters: [] });
    expect(rowCounterState.counters.length).toBe(0);

    await rowCounterState.loadPersistedState();
    const loaded = rowCounterState.getCounter(id);
    expect(loaded?.name).toBe('Saved');
    expect(loaded?.count).toBe(1);
    expect(loaded?.target).toBe(5);
    expect(loaded?.note).toBe('wool');
  });

  it('corrupt JSON loads as empty', async () => {
    rowCounterState.addCounter('Before corrupt');
    await AsyncStorage.setItem('rowCounters', '{not json');
    await rowCounterState.loadPersistedState();
    expect(rowCounterState.counters.length).toBe(0);
  });

  it('removeCounter', () => {
    const id = rowCounterState.addCounter('Remove me');
    rowCounterState.removeCounter(id);
    expect(rowCounterState.getCounter(id)).toBeUndefined();
    expect(rowCounterState.counters.length).toBe(0);
  });

  it('loads legacy JSON as simple counters', async () => {
    const legacy = {
      counters: [
        {
          id: 'legacy1',
          name: 'Old',
          count: 3,
          target: 10,
          note: '',
          createdAt: 1,
          updatedAt: 2,
        },
      ],
    };
    await AsyncStorage.setItem('rowCounters', JSON.stringify(legacy));
    await rowCounterState.loadPersistedState();
    const c = rowCounterState.getCounter('legacy1');
    expect(c?.kind).toBe('simple');
    expect(c?.count).toBe(3);
  });

  it('startPlanCounter dedupes by projectId', () => {
    const source = buildKnitPlanSource({
      introFinished: true,
      style: 'regular',
      ...golden,
    } as unknown as Parameters<typeof buildKnitPlanSource>[0]);
    expect(source).not.toBeNull();
    const id1 = rowCounterState.startPlanCounter({
      name: 'Plan',
      projectId: 'proj-a',
      source: source!,
    });
    const id2 = rowCounterState.startPlanCounter({
      name: 'Plan 2',
      projectId: 'proj-a',
      source: source!,
    });
    expect(id2).toBe(id1);
    expect(rowCounterState.counters.length).toBe(1);
  });

  it('plan increment clamps at phase end', () => {
    const source = buildKnitPlanSource({
      introFinished: true,
      style: 'regular',
      ...golden,
    } as unknown as Parameters<typeof buildKnitPlanSource>[0]);
    const id = rowCounterState.startPlanCounter({
      name: 'Clamp',
      projectId: null,
      source: source!,
    });
    const rows = golden.NRrez;
    for (let i = 0; i < rows + 3; i++) {
      rowCounterState.increment(id);
    }
    expect(rowCounterState.getCounter(id)?.count).toBe(rows);
  });

  it('nextPhase and prevPhase', () => {
    const source = buildKnitPlanSource({
      introFinished: true,
      style: 'regular',
      ...golden,
    } as unknown as Parameters<typeof buildKnitPlanSource>[0]);
    const id = rowCounterState.startPlanCounter({
      name: 'Phases',
      projectId: null,
      source: source!,
    });
    rowCounterState.increment(id);
    rowCounterState.nextPhase(id);
    expect(rowCounterState.getCounter(id)?.phaseIndex).toBe(1);
    expect(rowCounterState.getCounter(id)?.count).toBe(0);
    rowCounterState.prevPhase(id);
    expect(rowCounterState.getCounter(id)?.phaseIndex).toBe(0);
    expect(rowCounterState.getCounter(id)?.count).toBe(golden.NRrez);
  });
});

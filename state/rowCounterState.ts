import { types, getSnapshot } from 'mobx-state-tree';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  buildKnitPlan,
  getPhaseRowLimit,
  type KnitPlanPhaseId,
  type KnitPlanSource,
} from '@/utils/knitPlan';

const ROW_COUNTERS_KEY = 'rowCounters';

function newCounterId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

function isValidTarget(value: number | null): boolean {
  if (value === null) {
    return true;
  }
  return Number.isInteger(value) && value > 0;
}

const RowCounter = types.model('RowCounter', {
  id: types.identifier,
  name: types.string,
  count: types.optional(types.number, 0),
  target: types.maybeNull(types.number),
  note: types.optional(types.string, ''),
  createdAt: types.number,
  updatedAt: types.number,
  kind: types.optional(types.enumeration(['simple', 'plan']), 'simple'),
  planSource: types.optional(
    types.maybeNull(types.frozen<KnitPlanSource>()),
    null,
  ),
  projectId: types.optional(types.maybeNull(types.string), null),
  phaseIndex: types.optional(types.number, 0),
});

const RowCounterState = types
  .model({
    counters: types.array(RowCounter),
  })
  .views((self) => ({
    get sortedCounters() {
      return [...self.counters].sort((a, b) => b.updatedAt - a.updatedAt);
    },
    getCounter(id: string) {
      return self.counters.find((c) => c.id === id);
    },
    findPlanCounterByProject(projectId: string) {
      return self.counters.find(
        (c) => c.kind === 'plan' && c.projectId === projectId,
      );
    },
    progressFor(id: string) {
      const counter = self.counters.find((c) => c.id === id);
      if (!counter) {
        return null;
      }
      if (counter.kind !== 'plan' || counter.planSource == null) {
        return {
          kind: 'simple' as const,
          phaseId: null,
          phaseIndex: 0,
          phaseCount: 0,
          rowsDone: counter.count,
          totalRows: counter.target,
        };
      }
      const plan = buildKnitPlan(counter.planSource);
      const phase = plan.phases[counter.phaseIndex];
      return {
        kind: 'plan' as const,
        phaseId: phase?.id ?? null,
        phaseIndex: counter.phaseIndex,
        phaseCount: plan.phases.length,
        rowsDone: counter.count,
        totalRows: phase?.rows ?? null,
      };
    },
  }))
  .actions((self) => ({
    bumpUpdatedAt(counter: (typeof self.counters)[number]) {
      counter.updatedAt = Date.now();
    },
    phaseRowCap(counter: (typeof self.counters)[number]): number | null {
      if (counter.kind !== 'plan' || counter.planSource == null) {
        return null;
      }
      return getPhaseRowLimit(counter.planSource, counter.phaseIndex);
    },
    async persistState() {
      try {
        await AsyncStorage.setItem(
          ROW_COUNTERS_KEY,
          JSON.stringify({ counters: getSnapshot(self.counters) }),
        );
      } catch (error) {
        console.error('Failed to save row counter state:', error);
      }
    },
    setPersistedCounters(
      snapshots: Array<{
        id: string;
        name: string;
        count?: number;
        target?: number | null;
        note?: string;
        createdAt: number;
        updatedAt: number;
        kind?: 'simple' | 'plan';
        planSource?: KnitPlanSource | null;
        projectId?: string | null;
        phaseIndex?: number;
      }>,
    ) {
      const valid: typeof snapshots = [];
      for (const snap of snapshots) {
        try {
          RowCounter.create(snap);
          valid.push(snap);
        } catch {
          // drop entries that fail the model shape
        }
      }
      self.counters.replace(valid as Parameters<typeof self.counters.replace>[0]);
    },
    applyLoadedPersistence(raw: string | null) {
      if (!raw) {
        return;
      }
      try {
        const parsed = JSON.parse(raw) as { counters?: unknown };
        const list = Array.isArray(parsed?.counters) ? parsed.counters : [];
        this.setPersistedCounters(
          list as Parameters<typeof this.setPersistedCounters>[0],
        );
      } catch (error) {
        console.error('Failed to load row counter state:', error);
        self.counters.replace([]);
      }
    },
    async loadPersistedState() {
      try {
        const raw = await AsyncStorage.getItem(ROW_COUNTERS_KEY);
        this.applyLoadedPersistence(raw);
      } catch (error) {
        console.error('Failed to load row counter state:', error);
      }
    },
    addCounter(name: string, target?: number | null): string {
      const now = Date.now();
      const normalizedTarget =
        target !== undefined && isValidTarget(target) ? target : null;
      const id = newCounterId();
      self.counters.push({
        id,
        name,
        count: 0,
        target: normalizedTarget,
        note: '',
        createdAt: now,
        updatedAt: now,
      });
      void this.persistState();
      return id;
    },
    startPlanCounter(p: {
      name: string;
      projectId: string | null;
      source: KnitPlanSource;
    }): string {
      if (p.projectId != null) {
        const existing = self.findPlanCounterByProject(p.projectId);
        if (existing) {
          return existing.id;
        }
      }
      const now = Date.now();
      const id = newCounterId();
      self.counters.push({
        id,
        name: p.name,
        count: 0,
        target: null,
        note: '',
        createdAt: now,
        updatedAt: now,
        kind: 'plan',
        planSource: p.source,
        projectId: p.projectId,
        phaseIndex: 0,
      });
      void this.persistState();
      return id;
    },
    increment(id: string) {
      const counter = self.counters.find((c) => c.id === id);
      if (!counter) {
        return;
      }
      if (counter.kind === 'plan') {
        const cap = this.phaseRowCap(counter);
        if (cap === 0) {
          return;
        }
        if (cap != null && cap > 0 && counter.count >= cap) {
          return;
        }
      }
      counter.count += 1;
      this.bumpUpdatedAt(counter);
      void this.persistState();
    },
    decrement(id: string) {
      const counter = self.counters.find((c) => c.id === id);
      if (!counter) {
        return;
      }
      if (counter.count > 0) {
        counter.count -= 1;
      }
      this.bumpUpdatedAt(counter);
      void this.persistState();
    },
    resetCount(id: string) {
      const counter = self.counters.find((c) => c.id === id);
      if (!counter) {
        return;
      }
      counter.count = 0;
      this.bumpUpdatedAt(counter);
      void this.persistState();
    },
    nextPhase(id: string) {
      const counter = self.counters.find((c) => c.id === id);
      if (!counter || counter.kind !== 'plan' || counter.planSource == null) {
        return;
      }
      const plan = buildKnitPlan(counter.planSource);
      const nextIndex = Math.min(counter.phaseIndex + 1, plan.phases.length - 1);
      counter.phaseIndex = nextIndex;
      counter.count = 0;
      this.bumpUpdatedAt(counter);
      void this.persistState();
    },
    prevPhase(id: string) {
      const counter = self.counters.find((c) => c.id === id);
      if (!counter || counter.kind !== 'plan' || counter.planSource == null) {
        return;
      }
      const plan = buildKnitPlan(counter.planSource);
      const prevIndex = Math.max(counter.phaseIndex - 1, 0);
      counter.phaseIndex = prevIndex;
      const phaseRows = plan.phases[prevIndex]?.rows;
      counter.count = phaseRows ?? 0;
      this.bumpUpdatedAt(counter);
      void this.persistState();
    },
    rename(id: string, name: string) {
      const counter = self.counters.find((c) => c.id === id);
      if (!counter) {
        return;
      }
      counter.name = name;
      this.bumpUpdatedAt(counter);
      void this.persistState();
    },
    setTarget(id: string, target: number | null) {
      if (!isValidTarget(target)) {
        return;
      }
      const counter = self.counters.find((c) => c.id === id);
      if (!counter || counter.kind === 'plan') {
        return;
      }
      counter.target = target;
      this.bumpUpdatedAt(counter);
      void this.persistState();
    },
    setNote(id: string, note: string) {
      const counter = self.counters.find((c) => c.id === id);
      if (!counter) {
        return;
      }
      counter.note = note;
      this.bumpUpdatedAt(counter);
      void this.persistState();
    },
    removeCounter(id: string) {
      const idx = self.counters.findIndex((c) => c.id === id);
      if (idx === -1) {
        return;
      }
      self.counters.splice(idx, 1);
      void this.persistState();
    },
  }));

const rowCounterState = RowCounterState.create({ counters: [] });
export default rowCounterState;

export type { KnitPlanPhaseId };

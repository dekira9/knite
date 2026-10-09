jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import { applySnapshot } from 'mobx-state-tree';
import introState from '@/state/introState';

describe('introState projects', () => {
  beforeEach(() => {
    applySnapshot(introState, {
      savedProjects: [],
      activeProjectId: null,
      style: '',
      styleChosen: false,
      introFinished: false,
      hasCustomMeasurements: false,
    });
  });

  it('creates a new project on each custom flow', () => {
    introState.createCustomProject('regular');
    const firstId = introState.activeProjectId;
    expect(introState.savedProjects.length).toBe(1);
    expect(firstId).toBeTruthy();

    introState.prepareStyleChoice('custom');
    introState.createCustomProject('v-neck');

    expect(introState.savedProjects.length).toBe(2);
    expect(introState.activeProjectId).not.toBe(firstId);
    expect(introState.savedProjects[0].id).toBe(introState.activeProjectId);
  });

  it('syncs active project when measurements change', () => {
    introState.createCustomProject('regular');
    introState.setChestCircumference('100');

    const project = introState.savedProjects.find(
      (p) => p.id === introState.activeProjectId,
    );
    expect((project?.state as { chestCircumference?: string }).chestCircumference).toBe(
      '100',
    );
  });

  it('deletes a project and clears active session when deleting active project', () => {
    introState.createCustomProject('regular');
    const id = introState.activeProjectId!;
    introState.deleteProject(id);

    expect(introState.savedProjects.length).toBe(0);
    expect(introState.activeProjectId).toBeNull();
    expect(introState.style).toBe('');
  });

  it('does not create projects for sample flow', async () => {
    await introState.beginSampleFlow('regular');
    expect(introState.savedProjects.length).toBe(0);
    expect(introState.activeProjectId).toBeNull();
  });
});

import {
  isUserSavedProject,
  pickProjectDedupState,
  projectStatesEqual,
} from '@/state/introStatePersistedKeys';

describe('projectStatesEqual', () => {
  const baseProject = {
    style: 'regular',
    chestCircumference: '92',
    headCircumference: '58',
    usesSampleMeasurements: false,
    chartHighlightedRows: { back: 3 },
    introFinished: true,
  };

  it('treats projects with same measurements as equal', () => {
    expect(
      projectStatesEqual(baseProject, {
        ...baseProject,
        introFinished: false,
      }),
    ).toBe(true);
  });

  it('ignores chart highlight differences', () => {
    expect(
      projectStatesEqual(baseProject, {
        ...baseProject,
        chartHighlightedRows: { back: 9 },
      }),
    ).toBe(true);
  });

  it('detects different measurement inputs', () => {
    expect(
      projectStatesEqual(baseProject, {
        ...baseProject,
        chestCircumference: '96',
      }),
    ).toBe(false);
  });

  it('pickProjectDedupState omits UI-only fields', () => {
    expect(pickProjectDedupState(baseProject)).not.toHaveProperty('chartHighlightedRows');
    expect(pickProjectDedupState(baseProject)).not.toHaveProperty('introFinished');
  });
});

describe('isUserSavedProject', () => {
  const customProject = {
    style: 'regular',
    chestCircumference: '92',
    hasCustomMeasurements: true,
    usesSampleMeasurements: false,
    introFinished: true,
  };

  it('includes custom measurement projects', () => {
    expect(isUserSavedProject(customProject)).toBe(true);
  });

  it('excludes example projects flagged as sample', () => {
    expect(
      isUserSavedProject({
        ...customProject,
        usesSampleMeasurements: true,
        hasCustomMeasurements: false,
      }),
    ).toBe(false);
  });

  it('excludes legacy example projects without custom flag', () => {
    expect(
      isUserSavedProject({
        style: 'regular',
        headCircumference: '58',
        neckCircumference: '36',
        chestCircumference: '92',
        stitchDensity: '24',
        rowDensity: '32',
        fitType: 'fitted',
        introFinished: true,
      }),
    ).toBe(false);
  });

  it('includes legacy custom projects with distinct measurements', () => {
    expect(
      isUserSavedProject({
        ...customProject,
        chestCircumference: '96',
        hasCustomMeasurements: undefined,
      }),
    ).toBe(true);
  });
});

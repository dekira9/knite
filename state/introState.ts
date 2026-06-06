import { types } from "mobx-state-tree";
import { getSnapshot } from "mobx-state-tree";
import { InteractionManager } from "react-native";
import { calculateRaglan } from "@/utils/calculateRaglan";
import {
  calculateRaglanRemote,
  type RaglanRemoteInput,
} from "@/utils/calculateRaglanCoreRemote";
import AsyncStorage from '@react-native-async-storage/async-storage';
import onboardingState from "@/state/onboardingState";
import { SAMPLE_MEASUREMENTS, type RaglanStyleId } from "@/constants/samplePresets";
import {
  applyPersistedIntroState,
  pickPersistedIntroState,
} from "@/state/introStatePersistedKeys";

function runAfterInteractions(task: () => void) {
  InteractionManager.runAfterInteractions(task);
}

function captureProjectSnapshot(
  self: Record<string, unknown>,
): Record<string, unknown> {
  return pickPersistedIntroState(getSnapshot(self) as Record<string, unknown>);
}

function buildRaglanSyncInput(
  self: {
    headCircumference: string;
    neckCircumference: string;
    chestCircumference: string;
    stitchDensity: string;
    rowDensity: string;
    fitType: string;
    ribbingWidth: number;
    ribbingWidthV: number;
    raglanLineWidth: number;
    raglanLineWidthV: number;
    depthNeckV: number | undefined;
  },
  measurementSystem: string,
): RaglanRemoteInput {
  return {
    headCircumference: self.headCircumference,
    neckCircumference: self.neckCircumference,
    chestCircumference: self.chestCircumference,
    stitchDensity: self.stitchDensity,
    rowDensity: self.rowDensity,
    fitType: self.fitType,
    ribbingWidth: self.ribbingWidth,
    ribbingWidthV: self.ribbingWidthV,
    raglanLineWidth: self.raglanLineWidth,
    raglanLineWidthV: self.raglanLineWidthV,
    depthNeckV: self.depthNeckV,
    measurementSystem,
  };
}

const SavedProject = types.model({
  id: types.identifier,
  savedAt: types.number,
  state: types.frozen(),
});

const IntroState = types
  .model({
    styleChosen: types.optional(types.boolean, false),
    style: types.optional(types.string, ''),
    headCircumference: types.optional(types.string, '58'),
    neckCircumference: types.optional(types.string, '36'),
    chestCircumference: types.optional(types.string, '92'),
    stitchDensity: types.optional(types.string, '24'),
    rowDensity: types.optional(types.string, '32'),
    fitType: types.optional(types.string, 'fitted'),
    Sgor: types.optional(types.number, 0),
    NRrez: types.optional(types.number, 0),
    SgorV: types.optional(types.number, 0),
    NRrezV: types.optional(types.number, 0),
    SFrontO: types.optional(types.number, 0),
    SFrontV: types.optional(types.number, 0),
    Sa: types.optional(types.number, 0),
    SaV: types.optional(types.number, 0),
    K: types.optional(types.number, 2),
    KV: types.optional(types.number, 2),
    SKfront: types.optional(types.number, 0),
    SKfrontV: types.optional(types.number, 0),
    SKa: types.optional(types.number, 0),
    SKaV: types.optional(types.number, 0),
    LFrontO: types.optional(types.number, 0),
    LFrontV: types.optional(types.number, 0),
    NHFront: types.optional(types.number, 0),
    NHFrontV: types.optional(types.number, 0),
    NRostok: types.optional(types.number, 0),
    NRostokV: types.optional(types.number, 0),
    SFrontOGr: types.optional(types.number, 0),
    SFrontOGrV: types.optional(types.number, 0),
    SPodr: types.optional(types.number, 0),
    SPodrV: types.optional(types.number, 0),
    Sfx: types.optional(types.number, 0),
    SfxV: types.optional(types.number, 0),
    prib_1x1: types.optional(types.number, 0),
    prib_1x1V: types.optional(types.number, 0),
    prib_1x2: types.optional(types.number, 0),
    prib_1x2V: types.optional(types.number, 0),
    prib_1x3: types.optional(types.number, 0),
    prib_1x3V: types.optional(types.number, 0),
    PR_1x4: types.optional(types.number, 0),
    PR_1x4V: types.optional(types.number, 0),
    PR_1x2: types.optional(types.number, 0),
    PR_1x2V: types.optional(types.number, 0),
    PRib_1x4: types.optional(types.number, 0),
    PRib_1x4V: types.optional(types.number, 0),
    PRib_1x3: types.optional(types.number, 0),
    PRib_1x3V: types.optional(types.number, 0),
    prib_1x1_f: types.optional(types.number, 0),
    prib_1x1_fV: types.optional(types.number, 0),
    prib_1x2_f: types.optional(types.number, 0),
    prib_1x2_fV: types.optional(types.number, 0),
    prib_1x3_f: types.optional(types.number, 0),
    prib_1x3_fV: types.optional(types.number, 0),
    PR_1x4_f: types.optional(types.number, 0),
    PR_1x4_fV: types.optional(types.number, 0),
    PR_1x2_f: types.optional(types.number, 0),
    PR_1x2_fV: types.optional(types.number, 0),
    PRib_1x4_f: types.optional(types.number, 0),
    PRib_1x4_fV: types.optional(types.number, 0),
    PRib_1x3_f: types.optional(types.number, 0),
    PRib_1x3_fV: types.optional(types.number, 0),
    usedIncreaseType: types.optional(types.array(types.string), []),
    usedIncreaseTypeV: types.optional(types.array(types.string), []),
    usedIncreaseTypeString: types.optional(types.string, ''),
    usedIncreaseTypeStringV: types.optional(types.string, ''),
    fit: types.optional(types.number, 0),
    SFit: types.optional(types.number, 0),
    SOgr: types.optional(types.number, 0),
    SRostok: types.optional(types.number, 0),
    SRostokV: types.optional(types.number, 0),
    stitches: types.optional(types.number, 0),
    ribbingWidth: types.optional(types.number, 2),
    raglanLineWidth: types.optional(types.number, 0),
    raglanLineWidthV: types.optional(types.number, 1),
    depthNeckV: types.maybe(types.number),  
    ribbingWidthV: types.optional(types.number, 2),
    RowPrib1x4: types.optional(types.array(types.number), []),
    RowPrib1x4V: types.optional(types.array(types.number), []),
    RowPrib1x3: types.optional(types.array(types.number), []),
    RowPrib1x3V: types.optional(types.array(types.number), []),
    RowPrib1x4String: types.optional(types.string, ''),
    RowPrib1x4StringV: types.optional(types.string, ''),
    RowPrib1x3String: types.optional(types.string, ''),
    RowPrib1x3StringV: types.optional(types.string, ''),
    RowPrib1x2: types.optional(types.array(types.number), []),
    RowPrib1x2V: types.optional(types.array(types.number), []),
    RowPrib1x2String: types.optional(types.string, ''),
    RowPrib1x2StringV: types.optional(types.string, ''),
    RowPrib1x1: types.optional(types.array(types.number), []),
    RowPrib1x1V: types.optional(types.array(types.number), []),
    RowPrib1x1String: types.optional(types.string, ''),
    RowPrib1x1StringV: types.optional(types.string, ''),
    resultString21V: types.optional(types.string, ''),
    resultString23V: types.optional(types.string, ''),
    resultString24V: types.optional(types.string, ''),
    resultString43V: types.optional(types.string, ''),
    resultStringV: types.optional(types.string, ''),
    Ls: types.optional(types.number, 0),
    LsV: types.optional(types.number, 0),
    hs: types.optional(types.number, 0),
    hsV: types.optional(types.number, 0),
    NRfx: types.optional(types.number, 0),
    NRfxV: types.optional(types.number, 0),
    SV:types.optional(types.number, 0),
    SVfront:types.optional(types.number, 0),
    SVO: types.optional(types.number, 0),
    LHV: types.optional(types.number, 0),
    NHV: types.optional(types.number, 0),
    NHVmax: types.optional(types.number, 0),
    NHVmin: types.optional(types.number, 0),
    LVfront:types.optional(types.number, 0),
    LKmaxV: types.optional(types.number, 0),
    KmaxV: types.optional(types.number, 5),
    LHVmin: types.optional(types.number, 0),
    LHVmax: types.optional(types.number, 0),
    

    introFinished: types.optional(types.boolean, false),
    usesSampleMeasurements: types.optional(types.boolean, false),
    hasCustomMeasurements: types.optional(types.boolean, false),
    activeProjectId: types.optional(types.maybeNull(types.string), null),
    savedProjects: types.optional(types.array(SavedProject), []),
    awaitingStyleChoice: types.optional(types.boolean, false),
    styleChoiceMode: types.optional(
      types.maybeNull(types.enumeration(['sample', 'custom'])),
      null,
    ),
    necklineStyle: types.optional(types.enumeration(['round', 'v-neck']), 'round'),
    SOcutV: types.optional(types.number, 0),
    SpribVcorn: types.optional(types.number, 0),
    LpribVcorn: types.optional(types.number, 0),
    PribRVz: types.optional(types.number, 0),
    PribRV1s: types.optional(types.number, 0),
    PribRV2s: types.optional(types.number, 0),
    PribRV3s: types.optional(types.number, 0),
    RowPribRV1:types.optional(types.number, 0),
    RowPribRVz:types.optional(types.number, 0),
    RowPribRV2:types.optional(types.number, 0),
    RowPribRV3:types.optional(types.number, 0),
    isV: types.optional(types.number, 0),
    isPlusOneV: types.optional(types.number, 0),
    pairsWithIsV: types.optional(types.number, 0),
    pairsWithIsPlusOneV: types.optional(types.number, 0),
    rowsWithIsV: types.optional(types.number, 0),
    rowsWithIsPlusOneV: types.optional(types.number, 0),
    krV: types.optional(types.number, 0),
    positionsWithIsV: types.optional(types.array(types.number), []),
    positionsWithIsPlusOneV: types.optional(types.array(types.number), []),
    chartHighlightedRows: types.optional(types.frozen<Record<string, number>>(), {}),
  })
  .actions((self) => ({
    setStyle(style: string) {
      self.style = style;
      this.persistState();
    },
    setHeadCircumference(value: string) {
      self.headCircumference = value;
      this.persistState();
    },
    setNeckCircumference(value: string) {
      self.neckCircumference = value;
      this.persistState();
    },
    setChestCircumference(value: string) {
      self.chestCircumference = value;
      this.persistState();
    },
    setStitchDensity(value: string) {
      self.stitchDensity = value;
      this.persistState();
    },
    setRowDensity(value: string) {
      self.rowDensity = value;
      this.persistState();
    },
    setFitType(value: string) {
      self.fitType = value;
      this.persistState();
    },
    setRaglanData(data: any) {
      Object.assign(self, data);
      this.persistState();
    },
    setStyleChosen(value: boolean) {
      self.styleChosen = value;
      this.persistState();
    },
    setRibbingWidth(value: string) {
      self.ribbingWidth = parseFloat(value);
      this.persistState();
    },
    setRaglanLineWidth(width: number) {
      self.raglanLineWidth = width;
      this.persistState();
    },
    setRaglanLineWidthV(width: number) {
      self.raglanLineWidthV = width;
      self.KV = width;
      this.persistState();
    },
    setRibbingWidthV(value: string) {
      self.ribbingWidthV = parseFloat(value);
      this.persistState();
    },
    setDepthNeckV(value: number | string) {
      if (typeof value === 'string') {
        self.depthNeckV = parseFloat(value);
      } else {
        self.depthNeckV = value;
      }
      this.persistState();
    },
    setNecklineStyle(style: 'round' | 'v-neck') {
      self.necklineStyle = style;
      this.persistState();
    },
    setIntroFinished(value: boolean) {
      self.introFinished = value;
      this.persistState();
    },
    setUsesSampleMeasurements(value: boolean) {
      self.usesSampleMeasurements = value;
      this.persistState();
    },
    setHasCustomMeasurements(value: boolean) {
      self.hasCustomMeasurements = value;
      this.persistState();
    },
    setAwaitingStyleChoice(value: boolean) {
      self.awaitingStyleChoice = value;
    },
    setStyleChoiceMode(mode: 'sample' | 'custom' | null) {
      self.styleChoiceMode = mode;
    },
    prepareStyleChoice(mode: 'sample' | 'custom') {
      if (mode === 'custom') {
        this.syncActiveProject();
        self.activeProjectId = null;
      }
      self.introFinished = false;
      self.styleChosen = false;
      self.awaitingStyleChoice = true;
      self.styleChoiceMode = mode;
      self.usesSampleMeasurements = false;
      if (mode === 'sample') {
        self.activeProjectId = null;
      }
      runAfterInteractions(() => {
        void this.persistState();
      });
    },
    async beginSampleFlow(styleId: RaglanStyleId) {
      const s = SAMPLE_MEASUREMENTS;
      self.headCircumference = s.headCircumference;
      self.neckCircumference = s.neckCircumference;
      self.chestCircumference = s.chestCircumference;
      self.stitchDensity = s.stitchDensity;
      self.rowDensity = s.rowDensity;
      self.fitType = s.fitType;
      self.ribbingWidth = s.ribbingWidth;
      self.ribbingWidthV = s.ribbingWidthV;
      self.raglanLineWidth = s.raglanLineWidth;
      self.raglanLineWidthV = s.raglanLineWidthV;
      self.K = s.raglanLineWidth;
      self.KV = s.raglanLineWidthV;
      self.depthNeckV = s.depthNeckV;
      self.style = styleId;
      self.styleChosen = true;
      self.usesSampleMeasurements = true;
      self.activeProjectId = null;
      self.awaitingStyleChoice = false;
      self.styleChoiceMode = null;
      self.introFinished = true;
      await this.syncRaglanFromSupabase();
      runAfterInteractions(() => {
        void this.persistState();
      });
    },
    beginCustomFlow(styleId: RaglanStyleId) {
      this.createCustomProject(styleId);
      self.awaitingStyleChoice = false;
      self.styleChoiceMode = null;
      runAfterInteractions(() => {
        void this.persistState();
      });
    },
    applySamplePreset(styleId: RaglanStyleId) {
      const s = SAMPLE_MEASUREMENTS;
      self.headCircumference = s.headCircumference;
      self.neckCircumference = s.neckCircumference;
      self.chestCircumference = s.chestCircumference;
      self.stitchDensity = s.stitchDensity;
      self.rowDensity = s.rowDensity;
      self.fitType = s.fitType;
      self.ribbingWidth = s.ribbingWidth;
      self.ribbingWidthV = s.ribbingWidthV;
      self.raglanLineWidth = s.raglanLineWidth;
      self.raglanLineWidthV = s.raglanLineWidthV;
      self.K = s.raglanLineWidth;
      self.KV = s.raglanLineWidthV;
      self.depthNeckV = s.depthNeckV;
      self.style = styleId;
      self.styleChosen = true;
      this.persistState();
    },
    beginCustomMeasurements() {
      self.introFinished = false;
      this.persistState();
    },
    markMeasurementsCustom() {
      self.hasCustomMeasurements = true;
      self.usesSampleMeasurements = false;
      this.persistState();
    },
    syncActiveProject() {
      if (!self.activeProjectId) {
        return;
      }
      const index = self.savedProjects.findIndex((p) => p.id === self.activeProjectId);
      if (index < 0) {
        return;
      }
      const snapshot = captureProjectSnapshot(self as unknown as Record<string, unknown>);
      self.savedProjects.splice(index, 1, {
        id: self.activeProjectId,
        savedAt: Date.now(),
        state: snapshot,
      });
    },
    createCustomProject(styleId: RaglanStyleId) {
      const defaults = freshCustomDefaults();
      defaults.style = styleId;
      defaults.styleChosen = true;
      applyPersistedIntroState(self as unknown as Record<string, unknown>, defaults);
      self.style = styleId;
      self.styleChosen = true;
      self.hasCustomMeasurements = true;
      self.usesSampleMeasurements = false;
      self.introFinished = false;

      const id = String(Date.now());
      self.activeProjectId = id;
      self.savedProjects.unshift({
        id,
        savedAt: Date.now(),
        state: captureProjectSnapshot(self as unknown as Record<string, unknown>),
      });
    },
    deleteProject(id: string) {
      const index = self.savedProjects.findIndex((p) => p.id === id);
      if (index < 0) {
        return;
      }
      self.savedProjects.splice(index, 1);
      if (self.activeProjectId === id) {
        self.activeProjectId = null;
        applyPersistedIntroState(
          self as unknown as Record<string, unknown>,
          freshCustomDefaults(),
        );
        self.styleChosen = false;
        self.style = '';
        self.hasCustomMeasurements = false;
        self.introFinished = false;
        self.awaitingStyleChoice = false;
        self.styleChoiceMode = null;
      }
      void this.persistSavedProjects();
      void this.persistState();
    },
    restoreProject(id: string) {
      const project = self.savedProjects.find((p) => p.id === id);
      if (!project) {
        return;
      }
      const raw = project.state as Record<string, unknown> & { savedProjects?: unknown };
      const { savedProjects: _saved, ...projectState } = raw;
      this.setPersistedState(projectState);
      self.activeProjectId = id;
      self.awaitingStyleChoice = false;
      runAfterInteractions(() => {
        void this.persistState();
      });
    },
    async syncRaglanFromSupabase() {
      const input = buildRaglanSyncInput(self, onboardingState.measurementSystem);
      const remoteResult = await calculateRaglanRemote(input);
      const result = remoteResult ?? calculateRaglan(input);

      if (typeof result === 'string') {
        return false;
      }

      this.setRaglanData(result);
      return true;
    },
    async persistState() {
      this.syncActiveProject();
      try {
        const state = pickPersistedIntroState(getSnapshot(self) as Record<string, unknown>);
        state.activeProjectId = self.activeProjectId;
        await AsyncStorage.setItem('introState', JSON.stringify(state));
        await this.persistSavedProjects();
      } catch (error) {
        console.error('Failed to save intro state:', error);
      }
    },
    async persistSavedProjects() {
      try {
        await AsyncStorage.setItem(
          'introSavedProjects',
          JSON.stringify(getSnapshot(self.savedProjects)),
        );
      } catch (error) {
        console.error('Failed to save projects:', error);
      }
    },
    setPersistedState(state: any) {
      applyPersistedIntroState(self as unknown as Record<string, unknown>, state);
      if (state.activeProjectId !== undefined) {
        self.activeProjectId = state.activeProjectId;
      }
    },
    async loadPersistedState() {
      try {
        const [state, saved] = await Promise.all([
          AsyncStorage.getItem('introState'),
          AsyncStorage.getItem('introSavedProjects'),
        ]);
        this.applyLoadedPersistence(state, saved);
      } catch (error) {
        console.error('Failed to load intro state:', error);
      }
    },
    applyLoadedPersistence(stateJson: string | null, savedJson: string | null) {
      if (stateJson) {
        this.setPersistedState(JSON.parse(stateJson));
      }
      if (savedJson) {
        const parsed = JSON.parse(savedJson);
        if (Array.isArray(parsed)) {
          self.savedProjects.replace(parsed);
        }
      }
    },
    setDepthNeckVFromRows(nhv: number) {
      const rowDensity = parseFloat(self.rowDensity.replace(',', '.')) / 10;
      self.depthNeckV = nhv / rowDensity;
      this.persistState();
    },
    setChartHighlightedRow(chartId: string, row: number) {
      const rows = { ...(self.chartHighlightedRows as Record<string, number> | undefined) };
      rows[chartId] = row;
      self.chartHighlightedRows = rows;
      this.persistState();
    },
  }))
  .views((self) => ({
    getChartHighlightedRow(chartId: string, rowCount: number, defaultRow = 0) {
      const saved = (self.chartHighlightedRows as Record<string, number> | undefined)?.[chartId];
      const row = saved ?? defaultRow;
      if (rowCount <= 0) {
        return defaultRow;
      }
      return Math.min(Math.max(row, 0), rowCount - 1);
    },
    calculateRaglan() {
      const snapshot = getSnapshot(self) as any;
      return {
        ...snapshot,
        SRostok:
          snapshot.SRostok && snapshot.SRostok > 0
            ? snapshot.SRostok
            : snapshot.SFrontO + 2 * snapshot.Sfx + 2 * snapshot.SKfront,
        SRostokV:
          snapshot.SRostokV && snapshot.SRostokV > 0
            ? snapshot.SRostokV
            : snapshot.SFrontV + 2 * snapshot.SfxV + 2 * snapshot.SKfrontV,
      } as any;
    },
    getNHV() {
      if (self.depthNeckV === undefined) {
        return undefined;
      }
      
      const rowDensity = parseFloat(self.rowDensity.replace(',', '.')) / 10;
      return Math.round(self.depthNeckV * rowDensity);
    },
  }))
  .actions((self) => ({
    async updateRaglanData() {
      await self.syncRaglanFromSupabase();
    },
  }));

function freshCustomDefaults(): Record<string, unknown> {
  const defaults = pickPersistedIntroState(
    getSnapshot(IntroState.create({})) as Record<string, unknown>,
  );
  defaults.hasCustomMeasurements = true;
  defaults.usesSampleMeasurements = false;
  defaults.introFinished = false;
  return defaults;
}

const introState = IntroState.create({});
export default introState; 

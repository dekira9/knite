import { types } from "mobx-state-tree";
import { getSnapshot } from "mobx-state-tree";
import { calculateRaglanRemote } from "@/utils/calculateRaglanCoreRemote";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable } from 'mobx';
import onboardingState from "@/state/onboardingState";
import { SAMPLE_MEASUREMENTS, type RaglanStyleId } from "@/constants/samplePresets";
import {
  applyPersistedIntroState,
  pickPersistedIntroState,
} from "@/state/introStatePersistedKeys";

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
    savedProjects: types.optional(types.array(SavedProject), []),
    awaitingStyleChoice: types.optional(types.boolean, false),
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
    archiveCurrentProject() {
      if (!self.introFinished || !self.style) {
        return;
      }
      const full = getSnapshot(self) as Record<string, unknown> & {
        savedProjects?: unknown;
      };
      const { savedProjects: _saved, ...snapshot } = full;
      const last = self.savedProjects[0];
      if (
        last &&
        (last.state as { style?: string; chestCircumference?: string }).style ===
          snapshot.style &&
        (last.state as { chestCircumference?: string }).chestCircumference ===
          snapshot.chestCircumference
      ) {
        return;
      }
      self.savedProjects.unshift({
        id: String(Date.now()),
        savedAt: Date.now(),
        state: snapshot,
      });
      if (self.savedProjects.length > 10) {
        self.savedProjects.splice(10, self.savedProjects.length - 10);
      }
      void this.persistSavedProjects();
    },
    startNewProject() {
      this.archiveCurrentProject();
      self.introFinished = false;
      self.styleChosen = false;
      self.awaitingStyleChoice = true;
      this.persistState();
    },
    restoreProject(id: string) {
      const project = self.savedProjects.find((p) => p.id === id);
      if (!project) {
        return;
      }
      const raw = project.state as Record<string, unknown> & { savedProjects?: unknown };
      const { savedProjects: _saved, ...projectState } = raw;
      this.setPersistedState(projectState);
      self.awaitingStyleChoice = false;
      this.persistState();
    },
    async syncRaglanFromSupabase() {
      const remoteResult = await calculateRaglanRemote({
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
        measurementSystem: onboardingState.measurementSystem,
      });

      if (!remoteResult) {
        return false;
      }

      this.setRaglanData(remoteResult);
      return true;
    },
    async persistState() {
      try {
        const state = pickPersistedIntroState(getSnapshot(self) as Record<string, unknown>);
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
  }))
  .views((self) => ({
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

const introState = IntroState.create({});
export default introState; 

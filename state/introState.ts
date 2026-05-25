import { types } from "mobx-state-tree";
import { getSnapshot } from "mobx-state-tree";
import { calculateRaglanRemote } from "@/utils/calculateRaglanCoreRemote";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable } from 'mobx';
import onboardingState from "@/state/onboardingState";
import { SAMPLE_MEASUREMENTS, type RaglanStyleId } from "@/constants/samplePresets";

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
        const state = {
          styleChosen: self.styleChosen,
          style: self.style,
          headCircumference: self.headCircumference,
          neckCircumference: self.neckCircumference,
          chestCircumference: self.chestCircumference,
          stitchDensity: self.stitchDensity,
          rowDensity: self.rowDensity,
          fitType: self.fitType,
          Sgor: self.Sgor,    
          SgorV: self.SgorV,
          NRrez: self.NRrez,
          NRrezV: self.NRrezV,
          LFrontO: self.LFrontO,
          LFrontV: self.LFrontV,
          SFrontO: self.SFrontO,
          SFrontV: self.SFrontV,
          Sa: self.Sa,
          SaV: self.SaV,
          K: self.K,
          KV: self.KV,
          SKfront: self.SKfront,
          SKfrontV: self.SKfrontV,
          SKa: self.SKa,
          SKaV: self.SKaV,
          NHFront: self.NHFront,
          NHFrontV: self.NHFrontV,
          NRostok: self.NRostok,
          NRostokV: self.NRostokV,
          SFrontOGr: self.SFrontOGr,
          SFrontOGrV: self.SFrontOGrV,
          SPodr: self.SPodr,
          SPodrV: self.SPodrV,
          Sfx: self.Sfx,
          SfxV: self.SfxV,
          prib_1x1: self.prib_1x1,
          prib_1x1V: self.prib_1x1V,
          prib_1x2: self.prib_1x2,
          prib_1x2V: self.prib_1x2V,
          prib_1x3: self.prib_1x3,
          prib_1x3V: self.prib_1x3V,
          PR_1x4: self.PR_1x4,
          PR_1x4V: self.PR_1x4V,
          PR_1x2: self.PR_1x2,
          PR_1x2V: self.PR_1x2V,
          PRib_1x4: self.PRib_1x4,
          PRib_1x4V: self.PRib_1x4V,
          PRib_1x3: self.PRib_1x3,
          PRib_1x3V: self.PRib_1x3V,

          prib_1x1_f: self.prib_1x1_f,
          prib_1x1_fV: self.prib_1x1_fV,
          prib_1x2_f: self.prib_1x2_f,
          prib_1x2_fV: self.prib_1x2_fV,
          prib_1x3_f: self.prib_1x3_f,
          prib_1x3_fV: self.prib_1x3_fV,
          PR_1x4_f: self.PR_1x4_f,
          PR_1x4_fV: self.PR_1x4_fV,
          PR_1x2_f: self.PR_1x2_f,
          PR_1x2_fV: self.PR_1x2_fV,
          PRib_1x4_f: self.PRib_1x4_f,
          PRib_1x4_fV: self.PRib_1x4_fV,
          PRib_1x3_f: self.PRib_1x3_f,
          PRib_1x3_fV: self.PRib_1x3_fV,
          usedIncreaseType: self.usedIncreaseType,
          usedIncreaseTypeV: self.usedIncreaseTypeV,
          usedIncreaseTypeString: self.usedIncreaseTypeString,
          usedIncreaseTypeStringV: self.usedIncreaseTypeStringV,
          fit: self.fit,
          SFit: self.SFit,
          SOgr: self.SOgr,
          SRostok: self.SRostok,
          SRostokV: self.SRostokV,
          stitches: self.stitches,
          ribbingWidth: self.ribbingWidth,
          raglanLineWidth: self.raglanLineWidth,
          raglanLineWidthV: self.raglanLineWidthV,
          depthNeckV: self.depthNeckV,
          ribbingWidthV: self.ribbingWidthV,
          RowPrib1x4: self.RowPrib1x4,
          RowPrib1x4V: self.RowPrib1x4V,
          RowPrib1x3: self.RowPrib1x3,
          RowPrib1x3V: self.RowPrib1x3V,
          RowPrib1x4String: self.RowPrib1x4String,
          RowPrib1x4StringV: self.RowPrib1x4StringV,
          RowPrib1x3String: self.RowPrib1x3String,
          RowPrib1x3StringV: self.RowPrib1x3StringV,
          RowPrib1x2: self.RowPrib1x2,
          RowPrib1x2V: self.RowPrib1x2V,
          RowPrib1x2String: self.RowPrib1x2String,
          RowPrib1x2StringV: self.RowPrib1x2StringV,
          RowPrib1x1: self.RowPrib1x1,
          RowPrib1x1V: self.RowPrib1x1V,
          RowPrib1x1String: self.RowPrib1x1String,
          RowPrib1x1StringV: self.RowPrib1x1StringV,
          resultString21V: self.resultString21V,
          resultString23V: self.resultString23V,
          resultString24V: self.resultString24V,
          resultString43V: self.resultString43V,
          resultStringV: self.resultStringV,
          Ls: self.Ls,
          LsV: self.LsV,
          hs: self.hs,
          hsV: self.hsV,
          NRfx: self.NRfx,
          NRfxV: self.NRfxV,
          SV: self.SV,
          SVfront: self.SVfront,
          SVO: self.SVO,
          LHV: self.LHV,
          LKmaxV: self.LKmaxV,
          KmaxV: self.KmaxV,
          LHVmin: self.LHVmin,
          LHVmax: self.LHVmax,
          NHVmax: self.NHVmax,
          NHVmin: self.NHVmin,
          NHV: self.NHV,
          LVfront:self.LVfront,
          necklineStyle: self.necklineStyle,
          SOcutV: self.SOcutV,
          LpribVcorn: self.LpribVcorn,
          SpribVcorn: self.SpribVcorn,
          PribRVz: self.PribRVz,
          PribRV1s: self.PribRV1s,
          PribRV2s: self.PribRV2s,
          PribRV3s: self.PribRV3s,
          RowPribRV1: self.RowPribRV1,
          RowPribRVz: self.RowPribRVz,
          RowPribRV2: self.RowPribRV2,
          RowPribRV3: self.RowPribRV3,
          isV: self.isV,
          isPlusOneV: self.isPlusOneV,
          pairsWithIsV: self.pairsWithIsV,
          pairsWithIsPlusOneV: self.pairsWithIsPlusOneV,
          rowsWithIsV: self.rowsWithIsV,
          rowsWithIsPlusOneV: self.rowsWithIsPlusOneV,
          krV: self.krV,
          positionsWithIsV: self.positionsWithIsV,
          positionsWithIsPlusOneV: self.positionsWithIsPlusOneV,
          introFinished: self.introFinished,
          usesSampleMeasurements: self.usesSampleMeasurements,
          hasCustomMeasurements: self.hasCustomMeasurements,
        };
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
      self.styleChosen = state.styleChosen;
      self.style = state.style;
      self.headCircumference = state.headCircumference;
      self.neckCircumference = state.neckCircumference;
      self.chestCircumference = state.chestCircumference;
      self.stitchDensity = state.stitchDensity;
      self.rowDensity = state.rowDensity;
      self.fitType = state.fitType;
      self.Sgor = state.Sgor;
      self.SgorV = state.SgorV; 
      self.NRrez = state.NRrez;
      self.NRrezV = state.NRrezV;
      self.LFrontO = state.LFrontO;
      self.LFrontV = state.LFrontV;
      self.SFrontO = state.SFrontO;
      self.SFrontV = state.SFrontV;
      self.Sa = state.Sa;
      self.SaV = state.SaV;
      self.K = state.K;
      self.KV = state.KV; 
      self.SKfront = state.SKfront;
      self.SKfrontV = state.SKfrontV;
      self.SKa = state.SKa;
      self.SKaV = state.SKaV;
      self.NHFront = state.NHFront;
      self.NHFrontV = state.NHFrontV;
      self.NRostok = state.NRostok;
      
      self.SFrontOGr = state.SFrontOGr;
      self.SFrontOGrV = state.SFrontOGrV;
      self.SPodr = state.SPodr;
      
      self.Sfx = state.Sfx;
      self.SfxV = state.SfxV;

      self.prib_1x1 = state.prib_1x1;
      self.prib_1x1V = state.prib_1x1V;
      self.prib_1x2 = state.prib_1x2;
      self.prib_1x2V = state.prib_1x2V;
      self.prib_1x3 = state.prib_1x3;
      self.prib_1x3V = state.prib_1x3V;
      self.PR_1x4 = state.PR_1x4;
      self.PR_1x4V = state.PR_1x4V;
      self.PR_1x2 = state.PR_1x2;
      self.PR_1x2V = state.PR_1x2V;
      self.PRib_1x4 = state.PRib_1x4; 
      self.PRib_1x4V = state.PRib_1x4V;
      self.PRib_1x3 = state.PRib_1x3;
      self.PRib_1x3V = state.PRib_1x3V;

      self.prib_1x1_f = state.prib_1x1_f;
      self.prib_1x1_fV = state.prib_1x1_fV;
      self.prib_1x2_f = state.prib_1x2_f;
      self.prib_1x2_fV = state.prib_1x2_fV;
      self.prib_1x3_f = state.prib_1x3_f;
      self.prib_1x3_fV = state.prib_1x3_fV;
      self.PR_1x4_f = state.PR_1x4_f;
      self.PR_1x4_fV = state.PR_1x4_fV;
      self.PR_1x2_f = state.PR_1x2_f; 
      self.PR_1x2_fV = state.PR_1x2_fV;
      self.PRib_1x4_f = state.PRib_1x4_f;
      self.PRib_1x4_fV = state.PRib_1x4_fV;
      self.PRib_1x3_f = state.PRib_1x3_f;
      self.PRib_1x3_fV = state.PRib_1x3_fV;
      self.usedIncreaseType = state.usedIncreaseType;
      self.usedIncreaseTypeV = state.usedIncreaseTypeV;
      self.usedIncreaseTypeString = state.usedIncreaseTypeString;
      self.usedIncreaseTypeStringV = state.usedIncreaseTypeStringV;
      self.fit = state.fit;
      self.SFit = state.SFit;
      self.SOgr = state.SOgr;
      self.SRostok = state.SRostok ?? (state.SFrontO + 2 * state.Sfx + 2 * state.SKfront);
      self.SRostokV = state.SRostokV ?? (state.SFrontV + 2 * state.SfxV + 2 * state.SKfrontV);
      self.stitches = state.stitches;
      self.ribbingWidth = state.ribbingWidth;
      self.raglanLineWidth = state.raglanLineWidth;
      self.raglanLineWidthV = state.raglanLineWidthV;
      self.depthNeckV = state.depthNeckV;
      self.ribbingWidthV = state.ribbingWidthV;
      self.RowPrib1x4 = state.RowPrib1x4;
      self.RowPrib1x4V = state.RowPrib1x4V;
      self.RowPrib1x3 = state.RowPrib1x3;
      self.RowPrib1x3V = state.RowPrib1x3V;
      self.RowPrib1x4String = state.RowPrib1x4String;
      self.RowPrib1x4StringV = state.RowPrib1x4StringV;
      self.RowPrib1x3String = state.RowPrib1x3String;
      self.RowPrib1x3StringV = state.RowPrib1x3StringV;
      self.RowPrib1x2 = state.RowPrib1x2;
      self.RowPrib1x2V = state.RowPrib1x2V;
      self.RowPrib1x2String = state.RowPrib1x2String;
      self.RowPrib1x2StringV = state.RowPrib1x2StringV;
      self.RowPrib1x1 = state.RowPrib1x1;
      self.RowPrib1x1V = state.RowPrib1x1V;
      self.RowPrib1x1String = state.RowPrib1x1String;
      self.RowPrib1x1StringV = state.RowPrib1x1StringV;
      self.resultString21V = state.resultString21V;
      self.resultString23V = state.resultString23V;
      self.resultString24V = state.resultString24V;
      self.resultString43V = state.resultString43V;
      self.resultStringV = state.resultStringV;
      self.Ls = state.Ls;
      self.LsV = state.LsV;
      self.hs = state.hs;
      self.hsV = state.hsV;
      self.NRfx = state.NRfx;
      self.NRfxV = state.NRfxV;
      self.necklineStyle = state.necklineStyle;
      self.SOcutV = state.SOcutV;
      self.LpribVcorn = state.LpribVcorn;
      self.SpribVcorn = state.SpribVcorn;
      self.PribRVz = state.PribRVz;
      self.PribRV1s = state.PribRV1s;
      self.PribRV2s = state.PribRV2s;
      self.PribRV3s = state.PribRV3s;
      self.RowPribRV1=state.RowPribRV1;
      self.RowPribRVz=state.RowPribRVz;
      self.RowPribRV2=state.RowPribRV2;
      self.RowPribRV3=state.RowPribRV3;
      self.SV=state.SV;
      self.SVfront=state.SVfront;
      self.SVO=state.SVO;
      self.LHV=state.LHV;
      self.LKmaxV=state.LKmaxV;
      self.KmaxV=state.KmaxV;
      self.LHVmin=state.LHVmin;
      self.LHVmax=state.LHVmax;
      self.NHVmax=state.NHVmax;
      self.NHVmin=state.NHVmin;
      self.LVfront=state.LVfront;
      self.NHV=state.NHV;
      self.isV=state.isV;
      self.isPlusOneV=state.isPlusOneV;
      self.pairsWithIsV=state.pairsWithIsV;
      self.pairsWithIsPlusOneV=state.pairsWithIsPlusOneV;
      self.rowsWithIsV=state.rowsWithIsV;
      self.rowsWithIsPlusOneV=state.rowsWithIsPlusOneV;
      self.krV=state.krV;
      self.positionsWithIsV=state.positionsWithIsV ?? [];
      self.positionsWithIsPlusOneV=state.positionsWithIsPlusOneV ?? [];
      self.RowPribRV3=state.RowPribRV3;
      self.introFinished = state.introFinished;
      self.usesSampleMeasurements = state.usesSampleMeasurements ?? false;
      if (state.hasCustomMeasurements === true) {
        self.hasCustomMeasurements = true;
        self.usesSampleMeasurements = false;
      } else if (state.introFinished === true && state.hasCustomMeasurements === undefined) {
        // Users who completed the funnel before sample mode existed
        self.hasCustomMeasurements = true;
        self.usesSampleMeasurements = false;
      } else {
        self.hasCustomMeasurements = state.hasCustomMeasurements ?? false;
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

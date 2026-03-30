import { types } from "mobx-state-tree";
import { calculateRaglan } from '@/utils/calculateRaglan';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable } from 'mobx';
import onboardingState from "@/state/onboardingState";

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
    Ls: types.optional(types.number, 0),
    hs: types.optional(types.number, 0),
    SV:types.optional(types.number, 0),
    SVfront:types.optional(types.number, 0),
    LHV: types.optional(types.number, 0),
    NHV: types.optional(types.number, 0),
    LVfront:types.optional(types.number, 0),
    

    introFinished: types.optional(types.boolean, false),
    necklineStyle: types.optional(types.enumeration(['round', 'v-neck']), 'round'),
    SOcutV: types.optional(types.number, 0),
    SpribVcorn: types.optional(types.number, 0),
    LpribVcorn: types.optional(types.number, 0),
    RowPribRV1:types.optional(types.number, 0),
    RowPribRVz:types.optional(types.number, 0),
    RowPribRV2:types.optional(types.number, 0),
    RowPribRV3:types.optional(types.number, 0),
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
      self.ribbingWidth = parseInt(value);
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
      self.ribbingWidthV = parseInt(value);
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
          PRib_1x4_f: self.PRib_1x4_f,
          PRib_1x3_f: self.PRib_1x3_f,
          PRib_1x3_fV: self.PRib_1x3_fV,
          usedIncreaseType: self.usedIncreaseType,
          usedIncreaseTypeV: self.usedIncreaseTypeV,
          usedIncreaseTypeString: self.usedIncreaseTypeString,
          usedIncreaseTypeStringV: self.usedIncreaseTypeStringV,
          fit: self.fit,
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
          Ls: self.Ls,
          hs: self.hs,
          SV: self.SV,
          SVfront: self.SVfront,
          LHV: self.LHV,
          NHV: self.NHV,
          LVfront:self.LVfront,
          necklineStyle: self.necklineStyle,
          SOcutV: self.SOcutV,
          RowPribRV1: self.RowPribRV1,
          RowPribRVz: self.RowPribRVz,
          RowPribRV2: self.RowPribRV2,
          RowPribRV3: self.RowPribRV3,
          introFinished: self.introFinished,
        };
        await AsyncStorage.setItem('introState', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save intro state:', error);
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
      self.Ls = state.Ls;
      self.hs = state.hs;
      self.necklineStyle = state.necklineStyle;
      self.SOcutV = state.SOcutV;
      self.RowPribRV1=state.RowPribRV1;
      self.RowPribRVz=state.RowPribRVz;
      self.RowPribRV2=state.RowPribRV2;
      self.RowPribRV3=state.RowPribRV3;
      self.SV=state.SV;
      self.SVfront=state.SVfront;
      self.LHV=state.LHV;
      self.LVfront=state.LVfront;
      self.NHV=state.NHV;
      self.RowPribRV3=state.RowPribRV3;
      self.introFinished=state.introFinished;
    },
    async loadPersistedState() {
      try {
        const state = await AsyncStorage.getItem('introState');
        if (state) {
          const parsedState = JSON.parse(state);
          console.log('parsedState', parsedState)
          this.setPersistedState(parsedState);
          // Object.assign(self, parsedState);
        }
      } catch (error) {
        console.error('Failed to load intro state:', error);
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
      const result = calculateRaglan({
        headCircumference: self.headCircumference,
        neckCircumference: self.neckCircumference,
        chestCircumference: self.chestCircumference,
        stitchDensity: self.stitchDensity,
        rowDensity: self.rowDensity,
        fitType: self.fitType,
        ribbingWidth: self.ribbingWidth,
        ribbingWidthV: self.ribbingWidthV,
        raglanLineWidthV: self.raglanLineWidthV,
        RowPrib1x4: self.RowPrib1x4,  
        RowPrib1x4V: self.RowPrib1x4V,
        RowPrib1x4String: self.RowPrib1x4String,
        RowPrib1x4StringV: self.RowPrib1x4StringV,
        RowPrib1x3: self.RowPrib1x3,
        RowPrib1x3V: self.RowPrib1x3V,
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
        Ls: self.Ls,
        hs: self.hs,
        SFrontO: self.SFrontO,
        
        SFrontV: self.SFrontV,
        K: self.K,
        KV: self.KV,
        NRrez: self.NRrez,
        NRrezV: self.NRrezV,
        SOcutV: self.SOcutV,
        Sfx: self.Sfx,
        SfxV: self.SfxV,
        NHFront: self.NHFront,
        NHFrontV: self.NHFrontV,
        usedIncreaseType: self.usedIncreaseType,
        usedIncreaseTypeV: self.usedIncreaseTypeV,
        SV: self.SV,
        SaV: self.SaV,
        SVfront: self.SVfront,
        LHV:self.LHV,
        LVfront:self.LVfront,
        measurementSystem: onboardingState.measurementSystem,
      });

      if (typeof result === 'string') {
        return result;
      }

        setTimeout(() => self.setRaglanData(result), 0);
      return result;
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
    updateRaglanData() {
      const result = self.calculateRaglan();
      if (typeof result !== 'string') {
        self.setRaglanData(result);
      }
    },
  }));

const introState = IntroState.create({});
export default introState; 

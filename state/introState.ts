import { types } from "mobx-state-tree";
import { calculateRaglan } from '@/utils/calculateRaglan';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable } from 'mobx';

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
    SFrontO: types.optional(types.number, 0),
    Sa: types.optional(types.number, 0),
    K: types.optional(types.number, 2),
    KV: types.optional(types.number, 2),
    SKfront: types.optional(types.number, 0),
    SKa: types.optional(types.number, 0),
    LFrontO: types.optional(types.number, 0),
    NHFront: types.optional(types.number, 0),
    NRostok: types.optional(types.number, 0),
    SFrontOGr: types.optional(types.number, 0),
    SPodr: types.optional(types.number, 0),
    Sfx: types.optional(types.number, 0),
    prib_1x1: types.optional(types.number, 0),
    prib_1x2: types.optional(types.number, 0),
    prib_1x3: types.optional(types.number, 0),
    PR_1x4: types.optional(types.number, 0),
    PR_1x2: types.optional(types.number, 0),
    PRib_1x4: types.optional(types.number, 0),
    PRib_1x3: types.optional(types.number, 0),

    prib_1x1_f: types.optional(types.number, 0),
    prib_1x2_f: types.optional(types.number, 0),
    prib_1x3_f: types.optional(types.number, 0),
    PR_1x4_f: types.optional(types.number, 0),
    PR_1x2_f: types.optional(types.number, 0),
    PRib_1x4_f: types.optional(types.number, 0),
    PRib_1x3_f: types.optional(types.number, 0),
    usedIncreaseType: types.optional(types.array(types.string), []),
    usedIncreaseTypeString: types.optional(types.string, ''),
    fit: types.optional(types.number, 0),
    ribbingWidth: types.optional(types.number, 2),
    raglanLineWidth: types.optional(types.number, 0),
    raglanLineWidthV: types.optional(types.number, 1),
    depthNeckV: types.optional(types.number, 1),  
    ribbingWidthV: types.optional(types.number, 2),
    RowPrib1x4: types.optional(types.array(types.number), []),
    RowPrib1x3: types.optional(types.array(types.number), []),
    RowPrib1x4String: types.optional(types.string, ''),
    RowPrib1x3String: types.optional(types.string, ''),
    RowPrib1x2: types.optional(types.array(types.number), []),
    RowPrib1x2String: types.optional(types.string, ''),
    RowPrib1x1: types.optional(types.array(types.number), []),
    RowPrib1x1String: types.optional(types.string, ''),
    Ls: types.optional(types.number, 0),
    hs: types.optional(types.number, 0),
    necklineStyle: types.optional(types.enumeration(['round', 'v-neck']), 'round'),
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
    setRaglanData(data) {
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
    setVNeckRibbingWidth(value: string) {
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
          NRrez: self.NRrez,
          LFrontO: self.LFrontO,
          SFrontO: self.SFrontO,
          Sa: self.Sa,
          K: self.K,
          KV: self.KV,
          SKfront: self.SKfront,
          SKa: self.SKa,
          NHFront: self.NHFront,
          NRostok: self.NRostok,
          SFrontOGr: self.SFrontOGr,
          SPodr: self.SPodr,
          Sfx: self.Sfx,
          prib_1x1: self.prib_1x1,
          prib_1x2: self.prib_1x2,
          prib_1x3: self.prib_1x3,
          PR_1x4: self.PR_1x4,
          PR_1x2: self.PR_1x2,
          PRib_1x4: self.PRib_1x4,
          PRib_1x3: self.PRib_1x3,

          prib_1x1_f: self.prib_1x1_f,
          prib_1x2_f: self.prib_1x2_f,
          prib_1x3_f: self.prib_1x3_f,
          PR_1x4_f: self.PR_1x4_f,
          PR_1x2_f: self.PR_1x2_f,
          PRib_1x4_f: self.PRib_1x4_f,
          PRib_1x3_f: self.PRib_1x3_f,
          usedIncreaseType: self.usedIncreaseType,
          usedIncreaseTypeString: self.usedIncreaseTypeString,
          fit: self.fit,
          ribbingWidth: self.ribbingWidth,
          raglanLineWidth: self.raglanLineWidth,
          raglanLineWidthV: self.raglanLineWidthV,
          depthNeckV: self.depthNeckV,
          ribbingWidthV: self.ribbingWidthV,
          RowPrib1x4: self.RowPrib1x4,
          RowPrib1x3: self.RowPrib1x3,
          RowPrib1x4String: self.RowPrib1x4String,
          RowPrib1x3String: self.RowPrib1x3String,
          RowPrib1x2: self.RowPrib1x2,
          RowPrib1x2String: self.RowPrib1x2String,
          RowPrib1x1: self.RowPrib1x1,
          RowPrib1x1String: self.RowPrib1x1String,
          Ls: self.Ls,
          hs: self.hs,
          necklineStyle: self.necklineStyle,
        };
        await AsyncStorage.setItem('introState', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save intro state:', error);
      }
    },
    setPersistedState(state) {
      self.styleChosen = state.styleChosen;
      self.style = state.style;
      self.headCircumference = state.headCircumference;
      self.neckCircumference = state.neckCircumference;
      self.chestCircumference = state.chestCircumference;
      self.stitchDensity = state.stitchDensity;
      self.rowDensity = state.rowDensity;
      self.fitType = state.fitType;
      self.Sgor = state.Sgor;
      self.NRrez = state.NRrez;
      self.SFrontO = state.SFrontO;
      self.LFrontO = state.LFrontO;
      self.Sa = state.Sa;
      self.K = state.K;
      self.KV = state.KV; 
      self.SKfront = state.SKfront;
      self.SKa = state.SKa;
      self.NHFront = state.NHFront;
      self.NRostok = state.NRostok;
      self.SFrontOGr = state.SFrontOGr;
      self.SPodr = state.SPodr;
      self.Sfx = state.Sfx;
      self.prib_1x1 = state.prib_1x1;
      self.prib_1x2 = state.prib_1x2;
      self.prib_1x3 = state.prib_1x3;
      self.PR_1x4 = state.PR_1x4;
      self.PR_1x2 = state.PR_1x2;
      self.PRib_1x4 = state.PRib_1x4; 
      self.PRib_1x3 = state.PRib_1x3;

      self.prib_1x1_f = state.prib_1x1_f;
      self.prib_1x2_f = state.prib_1x2_f;
      self.prib_1x3_f = state.prib_1x3_f;
      self.PR_1x4_f = state.PR_1x4_f;
      self.PR_1x2_f = state.PR_1x2_f; 
      self.PRib_1x4_f = state.PRib_1x4_f;
      self.PRib_1x3_f = state.PRib_1x3_f;
      self.usedIncreaseType = state.usedIncreaseType;
      self.usedIncreaseTypeString = state.usedIncreaseTypeString;
      self.fit = state.fit;
      self.ribbingWidth = state.ribbingWidth;
      self.raglanLineWidth = state.raglanLineWidth;
      self.raglanLineWidthV = state.raglanLineWidthV;
      self.depthNeckV = state.depthNeckV;
      self.ribbingWidthV = state.ribbingWidthV;
      self.RowPrib1x4 = state.RowPrib1x4;
      self.RowPrib1x3 = state.RowPrib1x3;
      self.RowPrib1x4String = state.RowPrib1x4String;
      self.RowPrib1x3String = state.RowPrib1x3String;
      self.RowPrib1x2 = state.RowPrib1x2;
      self.RowPrib1x2String = state.RowPrib1x2String;
      self.RowPrib1x1 = state.RowPrib1x1;
      self.RowPrib1x1String = state.RowPrib1x1String;
      self.Ls = state.Ls;
      self.hs = state.hs;
      self.necklineStyle = state.necklineStyle;
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
        depthNeckV: self.depthNeckV,
        raglanLineWidthV: self.raglanLineWidthV,
        RowPrib1x4: self.RowPrib1x4,
        RowPrib1x4String: self.RowPrib1x4String,
        RowPrib1x3: self.RowPrib1x3,
        RowPrib1x3String: self.RowPrib1x3String,
        RowPrib1x2: self.RowPrib1x2,
        RowPrib1x2String: self.RowPrib1x2String,
        RowPrib1x1: self.RowPrib1x1,
        RowPrib1x1String: self.RowPrib1x1String,
        Ls: self.Ls,
        hs: self.hs,
        SFrontO: self.SFrontO,
        K: self.K,
        KV: self.KV,
        NRrez: self.NRrez,
        Sfx: self.Sfx,
        NHFront: self.NHFront,
        usedIncreaseType: self.usedIncreaseType,
        
      });

      if (typeof result === 'string') {
        return result;
      }

      self.setRaglanData(result);
      return result;
    },
    getNHV() {
      if (self.depthNeckV === undefined) {
        return undefined;
      }
      
      const rowDensity = parseFloat(self.rowDensity.replace(',', '.')) / 10;
      return Math.round(self.depthNeckV * rowDensity);
    },
  }));

const introState = IntroState.create({});
export default introState; 

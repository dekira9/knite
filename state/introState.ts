import { types } from "mobx-state-tree";
import { calculateRaglan } from '@/utils/calculateRaglan';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    SO: types.optional(types.number, 0),
    NRrez: types.optional(types.number, 0),
    SFrontO: types.optional(types.number, 0),
    Sa: types.optional(types.number, 0),
    K: types.optional(types.number, 2),
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
    prib_1x4: types.optional(types.number, 0),
    PR_1X2: types.optional(types.number, 0),
    prib_1x1_f: types.optional(types.number, 0),
    prib_1x2_f: types.optional(types.number, 0),
    prib_1x3_f: types.optional(types.number, 0),
    prib_1x4_f: types.optional(types.number, 0),
    PR_1X2_f: types.optional(types.number, 0),
    usedIncreaseType: types.optional(types.array(types.string), []),
    usedIncreaseTypeString: types.optional(types.string, ''),
    fit: types.optional(types.number, 0),
    ribbingWidth: types.optional(types.number, 2),
    raglanLineWidth: types.optional(types.number, 0),
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
          SO: self.SO,
          NRrez: self.NRrez,
          LFrontO: self.LFrontO,
          SFrontO: self.SFrontO,
          Sa: self.Sa,
          K: self.K,
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
          prib_1x4: self.prib_1x4,
          PR_1X2: self.PR_1X2,
          prib_1x1_f: self.prib_1x1_f,
          prib_1x2_f: self.prib_1x2_f,
          prib_1x3_f: self.prib_1x3_f,
          prib_1x4_f: self.prib_1x4_f,
          PR_1X2_f: self.PR_1X2_f,
          usedIncreaseType: self.usedIncreaseType,
          usedIncreaseTypeString: self.usedIncreaseTypeString,
          fit: self.fit,
          ribbingWidth: self.ribbingWidth,
          raglanLineWidth: self.raglanLineWidth
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
      self.SO = state.SO;
      self.NRrez = state.NRrez;
      self.SFrontO = state.SFrontO;
      self.LFrontO = state.LFrontO;
      self.Sa = state.Sa;
      self.K = state.K;
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
      self.prib_1x4 = state.prib_1x4;
      self.PR_1X2 = state.PR_1X2;
      self.prib_1x1_f = state.prib_1x1_f;
      self.prib_1x2_f = state.prib_1x2_f;
      self.prib_1x3_f = state.prib_1x3_f;
      self.prib_1x4_f = state.prib_1x4_f;
      self.PR_1X2_f = state.PR_1X2_f;
      self.usedIncreaseType = state.usedIncreaseType;
      self.usedIncreaseTypeString = state.usedIncreaseTypeString;
      self.fit = state.fit;
      self.ribbingWidth = state.ribbingWidth;
      self.raglanLineWidth = state.raglanLineWidth;
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
        ribbingWidth: self.ribbingWidth
      });

      if (typeof result === 'string') {
        return result;
      }

      self.setRaglanData(result);
      return result;
    },
  }));

const introState = IntroState.create({});
export default introState; 

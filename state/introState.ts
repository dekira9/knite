import { types } from "mobx-state-tree";

const IntroState = types
  .model({
    style: types.optional(types.string, ''),
    headCircumference: types.optional(types.string, '58'),
    neckCircumference: types.optional(types.string, '36'),
    chestCircumference: types.optional(types.string, '92'),
    stitchDensity: types.optional(types.string, '2.4'),
    rowDensity: types.optional(types.string, '3.2'),
    fitType: types.optional(types.string, 'fitted'),
  })
  .actions((self) => ({
    setStyle(style: string) {
      self.style = style;
    },
    setHeadCircumference(value: string) {
      self.headCircumference = value;
    },
    setNeckCircumference(value: string) {
      self.neckCircumference = value;
    },
    setChestCircumference(value: string) {
      self.chestCircumference = value;
    },
    setStitchDensity(value: string) {
      self.stitchDensity = value;
    },
    setRowDensity(value: string) {
      self.rowDensity = value;
    },
    setFitType(value: string) {
      self.fitType = value;
    },
  }))
  .views((self) => ({
    calculateRaglan() {
      const head = parseFloat(self.headCircumference.replace(',', '.'));
      const neck = parseFloat(self.neckCircumference.replace(',', '.'));
      const chest = parseFloat(self.chestCircumference.replace(',', '.'));
      const stitches = parseFloat(self.stitchDensity.replace(',', '.'));
      const rows = parseFloat(self.rowDensity.replace(',', '.'));

      if (isNaN(head) || isNaN(neck) || isNaN(chest) || isNaN(stitches) || isNaN(rows)) {
        return 'Please enter all values correctly.';
      }

      const K = 2;
      const Hrez = 2;
      const pi = Math.PI;

      const SO = head * pi / K;
      const SFrontO = chest * pi / K;
      const SFrontOGr = SFrontO + 10;
      const NHFront = SFrontOGr / Hrez;
      const prib_1x2_f = 1;
      const prib_1x4_f = 1;
      const prib_1x1_f = 1;
      const prib_1x3_f = 1;

      return {
        SO,
        SFrontO,
        SFrontOGr,
        NHFront,
        prib_1x2_f,
        prib_1x4_f,
        prib_1x1_f,
        prib_1x3_f,
      };
    }
  }));

export default IntroState.create({}); 
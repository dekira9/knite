import { types } from "mobx-state-tree";

const RaglanState = types
  .model({
    SO: types.optional(types.number, 0),
    NRrez: types.optional(types.number, 0),
    SFrontO: types.optional(types.number, 0),
    Sa: types.optional(types.number, 0),
    K: types.optional(types.number, 2),
    SKfront: types.optional(types.number, 0),
    SKa: types.optional(types.number, 0),
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
  })
  .actions((self) => ({
    setRaglanData(data) {
      Object.assign(self, data);
    },
  }));

export default RaglanState.create({}); 
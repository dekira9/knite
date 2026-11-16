import {
  buildRegularIncreaseRowStrings,
  buildVNeckIncreaseRowStrings,
  countSideArrayCells,
  getIncreaseRowsFromType,
  type IncreaseRowStrings,
} from '@/screens/styles/raglan/increaseRowSelection';
import {
  buildCollarIncreaseInput,
  computeStopStitchCount,
  type RibbingVCollarIncreaseInput,
} from '@/screens/styles/raglan/ribbingVParts/calc';
import {
  computeVNeckData,
  getVNeckLeftStitchCount,
  getVNeckRightStitchCount,
  parseVNeckIncreaseRows,
} from '@/screens/styles/raglan/vNeckFrontGridParts/calc';

export type KnitPlanPhaseId =
  | 'neckband'
  | 'raglanIncreases'
  | 'lengthening'
  | 'separateSleeves'
  | 'bodyAndSleeves';

export const KNIT_PLAN_PHASE_TITLE_KEYS: Record<KnitPlanPhaseId, string> = {
  neckband: 'knitPlanPhaseNeckband',
  raglanIncreases: 'knitPlanPhaseRaglanIncreases',
  lengthening: 'knitPlanPhaseLengthening',
  separateSleeves: 'knitPlanPhaseSeparateSleeves',
  bodyAndSleeves: 'knitPlanPhaseBodyAndSleeves',
};

export type KnitPlanSource = {
  version: 1;
  style: 'regular' | 'v-neck';
  selectedIncreaseType: string;
  increaseRows: number[];
  // regular
  NRrez: number;
  SFrontO: number;
  Sa: number;
  K: number;
  NHFront: number;
  Sfx: number;
  NRostok: number;
  SRostok: number;
  SPodr: number;
  SKa: number;
  // v-neck
  NRrezV: number;
  SFrontV: number;
  SaV: number;
  KV: number;
  NHFrontV: number;
  SfxV: number;
  NRostokV: number;
  SRostokV: number;
  SPodrV: number;
  SKaV: number;
  NHV: number;
  SVfront: number;
  resultStringV: string;
  SpribVcorn: number;
  RowPribRV1: number;
  RowPribRV2: number;
  RowPribRV3: number;
  RowPribRVz: number;
  SV: number;
};

export type KnitPlanPhase = {
  id: KnitPlanPhaseId;
  rows: number | null;
};

export type KnitPlan = {
  style: 'regular' | 'v-neck';
  phases: KnitPlanPhase[];
};

export type KnitPlanRowInfo = {
  phaseId: KnitPlanPhaseId;
  row: number;
  isIncreaseRow: boolean;
  rowsToNextIncrease: number | null;
  totalStitchesAfter: number | null;
  parts: { back: number | null; front: number | null; sleeve: number | null } | null;
};

export type KnitPlanCheckpoint = {
  sleeve: number | null;
  underarm: number | null;
  body: number | null;
};

export type KnitPlanIntroInput = {
  introFinished?: boolean;
  style?: string;
  usedIncreaseType?: string[];
  usedIncreaseTypeV?: string[];
  NRrez: number;
  SFrontO: number;
  Sa: number;
  K: number;
  NHFront: number;
  Sfx: number;
  NRostok: number;
  SRostok: number;
  SPodr: number;
  SKa: number;
  PR_1x4_f: number;
  PR_1x2_f: number;
  prib_1x1_f: number;
  prib_1x2_f: number;
  prib_1x3_f: number;
  PRib_1x4_f: number;
  PRib_1x3_f: number;
  NRrezV: number;
  SFrontV: number;
  SaV: number;
  KV: number;
  NHFrontV: number;
  SfxV: number;
  NRostokV?: number;
  SRostokV: number;
  SPodrV: number;
  SKaV: number;
  PR_1x4_fV: number;
  PR_1x2_fV: number;
  prib_1x1_fV: number;
  prib_1x2_fV: number;
  prib_1x3_fV: number;
  PRib_1x4_fV: number;
  PRib_1x3_fV: number;
  NHV: number;
  SVfront: number;
  resultStringV: string;
  SpribVcorn: number;
  RowPribRV1: number;
  RowPribRV2: number;
  RowPribRV3: number;
  RowPribRVz: number;
  SV: number;
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function readStyle(style: string | undefined): 'regular' | 'v-neck' | null {
  if (style === 'v-neck' || style === 'regular') {
    return style;
  }
  return null;
}

function buildIncreaseStrings(
  style: 'regular' | 'v-neck',
  intro: KnitPlanIntroInput,
): IncreaseRowStrings {
  const nhFront = style === 'v-neck' ? intro.NHFrontV : intro.NHFront;
  const sfx = style === 'v-neck' ? intro.SfxV : intro.Sfx;
  const input = {
    nhFront,
    sfx,
    pr1x4_f: style === 'v-neck' ? intro.PR_1x4_fV : intro.PR_1x4_f,
    pr1x2_f: style === 'v-neck' ? intro.PR_1x2_fV : intro.PR_1x2_f,
    prib1x1_f: style === 'v-neck' ? intro.prib_1x1_fV : intro.prib_1x1_f,
    prib1x2_f: style === 'v-neck' ? intro.prib_1x2_fV : intro.prib_1x2_f,
    prib1x3_f: style === 'v-neck' ? intro.prib_1x3_fV : intro.prib_1x3_f,
    prib1x4_f: style === 'v-neck' ? intro.PRib_1x4_fV : intro.PRib_1x4_f,
    prib1x3_rib_f: style === 'v-neck' ? intro.PRib_1x3_fV : intro.PRib_1x3_f,
  };
  return style === 'v-neck'
    ? buildVNeckIncreaseRowStrings(input)
    : buildRegularIncreaseRowStrings(input);
}

function requiredCoreValid(intro: KnitPlanIntroInput, style: 'regular' | 'v-neck'): boolean {
  if (style === 'regular') {
    return (
      isFiniteNumber(intro.NRrez) &&
      intro.NRrez > 0 &&
      isFiniteNumber(intro.NHFront) &&
      intro.NHFront > 0 &&
      isFiniteNumber(intro.SFrontO) &&
      isFiniteNumber(intro.Sa) &&
      isFiniteNumber(intro.K) &&
      isFiniteNumber(intro.SRostok)
    );
  }
  return (
    isFiniteNumber(intro.NRrezV) &&
    intro.NRrezV > 0 &&
    isFiniteNumber(intro.NHFrontV) &&
    intro.NHFrontV > 0 &&
    isFiniteNumber(intro.SFrontV) &&
    isFiniteNumber(intro.SaV) &&
    isFiniteNumber(intro.KV) &&
    isFiniteNumber(intro.SRostokV)
  ) &&
    isFiniteNumber(intro.NRostokV ?? intro.NRostok);
}

export function buildKnitPlanSource(intro: KnitPlanIntroInput): KnitPlanSource | null {
  if (!intro.introFinished) {
    return null;
  }
  const style = readStyle(intro.style);
  if (!style || !requiredCoreValid(intro, style)) {
    return null;
  }

  const usedTypes =
    style === 'v-neck' ? intro.usedIncreaseTypeV : intro.usedIncreaseType;
  const selectedIncreaseType =
    Array.isArray(usedTypes) && usedTypes.length > 0 ? usedTypes[0] : '';
  if (!selectedIncreaseType) {
    return null;
  }

  const strings = buildIncreaseStrings(style, intro);
  const increaseRows = getIncreaseRowsFromType(
    selectedIncreaseType,
    strings,
    style === 'v-neck' ? { nullable: true } : undefined,
  );

  return {
    version: 1,
    style,
    selectedIncreaseType,
    increaseRows,
    NRrez: Number(intro.NRrez),
    SFrontO: Number(intro.SFrontO),
    Sa: Number(intro.Sa),
    K: Number(intro.K),
    NHFront: Number(intro.NHFront),
    Sfx: Number(intro.Sfx),
    NRostok: Number(intro.NRostok),
    SRostok: Number(intro.SRostok),
    SPodr: Number(intro.SPodr),
    SKa: Number(intro.SKa),
    NRrezV: Number(intro.NRrezV),
    SFrontV: Number(intro.SFrontV),
    SaV: Number(intro.SaV),
    KV: Number(intro.KV),
    NHFrontV: Number(intro.NHFrontV),
    SfxV: Number(intro.SfxV),
    NRostokV: Number(intro.NRostokV ?? intro.NRostok),
    SRostokV: Number(intro.SRostokV),
    SPodrV: Number(intro.SPodrV),
    SKaV: Number(intro.SKaV),
    NHV: Number(intro.NHV),
    SVfront: Number(intro.SVfront),
    resultStringV: intro.resultStringV ?? '',
    SpribVcorn: Number(intro.SpribVcorn),
    RowPribRV1: Number(intro.RowPribRV1),
    RowPribRV2: Number(intro.RowPribRV2),
    RowPribRV3: Number(intro.RowPribRV3),
    RowPribRVz: Number(intro.RowPribRVz),
    SV: Number(intro.SV),
  };
}

function neckbandRows(source: KnitPlanSource): number {
  return source.style === 'v-neck' ? source.NRrezV : source.NRrez;
}

function nhFront(source: KnitPlanSource): number {
  return source.style === 'v-neck' ? source.NHFrontV : source.NHFront;
}

function lengtheningRows(source: KnitPlanSource): number {
  const n = source.style === 'v-neck' ? source.NRostokV : source.NRostok;
  return isFiniteNumber(n) && n > 0 ? n : 0;
}

export function buildKnitPlan(source: KnitPlanSource): KnitPlan {
  const phases: KnitPlanPhase[] = [
    { id: 'neckband', rows: neckbandRows(source) },
    { id: 'raglanIncreases', rows: nhFront(source) },
  ];
  const lengthen = lengtheningRows(source);
  if (lengthen > 0) {
    phases.push({ id: 'lengthening', rows: lengthen });
  }
  phases.push({ id: 'separateSleeves', rows: 0 });
  phases.push({ id: 'bodyAndSleeves', rows: null });
  return { style: source.style, phases };
}

function nextIncreaseDistance(
  increaseRows: number[],
  row: number,
  maxRow: number,
): number | null {
  for (const incRow of increaseRows) {
    if (incRow > row && incRow <= maxRow) {
      return incRow - row;
    }
  }
  return null;
}

function vNeckCollarInput(source: KnitPlanSource): RibbingVCollarIncreaseInput | null {
  if (!source.SpribVcorn) {
    return null;
  }
  return buildCollarIncreaseInput({
    NRrezV: source.NRrezV,
    SpribVcorn: source.SpribVcorn,
    RowPribRV1: source.RowPribRV1,
    RowPribRV2: source.RowPribRV2,
    RowPribRV3: source.RowPribRV3,
    RowPribRVz: source.RowPribRVz,
    SV: source.SV,
  });
}

function regularPartCounts(
  source: KnitPlanSource,
  highlightedRow: number,
): { back: number; front: number; sleeve: number; total: number } {
  const cells = countSideArrayCells(
    source.increaseRows,
    source.NHFront,
    highlightedRow,
  );
  const back = source.SFrontO + 2 * cells;
  const front = source.SFrontO + 2 * cells;
  const sleeve = source.Sa + 2 * cells;
  const total = source.K * 4 + back + front + 2 * sleeve;
  return { back, front, sleeve, total };
}

function vNeckPartCounts(
  source: KnitPlanSource,
  highlightedRow: number,
):
  | { back: number; front: number; sleeve: number; total: number }
  | null {
  const vNeckIncreaseRows = parseVNeckIncreaseRows(source.resultStringV);
  const vNeckData = computeVNeckData({
    nhFrontV: source.NHFrontV,
    nhv: source.NHV,
    svFront: source.SVfront,
    sFrontV: source.SFrontV,
    increaseRows: vNeckIncreaseRows,
  });
  const leftCells = countSideArrayCells(
    source.increaseRows,
    source.NHFrontV,
    highlightedRow,
  );
  const rightCells = leftCells;
  const leftV = getVNeckLeftStitchCount(vNeckData, source.NHFrontV, highlightedRow);
  const rightV = getVNeckRightStitchCount(vNeckData, source.NHFrontV, highlightedRow);
  const back = source.SFrontV + leftCells + rightCells;
  const front = leftCells + rightCells + leftV + rightV;
  const sleeve = source.SaV + leftCells + rightCells;
  const total = source.KV * 4 + back + front + 2 * sleeve;
  return { back, front, sleeve, total };
}

export function getKnitPlanRowInfo(
  source: KnitPlanSource,
  phaseIndex: number,
  row: number,
): KnitPlanRowInfo {
  const plan = buildKnitPlan(source);
  const phase = plan.phases[phaseIndex];
  if (!phase) {
    return {
      phaseId: 'neckband',
      row,
      isIncreaseRow: false,
      rowsToNextIncrease: null,
      totalStitchesAfter: null,
      parts: null,
    };
  }

  const base: KnitPlanRowInfo = {
    phaseId: phase.id,
    row,
    isIncreaseRow: false,
    rowsToNextIncrease: null,
    totalStitchesAfter: null,
    parts: null,
  };

  if (phase.id === 'neckband') {
    base.totalStitchesAfter = getNeckbandStitches(source, row);
    return base;
  }

  if (phase.id === 'raglanIncreases') {
    const maxRow = nhFront(source);
    const highlightedRow = Math.max(0, row - 1);
    base.isIncreaseRow = source.increaseRows.includes(row);
    base.rowsToNextIncrease = nextIncreaseDistance(
      source.increaseRows,
      row,
      maxRow,
    );
    if (row >= 1 && row <= maxRow) {
      if (source.style === 'regular') {
        const counts = regularPartCounts(source, highlightedRow);
        base.parts = {
          back: counts.back,
          front: counts.front,
          sleeve: counts.sleeve,
        };
        base.totalStitchesAfter = counts.total;
      } else {
        const counts = vNeckPartCounts(source, highlightedRow);
        if (counts) {
          base.parts = {
            back: counts.back,
            front: counts.front,
            sleeve: counts.sleeve,
          };
          base.totalStitchesAfter = counts.total;
        }
      }
    }
    return base;
  }

  if (phase.id === 'lengthening') {
    return base;
  }

  return base;
}

export function getKnitPlanCheckpoint(source: KnitPlanSource): KnitPlanCheckpoint {
  if (source.style === 'v-neck') {
    const sfx = source.SfxV;
    const sleeve =
      Number.isFinite(source.SaV) &&
      Number.isFinite(sfx) &&
      Number.isFinite(source.SKaV)
        ? source.SaV + 2 * sfx + 2 * source.SKaV
        : null;
    return {
      sleeve,
      underarm: Number.isFinite(source.SPodrV) ? source.SPodrV : null,
      body: Number.isFinite(source.SRostokV) ? source.SRostokV : null,
    };
  }
  const sfx = source.Sfx;
  const sleeve =
    Number.isFinite(source.Sa) &&
    Number.isFinite(sfx) &&
    Number.isFinite(source.SKa)
      ? source.Sa + 2 * sfx + 2 * source.SKa
      : null;
  return {
    sleeve,
    underarm: Number.isFinite(source.SPodr) ? source.SPodr : null,
    body: Number.isFinite(source.SRostok) ? source.SRostok : null,
  };
}

export function getNeckbandStitches(
  source: KnitPlanSource,
  rowAboutToKnit = 1,
): number | null {
  if (source.style === 'regular') {
    return source.K * 4 + 2 * source.SFrontO + 2 * source.Sa;
  }
  const collarInput = vNeckCollarInput(source);
  if (!collarInput) {
    return null;
  }
  const highlightedRow = Math.max(0, rowAboutToKnit - 1);
  return computeStopStitchCount(
    source.KV,
    source.SFrontV,
    source.SaV,
    highlightedRow,
    collarInput,
  );
}

export function getPhaseRowLimit(
  source: KnitPlanSource,
  phaseIndex: number,
): number | null {
  const plan = buildKnitPlan(source);
  const phase = plan.phases[phaseIndex];
  return phase ? phase.rows : null;
}

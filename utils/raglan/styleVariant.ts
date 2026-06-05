import { computeLgor, computeSgor } from './neckCastOn';
import { buildRowPribBundle } from './rowPrib';
import {
  detectUsedIncreaseTypes,
  formatUsedIncreaseTypes,
  type FrontIncreaseCounts,
} from './usedIncreaseTypes';

export interface StyleVariantParams {
  head: number;
  neck: number;
  chest: number;
  stitches: number;
  rows: number;
  Hrez: number;
  K: number;
  fit: number;
  SFit: number;
  SOgr: number;
  SPodr: number;
  /** V-neck ribbing row count is rounded to an even number */
  evenRibbingRows?: boolean;
}

export interface StyleVariantResult {
  Lgor: number;
  NRrez: number;
  Sgor: number;
  SFront: number;
  Sa: number;
  LFront: number;
  SKfront: number;
  SKa: number;
  SFrontGr: number;
  Sfx: number;
  NRfx: number;
  NHFront: number;
  prib_1x1: number;
  prib_1x2: number;
  prib_1x3: number;
  PR_1x4: number;
  PR_1x2: number;
  PRib_1x4: number;
  PRib_1x3: number;
  prib_1x1_f: number;
  prib_1x2_f: number;
  prib_1x3_f: number;
  PR_1x4_f: number;
  PR_1x2_f: number;
  PRib_1x4_f: number;
  PRib_1x3_f: number;
  usedIncreaseType: string[];
  usedIncreaseTypeString: string;
  SRostok: number;
  rowPrib: ReturnType<typeof buildRowPribBundle>;
}

function computeFrontIncreaseCounts(NHFront: number, Sfx: number) {
  const prib_1x1 = (NHFront - 2 * Sfx) < 0 ? (2 * Sfx - NHFront) : 0;
  const prib_1x3 = Math.floor(NHFront / Sfx) === 2 ? 3 * (NHFront - 2 * Sfx) : 0;
  const prib_1x2 = NHFront - prib_1x1 - prib_1x3;
  const PR_1x4 = NHFront > 2 * Sfx ? 4 * (NHFront / 2 - Sfx) : 0;
  const PR_1x2 = NHFront > 2 * Sfx ? (NHFront - PR_1x4) : 0;
  const PRib_1x4 = Math.floor(NHFront / Sfx) === 3 ? 4 * (NHFront - 3 * Sfx) : 0;
  const PRib_1x3 = Math.floor(NHFront / Sfx) === 3 ? NHFront - PRib_1x4 : 0;

  const prib_1x1_f = (NHFront - 2 * Sfx) < 0 ? (2 * Sfx - NHFront) : 0;
  const prib_1x3_f = NHFront > 2 * Sfx ? NHFront - 2 * Sfx : 0;
  const prib_1x2_f = prib_1x2 !== 0 ? (NHFront - prib_1x1 - prib_1x3) / 2 : 0;
  const PR_1x4_f = NHFront > 2 * Sfx ? NHFront / 2 - Sfx : 0;
  const PR_1x2_f = prib_1x2 !== 0 ? (NHFront - prib_1x1 - PR_1x4) / 2 : 0;
  const PRib_1x4_f = Math.floor(NHFront / Sfx) === 3 ? NHFront - 3 * Sfx : 0;
  const PRib_1x3_f = Math.floor(NHFront / Sfx) === 3 ? PRib_1x3 / 3 : 0;

  return {
    prib_1x1,
    prib_1x2,
    prib_1x3,
    PR_1x4,
    PR_1x2,
    PRib_1x4,
    PRib_1x3,
    prib_1x1_f,
    prib_1x2_f,
    prib_1x3_f,
    PR_1x4_f,
    PR_1x2_f,
    PRib_1x4_f,
    PRib_1x3_f,
  };
}

export function computeStyleVariant(params: StyleVariantParams): StyleVariantResult {
  const { head, neck, chest, stitches, rows, Hrez, K, fit, SFit, SOgr, SPodr } = params;

  const Lgor = computeLgor(head, neck, Hrez);
  const LFront = ((Lgor - (4 * K) / stitches) / 8) * 3;

  const NRrez = params.evenRibbingRows
    ? Math.round((Hrez * rows) / 2) * 2
    : Math.round(Hrez * rows);

  const Sgor = computeSgor(Lgor, stitches);
  const SFront = Math.round(((Sgor - 4 * K) / 8) * 3 / 2) * 2;

  const LKfront =
    K / 2 - Math.floor(K / 2) === 0 ? K / (2 * stitches) : (K / 2 + 1 / 2) / stitches;
  const SKfront = Math.round(LKfront * stitches);
  const SFrontGr = Math.round((SOgr - 4 * SKfront - 2 * SPodr + SFit) / 4) * 2;
  const Sfx = Math.round((SFrontGr - SFront) / 2);
  const NRfx = Sfx * 2;

  const SKa = K - SKfront;
  const Sa = (Sgor - 2 * SFront - 4 * K) / 2;

  const Projma = (chest + fit) / 6 + 5;
  const HFront_sm = Projma - Hrez;
  const NHFront = Math.round((HFront_sm * rows) / 2) * 2;

  const increases = computeFrontIncreaseCounts(NHFront, Sfx);
  const increaseCounts: FrontIncreaseCounts = {
    Sfx,
    prib_1x1_f: increases.prib_1x1_f,
    prib_1x2_f: increases.prib_1x2_f,
    prib_1x3_f: increases.prib_1x3_f,
    PR_1x4_f: increases.PR_1x4_f,
    PR_1x2_f: increases.PR_1x2_f,
    PRib_1x4_f: increases.PRib_1x4_f,
    PRib_1x3_f: increases.PRib_1x3_f,
  };

  const usedIncreaseType = detectUsedIncreaseTypes(increaseCounts);
  const usedIncreaseTypeString = formatUsedIncreaseTypes(usedIncreaseType);
  const SRostok = SFront + 2 * Sfx + 2 * SKfront;

  return {
    Lgor,
    NRrez,
    Sgor,
    SFront,
    Sa,
    LFront,
    SKfront,
    SKa,
    SFrontGr,
    Sfx,
    NRfx,
    NHFront,
    ...increases,
    usedIncreaseType,
    usedIncreaseTypeString,
    SRostok,
    rowPrib: buildRowPribBundle(Sfx),
  };
}

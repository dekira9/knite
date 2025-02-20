import introState from "@/state/introState";

interface RaglanInput {
  headCircumference: string;
  neckCircumference: string;
  chestCircumference: string;
  stitchDensity: string;
  rowDensity: string;
  fitType: string;
  ribbingWidth: string;
}

interface RaglanOutput {
  Sgor: number;
  NRrez: number;
  SFrontO: number;
  Sa: number;
  K: number;
  SKfront: number;
  SKa: number;
  NHFront: number;
  NRostok: number;
  SFrontOGr: number;
  SPodr: number;
  Sfx: number;
  prib_1x1: number;
  prib_1x2: number;
  prib_1x3: number;
  prib_1x4: number;
  PR_1X2: number;
  prib_1x1_f: number;
  prib_1x2_f: number;
  prib_1x3_f: number;
  prib_1x4_f: number;
  PR_1X2_f: number;
  usedIncreaseType: string[];
  usedIncreaseTypeString: string;
  fit: number;
  SFit: number;
  SOgr: number;
  SPodr: number;
  SRostok: number;
}

export function calculateRaglan({
  headCircumference,
  neckCircumference,
  chestCircumference,
  stitchDensity,
  rowDensity,
  fitType,
  ribbingWidth,
}: RaglanInput): RaglanOutput | string {
  const head = parseFloat(headCircumference.replace(',', '.'));
  const neck = parseFloat(neckCircumference.replace(',', '.'));
  const chest = parseFloat(chestCircumference.replace(',', '.'));
  const stitches = parseFloat(stitchDensity.replace(',', '.'))/10;
  const rows = parseFloat(rowDensity.replace(',', '.'))/10;
  const ribbing = parseFloat(ribbingWidth);

  if (isNaN(head) || isNaN(neck) || isNaN(chest) || isNaN(stitches) || isNaN(rows)) {
    return 'Please enter all values correctly.';
  }

  const K = introState.raglanLineWidth; // Используем ширину регланной линии из introState
  const Hrez = ribbing; // ширина резинки в см
  const pi = Math.PI;

  const dr = (head - neck) / (2 * pi);
  const Lgor = Hrez <= dr ? (head - pi * Hrez) : (neck +  pi * Hrez) ;
  const LFrontO = (Lgor - 4 * K / stitches) / 8 * 3;
  const LO_p = Math.round(Lgor * stitches) / stitches;
  const LFrontO_p = Math.round(LFrontO * stitches) / stitches;

  const NRrez = Math.round(Hrez * rows);
  const Sgor = Math.round((Lgor * stitches) / 2) * 2;
  const SFrontO = Math.round(((Sgor - 4 * K) / 8 * 3) / 2) * 2;

  let fit = 0; // Default to "Slim-fit"
  switch (fitType) {
    case 'semi-fitted':
      fit = Math.round(2 * stitches) / stitches; // NORM
      break;
    case 'loose':
      fit = Math.round(6 * stitches) / stitches; // FREE
      break;
    case 'oversized':
      fit = Math.round(10 * stitches) / stitches; // SUPER FREE
      break;
    default:
      fit = 0; // Slim-fit
  }

  const SFit = Math.round(fit * stitches);
  const SOgr = Math.round(chest * stitches / 2) * 2;
  const SPodr = Math.round((SOgr * 0.08) / 2) * 2;
  const LKfront = (K / 2 - Math.floor(K / 2)) === 0 ? K / (2 * stitches) : ((K / 2) + 1 / 2) / stitches;
  const SKfront = Math.round(LKfront * stitches); // Move SKfront calculation earlier
  const SFrontOGr = Math.round((SOgr - 4 * SKfront - 2 * SPodr + SFit) / 4) * 2;

  const Sfx = Math.round((SFrontOGr - SFrontO) / 2);
  const NRfx = Sfx * 2;
  const Lfx = Sfx / stitches;
  const LRfx = NRfx / rows;

  
  
  const SKa = K - SKfront;
  
  const Rostok = neck / 6 - 1;
  const NRostok = Math.round((Rostok * rows) / 2) * 2;

  const Sa = (Sgor - 2 * SFrontO - 4 * K) / 2;
  const LKa= K / stitches - LKfront;
  const La = Sa / stitches;
  const LK = K / stitches;
  const Ls = 1 / stitches;
  const hs = 1 / rows;

  const Projma = (chest + fit) / 6 + 5;
  const HFront_sm = Projma - Hrez;
  const NHFront = Math.round((HFront_sm * rows) / 2) * 2;

  const prib_1x1 = (NHFront - 2 * Sfx) < 0 ? (2 * Sfx - NHFront) : 0;
  const prib_1x3 = NHFront > 2 * Sfx ? 3 * (NHFront - 2 * Sfx) : 0;
  const prib_1x2 = NHFront - prib_1x1 - prib_1x3;
  const prib_1x4 = NHFront > 2 * Sfx ? 4 * (NHFront / 2 - Sfx) : 0;
  const PR_1X2 = NHFront - prib_1x1 - prib_1x4;

  const prib_1x1_f = (NHFront - 2 * Sfx) < 0 ? (2 * Sfx - NHFront) : 0;
  const prib_1x3_f = NHFront > 2 * Sfx ? (NHFront - 2 * Sfx) : 0;
  const prib_1x2_f = prib_1x2 !== 0 ? (NHFront - prib_1x1 - prib_1x3)/2 : 0;
  const prib_1x4_f = NHFront > 2 * Sfx ? (NHFront / 2 - Sfx) : 0;
  const PR_1X2_f = prib_1x2 !== 0 ? (NHFront - prib_1x1 - prib_1x4)/2 : 0;

  const usedIncreaseType: string[] = [];

  if (PR_1X2_f > 0 && prib_1x4_f > 0 && PR_1X2_f + prib_1x4_f === Sfx) {
    usedIncreaseType.push('1x2, 1x4');
  }
  if (PR_1X2_f > 0 && prib_1x4_f > 0 && prib_1x1_f > 0 && PR_1X2_f + prib_1x4_f + prib_1x1_f === Sfx) {
    usedIncreaseType.push('1x2, 1x4, 1x1');
  }
  if (PR_1X2_f > 0 && prib_1x1_f > 0 && PR_1X2_f + prib_1x1_f === Sfx) {
    usedIncreaseType.push('1x2, 1x1');
  }
  if (prib_1x4_f > 0 && prib_1x1_f > 0 && prib_1x4_f + prib_1x1_f === Sfx) {
    usedIncreaseType.push('1x4, 1x1');
  }
  if (prib_1x2_f > 0 && prib_1x3_f > 0 && prib_1x2_f + prib_1x3_f === Sfx) {
    usedIncreaseType.push('1x2, 1x3');
  }
  if (prib_1x3_f > 0 && prib_1x1_f > 0 && prib_1x3_f + prib_1x1_f === Sfx) {
    usedIncreaseType.push('1x3, 1x1');
  }
  if (prib_1x2_f > 0 && prib_1x3_f > 0 && prib_1x1_f > 0 && prib_1x2_f + prib_1x3_f + prib_1x1_f === Sfx) {
    usedIncreaseType.push('1x2, 1x3, 1x1');
  }
  if (prib_1x2_f > 0 && prib_1x2_f === Sfx) {
    usedIncreaseType.push('1x2');
  }
  if (prib_1x4_f > 0 && prib_1x4_f === Sfx) {
    usedIncreaseType.push('1x4');
  }
  if (prib_1x3_f > 0 && prib_1x3_f === Sfx) {
    usedIncreaseType.push('1x3');
  }
  if (prib_1x1_f > 0 && prib_1x1_f === Sfx) {
    usedIncreaseType.push('1x1');
  }

  const usedIncreaseTypeString = usedIncreaseType.length > 0 ? usedIncreaseType.join(' | ') : 'Нет подходящего типа прибавок';

  const SRostok = SFrontO + 2 * Sfx + 2 * SKfront;

  return {
    Sgor,
    NRrez,
    SFrontO,
    Sa,
    K,
    LFrontO,
    SKfront,
    SKa,
    NHFront,
    NRostok,
    SFrontOGr,
    SPodr,
    Sfx,
    prib_1x1,
    prib_1x2,
    prib_1x3,
    prib_1x4,
    PR_1X2,
    prib_1x1_f,
    prib_1x2_f,
    prib_1x3_f,
    prib_1x4_f,
    PR_1X2_f,
    usedIncreaseType,
    usedIncreaseTypeString,
    fit,
    SFit,
    SOgr,
    SPodr,
    stitches,
    SRostok,
  };
} 
import introState from "@/state/introState";

interface RaglanInput {
  headCircumference: string;
  neckCircumference: string;
  chestCircumference: string;
  stitchDensity: string;
  rowDensity: string;
  fitType: string;
  ribbingWidth: string;
  ribbingWidthV: string;
  resultString24: string;
  raglanLineWidthV?: number;
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
  fit: number;
  SFit: number;
  SOgr: number;
  SPodr: number;
  SRostok: number;
  NHVmax: number;
  LHVmax: number;
  LKmaxV: number;
  KmaxV: number;
  LHVmin: number;
  NHVmin: number;
  LHV: number;
  NHV: number;
  KV: number;
}

export function calculateRaglan({
  headCircumference,
  neckCircumference,
  chestCircumference,
  stitchDensity,
  rowDensity,
  fitType,
  ribbingWidth,
  ribbingWidthV,
  raglanLineWidthV,
}: RaglanInput): RaglanOutput | string {
  const head = parseFloat(headCircumference.replace(',', '.'));
  const neck = parseFloat(neckCircumference.replace(',', '.'));
  const chest = parseFloat(chestCircumference.replace(',', '.'));
  const stitches = parseFloat(stitchDensity.replace(',', '.'))/10;
  const rows = parseFloat(rowDensity.replace(',', '.'))/10;
  const ribbing = parseFloat(ribbingWidth);
  const VNeckRibbing = parseFloat(ribbingWidthV);
  

  if (isNaN(head) || isNaN(neck) || isNaN(chest) || isNaN(stitches) || isNaN(rows)) {
    return 'Please enter all values correctly.';
  }

  const K = introState.raglanLineWidth; // Используем ширину регланной линии из introState
  const KV = raglanLineWidthV !== undefined ? raglanLineWidthV : 2; // Значение по умолчанию 2
  const Hrez = ribbing; // ширина резинки в см
  const HrezV = VNeckRibbing; // ширина резинки в см  

  const pi = Math.PI;
console.log('HrezV', HrezV);
  const dr = (head - neck) / (2 * pi);
  console.log('head', head);
  const Lgor = Hrez <= dr ? (head - pi * Hrez) : (neck +  pi * Hrez) ;
  const LgorV = HrezV <= dr ? (head - pi * HrezV) : (neck +  pi * HrezV) ;
  const LFrontO = (Lgor - 4 * K / stitches) / 8 * 3;
  const LFrontV = (LgorV - 4 * KV / stitches) / 8 * 3;
  const LO_p = Math.round(Lgor * stitches) / stitches;
  const LFrontO_p = Math.round(LFrontO * stitches) / stitches;

  const NRrez = Math.round(Hrez * rows);
  const NRrezV = Math.round(HrezV * rows);
  const Sgor = Math.round((Lgor * stitches) / 2) * 2;   
  const SgorV = Math.round((LgorV * stitches) / 2) * 2;
  const SFrontO = Math.round(((Sgor - 4 * K) / 8 * 3) / 2) * 2;
  const SFrontOV = Math.round(((SgorV - 4 * KV) / 8 * 3) / 2) * 2;  

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

  const SFit = Math.round(fit * stitches/2)*2;
  const SOgr = Math.round(chest * stitches / 2) * 2;
  const SPodr = Math.round((SOgr * 0.08) / 2) * 2;
  const LKfront = (K / 2 - Math.floor(K / 2)) === 0 ? K / (2 * stitches) : ((K / 2) + 1 / 2) / stitches;
  const LKfrontV = (KV / 2 - Math.floor(KV / 2)) === 0 ? KV / (2 * stitches) : ((KV / 2) + 1 / 2) / stitches;
  const SKfront = Math.round(LKfront * stitches); // Move SKfront calculation earlier
  const SKfrontV = Math.round(LKfrontV * stitches); // Move SKfront calculation earlier
  const SFrontOGr = Math.round((SOgr - 4 * SKfront - 2 * SPodr + SFit) / 4) * 2;
  const SFrontOGrV = Math.round((SOgr - 4 * SKfrontV - 2 * SPodr + SFit) / 4) * 2;
  
  const Sfx = Math.round((SFrontOGr - SFrontO) / 2);
  const SfxV = Math.round((SFrontOGrV - SFrontOV) / 2);
  const NRfx = Sfx * 2;
  const NRfxV = SfxV * 2;
  const Lfx = Sfx / stitches;
  const LRfx = NRfx / rows;
  const LfxV = SfxV / stitches;
  const LRfxV = NRfxV / rows;
  
  const SKa = K - SKfront;
  const SKaV = KV - SKfrontV;
  
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
  const HFront_smV = Projma - HrezV;
  const NHFront = Math.round((HFront_sm * rows) / 2) * 2;
  const NHFrontV = Math.round((HFront_smV * rows) / 2) * 2;
  const prib_1x1 = (NHFront - 2 * Sfx) < 0 ? (2 * Sfx - NHFront) : 0;
  const prib_1x3 = Math.floor(NHFront / Sfx) === 2 ? 3 * (NHFront - 2 * Sfx) : 0;
  const prib_1x2 = NHFront - prib_1x1 - prib_1x3;
  const PR_1x4 = NHFront > 2 * Sfx ? 4 * (NHFront / 2 - Sfx) : 0;
  const PR_1x2 = NHFront > 2 * Sfx ? (NHFront - PR_1x4) : 0;
  const PRib_1x4 = Math.floor(NHFront / Sfx) === 3 ? 4 * ( NHFront - 3 * Sfx ) : 0 ;
  const PRib_1x3 = Math.floor(NHFront / Sfx) === 3 ? ( NHFront - PRib_1x4  ) : 0 ;

  const prib_1x1_f = (NHFront - 2 * Sfx) < 0 ? (2 * Sfx - NHFront) : 0;
  const prib_1x3_f = NHFront > 2 * Sfx ? (NHFront - 2 * Sfx) : 0;
  const prib_1x2_f = prib_1x2 !== 0 ? (NHFront - prib_1x1 - prib_1x3)/2 : 0;
  const PR_1x4_f = NHFront > 2 * Sfx ? (NHFront / 2 - Sfx) : 0;
  const PR_1x2_f = prib_1x2 !== 0 ? (NHFront - prib_1x1 - PR_1x4)/2 : 0;
  const PRib_1x4_f = Math.floor(NHFront / Sfx) === 3 ? ( NHFront - 3 * Sfx ) : 0 ;
  const PRib_1x3_f = Math.floor(NHFront / Sfx) === 3 ? ( PRib_1x3/3) : 0 ;
  const RowPrib1x4 = Array.from({ length: Sfx }, (_, index) => 1 + index * 4);
  const RowPrib1x4String = RowPrib1x4.join(', ');
  const RowPrib1x3 = Array.from({ length: Sfx }, (_, index) => 1 + index * 3);
  const RowPrib1x3String = RowPrib1x3.join(', '); 
  const RowPrib1x2 = Array.from({ length: Sfx }, (_, index) => 1 + index * 2);
  const RowPrib1x2String = RowPrib1x2.join(', ');
  const RowPrib1x1 = Array.from({ length: Sfx }, (_, index) => 1 + index * 1);
  const RowPrib1x1String = RowPrib1x1.join(', ');

  
  const usedIncreaseType: string[] = [];

  if (PR_1x2_f > 0 && PR_1x4_f > 0 && PR_1x2_f + PR_1x4_f === Sfx) {
    usedIncreaseType.push('1x2, 1x4');
  }
  if (PRib_1x3_f > 0 && PRib_1x4_f > 0 && PRib_1x3_f + PRib_1x4_f === Sfx) {
    usedIncreaseType.push('1x3, 1x4');
  }
  if (PR_1x2_f > 0 && PR_1x4_f > 0 && prib_1x1_f > 0 && PR_1x2_f + PR_1x4_f + prib_1x1_f === Sfx) {
    usedIncreaseType.push('1x2, 1x4, 1x1');
  }
  if (PR_1x2_f > 0 && prib_1x1_f > 0 && PR_1x2_f + prib_1x1_f === Sfx) {
    usedIncreaseType.push('1x2, 1x1');
  }
  if (PR_1x4_f > 0 && prib_1x1_f > 0 && PR_1x4_f + prib_1x1_f === Sfx) {
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
  if (PR_1x4_f > 0 && PR_1x4_f === Sfx) {
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

  // Добавляем новые формулы для V-образного выреза
  
  // Формула для LHVmin
  const LHVmin = 2 * HrezV * LFrontV ** 2 / (LFrontV ** 2 - 4 * HrezV ** 2);
  
  // Формула для NHVmin
  const NHVmin = Math.round((LHVmin * rows) / 2) * 2;
  
  // Существующие формулы для V-образного выреза
  const NHVmax = NHFrontV - 2;
  const LHVmax = NHVmax / rows;
  
  // Формула для LKmaxV
  const LKmaxV = (LgorV - Math.sqrt(256 * (NHFrontV - 2)/rows * HrezV ** 2 / (9 * (NHFrontV - 2)/rows - 18 * HrezV))) / 4;
  console.log('LKmaxV', LKmaxV);
  console.log('Lgor', Lgor);
  
  // Формула для KmaxV с использованием условий
  let KmaxV;
  if (LKmaxV * stitches < 1) {
    KmaxV = 1;
  } else if (LKmaxV * stitches > Sgor / 8) {
    KmaxV = Math.floor(Sgor / 8);
  } else {
    KmaxV = Math.floor(LKmaxV * stitches);
  }

  // Получаем значение depthNeckV из параметров или из introState
  const LHV = introState.depthNeckV !== undefined ? introState.depthNeckV : LHVmin;
  
  // Рассчитываем NHV на основе LHV
  const NHV = Math.round(LHV * rows);

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
    usedIncreaseType,
    usedIncreaseTypeString,
    fit,
    SFit,
    SOgr,
    SPodr,
    stitches,
    SRostok,
    RowPrib1x4,
    RowPrib1x4String,
    RowPrib1x3,
    RowPrib1x3String,
    RowPrib1x2,
    RowPrib1x2String,
    RowPrib1x1,
    RowPrib1x1String,
    NHVmax,
    LHVmax,
    LKmaxV,
    KmaxV,
    LHVmin,
    NHVmin,
    LHV,
    NHV,
    KV
  };      
}


import introState from "@/state/introState";

interface RaglanInput {
  headCircumference: string;
  neckCircumference: string;
  chestCircumference: string;
  stitchDensity: string;
  rowDensity: string;
  fitType: string;
  ribbingWidth: number | string;
  ribbingWidthV: number | string;
  resultString24?: string;
  raglanLineWidthV?: number;
  depthNeckV?: number;
  [key: string]: any;
}

export interface RaglanOutput {
  Sgor: number;
  SgorV: number;
  NRrez: number;
  NRrezV: number;
  SFrontO: number;
  SFrontV: number;
  Sa: number;
  SaV: number;
  K: number;
  KV: number;
  LFrontO: number;
  LFrontV: number;
  SKfront: number;  
  SKfrontV: number;
  SKa: number;
  SKaV: number;
  NHFront: number;
  NHFrontV: number;
  NRostok: number;
  SFrontOGr: number;
  SFrontOGrV: number;
  SPodr: number;
  SPodrV: number;
  Sfx: number;
  SfxV: number;
  prib_1x1: number;
  prib_1x1V: number;
  prib_1x2: number;
  prib_1x2V: number;
  prib_1x3: number;
  prib_1x3V: number;
  PR_1x4: number;
  PR_1x4V: number;
  PR_1x2: number;
  PR_1x2V: number;
  PRib_1x4: number;
  PRib_1x4V: number;
  PRib_1x3: number;
  PRib_1x3V: number;
  prib_1x1_f: number;
  prib_1x1_fV: number;
  prib_1x2_f: number;
  prib_1x2_fV: number;
  prib_1x3_f: number;
  prib_1x3_fV: number;
  PR_1x4_f: number;
  PR_1x4_fV: number;
  PR_1x2_f: number;
  PR_1x2_fV: number;
  PRib_1x4_f: number;
  PRib_1x4_fV: number;
  PRib_1x3_f: number;
  PRib_1x3_fV: number;
  RowPrib1x4: number[];
  RowPrib1x4V: number[];
  RowPrib1x4String: string;
  RowPrib1x4StringV: string;
  RowPrib1x3: number[];
  RowPrib1x3V: number[];
  RowPrib1x3String: string;
  RowPrib1x3StringV: string;
  RowPrib1x2: number[];
  RowPrib1x2V: number[];
  RowPrib1x2String: string;
  RowPrib1x2StringV: string;
  RowPrib1x1: number[];
  RowPrib1x1V: number[];
  RowPrib1x1String: string;
  RowPrib1x1StringV: string;
  resultString21V: string;
  resultString23V: string;
  resultString24V: string;
  resultString43V: string;
  usedIncreaseType: string[];
  usedIncreaseTypeString: string;
  usedIncreaseTypeV: string[];
  usedIncreaseTypeStringV: string;
  fit: number;
  SFit: number;
  SOgr: number;
  SRostok: number;
  SRostokV: number;
  stitches: number;
  NHVmax: number;
  LHVmax: number;
  LKmaxV: number;
  KmaxV: number;
  LHVmin: number;
  NHVmin: number;
  LHV: number;
  NHV: number;
  LpribVcorn: number;
  SpribVcorn: number;
  LVfront: number;
  SVfront: number;
  SV: number;
  SVO: number;
  SOcutV: number;
  PribRVz: number;
  PribRV1s: number;
  PribRV2s: number;
  RowPribRVz: number;
  RowPribRV1: number;
  RowPribRV2: number;
  isV: number;
  isPlusOneV: number;
  pairsWithIsV: number;
  pairsWithIsPlusOneV: number;
  rowsWithIsV: number;
  rowsWithIsPlusOneV: number;
  krV: number;
  positionsWithIsV: number[];
  positionsWithIsPlusOneV: number[];
  resultStringV: string;
  NRfxV: number;
  NRfx: number;
  hsV: number;
  LsV: number;
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
  const ribbing = typeof ribbingWidth === 'string' ? parseFloat(ribbingWidth) : ribbingWidth;
  const ribbingV = typeof ribbingWidthV === 'string' ? parseFloat(ribbingWidthV) : ribbingWidthV;
  

  if (isNaN(head) || isNaN(neck) || isNaN(chest) || isNaN(stitches) || isNaN(rows)) {
    return 'Please enter all values correctly.';
  }

  const K = introState.raglanLineWidth; // Используем ширину регланной линии из introState
  const KV = raglanLineWidthV !== undefined ? raglanLineWidthV : 2; // Значение по умолчанию 2
  const Hrez = ribbing; // ширина резинки в см
  const HrezV = ribbingV; // ширина резинки в см  

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
  const NRrezV = Math.round(HrezV * rows/2) * 2; 
  const Sgor = Math.round((Lgor * stitches) / 2) * 2;   
  const SgorV = Math.round((LgorV * stitches) / 2) * 2;
  const SFrontO = Math.round(((Sgor - 4 * K) / 8 * 3) / 2) * 2;
  const SFrontV = Math.round(((SgorV - 4 * KV) / 8 * 3) / 2) * 2;  

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
  const SfxV = Math.round((SFrontOGrV - SFrontV) / 2);
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
  const SaV = (SgorV - 2 * SFrontV - 4 * KV) / 2;
  const LKa= K / stitches - LKfront;
  const LKaV = KV / stitches - LKfrontV;
  const La = Sa / stitches;
  const LaV = SaV / stitches;
  const LK = K / stitches;
  const LKV = KV / stitches;
  const Ls = 1 / stitches; // перевод в см ширина петли
  const LsV = 1 / stitches;
  const hs = 1 / rows;  // см высота петли
  const hsV = 1 / rows;

  const Projma = (chest + fit) / 6 + 5;
  const HFront_sm = Projma - Hrez;
  const HFront_smV = Projma - HrezV;
  const NHFront = Math.round((HFront_sm * rows) / 2) * 2;
  const NHFrontV = Math.round((HFront_smV * rows) / 2) * 2;
  const prib_1x1 = (NHFront - 2 * Sfx) < 0 ? (2 * Sfx - NHFront) : 0;   //рядов с прибавкой по 1 петле в каждом ряду
  const prib_1x1V = (NHFrontV - 2 * SfxV) < 0 ? (2 * SfxV - NHFrontV) : 0;
  const prib_1x3 = Math.floor(NHFront / Sfx) === 2 ? 3 * (NHFront - 2 * Sfx) : 0;
  const prib_1x3V = Math.floor(NHFrontV / SfxV) === 2 ? 3 * (NHFrontV - 2 * SfxV) : 0;
  const prib_1x2 = NHFront - prib_1x1 - prib_1x3;
  const prib_1x2V = NHFrontV - prib_1x1V - prib_1x3V;
  const PR_1x4 = NHFront > 2 * Sfx ? 4 * (NHFront / 2 - Sfx) : 0;
  const PR_1x4V = NHFrontV > 2 * SfxV ? 4 * (NHFrontV / 2 - SfxV) : 0;
  const PR_1x2 = NHFront > 2 * Sfx ? (NHFront - PR_1x4) : 0;
  const PR_1x2V = NHFrontV > 2 * SfxV ? (NHFrontV - PR_1x4V) : 0;
  const PRib_1x4 = Math.floor(NHFront / Sfx) === 3 ? 4 * ( NHFront - 3 * Sfx ) : 0 ;
  const PRib_1x4V = Math.floor(NHFrontV / SfxV) === 3 ? 4 * ( NHFrontV - 3 * SfxV ) : 0 ;
  const PRib_1x3 = Math.floor(NHFront / Sfx) === 3 ? ( NHFront - PRib_1x4  ) : 0 ;
  const PRib_1x3V = Math.floor(NHFrontV / SfxV) === 3 ? ( NHFrontV - PRib_1x4V  ) : 0 ;


  const prib_1x1_f = (NHFront - 2 * Sfx) < 0 ? (2 * Sfx - NHFront) : 0;
  const prib_1x1_fV = (NHFrontV - 2 * SfxV) < 0 ? (2 * SfxV - NHFrontV) : 0;
  const prib_1x3_f = NHFront > 2 * Sfx ? (NHFront - 2 * Sfx) : 0; //  петель прибавленных по 1 петле на 3 ряда
  const prib_1x3_fV = NHFrontV > 2 * SfxV ? (NHFrontV - 2 * SfxV) : 0;
  const prib_1x2_f = prib_1x2 !== 0 ? (NHFront - prib_1x1 - prib_1x3)/2 : 0;
  const prib_1x2_fV = prib_1x2V !== 0 ? (NHFrontV - prib_1x1V - prib_1x3V)/2 : 0;
  const PR_1x4_f = NHFront > 2 * Sfx ? (NHFront / 2 - Sfx) : 0;
  const PR_1x4_fV = NHFrontV > 2 * SfxV ? (NHFrontV / 2 - SfxV) : 0;
  const PR_1x2_f = prib_1x2 !== 0 ? (NHFront - prib_1x1 - PR_1x4)/2 : 0;
  const PR_1x2_fV = prib_1x2V !== 0 ? (NHFrontV - prib_1x1V - PR_1x4V)/2 : 0;
  const PRib_1x4_f = Math.floor(NHFront / Sfx) === 3 ? ( NHFront - 3 * Sfx ) : 0 ;
  const PRib_1x4_fV = Math.floor(NHFrontV / SfxV) === 3 ? ( NHFrontV - 3 * SfxV ) : 0 ;
  const PRib_1x3_f = Math.floor(NHFront / Sfx) === 3 ? ( PRib_1x3/3) : 0 ;
  const PRib_1x3_fV = Math.floor(NHFrontV / SfxV) === 3 ? ( PRib_1x3V/3) : 0 ;

  const RowPrib1x4 = Array.from({ length: Sfx }, (_, index) => 1 + index * 4);   // номера рядов когда прибавка по реглану только 1 петля на 4 ряда
  const RowPrib1x4String = RowPrib1x4.join(', ');   // вывод строки с номерами рядов

  const RowPrib1x4V = Array.from({ length: SfxV }, (_, index) => 1 + index * 4);
  const RowPrib1x4StringV = RowPrib1x4V.join(', ');

  const RowPrib1x3 = Array.from({ length: Sfx }, (_, index) => 1 + index * 3);  // номера рядов когда прибавка по реглану только 1 петля на 3 ряда
  const RowPrib1x3String = RowPrib1x3.join(', ');
  const RowPrib1x3V = Array.from({ length: SfxV }, (_, index) => 1 + index * 3);
  const RowPrib1x3StringV = RowPrib1x3V.join(', ');

  const RowPrib1x2 = Array.from({ length: Sfx }, (_, index) => 1 + index * 2)
  const RowPrib1x2String = RowPrib1x2.join(', ');

  const RowPrib1x2V = Array.from({ length: SfxV }, (_, index) => 1 + index * 2)
  const RowPrib1x2StringV = RowPrib1x2V.join(', ');

  const RowPrib1x1 = Array.from({ length: Sfx }, (_, index) => 1 + index * 1);
  const RowPrib1x1String = RowPrib1x1.join(', ');
  const RowPrib1x1V = Array.from({ length: SfxV }, (_, index) => 1 + index * 1);
  const RowPrib1x1StringV = RowPrib1x1V.join(', ');

  
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
{/* V-образный вырез */}
  const usedIncreaseTypeV: string[] = [];

  if (PR_1x2_fV > 0 && PR_1x4_fV > 0 && PR_1x2_fV + PR_1x4_fV === SfxV) {
    usedIncreaseTypeV.push('1x2, 1x4');
  }
  if (PRib_1x3_fV > 0 && PRib_1x4_fV > 0 && PRib_1x3_fV + PRib_1x4_fV === SfxV) {
    usedIncreaseTypeV.push('1x3, 1x4');
  }
  if (PR_1x2_fV > 0 && PR_1x4_fV > 0 && prib_1x1_fV > 0 && PR_1x2_fV + PR_1x4_fV + prib_1x1_fV === SfxV) {
    usedIncreaseTypeV.push('1x2, 1x4, 1x1');
  }
  if (PR_1x2_fV > 0 && prib_1x1_fV > 0 && PR_1x2_fV + prib_1x1_fV === SfxV) {
    usedIncreaseTypeV.push('1x2, 1x1');
  }
  if (PR_1x4_fV > 0 && prib_1x1_fV > 0 && PR_1x4_fV + prib_1x1_fV === SfxV) {
    usedIncreaseTypeV.push('1x4, 1x1');
  }
  if (prib_1x2_fV > 0 && prib_1x3_fV > 0 && prib_1x2_fV + prib_1x3_fV === SfxV) {
    usedIncreaseTypeV.push('1x2, 1x3');
  }
  if (prib_1x3_fV > 0 && prib_1x1_fV > 0 && prib_1x3_fV + prib_1x1_fV === SfxV) {
    usedIncreaseTypeV.push('1x3, 1x1');
  }
  if (prib_1x2_fV > 0 && prib_1x3_fV > 0 && prib_1x1_fV > 0 && prib_1x2_fV + prib_1x3_fV + prib_1x1_fV === SfxV) {
    usedIncreaseTypeV.push('1x2, 1x3, 1x1');
  }
  if (prib_1x2_fV > 0 && prib_1x2_fV === SfxV) {
    usedIncreaseTypeV.push('1x2');
  }
  if (PR_1x4_fV > 0 && PR_1x4_fV === SfxV) {
    usedIncreaseTypeV.push('1x4');
        
  }
  if (prib_1x3_fV > 0 && prib_1x3_fV === SfxV) {
    usedIncreaseTypeV.push('1x3');
  }
  if (prib_1x1_fV > 0 && prib_1x1_fV === SfxV) {
    usedIncreaseTypeV.push('1x1');
  }

  const usedIncreaseTypeString = usedIncreaseType.length > 0 ? usedIncreaseType.join(' | ') : 'Нет подходящего типа прибавок';
  const usedIncreaseTypeStringV = usedIncreaseTypeV.length > 0 ? usedIncreaseTypeV.join(' | ') : 'Нет подходящего типа прибавок';

  console.log('V-neck increase types:', { usedIncreaseTypeV, usedIncreaseTypeStringV });

  const SRostok = SFrontO + 2 * Sfx + 2 * SKfront;
  const SRostokV = SFrontV + 2 * SfxV + 2 * SKfrontV;

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
  const NHV = Math.round(LHV * rows/2)*2;

  // Расчеты для V-образного выреза переда
  const LpribVcorn = (LHV * HrezV) / (LFrontV / 2);
  const SpribVcorn = Math.round(LpribVcorn * stitches / 2) * 2;
  const LVfront = Math.sqrt(Math.pow(LFrontV / 2, 2) + Math.pow(LHV, 2));
  const SVfront = Math.round(LVfront * stitches / 2) * 2;
  const SV = SVfront - SpribVcorn;
  const SVO = SV * 2;
  const SOcutV = SgorV - SFrontV + SVO;
  const PribRVz=((NRrezV) > SpribVcorn)? (NRrezV-SpribVcorn):0;   //прибавка в углу резинки 0 петель в одном ряду с одной стороны угла.//
  const PribRV2s= Math.floor( SpribVcorn / (NRrezV)) === 1 ? (2*(SpribVcorn -(NRrezV))):0; //прибавка в углу резинки 2 петли в 1 ряду с одной сроны угла  //  
  const PribRV1s=((NRrezV) > SpribVcorn)?(NRrezV -PribRVz):(SpribVcorn-PribRV2s) ;   //прибавка в углу резинки 1 петля в 1 ряду с одной стороны угла  // 
  const RowPribRVz=PribRVz;
  const RowPribRV2=PribRV2s /2;
  const RowPribRV1 = NRrezV - RowPribRVz - RowPribRV2;

  // Расчеты для V-выреза переда
  const isV = Math.floor(SVfront / (NHV / 2));
  const isPlusOneV = isV + 1;
  
  // Количество пар рядов с is+1 прибавками
  const pairsWithIsPlusOneV = SVfront - isV * NHV / 2;
  // Количество рядов с is+1 прибавками
  const rowsWithIsPlusOneV = 2 * pairsWithIsPlusOneV;
  
  // Количество петель с is+1 прибавками
  const stitchesWithIsPlusOneV = isPlusOneV * pairsWithIsPlusOneV;
  
  // Количество пар рядов с is прибавками
  const pairsWithIsV = (SVfront - stitchesWithIsPlusOneV) / isV;
  // Количество рядов с is прибавками
  const rowsWithIsV = 2 * pairsWithIsV;
  
  // Расчет позиций для равномерного распределения
  const krV = (NHV / 2) / pairsWithIsV;
  
  // Генерация позиций для пар рядов с is прибавками
  const positionsWithIsV = Array.from(
    { length: pairsWithIsV },
    (_, i) => Math.floor(krV * (i + 1))
  );
  
  // Генерация позиций для пар рядов с is+1 прибавками
  const positionsWithIsPlusOneV = Array.from(
    { length: NHV / 2 },
    (_, i) => i + 1
  ).filter(pos => !positionsWithIsV.includes(pos));
  
  // Формирование строки результата-V-образный вырез=массив с количеством прибавок в паре рядов NHV 
  const resultArrayV = Array.from({ length: NHV / 2 }, (_, i) => {
    const position = i + 1;
    return positionsWithIsV.includes(position) ? isV : isPlusOneV;
  });
  
  const resultStringV = resultArrayV.join(', ');
  console.log('resultStringV:', resultStringV);
  // конец расчета для V-выреза переда

  console.log('Results calculated for V-neck raglan');

  return {
    Sgor,
    SgorV,
    NRrez,
    NRrezV,
    SFrontO,
    SFrontV,
    Sa,
    SaV,
    K,
    KV,
    LFrontO,
    LFrontV,
    SKfront,
    SKfrontV,
    SKa,
    SKaV,
    NHFront,
    NHFrontV,
    NRostok,
   
    SFrontOGr,
    SFrontOGrV,
    SPodr,
    SPodrV: SPodr,
    Sfx,
    SfxV,
    prib_1x1,
    prib_1x1V,
    prib_1x2,
    prib_1x2V,
    prib_1x3,
    prib_1x3V,
    PR_1x4,
    PR_1x4V,
    PR_1x2,
    PR_1x2V,
    PRib_1x4,
    PRib_1x4V,
    PRib_1x3,
    PRib_1x3V,
    prib_1x1_f,
    prib_1x1_fV,
    prib_1x2_f,
    prib_1x2_fV,
    prib_1x3_f,
    prib_1x3_fV,
    PR_1x4_f,
    PR_1x4_fV,
    PR_1x2_f,
    PR_1x2_fV,
    PRib_1x4_f,
    PRib_1x4_fV,
    PRib_1x3_f,
    PRib_1x3_fV,
    RowPrib1x4,
    RowPrib1x4V,
    RowPrib1x4String,
    RowPrib1x4StringV,
    RowPrib1x3,
    RowPrib1x3V,
    RowPrib1x3String,
    RowPrib1x3StringV,
    RowPrib1x2,
    RowPrib1x2V,
    RowPrib1x2String,
    RowPrib1x2StringV,
    RowPrib1x1,
    RowPrib1x1V,
    RowPrib1x1String,
    RowPrib1x1StringV,
    resultString21V: '',
    resultString23V: '',
    resultString24V: '',
    resultString43V: '',
    usedIncreaseType,
    usedIncreaseTypeString,
    usedIncreaseTypeV,
    usedIncreaseTypeStringV,
    fit,
    SFit,
    SOgr,
    SRostok,
    SRostokV,
    stitches,
    NHVmax,
    LHVmax,
    LKmaxV,
    KmaxV,
    LHVmin,
    NHVmin,
    LHV,
    NHV,
    LpribVcorn,
    SpribVcorn,
    LVfront,
    SVfront,
    SV,
    SVO,
    SOcutV,
    NRfxV,
    NRfx,
    PribRVz,
    PribRV1s,
    PribRV2s,
    RowPribRV1,
    RowPribRV2,
    RowPribRVz,
    hsV,
    LsV,
    isV,
    isPlusOneV,
    pairsWithIsV,
    pairsWithIsPlusOneV,
    rowsWithIsV,
    rowsWithIsPlusOneV,
    krV,
    positionsWithIsV,
    positionsWithIsPlusOneV,
    resultStringV,
  };      
}



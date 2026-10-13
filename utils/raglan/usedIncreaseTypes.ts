export interface FrontIncreaseCounts {
  Sfx: number;
  prib_1x1_f: number;
  prib_1x2_f: number;
  prib_1x3_f: number;
  PR_1x4_f: number;
  PR_1x2_f: number;
  PRib_1x4_f: number;
  PRib_1x3_f: number;
}

const NO_MATCH = 'Нет подходящего типа прибавок';

export function detectUsedIncreaseTypes(counts: FrontIncreaseCounts): string[] {
  const {
    Sfx,
    prib_1x1_f,
    prib_1x2_f,
    prib_1x3_f,
    PR_1x4_f,
    PR_1x2_f,
    PRib_1x4_f,
    PRib_1x3_f,
  } = counts;
  const used: string[] = [];

  if (PR_1x2_f > 0 && PR_1x4_f > 0 && PR_1x2_f + PR_1x4_f === Sfx) {
    used.push('1x2, 1x4');
  }
  if (PRib_1x3_f > 0 && PRib_1x4_f > 0 && PRib_1x3_f + PRib_1x4_f === Sfx) {
    used.push('1x3, 1x4');
  }
  if (PR_1x2_f > 0 && PR_1x4_f > 0 && prib_1x1_f > 0 && PR_1x2_f + PR_1x4_f + prib_1x1_f === Sfx) {
    used.push('1x2, 1x4, 1x1');
  }
  if (PR_1x2_f > 0 && prib_1x1_f > 0 && PR_1x2_f + prib_1x1_f === Sfx) {
    used.push('1x2, 1x1');
  }
  if (PR_1x4_f > 0 && prib_1x1_f > 0 && PR_1x4_f + prib_1x1_f === Sfx) {
    used.push('1x4, 1x1');
  }
  if (prib_1x2_f > 0 && prib_1x3_f > 0 && prib_1x2_f + prib_1x3_f === Sfx) {
    used.push('1x2, 1x3');
  }
  if (prib_1x3_f > 0 && prib_1x1_f > 0 && prib_1x3_f + prib_1x1_f === Sfx) {
    used.push('1x3, 1x1');
  }
  if (prib_1x2_f > 0 && prib_1x3_f > 0 && prib_1x1_f > 0 && prib_1x2_f + prib_1x3_f + prib_1x1_f === Sfx) {
    used.push('1x2, 1x3, 1x1');
  }
  if (prib_1x2_f > 0 && prib_1x2_f === Sfx) {
    used.push('1x2');
  }
  if (PR_1x4_f > 0 && PR_1x4_f === Sfx) {
    used.push('1x4');
  }
  if (prib_1x3_f > 0 && prib_1x3_f === Sfx) {
    used.push('1x3');
  }
  if (prib_1x1_f > 0 && prib_1x1_f === Sfx) {
    used.push('1x1');
  }

  return used;
}

export function formatUsedIncreaseTypes(used: string[]): string {
  return used.length > 0 ? used.join(' | ') : NO_MATCH;
}

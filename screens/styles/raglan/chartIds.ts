export const RAGLAN_CHART_IDS = {
  ribbingO: 'ribbingO',
  ribbingV: 'ribbingV',
  frontO: 'frontO',
  frontV: 'frontV',
  backO: 'backO',
  backV: 'backV',
  sleeveO: 'sleeveO',
  sleeveV: 'sleeveV',
} as const;

export type RaglanChartId = (typeof RAGLAN_CHART_IDS)[keyof typeof RAGLAN_CHART_IDS];

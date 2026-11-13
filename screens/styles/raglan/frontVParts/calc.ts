// Type guard for raglan calculation output used on the front v-neck chart.
import type { RaglanOutput } from '@/utils/calculateRaglan';

export const isRaglanOutput = (value: unknown): value is RaglanOutput => {
  return value !== null && typeof value === 'object' && 'PR_1x2_fV' in value;
};

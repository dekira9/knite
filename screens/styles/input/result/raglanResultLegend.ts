import type { TranslationKey } from '@/utils/i18n/translationKeys';
import { RESULT_COLORS } from './resultSharedStyles';

export type ResultLegendItem = {
  id: string;
  color: string;
  labelKey: TranslationKey;
  helpTitleKey?: TranslationKey;
  helpBodyKey?: TranslationKey;
  borderColor?: string;
  borderRadius?: number;
};

const REGULAR_ITEMS: ResultLegendItem[] = [
  {
    id: 'start',
    color: RESULT_COLORS.start,
    labelKey: 'resultLegendStart',
    borderRadius: 8,
  },
  {
    id: 'lastRowCollar',
    color: RESULT_COLORS.lastRowCollar,
    labelKey: 'resultLegendCollar',
    borderColor: '#000',
  },
  { id: 'front', color: RESULT_COLORS.front, labelKey: 'resultLegendFront' },
  { id: 'sleeve', color: RESULT_COLORS.sleeve, labelKey: 'resultLegendSleeve' },
  { id: 'back', color: RESULT_COLORS.back, labelKey: 'resultLegendBack' },
  { id: 'raglan', color: RESULT_COLORS.raglan, labelKey: 'resultLegendRaglan' },
  { id: 'corpus', color: RESULT_COLORS.corpus, labelKey: 'resultLegendCorpus' },
  {
    id: 'underarm',
    color: RESULT_COLORS.underarm,
    labelKey: 'resultLegendUnderarm',
    helpTitleKey: 'resultHelpUnderarmTitle',
    helpBodyKey: 'resultHelpUnderarmBody',
  },
];

const V_NECK_EXTRA: ResultLegendItem[] = [

];

export function getResultLegendItems(variant: 'regular' | 'v-neck'): ResultLegendItem[] {
  return variant === 'v-neck' ? [...REGULAR_ITEMS, ...V_NECK_EXTRA] : REGULAR_ITEMS;
}

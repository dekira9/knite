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
    id: 'lastRowCollar',
    color: RESULT_COLORS.lastRowCollar,
    labelKey: 'lastRowOfCollar',
    helpTitleKey: 'resultHelpLastRowTitle',
    helpBodyKey: 'resultHelpLastRowBody',
    borderColor: '#000',
  },
  {
    id: 'start',
    color: RESULT_COLORS.start,
    labelKey: 'start',
    helpTitleKey: 'resultHelpStartTitle',
    helpBodyKey: 'resultHelpStartBody',
    borderRadius: 8,
  },
  { id: 'back', color: RESULT_COLORS.back, labelKey: 'back' },
  { id: 'front', color: RESULT_COLORS.front, labelKey: 'front' },
  { id: 'sleeve', color: RESULT_COLORS.sleeve, labelKey: 'sleeve' },
  { id: 'raglan', color: RESULT_COLORS.raglan, labelKey: 'raglan' },
  { id: 'corpus', color: RESULT_COLORS.corpus, labelKey: 'corpus' },
  {
    id: 'underarm',
    color: RESULT_COLORS.underarm,
    labelKey: 'underarmStitches',
    helpTitleKey: 'resultHelpUnderarmTitle',
    helpBodyKey: 'resultHelpUnderarmBody',
  },
];

const V_NECK_EXTRA: ResultLegendItem[] = [
  {
    id: 'knitFromCollar',
    color: RESULT_COLORS.knitFromCollar,
    labelKey: 'knitTheStitchesFromTheCollar',
    helpTitleKey: 'resultHelpKnitCollarTitle',
    helpBodyKey: 'resultHelpKnitCollarBody',
    borderColor: '#715604',
  },
  {
    id: 'decrease',
    color: RESULT_COLORS.decrease,
    labelKey: 'decreaseTheStitches',
    helpTitleKey: 'resultHelpDecreaseTitle',
    helpBodyKey: 'resultHelpDecreaseBody',
  },
];

export function getResultLegendItems(variant: 'regular' | 'v-neck'): ResultLegendItem[] {
  return variant === 'v-neck' ? [...V_NECK_EXTRA, ...REGULAR_ITEMS] : REGULAR_ITEMS;
}

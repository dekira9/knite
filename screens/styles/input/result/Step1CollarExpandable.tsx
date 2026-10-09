import React from 'react';
import i18n from '@/utils/translations';
import ResultStepExpandable from './ResultStepExpandable';

type Props = {
  variant: 'regular' | 'v-neck';
  children: React.ReactNode;
};

const COLLAR_IMAGES = {
  regular: require('@/assets/images/collarO.png'),
  'v-neck': require('@/assets/images/collarV.png'),
} as const;

const COLLAR_ASPECT_RATIOS = {
  regular: 1010 / 768,
  'v-neck': 855 / 992,
} as const;

/** Step 1 collar preview → calculation. */
export default function Step1CollarExpandable({ variant, children }: Props) {
  return (
    <ResultStepExpandable
      previewSource={COLLAR_IMAGES[variant]}
      accessibilityLabel={i18n.t('collarKnitting')}
      imageAspectRatio={COLLAR_ASPECT_RATIOS[variant]}
    >
      {children}
    </ResultStepExpandable>
  );
}

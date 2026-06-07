import React from 'react';
import { Text, StyleSheet } from 'react-native';
import i18n from '@/utils/translations';
import type { TranslationKey } from '@/utils/i18n/translationKeys';

type Props = {
  step: number;
  titleKey: TranslationKey;
};

export default function ResultStepTitle({ step, titleKey }: Props) {
  return (
    <Text style={styles.stepTitle}>
      {i18n.t('step')} {step} · {i18n.t(titleKey)}
    </Text>
  );
}

const styles = StyleSheet.create({
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
    color: '#1A1A1A',
  },
});

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import i18n from '@/utils/translations';
import {
  KNIT_PLAN_PHASE_TITLE_KEYS,
  type KnitPlanPhaseId,
} from '@/utils/knitPlan';

type PlanStepHeaderProps = {
  phaseIndex: number;
  phaseCount: number;
  phaseId: KnitPlanPhaseId;
};

export function PlanStepHeader({
  phaseIndex,
  phaseCount,
  phaseId,
}: PlanStepHeaderProps) {
  const titleKey = KNIT_PLAN_PHASE_TITLE_KEYS[phaseId];
  return (
  <>
      <Text style={styles.stepOf}>
        {i18n.t('knitPlanStepOf', {
          step: phaseIndex + 1,
          total: phaseCount,
        })}
      </Text>
      <Text style={styles.phaseTitle}>{i18n.t(titleKey)}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  stepOf: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginTop: 4,
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
    marginBottom: 8,
    textAlign: 'center',
  },
});

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import i18n from '@/utils/translations';
import rowCounterState from '@/state/rowCounterState';
import {
  getKnitPlanCheckpoint,
  KNIT_PLAN_PHASE_TITLE_KEYS,
  type KnitPlan,
  type KnitPlanRowInfo,
  type KnitPlanSource,
} from '@/utils/knitPlan';
import { PlanStepHeader } from './PlanStepHeader';
import { PlanRowHint } from './PlanRowHint';
import { PlanCheckpointCard } from './PlanCheckpointCard';
import { PlanPhaseDoneCard } from './PlanPhaseDoneCard';
import { counterScreenStyles as styles } from './counterScreenStyles';

type PlanCounterBodyProps = {
  counterId: string;
  phaseIndex: number;
  count: number;
  plan: KnitPlan;
  planSource: KnitPlanSource;
  rowAboutToKnit: number;
  rowInfo: KnitPlanRowInfo | null;
  tapHeight: number;
  onIncrement: () => void;
  onNextPhase: () => void;
};

export function PlanCounterBody({
  counterId,
  phaseIndex,
  count,
  plan,
  planSource,
  rowAboutToKnit,
  rowInfo,
  tapHeight,
  onIncrement,
  onNextPhase,
}: PlanCounterBodyProps) {
  const currentPhase = plan.phases[phaseIndex];
  if (!currentPhase) {
    return null;
  }

  const progress =
    currentPhase.rows != null && currentPhase.rows > 0
      ? Math.min(count / currentPhase.rows, 1)
      : 0;
  const phaseComplete =
    currentPhase.rows != null &&
    currentPhase.rows > 0 &&
    count >= currentPhase.rows;
  const isCheckpoint = currentPhase.id === 'separateSleeves';
  const isOpenEnded = currentPhase.rows == null;
  const nextPhaseTitle =
    phaseIndex + 1 < plan.phases.length
      ? i18n.t(KNIT_PLAN_PHASE_TITLE_KEYS[plan.phases[phaseIndex + 1].id])
      : '';

  return (
    <>
      <PlanStepHeader
        phaseIndex={phaseIndex}
        phaseCount={plan.phases.length}
        phaseId={currentPhase.id}
      />

      <View style={styles.countSection}>
        <Text style={styles.rowLabel}>{i18n.t('rowCounterRow')}</Text>
        <Text style={styles.bigCount}>{count}</Text>
        {currentPhase.rows != null && currentPhase.rows > 0 ? (
          <Text style={styles.ofTarget}>
            {i18n.t('knitPlanRowOf', {
              row: rowAboutToKnit,
              total: currentPhase.rows,
            })}
          </Text>
        ) : null}
        {currentPhase.rows != null && currentPhase.rows > 0 ? (
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
        ) : null}
      </View>

      {rowInfo && !isCheckpoint ? (
        <PlanRowHint phaseId={currentPhase.id} rowInfo={rowInfo} />
      ) : null}

      {isCheckpoint ? (
        <PlanCheckpointCard
          checkpoint={getKnitPlanCheckpoint(planSource)}
          onDone={onNextPhase}
        />
      ) : null}

      {phaseComplete && !isCheckpoint ? (
        <PlanPhaseDoneCard
          nextPhaseTitle={nextPhaseTitle}
          onNextPhase={onNextPhase}
        />
      ) : isOpenEnded && !phaseComplete ? (
        <TouchableOpacity
          style={[styles.tapArea, { minHeight: tapHeight }]}
          onPress={onIncrement}
          activeOpacity={0.85}
        >
          <Text style={styles.tapPlus}>+</Text>
          <Text style={styles.tapHint}>{i18n.t('rowCounterTapHint')}</Text>
        </TouchableOpacity>
      ) : !phaseComplete && !isCheckpoint ? (
        <TouchableOpacity
          style={[styles.tapArea, { minHeight: tapHeight }]}
          onPress={onIncrement}
          activeOpacity={0.85}
        >
          <Text style={styles.tapPlus}>+</Text>
          <Text style={styles.tapHint}>{i18n.t('rowCounterTapHint')}</Text>
        </TouchableOpacity>
      ) : null}

      {phaseIndex > 0 ? (
        <TouchableOpacity
          style={styles.prevPhaseLink}
          onPress={() => rowCounterState.prevPhase(counterId)}
        >
          <Text style={styles.prevPhaseText}>{i18n.t('knitPlanPrevPhase')}</Text>
        </TouchableOpacity>
      ) : null}
    </>
  );
}

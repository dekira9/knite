import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import rowCounterState from '@/state/rowCounterState';
import {
  KNIT_PLAN_PHASE_TITLE_KEYS,
  type KnitPlanPhaseId,
} from '@/utils/knitPlan';
import { Colors } from '@/constants/Colors';

export type CounterCardData = {
  id: string;
  name: string;
  count: number;
  target: number | null;
  kind: 'simple' | 'plan';
};

type CounterCardProps = {
  counter: CounterCardData;
  onPress: () => void;
};

function phaseTitle(phaseId: KnitPlanPhaseId | null): string | null {
  if (phaseId == null) {
    return null;
  }
  return i18n.t(KNIT_PLAN_PHASE_TITLE_KEYS[phaseId]);
}

export const CounterCard = observer(function CounterCard({
  counter,
  onPress,
}: CounterCardProps) {
  const progress = rowCounterState.progressFor(counter.id);
  const isPlan = counter.kind === 'plan' && progress?.kind === 'plan';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} accessibilityRole="button">
      <Text style={styles.cardName} numberOfLines={1}>
        {counter.name}
      </Text>
      {isPlan ? (
        <PlanSummary
          phaseId={progress.phaseId}
          rowsDone={progress.rowsDone}
          totalRows={progress.totalRows}
        />
      ) : (
        <View style={styles.countRow}>
          <Text style={styles.cardCount}>{counter.count}</Text>
          {counter.target != null ? (
            <Text style={styles.cardTarget}>
              {i18n.t('rowCounterOf', { target: counter.target })}
            </Text>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
});

function PlanSummary({
  phaseId,
  rowsDone,
  totalRows,
}: {
  phaseId: KnitPlanPhaseId | null;
  rowsDone: number;
  totalRows: number | null;
}) {
  const title = phaseTitle(phaseId);
  const ratio =
    totalRows != null && totalRows > 0
      ? Math.min(1, Math.max(0, rowsDone / totalRows))
      : 0;
  const rowLabel =
    totalRows == null
      ? String(rowsDone)
      : i18n.t('knitPlanRowOf', { row: rowsDone, total: totalRows });

  return (
    <View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{i18n.t('knitPlanBadge')}</Text>
      </View>
      {title != null ? <Text style={styles.phaseTitle}>{title}</Text> : null}
      <Text style={styles.rowLabel}>{rowLabel}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.round(ratio * 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6ddd0',
    marginBottom: 8,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  cardCount: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.tint,
  },
  cardTarget: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E7F3F7',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.tint,
  },
  phaseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  rowLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.tint,
    borderRadius: 2,
  },
});

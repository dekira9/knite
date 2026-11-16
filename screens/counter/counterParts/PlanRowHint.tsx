import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import i18n from '@/utils/translations';
import { Colors } from '@/constants/Colors';
import type { KnitPlanRowInfo } from '@/utils/knitPlan';

type PlanRowHintProps = {
  phaseId: KnitPlanRowInfo['phaseId'];
  rowInfo: KnitPlanRowInfo;
};

export function PlanRowHint({ phaseId, rowInfo }: PlanRowHintProps) {
  if (phaseId === 'neckband') {
    const count = rowInfo.totalStitchesAfter;
    if (count == null) {
      return null;
    }
    return (
      <View style={styles.card}>
        <Text style={styles.hintText}>
          {i18n.t('knitPlanNeckbandHint', { count })}
        </Text>
      </View>
    );
  }

  if (phaseId === 'lengthening') {
    return (
      <View style={styles.card}>
        <Text style={styles.hintText}>{i18n.t('knitPlanLengtheningHint')}</Text>
      </View>
    );
  }

  if (phaseId === 'bodyAndSleeves') {
    return (
      <View style={styles.card}>
        <Text style={styles.hintText}>{i18n.t('knitPlanOpenEndedHint')}</Text>
      </View>
    );
  }

  if (phaseId !== 'raglanIncreases') {
    return null;
  }

  return (
    <View style={styles.card}>
      <Text
        style={[
          styles.rowKind,
          rowInfo.isIncreaseRow ? styles.increaseRow : styles.plainRow,
        ]}
      >
        {rowInfo.isIncreaseRow
          ? i18n.t('knitPlanIncreaseRow')
          : i18n.t('knitPlanPlainRow')}
      </Text>
      {!rowInfo.isIncreaseRow &&
      rowInfo.rowsToNextIncrease != null &&
      rowInfo.rowsToNextIncrease > 0 ? (
        <Text style={styles.detail}>
          {i18n.t('knitPlanNextIncreaseIn', {
            n: rowInfo.rowsToNextIncrease,
          })}
        </Text>
      ) : null}
      {rowInfo.totalStitchesAfter != null ? (
        <Text style={styles.detail}>
          {i18n.t('knitPlanStitchesAfter', {
            count: rowInfo.totalStitchesAfter,
          })}
        </Text>
      ) : null}
      {rowInfo.parts ? (
        <View style={styles.partsBlock}>
          {rowInfo.parts.back != null ? (
            <Text style={styles.partLine}>
              {i18n.t('knitPlanPartBack', { count: rowInfo.parts.back })}
            </Text>
          ) : null}
          {rowInfo.parts.front != null ? (
            <Text style={styles.partLine}>
              {i18n.t('knitPlanPartFront', { count: rowInfo.parts.front })}
            </Text>
          ) : null}
          {rowInfo.parts.sleeve != null ? (
            <Text style={styles.partLine}>
              {i18n.t('knitPlanPartSleeve', { count: rowInfo.parts.sleeve })}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    padding: 16,
    marginBottom: 16,
  },
  hintText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  rowKind: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  increaseRow: {
    color: Colors.light.tint,
  },
  plainRow: {
    color: '#11181C',
  },
  detail: {
    fontSize: 15,
    color: '#444',
    marginTop: 4,
  },
  partsBlock: {
    marginTop: 10,
    gap: 4,
  },
  partLine: {
    fontSize: 14,
    color: '#555',
  },
});

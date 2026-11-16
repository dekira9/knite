import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import i18n from '@/utils/translations';
import { Colors } from '@/constants/Colors';
import type { KnitPlanCheckpoint } from '@/utils/knitPlan';

type PlanCheckpointCardProps = {
  checkpoint: KnitPlanCheckpoint;
  onDone: () => void;
};

export function PlanCheckpointCard({
  checkpoint,
  onDone,
}: PlanCheckpointCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{i18n.t('knitPlanPhaseSeparateSleeves')}</Text>
      {checkpoint.sleeve != null ? (
        <Text style={styles.line}>
          {i18n.t('knitPlanSeparateSleeve', { count: checkpoint.sleeve })}
        </Text>
      ) : null}
      {checkpoint.underarm != null ? (
        <Text style={styles.line}>
          {i18n.t('knitPlanSeparateUnderarm', { count: checkpoint.underarm })}
        </Text>
      ) : null}
      {checkpoint.body != null ? (
        <Text style={styles.line}>
          {i18n.t('knitPlanSeparateBody', { count: checkpoint.body })}
        </Text>
      ) : null}
      <TouchableOpacity style={styles.primaryButton} onPress={onDone}>
        <Text style={styles.primaryButtonText}>
          {i18n.t('knitPlanDoneButton')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#11181C',
    marginBottom: 12,
  },
  line: {
    fontSize: 15,
    color: '#444',
    marginBottom: 6,
    lineHeight: 22,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: Colors.light.tint,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

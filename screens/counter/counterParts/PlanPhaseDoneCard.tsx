import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import i18n from '@/utils/translations';
import { Colors } from '@/constants/Colors';

type PlanPhaseDoneCardProps = {
  nextPhaseTitle: string;
  onNextPhase: () => void;
};

export function PlanPhaseDoneCard({
  nextPhaseTitle,
  onNextPhase,
}: PlanPhaseDoneCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.doneText}>{i18n.t('knitPlanPhaseDone')}</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={onNextPhase}>
        <Text style={styles.primaryButtonText}>
          {i18n.t('knitPlanNextPhase', { phase: nextPhaseTitle })}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 160,
    justifyContent: 'center',
  },
  doneText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 16,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

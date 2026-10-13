import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import ResultHelpModal from './ResultHelpModal';

export type IncreaseRhythm = {
  rowsPerStitch: number;
  count: number;
};

type Props = {
  rhythms: IncreaseRhythm[];
  rowsString?: string;
};

function formatRhythm({ rowsPerStitch, count }: IncreaseRhythm): string {
  if (rowsPerStitch === 1) {
    return i18n.t('increaseRhythmEveryRow', { count });
  }
  return i18n.t('increaseRhythmTimes', { n: rowsPerStitch, count });
}

function RowNumberChips({ rowsString }: { rowsString: string }) {
  const rows = rowsString
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (rows.length === 0) {
    return null;
  }

  return (
    <View style={styles.chipRow}>
      {rows.map((row, index) => (
        <View key={`${row}-${index}`} style={styles.rowChip}>
          <Text style={styles.rowChipText}>{row}</Text>
        </View>
      ))}
    </View>
  );
}

export default observer(function IncreaseOptionSection({ rhythms, rowsString }: Props) {
  const [helpVisible, setHelpVisible] = useState(false);
  const hasRows = Boolean(rowsString?.trim());

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{i18n.t('resultHelpIncreaseTitle')}</Text>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setHelpVisible(true)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={i18n.t('resultHelpIncreaseTitle')}
        >
          <Text style={styles.helpButtonText}>?</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>{i18n.t('increaseAlongRaglanHint')}</Text>

      {hasRows ? (
        <>
          <Text style={styles.rowsLabel}>{i18n.t('RowsWithAdding')}:</Text>
          <RowNumberChips rowsString={rowsString!} />
        </>
      ) : null}

      <View style={[styles.rhythmRow, hasRows && styles.rhythmRowSecondary]}>
        {rhythms.map((rhythm, index) => (
          <View key={`${rhythm.rowsPerStitch}-${index}`} style={styles.rhythmChip}>
            <Text style={styles.rhythmText}>{formatRhythm(rhythm)}</Text>
          </View>
        ))}
      </View>

      <ResultHelpModal
        visible={helpVisible}
        title={i18n.t('resultHelpIncreaseTitle')}
        body={i18n.t('resultHelpIncreaseBody')}
        onClose={() => setHelpVisible(false)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    alignItems: 'stretch',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  helpButton: {
    marginLeft: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#009FE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#009FE3',
    lineHeight: 16,
  },
  hint: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 10,
  },
  rhythmRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 4,
  },
  rhythmRowSecondary: {
    marginTop: 10,
  },
  rhythmChip: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#D1D5DB',
  },
  rhythmText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  rowsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  rowChip: {
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 28,
    alignItems: 'center',
  },
  rowChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

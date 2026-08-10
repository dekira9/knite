import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import i18n from '@/utils/translations';

type Props = {
  currentRow: number;
  totalRows: number;
  stitchCount: number;
  onPreviousRow: () => void;
  onNextRow: () => void;
  onStop?: () => void;
  /** Single-row layout for chart screens where vertical space is scarce. */
  variant?: 'default' | 'slim';
};

export const RaglanChartRowToolbar = observer(function RaglanChartRowToolbar({
  currentRow,
  totalRows,
  stitchCount,
  onPreviousRow,
  onNextRow,
  onStop,
  variant = 'default',
}: Props) {
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;

  const handleStop = () => {
    if (!onStop) return;
    onStop();
    const row = currentRow + 1;
    Alert.alert(
      i18n.t('chartStopSavedTitle'),
      i18n.t('chartStopSavedMessage', { row }),
    );
  };

  if (variant === 'slim') {
    return (
      <View style={styles.slimToolbar}>
        <View style={styles.slimTopRow}>
          <TouchableOpacity
            onPress={onPreviousRow}
            style={styles.slimNavButton}
            accessibilityRole="button"
            accessibilityLabel={i18n.t('chartPreviousRow')}
          >
            <Ionicons name="chevron-up" size={20} color={tint} />
          </TouchableOpacity>

          <View style={styles.slimStat}>
            <Text style={styles.slimStatLabel}>{i18n.t('currentRow')}</Text>
            <Text style={styles.slimStatValue}>
              {currentRow + 1}
              <Text style={styles.slimStatMuted}> / {totalRows}</Text>
            </Text>
          </View>

          <View style={styles.slimStat}>
            <Text style={styles.slimStatLabel}>{i18n.t('stitches')}</Text>
            <Text style={styles.slimStatValue}>{stitchCount}</Text>
          </View>

          <TouchableOpacity
            onPress={onNextRow}
            style={styles.slimNavButton}
            accessibilityRole="button"
            accessibilityLabel={i18n.t('chartNextRow')}
          >
            <Ionicons name="chevron-down" size={20} color={tint} />
          </TouchableOpacity>

          {onStop && (
            <TouchableOpacity
              onPress={handleStop}
              style={[styles.slimStopButton, { borderColor: tint }]}
              hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel={i18n.t('stop')}
              accessibilityHint={i18n.t('chartStopSavedMessage', {
                row: currentRow + 1,
              })}
            >
              <Text style={[styles.slimStopText, { color: tint }]}>
                {i18n.t('stop')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.toolbar}>
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={styles.statLabel}>{i18n.t('currentRow')}</Text>
            <Text style={styles.statValue}>
              {currentRow + 1}
              <Text style={styles.statValueMuted}> / {totalRows}</Text>
            </Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statLabel}>{i18n.t('stitches')}</Text>
            <Text style={styles.statValue}>{stitchCount}</Text>
          </View>
        </View>

        <View style={styles.navRow}>
          <TouchableOpacity
            onPress={onPreviousRow}
            style={styles.navButton}
            accessibilityRole="button"
            accessibilityLabel={i18n.t('chartPreviousRow')}
          >
            <Ionicons name="chevron-up" size={22} color={tint} />
          </TouchableOpacity>

          {onStop && (
            <TouchableOpacity
              onPress={handleStop}
              style={[styles.stopButton, { backgroundColor: tint }]}
              accessibilityRole="button"
              accessibilityLabel={i18n.t('stop')}
              accessibilityHint={i18n.t('chartStopSavedMessage', {
                row: currentRow + 1,
              })}
            >
              <Text style={styles.stopButtonText}>{i18n.t('stop')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={onNextRow}
            style={styles.navButton}
            accessibilityRole="button"
            accessibilityLabel={i18n.t('chartNextRow')}
          >
            <Ionicons name="chevron-down" size={22} color={tint} />
          </TouchableOpacity>
        </View>
    </View>
  );
});

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  statChip: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statValueMuted: {
    fontSize: 15,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: 4,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slimToolbar: {
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    paddingTop: 4,
    paddingBottom: 4,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 4,
  },
  slimTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
  },
  slimNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slimStat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
  },
  slimStatLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 0,
  },
  slimStatValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  slimStatMuted: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  stopButton: {
    minWidth: 100,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  slimStopButton: {
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  slimStopText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

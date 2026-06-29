import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import i18n from '@/utils/translations';

type Props = {
  currentRow: number;
  totalRows: number;
  stitchCount: number;
  onPreviousRow: () => void;
  onNextRow: () => void;
  /** Single-row layout for chart screens where vertical space is scarce. */
  variant?: 'default' | 'slim';
};

export function RaglanChartRowToolbar({
  currentRow,
  totalRows,
  stitchCount,
  onPreviousRow,
  onNextRow,
  variant = 'default',
}: Props) {
  const tabBarHeight = useBottomTabBarHeight();
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;

  if (variant === 'slim') {
    return (
      <View style={[styles.slimToolbar, { paddingBottom: tabBarHeight + 6 }]}>
        <TouchableOpacity
          onPress={onPreviousRow}
          style={styles.slimNavButton}
          accessibilityRole="button"
          accessibilityLabel={i18n.t('chartPreviousRow')}
        >
          <Ionicons name="chevron-up" size={22} color={tint} />
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
          <Ionicons name="chevron-down" size={22} color={tint} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.toolbar, { paddingBottom: tabBarHeight + 8 }]}>
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
}

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    paddingHorizontal: 8,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  slimNavButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slimStat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  slimStatLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 1,
  },
  slimStatValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  slimStatMuted: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
});

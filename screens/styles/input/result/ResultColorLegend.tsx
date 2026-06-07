import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import i18n from '@/utils/translations';
import { Colors } from '@/constants/Colors';
import ResultHelpModal from './ResultHelpModal';
import { getResultLegendItems, type ResultLegendItem } from './raglanResultLegend';
import { resultTypography } from './resultSharedStyles';

type Props = {
  variant: 'regular' | 'v-neck';
};

function LegendSwatch({ item }: { item: ResultLegendItem }) {
  return (
    <View
      style={[
        styles.swatch,
        {
          backgroundColor: item.color,
          borderColor: item.borderColor ?? '#000',
          borderRadius: item.borderRadius ?? 0,
        },
      ]}
    />
  );
}

export default function ResultColorLegend({ variant }: Props) {
  const items = getResultLegendItems(variant);
  const [expanded, setExpanded] = useState(false);
  const [helpItem, setHelpItem] = useState<ResultLegendItem | null>(null);
  const [generalHelpVisible, setGeneralHelpVisible] = useState(false);

  const openItemHelp = (item: ResultLegendItem) => {
    if (item.helpTitleKey && item.helpBodyKey) {
      setHelpItem(item);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={resultTypography.legendTitle}>{i18n.t('resultLegendTitle')}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setGeneralHelpVisible(true)}
            hitSlop={8}
            style={styles.helpButton}
            accessibilityRole="button"
            accessibilityLabel={i18n.t('resultHelpLegendTitle')}
          >
            <Text style={styles.helpButtonText}>?</Text>
          </TouchableOpacity>
          <Pressable onPress={() => setExpanded((value) => !value)} hitSlop={8}>
            <Text style={styles.toggleText}>
              {expanded ? i18n.t('resultLegendCollapse') : i18n.t('resultLegendExpand')}
            </Text>
          </Pressable>
        </View>
      </View>

      {!expanded ? (
        <Pressable style={styles.collapsedRow} onPress={() => setExpanded(true)}>
          {items.map((item) => (
            <LegendSwatch key={item.id} item={item} />
          ))}
        </Pressable>
      ) : (
        <View style={styles.expandedGrid}>
          {items.map((item) => {
            const hasHelp = Boolean(item.helpTitleKey && item.helpBodyKey);
            const content = (
              <>
                <LegendSwatch item={item} />
                <Text style={resultTypography.legendLabel} numberOfLines={2}>
                  {i18n.t(item.labelKey)}
                </Text>
              </>
            );

            if (hasHelp) {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.chip}
                  onPress={() => openItemHelp(item)}
                  activeOpacity={0.7}
                >
                  {content}
                </TouchableOpacity>
              );
            }

            return (
              <View key={item.id} style={styles.chip}>
                {content}
              </View>
            );
          })}
        </View>
      )}

      <ResultHelpModal
        visible={generalHelpVisible}
        title={i18n.t('resultHelpLegendTitle')}
        body={i18n.t('resultHelpLegendBody')}
        onClose={() => setGeneralHelpVisible(false)}
      />

      {helpItem?.helpTitleKey && helpItem.helpBodyKey ? (
        <ResultHelpModal
          visible
          title={i18n.t(helpItem.helpTitleKey)}
          body={i18n.t(helpItem.helpBodyKey)}
          onClose={() => setHelpItem(null)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  helpButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.tint,
    lineHeight: 16,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.tint,
  },
  collapsedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  expandedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    maxWidth: '48%',
    flexGrow: 1,
    flexBasis: '45%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  swatch: {
    width: 14,
    height: 14,
    borderWidth: 1,
    marginRight: 6,
  },
});

import React, { useState } from 'react';
import {
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
        <TouchableOpacity
          onPress={() => setGeneralHelpVisible(true)}
          hitSlop={8}
          style={styles.helpButton}
          accessibilityRole="button"
          accessibilityLabel={i18n.t('resultHelpLegendTitle')}
        >
          <Text style={styles.helpButtonText}>?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.legendGrid}>
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
  legendGrid: {
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

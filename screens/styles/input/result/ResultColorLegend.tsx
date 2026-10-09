import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Colors } from '@/constants/Colors';
import ResultHelpModal from './ResultHelpModal';
import { getResultLegendItems, type ResultLegendItem } from './raglanResultLegend';
import { resultTypography } from './resultSharedStyles';

type Props = {
  variant: 'regular' | 'v-neck';
  /** When true, always show legend body (used inside Params/Legend switcher). */
  embedded?: boolean;
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

export default observer(function ResultColorLegend({ variant, embedded = false }: Props) {
  const items = getResultLegendItems(variant);
  const [helpItem, setHelpItem] = useState<ResultLegendItem | null>(null);
  const [generalHelpVisible, setGeneralHelpVisible] = useState(false);

  const openItemHelp = (item: ResultLegendItem) => {
    if (item.helpTitleKey && item.helpBodyKey) {
      setHelpItem(item);
    }
  };

  return (
    <View style={[styles.wrapper, embedded && styles.wrapperEmbedded]}>
      <View style={styles.headerRow}>
        {!embedded ? (
          <Text style={resultTypography.legendTitle}>{i18n.t('resultLegendTitle')}</Text>
        ) : (
          <View style={styles.headerSpacer} />
        )}
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

          return (
            <View key={item.id} style={styles.legendItem}>
              <LegendSwatch item={item} />
              <Text style={[resultTypography.legendLabel, styles.legendLabel]}>
                {i18n.t(item.labelKey)}
              </Text>
              {hasHelp ? (
                <TouchableOpacity
                  onPress={() => openItemHelp(item)}
                  hitSlop={8}
                  style={styles.infoButton}
                  accessibilityRole="button"
                  accessibilityLabel={i18n.t(item.helpTitleKey!)}
                >
                  <Text style={styles.infoButtonText}>ⓘ</Text>
                </TouchableOpacity>
              ) : null}
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
});

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  wrapperEmbedded: {
    marginBottom: 0,
    backgroundColor: '#F4EFEC',
    borderRadius: 20,
    borderWidth: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  headerSpacer: {
    flex: 1,
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
    justifyContent: 'space-between',
    rowGap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '48%',
    paddingVertical: 2,
    paddingRight: 4,
  },
  legendLabel: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  infoButton: {
    flexShrink: 0,
    marginLeft: 4,
    alignSelf: 'flex-end',
  },
  infoButtonText: {
    fontSize: 13,
    color: Colors.light.tint,
    lineHeight: 14,
  },
  swatch: {
    width: 14,
    height: 14,
    borderWidth: 1,
    marginRight: 6,
    marginTop: 1,
    flexShrink: 0,
  },
});

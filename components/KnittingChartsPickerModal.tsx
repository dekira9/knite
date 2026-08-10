import React from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import { Colors } from '@/constants/Colors';
import i18n from '@/utils/translations';

export type KnittingChartScreen = 'Ribbing' | 'Back' | 'Front' | 'Sleeve';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (screen: KnittingChartScreen) => void;
};

const CHART_OPTIONS: { screen: KnittingChartScreen; labelKey: string }[] = [
  { screen: 'Ribbing', labelKey: 'collarKnittingChart' },
  { screen: 'Back', labelKey: 'backKnittingChart' },
  { screen: 'Front', labelKey: 'frontKnittingChart' },
  { screen: 'Sleeve', labelKey: 'sleeveKnittingChart' },
];

/** Bottom sheet listing all project knitting charts. */
export default observer(function KnittingChartsPickerModal({
  visible,
  onClose,
  onSelect,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Text style={styles.title}>{i18n.t('knittingCharts')}</Text>
          {CHART_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.screen}
              style={styles.option}
              onPress={() => onSelect(option.screen)}
              accessibilityRole="button"
              accessibilityLabel={i18n.t(option.labelKey)}
            >
              <Text style={styles.optionText}>{i18n.t(option.labelKey)}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.cancel}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={i18n.t('cancel')}
          >
            <Text style={styles.cancelText}>{i18n.t('cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  option: {
    backgroundColor: '#F4EFEC',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  cancel: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.tint,
  },
});

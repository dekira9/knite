// Cast-on and collar color indicators for the v-neck ribbing chart.
import React from 'react';
import { View, Text } from 'react-native';
import i18n from '@/utils/translations';
import { ribbingVStyles as styles } from './styles';

export function RibbingVLegend() {
  return (
    <View>
      <View style={styles.indicatorRow}>
        <View style={styles.grayIndicator} />
        <Text style={styles.resultText}> {i18n.t('castOnRow') || 'Cast On Row'} </Text>
      </View>
      <View style={styles.indicatorRow}>
        <View style={styles.yellowIndicator} />
        <Text style={styles.resultText}> {i18n.t('collar') || 'collar'} </Text>
      </View>
    </View>
  );
}

// Front step title row and divider for FrontV.

import React from 'react';
import { View, Text } from 'react-native';
import i18n from '@/utils/translations';
import { styles } from './styles';

export function FrontVHeader() {
  return (
    <>
      <View style={styles.stepHeader}>
        <Text style={styles.subtitle}>{i18n.t('front')}</Text>
        <View style={styles.indicatorsRow}>
          <View style={styles.pinkIndicator} />
        </View>
      </View>
      <View style={styles.divider}></View>
    </>
  );
}

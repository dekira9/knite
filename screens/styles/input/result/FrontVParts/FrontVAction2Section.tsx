// Action 2 decreases summary for FrontV.

import React from 'react';
import { View, Text } from 'react-native';
import i18n from '@/utils/translations';
import { styles } from './styles';

interface FrontVAction2SectionProps {
  stitchCount: number;
}

export function FrontVAction2Section({ stitchCount }: FrontVAction2SectionProps) {
  return (
    <>
      <View style={styles.horizontalRow}>
        <Text style={styles.subtitle}>{i18n.t('action')} 2:</Text>
      </View>

      <View style={styles.infoRowmin}>
        <Text style={styles.leftLabel}>{i18n.t('decreasesOnOneSide')}:</Text>
        <View style={styles.blackIndicator}></View>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>{i18n.t('stitches')}:</Text>
        <Text style={styles.boldNumber}>{stitchCount}</Text>
      </View>
    </>
  );
}

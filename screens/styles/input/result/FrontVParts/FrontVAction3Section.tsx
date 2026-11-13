// Action 3 circular knitting rows and scroll-to-chart control for FrontV.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import i18n from '@/utils/translations';
import { styles } from './styles';

interface FrontVAction3SectionProps {
  rowsCount: number;
  startRowNumber: number;
  handleScrollToTop1: () => void;
}

export function FrontVAction3Section({
  rowsCount,
  startRowNumber,
  handleScrollToTop1,
}: FrontVAction3SectionProps) {
  return (
    <>
      <View style={styles.horizontalRow}>
        <Text style={styles.subtitle}>{i18n.t('action')} 3:</Text>
      </View>

      <View style={styles.infoRowmin}>
        <Text style={styles.leftLabel}>{i18n.t('knitting')}:</Text>

        <Image
          source={require('@/assets/images/knitcircle.svg')}
          style={styles.styleKnitCircleImage}
          contentFit="contain"
        />
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>{i18n.t('rows')}:</Text>

        <Text style={styles.boldNumber}>{rowsCount}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>
          {i18n.t('start')} {i18n.t('row')} № {startRowNumber}:
        </Text>
        <TouchableOpacity onPress={handleScrollToTop1}>
          <Image
            source={require('@/assets/images/znkr6.svg')}
            style={styles.styleZnkr}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

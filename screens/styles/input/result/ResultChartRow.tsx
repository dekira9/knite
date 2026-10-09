import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import i18n from '@/utils/translations';
import { Colors } from '@/constants/Colors';
import { resultTypography } from './resultSharedStyles';

type Props = {
  title: string;
  color: string;
  onPress: () => void;
};

export default function ResultChartRow({ title, color, onPress }: Props) {
  return (
    <>
      <View style={styles.headerRow}>
        <Text style={resultTypography.sectionTitle}>{title}</Text>
        <View style={[styles.swatch, { backgroundColor: color }]} />
      </View>
      <View style={styles.chartRow}>
        <Text style={resultTypography.label}>{i18n.t('knittingChart')}:</Text>
        <TouchableOpacity style={styles.viewChartButton} onPress={onPress}>
          <Image
            source={require('@/assets/images/view1.png')}
            style={styles.viewIcon}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  swatch: {
    width: 17,
    height: 17,
    borderWidth: 1,
    borderColor: '#000',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  viewChartButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewIcon: {
    width: 25,
    height: 25,
    tintColor: '#ffffff',
  },
});

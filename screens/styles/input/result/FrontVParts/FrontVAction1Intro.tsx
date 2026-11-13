// Action 1 intro rows, start image, and front drawing (legend + carousel) for FrontV.

import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import i18n from '@/utils/translations';
import FrontVUnderstandingCarousel from '../FrontVUnderstandingCarousel';
import { RESULT_COLORS } from '../resultSharedStyles';
import { styles } from './styles';

const CREATE_STITCH_BLUE = '#00ADF2';

const DRAWING_LEGEND = [
  { color: RESULT_COLORS.front, labelKey: 'drawingLegendFront' as const },
  { color: RESULT_COLORS.sleeve, labelKey: 'drawingLegendSleeve' as const },
  { color: RESULT_COLORS.back, labelKey: 'drawingLegendBack' as const },
  { color: RESULT_COLORS.raglan, labelKey: 'drawingLegendRaglan' as const },
  { color: CREATE_STITCH_BLUE, labelKey: 'drawingLegendAdded' as const },
];

interface FrontVAction1IntroProps {
  nHv: number;
}

export function FrontVAction1Intro({ nHv }: FrontVAction1IntroProps) {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
          flexWrap: 'wrap',
        }}
      >
        <Text style={styles.subtitle}>{i18n.t('action')}1:</Text>
      </View>
      <View style={styles.infoRowmin}>
        <Text style={styles.leftLabel}>{i18n.t('knitting')}:</Text>
        <Image
          source={require('@/assets/images/znts8.svg')}
          style={styles.knitIconznts}
          contentFit="contain"
        />
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>{i18n.t('rows')}:</Text>
        <Text style={styles.boldNumber}>{nHv}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>{i18n.t('start')}:</Text>
        <Image
          source={require('@/assets/images/znstartfront.svg')}
          style={styles.styleznsfImage}
          contentFit="contain"
        />
      </View>
      <View style={styles.drawingBlock}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <Text style={styles.drawingTitle}>
            {i18n.t('drawingForUnderstanding')}
          </Text>
        </View>
        <View style={styles.drawingLegend}>
          {DRAWING_LEGEND.map((item) => (
            <View key={item.labelKey} style={styles.drawingLegendItem}>
              <View
                style={[
                  styles.drawingLegendSwatch,
                  { backgroundColor: item.color },
                ]}
              />
              <Text style={styles.drawingLegendLabel}>
                {i18n.t(item.labelKey)}
              </Text>
            </View>
          ))}
        </View>
        <FrontVUnderstandingCarousel />
      </View>
    </>
  );
}

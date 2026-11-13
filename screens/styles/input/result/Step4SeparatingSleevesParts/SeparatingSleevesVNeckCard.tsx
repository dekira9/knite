// Step 4 separating sleeves expandable body (v-neck variant).

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import i18n from '@/utils/translations';
import HorizontalScrollWithDots from '../HorizontalScrollWithDots';
import type { Step4SeparatingSleevesStylesVNeck } from './stylesVNeck';

export interface SeparatingSleevesVNeckCardProps {
  styles: Step4SeparatingSleevesStylesVNeck;
  sRostok: number;
  sleeveStitches: number;
  sPodr: number | string;
  handleScrollToTop1: () => void;
}

export function SeparatingSleevesVNeckCard({
  styles,
  sRostok,
  sleeveStitches,
  sPodr,
  handleScrollToTop1,
}: SeparatingSleevesVNeckCardProps) {
  const bodySection = (bodyKey: 'back' | 'front') => (
    <>
      <View style={styles.stitchBox}>
        <Text style={styles.resultText}>{i18n.t(bodyKey)}</Text>
        <View style={styles.grayIndicator} />
        <Text style={styles.resultText}>
          {i18n.t('stitches')}: {sRostok}
        </Text>
      </View>
      <View style={styles.roundIndicator}>
        <View style={styles.roundDot} />
      </View>
      <View style={styles.stitchBox}>
        <View style={styles.textBox}>
          <Text style={styles.textInsideBox}>{i18n.t('separateTheSleeve')}</Text>
        </View>
        <Text style={styles.resultText}>
          {i18n.t('stitches')}: {sleeveStitches}
        </Text>
      </View>
      <View style={styles.roundIndicator}>
        <View style={styles.roundDot} />
      </View>
      <View style={styles.stitchBox}>
        <View style={styles.magentaIndicator} />
        <Text style={styles.resultText}>
          {(i18n.t('stitches') || 'stitches')}: {sPodr || ''}
        </Text>
        <Text style={styles.createText}>{i18n.t('create') || 'create'}</Text>
        <Text style={styles.createText}>{i18n.t('underarmStitches') || 'underarmStitches'}</Text>
      </View>
      <View style={styles.roundIndicator}>
        <View style={styles.roundDot} />
      </View>
    </>
  );

  return (
    <View style={styles.resultCard}>
      <View style={styles.separatingHeader}>
        <Text style={styles.subtitle}>{i18n.t('separatingBodyAndSleeves')}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>{i18n.t('start')}:</Text>
        <View style={styles.startRow}>
          <TouchableOpacity onPress={handleScrollToTop1}>
            <Image
              source={require('@/assets/images/startend.svg')}
              style={styles.startendImage}
              contentFit="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>{i18n.t('knitting')}:</Text>
        <Image
          source={require('@/assets/images/knitcircle.svg')}
          style={styles.KnitCircleImage}
          contentFit="contain"
        />
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>{i18n.t('rows')}:</Text>
        <Text style={styles.boldNumber}>1</Text>
      </View>

      <View style={styles.divider} />

      <HorizontalScrollWithDots>
        <View style={styles.separatingLayout}>
          {bodySection('back')}
          {bodySection('front')}
        </View>
      </HorizontalScrollWithDots>
    </View>
  );
}

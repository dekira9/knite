// Step 4 separating sleeves expandable body (regular variant).

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import i18n from '@/utils/translations';
import HorizontalScrollWithDots from '../HorizontalScrollWithDots';
import type { Step4SeparatingSleevesStylesRegular } from './stylesRegular';

export interface SeparatingSleevesRegularCardProps {
  styles: Step4SeparatingSleevesStylesRegular;
  sRostok: number;
  sleeveStitches: number;
  sPodr: number;
  handleScrollToTop1: () => void;
}

export function SeparatingSleevesRegularCard({
  styles,
  sRostok,
  sleeveStitches,
  sPodr,
  handleScrollToTop1,
}: SeparatingSleevesRegularCardProps) {
  const bodySection = (bodyKey: 'back' | 'front') => (
  <>
    <View style={styles.stitchBox}>
      <Text style={styles.textinBox}>{i18n.t(bodyKey)}</Text>
      <View style={styles.grayIndicator} />
      <Text style={styles.textinBox}>
        {i18n.t('stitches')}: {sRostok}
      </Text>
    </View>
    <View style={styles.roundIndicator}>
      <View style={styles.roundDot} />
    </View>
    <View style={styles.stitchBox}>
      <View style={styles.textBox}>
        <Text style={styles.smallText}>{i18n.t('separateTheSleeve')}</Text>
      </View>
      <Text style={styles.textinBox}>
        {i18n.t('stitches')}: {sleeveStitches}
      </Text>
    </View>
    <View style={styles.roundIndicator}>
      <View style={styles.roundDot} />
    </View>
    <View style={styles.stitchBox}>
      <View style={styles.magentaIndicator} />
      <Text style={styles.textinBox}>
        {i18n.t('stitches')}: {sPodr}{' '}
      </Text>
      <Text style={styles.smallText}>{i18n.t('create')}</Text>
      <Text style={styles.smallText}>{i18n.t('underarmStitches')}</Text>
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
              style={styles.startvImage}
              contentFit="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>{i18n.t('knitting')}:</Text>
        <Image
          source={require('@/assets/images/knitcircle.svg')}
          style={styles.knitIcon}
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

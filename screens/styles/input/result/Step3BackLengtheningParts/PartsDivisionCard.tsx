// Step 3 "parts" card: back / front / sleeve stitch breakdown with plan link.

import React from 'react';
import { View, Text, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import i18n from '@/utils/translations';
import type { Step3Colors } from './colors';
import type { Step3BackLengtheningStylesRegular } from './stylesRegular';

type Step3Styles = Step3BackLengtheningStylesRegular;

export interface PartsDivisionCardProps {
  styles: Step3Styles;
  colors: Step3Colors;
  sRostok: number;
  frontTotal: number;
  frontCenter: number;
  skFront: number;
  sleeveTotal: number;
  sleeveCenter: number;
  ska: number;
  frontBodyBoxColor: string;
  sleeveBodyBoxColor: string;
  planImageSource: ImageSourcePropType;
  planTextWithResultText: boolean;
  handleScrollToTop: () => void;
  partsAnchorRef?: React.RefObject<View | null>;
}

export function PartsDivisionCard({
  styles,
  colors,
  sRostok,
  frontTotal,
  frontCenter,
  skFront,
  sleeveTotal,
  sleeveCenter,
  ska,
  frontBodyBoxColor,
  sleeveBodyBoxColor,
  planImageSource,
  planTextWithResultText,
  handleScrollToTop,
  partsAnchorRef,
}: PartsDivisionCardProps) {
  const raglanLineLabel = i18n.t('raglanline').replace(' ', '\n');

  return (
    <View ref={partsAnchorRef} style={styles.resultCard} collapsable={false}>
      <View style={styles.stepHeader}>
        <Text style={styles.subtitle}>{i18n.t('parts')}</Text>
        <TouchableOpacity onPress={handleScrollToTop} style={styles.planButton}>
          <Image source={planImageSource} style={styles.planImage} contentFit="contain" />
          <Text
            style={
              planTextWithResultText
                ? [styles.resultText, styles.planText]
                : styles.planText
            }
          >
            {i18n.t('plan')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.chartRow}>
        <Text style={styles.chartTitle}>{i18n.t('back')}</Text>
        <View
          style={[styles.indicator, { backgroundColor: colors.BLUE, width: 34, height: 17 }]}
        />
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>{i18n.t('stitches')}:</Text>
        <Text style={styles.boldNumber}>{sRostok}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.chartRow}>
        <Text style={styles.chartTitle}>{i18n.t('front')}</Text>
        <View
          style={[
            styles.indicatorLarge,
            {
              backgroundColor: colors.PINK,
              borderLeftWidth: 7,
              borderRightWidth: 7,
              borderLeftColor: colors.ORANGE,
              borderRightColor: colors.ORANGE,
            },
          ]}
        />
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>{i18n.t('stitches')}:</Text>
        <Text style={styles.boldNumber}>{frontTotal}</Text>
      </View>

      <View style={styles.frontPartsLayout}>
        <View style={styles.frontPartsContainer}>
          <View style={styles.frontPartsItem}>
            <View style={styles.orangeIndicator} />
            <Text style={[styles.resultText, styles.frontPartsText]}>
              {raglanLineLabel}: {'\n'}
              {skFront}
            </Text>
          </View>

          <View
            style={[styles.textBox, { backgroundColor: frontBodyBoxColor, justifyContent: 'center' }]}
          >
            <Text style={[styles.resultText, styles.frontPartsTextWithMargin]}>
              {i18n.t('stitches')}: {'\n'}
              {frontCenter}
            </Text>
          </View>

          <View style={styles.frontPartsItemWithMargin}>
            <View style={styles.orangeIndicator} />
            <Text style={[styles.resultText, styles.frontPartsText]}>
              {raglanLineLabel}: {'\n'}
              {skFront}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.chartRow}>
        <Text style={styles.chartTitle}>{i18n.t('sleeve')}</Text>
        <View
          style={[
            styles.indicatorLarge,
            {
              backgroundColor: colors.GREEN,
              borderLeftWidth: 7,
              borderRightWidth: 7,
              borderLeftColor: colors.ORANGE,
              borderRightColor: colors.ORANGE,
            },
          ]}
        />
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>{i18n.t('stitches')}:</Text>
        <Text style={styles.boldNumber}>{sleeveTotal}</Text>
      </View>

      <View style={styles.sleevePartsLayout}>
        <View style={styles.sleevePartsContainer}>
          <View style={styles.sleevePartsItem}>
            <View style={styles.orangeIndicator} />
            <Text style={[styles.resultText, styles.sleevePartsText]}>
              {raglanLineLabel}: {'\n'}
              {ska}
            </Text>
          </View>

          <View
            style={[styles.textBox, { backgroundColor: sleeveBodyBoxColor, justifyContent: 'center' }]}
          >
            <Text style={[styles.resultText, styles.sleevePartsTextWithMargin]}>
              {i18n.t('stitches')}: {'\n'}
              {sleeveCenter}
            </Text>
          </View>

          <View style={styles.sleevePartsItemWithMargin}>
            <View style={styles.orangeIndicator} />
            <Text style={[styles.resultText, styles.sleevePartsText]}>
              {raglanLineLabel}: {'\n'}
              {ska}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

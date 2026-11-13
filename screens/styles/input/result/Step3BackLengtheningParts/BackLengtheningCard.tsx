// Step 3 back lengthening summary card (yoke rows and horizontal stitch strip).

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import i18n from '@/utils/translations';
import { resultTypography } from '../resultSharedStyles';
import type { Step3Colors } from './colors';
import type { Step3BackLengtheningStylesRegular } from './stylesRegular';

type Step3Styles = Step3BackLengtheningStylesRegular;

export interface BackLengtheningCardProps {
  styles: Step3Styles;
  colors: Step3Colors;
  sRostok: number;
  nRostok: number;
  skFront: number;
  centerStitches: number;
  stitchLabelLayout: 'split' | 'combined';
  handleScrollToTop1: () => void;
}

export function BackLengtheningCard({
  styles,
  colors,
  sRostok,
  nRostok,
  skFront,
  centerStitches,
  stitchLabelLayout,
  handleScrollToTop1,
}: BackLengtheningCardProps) {
  const renderSideStitchBox = (stitches: number, key: string) => (
    <View key={key} style={styles.stitchBox}>
      <View style={styles.orangeIndicator} />
      {stitchLabelLayout === 'split' ? (
        <>
          <Text style={styles.resultText}>{i18n.t('stitches')}: </Text>
          <Text style={styles.resultText}>{stitches}</Text>
        </>
      ) : (
        <Text style={styles.resultText}>
          {i18n.t('stitches')}:{'\n'} {stitches}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.resultCard}>
      <View style={styles.stepHeader}>
        <Text style={styles.subtitle}>{i18n.t('backLengthening')}</Text>
        <View style={styles.indicatorsRow}>
          <View style={[styles.indicator, { backgroundColor: colors.BLUE }]} />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>{i18n.t('stitches')}:</Text>
        <Text style={styles.boldNumber}>{sRostok}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>{i18n.t('knitting')}:</Text>
        <Image
          source={require('@/assets/images/knitflat.svg')}
          style={styles.knitIcon}
          contentFit="contain"
        />
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>{i18n.t('rows')}:</Text>
        <Text style={styles.boldNumber}>{nRostok}</Text>
      </View>

      <Text style={[resultTypography.body, styles.slouchHint]}>
        {i18n.t('backLengtheningSlouchHint')}
      </Text>

      <View style={styles.infoRow}>
        <Text style={styles.leftLabel}>{i18n.t('start')}:</Text>
        <TouchableOpacity onPress={handleScrollToTop1}>
          <Image
            source={require('@/assets/images/startv.svg')}
            style={styles.startIcon}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={styles.horizontalRow}>
          {renderSideStitchBox(skFront, 'left')}
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot} />
          </View>
          <View style={styles.stitchBox}>
            <View style={styles.purpleIndicator} />
            {stitchLabelLayout === 'split' ? (
              <>
                <Text style={styles.resultText}>{i18n.t('stitches')}: </Text>
                <Text style={styles.resultText}>{centerStitches}</Text>
              </>
            ) : (
              <Text style={styles.resultText}>
                {i18n.t('stitches')}:{'\n'} {centerStitches}
              </Text>
            )}
          </View>
          <View style={styles.roundIndicator}>
            <View style={styles.roundDot} />
          </View>
          {renderSideStitchBox(skFront, 'right')}
        </View>
      </ScrollView>
    </View>
  );
}

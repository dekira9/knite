import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { screenWidth } from '@/utils/Layout';

const PIC_ASPECT = 1024 / 547;
/** Matches Result scrollContent paddingHorizontal. */
const SCROLL_PAD_X = 16;

/** Closing yarn artwork + localized taglines (text is not baked into the image). */
export default observer(function ResultClosingBanner() {
  return (
    <View
      style={styles.wrap}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${i18n.t('knittingPlanClosingLine1')} ${i18n.t('knittingPlanClosingLine2')}`}
    >
      <Image
        source={require('@/assets/images/picfantasy.png')}
        style={styles.image}
        contentFit="cover"
        cachePolicy="memory-disk"
      />
      <View style={styles.textBlock} pointerEvents="none">
        <Text style={styles.tagline}>{i18n.t('knittingPlanClosingLine1')}</Text>
        <Text style={[styles.tagline, styles.taglineSecond]}>
          {i18n.t('knittingPlanClosingLine2')}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    marginTop: 28,
    marginBottom: 16,
    marginLeft: -SCROLL_PAD_X,
    width: screenWidth,
    height: screenWidth / PIC_ASPECT,
    overflow: 'hidden',
    backgroundColor: '#F5F0EC',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  textBlock: {
    position: 'absolute',
    top: '12%',
    left: 28,
    right: 28,
    alignItems: 'center',
  },
  tagline: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 3.5,
    color: '#B8956A',
    textAlign: 'center',
  },
  taglineSecond: {
    marginTop: 8,
  },
});

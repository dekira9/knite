// Horizontal corpus stitch breakdown boxes for ResultStepV.

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import i18n from '@/utils/translations';
import { styles } from './styles';

interface CorpusBreakdownScrollProps {
  sRostok: number;
  sPodr: number;
}

export function CorpusBreakdownScroll({
  sRostok,
  sPodr,
}: CorpusBreakdownScrollProps) {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
      <View style={styles.corpusScrollRow}>
        <View style={styles.corpusBox}>
          <Text style={styles.textinBox}>{i18n.t('back')}</Text>
          <View style={styles.smallGrayIndicator}></View>
          <View style={styles.blueIndicator}></View>
          <Text style={styles.textinBox}>
            {i18n.t('stitches')}: {sRostok}
          </Text>
        </View>

        <View style={styles.roundIndicator}>
          <View style={styles.roundDot}></View>
        </View>

        <View style={styles.corpusBox}>
          <View style={styles.smallMagentaIndicator}></View>
          <View style={styles.blueIndicator}></View>
          <Text style={styles.textinBox}>
            {i18n.t('stitches')}: {sPodr} {'\n'}
            <Text style={styles.smallText}>{i18n.t('underarmStitches')}</Text>
          </Text>
        </View>

        <View style={styles.roundIndicator}>
          <View style={styles.roundDot}></View>
        </View>

        <View style={styles.corpusBox}>
          <Text style={styles.textinBox}>{i18n.t('front')}</Text>
          <View style={styles.smallGrayIndicator}></View>
          <View style={styles.blueIndicator}></View>
          <Text style={styles.textinBox}>
            {i18n.t('stitches')}: {sRostok}
          </Text>
        </View>

        <View style={styles.roundIndicator}>
          <View style={styles.roundDot}></View>
        </View>

        <View style={styles.corpusBox}>
          <View style={styles.smallMagentaIndicator}></View>
          <View style={styles.blueIndicator}></View>
          <Text style={styles.textinBox}>
            {i18n.t('stitches')}: {sPodr} {'\n'}
            <Text style={styles.smallText}>{i18n.t('underarmStitches')}</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

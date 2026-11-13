// Result title and sleeve/body overview image for ResultStepV.

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import i18n from '@/utils/translations';
import { styles } from './styles';

export function ResultStepVHero() {
  return (
    <>
      <Text style={styles.resultTitle}>{i18n.t('Result')}</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
        <View style={styles.resultContainer}>
          <Image
            source={require('@/assets/images/sleevebodyV2.png')}
            style={styles.resultImage}
          />
        </View>
      </ScrollView>
    </>
  );
}

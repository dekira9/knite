// Action 1 intro rows, start image, and front diagram scroll for FrontV.

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import i18n from '@/utils/translations';
import { styles } from './styles';

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
      <View
        style={{
          marginBottom: 10,
          marginLeft: 0,
          padding: 5,
          backgroundColor: '#E6E6E6',
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <Text style={styles.resultText}>
            {i18n.t('drawingForUnderstanding')}
          </Text>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              justifyContent: 'flex-start',
            }}
          >
            <Image
              source={require('@/assets/images/frontVan.png')}
              style={styles.frontImage}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
}

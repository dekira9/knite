import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import i18n from '@/utils/translations';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';
import { screenWidth } from '@/utils/Layout';

const HOME_BG_TOP = '#F5F0ED';
const HOME_BG_BOTTOM = '#F4F0ED';
const HOME_GOLD = '#B8956A';
const HOME_INK = '#2A2A2A';
const HOME_HERO_ASPECT = 853 / 763;

const HOME_FEATURES = [
  {
    key: 'calc',
    image: require('@/assets/images/calc.svg'),
    labelKey: 'homeFeatureCalc' as const,
  },
  {
    key: 'ragl',
    image: require('@/assets/images/ragl.svg'),
    labelKey: 'homeFeatureRaglan' as const,
  },
  {
    key: 'siz',
    image: require('@/assets/images/siz.svg'),
    labelKey: 'homeFeatureSize' as const,
  },
];

export default observer(() => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeFeatureKey, setActiveFeatureKey] = React.useState<string | null>(
    null,
  );

  const beginFlow = (mode: 'sample' | 'custom') => {
    introState.prepareStyleChoice(mode);
    (navigation as any).navigate('ChooseStyle');
  };

  return (
    <ScrollView
      style={[styles.homeContainer, { paddingTop: insets.top + 12 }]}
      contentContainerStyle={styles.homeContent}
    >
      <StatusBar style="dark" />

      <View style={styles.homeTop}>
        <View style={styles.homePadded}>
          <Image
            source={require('@/assets/images/zn.svg')}
            style={styles.brandMark}
            contentFit="contain"
          />

          <Text style={styles.brandLine1}>{i18n.t('homeBrandLine1')}</Text>
          <Text style={styles.brandLine2}>{i18n.t('homeBrandLine2')}</Text>
          <Text style={styles.tagline}>{i18n.t('homeTagline')}</Text>
        </View>

        <Image
          source={require('@/assets/images/home1.svg')}
          style={styles.heroImage}
          contentFit="contain"
        />
      </View>

      <View style={styles.homeBottom}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => beginFlow('custom')}
        >
          <Text style={styles.createButtonText}>{i18n.t('createNewProject')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.exampleLink}
          onPress={() => beginFlow('sample')}
        >
          <Text style={styles.exampleLinkText}>{i18n.t('viewExample')}</Text>
        </TouchableOpacity>

        <View style={styles.featuresRow}>
          {HOME_FEATURES.map((feature) => {
            const isActive = activeFeatureKey === feature.key;
            const label = i18n.t(feature.labelKey);
            return (
              <TouchableOpacity
                key={feature.key}
                style={styles.featureItem}
                onPress={() =>
                  setActiveFeatureKey((prev) =>
                    prev === feature.key ? null : feature.key,
                  )
                }
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected: isActive }}
              >
                <Image
                  source={feature.image}
                  style={styles.featureIcon}
                  contentFit="contain"
                />
                {isActive ? (
                  <Text style={styles.featureLabel}>{label}</Text>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: HOME_BG_BOTTOM,
  },
  homeContent: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  homeTop: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: HOME_BG_TOP,
  },
  homeBottom: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: HOME_BG_BOTTOM,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  homePadded: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  brandMark: {
    width: 72,
    height: 72,
    marginBottom: 18,
  },
  brandLine1: {
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 3,
    color: HOME_INK,
    textAlign: 'center',
  },
  brandLine2: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: HOME_INK,
    textAlign: 'center',
    marginTop: 2,
  },
  tagline: {
    marginTop: 14,
    marginBottom: 16,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 3.5,
    color: HOME_GOLD,
    textAlign: 'center',
  },
  heroImage: {
    width: screenWidth,
    aspectRatio: HOME_HERO_ASPECT,
  },
  featuresRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 24,
    marginBottom: 8,
    gap: 8,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
    minHeight: 72,
  },
  featureIcon: {
    width: 44,
    height: 44,
  },
  featureLabel: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 16,
    color: '#555',
    textAlign: 'center',
  },
  createButton: {
    width: '100%',
    backgroundColor: Colors.light.tint,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  exampleLink: {
    marginTop: 14,
    paddingVertical: 6,
  },
  exampleLinkText: {
    fontSize: 14,
    color: HOME_GOLD,
    fontWeight: '500',
    textAlign: 'center',
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import introState from '@/state/introState';
import i18n from '@/utils/translations';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const SampleMeasurementsBanner = observer(() => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  const handleEnterMeasurements = () => {
    introState.beginCustomMeasurements();
    (navigation as any).navigate('Input', { screen: 'Head' });
  };

  const showSampleWarning = introState.usesSampleMeasurements;

  return (
    <View style={showSampleWarning ? styles.banner : styles.buttonOnly}>
      {showSampleWarning && (
        <>
          <Text style={styles.title}>{i18n.t('sampleBannerTitle')}</Text>
          <Text style={styles.subtitle}>{i18n.t('sampleBannerSubtitle')}</Text>
        </>
      )}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors[theme].tint }]}
        onPress={handleEnterMeasurements}
      >
        <Text style={styles.buttonText}>{i18n.t('enterMyMeasurements')}</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  buttonOnly: {
    marginBottom: 12,
    marginHorizontal: 16,
  },
  banner: {
    backgroundColor: '#FFF8E6',
    borderWidth: 1,
    borderColor: '#F5D76E',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5C4A00',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B5B2E',
    marginBottom: 12,
    lineHeight: 18,
  },
  button: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default SampleMeasurementsBanner;

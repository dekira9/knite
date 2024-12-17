import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import i18n from '@/utils/translations';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import {screenWidth} from '@/utils/Layout';
import onboardingState from '@/state/onboardingState';

export default observer(() => {
  const router = useRouter();
  const currentLanguage = onboardingState.language;

  const raglanStyles = [
    { id: 'regular', label: i18n.t('regularCollar'), image: require('@/assets/images/regular-collar.png') },
    { id: 'v-neck', label: i18n.t('vNeck'), image: require('@/assets/images/v-neck.png') },
  ];

  const selectStyle = (styleId: string) => {
    introState.setStyle(styleId);
    router.push('/intro/head');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{i18n.t('chooseStyle')}</Text>
      
      {raglanStyles.map((style) => (
        <TouchableOpacity
          key={style.id}
          style={[
            styles.styleButton,
          ]}
          onPress={() => selectStyle(style.id)}
        >
          <Image source={style.image} style={styles.styleImage} />
          <Text style={styles.buttonTitle}>{style.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  styleButton: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  styleImage: {
    width: '100%',
    height: 150,
    marginBottom: 10,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  selectedStyle: {
    backgroundColor: '#e0e0e0',
  },
}); 
import React from 'react';
import {
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

export default observer(function ChooseStyle() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isCustomFlow = introState.styleChoiceMode === 'custom';

  const raglanStyles = [
    {
      id: 'regular' as const,
      label: i18n.t('regularCollar'),
      image: require('@/assets/images/regular-collar.png'),
    },
    {
      id: 'v-neck' as const,
      label: i18n.t('vNeck'),
      image: require('@/assets/images/v-neck.png'),
    },
  ];

  const selectStyleSample = async (styleId: 'regular' | 'v-neck') => {
    await introState.beginSampleFlow(styleId);
    (navigation as any).navigate('Result');
  };

  const selectStyleCustom = (styleId: 'regular' | 'v-neck') => {
    introState.beginCustomFlow(styleId);
    (navigation as any).navigate('Input', {
      screen: 'Head',
      params: { returnTo: 'ChooseStyle' },
    });
  };

  const selectStyle = (styleId: 'regular' | 'v-neck') => {
    if (isCustomFlow) {
      selectStyleCustom(styleId);
    } else {
      void selectStyleSample(styleId);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
    >
      <StatusBar style="dark" />

      <Text style={styles.title}>{i18n.t('chooseStyle')}</Text>
      <Text style={styles.hint}>
        {isCustomFlow ? i18n.t('stylesCustomHint') : i18n.t('stylesSampleHint')}
      </Text>

      {raglanStyles.map((style) => (
        <TouchableOpacity
          key={style.id}
          style={styles.styleButton}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  content: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  hint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
    lineHeight: 20,
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
});

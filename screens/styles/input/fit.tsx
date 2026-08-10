import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';

const FIT_IMAGES = {
  women: {
    fitted: require('@/assets/images/fit_women_fitted.png'),
    'semi-fitted': require('@/assets/images/fit_women_semi.png'),
    loose: require('@/assets/images/fit_women_loose.png'),
    oversized: require('@/assets/images/fit_women_oversized.png'),
  },
  men: {
    fitted: require('@/assets/images/fit_men_fitted.png'),
    'semi-fitted': require('@/assets/images/fit_men_semi.png'),
    loose: require('@/assets/images/fit_men_loose.png'),
    oversized: require('@/assets/images/fit_men_oversized.png'),
  },
} as const;

const FIT_ICONS = {
  fitted: require('@/assets/images/fit_icon_fittedR1.png'),
  'semi-fitted': require('@/assets/images/fit_icon_semiR.png'),
  loose: require('@/assets/images/fit_icon_looseR.svg'),
  oversized: require('@/assets/images/fit_icon_oversizedR.svg'),
} as const;

type FitId = keyof typeof FIT_IMAGES.women;

const FIT_LINE_KEYS: Record<FitId, readonly string[]> = {
  fitted: ['fittedBullet1', 'fittedBullet2', 'fittedBullet3'],
  'semi-fitted': ['semiFittedLine1', 'semiFittedLine2'],
  loose: ['looseLine1', 'looseLine2'],
  oversized: ['oversizedLine1', 'oversizedLine2'],
};

export default observer(() => {
  const navigation = useNavigation();
  const gender = introState.garmentFitFor === 'men' ? 'men' : 'women';

  const fitTypes: { id: FitId; label: string }[] = [
    { id: 'fitted', label: i18n.t('fitted') },
    { id: 'semi-fitted', label: i18n.t('semiFitted') },
    { id: 'loose', label: i18n.t('loose') },
    { id: 'oversized', label: i18n.t('oversized') },
  ];

  const selectFit = (fitId: string) => {
    introState.setFitType(fitId);
    introState.setStyleChosen(true);

    const selectedStyle = introState.style;
    if (selectedStyle === 'regular') {
      navigation.navigate('RibbingWidth');
    } else if (selectedStyle === 'v-neck') {
      navigation.navigate('RibbingWidthV');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>{i18n.t('chooseFitType')}</Text>

      <View style={styles.genderSwitch}>
        <TouchableOpacity
          style={[
            styles.genderOption,
            introState.garmentFitFor === 'women' && styles.genderOptionSelected,
          ]}
          onPress={() => introState.setGarmentFitFor('women')}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.genderOptionText,
              introState.garmentFitFor === 'women' && styles.genderOptionTextSelected,
            ]}
          >
            {i18n.t('garmentFitForWomen')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderOption,
            introState.garmentFitFor === 'men' && styles.genderOptionSelected,
          ]}
          onPress={() => introState.setGarmentFitFor('men')}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.genderOptionText,
              introState.garmentFitFor === 'men' && styles.genderOptionTextSelected,
            ]}
          >
            {i18n.t('garmentFitForMen')}
          </Text>
        </TouchableOpacity>
      </View>

      {fitTypes.map((fit) => (
        <TouchableOpacity
          key={fit.id}
          style={[
            styles.fitCard,
            introState.fitType === fit.id && styles.fitCardSelected,
          ]}
          onPress={() => selectFit(fit.id)}
        >
          <Text style={styles.fitTitle}>{fit.label}</Text>

          <View style={styles.fitCardRow}>
            <Image
              source={FIT_IMAGES[gender][fit.id]}
              style={styles.fitPhoto}
              contentFit="cover"
            />

            <View style={styles.fitRight}>
              <Image
                source={FIT_ICONS[fit.id]}
                style={styles.fitSchema}
                contentFit="contain"
              />
              <View style={styles.fitBullets}>
                {FIT_LINE_KEYS[fit.id].map((key, index) => (
                  <React.Fragment key={key}>
                    {index > 0 ? <View style={styles.fitBulletDot} /> : null}
                    <Text style={styles.fitBullet}>{i18n.t(key)}</Text>
                  </React.Fragment>
                ))}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 12,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  genderSwitch: {
    flexDirection: 'row',
    backgroundColor: '#F4EFEC',
    borderRadius: 999,
    padding: 4,
    marginBottom: 20,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderOptionSelected: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  genderOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8A7E78',
  },
  genderOptionTextSelected: {
    color: '#2A2A2A',
  },
  fitCard: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  fitCardSelected: {
    borderColor: Colors.light.tint,
    backgroundColor: '#f0f7f4',
  },
  fitCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  fitRight: {
    width: '36%',
    minWidth: 0,
    paddingLeft: 8,
  },
  fitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
    width: '100%',
  },
  fitSchema: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 6,
  },
  fitPhoto: {
    width: '62%',
    aspectRatio: 3 / 4,
    borderRadius: 8,
    backgroundColor: '#ebe6e0',
  },
  fitBullets: {
    alignItems: 'center',
    gap: 4,
  },
  fitBulletDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#A67C52',
    marginVertical: 2,
  },
  fitBullet: {
    fontSize: 12,
    lineHeight: 17,
    color: '#555',
    textAlign: 'center',
  },
});

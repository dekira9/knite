import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Image } from 'expo-image';

export default observer(() => {
  const navigation = useNavigation();

  const fitTypes = [
    { 
      id: 'fitted', 
      label: i18n.t('fitted'),
      image: require('@/assets/images/_slimN.svg')
    },
    { 
      id: 'semi-fitted', 
      label: i18n.t('semiFitted'),
      image: require('@/assets/images/_normN.svg')
    },
    { 
      id: 'loose', 
      label: i18n.t('loose'),
      image: require('@/assets/images/_freeN.svg')
    },
    { 
      id: 'oversized', 
      label: i18n.t('oversized'),
      image: require('@/assets/images/_superfreeN.svg')
    },
  ];

  const selectFit = (fitId: string) => {
    introState.setFitType(fitId);
    introState.setStyleChosen(true);

    // Determine the next screen based on the selected style
    const selectedStyle = introState.style; // Assuming style is stored in introState
    if (selectedStyle === 'regular') {
      navigation.navigate('RibbingWidth');
    } else if (selectedStyle === 'v-neck') {
      navigation.navigate('RibbingWidthV');
    }
  };

  return (
    <View style={styles.container}>      
      <Text style={styles.title}>{i18n.t('chooseFitType')}</Text>
      
      {fitTypes.map((fit) => (
        <TouchableOpacity
          key={fit.id}
          style={[
            styles.fitButton,
            introState.fitType === fit.id && styles.selectedFitButton
          ]}
          onPress={() => selectFit(fit.id)}
        >
          <Image 
            source={fit.image}
            style={styles.fitImage}
            contentFit="contain"
          />
          <Text style={styles.buttonText}>{fit.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
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
    marginBottom: 30,
    marginTop: 20,
    textAlign: 'center',
  },
  fitButton: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedFitButton: {

  },
  fitImage: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
}); 
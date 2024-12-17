import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';

export default observer(() => {
  const router = useRouter();

  const fitTypes = [
    { id: 'fitted', label: i18n.t('fitted') },
    { id: 'semi-fitted', label: i18n.t('semiFitted') },
    { id: 'loose', label: i18n.t('loose') },
    { id: 'oversized', label: i18n.t('oversized') },
  ];

  const selectFit = (fitId: string) => {
    introState.setFitType(fitId);
    router.push('/intro/result');
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
    textAlign: 'center',
  },
  fitButton: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedFitButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
}); 
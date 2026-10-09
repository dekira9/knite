import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';

const RaglanIndex = observer(() => {
  const navigation = useNavigation();

  const navigateToChart = (chartType: 'Ribbing' | 'Back' | 'Front' | 'Sleeve') => {
    (navigation as any).navigate(chartType);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('knittingCharts')}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToChart('Ribbing')}
      >
        <Text style={styles.buttonText}>{i18n.t('collarKnittingChart')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToChart('Back')}
      >
        <Text style={styles.buttonText}>{i18n.t('backKnittingChart')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToChart('Front')}
      >
        <Text style={styles.buttonText}>{i18n.t('frontKnittingChart')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToChart('Sleeve')}
      >
        <Text style={styles.buttonText}>{i18n.t('sleeveKnittingChart')}</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default RaglanIndex;

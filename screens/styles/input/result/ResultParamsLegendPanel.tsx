import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import SampleMeasurementsBanner from '@/components/SampleMeasurementsBanner';
import ResultColorLegend from './ResultColorLegend';

type Tab = 'parameters' | 'legend';

type Props = {
  variant: 'regular' | 'v-neck';
};

/** Fit-style pill switcher: Parameters ↔ Legend on the knitting plan. */
export default observer(function ResultParamsLegendPanel({ variant }: Props) {
  const [tab, setTab] = useState<Tab>('parameters');

  return (
    <View style={styles.wrapper}>
      <View style={styles.switcher}>
        <TouchableOpacity
          style={[styles.option, tab === 'parameters' && styles.optionSelected]}
          onPress={() => setTab('parameters')}
          accessibilityRole="button"
          accessibilityState={{ selected: tab === 'parameters' }}
        >
          <Text
            style={[
              styles.optionText,
              tab === 'parameters' && styles.optionTextSelected,
            ]}
          >
            {i18n.t('parametersHeading')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, tab === 'legend' && styles.optionSelected]}
          onPress={() => setTab('legend')}
          accessibilityRole="button"
          accessibilityState={{ selected: tab === 'legend' }}
        >
          <Text
            style={[
              styles.optionText,
              tab === 'legend' && styles.optionTextSelected,
            ]}
          >
            {i18n.t('resultLegendTitle')}
          </Text>
        </TouchableOpacity>
      </View>

      {tab === 'parameters' ? (
        <SampleMeasurementsBanner />
      ) : (
        <ResultColorLegend variant={variant} embedded />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    marginHorizontal: 16,
  },
  switcher: {
    flexDirection: 'row',
    backgroundColor: '#F4EFEC',
    borderRadius: 999,
    padding: 4,
    marginBottom: 10,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8A7E78',
  },
  optionTextSelected: {
    color: '#2A2A2A',
  },
});

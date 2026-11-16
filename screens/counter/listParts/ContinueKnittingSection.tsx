import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import rowCounterState from '@/state/rowCounterState';
import { track } from '@/utils/analytics';
import { CounterCard } from './CounterCard';

const HOME_GOLD = '#B8956A';
const HOME_INK = '#2A2A2A';

export const ContinueKnittingSection = observer(function ContinueKnittingSection() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const counters = rowCounterState.sortedCounters.slice(0, 2);
  if (counters.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{i18n.t('homeContinueKnitting')}</Text>
      {counters.map((counter) => (
        <CounterCard
          key={counter.id}
          counter={counter}
          onPress={() => {
            track('counter_opened_from_home');
            navigation.navigate('Counter', { counterId: counter.id });
          }}
        />
      ))}
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('Counters')}
        accessibilityRole="button"
      >
        <Text style={styles.linkText}>{i18n.t('homeAllCounters')}</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  section: {
    width: '100%',
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: HOME_INK,
    marginBottom: 10,
  },
  link: {
    alignSelf: 'center',
    marginTop: 6,
    paddingVertical: 6,
  },
  linkText: {
    fontSize: 14,
    color: HOME_GOLD,
    fontWeight: '500',
    textAlign: 'center',
  },
});

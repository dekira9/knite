import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import i18n from '@/utils/translations';
import rowCounterState from '@/state/rowCounterState';
import { Colors } from '@/constants/Colors';
import { track } from '@/utils/analytics';
import { CounterCard } from './listParts/CounterCard';

export default observer(function CountersListScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const insets = useSafeAreaInsets();
  const bottomPad = 56 + Math.max(insets.bottom, 8) + 10;
  const counters = rowCounterState.sortedCounters;

  const handleNewCounter = () => {
    const name = i18n.t('rowCounterDefaultName', { n: counters.length + 1 });
    const id = rowCounterState.addCounter(name);
    track('counter_created', { source: 'list' });
    navigation.navigate('Counter', { counterId: id });
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
    >
      <StatusBar style="dark" />

      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel={i18n.t('goBack')}
        >
          <Ionicons name="chevron-back" size={28} color={Colors.light.tint} />
        </TouchableOpacity>
        <Text style={styles.title}>{i18n.t('rowCountersTitle')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleNewCounter}>
        <Text style={styles.createButtonText}>{i18n.t('rowCounterNew')}</Text>
      </TouchableOpacity>

      <View style={styles.listSection}>
        {counters.length === 0 ? (
          <Text style={styles.emptyText}>{i18n.t('rowCountersEmpty')}</Text>
        ) : (
          counters.map((counter) => (
            <CounterCard
              key={counter.id}
              counter={counter}
              onPress={() =>
                navigation.navigate('Counter', { counterId: counter.id })
              }
            />
          ))
        )}
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
    marginRight: 4,
  },
  headerSpacer: {
    width: 36,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
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
  listSection: {
    width: '100%',
    marginTop: 28,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
});

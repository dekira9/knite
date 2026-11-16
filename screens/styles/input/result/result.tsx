import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import introState from '@/state/introState';
import rowCounterState from '@/state/rowCounterState';
import { buildKnitPlanSource } from '@/utils/knitPlan';
import { Colors } from '@/constants/Colors';
import { track } from '@/utils/analytics';
import RegularResult from './RegularResult';
import VNeckResult from './VNeckResult';

function readSavedProjectName(state: unknown): string {
  if (typeof state !== 'object' || state === null || !('projectName' in state)) {
    return '';
  }
  const value = state.projectName;
  return typeof value === 'string' ? value.trim() : '';
}

function projectDisplayName(): string {
  const projectId = introState.activeProjectId;
  if (projectId != null) {
    const saved = introState.savedProjects.find((project) => project.id === projectId);
    const savedName = readSavedProjectName(saved?.state);
    if (savedName) {
      return savedName;
    }
  }
  const current = introState.projectName.trim();
  if (current) {
    return current;
  }
  return i18n.t('knitPlanBadge');
}

export default observer(function ResultScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const source = buildKnitPlanSource(introState);
  const projectId = introState.activeProjectId;
  const existingPlan =
    projectId != null
      ? rowCounterState.findPlanCounterByProject(projectId)
      : undefined;

  const handleStartKnitting = () => {
    const planSource = buildKnitPlanSource(introState);
    if (planSource == null) {
      return;
    }
    const alreadyStarted =
      projectId != null
        ? rowCounterState.findPlanCounterByProject(projectId)
        : undefined;
    const id = rowCounterState.startPlanCounter({
      name: projectDisplayName(),
      projectId,
      source: planSource,
    });
    const style = introState.style === 'v-neck' ? 'v-neck' : 'regular';
    track('knit_plan_started', { style, existing: alreadyStarted != null });
    navigation.navigate('Counter', { counterId: id });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.result}>
        {introState.style === 'v-neck' ? <VNeckResult /> : <RegularResult />}
      </View>
      {source != null ? (
        <View style={styles.bar}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleStartKnitting}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>
              {existingPlan != null
                ? i18n.t('knitPlanContinue')
                : i18n.t('knitPlanStart')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  result: {
    flex: 1,
  },
  bar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#F8F9FA',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  button: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

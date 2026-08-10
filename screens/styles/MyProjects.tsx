import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import i18n from '@/utils/translations';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { setMyProjectsTabActive } from '@/navigation/myProjectsTabActive';

type ProjectState = {
  style?: string;
  chestCircumference?: string;
  garmentFitFor?: string;
  usesSampleMeasurements?: boolean;
  introFinished?: boolean;
  projectName?: string;
  lastChartStoppedId?: string | null;
  lastChartStoppedRow?: number;
  lastChartStoppedStitches?: number;
};

function projectMetaLabel(state: ProjectState) {
  const styleLabel =
    state.style === 'v-neck' ? i18n.t('vNeck') : i18n.t('regularCollar');
  const genderLabel =
    state.garmentFitFor === 'men'
      ? i18n.t('garmentFitForMen')
      : i18n.t('garmentFitForWomen');
  const chest = state.chestCircumference ?? '';
  const base = `${styleLabel} · ${genderLabel}`;
  return chest ? `${base} · ${chest} cm` : base;
}

function stopPlaceFromChartId(chartId?: string | null) {
  if (!chartId) return null;
  if (chartId.startsWith('ribbing')) return i18n.t('collar');
  if (chartId.startsWith('back')) return i18n.t('back');
  if (chartId.startsWith('front')) return i18n.t('front');
  if (chartId.startsWith('sleeve')) return i18n.t('sleeve');
  return chartId;
}

export default observer(function MyProjects() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [projectNameDrafts, setProjectNameDrafts] = React.useState<
    Record<string, string>
  >({});

  useFocusEffect(
    React.useCallback(() => {
      setMyProjectsTabActive(true);
      return () => setMyProjectsTabActive(false);
    }, []),
  );

  const beginNewProject = () => {
    introState.prepareStyleChoice('custom');
    (navigation as any).navigate('ChooseStyle');
  };

  const handleOpenProject = (id: string) => {
    const project = introState.savedProjects.find((p) => p.id === id);
    introState.restoreProject(id);
    const state = project?.state as ProjectState | undefined;
    if (state?.introFinished) {
      (navigation as any).navigate('Result');
    } else {
      (navigation as any).navigate('Input', {
        screen: 'Head',
        params: { returnTo: 'MyProjects' },
      });
    }
  };

  const handleDeleteProject = (id: string) => {
    Alert.alert(i18n.t('deleteProject'), i18n.t('deleteProjectConfirm'), [
      { text: i18n.t('cancel'), style: 'cancel' },
      {
        text: i18n.t('deleteProject'),
        style: 'destructive',
        onPress: () => introState.deleteProject(id),
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
    >
      <StatusBar style="dark" />

      <Text style={styles.title}>{i18n.t('myProjects')}</Text>

      <TouchableOpacity
        style={styles.createButton}
        onPress={beginNewProject}
      >
        <Text style={styles.createButtonText}>{i18n.t('createNewProject')}</Text>
      </TouchableOpacity>

      <View style={styles.savedSection}>
        {introState.savedProjects.length === 0 ? (
          <Text style={styles.emptyProjects}>{i18n.t('emptyProjects')}</Text>
        ) : (
          introState.savedProjects.map((project) => {
            const state = project.state as ProjectState;
            const draftValue = projectNameDrafts[project.id];
            const projectNameValue =
              draftValue !== undefined ? draftValue : state.projectName ?? '';
            const stopPlace = stopPlaceFromChartId(state.lastChartStoppedId);
            const hasStop =
              !!state.lastChartStoppedId &&
              !!stopPlace &&
              typeof state.lastChartStoppedRow === 'number' &&
              state.lastChartStoppedRow >= 1;
            const stopText = hasStop
              ? `${i18n.t('stop')}: ${stopPlace}, ${state.lastChartStoppedRow} ${i18n.t('rows')}`
              : null;
            return (
              <View key={project.id} style={styles.savedProjectRow}>
                <View style={styles.savedProjectButton}>
                  <TextInput
                    style={styles.projectNameInput}
                    value={projectNameValue}
                    onChangeText={(t) =>
                      setProjectNameDrafts((prev) => ({
                        ...prev,
                        [project.id]: t,
                      }))
                    }
                    onEndEditing={() => {
                      introState.renameProject(project.id, projectNameValue);
                      setProjectNameDrafts((prev) => {
                        const next = { ...prev };
                        delete next[project.id];
                        return next;
                      });
                    }}
                    placeholder={i18n.t('projectNamePlaceholder')}
                    placeholderTextColor="#9CA3AF"
                  />

                  <TouchableOpacity
                    style={styles.savedProjectOpenButton}
                    onPress={() => handleOpenProject(project.id)}
                  >
                    <Text style={styles.savedProjectMeta}>
                      {projectMetaLabel(state)}
                    </Text>
                    {stopText ? (
                      <Text style={styles.savedProjectStopText}>{stopText}</Text>
                    ) : null}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.deleteProjectButton}
                  onPress={() => handleDeleteProject(project.id)}
                  accessibilityLabel={i18n.t('deleteProject')}
                >
                  <Text style={styles.deleteProjectText}>✕</Text>
                </TouchableOpacity>
              </View>
            );
          })
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 20,
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
  savedSection: {
    width: '100%',
    marginTop: 28,
  },
  emptyProjects: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  savedProjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  savedProjectButton: {
    flex: 1,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6ddd0',
  },
  savedProjectOpenButton: {
    marginTop: 10,
  },
  projectNameInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    color: '#11181C',
  },
  deleteProjectButton: {
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6ddd0',
  },
  deleteProjectText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
  },
  savedProjectMeta: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  savedProjectStopText: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.light.tint,
    fontWeight: '500',
  },
});

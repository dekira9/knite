import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import i18n from '@/utils/translations';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';

function projectLabel(state: { style?: string; chestCircumference?: string }) {
  const styleLabel =
    state.style === 'v-neck' ? i18n.t('vNeck') : i18n.t('regularCollar');
  const chest = state.chestCircumference ?? '';
  return chest ? `${styleLabel} · ${chest} cm` : styleLabel;
}

export default observer(() => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const showStylePicker = introState.awaitingStyleChoice;

  useEffect(() => {
    if (introState.introFinished) {
      introState.setAwaitingStyleChoice(false);
      if (introState.style === 'regular') {
        navigation.navigate('Result', { screen: 'Result' });
      } else if (introState.style === 'v-neck') {
        navigation.navigate('Result', { screen: 'ResultV' });
      }
    }
  }, [introState.introFinished, introState.style]);

  const raglanStyles = [
    { id: 'regular', label: i18n.t('regularCollar'), image: require('@/assets/images/regular-collar.png') },
    { id: 'v-neck', label: i18n.t('vNeck'), image: require('@/assets/images/v-neck.png') },
  ];

  const selectStyle = async (styleId: 'regular' | 'v-neck') => {
    if (!introState.hasCustomMeasurements) {
      introState.applySamplePreset(styleId);
      introState.setUsesSampleMeasurements(true);
    } else {
      introState.setStyle(styleId);
      introState.setStyleChosen(true);
    }

    await introState.syncRaglanFromSupabase();
    introState.setAwaitingStyleChoice(false);
    introState.setIntroFinished(true);

    const resultScreen = styleId === 'v-neck' ? 'ResultV' : 'Result';
    (navigation as any).navigate('Result', { screen: resultScreen });
  };

  const handleNewProject = () => {
    introState.startNewProject();
  };

  const handleOpenProject = (id: string) => {
    introState.restoreProject(id);
    const resultScreen = introState.style === 'v-neck' ? 'ResultV' : 'Result';
    (navigation as any).navigate('Result', { screen: resultScreen });
  };

  const handleBackToProjects = () => {
    introState.setAwaitingStyleChoice(false);
  };

  const hasSavedProjects = introState.savedProjects.length > 0;

  if (showStylePicker) {
    return (
      <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />

        <TouchableOpacity style={styles.backButton} onPress={handleBackToProjects}>
          <Text style={styles.backButtonText}>← {i18n.t('back')}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{i18n.t('chooseStyle')}</Text>
        <Text style={styles.hint}>{i18n.t('stylesSampleHint')}</Text>

        {raglanStyles.map((style) => (
          <TouchableOpacity
            key={style.id}
            style={styles.styleButton}
            onPress={() => void selectStyle(style.id as 'regular' | 'v-neck')}
          >
            <Image source={style.image} style={styles.styleImage} />
            <Text style={styles.buttonTitle}>{style.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      <TouchableOpacity style={styles.newProjectButton} onPress={handleNewProject}>
        <Text style={styles.newProjectButtonText}>{i18n.t('newProject')}</Text>
      </TouchableOpacity>

      {hasSavedProjects && (
        <View style={styles.savedSection}>
          <Text style={styles.savedSectionTitle}>{i18n.t('recentProjects')}</Text>
          {introState.savedProjects.map((project) => (
            <TouchableOpacity
              key={project.id}
              style={styles.savedProjectButton}
              onPress={() => handleOpenProject(project.id)}
            >
              <Text style={styles.savedProjectTitle}>
                {projectLabel(project.state as { style?: string; chestCircumference?: string })}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  newProjectButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  newProjectButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.light.tint,
    fontWeight: '500',
  },
  savedSection: {
    marginBottom: 20,
  },
  savedSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
  },
  savedProjectButton: {
    padding: 14,
    marginBottom: 8,
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d0dce8',
  },
  savedProjectTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import i18n from '@/utils/translations';
import introState from '@/state/introState';
import onboardingState from '@/state/onboardingState';
import { observer } from 'mobx-react-lite';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';

type ProjectState = {
  style?: string;
  chestCircumference?: string;
  usesSampleMeasurements?: boolean;
  introFinished?: boolean;
};

function projectLabel(state: ProjectState) {
  const styleLabel =
    state.style === 'v-neck' ? i18n.t('vNeck') : i18n.t('regularCollar');
  const chest = state.chestCircumference ?? '';
  return chest ? `${styleLabel} · ${chest} cm` : `${styleLabel} · ${i18n.t('newProject')}`;
}

export default observer(() => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const showStylePicker = introState.awaitingStyleChoice;
  const isCustomFlow = introState.styleChoiceMode === 'custom';
  const [showIntroModal, setShowIntroModal] = useState(
    () => !onboardingState.hasSeenHomeIntro,
  );

  const raglanStyles = [
    { id: 'regular', label: i18n.t('regularCollar'), image: require('@/assets/images/regular-collar.png') },
    { id: 'v-neck', label: i18n.t('vNeck'), image: require('@/assets/images/v-neck.png') },
  ];

  const selectStyleSample = async (styleId: 'regular' | 'v-neck') => {
    await introState.beginSampleFlow(styleId);
    (navigation as any).navigate('Result');
  };

  const selectStyleCustom = (styleId: 'regular' | 'v-neck') => {
    introState.beginCustomFlow(styleId);
    (navigation as any).navigate('Input', { screen: 'Head' });
  };

  const selectStyle = (styleId: 'regular' | 'v-neck') => {
    if (isCustomFlow) {
      selectStyleCustom(styleId);
    } else {
      selectStyleSample(styleId);
    }
  };

  const beginFlow = (mode: 'sample' | 'custom') => {
    introState.prepareStyleChoice(mode);
  };

  const dismissIntro = (mode: 'sample' | 'custom') => {
    onboardingState.setHasSeenHomeIntro(true);
    setShowIntroModal(false);
    beginFlow(mode);
  };

  const handleOpenProject = (id: string) => {
    const project = introState.savedProjects.find((p) => p.id === id);
    introState.restoreProject(id);
    const state = project?.state as ProjectState | undefined;
    if (state?.introFinished) {
      (navigation as any).navigate('Result');
    } else {
      (navigation as any).navigate('Input', { screen: 'Head' });
    }
  };

  const handleDeleteProject = (id: string) => {
    Alert.alert(
      i18n.t('deleteProject'),
      i18n.t('deleteProjectConfirm'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('deleteProject'),
          style: 'destructive',
          onPress: () => introState.deleteProject(id),
        },
      ],
    );
  };

  const handleBackToHome = () => {
    introState.setAwaitingStyleChoice(false);
    introState.setStyleChoiceMode(null);
  };

  if (showStylePicker) {
    return (
      <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />

        <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
          <Text style={styles.backButtonText}>← {i18n.t('back')}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{i18n.t('chooseStyle')}</Text>
        <Text style={styles.hint}>
          {isCustomFlow ? i18n.t('stylesCustomHint') : i18n.t('stylesSampleHint')}
        </Text>

        {raglanStyles.map((style) => (
          <TouchableOpacity
            key={style.id}
            style={styles.styleButton}
            onPress={() => selectStyle(style.id as 'regular' | 'v-neck')}
          >
            <Image source={style.image} style={styles.styleImage} />
            <Text style={styles.buttonTitle}>{style.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  return (
    <>
      <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />

        <Text style={styles.homeTitle}>{i18n.t('homeTitle')}</Text>
        <Text style={styles.homeSubtitle}>{i18n.t('homeSubtitle')}</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => beginFlow('custom')}
        >
          <Text style={styles.primaryButtonText}>{i18n.t('startWithMyMeasurements')}</Text>
          <Text style={styles.buttonHint}>{i18n.t('startWithMyMeasurementsHint')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => beginFlow('sample')}
        >
          <Text style={styles.secondaryButtonText}>{i18n.t('viewExample')}</Text>
          <Text style={styles.secondaryButtonHint}>{i18n.t('viewExampleHint')}</Text>
        </TouchableOpacity>

        <View style={styles.savedSection}>
          <Text style={styles.savedSectionTitle}>{i18n.t('myProjects')}</Text>
          {introState.savedProjects.length === 0 ? (
            <Text style={styles.emptyProjects}>{i18n.t('emptyProjects')}</Text>
          ) : (
            introState.savedProjects.map((project) => {
              const state = project.state as ProjectState;
              return (
                <View key={project.id} style={styles.savedProjectRow}>
                  <TouchableOpacity
                    style={styles.savedProjectButton}
                    onPress={() => handleOpenProject(project.id)}
                  >
                    <Text style={styles.savedProjectTitle}>{projectLabel(state)}</Text>
                  </TouchableOpacity>
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

      {/* <Modal visible={showIntroModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{i18n.t('homeIntroTitle')}</Text>
            <Text style={styles.modalSubtitle}>{i18n.t('homeIntroSubtitle')}</Text>

            <TouchableOpacity
              style={styles.modalPrimaryButton}
              onPress={() => dismissIntro('custom')}
            >
              <Text style={styles.modalPrimaryButtonText}>
                {i18n.t('homeIntroCustomBtn')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondaryButton}
              onPress={() => dismissIntro('sample')}
            >
              <Text style={styles.modalSecondaryButtonText}>
                {i18n.t('homeIntroExampleBtn')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  homeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#111',
  },
  homeSubtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 21,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonHint: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  secondaryButtonText: {
    color: '#222',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  secondaryButtonHint: {
    color: '#777',
    fontSize: 13,
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
  emptyProjects: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
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
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d0dce8',
  },
  deleteProjectButton: {
    padding: 14,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  deleteProjectText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#111',
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  modalPrimaryButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalPrimaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSecondaryButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  modalSecondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import i18n from '@/utils/translations';
import rowCounterState from '@/state/rowCounterState';
import { Colors } from '@/constants/Colors';
import { track } from '@/utils/analytics';
import {
  buildKnitPlan,
  getKnitPlanRowInfo,
  type KnitPlanSource,
} from '@/utils/knitPlan';
import { counterScreenStyles as styles } from './counterParts/counterScreenStyles';
import { PlanCounterBody } from './counterParts/PlanCounterBody';
import { SimpleCounterBody } from './counterParts/SimpleCounterBody';

type CounterRouteParams = {
  Counter: { counterId: string };
};

function isPlanSourceValid(
  source: KnitPlanSource | null | undefined,
): source is KnitPlanSource {
  return source != null && source.version === 1;
}

export default observer(function CounterScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<CounterRouteParams, 'Counter'>>();
  const { counterId } = route.params;
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const counter = rowCounterState.getCounter(counterId);

  const [targetDraft, setTargetDraft] = useState('');
  const [noteDraft, setNoteDraft] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [renameDraft, setRenameDraft] = useState('');

  const planActive =
    counter?.kind === 'plan' && isPlanSourceValid(counter.planSource);
  const planBroken = counter?.kind === 'plan' && !planActive;

  const plan = useMemo(() => {
    if (!planActive || !counter?.planSource) {
      return null;
    }
    return buildKnitPlan(counter.planSource);
  }, [planActive, counter?.planSource]);

  const currentPhase = plan?.phases[counter?.phaseIndex ?? 0];

  const rowAboutToKnit = useMemo(() => {
    if (!planActive || !counter || !currentPhase) {
      return 1;
    }
    const rowsDone = counter.count;
    if (currentPhase.rows != null && currentPhase.rows > 0) {
      return Math.min(rowsDone + 1, currentPhase.rows);
    }
    return rowsDone + 1;
  }, [planActive, counter, currentPhase]);

  const rowInfo = useMemo(() => {
    if (!planActive || !counter?.planSource) {
      return null;
    }
    return getKnitPlanRowInfo(
      counter.planSource,
      counter.phaseIndex,
      rowAboutToKnit,
    );
  }, [planActive, counter?.planSource, counter?.phaseIndex, rowAboutToKnit]);

  useEffect(() => {
    track('counter_opened');
    if (!rowCounterState.getCounter(counterId)) {
      navigation.goBack();
    }
  }, [counterId, navigation]);

  useEffect(() => {
    if (!counter) {
      return;
    }
    setTargetDraft(counter.target != null ? String(counter.target) : '');
    setNoteDraft(counter.note);
    setRenameDraft(counter.name);
  }, [counter?.id, counter?.target, counter?.note, counter?.name]);

  const commitTarget = useCallback(() => {
    if (!counter || planActive) {
      return;
    }
    const trimmed = targetDraft.trim();
    if (trimmed === '') {
      rowCounterState.setTarget(counterId, null);
      return;
    }
    const parsed = Number(trimmed);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      setTargetDraft(counter.target != null ? String(counter.target) : '');
      return;
    }
    rowCounterState.setTarget(counterId, parsed);
  }, [counter, counterId, targetDraft, planActive]);

  const commitNote = useCallback(() => {
    if (!counter) {
      return;
    }
    rowCounterState.setNote(counterId, noteDraft);
  }, [counter, counterId, noteDraft]);

  const runIncrementHaptic = useCallback(() => {
    if (planActive && rowInfo?.phaseId === 'raglanIncreases') {
      void Haptics.impactAsync(
        rowInfo.isIncreaseRow
          ? Haptics.ImpactFeedbackStyle.Heavy
          : Haptics.ImpactFeedbackStyle.Light,
      );
      return;
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [planActive, rowInfo]);

  const handleIncrement = () => {
    if (!counter) {
      return;
    }
    const prevCount = counter.count;
    rowCounterState.increment(counterId);
    runIncrementHaptic();
    if (!planActive) {
      if (counter.target != null && counter.count === counter.target) {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      return;
    }
    if (
      currentPhase?.rows != null &&
      currentPhase.rows > 0 &&
      prevCount + 1 === currentPhase.rows
    ) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const promptRename = () => {
    if (!counter) {
      return;
    }
    if (Platform.OS === 'ios' && Alert.prompt) {
      Alert.prompt(
        i18n.t('rowCounterRename'),
        undefined,
        [
          { text: i18n.t('cancel'), style: 'cancel' },
          {
            text: i18n.t('rowCounterRename'),
            onPress: (value?: string) => {
              const name = (value ?? '').trim();
              if (name) {
                rowCounterState.rename(counterId, name);
              }
            },
          },
        ],
        'plain-text',
        counter.name,
      );
    } else {
      setRenameDraft(counter.name);
      setRenaming(true);
    }
  };

  const commitRename = () => {
    const name = renameDraft.trim();
    if (name) {
      rowCounterState.rename(counterId, name);
    }
    setRenaming(false);
  };

  const handleDelete = () => {
    Alert.alert(
      i18n.t('rowCounterDelete'),
      i18n.t('rowCounterDeleteConfirm'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        {
          text: i18n.t('rowCounterDelete'),
          style: 'destructive',
          onPress: () => {
            rowCounterState.removeCounter(counterId);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const handleReset = () => {
    Alert.alert(i18n.t('rowCounterReset'), i18n.t('rowCounterResetConfirm'), [
      { text: i18n.t('cancel'), style: 'cancel' },
      {
        text: i18n.t('rowCounterReset'),
        style: 'destructive',
        onPress: () => rowCounterState.resetCount(counterId),
      },
    ]);
  };

  if (!counter) {
    return null;
  }

  const tapHeight = windowHeight * 0.45;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[styles.container, { paddingTop: insets.top }]}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar style="dark" />

        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => {
              commitTarget();
              commitNote();
              navigation.goBack();
            }}
            accessibilityLabel={i18n.t('goBack')}
          >
            <Ionicons name="chevron-back" size={28} color={Colors.light.tint} />
          </TouchableOpacity>

          {renaming ? (
            <TextInput
              style={styles.nameInput}
              value={renameDraft}
              onChangeText={setRenameDraft}
              onBlur={commitRename}
              onSubmitEditing={commitRename}
              autoFocus
              returnKeyType="done"
            />
          ) : (
            <TouchableOpacity style={styles.nameWrap} onPress={promptRename}>
              <Text style={styles.nameText} numberOfLines={2}>
                {counter.name}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.headerIcon}
            onPress={handleDelete}
            accessibilityLabel={i18n.t('rowCounterDelete')}
          >
            <Ionicons name="trash-outline" size={22} color="#888" />
          </TouchableOpacity>
        </View>

        {planBroken ? (
          <Text style={styles.missingProject}>
            {i18n.t('knitPlanProjectMissing')}
          </Text>
        ) : null}

        {planActive && plan && counter.planSource ? (
          <PlanCounterBody
            counterId={counterId}
            phaseIndex={counter.phaseIndex}
            count={counter.count}
            plan={plan}
            planSource={counter.planSource}
            rowAboutToKnit={rowAboutToKnit}
            rowInfo={rowInfo}
            tapHeight={tapHeight}
            onIncrement={handleIncrement}
            onNextPhase={() => rowCounterState.nextPhase(counterId)}
          />
        ) : (
          <SimpleCounterBody
            count={counter.count}
            target={counter.target}
            tapHeight={tapHeight}
            onIncrement={handleIncrement}
          />
        )}

        <View style={styles.secondaryRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => rowCounterState.decrement(counterId)}
          >
            <Text style={styles.secondaryButtonText}>−1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleReset}
          >
            <Text style={styles.secondaryButtonText}>
              {i18n.t('rowCounterReset')}
            </Text>
          </TouchableOpacity>
        </View>

        {!planActive ? (
          <>
            <Text style={styles.fieldLabel}>{i18n.t('rowCounterTarget')}</Text>
            <TextInput
              style={styles.fieldInput}
              value={targetDraft}
              onChangeText={setTargetDraft}
              onBlur={commitTarget}
              onSubmitEditing={commitTarget}
              keyboardType="number-pad"
              returnKeyType="done"
              placeholder="—"
              placeholderTextColor="#9CA3AF"
            />
          </>
        ) : null}

        <Text style={styles.fieldLabel}>{i18n.t('rowCounterNote')}</Text>
        <TextInput
          style={[styles.fieldInput, styles.noteInput]}
          value={noteDraft}
          onChangeText={setNoteDraft}
          onBlur={commitNote}
          multiline
          placeholder={i18n.t('rowCounterNotePlaceholder')}
          placeholderTextColor="#9CA3AF"
          textAlignVertical="top"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

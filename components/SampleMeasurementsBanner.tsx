import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import introState from '@/state/introState';
import onboardingState from '@/state/onboardingState';
import i18n from '@/utils/translations';

const CM_PER_INCH = 2.54;
const INCH_PER_CM = 2.54;

function cmToIn(cm: string | number): string {
  const val = typeof cm === 'string' ? parseFloat(cm.replace(',', '.')) : cm;
  if (isNaN(val)) return '—';
  return (val / CM_PER_INCH).toFixed(1);
}

function per10cmToPer4in(val: string): string {
  const v = parseFloat(val.replace(',', '.'));
  if (isNaN(v)) return '—';
  return ((v * 4 * INCH_PER_CM) / 10).toFixed(1);
}

const FIT_TYPE_KEYS: Record<string, string> = {
  fitted: 'fitted',
  'semi-fitted': 'semiFitted',
  loose: 'loose',
  oversized: 'oversized',
};

type ParamRow = { label: string; value: string };

const SampleMeasurementsBanner = observer(() => {
  const [projectNameDraft, setProjectNameDraft] = useState<string | null>(null);
  const isMetric = onboardingState.measurementSystem === 'metric';
  const isVNeck = introState.style === 'v-neck';
  const isSample = introState.usesSampleMeasurements;
  const styleLabel = isVNeck ? i18n.t('vNeck') : i18n.t('regularCollar');
  const projectNameValue =
    projectNameDraft !== null ? projectNameDraft : introState.projectName;

  const formatLength = (cm: string | number) => {
    const cmStr = String(cm);
    return isMetric ? `${cmStr} cm` : `${cmToIn(cmStr)} in`;
  };

  const densitySuffix = isMetric ? '/ 10 cm' : '/ 4 in';
  const stitchVal = isMetric
    ? introState.stitchDensity
    : per10cmToPer4in(introState.stitchDensity);
  const rowVal = isMetric
    ? introState.rowDensity
    : per10cmToPer4in(introState.rowDensity);
  const fitKey = FIT_TYPE_KEYS[introState.fitType] ?? introState.fitType;

  const params: ParamRow[] = [
    { label: i18n.t('headCircumference'), value: formatLength(introState.headCircumference) },
    { label: i18n.t('neckCircumference'), value: formatLength(introState.neckCircumference) },
    { label: i18n.t('chestCircumference'), value: formatLength(introState.chestCircumference) },
    {
      label: i18n.t('stitchDensity'),
      value: `${stitchVal} ${densitySuffix}`,
    },
    {
      label: i18n.t('rowDensity'),
      value: `${rowVal} ${densitySuffix}`,
    },
    { label: i18n.t('fitType'), value: i18n.t(fitKey) },
    {
      label: i18n.t('garmentFitFor'),
      value:
        introState.garmentFitFor === 'men'
          ? i18n.t('garmentFitForMen')
          : i18n.t('garmentFitForWomen'),
    },
  ];

  if (isVNeck) {
    params.push(
      { label: i18n.t('collarWidth'), value: formatLength(introState.ribbingWidthV) },
      {
        label: i18n.t('RaglanLineWidth'),
        value: `${introState.raglanLineWidthV} ${i18n.t('stitches')}`,
      },
    );
    if (introState.depthNeckV !== undefined) {
      const totalDepth = introState.depthNeckV + introState.ribbingWidthV;
      params.push({ label: i18n.t('depthNeck'), value: formatLength(totalDepth) });
    }
  } else {
    params.push(
      { label: i18n.t('collarWidth'), value: formatLength(introState.ribbingWidth) },
      {
        label: i18n.t('RaglanLineWidth'),
        value: `${introState.raglanLineWidth} ${i18n.t('stitches')}`,
      },
    );
  }

  const bodyStitches = isVNeck
    ? (introState.SRostokV || introState.SRostok) * 2 +
      (introState.SPodrV || introState.SPodr) * 2
    : introState.SRostok * 2 + introState.SPodr * 2;
  const stitchesPerCm =
    parseFloat(String(introState.stitchDensity).replace(',', '.')) / 10;
  const finishedChestCm =
    stitchesPerCm > 0 && bodyStitches > 0
      ? bodyStitches / stitchesPerCm
      : NaN;

  if (!Number.isNaN(finishedChestCm)) {
    params.push({
      label: i18n.t('finishedChestCircumference'),
      value: formatLength(parseFloat(finishedChestCm.toFixed(1))),
    });
  }

  const commitProjectName = () => {
    const name = projectNameDraft !== null ? projectNameDraft : introState.projectName;
    if (introState.activeProjectId) {
      introState.renameProject(introState.activeProjectId, name);
    } else {
      introState.setProjectName(name);
    }
    setProjectNameDraft(null);
  };

  return (
    <View style={styles.banner}>
      <Text
        style={[
          styles.styleTitle,
          isSample ? styles.styleTitleSample : styles.styleTitleCustom,
        ]}
      >
        {styleLabel}
      </Text>

      <Text
        style={[
          styles.projectNameLabel,
          isSample ? styles.paramLabelSample : styles.paramLabelCustom,
        ]}
      >
        {i18n.t('projectNamePlaceholder')}
      </Text>
      <TextInput
        style={[
          styles.projectNameInput,
          isSample ? styles.projectNameInputSample : styles.projectNameInputCustom,
        ]}
        value={projectNameValue}
        onChangeText={setProjectNameDraft}
        onEndEditing={commitProjectName}
        onBlur={commitProjectName}
        placeholder={i18n.t('projectNamePlaceholder')}
        placeholderTextColor="#9CA3AF"
      />

      <View style={styles.paramsList}>
        {params.map((param) => (
          <View key={param.label} style={styles.paramRow}>
            <Text
              style={[
                styles.paramLabel,
                isSample ? styles.paramLabelSample : styles.paramLabelCustom,
              ]}
            >
              {param.label}
            </Text>
            <Text
              style={[
                styles.paramValue,
                isSample ? styles.paramValueSample : styles.paramValueCustom,
              ]}
            >
              {param.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#F4EFEC',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 8,
  },
  styleTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  styleTitleSample: {
    color: '#5C4A00',
  },
  styleTitleCustom: {
    color: '#222',
  },
  projectNameLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  projectNameInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    fontWeight: '600',
  },
  projectNameInputSample: {
    borderColor: '#E0D5CF',
    backgroundColor: '#fff',
    color: '#5C4A00',
  },
  projectNameInputCustom: {
    borderColor: '#E0D5CF',
    backgroundColor: '#fff',
    color: '#222',
  },
  paramsList: {
    gap: 6,
    marginTop: 4,
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  paramLabel: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  paramLabelSample: {
    color: '#6B5B2E',
  },
  paramLabelCustom: {
    color: '#555',
  },
  paramValue: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
    flexShrink: 0,
    lineHeight: 18,
  },
  paramValueSample: {
    color: '#5C4A00',
  },
  paramValueCustom: {
    color: '#222',
  },
});

export default SampleMeasurementsBanner;

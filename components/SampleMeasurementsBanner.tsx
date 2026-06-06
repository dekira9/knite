import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
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
  return (v * 4 * INCH_PER_CM / 10).toFixed(1);
}

const FIT_TYPE_KEYS: Record<string, string> = {
  fitted: 'fitted',
  'semi-fitted': 'semiFitted',
  loose: 'loose',
  oversized: 'oversized',
};

type ParamRow = { label: string; value: string };

type Props = {
  collapsible?: boolean;
};

const SampleMeasurementsBanner = observer(({ collapsible = false }: Props) => {
  const [expanded, setExpanded] = useState(!collapsible);
  const isMetric = onboardingState.measurementSystem === 'metric';
  const isVNeck = introState.style === 'v-neck';
  const isSample = introState.usesSampleMeasurements;
  const styleLabel = isVNeck ? i18n.t('vNeck') : i18n.t('regularCollar');

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

  return (
    <View style={[styles.banner, isSample ? styles.bannerSample : styles.bannerCustom]}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={[styles.title, isSample ? styles.titleSample : styles.titleCustom]}>
            {isSample ? i18n.t('sampleBannerTitle') : styleLabel}
          </Text>
          {isSample && <Text style={styles.styleSubtitle}>{styleLabel}</Text>}
        </View>
        {collapsible && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setExpanded((prev) => !prev)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.toggleButtonText}>
              {expanded ? i18n.t('collapseMeasurements') : i18n.t('expandMeasurements')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {expanded && (
        <>
          <View style={styles.paramsList}>
            {params.map((param) => (
              <View key={param.label} style={styles.paramRow}>
                <Text style={[styles.paramLabel, isSample ? styles.paramLabelSample : styles.paramLabelCustom]}>
                  {param.label}
                </Text>
                <Text style={[styles.paramValue, isSample ? styles.paramValueSample : styles.paramValueCustom]}>
                  {param.value}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  banner: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1,
  },
  bannerSample: {
    backgroundColor: '#FFF8E6',
    borderColor: '#F5D76E',
  },
  bannerCustom: {
    backgroundColor: '#f0f4f8',
    borderColor: '#d0dce8',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  titleGroup: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
  },
  toggleButton: {
    flexShrink: 0,
    paddingVertical: 2,
  },
  toggleButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.tint,
  },
  titleSample: {
    color: '#5C4A00',
  },
  titleCustom: {
    color: '#222',
  },
  styleSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B5B2E',
    marginBottom: 0,
  },
  sampleBadge: {
    backgroundColor: '#FFF8E6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#F5D76E',
  },
  sampleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5C4A00',
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

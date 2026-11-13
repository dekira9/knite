// Horizontal increase-type picker and expanded option details for front v-neck chart.
import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import i18n from '@/utils/translations';
import { Colors } from '@/constants/Colors';
import type { buildVNeckIncreaseRowStrings } from '../increaseRowSelection';
import { isRaglanOutput } from './calc';
import { styles } from './styles';

type IncreaseStrings = ReturnType<typeof buildVNeckIncreaseRowStrings>;

export type FrontVIncreaseOptionsProps = {
  usedIncreaseTypeV: string[] | null | undefined;
  screenWidth: number;
  colorScheme: ReturnType<typeof useColorScheme>;
  selectedIncreaseType: string;
  isDetailsExpanded: boolean;
  handleIncreaseTypePress: (type: string) => void;
  results: unknown;
  increaseStrings: IncreaseStrings;
};

export function FrontVIncreaseOptions({
  usedIncreaseTypeV,
  screenWidth,
  colorScheme,
  selectedIncreaseType,
  isDetailsExpanded,
  handleIncreaseTypePress,
  results,
  increaseStrings,
}: FrontVIncreaseOptionsProps) {
  const colors = Colors[(colorScheme ?? 'light') as keyof typeof Colors];

  return (
    <View style={styles.optionsContainer}>
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContainer}
        showsHorizontalScrollIndicator={false}
      >
        <View style={[styles.horContainerTop]}>
          {usedIncreaseTypeV && Array.isArray(usedIncreaseTypeV) ? (
            usedIncreaseTypeV.map((type: string) => (
              <View key={type} style={[styles.section, { marginRight: 10, width: screenWidth * 0.7 }]}>
                <TouchableOpacity
                  onPress={() => handleIncreaseTypePress(type)}
                  style={[
                    styles.optionButton,
                    selectedIncreaseType === type ? { backgroundColor: colors.tint } : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.resultText,
                      selectedIncreaseType === type ? styles.selectedOptionText : null,
                      { fontWeight: 'bold', marginTop: 0 },
                    ]}
                  >
                    {i18n.t?.('option') + ' ' + type}
                  </Text>
                  <Ionicons
                    name={
                      selectedIncreaseType === type && isDetailsExpanded ? 'chevron-up' : 'chevron-down'
                    }
                    size={16}
                    color={
                      selectedIncreaseType === type
                        ? colors.tint === '#FFFFFF'
                          ? '#333'
                          : '#FFFFFF'
                        : colors.tint
                    }
                    style={styles.chevronIcon}
                  />
                </TouchableOpacity>
                {type === '1x2, 1x4' &&
                  isRaglanOutput(results) &&
                  selectedIncreaseType === type &&
                  isDetailsExpanded && (
                    <>
                      <Text style={styles.resultText}>
                        {'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.PR_1x2_fV}
                      </Text>
                      <Text style={styles.resultText}>
                        {'1 ' + i18n.t('stitches') + ' x 4 ' + i18n.t('rows') + ': ' + results.PR_1x4_fV}
                      </Text>
                      <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                      <Text style={styles.resultText}>{increaseStrings.resultString24}</Text>
                    </>
                  )}

                {type === '1x2, 1x3' &&
                  isRaglanOutput(results) &&
                  selectedIncreaseType === type &&
                  isDetailsExpanded && (
                    <>
                      <Text style={styles.resultText}>
                        {'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.prib_1x2_fV}
                      </Text>
                      <Text style={styles.resultText}>
                        {'1 ' + i18n.t('stitches') + ' x 3 ' + i18n.t('rows') + ': ' + results.prib_1x3_fV}
                      </Text>
                      <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                      <Text style={styles.resultText}>{increaseStrings.resultString23}</Text>
                    </>
                  )}
                {type === '1x2, 1x1' &&
                  isRaglanOutput(results) &&
                  selectedIncreaseType === type &&
                  isDetailsExpanded && (
                    <>
                      <Text style={styles.resultText}>
                        {'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.prib_1x2_fV}
                      </Text>
                      <Text style={styles.resultText}>
                        {'1 ' + i18n.t('stitches') + ' x 1 ' + i18n.t('rows') + ': ' + results.prib_1x1_fV}
                      </Text>
                      <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                      <Text style={styles.resultText}>{increaseStrings.resultString21}</Text>
                    </>
                  )}
                {type === '1x3, 1x4' &&
                  isRaglanOutput(results) &&
                  selectedIncreaseType === type &&
                  isDetailsExpanded && (
                    <>
                      <Text style={styles.resultText}>
                        {'1 ' + i18n.t('stitches') + ' x 3 ' + i18n.t('rows') + ': ' + results.PRib_1x3_fV}
                      </Text>
                      <Text style={styles.resultText}>
                        {'1 ' + i18n.t('stitches') + ' x 4 ' + i18n.t('rows') + ': ' + results.PRib_1x4_fV}
                      </Text>
                      <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                      <Text style={styles.resultText}>{increaseStrings.resultString43}</Text>
                    </>
                  )}
                {type === '1x4' &&
                  isRaglanOutput(results) &&
                  selectedIncreaseType === type &&
                  isDetailsExpanded && (
                    <>
                      <Text style={styles.resultText}>
                        {'1 ' + i18n.t('stitches') + ' x 4 ' + i18n.t('rows') + ': ' + results.PR_1x4_fV}
                      </Text>
                      <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                      <Text style={styles.resultText}>{results.RowPrib1x4StringV}</Text>
                    </>
                  )}
                {type === '1x3' &&
                  isRaglanOutput(results) &&
                  selectedIncreaseType === type &&
                  isDetailsExpanded && (
                    <>
                      <Text style={styles.resultText}>
                        {'1 ' + i18n.t('stitches') + ' x 3 ' + i18n.t('rows') + ': ' + results.prib_1x3_fV}
                      </Text>
                      <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                      <Text style={styles.resultText}>{results.RowPrib1x3StringV}</Text>
                    </>
                  )}
                {type === '1x2' &&
                  isRaglanOutput(results) &&
                  selectedIncreaseType === type &&
                  isDetailsExpanded && (
                    <>
                      <Text style={styles.resultText}>
                        {'1 ' + i18n.t('stitches') + ' x 2 ' + i18n.t('rows') + ': ' + results.prib_1x2_fV}
                      </Text>
                      <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                      <Text style={styles.resultText}>{results.RowPrib1x2StringV}</Text>
                    </>
                  )}
                {type === '1x1' &&
                  isRaglanOutput(results) &&
                  selectedIncreaseType === type &&
                  isDetailsExpanded && (
                    <>
                      <Text style={styles.resultText}>
                        {'1 ' + i18n.t('stitches') + ' x 1 ' + i18n.t('rows') + ': ' + results.prib_1x1_fV}
                      </Text>
                      <Text style={[styles.resultText, { fontWeight: 'bold' }]}>{i18n.t('AdditionRows')}:</Text>
                      <Text style={styles.resultText}>{results.RowPrib1x1StringV}</Text>
                    </>
                  )}
              </View>
            ))
          ) : (
            <View style={styles.section}>
              <Text style={styles.resultText}>No increase types selected</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

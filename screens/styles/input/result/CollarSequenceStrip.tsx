import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import type { TranslationKey } from '@/utils/i18n/translationKeys';
import i18n from '@/utils/translations';
import StitchPartChip from './StitchPartChip';
import IncreaseBadgeChip from './IncreaseBadgeChip';
import { RESULT_COLORS } from './resultSharedStyles';

export type CollarSegment =
  | {
      kind: 'stitch';
      labelKey: TranslationKey;
      topColor: string;
      bottomColor?: string;
      value: number | string;
    }
  | { kind: 'increase'; labelKey: TranslationKey; value: number | string };

type Props = {
  segments: CollarSegment[];
};

function SegmentArrow() {
  return <Text style={styles.arrow}>→</Text>;
}

export default function CollarSequenceStrip({ segments }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator>
      <View style={styles.row}>
        {segments.map((segment, index) => (
          <React.Fragment key={`${segment.kind}-${index}`}>
            {index > 0 ? <SegmentArrow /> : null}
            {segment.kind === 'stitch' ? (
              <StitchPartChip
                topColor={segment.topColor}
                bottomColor={segment.bottomColor}
                value={segment.value}
                label={i18n.t(segment.labelKey)}
                isStart={index === 0}
              />
            ) : (
              <IncreaseBadgeChip
                value={segment.value}
                label={i18n.t(segment.labelKey)}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  arrow: {
    fontSize: 16,
    color: RESULT_COLORS.textSecondary,
    marginHorizontal: 2,
    marginTop: 8,
  },
});

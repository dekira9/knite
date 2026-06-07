import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import StitchPartChip from './StitchPartChip';
import IncreaseBadgeChip from './IncreaseBadgeChip';

export type CollarSegment =
  | { kind: 'stitch'; topColor: string; bottomColor?: string; value: number | string }
  | { kind: 'increase'; value: number | string };

type Props = {
  segments: CollarSegment[];
};

function RoundSeparator() {
  return (
    <View style={styles.roundIndicator}>
      <View style={styles.roundDot} />
    </View>
  );
}

export default function CollarSequenceStrip({ segments }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator>
      <View style={styles.row}>
        {segments.map((segment, index) => (
          <React.Fragment key={`${segment.kind}-${index}`}>
            {index > 0 ? <RoundSeparator /> : null}
            {segment.kind === 'stitch' ? (
              <StitchPartChip
                topColor={segment.topColor}
                bottomColor={segment.bottomColor}
                value={segment.value}
              />
            ) : (
              <IncreaseBadgeChip value={segment.value} />
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
  roundIndicator: {
    marginHorizontal: 4,
  },
  roundDot: {
    width: 17,
    height: 17,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },
});

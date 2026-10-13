import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StitchPartChip from './StitchPartChip';
import { resultTypography } from './resultSharedStyles';

type Props = {
  color: string;
  stitches: number | string;
  increasePerSide: number | string;
};

export default function RaglanPartRow({ color, stitches, increasePerSide }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.increase}>+{increasePerSide}</Text>
      <StitchPartChip topColor={color} value={stitches} />
      <Text style={styles.increase}>+{increasePerSide}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 8,
  },
  increase: {
    ...resultTypography.chipValue,
    color: '#374151',
    minWidth: 28,
    textAlign: 'center',
  },
});

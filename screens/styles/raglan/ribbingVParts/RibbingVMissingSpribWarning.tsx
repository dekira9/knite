// Placeholder when v-neck collar increase data (SpribVcorn) is not yet available.
import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function RibbingVMissingSpribWarning() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Ionicons name="warning-outline" size={40} color="#FF9500" />
    </View>
  );
}

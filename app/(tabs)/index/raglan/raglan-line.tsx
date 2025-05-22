import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RaglanLineScreen() {
  return (
    <View style={styles.container}>
      <Text>Схема для вывязывания линии реглана</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
}); 
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

export default function RaglanScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/raglan.svg')}
        style={{ width: '100%', height: 300 }}
        contentFit="contain"
      />
      <View style={styles.buttonContainer}>
        <View style={[styles.colorIndicator, { backgroundColor: 'grey' }]} />
        <Button title="Перед" onPress={() => router.push('/raglan/front')} />
      </View>
      <View style={styles.buttonContainer}>
        <View style={[styles.colorIndicator, { backgroundColor: 'pink' }]} />
        <Button title="Спина" onPress={() => router.push('/raglan/back')} />
      </View>
      <View style={styles.buttonContainer}>
        <View style={[styles.colorIndicator, { backgroundColor: 'yellow', borderWidth: 1, borderColor: 'black' }]} />
        <Button title="Резинка" onPress={() => router.push('/raglan/ribbing')} />
      </View>
      <View style={styles.buttonContainer}>
        <View style={[styles.colorIndicator, { backgroundColor: 'blue' }]} />
        <Button title="Линия реглана" onPress={() => router.push('/raglan/raglan-line')} />
      </View>
      <View style={styles.buttonContainer}>
        <View style={[styles.colorIndicator, { backgroundColor: 'green' }]} />
        <Button title="Рукав" onPress={() => router.push('/raglan/sleeve')} />
      </View>
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
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  colorIndicator: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 10,
  },
});

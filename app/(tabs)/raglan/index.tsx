import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function RaglanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 10 }}>Regular collar</Text>
      <Image
        source={require('../../../assets/images/regular-collar.png')}
        style={{ width: '100%', height: 200 }}
        contentFit="contain"
      />
      <Image
        source={require('../../../assets/images/raglan.svg')}
        style={{ width: '100%', height: 300 }}
        contentFit="contain"
      />
      {/* <View style={styles.buttonContainer}>
        <View style={[styles.colorIndicator, { backgroundColor: 'grey' }]} />
        <Button title="Перед" onPress={() => router.push('/raglan/front')} />
      </View>
      <View style={styles.buttonContainer}>
        <View style={[styles.colorIndicator, { backgroundColor: 'pink' }]} />
        <Button title="Спина" onPress={() => router.push('/raglan/back')} />
      </View> */}
      <View style={styles.buttonContainer}>
        <View style={[styles.colorIndicator, { backgroundColor: 'yellow', borderWidth: 1, borderColor: 'black' }]} />
        <Button title="Schema" onPress={() => router.push('/raglan/ribbing')} />
      </View>
      {/* <View style={styles.buttonContainer}>
        <View style={[styles.colorIndicator, { backgroundColor: 'blue' }]} />
        <Button title="Линия реглана" onPress={() => router.push('/raglan/raglan-line')} />
      </View>
      <View style={styles.buttonContainer}>
        <View style={[styles.colorIndicator, { backgroundColor: 'green' }]} />
        <Button title="Рукав" onPress={() => router.push('/raglan/sleeve')} />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
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

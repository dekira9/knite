import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  StyleSheet,
  Dimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Image, type ImageContentFit, type ImageSource } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RaglanZoomableView } from '@/screens/styles/raglan/RaglanZoomableView';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

type Props = {
  source: ImageSource;
  style?: StyleProp<ViewStyle>;
  contentFit?: ImageContentFit;
};

export default function ZoomableImage({ source, style, contentFit = 'contain' }: Props) {
  const [visible, setVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const zoomHeight = SCREEN_H - insets.top - insets.bottom - 48;

  return (
    <>
      <Pressable onPress={() => setVisible(true)} style={style} accessibilityRole="imagebutton">
        <Image source={source} style={style} contentFit={contentFit} />
      </Pressable>

      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <GestureHandlerRootView style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={() => setVisible(false)} />
          <Pressable
            style={[styles.closeButton, { top: insets.top + 12 }]}
            onPress={() => setVisible(false)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          <View style={[styles.zoomArea, { paddingBottom: insets.bottom }]}>
            <RaglanZoomableView>
              <Image
                source={source}
                style={{ width: SCREEN_W, height: zoomHeight }}
                contentFit="contain"
              />
            </RaglanZoomableView>
          </View>
        </GestureHandlerRootView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    zIndex: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 20,
  },
  zoomArea: {
    flex: 1,
    justifyContent: 'center',
  },
});

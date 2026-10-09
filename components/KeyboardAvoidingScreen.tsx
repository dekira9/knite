import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type KeyboardEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

type Props = {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * Lifts form content above the soft keyboard.
 * Docks content to the bottom; only pads when the window was NOT already resized.
 */
export default function KeyboardAvoidingScreen({
  children,
  contentContainerStyle,
}: Props) {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  /** Extra bottom inset only when keyboard overlays the window (not when Android already resized). */
  const [overlap, setOverlap] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (event: KeyboardEvent) => {
      setKeyboardOpen(true);
      const winH = Dimensions.get('window').height;
      // How much of the current window is covered by the keyboard.
      const covered = winH - event.endCoordinates.screenY;
      // If Android already resized the window, covered ≈ 0 — don't pad again (that hid the button).
      setOverlap(covered > 40 ? covered : 0);
    };
    const onHide = () => {
      setKeyboardOpen(false);
      setOverlap(0);
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <View style={[styles.flex, overlap > 0 ? { paddingBottom: overlap } : null]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.content,
          contentContainerStyle,
          keyboardOpen ? styles.contentKeyboardOpen : null,
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
  },
  contentKeyboardOpen: {
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
});

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import i18n from '@/utils/translations';
import { Colors } from '@/constants/Colors';

/** Default matches Step 2 preview assets (increasesO/V.png). */
const DEFAULT_IMAGE_ASPECT_RATIO = 1647 / 1180;

type Props = {
  previewSource: ImageSource;
  accessibilityLabel: string;
  children: React.ReactNode;
  /** Source width / height — keeps the preview full-width like Step 2. */
  imageAspectRatio?: number;
};

/**
 * Collapsed: illustration on switcher-style background.
 * Tap to reveal the step calculation card (preview hides).
 */
export default function ResultStepExpandable({
  previewSource,
  accessibilityLabel,
  children,
  imageAspectRatio = DEFAULT_IMAGE_ASPECT_RATIO,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return (
      <TouchableOpacity
        style={styles.preview}
        onPress={() => setExpanded(true)}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={`${accessibilityLabel}. ${i18n.t('openStepDetails')}`}
      >
        <Image
          source={previewSource}
          style={[styles.previewImage, { aspectRatio: imageAspectRatio }]}
          contentFit="contain"
          cachePolicy="memory-disk"
        />
        <View style={styles.openChip} pointerEvents="none">
          <Text style={styles.openChipText}>{i18n.t('openStepDetails')}</Text>
          <Ionicons name="chevron-down" size={14} color={Colors.light.tint} />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.expandedWrap}>
      <TouchableOpacity
        style={styles.collapseButton}
        onPress={() => setExpanded(false)}
        accessibilityRole="button"
        accessibilityLabel={i18n.t('collapseMeasurements')}
      >
        <Ionicons name="chevron-up" size={18} color={Colors.light.tint} />
        <Text style={styles.collapseText}>{i18n.t('collapseMeasurements')}</Text>
      </TouchableOpacity>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  preview: {
    backgroundColor: '#F4EFEC',
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    alignSelf: 'stretch',
  },
  openChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.28)',
  },
  openChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.tint,
  },
  expandedWrap: {
    marginBottom: 10,
  },
  collapseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 4,
    paddingVertical: 6,
    marginBottom: 4,
  },
  collapseText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.tint,
  },
});

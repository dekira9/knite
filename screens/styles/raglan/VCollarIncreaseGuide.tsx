import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Colors } from '@/constants/Colors';

/** Collar overview first, then increase steps 1→5. */
const GUIDE_IMAGES = [
  { key: 'vcollar', source: require('@/assets/images/vcollar.png'), aspectRatio: 1024 / 859 },
  { key: 'stitchplus1', source: require('@/assets/images/stitchplus1.png'), aspectRatio: 1024 / 515 },
  { key: 'stitchplus2', source: require('@/assets/images/stitchplus2.png'), aspectRatio: 1024 / 493 },
  { key: 'stitchplus3', source: require('@/assets/images/stitchplus3.png'), aspectRatio: 1024 / 527 },
  { key: 'stitchplus4', source: require('@/assets/images/stitchplus4.png'), aspectRatio: 1024 / 513 },
  { key: 'stitchplus5', source: require('@/assets/images/stitchplus5.png'), aspectRatio: 1024 / 546 },
] as const;

const IMAGE_HEIGHT = 140;

/** Collapsible picture guide for V-neck collar increases (above the chart grid). */
export const VCollarIncreaseGuide = observer(function VCollarIncreaseGuide() {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded((prev) => !prev)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
      >
        <Text style={styles.title}>{i18n.t('howToMakeIncrease')}</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={Colors.light.tint}
        />
      </TouchableOpacity>

      {expanded ? (
        <View style={styles.imagesArea}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            contentContainerStyle={styles.row}
          >
            {GUIDE_IMAGES.map((item) => (
              <Image
                key={item.key}
                source={item.source}
                style={[
                  styles.image,
                  {
                    height: IMAGE_HEIGHT,
                    width: IMAGE_HEIGHT * item.aspectRatio,
                  },
                ]}
                contentFit="contain"
                cachePolicy="memory-disk"
              />
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    marginBottom: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    backgroundColor: '#F4EFEC',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  title: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#2A2A2A',
    lineHeight: 18,
  },
  imagesArea: {
    backgroundColor: '#BFB398',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  image: {
    borderRadius: 10,
  },
});

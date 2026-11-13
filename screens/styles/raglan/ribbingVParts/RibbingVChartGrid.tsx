// Horizontal scroll layout: rotated sleeves, raglan lines, and collar row arrays.
import React from 'react';
import { View, ScrollView } from 'react-native';
import type { ViewStyle } from 'react-native';
import { Hc, Lc } from './calc';
import type { RibbingVCollarIncreaseInput } from './calc';
import { RibbingVStitchGrid } from './RibbingVStitchGrid';
import { RibbingVCollarRows } from './RibbingVCollarRows';
import { RibbingVCollarRowsRight } from './RibbingVCollarRowsRight';
import { ribbingVStyles as styles } from './styles';

type RibbingVChartGridProps = {
  NRrezV: number;
  SaV: number;
  KV: number;
  SFrontV: number;
  SV: number;
  SpribVcorn: number;
  highlightedRow: number;
  collarIncreaseInput: RibbingVCollarIncreaseInput;
  angleInRadians: number;
  angleInDegrees: number;
  leftSleeveTransform: ViewStyle['transform'];
  rightSleeveTransform: ViewStyle['transform'];
  line3Transform: ViewStyle['transform'];
  line4Transform: ViewStyle['transform'];
};

export function RibbingVChartGrid({
  NRrezV,
  SaV,
  KV,
  SFrontV,
  SV,
  SpribVcorn,
  highlightedRow,
  collarIncreaseInput,
  angleInRadians,
  angleInDegrees,
  leftSleeveTransform,
  rightSleeveTransform,
  line3Transform,
  line4Transform,
}: RibbingVChartGridProps) {
  const stitchGridProps = {
    numRows: NRrezV,
    highlightedRow,
    collarIncreaseInput,
  };

  return (
    <View style={[styles.contentContainer, { paddingTop: 20 }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.horizontalScrollContent}
      >
        <View style={styles.grid}>
          <View style={[styles.horContainerTop, { marginLeft: SaV * Lc }]}>
            <View style={[styles.rotatedLine3, { transform: line3Transform }]}>
              <RibbingVStitchGrid numCols={KV} {...stitchGridProps} />
            </View>
            <View style={[styles.Back, { marginTop: 0 }]}>
              <RibbingVStitchGrid numCols={SFrontV} {...stitchGridProps} />
            </View>
            <View style={[styles.rotatedLine4, { transform: line4Transform }]}>
              <RibbingVStitchGrid numCols={KV} {...stitchGridProps} />
            </View>
          </View>
          <View
            style={[
              styles.horContainer,
              { marginTop: SaV * Lc + 2 * KV * Lc * Math.sin(angleInRadians) },
              { width: (SaV + KV + SFrontV / 2) * Lc },
            ]}
          >
            <View style={[styles.rotatedLeftSleeve, { transform: leftSleeveTransform }]}>
              <RibbingVStitchGrid numCols={SaV} {...stitchGridProps} />
            </View>
            <View
              style={[styles.rotatedLine1, { transform: [{ rotate: `${angleInDegrees}deg` }] }]}
            >
              <RibbingVStitchGrid numCols={KV} {...stitchGridProps} />
            </View>
            <View
              style={[
                styles.arrayContainer,
                {
                  height: (NRrezV + 1) * Hc,
                  transform: [{ rotate: `${angleInDegrees}deg` }],
                },
              ]}
            >
              <RibbingVCollarRows
                nrRezV={NRrezV}
                spribVcorn={SpribVcorn}
                sv={SV}
                highlightedRow={highlightedRow}
                collarIncreaseInput={collarIncreaseInput}
              />
            </View>
          </View>
          <View
            style={[
              styles.horContainerRight,
              {
                marginLeft: (SaV + KV + SFrontV / 2) * Lc,
                marginTop: -(NRrezV + 1) * Hc - 2,
                width: (SFrontV / 2) * Lc,
              },
            ]}
          >
            <View style={styles.relativeContainer}>
              <View
                style={[
                  styles.arrayContainerRight,
                  {
                    height: (NRrezV + 1) * Hc,
                    transform: [{ rotate: `${360 - angleInDegrees}deg` }],
                    translateY: -10,
                  },
                ]}
              >
                <RibbingVCollarRowsRight
                  nrRezV={NRrezV}
                  spribVcorn={SpribVcorn}
                  sv={SV}
                  highlightedRow={highlightedRow}
                  collarIncreaseInput={collarIncreaseInput}
                />
              </View>
            </View>
            <View
              style={[styles.rotatedLine2, { transform: [{ rotate: `-${angleInDegrees}deg` }] }]}
            >
              <RibbingVStitchGrid numCols={KV} {...stitchGridProps} />
            </View>
            <View style={[styles.rotatedRightSleeve, { transform: rightSleeveTransform }]}>
              <RibbingVStitchGrid numCols={SaV} {...stitchGridProps} />
            </View>
          </View>

          <View
            style={[
              styles.horContainer,
              { marginTop: SaV * Lc + 2 * KV * Lc * Math.sin(angleInRadians) },
              { height: (SaV + KV + SFrontV / 2) * Lc },
            ]}
          />
        </View>
      </ScrollView>
    </View>
  );
}

import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { G } from 'react-native-svg';
import type { RibbingChartModel } from './chartModels/types';
import {
  renderLabeledGridSectionOverlay,
  renderLabeledGridSectionStatic,
  renderUniformGridHighlight,
  renderUniformGridStatic,
  ROW_AXIS_WIDTH,
} from './raglanSvgPrimitives';
import { RaglanZoomableView } from './RaglanZoomableView';

type Props = {
  model: RibbingChartModel;
  highlightedRow: number;
};

export function RaglanRibbingSvgChart({ model, highlightedRow }: Props) {
  const staticSectionNodes = useMemo(() => {
    return model.sections.map((section) => {
      const hasAxes = section.showRowAxis || section.showStitchAxis;
      const children = hasAxes
        ? renderLabeledGridSectionStatic(section.cols, section.rows, section.id, {
            showRowAxis: section.showRowAxis,
            showStitchAxis: section.showStitchAxis,
          })
        : renderUniformGridStatic(section.cols, section.rows, section.id);

      return (
        <G key={`${section.id}-static`} transform={section.svgTransform}>
          {children}
        </G>
      );
    });
  }, [model.sections]);

  const overlaySectionNodes = useMemo(() => {
    return model.sections.map((section) => {
      const gridX = section.showRowAxis ? ROW_AXIS_WIDTH : 0;
      const hasAxes = section.showRowAxis || section.showStitchAxis;
      const children = hasAxes
        ? renderLabeledGridSectionOverlay(section.cols, section.rows, highlightedRow, section.id, {
            showRowAxis: section.showRowAxis,
          })
        : [
            renderUniformGridHighlight(
              section.cols,
              section.rows,
              highlightedRow,
              section.id,
              gridX,
              0,
            ),
          ].filter(Boolean);

      return (
        <G key={`${section.id}-overlay`} transform={section.svgTransform}>
          {children}
        </G>
      );
    });
  }, [model.sections, highlightedRow]);

  return (
    <View style={styles.chartArea}>
      <RaglanZoomableView>
        <Svg width={model.width} height={model.height}>
          {staticSectionNodes}
          {overlaySectionNodes}
        </Svg>
      </RaglanZoomableView>
    </View>
  );
}

const styles = StyleSheet.create({
  chartArea: {
    flex: 1,
    minHeight: 280,
    width: '100%',
  },
});

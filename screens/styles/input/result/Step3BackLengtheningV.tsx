import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import { Colors } from '@/constants/Colors';
import ResultStepTitle from './ResultStepTitle';
import ResultStepExpandable from './ResultStepExpandable';
import { step3ColorsWithPrimary } from './Step3BackLengtheningParts/colors';
import { step3BackLengtheningStylesVNeck } from './Step3BackLengtheningParts/stylesVNeck';
import { BackLengtheningCard } from './Step3BackLengtheningParts/BackLengtheningCard';
import { PartsDivisionCard } from './Step3BackLengtheningParts/PartsDivisionCard';

interface Step3BackLengtheningVProps {
  results: any;
  handleScrollToTop1: () => void;
  handleScrollToTop: () => void;
  partsAnchorRef?: React.RefObject<View | null>;
}

const styles = step3BackLengtheningStylesVNeck;
const colors = step3ColorsWithPrimary(Colors['light'].tint);

const Step3BackLengtheningV = observer(({
  results,
  handleScrollToTop1,
  handleScrollToTop,
  partsAnchorRef,
}: Step3BackLengtheningVProps) => {
  const centerStitches = results.SFrontV + 2 * results.SfxV;

  return (
    <View style={styles.container}>
      <ResultStepTitle step={3} titleKey="backLengthening" />

      <ResultStepExpandable
        previewSource={require('@/assets/images/backLengV.png')}
        accessibilityLabel={i18n.t('backLengthening')}
        imageAspectRatio={1647 / 1366}
      >
        <BackLengtheningCard
          styles={styles}
          colors={colors}
          sRostok={results.SRostok}
          nRostok={results.NRostok}
          skFront={results.SKfrontV}
          centerStitches={centerStitches}
          stitchLabelLayout="combined"
          handleScrollToTop1={handleScrollToTop1}
        />

        <PartsDivisionCard
          styles={styles}
          colors={colors}
          sRostok={results.SRostok}
          frontTotal={centerStitches + 2 * results.SKfrontV}
          frontCenter={centerStitches}
          skFront={results.SKfrontV}
          sleeveTotal={results.SaV + 2 * results.SfxV + 2 * results.SKaV}
          sleeveCenter={results.SaV + 2 * results.SfxV}
          ska={results.SKaV}
          frontBodyBoxColor={colors.PINK}
          sleeveBodyBoxColor={colors.GREEN}
          planImageSource={require('@/assets/images/planVaz44.png')}
          planTextWithResultText={false}
          handleScrollToTop={handleScrollToTop}
          partsAnchorRef={partsAnchorRef}
        />
      </ResultStepExpandable>
    </View>
  );
});

export default Step3BackLengtheningV;

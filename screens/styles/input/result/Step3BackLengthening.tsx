import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import ResultStepTitle from './ResultStepTitle';
import ResultStepExpandable from './ResultStepExpandable';
import { step3ColorsWithPrimary } from './Step3BackLengtheningParts/colors';
import { step3BackLengtheningStylesRegular } from './Step3BackLengtheningParts/stylesRegular';
import { BackLengtheningCard } from './Step3BackLengtheningParts/BackLengtheningCard';
import { PartsDivisionCard } from './Step3BackLengtheningParts/PartsDivisionCard';

interface Step3BackLengtheningProps {
  results: any;
  handleScrollToTop1: () => void;
  handleScrollToTop: () => void;
  partsAnchorRef?: React.RefObject<View | null>;
}

const styles = step3BackLengtheningStylesRegular;
const colors = step3ColorsWithPrimary('#007AFF');

const Step3BackLengthening = observer(({
  results,
  handleScrollToTop1,
  handleScrollToTop,
  partsAnchorRef,
}: Step3BackLengtheningProps) => {
  const centerStitches = results.SFrontO + 2 * results.Sfx;

  return (
    <View style={styles.container}>
      <ResultStepTitle step={3} titleKey="backLengthening" />

      <ResultStepExpandable
        previewSource={require('@/assets/images/backLengO.png')}
        accessibilityLabel={i18n.t('backLengthening')}
        imageAspectRatio={1647 / 1360}
      >
        <BackLengtheningCard
          styles={styles}
          colors={colors}
          sRostok={results.SRostok}
          nRostok={results.NRostok}
          skFront={results.SKfront}
          centerStitches={centerStitches}
          stitchLabelLayout="split"
          handleScrollToTop1={handleScrollToTop1}
        />

        <PartsDivisionCard
          styles={styles}
          colors={colors}
          sRostok={results.SRostok}
          frontTotal={centerStitches + 2 * results.SKfront}
          frontCenter={centerStitches}
          skFront={results.SKfront}
          sleeveTotal={results.Sa + 2 * results.Sfx + 2 * results.SKa}
          sleeveCenter={results.Sa + 2 * results.Sfx}
          ska={results.SKa}
          frontBodyBoxColor="#FDCFE1"
          sleeveBodyBoxColor="#DAEDBD"
          planImageSource={require('@/assets/images/planOaz3.png')}
          planTextWithResultText
          handleScrollToTop={handleScrollToTop}
          partsAnchorRef={partsAnchorRef}
        />
      </ResultStepExpandable>
    </View>
  );
});

export default Step3BackLengthening;

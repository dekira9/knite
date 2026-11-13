import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import ResultStepTitle from './ResultStepTitle';
import ResultStepExpandable from './ResultStepExpandable';
import { step4SeparatingSleevesStylesVNeck } from './Step4SeparatingSleevesParts/stylesVNeck';
import { SeparatingSleevesVNeckCard } from './Step4SeparatingSleevesParts/SeparatingSleevesVNeckCard';

interface Step4SeparatingSleevesVProps {
  results: any;
  handleScrollToTop1: () => void;
}

const styles = step4SeparatingSleevesStylesVNeck;

const Step4SeparatingSleevesV = observer(({
  results,
  handleScrollToTop1,
}: Step4SeparatingSleevesVProps) => {
  const sleeveStitches = results.SaV + 2 * results.SfxV + 2 * results.SKaV;

  return (
    <View style={styles.container}>
      <ResultStepTitle step={4} titleKey="separatingBodyAndSleeves" />

      <ResultStepExpandable
        previewSource={require('@/assets/images/v-neck.png')}
        accessibilityLabel={i18n.t('separatingBodyAndSleeves')}
        imageAspectRatio={2979 / 1408}
      >
        <SeparatingSleevesVNeckCard
          styles={styles}
          sRostok={results.SRostok}
          sleeveStitches={sleeveStitches}
          sPodr={results.SPodr}
          handleScrollToTop1={handleScrollToTop1}
        />
      </ResultStepExpandable>
    </View>
  );
});

export default Step4SeparatingSleevesV;

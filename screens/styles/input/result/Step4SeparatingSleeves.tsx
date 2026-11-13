import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import ResultStepTitle from './ResultStepTitle';
import ResultStepExpandable from './ResultStepExpandable';
import { step4SeparatingSleevesStylesRegular } from './Step4SeparatingSleevesParts/stylesRegular';
import { SeparatingSleevesRegularCard } from './Step4SeparatingSleevesParts/SeparatingSleevesRegularCard';

interface Step4SeparatingSleevesProps {
  results: any;
  handleScrollToTop1: () => void;
}

const styles = step4SeparatingSleevesStylesRegular;

const Step4SeparatingSleeves = observer(({
  results,
  handleScrollToTop1,
}: Step4SeparatingSleevesProps) => {
  const sleeveStitches = results.Sa + 2 * results.Sfx + 2 * results.SKa;

  return (
    <View style={styles.container}>
      <ResultStepTitle step={4} titleKey="separatingBodyAndSleeves" />

      <ResultStepExpandable
        previewSource={require('@/assets/images/icon.png')}
        accessibilityLabel={i18n.t('separatingBodyAndSleeves')}
        imageAspectRatio={2980 / 1406}
      >
        <SeparatingSleevesRegularCard
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

export default Step4SeparatingSleeves;

import React from 'react';
import MeasurementInput from '@/app/components/MeasurementInput';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import onboardingState from '@/state/onboardingState';

export default observer(() => {
  const measurementSystem = onboardingState.measurementSystem;
  return (
    <>
      {measurementSystem === 'metric' ? (
        <MeasurementInput
          title={i18n.t('stitchDensityCM')}
          value={introState.stitchDensity}
          onValueChange={introState.setStitchDensity}
          nextScreen="RowDensity"
          imageSource={require('@/assets/images/density.svg')}
          doNotShowCM={true}
        />
      ) : (
        <MeasurementInput
          title={i18n.t('stitchDensityIN')}
          value={introState.stitchDensity}
          onValueChange={introState.setStitchDensity}
          nextScreen="RowDensity"
          imageSource={require('@/assets/images/density.svg')}
          doNotShowCM={true}
        />
      )}
    </>
  );
}); 
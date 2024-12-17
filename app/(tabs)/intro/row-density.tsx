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
          title={i18n.t('rowDensityCM')}
          value={introState.rowDensity}
          onValueChange={introState.setRowDensity}
          nextScreen="/intro/fit"
        imageSource={require('@/assets/images/density3.svg')}
        />
      ) : (
        <MeasurementInput
          title={i18n.t('rowDensityIN')}
          value={introState.rowDensity}
          onValueChange={introState.setRowDensity}
          nextScreen="/intro/fit"
          imageSource={require('@/assets/images/density3.svg')}
        />
      )}
    </>
  );
}); 

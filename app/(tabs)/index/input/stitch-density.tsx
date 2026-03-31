import React, { useState, useEffect } from 'react';
import MeasurementInput from '@/app/components/MeasurementInput';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import onboardingState from '@/state/onboardingState';

export default observer(() => {
  const measurementSystem = onboardingState.measurementSystem;
  const [localValue, setLocalValue] = useState(introState.stitchDensity);

  useEffect(() => {
    setLocalValue(introState.stitchDensity);
  }, [introState.stitchDensity]);

  const handleNext = () => {
    if (localValue.trim() !== '') {
      introState.setStitchDensity(localValue);
    }
    return true;
  };

  return (
    <>
      {measurementSystem === 'metric' ? (
        <MeasurementInput
          title={i18n.t('stitchDensityCM')}
          value={localValue}
          onValueChange={setLocalValue}
          nextScreen="RowDensity"
          imageSource={require('@/assets/images/density.svg')}
          doNotShowCM={true}
          onNext={handleNext}
        />
      ) : (
        <MeasurementInput
          title={i18n.t('stitchDensityIN')}
          value={localValue}
          onValueChange={setLocalValue}
          nextScreen="RowDensity"
          imageSource={require('@/assets/images/density2Inch.svg')}
          doNotShowCM={true}
          onNext={handleNext}
        />
      )}
    </>
  );
}); 
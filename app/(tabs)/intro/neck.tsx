import React from 'react';
import MeasurementInput from '@/app/components/MeasurementInput';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';

export default observer(() => {
  return (
    <MeasurementInput
      title={i18n.t('neckCircumference')}
      value={introState.neckCircumference}
      onValueChange={introState.setNeckCircumference}
      nextScreen="/intro/chest"
      imageSource={require('@/assets/images/neck.svg')}
    />
  );
}); 
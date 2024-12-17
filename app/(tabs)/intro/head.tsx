import React from 'react';
import MeasurementInput from '@/app/components/MeasurementInput';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';

export default observer(() => {
  console.log('introState.headCircumference', introState.headCircumference)
  return (
    <MeasurementInput
      title={i18n.t('headCircumference')}
      value={introState.headCircumference}
      onValueChange={introState.setHeadCircumference}
      nextScreen="/intro/neck"
      imageSource={require('@/assets/images/head.svg')}
    />
  );
}); 
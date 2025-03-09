import React from 'react';
import MeasurementInput from '@/app/components/MeasurementInput';
import introState from '@/state/introState';
import { observer } from 'mobx-react-lite';
import i18n from '@/utils/translations';
import IntroProgress from '@/app/components/IntroProgress';

export default observer(() => {
  return (
    <>
      <MeasurementInput
        title={i18n.t('headCircumference')}
        value={introState.headCircumference}
        onValueChange={introState.setHeadCircumference}
        nextScreen="/(tabs)/input/neck"
        imageSource={require('@/assets/images/head.svg')}
      />
    </>
    
  );
  
}); 

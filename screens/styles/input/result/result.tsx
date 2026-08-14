import { observer } from 'mobx-react-lite';
import introState from '@/state/introState';
import RegularResult from './RegularResult';
import VNeckResult from './VNeckResult';

export default observer(function ResultScreen() {
  return introState.style === 'v-neck' ? <VNeckResult /> : <RegularResult />;
});

import { observer } from 'mobx-react-lite';
import introState from '@/state/introState';
import SleeveRegular from './sleeveO';
import SleeveVNeck from './sleeveV';

export default observer(function SleeveScreen() {
  return introState.style === 'v-neck' ? <SleeveVNeck /> : <SleeveRegular />;
});

import { observer } from 'mobx-react-lite';
import introState from '@/state/introState';
import RibbingRegular from './ribbingO';
import RibbingVNeck from './ribbingV';

export default observer(function RibbingScreen() {
  return introState.style === 'v-neck' ? <RibbingVNeck /> : <RibbingRegular />;
});

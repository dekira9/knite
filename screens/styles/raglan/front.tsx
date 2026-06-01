import { observer } from 'mobx-react-lite';
import introState from '@/state/introState';
import FrontRegular from './frontO';
import FrontVNeck from './frontV';

export default observer(function FrontScreen() {
  return introState.style === 'v-neck' ? <FrontVNeck /> : <FrontRegular />;
});

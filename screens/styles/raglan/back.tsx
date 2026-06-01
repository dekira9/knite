import { observer } from 'mobx-react-lite';
import introState from '@/state/introState';
import BackRegular from './backO';
import BackVNeck from './backV';

export default observer(function BackScreen() {
  return introState.style === 'v-neck' ? <BackVNeck /> : <BackRegular />;
});

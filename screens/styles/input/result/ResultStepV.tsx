import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react-lite';
import introState from '@/state/introState';
import { computeResultStepVMetrics } from './ResultStepVParts/calc';
import { ResultStepVCard } from './ResultStepVParts/ResultStepVCard';
import { styles } from './ResultStepVParts/styles';

interface ResultStepVProps {
  results: any;
}

const ResultStepV = observer(({ results }: ResultStepVProps) => {
  const metrics = computeResultStepVMetrics(
    results,
    introState.stitchDensity,
    introState.rowDensity,
  );

  return (
    <View style={styles.container}>
      <ResultStepVCard results={results} metrics={metrics} />
    </View>
  );
});

export default ResultStepV;

import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { mapPrecomputedVStrings } from '@/screens/styles/raglan/increaseRowSelection';
import { FrontVAction1CalcSection } from './FrontVParts/FrontVAction1CalcSection';
import { FrontVAction1Intro } from './FrontVParts/FrontVAction1Intro';
import { FrontVAction2Section } from './FrontVParts/FrontVAction2Section';
import { FrontVAction3Section } from './FrontVParts/FrontVAction3Section';
import { FrontVHeader } from './FrontVParts/FrontVHeader';
import { styles } from './FrontVParts/styles';

interface FrontVProps {
  results: any;
  resultString24V: string;
  resultString23V: string;
  resultString21V: string;
  resultString43V: string;
  RowPrib1x4StringV: string;
  RowPrib1x3StringV: string;
  RowPrib1x2StringV: string;
  RowPrib1x1StringV: string;
  handleScrollToTop1: () => void;
}

const FrontV = observer(({
  results,
  resultString24V,
  resultString23V,
  resultString21V,
  resultString43V,
  RowPrib1x4StringV,
  RowPrib1x3StringV,
  RowPrib1x2StringV,
  RowPrib1x1StringV,
  handleScrollToTop1,
}: FrontVProps) => {
  const navigation = useNavigation();

  const navigateToFrontV = () => {
    (navigation as any).navigate('Raglan', { screen: 'Front' });
  };

  const increaseStrings = mapPrecomputedVStrings({
    resultString24V,
    resultString23V,
    resultString21V,
    resultString43V,
    RowPrib1x4StringV,
    RowPrib1x3StringV,
    RowPrib1x2StringV,
    RowPrib1x1StringV,
  });

  return (
    <View style={styles.container}>
      <View style={styles.resultCard}>
        <FrontVHeader />

        <FrontVAction1Intro nHv={results.NHV} />

        <FrontVAction1CalcSection
          results={results}
          increaseStrings={increaseStrings}
        />

        <FrontVAction2Section
          stitchCount={results.SVfront - results.SFrontV / 2}
        />

        <FrontVAction3Section
          rowsCount={results.NHFrontV - results.NHV}
          startRowNumber={results.NHV + 1}
          handleScrollToTop1={handleScrollToTop1}
        />
      </View>
    </View>
  );
});

export default FrontV;

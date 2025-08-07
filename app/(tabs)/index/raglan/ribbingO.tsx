import React, { useEffect, useState } from 'react';
import { View, StyleSheet , ScrollView,TouchableOpacity,Text   } from 'react-native';
import introState from '@/state/introState';
import raglanState from '@/state/raglanState';
import { observer } from 'mobx-react-lite';
import { Ionicons } from '@expo/vector-icons';

const App = observer(() => {
  const { SFrontO, Sa, K, NRrez } = introState;
  const [highlightedRow, setHighlightedRow] = useState(0);

  const LeftSleeveTransform = [
    { translateY: -K * 10 * Math.sin(Math.PI / 4) },
    { translateX: K * 10 - K * 10 * Math.cos(Math.PI / 4) },
    { rotate: '90deg' },
  ];
  const RightSleeveTransform = [
    { translateY: -K * 10 * Math.sin(Math.PI / 4) },
    { translateX: -K * 10 + K * 10 * Math.cos(Math.PI / 4) },
    { rotate: '-90deg' },
  ];
  const line3Transform = [
    { translateY: NRrez * 10 },
    { translateX: K * 10 },
    { rotate: '-225deg' },
  ];
  const line4Transform = [
    { translateY: NRrez * 10 },
    { translateX: -K * 10 },
    { rotate: '225deg' },
  ];

  const renderLine1 = () => {
    const numRows = NRrez;
    const numCols = K;
    const cells = [];
    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(
          <View key={`${i}-${j}`} style={[i === 0 ? styles.firstCell : styles.cell,
            i === highlightedRow && styles.highlightedCell]} />
        );
      }
      cells.push(
        <View key={i} style={styles.row}>
          {row}
        </View>
      );
    }
    return cells;
  };
  const renderLine2 = () => {
    const numRows = NRrez;
    const numCols = K;
    const cells = [];
    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(
          <View key={`${i}-${j}`} style={[i === 0 ? styles.firstCell : styles.cell,
            i === highlightedRow && styles.highlightedCell]} />
        );
      }
      cells.push(
        <View key={i} style={styles.row}>
          {row}
        </View>
      );
    }
    return cells;
  };
  const renderLine3 = () => {
    const numRows = NRrez;
    const numCols = K;
    const cells = [];
    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(
          <View key={`${i}-${j}`} style={[i === 0 ? styles.firstCell : styles.cell,
            i === highlightedRow && styles.highlightedCell]} />
        );
      }
      cells.push(
        <View key={i} style={styles.row}>
          {row}
        </View>
      );
    }
    return cells;
  };
  const renderLine4 = () => {
    const numRows = NRrez;
    const numCols = K;
    const cells = [];
    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(
          <View key={`${i}-${j}`} style={[i === 0 ? styles.firstCell : styles.cell,
            i === highlightedRow && styles.highlightedCell]} />
        );
      }
      cells.push(
        <View key={i} style={styles.row}>
          {row}
        </View>
      );
    }
    return cells;
  };
  const renderFront = () => {
    const numRows = NRrez;
    const numCols = SFrontO;
    const cells = [];
    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(
          <View key={`${i}-${j}`} style={[i === 0 ? styles.firstCell : styles.cell,
            i === highlightedRow && styles.highlightedCell]} />
        );
      }
      cells.push(
        <View key={i} style={styles.row}>
          {row}
        </View>
      );
    }
    return cells;
  };

  const renderBack = () => {
    const numRows = NRrez;
    const numCols = SFrontO;
    const cells = [];
    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(
          <View key={`${i}-${j}`} style={[i === 0 ? styles.firstCell : styles.cell,
            i === highlightedRow && styles.highlightedCell]} />
        );
      }
      cells.push(
        <View key={i} style={styles.row}>
          {row}
        </View>
      );
    }
    return cells;
  };
  const renderLeftSleeve = () => {
    const numRows = NRrez;
    const numCols = Sa;
    const cells = [];
    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(
          <View key={`${i}-${j}`} style={[i === 0 ? styles.firstCell : styles.cell,
            i === highlightedRow && styles.highlightedCell]} />
        );
      }
      cells.push(
        <View key={i} style={styles.row}>
          {row}
        </View>
      );
    }

    return cells;
  };
  const renderRightSleeve = () => {
    const numRows = NRrez;
    const numCols = Sa;
    const cells = [];
    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(
          <View key={`${i}-${j}`} style={[i === 0 ? styles.firstCell : styles.cell,
            i === highlightedRow && styles.highlightedCell]} />
        );
      }
      cells.push(
        <View key={i} style={styles.row}>
          {row}
        </View>
      );
    }

    return cells;
  };
  const highlightNextRow = () => {
    setHighlightedRow((prev) => (prev + 1) % NRrez);
  };

  const highlightPreviousRow = () => {
    setHighlightedRow((prev) => (prev - 1 + NRrez) % NRrez);
  };


  return (
    
    <View style={styles.container}>
      <ScrollView horizontal={true} contentContainerStyle={styles.container}>
        
      <View style={styles.horContainerTop}>
        <View style={[styles.rotatedLine3, { transform: line3Transform }]}>
          {renderLine3()}
        </View>
        <View style={[styles.Back, { marginTop: 0 }]}>
          {renderBack()}
        </View>
        <View style={[styles.rotatedLine4, { transform: line4Transform }]}>
          {renderLine4()}
        </View>
      </View>
      <View style={[styles.horContainer, { marginTop: Sa * 10 + 2*K * 10 * Math.sin(Math.PI / 4) }]}>
        <View style={[styles.rotatedLeftSleeve, { transform: LeftSleeveTransform }]}>
          {renderLeftSleeve()}
        </View>
        <View style={[styles.rotatedLine1]}>
          {renderLine1()}
        </View>

        <View style={styles.Front}>
          {renderFront()}
        </View>
        <View style={[styles.rotatedLine2]}>
          {renderLine2()}
        </View>

        <View style={[styles.rotatedRightSleeve, { transform: RightSleeveTransform }]}>
          {renderRightSleeve()}
        </View>
      </View>
      </ScrollView>

      <View style={styles.controlsInfoContainer}>
      <View style={styles.infoContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
      <View style={{width: 17, height: 17, backgroundColor: 'red', borderWidth: 1}}></View>
        <Text style={styles.infoText}>Current Row: {highlightedRow + 1}</Text>
        </View>
        <Text style={styles.infoText}>Stitches: {K*4+2*SFrontO + 2*Sa}</Text>
      </View>
      <View style={styles.navigationButtons}>
        <TouchableOpacity onPress={highlightPreviousRow} style={styles.navButton}>
          <Ionicons name="chevron-up" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity onPress={highlightNextRow} style={styles.navButton}>
          <Ionicons name="chevron-down" size={24} color="red" />
        </TouchableOpacity>
      </View>
      </View>
    </View>
  
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    top: 0,
    minHeight: '100%',
  },
  horContainerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    
    borderWidth: 0,
    borderColor: 'green',
  },
  horContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 110,
    borderWidth: 0,
    borderColor: 'red',
  },
  verticalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
  },
  HorizontalContainer: {
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderColor: 'orange',
  },
  controlsInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'column',
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  LeftSleeve: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transformOrigin: 'top right',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'red',
  },
  RightSleeve: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transformOrigin: 'top left',
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: 'blue',
  },
  rotatedLine1: {
    transform: [{ rotate: '45deg' }],
    transformOrigin: 'top right',
  },
  rotatedLeftSleeve: {
    transformOrigin: 'top right',
  },
  rotatedRightSleeve: {
    transformOrigin: 'top left',
  },
  rotatedLine2: {
    transform: [{ rotate: '-45deg' }],
    transformOrigin: 'top left',
  },
  rotatedLine3: {
    transformOrigin: 'top left',
  },
  rotatedLine4: {
    transformOrigin: 'top right',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'yellow',
  },
  firstCell: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'yellow',
  },
  Front: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  Back: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    transform: [{ rotate: '180deg' }],
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    padding: 5,
    gap: 15,
    backgroundColor: '#fff',
  },
  navButton: {
    padding: 10,
  },
  highlightedCell: {
    backgroundColor: 'red',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;

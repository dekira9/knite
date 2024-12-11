import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Text, Button } from 'react-native';
import { observer } from 'mobx-react-lite';
import raglanState from '@/state/raglanState';
import Slider from '@react-native-community/slider';

const BackScreen = observer(() => {
  const { SFrontO, Sfx, NHFront, usedIncreaseType, PR_1X2_f, prib_1x4_f, prib_1x2_f, prib_1x3_f, NRostok, SKfront, SPodr } = raglanState;
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const [pribMode, setPribMode] = useState(usedIncreaseType[0]);
  const [highlightedRows, setHighlightedRows] = useState(0);

  const topWidth = SFrontO + 2;
  const bottomWidth = SFrontO + 2 * Sfx;
  const maxNodes = Math.max(topWidth, bottomWidth);
  console.log('Sfx', Sfx)

  const [lastRowHighlight, setLastRowHighlight] = useState(0);

  const [cellSize, setCellSize] = useState(Math.min(screenWidth, screenHeight) / maxNodes * 2);
  const [distributionMode, setDistributionMode] = useState('sequential');

  const [currentNodes, setCurrentNodes] = useState(0);

  const adjustCellSize = (delta) => {
    setCellSize(prevSize => Math.max(5, prevSize + delta));
  };

  const toggleDistributionMode = () => {
    setDistributionMode(prevMode => (prevMode === 'sequential' ? 'even' : 'sequential'));
  };

  const calculateAdditionalSquares = useMemo(() => {
    const calculations = Array(NHFront).fill(0).map((_, rowIndex) => {
      let additionalSquares = 0;
      if (pribMode === '1x2, 1x4') {
        if (rowIndex < PR_1X2_f * 2) {
          additionalSquares = Math.floor(rowIndex / 2);
        } else if (rowIndex < PR_1X2_f * 2 + prib_1x4_f * 4) {
          additionalSquares = PR_1X2_f + Math.floor((rowIndex - PR_1X2_f * 2) / 4);
        }
      } else if (pribMode === '1x2, 1x3') {
        if (rowIndex < prib_1x2_f * 2) {
          additionalSquares = Math.floor(rowIndex / 2);
        } else if (rowIndex < prib_1x2_f * 2 + prib_1x3_f * 3) {
          additionalSquares = prib_1x2_f + Math.floor((rowIndex - prib_1x2_f * 2) / 3);
        }
      }
      return additionalSquares;
    });
    return calculations;
  }, [pribMode, PR_1X2_f, prib_1x4_f, prib_1x2_f, prib_1x3_f, NHFront]);

  const highlightNextRow = () => {
    setHighlightedRows(prev => Math.min(prev + 1, NHFront));
    setLastRowHighlight(maxNodes);
  };

  const highlightPreviousRow = () => {
    setHighlightedRows(prev => Math.max(prev - 1, 0));
    setLastRowHighlight(0);
  };

  const increaseNodes = () => {
    setCurrentNodes(prev => Math.min(prev + 1, maxNodes));
  };

  const decreaseNodes = () => {
    setCurrentNodes(prev => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    setLastRowHighlight(maxNodes);
  }, [maxNodes]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.infoText}>Текущий режим: {distributionMode === 'sequential' ? 'Последовательный' : 'Равномерный'}</Text>
      <Text style={styles.infoText}>Трапеция: верхняя грань {SFrontO}, нижняя грань {bottomWidth}</Text>
      <Text style={styles.infoText}>Количество рядов: {NHFront}</Text>
      {/* <Text style={styles.infoText}>Количество 1x2: {PR_1X2_f}</Text>
      <Text style={styles.infoText}>Количество 1x4: {prib_1x4_f}</Text>
      <Text style={styles.infoText}>Количество 1x2 {prib_1x2_f}</Text>
      <Text style={styles.infoText}>Количество 1x3 {prib_1x3_f}</Text> */}
      
      <View style={styles.buttonContainer}>
        <Button title="Меньше" onPress={() => adjustCellSize(-1)} />
        <Button title="Больше" onPress={() => adjustCellSize(1)} />
        {/* <Button title="Переключить распределение" onPress={toggleDistributionMode} /> */}
        <Text style={styles.infoText}>Текущий ряд: {highlightedRows + 1}</Text>
        <Button title="Перейти на следующий ряд" onPress={highlightNextRow} />
        <Button title="Перейти на предыдущий ряд" onPress={highlightPreviousRow} />
        <Button title="Уменьшить узлы" onPress={decreaseNodes} />
        <Button title="Увеличить узлы" onPress={increaseNodes} />
        <Text style={styles.infoText}>Текущие узлы: {currentNodes}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="1x2, 1x4" onPress={() => setPribMode('1x2, 1x4')} />
        <Button title="1x2, 1x3" onPress={() => setPribMode('1x2, 1x3')} />
      </View>
      {/* <View style={styles.sliderContainer}>
        <Text>Закрашивание последнего закрашенного ряда:</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={0}
          maximumValue={maxNodes}
          step={1}
          value={lastRowHighlight}
          onValueChange={value => setLastRowHighlight(value)}
        />
      </View> */}
      <ScrollView 
        horizontal 
        contentContainerStyle={styles.scrollContainer}
        showsHorizontalScrollIndicator={false}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {Array.from({ length: NHFront }).map((_, rowIndex) => {
              let currentWidth = topWidth;
              const additionalSquares = calculateAdditionalSquares[rowIndex];

              currentWidth += 2 * additionalSquares;
              const totalWidth = currentWidth;
              const totalEmptyCells = (maxNodes - totalWidth) / 2;

              return (
                <View 
                  key={rowIndex} 
                  style={styles.row}
                >
                  {Array.from({ length: maxNodes }).map((_, colIndex) => {
                    const isVisible = colIndex >= totalEmptyCells && colIndex < totalEmptyCells + totalWidth;
                    const isRectangle = colIndex >= ((maxNodes - topWidth) / 2)+1 && colIndex < ((maxNodes - topWidth) / 2 + topWidth)-1;
                    const isHighlighted = rowIndex < highlightedRows || (rowIndex === highlightedRows - 1 && colIndex < lastRowHighlight);
                    const isCurrentNodeHighlighted = rowIndex === highlightedRows - 1 && colIndex < currentNodes;
                    
                    return (
                      <View
                        key={colIndex}
                        style={[
                          styles.cell,
                          { 
                            width: cellSize, 
                            height: cellSize,
                            opacity: isVisible ? 1 : 0,
                            backgroundColor: isCurrentNodeHighlighted ? '#ADD8E6' : (isHighlighted ? '#FFC0CB' : (isRectangle ? '#D3D3D3' : 'transparent')),
                          },
                        ]}
                      />
                    );
                  })}
                </View>
              );
            })}
            {/* Add NRostok rows at the bottom */}
            {Array.from({ length: NRostok - 1 }).map((_, rowIndex) => {
              return (
                <View 
                  key={`rostok-${rowIndex}`} 
                  style={styles.row}
                >
                  {Array.from({ length: SFrontO + 2 * Sfx + 2 * SKfront }).map((_, colIndex) => {
                    return (
                      <View
                        key={colIndex}
                        style={[
                          styles.cell,
                          { 
                            width: cellSize, 
                            height: cellSize,
                            backgroundColor: '#D3D3D3',
                          },
                        ]}
                      />
                    );
                  })}
                </View>
              );
            })}
            {/* Add the last row with additional width */}
            <View style={styles.row}>
              {Array.from({ length: SFrontO + 2 * Sfx + 2 * SKfront + 2 * SPodr }).map((_, colIndex) => {
                return (
                  <View
                    key={colIndex}
                    style={[
                      styles.cell,
                      { 
                        width: cellSize, 
                        height: cellSize,
                        backgroundColor: '#D3D3D3',
                      },
                    ]}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  grid: {
    flexDirection: 'column',
    margin: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    borderWidth: 1,
    borderColor: '#333',
    margin: -0.5,
  },
  infoText: {
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sliderContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default BackScreen; 
import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Text, Button } from 'react-native';
import { observer } from 'mobx-react-lite';
import raglanState from '@/state/raglanState';
import Slider from '@react-native-community/slider';

const RibbingScreen = observer(() => {
  const { SFrontO, Sfx, NHFront, usedIncreaseType, PR_1X2_f, prib_1x4_f, prib_1x2_f, prib_1x3_f, NRostok, SKfront, SPodr, Sa, NRrez, SO } = raglanState;
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const [pribMode, setPribMode] = useState(usedIncreaseType[0]);
  const [highlightedRows, setHighlightedRows] = useState(0);
  const K = 2;
  const topWidth = SFrontO + 2;
  const bottomWidth = SFrontO + 2 * Sfx;
  const maxNodes = Math.max(topWidth, bottomWidth);
  const thickness = NRrez;

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

  const totalEmptyCells = (maxNodes - topWidth) / 2;
  const defaultColor = 'red';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.infoText}>Текущий режим: {distributionMode === 'sequential' ? 'Последовательный' : 'Равномерный'}</Text>
      <Text style={styles.infoText}>Трапеция: верхняя грань {SFrontO}, нижняя грань {bottomWidth}</Text>
      <Text style={styles.infoText}>Количество рядов: {NHFront}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Меньше" onPress={() => adjustCellSize(-1)} />
        <Button title="Больше" onPress={() => adjustCellSize(1)} />
      </View>
      <ScrollView 
        horizontal 
        contentContainerStyle={styles.scrollContainer}
        showsHorizontalScrollIndicator={false}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {/* pre first row */}
            {Array.from({ length: 2 }).map((_, rowIndex) => (
              <View 
                key={`row-${rowIndex}`} 
                style={styles.row}
              >
                {Array.from({ length: maxNodes + 2 }).map((_, colIndex) => {
                  const topWidthPlus2 = topWidth + 2;
                  let isVisible;
                  isVisible = colIndex >= totalEmptyCells && colIndex < totalEmptyCells + topWidthPlus2;

                  // reverse left side
                  for (let i = 0; i < Math.min(rowIndex, K); i++) {
                    if (colIndex - rowIndex + i * 2 + thickness + 2 === totalEmptyCells) {
                      isVisible = true;
                    }
                  }

                  // reverse right side
                  for (let i = 0; i < Math.min(rowIndex, K); i++) {
                    if (colIndex + rowIndex - i * 2 - thickness - 1 === totalEmptyCells + topWidthPlus2) {
                      isVisible = true;
                    }
                  }

                  return (
                    <View
                      key={colIndex}
                      style={[
                        styles.cell,
                        { 
                          width: cellSize, 
                          height: cellSize,
                          opacity: isVisible ? 1 : 0,
                          borderStyle: 'dashed',
                        },
                      ]}
                    />
                  );
                })}
              </View>
            ))}

            {/* first row */}
            {Array.from({ length: thickness }).map((_, rowIndex) => (
              <View 
                key={`row-${rowIndex}`} 
                style={styles.row}
              >
                {Array.from({ length: maxNodes }).map((_, colIndex) => {
                  let isVisible = colIndex >= totalEmptyCells && colIndex < totalEmptyCells + topWidth;

                  let backgroundColor = defaultColor;
                  let borderStyle = 'solid';
                  // // first row
                  // if (rowIndex === thickness - 1) {
                  //   backgroundColor = 'transparent';
                  //   borderStyle = 'solid';
                  // }
                  // rest of left side
                  for (let i = 0; i < K; i++) {
                    if (colIndex - rowIndex + i * 2 + thickness + 1 === totalEmptyCells) {
                      isVisible = true;
                      backgroundColor = 'transparent';
                      borderStyle = 'dashed';
                    }
                  }
                  // reverse left side
                  for (let i = 0; i < Math.min(rowIndex, K); i++) {
                    if (colIndex - rowIndex + i * 2 + thickness + 1 === totalEmptyCells) {
                      isVisible = true;
                      backgroundColor = defaultColor;
                      borderStyle = 'solid';
                    }
                  }
                  // rest of right side
                  for (let i = 0; i < K; i++) {
                    if (colIndex + rowIndex - i * 2 - thickness === totalEmptyCells + topWidth) {
                      isVisible = true;
                      backgroundColor = 'transparent';
                      borderStyle = 'dashed';
                    }
                  }

                  // reverse right side
                  for (let i = 0; i < Math.min(rowIndex, K); i++) {
                    if (colIndex + rowIndex - i * 2 - thickness === totalEmptyCells + topWidth) {
                      isVisible = true;
                      backgroundColor = defaultColor;
                      borderStyle = 'solid';
                    }
                  }

                  return (
                    <View
                      key={colIndex}
                      style={[
                        styles.cell,
                        { 
                          width: cellSize, 
                          height: cellSize,
                          opacity: isVisible ? 1 : 0,
                          backgroundColor,
                          borderStyle,
                          justifyContent: 'center',
                          alignItems: 'center',
                        },
                      ]}
                    >
                    </View>
                  );
                })}
              </View>
            ))}

            {/* Top angle rows with length K */}
            {Array.from({ length: K }).map((_, rowIndex) => (
              <View 
                key={`row-${rowIndex}`} 
                style={styles.row}
              >
                {Array.from({ length: maxNodes }).map((_, colIndex) => {
                  // Adjust the visibility logic based on rowIndex
                  let isVisible = colIndex + rowIndex + 1 === totalEmptyCells || colIndex === totalEmptyCells + topWidth + rowIndex;

                  let backgroundColor = defaultColor;
                  let borderStyle = 'solid';
                  // if (colIndex + rowIndex + 1 === totalEmptyCells || colIndex === totalEmptyCells + topWidth + rowIndex) {
                  //   backgroundColor = 'transparent';
                  // }
                  // left side
                  for (let i = 0; i < Math.min(thickness - 1, K - rowIndex - 1); i++) {
                    if (colIndex + rowIndex + 3 + i * 2 === totalEmptyCells) {
                      isVisible = true;
                      backgroundColor = defaultColor;
                    }
                  }

                  // right side
                  for (let i = 0; i < Math.min(thickness - 1, K - rowIndex - 1); i++) {
                    if (colIndex - rowIndex - 2 === totalEmptyCells + topWidth + i * 2) {
                      isVisible = true;
                      backgroundColor = defaultColor;
                    }
                  }

                  // two squares left side
                  if (rowIndex === K - 1 && (colIndex === totalEmptyCells - thickness - K - 2 || colIndex === totalEmptyCells - thickness - K - 1)) {
                    isVisible = true;
                    borderStyle = 'dashed';
                    backgroundColor = 'transparent';
                  }
                  // two squares right side
                  if (rowIndex === K - 1 && (colIndex === totalEmptyCells + topWidth + thickness + K || colIndex === totalEmptyCells + topWidth + thickness + K + 1)) {
                    isVisible = true;
                    borderStyle = 'dashed';
                    backgroundColor = 'transparent';
                  }

                  return (
                    <View
                      key={colIndex}
                      style={[
                        styles.cell,
                        { 
                          width: cellSize, 
                          height: cellSize,
                          opacity: isVisible ? 1 : 0,
                          backgroundColor,
                          borderStyle,
                        },
                      ]}
                    />
                  );
                })}
              </View>
            ))}

            {/* Two columns by the sides */}
            {Array.from({ length: Sa }).map((_, rowIndex) => {
              return (
                <View 
                  key={`rostok-${rowIndex}`} 
                  style={styles.row}
                >
                  {Array.from({ length: maxNodes }).map((_, colIndex) => {
                    // Adjust the visibility logic to show only two squares, one on each side
                    let isVisible = colIndex + K >= totalEmptyCells - thickness && colIndex + K + 1 <= totalEmptyCells || colIndex >= totalEmptyCells + topWidth + K && colIndex <= totalEmptyCells + topWidth + K - 1 + thickness;

                    let backgroundColor = defaultColor;
                    let borderStyle = 'solid';

                    // if (colIndex === totalEmptyCells - K - 1 || colIndex === totalEmptyCells + topWidth + K) {
                    //   backgroundColor = 'transparent';
                    // }
                    if (colIndex === totalEmptyCells - thickness - K - 1 || colIndex === totalEmptyCells - thickness - K - 2 || colIndex === totalEmptyCells + topWidth + K + thickness || colIndex === totalEmptyCells + topWidth + K + thickness + 1) {
                      borderStyle = 'dashed';
                      isVisible = true;
                      backgroundColor = 'transparent';
                    }

                    return (
                      <View
                        key={colIndex}
                        style={[
                          styles.cell,
                          { 
                            width: cellSize, 
                            height: cellSize,
                            // opacity: isVisible ? 1 : 0,
                            backgroundColor: isVisible ? backgroundColor : 'transparent',
                            borderWidth: isVisible ? 1 : 0,
                            borderStyle,
                          },
                        ]}
                      >
                        {rowIndex === 0 && colIndex === totalEmptyCells - K + 2 && <Text style={styles.KText}>{K}</Text>}
                        {rowIndex === 0 && colIndex === totalEmptyCells - K + Math.round(topWidth / 2) && <Text style={styles.topWidthText}>{SFrontO}</Text>}
                        {rowIndex === 0 && colIndex === totalEmptyCells + topWidth - K + 1 && <Text style={styles.KText}>{K}</Text>}
                        {rowIndex === Math.round(Sa/2) - 1 && colIndex === totalEmptyCells - K + 2 && <Text style={styles.sideText}>{Sa}</Text>}
                        {rowIndex === Math.round(Sa/2) - 1 && colIndex === totalEmptyCells - K + Math.round(topWidth / 2) - 1 && <Text style={styles.middleText}>{SO}</Text>}                        
                        {rowIndex === Math.round(Sa/2) - 1 && colIndex === totalEmptyCells + topWidth - K + 1 && <Text style={styles.sideText}>{Sa}</Text>}
                        {rowIndex === Sa - 1 && colIndex === totalEmptyCells - K + 2 && <Text style={styles.KText}>{K}</Text>}
                        {rowIndex === Sa - 1 && colIndex === totalEmptyCells - K + Math.round(topWidth / 2) && <Text style={styles.topWidthText}>{SFrontO}</Text>}
                        {rowIndex === Sa - 1 && colIndex === totalEmptyCells + topWidth - K + 1 && <Text style={styles.KText}>{K}</Text>}
                      </View>
                    );
                  })}
                </View>
              );
            })}
            {/* Bottom angle rows with length K */}
            {Array.from({ length: K }).map((_, rowIndex) => (
              <View 
                key={`row-${rowIndex}`} 
                style={styles.row}
              >
                {Array.from({ length: maxNodes }).map((_, colIndex) => {
                  // Adjust the visibility logic based on rowIndex
                  let isVisible = colIndex - rowIndex + K === totalEmptyCells || colIndex === totalEmptyCells + topWidth - rowIndex + K - 1;

                  let backgroundColor = defaultColor;
                  let borderStyle = 'solid';
                  // if (colIndex - rowIndex + K === totalEmptyCells || colIndex === totalEmptyCells + topWidth - rowIndex + K - 1) {
                  //   backgroundColor = 'transparent';
                  // }
                  // left side
                  for (let i = 0; i < Math.min(rowIndex, thickness - 1); i++) {
                    if (colIndex - rowIndex + K + 2 + i * 2 === totalEmptyCells) {
                      isVisible = true;
                    }
                  }

                  // right side
                  for (let i = 0; i < Math.min(rowIndex, thickness - 1); i++) {
                    if (colIndex + rowIndex - K - 1 - i * 2 === totalEmptyCells + topWidth) {
                      isVisible = true;
                    }
                  }

                  // two squares left side
                  if (rowIndex === 0 && (colIndex === totalEmptyCells - thickness - K - 2 || colIndex === totalEmptyCells - thickness - K - 1)) {
                    isVisible = true;
                    borderStyle = 'dashed';
                    backgroundColor = 'transparent';
                  }
                  // two squares right side
                  if (rowIndex === 0 && (colIndex === totalEmptyCells + topWidth + thickness + K || colIndex === totalEmptyCells + topWidth + thickness + K + 1)) {
                    isVisible = true;
                    borderStyle = 'dashed';
                    backgroundColor = 'transparent';
                  }

                  return (
                    <View
                      key={colIndex}
                      style={[
                        styles.cell,
                        { 
                          width: cellSize, 
                          height: cellSize,
                          opacity: isVisible ? 1 : 0,
                          backgroundColor,
                          borderStyle,
                        },
                      ]}
                    />
                  );
                })}
              </View>
            ))}
            {/* Last row */}
            {Array.from({ length: thickness }).map((_, rowIndex) => (
              <View 
                key={`row-${rowIndex}`} 
                style={styles.row}
            >
              {Array.from({ length: maxNodes }).map((_, colIndex) => {
                let isVisible = colIndex >= totalEmptyCells && colIndex < totalEmptyCells + topWidth;

                let backgroundColor = defaultColor;
                let borderStyle = 'solid';
                // if (rowIndex === 0) {
                //   backgroundColor = 'transparent';
                // }
                // rest of left side
                for (let i = 0; i < Math.min(K, thickness - rowIndex); i++) {
                  if (colIndex + rowIndex + 2 + i * 2 === totalEmptyCells) {
                    isVisible = true;
                    backgroundColor = 'transparent';
                    borderStyle = 'dashed';
                  }
                }
                // left side
                for (let i = 0; i < Math.min(K, thickness - rowIndex - 1); i++) {
                  if (colIndex + rowIndex + 2 + i * 2 === totalEmptyCells) {
                    isVisible = true;
                    backgroundColor = defaultColor;
                    borderStyle = 'solid';
                  }
                }

                // rest of right side
                for (let i = 0; i < Math.min(K, thickness - rowIndex); i++) {
                  if (colIndex - rowIndex - 1 - i * 2 === totalEmptyCells + topWidth) {
                    isVisible = true;
                    backgroundColor = 'transparent';
                    borderStyle = 'dashed';
                  }
                }

                // right side
                for (let i = 0; i < Math.min(K, thickness - rowIndex - 1); i++) {
                  if (colIndex - rowIndex - 1 - i * 2 === totalEmptyCells + topWidth) {
                    isVisible = true;
                    backgroundColor = defaultColor;
                    borderStyle = 'solid';
                  }
                }

                return (
                  <View
                    key={colIndex}
                    style={[
                      styles.cell,
                      { 
                        width: cellSize, 
                        height: cellSize,
                        opacity: isVisible ? 1 : 0,
                        backgroundColor,
                        borderStyle,
                      },
                    ]}
                    />
                  );
                })}
              </View>
            ))}
            {Array.from({ length: NHFront }).map((_, rowIndex) => {
              let currentWidth = topWidth + 2;
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
                    const isRectangle = colIndex >= ((maxNodes - topWidth) / 2) && colIndex < ((maxNodes - topWidth) / 2 + topWidth);
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
  largeCenterText: {
    position: 'absolute',
    fontSize: 24,
    color: 'black',
    zIndex: 1,
  },
  centerText: {
    position: 'absolute',
    fontSize: 16,
    color: 'black',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  cornerText: {
    position: 'absolute',
    fontSize: 14,
    color: 'black',
  },
  edgeText: {
    position: 'absolute',
    fontSize: 14,
    color: 'black',
  },
  KText: {
    position: 'absolute',
    fontSize: 10,
    color: 'black',
    zIndex: 1,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    width: 10,
    height: 10,
  },
  sideText: {
    position: 'absolute',
    fontSize: 12,
    color: 'black',
    zIndex: 1,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    width: 16,
    height: 16,
  },
  topWidthText:{
    position: 'absolute',
    fontSize: 12,
    color: 'black',
    zIndex: 1,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    width: 16,
    height: 16,
  },
  middleText: {
    position: 'absolute',
    fontSize: 20,
    color: 'black',
    zIndex: 1,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    width: 35,
    height: 24,
  }
});

export default RibbingScreen; 
import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Text, Button, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import raglanState from '@/state/raglanState';
import Slider from '@react-native-community/slider';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import introState from '@/state/introState';
import {useFocusEffect} from 'expo-router';
import {useRouter} from 'expo-router';
import {screenHeight, screenWidth} from '@/utils/Layout';
import { Ionicons } from '@expo/vector-icons';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import raglanVisualizationState from '@/state/raglanVisualizationState';

const RibbinScreen = observer(() => {
  const { highlightedRows, lastRowHighlight, currentSection } = raglanVisualizationState;
  const { SFrontO, Sfx, NHFront, usedIncreaseType, PR_1x2_f, PR_1x4_f, prib_1x2_f, prib_1x3_f, NRostok, SKfront, SPodr, Sa, NRrez, Sgor } = introState;
  const router = useRouter();

  const [pribMode, setPribMode] = useState(usedIncreaseType[0]);
  const [cellSize, setCellSize] = useState(0);
  //const [distributionMode, setDistributionMode] = useState('sequential');

  // const [currentNodes, setCurrentNodes] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  // const [refreshing, setRefreshing] = useState(false);

  const [isInitializing, setIsInitializing] = useState(true);

  const K = 2;
  const topWidth = SFrontO; // нижняя резинка + толщина резинки
  const bottomWidth = SFrontO + 2 * Sfx;
  const maxNodes = Math.max(topWidth, bottomWidth);
  const thickness = NRrez;
  const insets = useSafeAreaInsets();
  const frontTopWidth = topWidth + 2;

  // useEffect(() => {
  //   raglanVisualizationState.setLastRowHighlight(maxNodes);
  // }, [maxNodes]);

  useEffect(() => {
    raglanVisualizationState.loadPersistedState();
  }, []);

  useEffect(() => {
    if (maxNodes > 0) {
      const newCellSize = Math.min(screenWidth, screenHeight) / maxNodes * 2;
      setCellSize(newCellSize);
      setIsInitializing(false);
    }
  }, [maxNodes, screenWidth, screenHeight]);

  const adjustCellSize = (delta) => {
    setIsLoading(true);
    
    // Откладываем изменение размера ячейки на следующий тик
    setTimeout(() => {
      setCellSize(prevSize => Math.max(5, prevSize + delta));
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsLoading(false);
        });
      });
    }, 0);
  };

  useFocusEffect(() => {
    if (introState.styleChosen) {
      // onRefresh();
    }
  });

  // Убедимся, что loading overlay отрисовывается поверх всего контента
  useLayoutEffect(() => {
    if (isLoading) {
      // Форсируем перерисовку
      requestAnimationFrame(() => {});
    }
  }, [isLoading]);

  // const toggleDistributionMode = () => {
  //   setDistributionMode(prevMode => (prevMode === 'sequential' ? 'even' : 'sequential'));
  // };

  const calculateAdditionalSquares = useMemo(() => {
    const calculations = Array(NHFront).fill(0).map((_, rowIndex) => {
      let additionalSquares = 0;
      if (pribMode === '1x2, 1x4') {
        if (rowIndex < PR_1x2_f * 2) {
          additionalSquares = Math.floor(rowIndex / 2);
        } else if (rowIndex < PR_1x2_f * 2 + PR_1x4_f * 4) {
          additionalSquares = PR_1x2_f + Math.floor((rowIndex - PR_1x2_f * 2) / 4);
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
  }, [pribMode, PR_1x2_f, PR_1x4_f, prib_1x2_f, prib_1x3_f, NHFront]);

  console.log('currentSection', currentSection);
  console.log('highlightedRows', highlightedRows);

  const highlightNextRow = () => {
    if (currentSection === 'elastic') {
      if (highlightedRows >= thickness) {
        raglanVisualizationState.setCurrentSection('front');
        raglanVisualizationState.setHighlightedRows(1);
      } else {
        raglanVisualizationState.setHighlightedRows(highlightedRows + 1);
      }
    } else {
      raglanVisualizationState.setHighlightedRows(Math.min(highlightedRows + 1, NHFront));
    }
  };

  const highlightPreviousRow = () => {
    if (currentSection === 'front') {
      if (highlightedRows <= 1) {
        raglanVisualizationState.setCurrentSection('elastic');
        raglanVisualizationState.setHighlightedRows(thickness);
      } else {
        raglanVisualizationState.setHighlightedRows(Math.max(highlightedRows - 1, 0));
      }
    } else {
      raglanVisualizationState.setHighlightedRows(Math.max(highlightedRows - 1, 0));
    }
  };

  // const increaseNodes = () => {
  //   setCurrentNodes(prev => Math.min(prev + 1, maxNodes));
  // };

  // const decreaseNodes = () => {
  //   setCurrentNodes(prev => Math.max(prev - 1, 0));
  // };



  const totalEmptyCells = (maxNodes - topWidth) / 2;
  const defaultColor = 'red';

  // const onRefresh = React.useCallback(() => {
  //   setRefreshing(true);
  //   // Reset states here
  //   setHighlightedRows(0);
  //   setLastRowHighlight(0);
  //   setCurrentNodes(0);
  //   setPribMode(usedIncreaseType[0]);
  //   setCellSize(Math.min(screenWidth, screenHeight) / maxNodes * 2);
    
  //   // Simulate a delay
  //   setTimeout(() => {
  //     setRefreshing(false);
  //   }, 1000);
  // }, [screenWidth, screenHeight, maxNodes, usedIncreaseType]);

  const tabBarHeight = useBottomTabBarHeight();

  const BottomBar = () => {
    let currentWidth = 0;
    let leftIncrease = 0;
    let rightIncrease = 0;
    if (currentSection === 'elastic') {
      currentWidth = topWidth;
      leftIncrease = 0;
      rightIncrease = 0;
    } else {
      currentWidth = frontTopWidth + 2 * calculateAdditionalSquares[highlightedRows - 1];
      leftIncrease = calculateAdditionalSquares[highlightedRows - 1] + 1 || 0;
      rightIncrease = calculateAdditionalSquares[highlightedRows - 1] + 1 || 0;
    }


    return (
      <View style={[styles.bottomBar, {paddingBottom: tabBarHeight + 100}]}>
        <View style={styles.bottomBarContent}>
          <View style={styles.navigationButtons}>
            <TouchableOpacity 
              onPress={highlightNextRow}
              style={styles.navButton}
            >
              <Ionicons name="chevron-up" size={24} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={highlightPreviousRow}
              style={styles.navButton}
            >
              <Ionicons name="chevron-down" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.rowInfo}>
            <Text style={styles.rowInfoText}>{leftIncrease}</Text>
            <Text style={styles.rowInfoText}>{currentWidth}</Text>
            <Text style={styles.rowInfoText}>{rightIncrease}</Text>
          </View>
        </View>
      </View>
    );
  };

  // If SFrontO is 0 (empty), show placeholder
  if (!introState.styleChosen) {
    return (
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>Пожалуйста, сначала выберите фасон</Text>
        <TouchableOpacity 
          style={styles.placeholderButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.placeholderButtonText}>Выбрать фасон</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isInitializing || cellSize === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }



  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        contentContainerStyle={[styles.container]}
      >
        {/* <Text style={styles.infoText}>Текущий режим: {distributionMode === 'sequential' ? 'Последовательный' : 'Равномерный'}</Text>
        <Text style={styles.infoText}>Трапеция: верхняя грань {SFrontO}, нижняя грань {bottomWidth}</Text>
        <Text style={styles.infoText}>Количество рядов: {NHFront}</Text> */}
        {/* <View style={styles.buttonContainer}>
          <Button title="Меньше" onPress={() => adjustCellSize(-1)} />
          <Button title="Больше" onPress={() => adjustCellSize(1)} />
        </View> */}
        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Button title="highlight next" onPress={highlightNextRow} />
          <Button title="highlight previous" onPress={highlightPreviousRow} />
        </View> */}
        <View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              key={'desc2'}
              style={[
                styles.cell,
                { 
                  width: cellSize, 
                  height: cellSize,
                  opacity: 1,
                  backgroundColor: 'red',
                  marginRight: 10,
                  
                },
              ]}
            />
            <Text>Резинка</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              key={'desc2'}
              style={[
                styles.cell,
                { 
                  width: cellSize, 
                  height: cellSize,
                  opacity: 1,
                  marginRight: 10,
                },
              ]}
            />
            <Text>Перед</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              key={'desc1'}
              style={[
                styles.cell,
                { 
                  width: cellSize, 
                  height: cellSize,
                  opacity: 1,
                  borderStyle: 'dashed',
                  marginRight: 10,
                },
              ]}
            />
            <Text>Остальные детали</Text>
          </View>
        </View>


        <ScrollView 
          horizontal 
          contentContainerStyle={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}
        >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 200}}>
            <View style={styles.grid}>
              {/* продолжение верхней стороны резинки выделенное пунктиром, так как мы его тут не показываем, он будет на другом экране */}
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

              {/* верхняя сторона резинки */}
              {Array.from({ length: thickness }).map((_, rowIndex) => (
                <View 
                  key={`row-${rowIndex}`} 
                  style={styles.row}
                >
                  {Array.from({ length: maxNodes }).map((_, colIndex) => {
                    let isVisible = colIndex >= totalEmptyCells && colIndex < totalEmptyCells + topWidth;
                    let backgroundColor = defaultColor;
                    let borderStyle = 'solid';
                    
                    const isLastHighlighted = (
                      currentSection === 'elastic' &&
                      highlightedRows > 0 && 
                      highlightedRows <= thickness && 
                      rowIndex === thickness - highlightedRows
                    );
                    

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
                            backgroundColor: isLastHighlighted ? 'purple' : backgroundColor,
                            borderStyle: borderStyle as 'solid' | 'dotted' | 'dashed',
                            justifyContent: 'center',
                            alignItems: 'center',
                          },
                        ]}
                      >
                        { colIndex === totalEmptyCells + 3 && (
                          <Text style={{ color: 'white', fontSize: 8 }}>{thickness - rowIndex}</Text>
                        )}
                        { colIndex === totalEmptyCells - 2 && rowIndex === 0 && (
                          <Text style={{ color: 'black', fontSize: 8 }}>{thickness - rowIndex}</Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              ))}

              {/* верхние углы резинки */}
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
                            backgroundColor: 'transparent',
                            borderStyle: borderStyle as 'solid' | 'dotted' | 'dashed',
                          },
                        ]}
                      >{/*добавка для поворота квадратов*/ }
                        {isVisible && (
                          <View style={[
                            styles.halfCell,
                            {
                              width: cellSize,
                              height: cellSize,
                              backgroundColor,
                              transform: [{ rotate: '45deg' }],
                            }
                          ]} />
                        )}


                      </View>
                    );
                  })}
                </View>
              ))}

              {/* боковые стороны резинки */}
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
                              borderStyle: 'solid',
                            },
                          ]}
                        >
                          {rowIndex === 0 && colIndex === totalEmptyCells - K + 2 && <Text style={styles.KText}>{K}</Text>}
                          {rowIndex === 0 && colIndex === totalEmptyCells - K + Math.round(topWidth / 2) && <Text style={styles.topWidthText}>{SFrontO}</Text>}
                          {rowIndex === 0 && colIndex === totalEmptyCells + topWidth - K + 1 && <Text style={styles.KText}>{K}</Text>}
                          {rowIndex === Math.round(Sa/2) - 1 && colIndex === totalEmptyCells - K + 2 && <Text style={styles.sideText}>{Sa}</Text>}
                          {rowIndex === Math.round(Sa/2) - 1 && colIndex === totalEmptyCells - K + Math.round(topWidth / 2) - 1 && <Text style={styles.middleText}>{Sgor}</Text>}                        
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
              {/* нижние углы резинки*/}
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
                            borderStyle: borderStyle as 'solid' | 'dotted' | 'dashed',
                          },
                        ]}
                      />
                    );
                  })}
                </View>
              ))}
              {/* нижняя сторона резинки */}
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
                    const isLastHighlighted = currentSection === 'elastic' && (rowIndex === highlightedRows - 1 && colIndex < lastRowHighlight)

                    return (
                      <View
                        key={colIndex}
                        style={[
                          styles.cell,
                          { 
                            width: cellSize, 
                            height: cellSize,
                            opacity: isVisible ? 1 : 0,
                            backgroundColor: isLastHighlighted ? 'purple' : backgroundColor,
                            borderStyle: borderStyle as 'solid' | 'dotted' | 'dashed',
                          },
                        ]}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      </ScrollView>
      <BottomBar />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="black" />
        </View>
      )}
    </View>
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
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  placeholderButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  placeholderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    // paddingBottom: insets.bottom || 20,
  },
  bottomBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  navButton: {
    padding: 10,
  },
  rowInfo: {
    flexDirection: 'row',
    gap: 20,
  },
  rowInfoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    minWidth: 30,
    textAlign: 'center',
  },
  halfCell: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: 'transparent',
  },
});

export default RibbinScreen; 
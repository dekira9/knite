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

const BackScreen = observer(() => {
  const { highlightedRows, lastRowHighlight, currentSection } = raglanVisualizationState;
  const { SFrontO, Sfx, NHFront, usedIncreaseType, PR_1X2_f, prib_1x4_f, prib_1x2_f, prib_1x3_f, NRostok, SKfront, SPodr, Sa, NRrez, Sgor } = introState;
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Button title="highlight next" onPress={highlightNextRow} />
          <Button title="highlight previous" onPress={highlightPreviousRow} />
        </View>
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
              {/* Front */}
              {Array.from({ length: NHFront }).map((_, rowIndex) => {
                let currentWidth = frontTopWidth;
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
                      const isLastHighlighted = (
                        currentSection === 'front' && 
                        rowIndex === highlightedRows - 1 && 
                        colIndex < lastRowHighlight
                      );
                      
                      return (
                        <View
                          key={colIndex}
                          style={[
                            styles.cell,
                            { 
                              width: cellSize, 
                              height: cellSize,
                              opacity: isVisible ? 1 : 0,
                              backgroundColor: (isLastHighlighted ? 'purple' : (isRectangle ? '#D3D3D3' : 'transparent')),
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
});

export default BackScreen; 
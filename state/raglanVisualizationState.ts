import { types } from "mobx-state-tree";
import AsyncStorage from '@react-native-async-storage/async-storage';

const RaglanVisualizationState = types
  .model({
    highlightedRows: types.optional(types.number, 0),
    lastRowHighlight: types.optional(types.number, 0),
    currentSection: types.optional(types.string, 'elastic'),
  })
  .actions((self) => ({
    setHighlightedRows(rows: number) {
      self.highlightedRows = rows;
      this.persistState();
    },
    setLastRowHighlight(highlight: number) {
      self.lastRowHighlight = highlight;
      this.persistState();
    },
    setCurrentSection(section: string) {
      self.currentSection = section;
      this.persistState();
    },
    async persistState() {
      try {
        await AsyncStorage.setItem('raglanVisualizationState', JSON.stringify({
          highlightedRows: self.highlightedRows,
          lastRowHighlight: self.lastRowHighlight,
          currentSection: self.currentSection,
        }));
      } catch (error) {
        console.error('Failed to save raglan visualization state:', error);
      }
    },
    setPersistedState(state: {
      highlightedRows: number;
      lastRowHighlight: number;
      currentSection: string;
    }) {
      self.highlightedRows = state.highlightedRows;
      self.lastRowHighlight = state.lastRowHighlight;
      self.currentSection = state.currentSection;
    },
    async loadPersistedState() {
      try {
        const state = await AsyncStorage.getItem('raglanVisualizationState');
        if (state) {
          const parsedState = JSON.parse(state);
          this.setPersistedState(parsedState);
        }
      } catch (error) {
        console.error('Failed to load raglan visualization state:', error);
      }
    }
  }));

const raglanVisualizationState = RaglanVisualizationState.create();
export default raglanVisualizationState; 
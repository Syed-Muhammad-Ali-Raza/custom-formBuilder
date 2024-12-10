// slices/layoutSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rows: [],
  draggedItem: null,
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setDraggedItem(state, action) {
      state.draggedItem = action.payload;
    },
    addRow(state, action) {
      state.rows.push(action.payload);
    },
    addField(state, action) {
      const { rowIndex, columnIndex, field } = action.payload;
      state.rows[rowIndex].columns[columnIndex].fields.push(field);
    },
    updateField(state, action) {
      const { rowIndex, columnIndex, fieldIndex, key, value } = action.payload;
      const field = state.rows[rowIndex].columns[columnIndex].fields[fieldIndex];
      if (typeof value === 'function') {
        field[key] = value(field[key]);
      } else {
        field[key] = value;
      }
    },
    removeField(state, action) {
      const { rowIndex, columnIndex, fieldIndex } = action.payload;
      state.rows[rowIndex].columns[columnIndex].fields.splice(fieldIndex, 1);
    },
    addOption(state, action) {
      const { rowIndex, columnIndex, fieldIndex } = action.payload;
      state.rows[rowIndex].columns[columnIndex].fields[fieldIndex].options.push(`New Option ${state.rows[rowIndex].columns[columnIndex].fields[fieldIndex].options.length + 1}`);
    },
    removeOption(state, action) {
      const { rowIndex, columnIndex, fieldIndex, optionIndex } = action.payload;
      state.rows[rowIndex].columns[columnIndex].fields[fieldIndex].options.splice(optionIndex, 1);
    },
  },
});

export const {
  setDraggedItem,
  addRow,
  addField,
  updateField,
  removeField,
  addOption,
  removeOption,
} = layoutSlice.actions;

export default layoutSlice.reducer;

// store.js
import { configureStore } from '@reduxjs/toolkit';
import layoutReducer from './FormSlice'
const store = configureStore({
  reducer: {
    layout: layoutReducer ,
  },
});

export default store;

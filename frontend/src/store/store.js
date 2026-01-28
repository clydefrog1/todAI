import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import taskReducer from './slices/taskSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    tasks: taskReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

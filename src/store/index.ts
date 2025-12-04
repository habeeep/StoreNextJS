import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

const isDevelopment = process.env.NODE_ENV === 'development';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: isDevelopment,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
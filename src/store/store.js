import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import symptomSlice from './slices/symptomSlice';
import aiSlice from './slices/aiSlice';
import communitySlice from './slices/communitySlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    symptoms: symptomSlice,
    ai: aiSlice,
    community: communitySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
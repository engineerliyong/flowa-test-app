import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      // API call would go here
      return profileData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCycleSettings = createAsyncThunk(
  'user/updateCycleSettings',
  async (cycleData, { rejectWithValue }) => {
    try {
      // API call would go here
      return cycleData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  profile: {
    name: '',
    age: null,
    cycleLength: 28,
    periodLength: 5,
    lastPeriodDate: null,
    notifications: {
      periodReminder: true,
      ovulationReminder: true,
      dailyCheckin: true,
    },
    preferences: {
      theme: 'light',
      language: 'en',
      units: 'metric',
    },
  },
  gamification: {
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    level: 1,
    achievements: [],
    dailyGoals: {
      symptomTracking: false,
      dailyCheckin: false,
      communityEngagement: false,
    },
  },
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    updateNotificationSettings: (state, action) => {
      state.profile.notifications = { ...state.profile.notifications, ...action.payload };
    },
    updatePreferences: (state, action) => {
      state.profile.preferences = { ...state.profile.preferences, ...action.payload };
    },
    addPoints: (state, action) => {
      state.gamification.totalPoints += action.payload;
      // Calculate level based on points (every 100 points = 1 level)
      state.gamification.level = Math.floor(state.gamification.totalPoints / 100) + 1;
    },
    updateStreak: (state, action) => {
      state.gamification.currentStreak = action.payload;
      if (action.payload > state.gamification.longestStreak) {
        state.gamification.longestStreak = action.payload;
      }
    },
    addAchievement: (state, action) => {
      if (!state.gamification.achievements.includes(action.payload)) {
        state.gamification.achievements.push(action.payload);
      }
    },
    updateDailyGoals: (state, action) => {
      state.gamification.dailyGoals = { ...state.gamification.dailyGoals, ...action.payload };
    },
    resetDailyGoals: (state) => {
      state.gamification.dailyGoals = {
        symptomTracking: false,
        dailyCheckin: false,
        communityEngagement: false,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update cycle settings
      .addCase(updateCycleSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCycleSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateCycleSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setUserProfile,
  updateNotificationSettings,
  updatePreferences,
  addPoints,
  updateStreak,
  addAchievement,
  updateDailyGoals,
  resetDailyGoals,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
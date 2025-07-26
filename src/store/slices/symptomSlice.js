import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { symptomService } from '../../services/api/symptomService';

// Async thunks
export const saveSymptomData = createAsyncThunk(
  'symptoms/saveSymptomData',
  async (symptomData, { rejectWithValue }) => {
    try {
      const response = await symptomService.saveSymptom(symptomData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSymptomHistory = createAsyncThunk(
  'symptoms/fetchHistory',
  async (dateRange, { rejectWithValue }) => {
    try {
      const response = await symptomService.getSymptomHistory(dateRange);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentCycle: {
    startDate: null,
    expectedEndDate: null,
    currentDay: 0,
    phase: 'menstrual', // menstrual, follicular, ovulation, luteal
  },
  todaySymptoms: {
    flow: null, // null, light, medium, heavy
    mood: null, // 1-5 scale
    energy: null, // 1-5 scale
    pain: null, // 1-5 scale
    sleep: null, // 1-5 scale
    symptoms: [], // array of symptom IDs
    notes: '',
    loggedAt: null,
  },
  symptomHistory: [],
  availableSymptoms: [
    { id: 'cramps', name: 'Cramps', category: 'pain' },
    { id: 'headache', name: 'Headache', category: 'pain' },
    { id: 'backache', name: 'Back Pain', category: 'pain' },
    { id: 'bloating', name: 'Bloating', category: 'physical' },
    { id: 'breast_tenderness', name: 'Breast Tenderness', category: 'physical' },
    { id: 'nausea', name: 'Nausea', category: 'physical' },
    { id: 'fatigue', name: 'Fatigue', category: 'physical' },
    { id: 'acne', name: 'Acne', category: 'physical' },
    { id: 'cravings', name: 'Food Cravings', category: 'emotional' },
    { id: 'irritability', name: 'Irritability', category: 'emotional' },
    { id: 'anxiety', name: 'Anxiety', category: 'emotional' },
    { id: 'mood_swings', name: 'Mood Swings', category: 'emotional' },
  ],
  insights: {
    patterns: [],
    predictions: {
      nextPeriod: null,
      ovulation: null,
      pms: null,
    },
    trends: {
      averageCycleLength: 28,
      averagePeriodLength: 5,
      commonSymptoms: [],
    },
  },
  isLoading: false,
  error: null,
};

const symptomSlice = createSlice({
  name: 'symptoms',
  initialState,
  reducers: {
    updateTodaySymptoms: (state, action) => {
      state.todaySymptoms = { ...state.todaySymptoms, ...action.payload };
    },
    setFlow: (state, action) => {
      state.todaySymptoms.flow = action.payload;
    },
    setMood: (state, action) => {
      state.todaySymptoms.mood = action.payload;
    },
    setEnergy: (state, action) => {
      state.todaySymptoms.energy = action.payload;
    },
    setPain: (state, action) => {
      state.todaySymptoms.pain = action.payload;
    },
    setSleep: (state, action) => {
      state.todaySymptoms.sleep = action.payload;
    },
    toggleSymptom: (state, action) => {
      const symptomId = action.payload;
      const symptoms = state.todaySymptoms.symptoms;
      const index = symptoms.indexOf(symptomId);
      
      if (index > -1) {
        symptoms.splice(index, 1);
      } else {
        symptoms.push(symptomId);
      }
    },
    setNotes: (state, action) => {
      state.todaySymptoms.notes = action.payload;
    },
    updateCurrentCycle: (state, action) => {
      state.currentCycle = { ...state.currentCycle, ...action.payload };
    },
    startNewCycle: (state, action) => {
      const startDate = action.payload;
      state.currentCycle = {
        startDate,
        expectedEndDate: new Date(startDate.getTime() + (28 * 24 * 60 * 60 * 1000)), // 28 days later
        currentDay: 1,
        phase: 'menstrual',
      };
    },
    updateInsights: (state, action) => {
      state.insights = { ...state.insights, ...action.payload };
    },
    clearTodaySymptoms: (state) => {
      state.todaySymptoms = {
        flow: null,
        mood: null,
        energy: null,
        pain: null,
        sleep: null,
        symptoms: [],
        notes: '',
        loggedAt: null,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Save symptom data
      .addCase(saveSymptomData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveSymptomData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todaySymptoms.loggedAt = new Date().toISOString();
        // Add to history
        state.symptomHistory.unshift({
          date: new Date().toISOString().split('T')[0],
          ...state.todaySymptoms,
        });
      })
      .addCase(saveSymptomData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch symptom history
      .addCase(fetchSymptomHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSymptomHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.symptomHistory = action.payload;
      })
      .addCase(fetchSymptomHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  updateTodaySymptoms,
  setFlow,
  setMood,
  setEnergy,
  setPain,
  setSleep,
  toggleSymptom,
  setNotes,
  updateCurrentCycle,
  startNewCycle,
  updateInsights,
  clearTodaySymptoms,
  clearError,
} = symptomSlice.actions;

export default symptomSlice.reducer;
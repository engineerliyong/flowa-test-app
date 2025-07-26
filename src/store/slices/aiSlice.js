import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aiService } from '../../services/api/aiService';

// Async thunks
export const generatePersonalizedTip = createAsyncThunk(
  'ai/generateTip',
  async (context, { rejectWithValue }) => {
    try {
      const response = await aiService.generateTip(context);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const startAIConversation = createAsyncThunk(
  'ai/startConversation',
  async (message, { rejectWithValue }) => {
    try {
      const response = await aiService.sendMessage(message);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const continueAIConversation = createAsyncThunk(
  'ai/continueConversation',
  async ({ message, conversationId }, { rejectWithValue }) => {
    try {
      const response = await aiService.continueConversation(message, conversationId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  dailyTips: {
    selfCare: null,
    work: null,
    motivation: null,
    lastGenerated: null,
  },
  aiListener: {
    isActive: false,
    currentConversation: null,
    conversationHistory: [],
    isListening: false,
  },
  personalizedInsights: {
    cyclePatterns: [],
    recommendations: [],
    predictions: {
      mood: null,
      symptoms: [],
      energy: null,
    },
  },
  flowPackages: {
    current: null,
    history: [],
    recommendations: [],
  },
  isLoading: false,
  error: null,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setDailyTip: (state, action) => {
      const { type, tip } = action.payload;
      state.dailyTips[type] = tip;
      state.dailyTips.lastGenerated = new Date().toISOString();
    },
    startListening: (state) => {
      state.aiListener.isListening = true;
      state.aiListener.isActive = true;
    },
    stopListening: (state) => {
      state.aiListener.isListening = false;
    },
    endAISession: (state) => {
      state.aiListener.isActive = false;
      state.aiListener.isListening = false;
      if (state.aiListener.currentConversation) {
        state.aiListener.conversationHistory.push(state.aiListener.currentConversation);
        state.aiListener.currentConversation = null;
      }
    },
    addMessageToConversation: (state, action) => {
      const { message, sender, timestamp } = action.payload;
      if (!state.aiListener.currentConversation) {
        state.aiListener.currentConversation = {
          id: Date.now().toString(),
          startTime: timestamp,
          messages: [],
        };
      }
      state.aiListener.currentConversation.messages.push({
        message,
        sender, // 'user' or 'ai'
        timestamp,
      });
    },
    updatePersonalizedInsights: (state, action) => {
      state.personalizedInsights = { ...state.personalizedInsights, ...action.payload };
    },
    setCurrentFlowPackage: (state, action) => {
      state.flowPackages.current = action.payload;
    },
    addFlowPackageToHistory: (state, action) => {
      if (state.flowPackages.current) {
        state.flowPackages.history.unshift({
          ...state.flowPackages.current,
          completedAt: new Date().toISOString(),
        });
        state.flowPackages.current = null;
      }
    },
    updateFlowPackageRecommendations: (state, action) => {
      state.flowPackages.recommendations = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate personalized tip
      .addCase(generatePersonalizedTip.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generatePersonalizedTip.fulfilled, (state, action) => {
        state.isLoading = false;
        const { type, tip } = action.payload;
        state.dailyTips[type] = tip;
        state.dailyTips.lastGenerated = new Date().toISOString();
      })
      .addCase(generatePersonalizedTip.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Start AI conversation
      .addCase(startAIConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startAIConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        const { response, conversationId } = action.payload;
        
        if (!state.aiListener.currentConversation) {
          state.aiListener.currentConversation = {
            id: conversationId,
            startTime: new Date().toISOString(),
            messages: [],
          };
        }
        
        state.aiListener.currentConversation.messages.push({
          message: response,
          sender: 'ai',
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(startAIConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Continue AI conversation
      .addCase(continueAIConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(continueAIConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        const { response } = action.payload;
        
        if (state.aiListener.currentConversation) {
          state.aiListener.currentConversation.messages.push({
            message: response,
            sender: 'ai',
            timestamp: new Date().toISOString(),
          });
        }
      })
      .addCase(continueAIConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setDailyTip,
  startListening,
  stopListening,
  endAISession,
  addMessageToConversation,
  updatePersonalizedInsights,
  setCurrentFlowPackage,
  addFlowPackageToHistory,
  updateFlowPackageRecommendations,
  clearError,
} = aiSlice.actions;

export default aiSlice.reducer;
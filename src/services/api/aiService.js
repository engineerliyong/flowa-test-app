// src/services/ai/aiService.js
import { apiClient } from '../api/apiClient';

/**
 * AI Service for handling AI-powered features
 * Including AI listener, personalized tips, and chatbot functionality
 */

export const aiService = {
  // AI Listener Chat
  async sendMessage(message, conversationId = null, context = 'general') {
    try {
      const response = await apiClient.post('/ai/chat', {
        message,
        conversationId,
        context,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send message to AI');
    }
  },

  async createConversation(type = 'support') {
    try {
      const response = await apiClient.post('/ai/conversations', {
        type,
        startedAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create conversation');
    }
  },

  async getConversationHistory(conversationId, page = 1) {
    try {
      const response = await apiClient.get(`/ai/conversations/${conversationId}/messages?page=${page}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch conversation history');
    }
  },

  async endConversation(conversationId) {
    try {
      const response = await apiClient.patch(`/ai/conversations/${conversationId}`, {
        status: 'ended',
        endedAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to end conversation');
    }
  },

  // Personalized Tips and Insights
  async getPersonalizedTips(userContext) {
    try {
      const response = await apiClient.post('/ai/personalized-tips', {
        cyclePhase: userContext.cyclePhase,
        symptoms: userContext.symptoms,
        mood: userContext.mood,
        preferences: userContext.preferences,
        historyDays: userContext.historyDays || 30
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get personalized tips');
    }
  },

  async generateDailyInsight(userData) {
    try {
      const response = await apiClient.post('/ai/daily-insight', {
        cycleData: userData.cycleData,
        symptomHistory: userData.symptomHistory,
        moodHistory: userData.moodHistory,
        currentDate: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate daily insight');
    }
  },

  async getPredictiveInsights(timeframe = '7d') {
    try {
      const response = await apiClient.get(`/ai/predictive-insights?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get predictive insights');
    }
  },

  // Mood and Symptom Analysis
  async analyzeMoodPatterns(moodData, cycleData) {
    try {
      const response = await apiClient.post('/ai/analyze-mood', {
        moodData,
        cycleData,
        analysisType: 'pattern_recognition'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to analyze mood patterns');
    }
  },

  async analyzeSymptoms(symptomData) {
    try {
      const response = await apiClient.post('/ai/analyze-symptoms', {
        symptoms: symptomData,
        analysisDepth: 'comprehensive'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to analyze symptoms');
    }
  },

  // Content Generation
  async generateWorkTip(userProfile, currentSymptoms) {
    try {
      const response = await apiClient.post('/ai/generate-tip', {
        type: 'work_productivity',
        userProfile,
        currentSymptoms,
        context: 'workplace'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate work tip');
    }
  },

  async generateSelfCareTip(moodState, cyclePhase) {
    try {
      const response = await apiClient.post('/ai/generate-tip', {
        type: 'self_care',
        moodState,
        cyclePhase,
        context: 'personal_wellness'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate self-care tip');
    }
  },

  async generateMotivationalMessage(userContext) {
    try {
      const response = await apiClient.post('/ai/generate-motivation', {
        userContext,
        messageType: 'encouragement',
        tone: 'supportive'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate motivational message');
    }
  },

  // Cycle Predictions
  async predictNextPeriod(cycleHistory) {
    try {
      const response = await apiClient.post('/ai/predict-period', {
        cycleHistory,
        predictionWindow: 90 // days
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to predict next period');
    }
  },

  async predictFertileWindow(cycleData) {
    try {
      const response = await apiClient.post('/ai/predict-fertility', {
        cycleData,
        includeConfidenceLevel: true
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to predict fertile window');
    }
  },

  // Health Recommendations
  async getHealthRecommendations(userProfile, recentData) {
    try {
      const response = await apiClient.post('/ai/health-recommendations', {
        userProfile,
        recentSymptoms: recentData.symptoms,
        recentMoods: recentData.moods,
        cyclePhase: recentData.cyclePhase
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get health recommendations');
    }
  },

  async checkSymptomConcerns(symptoms) {
    try {
      const response = await apiClient.post('/ai/symptom-check', {
        symptoms,
        urgencyLevel: 'standard'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check symptom concerns');
    }
  },

  // Conversation Management
  async rateFeedback(conversationId, rating, feedback = null) {
    try {
      const response = await apiClient.post(`/ai/conversations/${conversationId}/feedback`, {
        rating,
        feedback,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit feedback');
    }
  },

  async reportIssue(conversationId, issue) {
    try {
      const response = await apiClient.post(`/ai/conversations/${conversationId}/report`, {
        issue,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to report issue');
    }
  }
};

// Local AI utilities for offline functionality
export const localAIUtils = {
  // Simple pattern matching for basic responses
  generateOfflineResponse(message) {
    const responses = {
      greeting: [
        "Hello! I'm here to listen and support you.",
        "Hi there! How are you feeling today?",
        "Welcome! What's on your mind?"
      ],
      pain: [
        "I understand you're experiencing discomfort. Pain during your cycle is common, but it's important to listen to your body.",
        "Physical pain can be really challenging. Have you tried any comfort measures that usually help you?",
        "I hear that you're in pain. Remember that your feelings about this are completely valid."
      ],
      mood: [
        "Mood changes are a normal part of the menstrual cycle due to hormonal fluctuations.",
        "It's completely understandable to have emotional ups and downs. You're not alone in this.",
        "Your emotions are valid. Hormonal changes can really affect how we feel."
      ],
      support: [
        "I'm here to listen without judgment. Your feelings and experiences matter.",
        "Thank you for sharing with me. It takes courage to express these feelings.",
        "You're doing great by reaching out. What kind of support would be most helpful right now?"
      ],
      default: [
        "I hear you. Can you tell me more about what you're experiencing?",
        "That sounds important. How are you taking care of yourself through this?",
        "Thank you for sharing that with me. What would help you feel supported right now?"
      ]
    };

    // Simple keyword matching
    const lowerMessage = message.toLowerCase();
    let category = 'default';

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      category = 'greeting';
    } else if (lowerMessage.includes('pain') || lowerMessage.includes('hurt') || lowerMessage.includes('cramp')) {
      category = 'pain';
    } else if (lowerMessage.includes('mood') || lowerMessage.includes('sad') || lowerMessage.includes('anxious') || lowerMessage.includes('emotional')) {
      category = 'mood';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('listen')) {
      category = 'support';
    }

    const categoryResponses = responses[category];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  },

  // Generate basic tips based on cycle phase
  getBasicTip(cyclePhase) {
    const tips = {
      menstrual: [
        "During your period, focus on gentle self-care. Warm baths and light stretching can help with cramps.",
        "It's normal to feel more tired during menstruation. Listen to your body and rest when you need to.",
        "Stay hydrated and consider iron-rich foods to support your body during your period."
      ],
      follicular: [
        "This is often a great time for starting new projects as energy levels typically increase.",
        "Your body is preparing for ovulation. This might be a good time for more intensive workouts.",
        "Many people feel more social and energetic during the follicular phase."
      ],
      ovulation: [
        "You might notice increased energy and confidence around ovulation.",
        "This is typically when fertility is highest if you're tracking for conception.",
        "Some people experience mild pain or spotting during ovulation, which is normal."
      ],
      luteal: [
        "The luteal phase can bring PMS symptoms. Be extra gentle with yourself.",
        "You might crave certain foods - try to balance treats with nutritious options.",
        "If you experience mood changes, remember they're temporary and hormone-related."
      ]
    };

    const phaseSpecificTips = tips[cyclePhase] || tips.menstrual;
    return phaseSpecificTips[Math.floor(Math.random() * phaseSpecificTips.length)];
  }
};
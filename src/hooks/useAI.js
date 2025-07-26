// src/hooks/useAI.js
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { aiService, localAIUtils } from '../services/api/aiService';
import NetInfo from '@react-native-community/netinfo';

export const useAI = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [conversations, setConversations] = useState({});
  const [currentConversation, setCurrentConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = useSelector(state => state.auth.user);
  const cycleData = useSelector(state => state.user.cycleData);

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });

    return unsubscribe;
  }, []);

  // Create a new AI conversation
  const createConversation = useCallback(async (type = 'support') => {
    setIsLoading(true);
    setError(null);

    try {
      if (isOnline) {
        const conversation = await aiService.createConversation(type);
        setCurrentConversation(conversation);
        setConversations(prev => ({
          ...prev,
          [conversation.id]: conversation
        }));
        return conversation;
      } else {
        // Create local conversation for offline use
        const localConversation = {
          id: `local_${Date.now()}`,
          type,
          messages: [],
          startedAt: new Date().toISOString(),
          isLocal: true
        };
        setCurrentConversation(localConversation);
        return localConversation;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isOnline]);

  // Send message to AI
  const sendMessage = useCallback(async (message, conversationId = null) => {
    if (!message.trim()) return null;

    setIsLoading(true);
    setError(null);

    const targetConversationId = conversationId || currentConversation?.id;

    try {
      if (isOnline && !conversations[targetConversationId]?.isLocal) {
        // Online AI response
        const response = await aiService.sendMessage(message, targetConversationId, 'community_support');
        
        // Update conversation with new messages
        setConversations(prev => ({
          ...prev,
          [targetConversationId]: {
            ...prev[targetConversationId],
            messages: [
              ...(prev[targetConversationId]?.messages || []),
              {
                id: Date.now(),
                type: 'user',
                content: message,
                timestamp: new Date()
              },
              {
                id: Date.now() + 1,
                type: 'ai',
                content: response.message,
                timestamp: new Date()
              }
            ]
          }
        }));

        return response;
      } else {
        // Offline response using local AI
        const aiResponse = localAIUtils.generateOfflineResponse(message);
        
        const userMessage = {
          id: Date.now(),
          type: 'user',
          content: message,
          timestamp: new Date()
        };

        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: aiResponse,
          timestamp: new Date()
        };

        // Update local conversation
        setConversations(prev => ({
          ...prev,
          [targetConversationId]: {
            ...prev[targetConversationId],
            messages: [
              ...(prev[targetConversationId]?.messages || []),
              userMessage,
              aiMessage
            ]
          }
        }));

        return { message: aiResponse, isLocal: true };
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, currentConversation, conversations]);

  // Get personalized tips
  const getPersonalizedTips = useCallback(async (context = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isOnline) {
        const userContext = {
          cyclePhase: cycleData?.currentPhase,
          symptoms: context.symptoms || [],
          mood: context.mood,
          preferences: user?.preferences,
          ...context
        };

        const tips = await aiService.getPersonalizedTips(userContext);
        return tips;
      } else {
        // Generate basic offline tips
        const basicTip = localAIUtils.getBasicTip(cycleData?.currentPhase || 'menstrual');
        return {
          tips: [{ content: basicTip, type: 'general' }],
          isLocal: true
        };
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, cycleData, user]);

  // Generate daily insight
  const getDailyInsight = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (isOnline) {
        const userData = {
          cycleData,
          symptomHistory: user?.symptomHistory || [],
          moodHistory: user?.moodHistory || []
        };

        const insight = await aiService.generateDailyInsight(userData);
        return insight;
      } else {
        // Basic offline insight
        return {
          insight: "Focus on listening to your body today and practicing gentle self-care.",
          isLocal: true
        };
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, cycleData, user]);

  // Analyze mood patterns
  const analyzeMoodPatterns = useCallback(async (moodData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isOnline) {
        const analysis = await aiService.analyzeMoodPatterns(moodData, cycleData);
        return analysis;
      } else {
        return {
          patterns: ["Mood tracking data is limited in offline mode"],
          isLocal: true
        };
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, cycleData]);

  // Get work productivity tip
  const getWorkTip = useCallback(async (currentSymptoms = []) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isOnline) {
        const tip = await aiService.generateWorkTip(user?.profile, currentSymptoms);
        return tip;
      } else {
        const offlineTips = [
          "Take regular breaks to stretch and move around, especially if you're experiencing cramps or discomfort.",
          "Consider using a heating pad or hot water bottle at your desk if you're dealing with period pain.",
          "Stay hydrated and keep healthy snacks nearby to maintain energy levels throughout the day.",
          "If you're feeling fatigued, try to tackle your most important tasks during your peak energy hours."
        ];
        return {
          tip: offlineTips[Math.floor(Math.random() * offlineTips.length)],
          isLocal: true
        };
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, user]);

  // Get self-care tip
  const getSelfCareTip = useCallback(async (moodState, cyclePhase) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isOnline) {
        const tip = await aiService.generateSelfCareTip(moodState, cyclePhase);
        return tip;
      } else {
        const tip = localAIUtils.getBasicTip(cyclePhase || 'menstrual');
        return { tip, isLocal: true };
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isOnline]);

  // End conversation
  const endConversation = useCallback(async (conversationId) => {
    try {
      if (isOnline && !conversations[conversationId]?.isLocal) {
        await aiService.endConversation(conversationId);
      }
      
      // Remove from local state
      setConversations(prev => {
        const newConversations = { ...prev };
        delete newConversations[conversationId];
        return newConversations;
      });

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [isOnline, conversations, currentConversation]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isOnline,
    conversations,
    currentConversation,
    isLoading,
    error,

    // Actions
    createConversation,
    sendMessage,
    getPersonalizedTips,
    getDailyInsight,
    analyzeMoodPatterns,
    getWorkTip,
    getSelfCareTip,
    endConversation,
    clearError,

    // Utilities
    setCurrentConversation
  };
};
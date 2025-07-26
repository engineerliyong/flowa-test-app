// app/(community)/ai-listener.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../src/styles/globalStyles';
import { colors } from '../../src/styles/colors';

export default function AIListenerScreen() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm here to listen to you. This is a safe, judgment-free space where you can share your thoughts and feelings. What's on your mind today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();

  const aiResponses = [
    "I hear you, and what you're feeling is completely valid. Many people experience similar emotions during their cycle.",
    "Thank you for sharing that with me. It takes courage to express these feelings. How are you taking care of yourself right now?",
    "That sounds really challenging. Remember that you're not alone in this experience. What usually helps you feel better?",
    "I understand this is difficult for you. Your feelings matter, and it's okay to have these moments. What would make you feel supported right now?",
    "It's completely normal to feel this way. Your body and mind are going through a lot. Have you tried any self-care activities today?",
    "I'm glad you felt comfortable sharing this with me. Sometimes just expressing our thoughts can be healing. How can I support you further?",
  ];

  const generateAIResponse = (userMessage) => {
    // Simple keyword-based responses (in a real app, this would use actual AI)
    const keywords = {
      pain: "I understand you're experiencing physical discomfort. Pain during your cycle is common but shouldn't be ignored. Have you tried heat therapy or gentle stretching?",
      mood: "Mood changes during your cycle are completely normal due to hormonal fluctuations. You're not alone in feeling this way.",
      work: "Balancing work responsibilities with how you're feeling can be really challenging. It's important to be gentle with yourself.",
      tired: "Fatigue is such a common part of the menstrual experience. Your body is working hard right now. Rest when you can.",
      anxious: "Anxiety can often increase during certain parts of your cycle. These feelings are temporary and valid. Deep breathing might help.",
      sad: "It's okay to feel sad. Hormonal changes can really affect our emotions. This feeling will pass, and you're stronger than you know.",
    };

    const lowerMessage = userMessage.toLowerCase();
    for (const [keyword, response] of Object.entries(keywords)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    // Default responses
    return aiResponses[Math.floor(Math.random() * aiResponses.length)];
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: generateAIResponse(userMessage.content),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const clearChat = () => {
    Alert.alert(
      "Clear Conversation",
      "Are you sure you want to clear this conversation? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: () => {
            setMessages([{
              id: 1,
              type: 'ai',
              content: "Hello! I'm here to listen to you. This is a safe, judgment-free space where you can share your thoughts and feelings. What's on your mind today?",
              timestamp: new Date()
            }]);
          }
        }
      ]
    );
  };

  useEffect(() => {
    // Auto-scroll to bottom when new message is added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const renderMessage = (message) => (
    <View key={message.id} style={[
      styles.messageContainer,
      message.type === 'user' ? styles.userMessage : styles.aiMessage
    ]}>
      <View style={[
        styles.messageBubble,
        { backgroundColor: message.type === 'user' ? colors.primary : colors.white }
      ]}>
        <Text style={[
          styles.messageText,
          { color: message.type === 'user' ? colors.white : colors.dark }
        ]}>
          {message.content}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={globalStyles.h6}>AI Listener</Text>
          <Text style={[globalStyles.caption, { color: colors.success }]}>
            • Online
          </Text>
        </View>
        
        <TouchableOpacity onPress={clearChat}>
          <Ionicons name="refresh" size={24} color={colors.gray} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
        
        {isTyping && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <View style={[styles.messageBubble, { backgroundColor: colors.white }]}>
              <View style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Privacy Notice */}
      <View style={styles.privacyNotice}>
        <Ionicons name="shield-checkmark" size={16} color={colors.success} />
        <Text style={styles.privacyText}>
          Your conversations are private and not stored
        </Text>
      </View>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor={colors.gray}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              { opacity: inputText.trim() ? 1 : 0.5 }
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isTyping}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={colors.white} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerCenter: {
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesContent: {
    padding: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginHorizontal: 2,
    opacity: 0.6,
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  privacyText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
};
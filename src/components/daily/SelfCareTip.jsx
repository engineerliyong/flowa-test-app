import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';

export const SelfCareTip = ({ 
  tip,
  style,
  expandable = true,
  initiallyExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [animation] = useState(new Animated.Value(initiallyExpanded ? 1 : 0));

  const selfCareTips = [
    {
      title: "Gentle Movement",
      content: "Try some light stretching or yoga poses. Your body will thank you for the gentle movement.",
      actionable: "Take 5 minutes to do some gentle neck and shoulder rolls",
      icon: "body",
      category: "Physical Wellness"
    },
    {
      title: "Mindful Breathing",
      content: "Take a moment to focus on your breath. Deep, slow breathing can help regulate your nervous system.",
      actionable: "Practice 4-7-8 breathing: inhale for 4, hold for 7, exhale for 8",
      icon: "leaf",
      category: "Mental Wellness"
    },
    {
      title: "Hydration Check",
      content: "Your body needs extra hydration during different cycle phases. Make sure you're drinking enough water.",
      actionable: "Drink a full glass of water right now and set a reminder for every 2 hours",
      icon: "water",
      category: "Physical Wellness"
    },
    {
      title: "Nourishing Snack",
      content: "Choose foods that support your energy levels and hormone balance.",
      actionable: "Try some nuts, dark chocolate, or fruits rich in antioxidants",
      icon: "nutrition",
      category: "Nutrition"
    },
    {
      title: "Rest & Restore",
      content: "Your body is doing incredible work. It's okay to slow down and rest when you need it.",
      actionable: "Set aside 10 minutes for meditation or simply lying down with your eyes closed",
      icon: "moon",
      category: "Rest"
    }
  ];

  const getTipContent = () => {
    if (tip && tip.content) {
      return tip;
    }
    
    // Return a random self-care tip as fallback
    const randomIndex = Math.floor(Math.random() * selfCareTips.length);
    return selfCareTips[randomIndex];
  };

  const toggleExpansion = () => {
    if (!expandable) return;
    
    const toValue = isExpanded ? 0 : 1;
    
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100], // Adjust based on content
  });

  const tipContent = getTipContent();

  return (
    <View style={[
      {
        backgroundColor: colors.selfCare || colors.primary,
        borderRadius: 12,
        marginVertical: 6,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      style
    ]}>
      <TouchableOpacity
        style={{ padding: 16 }}
        onPress={toggleExpansion}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 20,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12
          }}>
            <Ionicons 
              name={tipContent.icon || "heart-outline"} 
              size={20} 
              color={colors.white} 
            />
          </View>
          
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[
                globalStyles.caption,
                { 
                  color: colors.white,
                  opacity: 0.9,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }
              ]}>
                Self-Care Tip
              </Text>
              
              {expandable && (
                <Ionicons 
                  name={isExpanded ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={colors.white} 
                />
              )}
            </View>
            
            <Text style={[
              globalStyles.h6,
              { 
                color: colors.white,
                marginTop: 4
              }
            ]}>
              {tipContent.title}
            </Text>
            
            <Text style={[
              globalStyles.bodySmall,
              { 
                color: colors.white,
                opacity: 0.9,
                marginTop: 4
              }
            ]}>
              {tipContent.content}
            </Text>
          </View>
        </View>
        
        {tipContent.category && (
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 4,
            alignSelf: 'flex-start',
            marginTop: 8,
            marginLeft: 52,
          }}>
            <Text style={[
              globalStyles.caption,
              { 
                color: colors.white,
                fontWeight: '500'
              }
            ]}>
              {tipContent.category}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      
      {expandable && tipContent.actionable && (
        <Animated.View style={{
          height: isExpanded ? 'auto' : 0,
          opacity: animation,
        }}>
          <View style={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            borderTopWidth: 1,
            borderTopColor: 'rgba(255, 255, 255, 0.2)',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 12 }}>
              <Ionicons name="bulb" size={16} color={colors.white} style={{ marginRight: 8, marginTop: 2 }} />
              <Text style={[
                globalStyles.bodySmall,
                { 
                  color: colors.white,
                  opacity: 0.9,
                  flex: 1,
                  lineHeight: 20
                }
              ]}>
                <Text style={{ fontWeight: '600' }}>Try this: </Text>
                {tipContent.actionable}
              </Text>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};
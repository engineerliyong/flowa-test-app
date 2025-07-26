import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';

export const WorkTip = ({ 
  tip,
  style,
  expandable = true,
  initiallyExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [animation] = useState(new Animated.Value(initiallyExpanded ? 1 : 0));

  const workTips = [
    {
      title: "Energy Management",
      content: "Align your most challenging tasks with your high-energy phases and save routine work for lower-energy days.",
      actionable: "Schedule important meetings during your luteal phase when you're naturally more focused",
      icon: "flash",
      category: "Productivity",
      phase: "General"
    },
    {
      title: "Break Strategies",
      content: "Take more frequent, shorter breaks when you're feeling fatigued. Your brain needs rest to maintain focus.",
      actionable: "Try the 25/5 technique: 25 minutes work, 5 minutes break",
      icon: "pause-circle",
      category: "Focus",
      phase: "Menstrual"
    },
    {
      title: "Communication Tips",
      content: "Be clear about your needs and boundaries at work. Most colleagues appreciate honest communication.",
      actionable: "Use phrases like 'I work best with...' instead of apologizing for your needs",
      icon: "chatbubbles",
      category: "Communication",
      phase: "General"
    },
    {
      title: "Creative Planning",
      content: "Use your pre-ovulation energy surge for brainstorming and creative projects.",
      actionable: "Block calendar time for creative work during follicular phase",
      icon: "bulb",
      category: "Creativity",
      phase: "Follicular"
    },
    {
      title: "Detail-Oriented Tasks",
      content: "Your attention to detail peaks during certain phases. Use this for editing, reviewing, and organizing.",
      actionable: "Save proofreading and data analysis for your luteal phase",
      icon: "search",
      category: "Analysis",
      phase: "Luteal"
    },
    {
      title: "Networking & Presentations",
      content: "Social energy is typically highest around ovulation. Schedule important presentations and networking events accordingly.",
      actionable: "Plan client meetings and team presentations during ovulation week",
      icon: "people",
      category: "Social",
      phase: "Ovulation"
    }
  ];

  const getTipContent = () => {
    if (tip && tip.content) {
      return tip;
    }
    
    // Return a random work tip as fallback
    const randomIndex = Math.floor(Math.random() * workTips.length);
    return workTips[randomIndex];
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

  const tipContent = getTipContent();

  return (
    <View style={[
      {
        backgroundColor: colors.workTip || colors.accent,
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
              name={tipContent.icon || "briefcase-outline"} 
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
                Work & Productivity
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
        
        <View style={{ flexDirection: 'row', marginTop: 8, marginLeft: 52 }}>
          {tipContent.category && (
            <View style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
              marginRight: 8,
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
          
          {tipContent.phase && tipContent.phase !== 'General' && (
            <View style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}>
              <Text style={[
                globalStyles.caption,
                { 
                  color: colors.white,
                  fontWeight: '500'
                }
              ]}>
                {tipContent.phase} Phase
              </Text>
            </View>
          )}
        </View>
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
              <Ionicons name="checkmark-circle" size={16} color={colors.white} style={{ marginRight: 8, marginTop: 2 }} />
              <Text style={[
                globalStyles.bodySmall,
                { 
                  color: colors.white,
                  opacity: 0.9,
                  flex: 1,
                  lineHeight: 20
                }
              ]}>
                <Text style={{ fontWeight: '600' }}>Action step: </Text>
                {tipContent.actionable}
              </Text>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};